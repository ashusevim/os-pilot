import React from 'react';
import { MessageSquare, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff < 0 || diff === 0) return 'today';
  if (diff === 1) return '1d';
  if (diff < 30) return `${diff}d`;
  if (diff < 365) return `${Math.floor(diff / 30)}mo`;
  return `${Math.floor(diff / 365)}y`;
}

export default function IssueCard({ issue, onSelect, isBookmarked, onToggleBookmark }) {
  const comments = issue.comments || 0;

  return (
    <div className="flex items-stretch gap-3 px-3 sm:px-4 py-3 hover:bg-white/[0.04] transition">
      <a
        href={issue.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 flex-1"
      >
        <p className="font-mono text-xs text-indigo-300 truncate">{issue.repo_name}</p>
        <p className="mt-0.5 text-[15px] font-medium text-white leading-snug line-clamp-2 sm:line-clamp-1">
          {issue.title}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-300">
          {issue.language && <span>{issue.language}</span>}
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {comments} {comments === 1 ? 'comment' : 'comments'}
          </span>
          <span>{timeAgo(issue.updated_at || issue.created_at)}</span>
          {issue.difficulty && <span>{issue.difficulty}</span>}
        </p>
      </a>

      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onToggleBookmark(issue)}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Save issue'}
          aria-pressed={isBookmarked}
          className={`rounded-lg p-2 ${isBookmarked ? 'text-indigo-300 bg-indigo-500/15' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
        >
          {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
        <button
          type="button"
          onClick={() => onSelect(issue)}
          className="rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-200 hover:text-white hover:bg-white/10"
        >
          Guide
        </button>
        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Open
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
