import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalCount, perPage = 15, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        disabled={!canPrev}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition disabled:opacity-30 disabled:cursor-not-allowed bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Previous</span>
      </button>

      <div className="flex items-center space-x-1">
        {generatePageNumbers(currentPage, totalPages).map((p, idx) => (
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-slate-500">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                p === currentPage
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          )
        ))}
      </div>

      <button
        disabled={!canNext}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition disabled:opacity-30 disabled:cursor-not-allowed bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <span>Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      <span className="text-[11px] text-slate-500 ml-3 font-mono hidden sm:inline">
        Page {currentPage} of {totalPages.toLocaleString()}
      </span>
    </div>
  );
}

function generatePageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);

  if (current > 3) pages.push('...');

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('...');

  pages.push(total);

  return pages;
}
