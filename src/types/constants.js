export const PRESET_CHANNELS = [
  {
    id: 'good-first-issue',
    name: 'Good First Issues',
    icon: 'Sparkles',
    color: 'emerald',
    description: 'Beginner-friendly issues curated by maintainers for new contributors',
    query: 'label:"good first issue" comments:0..3',
    badge: 'Popular'
  },
  {
    id: 'docs',
    name: 'Documentation & Guides',
    icon: 'BookOpen',
    color: 'cyan',
    description: 'Fix typos, clarify tutorials, improve guides & write missing examples',
    query: 'label:documentation,docs,typo',
    badge: 'Fast Start'
  },
  {
    id: 'bug-fixes',
    name: 'Bug Fixes & Triage',
    icon: 'Bug',
    color: 'rose',
    description: 'Confirmed bugs ready for investigation, reproduction and code patches',
    query: 'label:bug,"confirmed bug","help wanted"',
    badge: 'High Impact'
  },
  {
    id: 'help-wanted',
    name: 'Help Wanted',
    icon: 'HeartHandshake',
    color: 'violet',
    description: 'Community-requested assistance on features, refactoring and optimizations',
    query: 'label:"help wanted"',
    badge: 'Welcoming'
  },
  {
    id: 'ai-ml',
    name: 'AI & LLM Tools',
    icon: 'Cpu',
    color: 'amber',
    description: 'Trending AI agents, vector databases, inference frameworks and LLM tools',
    query: 'topic:ai topic:machine-learning topic:llm label:"good first issue","help wanted"',
    badge: 'Trending'
  },
  {
    id: 'cli-devtools',
    name: 'CLI & DevTools',
    icon: 'Terminal',
    color: 'indigo',
    description: 'Developer productivity tools, compilers, formatters, and terminal utilities',
    query: 'topic:cli topic:developer-tools label:"good first issue"',
    badge: 'Core'
  }
];

export const PROGRAMMING_LANGUAGES = [
  { name: 'All Languages', value: '' },
  { name: 'TypeScript', value: 'typescript', color: '#3178c6' },
  { name: 'JavaScript', value: 'javascript', color: '#f7df1e' },
  { name: 'Python', value: 'python', color: '#3572A5' },
  { name: 'Go', value: 'go', color: '#00ADD8' },
  { name: 'Rust', value: 'rust', color: '#dea584' },
  { name: 'C++', value: 'cpp', color: '#f34b7d' },
  { name: 'C', value: 'c', color: '#555555' },
  { name: 'Java', value: 'java', color: '#b07219' },
  { name: 'Kotlin', value: 'kotlin', color: '#A97BFF' },
  { name: 'Swift', value: 'swift', color: '#F05138' },
  { name: 'Ruby', value: 'ruby', color: '#701516' },
  { name: 'PHP', value: 'php', color: '#4F5D95' },
];

export const STAR_RANGES = [
  { label: 'Any Stars', value: '' },
  { label: 'Mid-size repos (100–5k stars)', value: 'stars:100..5000', hint: 'Active maintainers, not drowning in PRs' },
  { label: 'Popular (1k - 10k)', value: 'stars:1000..10000', hint: 'Established projects & active reviews' },
  { label: 'Major Flagship (10k+)', value: 'stars:>10000', hint: 'Household open source libraries' },
  { label: 'Emerging (< 100)', value: 'stars:10..100', hint: 'Small passionate communities' },
];

export const SORT_OPTIONS = [
  { label: 'Most Recently Updated', value: 'updated-desc' },
  { label: 'Newest Issues First', value: 'created-desc' },
  { label: 'Fewest Comments (Unclaimed)', value: 'comments-asc' },
  { label: 'Most Active Discussion', value: 'comments-desc' },
  { label: 'Most Reactions 👍', value: 'reactions-desc' },
];

export const KANBAN_COLUMNS = [
  {
    id: 'bookmarked',
    title: 'Bookmarked',
    description: 'Issues you are interested in exploring',
    accentColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    headerBg: 'bg-blue-950/40 text-blue-300',
    icon: 'Bookmark'
  },
  {
    id: 'exploring',
    title: 'Exploring Codebase',
    description: 'Cloned repo & investigating implementation',
    accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    headerBg: 'bg-amber-950/40 text-amber-300',
    icon: 'Compass'
  },
  {
    id: 'in_progress',
    title: 'Writing Code',
    description: 'Active branch & local changes',
    accentColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
    headerBg: 'bg-indigo-950/40 text-indigo-300',
    icon: 'Code2'
  },
  {
    id: 'pr_submitted',
    title: 'PR Submitted',
    description: 'Pull request open & awaiting review',
    accentColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    headerBg: 'bg-purple-950/40 text-purple-300',
    icon: 'GitPullRequest'
  },
  {
    id: 'merged',
    title: 'Merged! 🏆',
    description: 'Contributions merged into upstream',
    accentColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    headerBg: 'bg-emerald-950/40 text-emerald-300',
    icon: 'CheckCircle2'
  }
];
