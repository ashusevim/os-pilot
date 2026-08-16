import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Compass,
  Terminal,
  GraduationCap,
  Kanban,
  Key,
  Sparkles,
  Command,
  ArrowRight,
  Trash2,
  Hash
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
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] p-4 bg-black/70 backdrop-blur-sm modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Command className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands... (navigate, token, clear)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-slate-500">
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
                      ? 'bg-indigo-600/20 text-white'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-medium">{cmd.label}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Hints Footer */}
        <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
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
