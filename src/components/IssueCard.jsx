import React from 'react';
import { 
  MessageSquare, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight,
  Star
} from 'lucide-react';

// GitHub language colors
const LANG_COLORS = {
  typescript: '#3178c6', javascript: '#f7df1e', python: '#3572A5', go: '#00ADD8',
  rust: '#dea584', 'c++': '#f34b7d', cpp: '#f34b7d', c: '#555555', java: '#b07219',
  kotlin: '#A97BFF', swift: '#F05138', ruby: '#701516', php: '#4F5D95', code: '#6366f1',
};

function ViabilityRing({ score, size = 36 }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? '#34d399' : score >= 75 ? '#818cf8' : '#fbbf24';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="viability-ring">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1e293b" strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[9px] font-bold text-white" style={{ transform: 'rotate(0deg)' }}>{score}</span>
    </div>
  );
}

export default function IssueCard({ issue, onSelect, isBookmarked, onToggleBookmark }) {
  const viabilityScore = issue.viabilityScore || 85;
  const isUnassigned = !issue.assignees || issue.assignees.length === 0;
  const langColor = LANG_COLORS[(issue.language || '').toLowerCase()] || '#6366f1';

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'recently';
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'today';
    if (diff === 1) return 'yesterday';
    if (diff < 30) return `${diff}d ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 sm:p-5 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-200 shadow-sm hover:shadow-glow-sm card-shine">
      
      <div>
        {/* Top row: repo info + bookmark */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-400 min-w-0">
            {/* User avatar */}
            {issue.user?.avatar_url && (
              <img 
                src={issue.user.avatar_url} 
                alt="" 
                className="w-5 h-5 rounded-full border border-slate-700 shrink-0"
                loading="lazy"
              />
            )}
            <span className="font-mono font-medium text-slate-300 hover:text-indigo-400 transition cursor-pointer truncate max-w-[140px]" onClick={() => onSelect(issue)}>
              {issue.repo_name}
            </span>
            
            {/* Language dot */}
            {issue.language && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/50">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
                {issue.language}
              </span>
            )}

            {/* Star count */}
            {issue.repo_stars && (
              <span className="flex items-center gap-0.5 text-[10px] text-amber-400/70">
                <Star className="w-2.5 h-2.5 fill-amber-400/60" />
                {issue.repo_stars >= 1000 ? `${(issue.repo_stars / 1000).toFixed(1)}k` : issue.repo_stars}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isUnassigned ? (
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-950/60 text-[9px] font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Open
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-950/50 text-[9px] text-amber-300 border border-amber-500/30">
                Taken
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(issue); }}
              className={`p-1 rounded-lg border transition ${
                isBookmarked ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' : 'text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-800'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelect(issue)}
          className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 cursor-pointer mb-2 leading-snug"
        >
          {issue.title}
        </h3>

        {/* Body preview */}
        <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {issue.body ? issue.body.replace(/[#*`_\[\]]/g, '').slice(0, 130) : 'No description provided.'}
        </p>

        {/* Labels */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(issue.labels || []).slice(0, 3).map((label, idx) => {
            const name = typeof label === 'string' ? label : label.name;
            const isGoodFirst = name.toLowerCase().includes('good first');
            return (
              <span key={idx} className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${
                isGoodFirst ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40 font-bold' : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
              }`}>
                {name}
              </span>
            );
          })}
          {(issue.labels || []).length > 3 && (
            <span className="text-[9px] text-slate-500 px-1">+{issue.labels.length - 3}</span>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="pt-2.5 border-t border-slate-800/60">
        <div className="flex items-center justify-between mb-2.5">
          {/* Viability ring + difficulty */}
          <div className="flex items-center gap-2">
            <ViabilityRing score={viabilityScore} size={32} />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-300">
                {issue.difficulty || 'Beginner'}
              </span>
              <span className="text-[9px] text-slate-500">
                {issue.estimatedTime || '1-2 hrs'}
              </span>
            </div>
          </div>

          {/* Meta counts */}
          <div className="flex items-center gap-2.5 text-slate-500 text-[10px]">
            <span className="flex items-center gap-0.5">
              <MessageSquare className="w-3 h-3" />
              {issue.comments || 0}
            </span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {timeAgo(issue.updated_at || issue.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onSelect(issue)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition"
          >
            Inspect <ChevronRight className="w-3 h-3" />
          </button>
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60 hover:bg-slate-700 hover:text-white transition"
          >
            GitHub <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
