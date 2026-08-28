import React from 'react';
import { 
  Compass, 
  Search, 
  Terminal, 
  GraduationCap, 
  Kanban, 
  Key, 
  Sparkles,
  Command
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenTokenModal,
  onOpenCommandPalette,
  hasToken, 
  rateLimit,
  kanbanItems = []
}) {
  const navTabs = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'dork-studio', label: 'Query', icon: Search },
    { id: 'playbook', label: 'Playbook', icon: Terminal },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
    { id: 'kanban', label: 'Tracker', icon: Kanban, badge: kanbanItems.length || null },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-2.5 shrink-0"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="hidden sm:block text-[15px] font-semibold tracking-tight text-white">
              Pilot
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-0.5 rounded-xl bg-white/[0.03] p-1 ring-1 ring-inset ring-white/[0.06]">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/[0.08] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.badge != null && (
                    <span className="ml-0.5 min-w-[1.1rem] rounded-full bg-indigo-500/20 px-1.5 text-[11px] font-semibold text-indigo-300">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {rateLimit?.remaining != null && (
              <span className="hidden lg:inline text-xs tabular-nums text-zinc-500">
                {rateLimit.remaining}/{rateLimit.limit || 60}
              </span>
            )}

            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open command palette"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-zinc-400 ring-1 ring-inset ring-white/[0.08] hover:text-white hover:bg-white/[0.04] transition"
            >
              <Command className="w-3.5 h-3.5" />
              <kbd className="hidden sm:inline text-[11px] font-mono text-zinc-500">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={onOpenTokenModal}
              aria-label={hasToken ? 'GitHub token configured' : 'Set GitHub token'}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium ring-1 ring-inset transition ${
                hasToken
                  ? 'bg-indigo-500/10 text-indigo-300 ring-indigo-400/25'
                  : 'text-zinc-400 ring-white/[0.08] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{hasToken ? 'Connected' : 'Token'}</span>
            </button>
          </div>
        </div>

        <nav className="md:hidden flex gap-1 overflow-x-auto pb-3 -mx-1 px-1 scroll-fade-x">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
                  isActive ? 'bg-white/[0.08] text-white' : 'text-zinc-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
