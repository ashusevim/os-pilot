import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Compass,
  Terminal,
  GraduationCap,
  Kanban,
  Key,
  Command,
  ArrowRight,
  Trash2
} from 'lucide-react';

const COMMANDS = [
  { id: 'discover', label: 'Go to Discover Issues', icon: Compass, shortcut: '1', action: 'navigate', target: 'discover' },
  { id: 'dork', label: 'Go to Query Studio', icon: Search, shortcut: '2', action: 'navigate', target: 'dork-studio' },
  { id: 'playbook', label: 'Go to Git Playbook', icon: Terminal, shortcut: '3', action: 'navigate', target: 'playbook' },
  { id: 'academy', label: 'Go to Learning Academy', icon: GraduationCap, shortcut: '4', action: 'navigate', target: 'academy' },
  { id: 'kanban', label: 'Go to Tracker Kanban', icon: Kanban, shortcut: '5', action: 'navigate', target: 'kanban' },
  { id: 'token', label: 'Configure GitHub Token', icon: Key, shortcut: '', action: 'token' },
  { id: 'clear', label: 'Clear Local Cache & Storage', icon: Trash2, shortcut: '', action: 'clear' },
];

export default function CommandPalette({ onClose, onNavigate, onOpenToken, activeTab }) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const executeCommand = (cmd) => {
    if (cmd.action === 'navigate') {
      onNavigate(cmd.target);
    } else if (cmd.action === 'token') {
      onOpenToken();
    } else if (cmd.action === 'clear') {
      if (confirm('Clear all local data (bookmarks, token, progress)?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIdx]) {
      executeCommand(filtered[selectedIdx]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[18vh] p-4 bg-black/60 backdrop-blur-md modal-backdrop"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg rounded-2xl bg-[#131316] ring-1 ring-white/[0.08] shadow-2xl overflow-hidden modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.06]">
          <Command className="w-4 h-4 text-indigo-300 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[11px] text-zinc-500 font-mono ring-1 ring-white/10">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No commands match "{query}"
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIdx;
              const isCurrent = cmd.target === activeTab;

              return (
                <button
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-white/[0.06] text-white'
                      : 'text-zinc-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-300' : 'text-zinc-500'}`} />
                    <span className="text-sm font-medium">{cmd.label}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[11px] font-semibold">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded text-[11px] text-zinc-500 font-mono ring-1 ring-white/10">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-300' : 'text-zinc-600'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Hints Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center space-x-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <span className="font-mono">⌘K</span>
        </div>
      </div>
    </div>
  );
}
