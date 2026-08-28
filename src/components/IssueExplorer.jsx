import React, { useState, useEffect, useRef } from 'react';
import { Search, RotateCcw, AlertTriangle, Key } from 'lucide-react';
import { PRESET_CHANNELS, PROGRAMMING_LANGUAGES, STAR_RANGES, SORT_OPTIONS } from '../types/constants';
import IssueCard from './IssueCard';
import Pagination from './Pagination';

const DEFAULT_QUERY = 'label:"good first issue" comments:0..3';

export default function IssueExplorer({
  issues, totalCount, loading, error, isFallback, rateLimit, searchParams,
  onUpdateParams, onRefresh, onSelectIssue, bookmarkedIssueIds, onToggleBookmark,
  hasToken, onOpenTokenModal
}) {
  const [searchInput, setSearchInput] = useState(
    PRESET_CHANNELS.some(ch => ch.query === searchParams.query) ? '' : (searchParams.query || '')
  );
  const searchRef = useRef(null);
  const activeChannelId = PRESET_CHANNELS.find(ch => ch.query === searchParams.query)?.id || '';

  useEffect(() => {
    const channel = PRESET_CHANNELS.find(ch => ch.query === searchParams.query);
    setSearchInput(channel ? '' : (searchParams.query || ''));
  }, [searchParams.query]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = searchInput.trim();
    const channel = PRESET_CHANNELS.find(c => c.id === activeChannelId);
    if (!next) {
      onUpdateParams({ query: channel?.query || DEFAULT_QUERY, page: 1 });
      return;
    }
    onUpdateParams({ query: channel ? `${channel.query} ${next}` : next, page: 1 });
  };

  const remaining = rateLimit?.remaining != null ? Number(rateLimit.remaining) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Find an issue to work on
          </h1>
          <p className="mt-1 text-sm text-zinc-300">
            Unassigned good-first-issues with almost no comments. Open takes you to GitHub; Guide shows git commands.
          </p>
        </div>
        {!hasToken && (
          <button type="button" onClick={onOpenTokenModal} className="btn-secondary text-sm shrink-0">
            <Key className="w-4 h-4" /> Add GitHub token
          </button>
        )}
      </div>

      {isFallback && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-amber-500/15 px-4 py-3 ring-1 ring-inset ring-amber-400/30 text-sm text-amber-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span>{error || 'Live GitHub search failed. Showing a small curated set — add a token for full results.'}</span>
          </div>
          <button type="button" onClick={onRefresh} className="btn-secondary py-1.5 px-3 text-sm shrink-0">
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {!isFallback && remaining !== null && remaining <= 8 && !hasToken && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-indigo-500/15 px-4 py-3 ring-1 ring-inset ring-indigo-400/30 text-sm text-indigo-50">
          <span>GitHub quota is almost gone ({remaining} left). A token unlocks 5,000 requests/hour.</span>
          <button type="button" onClick={onOpenTokenModal} className="btn-primary py-1.5 px-3 text-sm shrink-0">
            Add token
          </button>
        </div>
      )}

      <form onSubmit={handleSearchSubmit} className="surface p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <label className="block text-xs font-medium text-zinc-400">
            Language
            <select
              value={searchParams.language}
              onChange={(e) => onUpdateParams({ language: e.target.value, page: 1 })}
              className="field mt-1"
            >
              {PROGRAMMING_LANGUAGES.map(lang => (
                <option key={lang.name} value={lang.value}>{lang.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-zinc-400">
            Kind of work
            <select
              value={activeChannelId || 'custom'}
              onChange={(e) => {
                const ch = PRESET_CHANNELS.find(c => c.id === e.target.value);
                if (ch) onUpdateParams({ query: ch.query, page: 1 });
              }}
              className="field mt-1"
            >
              {PRESET_CHANNELS.map(ch => (
                <option key={ch.id} value={ch.id}>{ch.name}</option>
              ))}
              {!activeChannelId && <option value="custom">Custom search</option>}
            </select>
          </label>
          <label className="block text-xs font-medium text-zinc-400">
            Repo size
            <select
              value={searchParams.starRange}
              onChange={(e) => onUpdateParams({ starRange: e.target.value, page: 1 })}
              className="field mt-1"
            >
              {STAR_RANGES.map(s => <option key={s.label} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Optional: keywords (e.g. docs, test, typo)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search keywords"
              className="field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary sm:w-auto">Search</button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-zinc-200 cursor-pointer">
            <input
              type="checkbox"
              checked={searchParams.onlyUnassigned}
              onChange={(e) => onUpdateParams({ onlyUnassigned: e.target.checked, page: 1 })}
              className="h-4 w-4 rounded border-zinc-500 bg-zinc-900 text-indigo-500 focus:ring-indigo-400"
            />
            Hide assigned issues
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-zinc-400">
            Sort
            <select
              value={searchParams.sort}
              onChange={(e) => onUpdateParams({ sort: e.target.value, page: 1 })}
              className="field py-1.5 w-auto text-sm"
            >
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>
      </form>

      <div className="flex items-center justify-between text-sm">
        <p className="text-zinc-300">
          {loading ? 'Loading…' : (
            <>
              <span className="font-semibold text-white tabular-nums">{totalCount.toLocaleString()}</span>
              <span className="text-zinc-400"> {totalCount === 1 ? 'issue' : 'issues'}</span>
            </>
          )}
        </p>
        <button type="button" onClick={onRefresh} className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white">
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="divide-y divide-white/10 rounded-xl ring-1 ring-inset ring-white/10 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="h-16 bg-[#18181c] animate-pulse" />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-14 rounded-xl ring-1 ring-inset ring-white/10">
          <p className="text-base font-semibold text-white mb-1">No issues for these filters</p>
          <p className="text-sm text-zinc-300 mb-4">Try another language, or set repo size to Any Stars.</p>
          <button
            type="button"
            onClick={() => onUpdateParams({ query: DEFAULT_QUERY, language: '', starRange: '', sort: 'updated-desc', onlyUnassigned: true, page: 1 })}
            className="btn-primary"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-xl ring-1 ring-inset ring-white/10 overflow-hidden divide-y divide-white/[0.08] bg-[#141418]">
            {issues.map(issue => (
              <IssueCard
                key={issue.id || issue.html_url}
                issue={issue}
                onSelect={onSelectIssue}
                isBookmarked={bookmarkedIssueIds.includes(issue.id || issue.html_url)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
          <Pagination
            currentPage={searchParams.page}
            totalCount={totalCount}
            perPage={15}
            onPageChange={(page) => onUpdateParams({ page })}
          />
        </>
      )}
    </div>
  );
}
