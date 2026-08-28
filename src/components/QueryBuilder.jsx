import React, { useState } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  Sliders, 
  Sparkles, 
  Tag, 
  Terminal, 
  Filter,
  Bookmark,
  Layers,
  Save,
  Trash2
} from 'lucide-react';
import { PROGRAMMING_LANGUAGES } from '../types/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function QueryBuilder({ onExecuteQuery }) {
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('');
  const [selectedLabels, setSelectedLabels] = useState(['good first issue']);
  const [customLabel, setCustomLabel] = useState('');
  const [onlyUnassigned, setOnlyUnassigned] = useState(true);
  const [minStars, setMinStars] = useState(100);
  const [maxStars, setMaxStars] = useState(2500);
  const [enableStarFilter, setEnableStarFilter] = useState(true);
  const [maxComments, setMaxComments] = useState(2);
  const [enableCommentFilter, setEnableCommentFilter] = useState(true);
  const [copied, setCopied] = useState(false);
  const [customPresets, setCustomPresets] = useLocalStorage('osp_custom_presets', []);

  const labelPresets = [
    'good first issue',
    'help wanted',
    'documentation',
    'beginner',
    'easy-fix',
    'first-timers-only',
    'bug',
    'enhancement',
    'chore'
  ];

  const dorkTemplates = [
    {
      title: '💎 Zero-Comment Goldmines',
      desc: 'Fresh, untouched beginner issues with zero comments ready for quick claim',
      labels: ['good first issue'],
      unassigned: true,
      comments: 0,
      enableComments: true,
      stars: [100, 5000],
      keyword: ''
    },
    {
      title: '📚 Documentation Quick Wins',
      desc: 'Low-friction typo & docs improvements to learn the PR flow smoothly',
      labels: ['documentation', 'typo'],
      unassigned: true,
      comments: 2,
      enableComments: true,
      stars: [500, 20000],
      keyword: ''
    },
    {
      title: '🤖 AI & Agent Starters',
      desc: 'AI frameworks, LLM tooling, and prompt engineer beginner tasks',
      labels: ['good first issue', 'help wanted'],
      unassigned: true,
      comments: 3,
      enableComments: true,
      stars: [200, 10000],
      keyword: 'topic:ai topic:llm'
    },
    {
      title: '🎯 Responsive Mid-Size Repos',
      desc: 'Repositories with 200–1,500 stars where maintainers reply within hours',
      labels: ['good first issue'],
      unassigned: true,
      comments: 2,
      enableComments: true,
      stars: [200, 1500],
      keyword: ''
    }
  ];

  const toggleLabel = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(l => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleAddCustomLabel = (e) => {
    e.preventDefault();
    if (customLabel.trim() && !selectedLabels.includes(customLabel.trim())) {
      setSelectedLabels([...selectedLabels, customLabel.trim()]);
      setCustomLabel('');
    }
  };

  const applyTemplate = (tpl) => {
    setSelectedLabels(tpl.labels);
    setOnlyUnassigned(tpl.unassigned);
    setMaxComments(tpl.comments);
    setEnableCommentFilter(tpl.enableComments);
    setMinStars(tpl.stars[0]);
    setMaxStars(tpl.stars[1]);
    setEnableStarFilter(true);
    setKeyword(tpl.keyword);
  };

  // Build the live GitHub search query string
  const buildQuery = () => {
    const parts = ['is:open', 'is:issue', 'archived:false'];

    if (onlyUnassigned) parts.push('no:assignee');
    if (language) parts.push(`language:${language}`);
    if (selectedLabels.length > 0) {
      const labelStr = selectedLabels.map(l => (l.includes(' ') ? `"${l}"` : l)).join(',');
      parts.push(`label:${labelStr}`);
    }
    if (enableCommentFilter) {
      parts.push(`comments:0..${maxComments}`);
    }
    if (enableStarFilter) {
      parts.push(`stars:${minStars}..${maxStars}`);
    }
    if (keyword.trim()) {
      parts.push(keyword.trim());
    }

    return parts.join(' ');
  };

  const currentQuery = buildQuery();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSavePreset = () => {
    const name = prompt('Enter a name for this custom preset:');
    if (!name) return;
    const newPreset = {
      title: name,
      desc: 'Custom user preset',
      labels: selectedLabels,
      unassigned: onlyUnassigned,
      comments: maxComments,
      enableComments: enableCommentFilter,
      stars: [minStars, maxStars],
      keyword: keyword
    };
    setCustomPresets([...customPresets, newPreset]);
  };

  const handleDeletePreset = (e, index) => {
    e.stopPropagation();
    setCustomPresets(customPresets.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-300">Query studio</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Build a precise GitHub search
          </h2>
          <p className="mt-2 text-[15px] text-zinc-400 max-w-xl">
            Combine labels, stars, and activity to find unclaimed beginner issues.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onExecuteQuery(currentQuery, language)}
            className="btn-primary"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Execute in Explorer</span>
          </button>
          
          <a
            href={`https://github.com/search?q=${encodeURIComponent(currentQuery)}&type=issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <span>GitHub.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Live Query Output Bar */}
      <div className="surface p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Generated Live Query</span>
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Query'}</span>
          </button>
        </div>
        <pre className="p-3 rounded-xl bg-[#0c0c0e] ring-1 ring-inset ring-white/[0.06] text-indigo-200 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
          {currentQuery}
        </pre>
      </div>

      {/* 1-Click Dork Templates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Query Presets</span>
          </h3>
          <button
            onClick={handleSavePreset}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition"
          >
            <Save className="w-3 h-3" />
            <span>Save Current as Preset</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dorkTemplates.map((tpl, i) => (
            <div
              key={`dork-${i}`}
              onClick={() => applyTemplate(tpl)}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/60 hover:bg-zinc-900 cursor-pointer transition-all space-y-1.5 group"
            >
              <h4 className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 transition">
                {tpl.title}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {tpl.desc}
              </p>
            </div>
          ))}
          {customPresets.map((tpl, i) => (
            <div
              key={`custom-${i}`}
              onClick={() => applyTemplate(tpl)}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-zinc-900 cursor-pointer transition-all space-y-1.5 group relative"
            >
              <button 
                onClick={(e) => handleDeletePreset(e, i)}
                className="absolute top-3 right-3 p-1 rounded bg-zinc-800/80 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <h4 className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 transition pr-6">
                {tpl.title}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {tpl.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Visual Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Labels & Tags */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-4 h-4" />
            <span>Label Combiners</span>
          </div>

          <p className="text-xs text-zinc-400">
            Click to toggle standard issue labels to target specific newcomer streams:
          </p>

          <div className="flex flex-wrap gap-2">
            {labelPresets.map(lbl => {
              const active = selectedLabels.includes(lbl);
              return (
                <button
                  key={lbl}
                  onClick={() => toggleLabel(lbl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {active ? `✓ ${lbl}` : `+ ${lbl}`}
                </button>
              );
            })}
          </div>

          {/* Custom label input */}
          <form onSubmit={handleAddCustomLabel} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add custom label (e.g. 'good-first-issue', 'security')..."
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
            >
              Add
            </button>
          </form>
        </div>

        {/* Right Column: Filters & Parameters */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-5">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Repository & Competition Qualifiers</span>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Specific Keywords or Topics
            </label>
            <input
              type="text"
              placeholder="e.g. topic:ai, react, cli, compiler, auth"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Programming Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              {PROGRAMMING_LANGUAGES.map(l => (
                <option key={l.name} value={l.value}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Star Range Sliders */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-zinc-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableStarFilter}
                  onChange={(e) => setEnableStarFilter(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-700 text-indigo-600"
                />
                <span>Repository Stars Range</span>
              </label>
              {enableStarFilter && (
                <span className="font-mono text-cyan-300 text-xs font-bold">
                  {minStars.toLocaleString()} - {maxStars.toLocaleString()} ★
                </span>
              )}
            </div>

            {enableStarFilter && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-xs text-zinc-400">Min Stars: {minStars}</span>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={minStars}
                    onChange={(e) => setMinStars(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <span className="text-xs text-zinc-400">Max Stars: {maxStars}</span>
                  <input
                    type="range"
                    min="100"
                    max="50000"
                    step="200"
                    value={maxStars}
                    onChange={(e) => setMaxStars(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Comment Constraint (Competition) */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-zinc-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCommentFilter}
                  onChange={(e) => setEnableCommentFilter(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-700 text-indigo-600"
                />
                <span>Max Comments (Low Competition Filter)</span>
              </label>
              {enableCommentFilter && (
                <span className="font-mono text-indigo-300 text-xs font-bold">
                  ≤ {maxComments} comments
                </span>
              )}
            </div>

            {enableCommentFilter && (
              <input
                type="range"
                min="0"
                max="10"
                value={maxComments}
                onChange={(e) => setMaxComments(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            )}
          </div>

          {/* Unassigned Only */}
          <label className="flex items-center space-x-2.5 text-xs text-zinc-300 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyUnassigned}
              onChange={(e) => setOnlyUnassigned(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-700 text-indigo-600"
            />
            <span>Filter for strictly unassigned issues (`no:assignee`)</span>
          </label>

        </div>

      </div>

    </div>
  );
}
