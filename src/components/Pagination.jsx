import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalCount, perPage = 15, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn-secondary py-2 px-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {generatePageNumbers(currentPage, totalPages).map((p, idx) => (
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-sm text-zinc-600">…</span>
          ) : (
            <button
              type="button"
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                p === currentPage
                  ? 'bg-indigo-500 text-white'
                  : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              {p}
            </button>
          )
        ))}
      </div>

      <button
        type="button"
        disabled={!canNext}
        onClick={() => onPageChange(currentPage + 1)}
        className="btn-secondary py-2 px-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
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
