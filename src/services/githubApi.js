import { CURATED_ISSUES } from './curatedData';

const GITHUB_API_BASE = 'https://api.github.com';

// ── In-memory query cache (2-min TTL) ──────────────────────────────
const queryCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000;

function getCached(key) {
  const entry = queryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    queryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  queryCache.set(key, { data, timestamp: Date.now() });
  // Evict old entries to prevent unbounded growth
  if (queryCache.size > 100) {
    const oldest = queryCache.keys().next().value;
    queryCache.delete(oldest);
  }
}

// ── Debounce utility ───────────────────────────────────────────────
let debounceTimer = null;
let activeAbortController = null;

/**
 * Calculates a Contributor Viability Score (0-100) based on issue signals
 */
export function calculateViabilityScore(issue) {
  let score = 70; // baseline

  const labels = (issue.labels || []).map(l => (typeof l === 'string' ? l : l.name).toLowerCase());
  const comments = issue.comments || 0;
  const assignees = issue.assignees || [];
  const body = issue.body || '';

  // Positive signals
  if (labels.some(l => l.includes('good first') || l.includes('beginner') || l.includes('first-timers') || l.includes('starter'))) {
    score += 15;
  }
  if (labels.some(l => l.includes('documentation') || l.includes('docs') || l.includes('typo'))) {
    score += 10;
  }
  if (labels.some(l => l.includes('help wanted') || l.includes('up-for-grabs'))) {
    score += 8;
  }

  // Clear guidance in body
  if (body.toLowerCase().includes('where to look') || body.toLowerCase().includes('steps to reproduce') || body.toLowerCase().includes('acceptance criteria')) {
    score += 8;
  }

  // Competition & Availability Penalties
  if (assignees.length > 0) {
    score -= 35; // likely already taken
  } else if (comments === 0) {
    score += 10; // totally unclaimed!
  } else if (comments <= 2) {
    score += 5; // very low competition
  } else if (comments > 6) {
    score -= 15; // high discussion/competition
  }

  return Math.max(15, Math.min(99, score));
}

/**
 * Derives difficulty badge and estimated time
 */
export function inferDifficulty(issue) {
  const labels = (issue.labels || []).map(l => (typeof l === 'string' ? l : l.name).toLowerCase());

  if (labels.some(l => l.includes('docs') || l.includes('typo') || l.includes('documentation'))) {
    return { level: 'Beginner', time: '30m - 1 hr', color: 'emerald' };
  }
  if (labels.some(l => l.includes('good first') || l.includes('starter') || l.includes('easy'))) {
    return { level: 'Beginner', time: '1 - 2 hrs', color: 'emerald' };
  }
  if (labels.some(l => l.includes('refactor') || l.includes('architecture') || l.includes('performance'))) {
    return { level: 'Advanced', time: '4 - 8 hrs', color: 'rose' };
  }
  return { level: 'Intermediate', time: '2 - 3 hrs', color: 'amber' };
}

/**
 * Searches GitHub issues using REST API with fallback to curated data.
 * Qualifiers (is:open, is:issue, archived:false, no:assignee) are added HERE
 * and should NOT be present in the incoming query string.
 */
export async function searchGitHubIssues({
  query = '',
  language = '',
  starRange = '',
  sort = 'updated-desc',
  page = 1,
  perPage = 15,
  token = null,
  onlyUnassigned = true
}) {
  // Cancel any in-flight request
  if (activeAbortController) {
    activeAbortController.abort();
  }
  activeAbortController = new AbortController();
  const { signal } = activeAbortController;

  // ── Build query (qualifiers live ONLY here) ────────────────────
  let qParts = ['is:open', 'is:issue', 'archived:false'];

  if (onlyUnassigned) {
    qParts.push('no:assignee');
  }
  if (language) {
    qParts.push(`language:${language}`);
  }
  if (starRange) {
    qParts.push(starRange);
  }

  // Strip any accidentally-included duplicate qualifiers from the user query
  let cleanQuery = (query || '').trim();
  ['is:open', 'is:issue', 'archived:false', 'state:open'].forEach(dup => {
    cleanQuery = cleanQuery.replace(new RegExp(dup.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '').trim();
  });

  if (cleanQuery) {
    qParts.push(cleanQuery);
  } else {
    qParts.push('label:"good first issue","help wanted"');
  }

  const finalQuery = qParts.join(' ').replace(/\s+/g, ' ').trim();

  // Parse sort
  let sortField = 'updated';
  let orderDir = 'desc';
  if (sort === 'created-desc') { sortField = 'created'; orderDir = 'desc'; }
  else if (sort === 'comments-asc') { sortField = 'comments'; orderDir = 'asc'; }
  else if (sort === 'comments-desc') { sortField = 'comments'; orderDir = 'desc'; }
  else if (sort === 'reactions-desc') { sortField = 'reactions'; orderDir = 'desc'; }

  const url = `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(finalQuery)}&sort=${sortField}&order=${orderDir}&page=${page}&per_page=${perPage}`;

  // ── Check cache ────────────────────────────────────────────────
  const cacheKey = `${url}|${token ? 'auth' : 'noauth'}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // ── Fetch ──────────────────────────────────────────────────────
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const maxRetries = 2;
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { headers, signal });

      const rateLimit = {
        limit: res.headers.get('x-ratelimit-limit'),
        remaining: res.headers.get('x-ratelimit-remaining'),
        reset: res.headers.get('x-ratelimit-reset'),
      };

      if (!res.ok) {
        if ((res.status === 403 || res.status === 429) && attempt < maxRetries) {
          // Exponential backoff: 1s, 3s
          const backoffMs = Math.pow(3, attempt) * 1000;
          await new Promise(r => setTimeout(r, backoffMs));
          lastError = `Rate limited (${res.status})`;
          continue;
        }
        if (res.status === 403 || res.status === 429) {
          return {
            issues: filterCurated(cleanQuery, language),
            totalCount: CURATED_ISSUES.length,
            rateLimit,
            isFallback: true,
            error: 'API rate limit exceeded. Showing curated issues. Add a GitHub PAT for 5,000 req/hr.'
          };
        }
        throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const enrichedIssues = (data.items || []).map(item => {
        const repoName = item.repository_url
          ? item.repository_url.replace(`${GITHUB_API_BASE}/repos/`, '')
          : 'unknown/repo';
        const viability = calculateViabilityScore(item);
        const diff = inferDifficulty(item);

        return {
          id: item.id,
          title: item.title,
          html_url: item.html_url,
          repository_url: item.repository_url,
          repo_name: repoName,
          language: language || extractLanguageFromLabels(item.labels),
          created_at: item.created_at,
          updated_at: item.updated_at,
          comments: item.comments,
          state: item.state,
          user: item.user,
          labels: item.labels,
          assignees: item.assignees || [],
          body: item.body || 'No description provided.',
          viabilityScore: viability,
          difficulty: diff.level,
          difficultyColor: diff.color,
          estimatedTime: diff.time,
          reactions: item.reactions ? item.reactions.total_count : 0
        };
      });

      const result = {
        issues: enrichedIssues,
        totalCount: data.total_count,
        rateLimit,
        isFallback: false
      };

      setCache(cacheKey, result);
      return result;

    } catch (err) {
      if (err.name === 'AbortError') {
        return { issues: [], totalCount: 0, rateLimit: null, isFallback: false, aborted: true };
      }
      lastError = err;
    }
  }

  // All retries exhausted
  console.warn('Live API request failed after retries, falling back to curated:', lastError);
  return {
    issues: filterCurated(cleanQuery, language),
    totalCount: CURATED_ISSUES.length,
    rateLimit: null,
    isFallback: true,
    error: lastError?.message || 'Network error'
  };
}

/**
 * Debounced wrapper — returns a promise that resolves after 400ms idle.
 */
export function searchGitHubIssuesDebounced(params) {
  return new Promise((resolve) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const result = await searchGitHubIssues(params);
      resolve(result);
    }, 400);
  });
}

/**
 * Fetch repository metadata (stars, forks, last push)
 */
export async function fetchRepoMetadata(repoName, token = null) {
  const cacheKey = `repo:${repoName}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `${GITHUB_API_BASE}/repos/${repoName}`;
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    const result = {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      description: data.description,
      pushed_at: data.pushed_at,
      open_issues: data.open_issues_count,
      has_contributing: true, // would need extra call to check
      license: data.license?.spdx_id || null,
      topics: data.topics || [],
    };
    setCache(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}

/**
 * Filter curated issues for offline/fallback mode
 */
function filterCurated(query, language) {
  let list = [...CURATED_ISSUES];
  if (language) {
    list = list.filter(i => i.language.toLowerCase() === language.toLowerCase());
  }
  if (query) {
    const qLower = query.toLowerCase();
    list = list.filter(i =>
      i.title.toLowerCase().includes(qLower) ||
      i.repo_name.toLowerCase().includes(qLower) ||
      i.body.toLowerCase().includes(qLower) ||
      i.labels.some(l => l.name.toLowerCase().includes(qLower))
    );
  }
  return list.length > 0 ? list : CURATED_ISSUES;
}

function extractLanguageFromLabels(labels = []) {
  const labelNames = labels.map(l => (typeof l === 'string' ? l : l.name).toLowerCase());
  if (labelNames.some(l => l.includes('typescript') || l.includes('ts'))) return 'TypeScript';
  if (labelNames.some(l => l.includes('python') || l.includes('py'))) return 'Python';
  if (labelNames.some(l => l.includes('rust'))) return 'Rust';
  if (labelNames.some(l => l.includes('golang') || l.includes('go'))) return 'Go';
  if (labelNames.some(l => l.includes('javascript') || l.includes('js'))) return 'JavaScript';
  return 'Code';
}

/**
 * Generates tailored Git Workflow steps for a specific issue
 */
export function generateGitWorkflow(issue, customBranchName = '') {
  const repoName = issue.repo_name || 'owner/repo';
  const issueNum = issue.html_url ? issue.html_url.split('/').pop() : '123';
  const slug = (issue.title || 'patch')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 30)
    .replace(/-+$/, '');

  const branch = customBranchName || `fix/issue-${issueNum}-${slug}`;

  return [
    {
      title: '1. Fork & Clone the Repository',
      desc: 'Create your personal fork on GitHub, then clone your fork locally to your machine.',
      command: `git clone https://github.com/YOUR_GITHUB_USERNAME/${repoName.split('/')[1] || 'repo'}.git\ncd ${repoName.split('/')[1] || 'repo'}`
    },
    {
      title: '2. Add Upstream Remote',
      desc: 'Link the original repository as upstream so you can easily sync incoming changes.',
      command: `git remote add upstream https://github.com/${repoName}.git\ngit fetch upstream`
    },
    {
      title: '3. Create a Dedicated Feature Branch',
      desc: 'Always work on a fresh branch branched off the latest upstream default branch.',
      command: `git checkout -b ${branch} upstream/main`
    },
    {
      title: '4. Stage & Commit with Conventional Commits',
      desc: 'Keep your commit message concise and descriptive following conventional commit standard.',
      command: `git add .\ngit commit -m "fix: ${issue.title ? issue.title.slice(0, 50) : 'resolve issue'} (closes #${issueNum})"`
    },
    {
      title: '5. Push & Open Pull Request',
      desc: 'Push your branch to your origin fork and click the generated link to open your PR.',
      command: `git push -u origin ${branch}`
    }
  ];
}

/**
 * Generates ready-to-copy Conventional Commit PR Description
 */
export function generatePRTemplate(issue) {
  const issueNum = issue.html_url ? issue.html_url.split('/').pop() : '123';
  const repo = issue.repo_name || 'repository';

  return `## Proposed Changes
Resolves #${issueNum} in ${repo}.

- [x] Investigated root cause and updated relevant implementation
- [x] Followed repository coding standards and style guide
- [x] Added / updated unit tests to verify behavior
- [x] Verified local build and test suites pass cleanly

## Types of Changes
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 📚 Documentation update / typo fix
- [ ] ⚡ Performance improvement / refactor

## Testing Steps
1. Checkout this branch locally.
2. Run \`npm test\` (or \`cargo test\` / \`pytest\` / \`go test ./...\`).
3. Verify test cases pass for issue #${issueNum}.

## Closes
Closes #${issueNum}`;
}
