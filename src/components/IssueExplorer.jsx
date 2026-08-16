import React, { useState } from 'react';
import { 
  Search, Sparkles, RotateCcw, BookOpen, Bug, HeartHandshake, Cpu, Terminal,
  AlertTriangle, Code
} from 'lucide-react';
import { PRESET_CHANNELS, PROGRAMMING_LANGUAGES, STAR_RANGES, SORT_OPTIONS } from '../types/constants';
import IssueCard from './IssueCard';
import Pagination from './Pagination';

export default function IssueExplorer({
  issues, totalCount, loading, error, isFallback, rateLimit, searchParams,
  onUpdateParams, onRefresh, onSelectIssue, bookmarkedIssueIds, onToggleBookmark
}) {
  const [searchInput, setSearchInput] = useState(searchParams.query || '');
  const [activeChannelId, setActiveChannelId] = useState('good-first-issue');

  const channelIcons = {
    'good-first-issue': Sparkles, 'docs': BookOpen, 'bug-fixes': Bug,
    'help-wanted': HeartHandshake, 'ai-ml': Cpu, 'cli-devtools': Terminal
  };

  const handleChannelClick = (channel) => {
    setActiveChannelId(channel.id);
    onUpdateParams({ query: channel.query, page: 1 });
    setSearchInput(channel.query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveChannelId('');
    onUpdateParams({ query: searchInput, page: 1 });
  };

  return (
    <div className="space-y-5">
      
      {/* Hero Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-[#090d16] border border-slate-800/80 p-4 sm:p-6 lg:p-8 shadow-xl gradient-border-animated">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 sm:w-80 h-48 sm:h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Discover Open Source Opportunities</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
            Find the right issue. <span className="text-gradient">Land your first PR.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 max-w-lg">
            Filter GitHub issues calibrated for new contributors — clear scope, welcoming maintainers, and manageable difficulty.
          </p>

          {/* Channel Presets — 2 cols mobile, 3 cols tablet, 6 cols desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
            {PRESET_CHANNELS.map(ch => {
              const Icon = channelIcons[ch.id] || Sparkles;
              const isActive = activeChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleChannelClick(ch)}
                  className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-300' : 'text-indigo-400'}`} />
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold leading-tight block truncate">{ch.name}</span>
                    <span className={`text-[9px] ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>{ch.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fallback Banner */}
      {isFallback && (
        <div className="flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Offline Mode: </strong>
              {error || 'Showing curated starter issues. Add a GitHub PAT for live search.'}
            </span>
          </div>
          <button onClick={onRefresh} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 font-semibold transition shrink-0 text-[11px]">
            <RotateCcw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search keywords, labels, repos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition whitespace-nowrap">
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          
          {/* Language pills — horizontally scrollable */}
          <div className="scroll-fade-x-wrapper flex-1 min-w-0">
            <div className="scroll-fade-x flex items-center gap-1 py-1">
              {PROGRAMMING_LANGUAGES.slice(0, 8).map(lang => (
                <button
                  key={lang.name}
                  onClick={() => onUpdateParams({ language: lang.value, page: 1 })}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap shrink-0 ${
                    searchParams.language === lang.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdowns + toggle */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <select
              value={searchParams.starRange}
              onChange={(e) => onUpdateParams({ starRange: e.target.value, page: 1 })}
              className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              {STAR_RANGES.map(s => <option key={s.label} value={s.value}>{s.label}</option>)}
            </select>

            <select
              value={searchParams.sort}
              onChange={(e) => onUpdateParams({ sort: e.target.value, page: 1 })}
              className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            <label className="flex items-center gap-1.5 cursor-pointer select-none px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
              <input
                type="checkbox"
                checked={searchParams.onlyUnassigned}
                onChange={(e) => onUpdateParams({ onlyUnassigned: e.target.checked, page: 1 })}
                className="w-3 h-3 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
              />
              <span className="text-[11px] text-slate-300 font-medium whitespace-nowrap">Unassigned</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">Results</h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px]">
            {totalCount !== undefined ? `${totalCount.toLocaleString()} found` : '...'}
          </span>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition">
          <RotateCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Issues Grid / Skeletons / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 space-y-3 animate-pulse">
              <div className="flex justify-between"><div className="h-4 bg-slate-800 rounded w-1/3" /><div className="h-4 bg-slate-800 rounded w-1/4" /></div>
              <div className="h-5 bg-slate-800 rounded w-4/5" />
              <div className="h-10 bg-slate-800/60 rounded" />
              <div className="flex gap-2"><div className="h-3 bg-slate-800 rounded w-14" /><div className="h-3 bg-slate-800 rounded w-14" /></div>
            </div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white mb-1">No issues match this query</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try broadening your search, selecting "All Languages", or picking a starter channel.
          </p>
          <button onClick={() => handleChannelClick(PRESET_CHANNELS[0])} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition">
            Reset to Good First Issues
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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

          {/* Pagination */}
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
