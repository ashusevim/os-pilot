import React, { useState } from 'react';
import { 
  Terminal, 
  GitBranch, 
  GitPullRequest, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  HelpCircle, 
  ShieldAlert,
  Send,
  ExternalLink
} from 'lucide-react';

export default function ContributionPlaybook() {
  const [repoInput, setRepoInput] = useState('astral-sh/uv');
  const [username, setUsername] = useState('your-github-username');
  const [issueNumber, setIssueNumber] = useState('1042');
  const [issueSummary, setIssueSummary] = useState('dark-mode-toggle-docs');
  const [changeType, setChangeType] = useState('fix');
  const [prDescription, setPrDescription] = useState('Add support for dark mode toggle in the documentation portal navigation header.');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Normalize repo name
  const cleanRepo = repoInput.replace('https://github.com/', '').replace('.git', '').trim() || 'owner/repo';
  const repoSlug = cleanRepo.split('/')[1] || cleanRepo;
  const branchName = `${changeType}/issue-${issueNumber}-${issueSummary.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const gitSteps = [
    {
      step: 1,
      title: '1. Fork & Clone to your local machine',
      desc: 'Click "Fork" on GitHub, then clone your personal fork onto your workstation:',
      command: `git clone https://github.com/${username}/${repoSlug}.git\ncd ${repoSlug}`
    },
    {
      step: 2,
      title: '2. Add Upstream Remote to stay synchronized',
      desc: 'Never commit directly to your local main. Link upstream to pull ongoing updates:',
      command: `git remote add upstream https://github.com/${cleanRepo}.git\ngit fetch upstream`
    },
    {
      step: 3,
      title: '3. Create a clean feature branch from Upstream',
      desc: 'Branch directly off the latest upstream default branch (e.g. main/master):',
      command: `git checkout -b ${branchName} upstream/main`
    },
    {
      step: 4,
      title: '4. Stage & Commit using Conventional Commits',
      desc: 'Make your code changes, write unit tests, and commit with a clean summary:',
      command: `git add .\ngit commit -m "${changeType}: ${issueSummary.replace(/-/g, ' ')} (closes #${issueNumber})"`
    },
    {
      step: 5,
      title: '5. Sync upstream changes before opening PR (Rebase)',
      desc: 'If other commits landed on upstream/main while you were working, cleanly rebase:',
      command: `git fetch upstream\ngit rebase upstream/main`
    },
    {
      step: 6,
      title: '6. Push branch & Create Pull Request',
      desc: 'Push to your personal GitHub fork and click the generated link in your terminal:',
      command: `git push -u origin ${branchName}`
    }
  ];

  const generatedPRBody = `## 🎯 Summary of Changes
${prDescription}

Resolves #${issueNumber} in ${cleanRepo}.

## 🧪 Testing & Validation
- [x] Tested locally with unit/integration tests
- [x] Verified zero linting or formatting regressions
- [x] Verified build output passes without warnings

## 📋 Checklist
- [x] My code follows the repository's code style and guidelines
- [x] I have performed a self-review of my own code
- [x] Relevant documentation has been updated

## 🔗 Related Issues
Closes #${issueNumber}`;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCopyAll = () => {
    const all = gitSteps.map(s => `# ${s.title}\n${s.command}`).join('\n\n');
    navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <p className="mb-2 text-sm font-medium text-indigo-300">Git playbook</p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Commands for a clean first PR
        </h2>
        <p className="mt-2 text-[15px] text-zinc-400 max-w-xl">
          Fill in the repo and issue, then copy a fork → branch → commit → push workflow.
        </p>
      </div>

      {/* Input Configuration Panel */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-md space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Configure Your Target Contribution</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Target Repository (owner/repo)
            </label>
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="e.g. astral-sh/uv or full URL"
              className="field font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Your GitHub Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. octocat"
              className="field font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Issue Number
            </label>
            <input
              type="text"
              value={issueNumber}
              onChange={(e) => setIssueNumber(e.target.value)}
              placeholder="e.g. 1042"
              className="field font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Commit Type
            </label>
            <select
              value={changeType}
              onChange={(e) => setChangeType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="fix">fix (Bug fix)</option>
              <option value="feat">feat (New feature)</option>
              <option value="docs">docs (Documentation)</option>
              <option value="refactor">refactor (Code restructuring)</option>
              <option value="perf">perf (Performance)</option>
              <option value="test">test (Adding tests)</option>
              <option value="chore">chore (Build/Tooling)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Short Description / Branch Slug
          </label>
          <input
            type="text"
            value={issueSummary}
            onChange={(e) => setIssueSummary(e.target.value)}
            placeholder="e.g. dark-mode-toggle-docs"
            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Interactive Git Workflow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Step-by-Step Terminal Commands</span>
            </h3>
            <button
              onClick={handleCopyAll}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white text-xs font-medium transition"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied Full Script!' : 'Copy Script'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {gitSteps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">{step.title}</span>
                  <button
                    onClick={() => handleCopy(step.command, idx)}
                    className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white transition"
                  >
                    {copiedIndex === idx ? (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1">
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </span>
                    )}
                  </button>
                </div>
                <p className="text-xs text-zinc-400">{step.desc}</p>
                <pre className="p-3 rounded-xl bg-[#09090b] border border-zinc-800 text-cyan-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {step.command}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pull Request Generator & Etiquette */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <GitPullRequest className="w-4 h-4 text-purple-400" />
              <span>Standardized PR Template</span>
            </h3>
            <button
              onClick={() => handleCopy(generatedPRBody, 'pr')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-md shadow-purple-600/20"
            >
              {copiedIndex === 'pr' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 'pr' ? 'Copied PR!' : 'Copy PR Description'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Custom PR Summary (Edit live)
              </label>
              <textarea
                rows={3}
                value={prDescription}
                onChange={(e) => setPrDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Full Generated PR Body
              </label>
              <textarea
                readOnly
                rows={12}
                value={generatedPRBody}
                className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed focus:outline-none"
              />
            </div>
          </div>

          {/* Maintainer Golden Rules Callout */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>3 Golden Rules of PR Acceptance</span>
            </h4>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside leading-relaxed">
              <li><strong>Small & Atomic:</strong> Keep each PR focused on fixing one single issue. Avoid sneaking in formatting changes across unrelated files.</li>
              <li><strong>Write Unit Tests:</strong> A PR with passing unit tests is 10x more likely to be merged quickly by maintainers.</li>
              <li><strong>Explain "Why", Not Just "What":</strong> Describe why this approach was chosen and what edge cases were considered.</li>
            </ul>
          </div>

          {/* Common Mistakes Section */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-3">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Common First-Timer Mistakes to Avoid</span>
            </h4>
            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <span className="font-semibold text-rose-300">❌ Committing node_modules/ or .env files</span>
                <p className="text-zinc-400 mt-0.5">Always check <code className="text-indigo-300">.gitignore</code> before staging. Run <code className="text-cyan-300">git status</code> to verify tracked files.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <span className="font-semibold text-rose-300">❌ Force pushing to main/master</span>
                <p className="text-zinc-400 mt-0.5">Never <code className="text-cyan-300">git push --force</code> to the default branch. Only force-push to your feature branch with <code className="text-cyan-300">--force-with-lease</code>.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <span className="font-semibold text-rose-300">❌ Mixing squash + rebase in the same PR</span>
                <p className="text-zinc-400 mt-0.5">Pick one strategy. Most repos prefer squash-merge or rebase. Check <code className="text-indigo-300">CONTRIBUTING.md</code> for guidance.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <span className="font-semibold text-rose-300">❌ Opening a PR without reading CONTRIBUTING.md</span>
                <p className="text-zinc-400 mt-0.5">Many repos have specific branch naming, commit format, or CLA requirements. Read before coding.</p>
              </div>
            </div>
          </div>

          {/* Example Maintainer Review Comments */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-3">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Send className="w-4 h-4 text-indigo-400" />
              <span>How to Address Common Review Comments</span>
            </h4>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <p className="font-semibold text-indigo-200">"Can you add a test for this change?"</p>
                <p className="text-zinc-400 mt-1">→ Add a unit test that exercises the exact scenario your code changes. Copy an existing similar test and adapt it.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <p className="font-semibold text-indigo-200">"Please rebase on main"</p>
                <p className="text-zinc-400 mt-1">→ Run <code className="text-cyan-300">git fetch upstream && git rebase upstream/main && git push --force-with-lease</code></p>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <p className="font-semibold text-indigo-200">"This is out of scope for this PR"</p>
                <p className="text-zinc-400 mt-1">→ Acknowledge, revert the extra changes, and open a separate PR for the additional work.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
