import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ExternalLink, Bookmark, BookmarkCheck, Copy, Check, ShieldCheck,
  Clock, MessageSquare, User, Send, Terminal, GitPullRequest,
  Sparkles, Star, Scale
} from 'lucide-react';
import { generateGitWorkflow, generatePRTemplate, fetchRepoMetadata } from '../services/githubApi';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSafeBody(text) {
  if (!text) return 'No description provided.';
  return escapeHtml(text)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="p-3 my-2 rounded-lg bg-[#09090b] border border-zinc-800 text-cyan-300 font-mono text-xs overflow-x-auto">$2</pre>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-zinc-800 text-indigo-300 text-xs font-mono">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-zinc-200 font-semibold">$1</strong>')
    .replace(/^### (.+)$/gm, '<h4 class="text-xs font-bold text-cyan-300 mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="text-sm font-bold text-white mt-4 mb-1">$1</h3>')
    .replace(/^- (.+)$/gm, '<li class="ml-3 text-xs text-zinc-300 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-3 text-xs text-zinc-300 list-decimal">$1</li>')
    .replace(/\n/g, '<br/>');
}

export default function IssueDetailModal({ 
  issue, onClose, isBookmarked, onToggleBookmark, onAddToKanbanWithStatus, token
}) {
  const [activeSubTab, setActiveSubTab] = useState('triage');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [repoMeta, setRepoMeta] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    setActiveSubTab('triage');
    setRepoMeta(null);
    if (issue?.repo_name) {
      fetchRepoMetadata(issue.repo_name, token).then(meta => { if (meta) setRepoMeta(meta); });
    }
  }, [issue?.repo_name, issue?.id, token]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!issue) return null;

  const workflowSteps = generateGitWorkflow(issue);
  const prBody = generatePRTemplate(issue);
  const viabilityScore = issue.viabilityScore || 85;
  const isUnassigned = !issue.assignees || issue.assignees.length === 0;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(workflowSteps.map(s => s.command).join('\n\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const etiquetteComment = `Hi @${issue.user?.login || 'maintainer'}, I'd love to work on this issue!\n\nI investigated the problem and plan to:\n1. Locate the logic in the suggested files\n2. Implement the fix with corresponding unit tests\n3. Ensure all CI checks pass\n\nCould you please assign this to me? Thank you!`;

  const whyGood = issue.whyGood
    || (issue.viabilityReasons || []).slice(0, 2).join(' · ')
    || 'Great first contribution.';

  const subTabs = [
    { id: 'triage', label: 'Triage', icon: Sparkles },
    { id: 'workflow', label: 'Git Commands', icon: Terminal },
    { id: 'pr-template', label: 'PR Template', icon: GitPullRequest },
    { id: 'etiquette', label: 'Claim Comment', icon: Send },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md modal-backdrop" onClick={onClose}>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-modal-title"
        className="relative w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-[#131316] ring-1 ring-white/[0.08] shadow-2xl overflow-hidden modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-semibold border border-indigo-500/30 truncate max-w-[150px]">
              {issue.repo_name}
            </span>
            <span className="text-zinc-500 text-xs font-mono">#{issue.html_url?.split('/').pop()}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => onToggleBookmark(issue)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition ${
                isBookmarked ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}>
              {isBookmarked ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
            <a href={issue.html_url} target="_blank" rel="noopener noreferrer"
              className="btn-primary py-1.5 px-3 text-sm">
              Open on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button ref={closeRef} onClick={onClose} aria-label="Close issue details" className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="px-4 pt-3 pb-2 border-b border-zinc-800/60 shrink-0">
          <h2 id="issue-modal-title" className="text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">{issue.title}</h2>
          <div className="flex items-center flex-wrap gap-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{issue.user?.login || 'Maintainer'}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(issue.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{issue.comments || 0}</span>
            <span className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${
              viabilityScore >= 85 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>{viabilityScore}%</span>
          </div>
        </div>

        {/* Sub-tab Navigation — scrollable */}
        <div className="flex items-center px-4 border-b border-zinc-800 bg-zinc-950/40 gap-0.5 overflow-x-auto shrink-0 scroll-fade-x">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 px-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  activeSubTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}>
                <Icon className="w-3 h-3" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {activeSubTab === 'triage' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold mb-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Viability</div>
                  <div className="text-xl font-bold text-white mb-0.5">{viabilityScore} / 100</div>
                  <p className="text-xs text-zinc-400">{isUnassigned ? '✅ Unclaimed — open for you' : '⚠️ Has assignees'}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold mb-1.5"><Clock className="w-3.5 h-3.5" /> Effort</div>
                  <div className="text-base font-bold text-white mb-0.5">{issue.difficulty || 'Beginner'} • {issue.estimatedTime || '1-2 hrs'}</div>
                  <p className="text-xs text-zinc-400">{whyGood}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col justify-between">
                  {repoMeta && (
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400" />{(repoMeta.stars || 0).toLocaleString()}</span>
                      {repoMeta.license && <span className="flex items-center gap-0.5"><Scale className="w-3 h-3" />{repoMeta.license}</span>}
                    </div>
                  )}
                  <button onClick={() => { onAddToKanbanWithStatus(issue, 'in_progress'); onClose(); }}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20">
                    Start Working 🚀
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(issue.labels || []).map((label, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium">
                    {typeof label === 'string' ? label : label.name}
                  </span>
                ))}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Description</h4>
                <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 text-zinc-300 text-xs leading-relaxed max-h-72 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: renderSafeBody(issue.body) }} />
              </div>
            </div>
          )}

          {activeSubTab === 'workflow' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Git Workflow</h4>
                <button onClick={handleCopyAll}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white text-xs font-medium transition">
                  {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedAll ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">{step.title}</span>
                    <button onClick={() => handleCopy(step.command, idx)} className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-0.5">
                      {copiedIndex === idx ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400">{step.desc}</p>
                  <pre className="p-2.5 rounded-lg bg-[#09090b] border border-zinc-800/80 text-cyan-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">{step.command}</pre>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'pr-template' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Pull Request Description</h4>
                <button onClick={() => handleCopy(prBody, 'pr-body')}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/30">
                  {copiedIndex === 'pr-body' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  {copiedIndex === 'pr-body' ? 'Copied!' : 'Copy PR'}
                </button>
              </div>
              <textarea readOnly rows={12} value={prBody}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 focus:outline-none leading-relaxed" />
            </div>
          )}

          {activeSubTab === 'etiquette' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Issue Claim Comment</h4>
                <button onClick={() => handleCopy(etiquetteComment, 'etiquette')}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition">
                  {copiedIndex === 'etiquette' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  {copiedIndex === 'etiquette' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">{etiquetteComment}</pre>
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                💡 <strong>Tip:</strong> Always describe your planned approach. Maintainers prioritize contributors who show they've read the issue.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
