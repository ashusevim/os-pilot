import React from 'react';
import { 
  Compass, 
  Search, 
  Terminal, 
  GraduationCap, 
  Kanban, 
  Key, 
  Sparkles,
  Github,
  Activity,
  CheckCircle2,
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
  const mergedCount = kanbanItems.filter(i => i.status === 'merged').length;

  const navTabs = [
    { id: 'discover', label: 'Discover', fullLabel: 'Discover Issues', icon: Compass, badge: null },
    { id: 'dork-studio', label: 'Query', fullLabel: 'Query Studio', icon: Search, badge: null },
    { id: 'playbook', label: 'Playbook', fullLabel: 'Git Playbook', icon: Terminal, badge: null },
    { id: 'academy', label: 'Academy', fullLabel: 'Academy', icon: GraduationCap, badge: null },
    { id: 'kanban', label: 'Tracker', fullLabel: 'Tracker', icon: Kanban, badge: kanbanItems.length > 0 ? kanbanItems.length : null },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo — compact on small screens */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('discover')}>
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-glow-sm">
              <div className="w-full h-full bg-slate-950 rounded-[9px] sm:rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-base lg:text-lg tracking-tight text-white font-mono">
                OS<span className="text-cyan-400 font-sans">Pilot</span>
              </span>
            </div>
          </div>

          {/* Center Navigation — scrollable on smaller screens */}
          <nav className="flex-1 mx-2 sm:mx-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 bg-slate-900/70 p-1 sm:p-1.5 rounded-xl border border-slate-800/60 w-fit mx-auto">
              {navTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
                    <span className="hidden xs:inline sm:inline">{tab.label}</span>
                    {tab.badge && (
                      <span className={`ml-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                        isActive ? 'bg-cyan-400/30 text-cyan-200' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                    {/* Active tab glow indicator */}
                    {isActive && (
                      <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right Actions — compact */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {mergedCount > 0 && (
              <div className="hidden lg:flex items-center space-x-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>{mergedCount}</span>
              </div>
            )}

            {/* Cmd+K button */}
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition text-[11px]"
              title="Command Palette (⌘K)"
            >
              <Command className="w-3 h-3" />
              <kbd className="font-mono text-[10px] text-slate-500">⌘K</kbd>
            </button>

            {/* Rate limit */}
            <div className="hidden md:flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
              <Activity className={`w-3 h-3 ${hasToken ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="font-mono">
                {rateLimit?.remaining !== null && rateLimit?.remaining !== undefined
                  ? `${rateLimit.remaining}/${rateLimit.limit || 60}` 
                  : (hasToken ? '5k/hr' : '60/hr')}
              </span>
            </div>

            {/* Token Button */}
            <button
              onClick={onOpenTokenModal}
              className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition ${
                hasToken
                  ? 'bg-indigo-950/50 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className={`w-3 h-3 ${hasToken ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{hasToken ? 'PAT' : 'Token'}</span>
            </button>

            {/* GitHub link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
