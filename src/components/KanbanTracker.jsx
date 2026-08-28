import React, { useState } from 'react';
import { 
  Kanban, ExternalLink, Plus, Trash2, Edit3, Check, ChevronDown, ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { KANBAN_COLUMNS } from '../types/constants';

export default function KanbanTracker({
  items, onUpdateStatus, onRemoveItem, onUpdateNotes, onOpenIssueModal, onAddNewCustomIssue
}) {
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customRepo, setCustomRepo] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  // Mobile: which column is expanded
  const [expandedCol, setExpandedCol] = useState('bookmarked');

  const triggerConfetti = () => {
    try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
  };

  const handleStatusChange = (itemId, newStatus) => {
    if (newStatus === 'merged') triggerConfetti();
    onUpdateStatus(itemId, newStatus);
  };

  const handleStartEditNote = (item) => {
    setEditingNotesId(item.id);
    setNoteDraft(item.notes || '');
  };

  const handleSaveNote = (itemId) => {
    onUpdateNotes(itemId, noteDraft);
    setEditingNotesId(null);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onAddNewCustomIssue({
      id: Date.now(), title: customTitle.trim(), repo_name: customRepo.trim() || 'custom/project',
      html_url: customUrl.trim() || '#', language: 'Any', labels: [{ name: 'custom', color: '6366f1' }],
      status: 'bookmarked', notes: '', viabilityScore: 90, difficulty: 'Intermediate', estimatedTime: '2 hrs'
    });
    setCustomTitle(''); setCustomRepo(''); setCustomUrl(''); setIsAddModalOpen(false);
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderItem = (item) => (
    <div key={item.id} className="rounded-xl bg-zinc-950 border border-zinc-800 p-3 hover:border-indigo-500/40 transition space-y-2">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span className="font-mono text-indigo-400 truncate max-w-[120px]">{item.repo_name}</span>
        <div className="flex items-center gap-1">
          {item.addedAt && <span className="text-xs">{formatDate(item.addedAt)}</span>}
          <a href={item.html_url} target="_blank" rel="noopener noreferrer" className="p-0.5 text-zinc-500 hover:text-zinc-200 transition">
            <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={() => onRemoveItem(item.id)} className="p-0.5 text-zinc-500 hover:text-rose-400 transition">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <h4 onClick={() => onOpenIssueModal?.(item)} className="text-xs font-semibold text-zinc-200 hover:text-indigo-300 cursor-pointer line-clamp-2 leading-snug">
        {item.title}
      </h4>

      {/* Notes */}
      <div>
        {editingNotesId === item.id ? (
          <div className="space-y-1">
            <textarea rows={2} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Branch name, notes..."
              className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500" />
            <div className="flex justify-end gap-1">
              <button onClick={() => setEditingNotesId(null)} className="px-2 py-0.5 text-xs text-zinc-400">Cancel</button>
              <button onClick={() => handleSaveNote(item.id)} className="px-2 py-0.5 rounded bg-indigo-600 text-white font-semibold text-xs">Save</button>
            </div>
          </div>
        ) : (
          <div onClick={() => handleStartEditNote(item)}
            className="p-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 cursor-pointer flex items-center justify-between">
            <span className="truncate">{item.notes || 'Add note/branch...'}</span>
            <Edit3 className="w-2.5 h-2.5 text-zinc-600 shrink-0 ml-1" />
          </div>
        )}
      </div>

      {/* Status Dropdown */}
      <div className="pt-1.5 border-t border-zinc-800/60 flex items-center justify-between">
        <span className="text-xs text-zinc-500">Status:</span>
        <select value={item.status || 'bookmarked'} onChange={(e) => handleStatusChange(item.id, e.target.value)}
          className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs focus:outline-none focus:border-indigo-500">
          <option value="bookmarked">📌 Bookmarked</option>
          <option value="exploring">🧭 Exploring</option>
          <option value="in_progress">💻 In Progress</option>
          <option value="pr_submitted">🚀 PR Submitted</option>
          <option value="merged">🏆 Merged</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-300">Tracker</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Your contribution pipeline</h2>
          <p className="mt-2 text-[15px] text-zinc-400">Move issues from saved → coding → merged.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)}
          className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Track Issue
        </button>
      </div>

      {/* Desktop: 5-column grid */}
      <div className="hidden lg:grid grid-cols-5 gap-3 items-start">
        {KANBAN_COLUMNS.map(col => {
          const colItems = items.filter(i => (i.status || 'bookmarked') === col.id);
          return (
            <div key={col.id} className="flex flex-col rounded-2xl bg-zinc-900/70 border border-zinc-800 p-2.5 min-h-[450px]">
              <div className={`p-2.5 rounded-xl mb-2.5 flex items-center justify-between ${col.headerBg} border border-zinc-800`}>
                <span className="text-xs font-bold text-zinc-100">{col.title}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-zinc-950/70 text-zinc-200 font-mono text-xs font-bold">{colItems.length}</span>
              </div>
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[65vh] pr-1">
                {colItems.length === 0 ? (
                  <div className="text-center py-8 px-2 rounded-xl border border-dashed border-zinc-800/80 text-zinc-600 text-xs">
                    No issues here yet
                  </div>
                ) : colItems.map(renderItem)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet: Accordion */}
      <div className="lg:hidden space-y-2">
        {KANBAN_COLUMNS.map(col => {
          const colItems = items.filter(i => (i.status || 'bookmarked') === col.id);
          const isExpanded = expandedCol === col.id;
          return (
            <div key={col.id} className="rounded-xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
              <button
                onClick={() => setExpandedCol(isExpanded ? '' : col.id)}
                className={`w-full flex items-center justify-between p-3 ${col.headerBg} border-b border-zinc-800 transition`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-100">{col.title}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-zinc-950/70 text-zinc-200 font-mono text-xs font-bold">{colItems.length}</span>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {isExpanded && (
                <div className="p-2.5 space-y-2 max-h-[50vh] overflow-y-auto">
                  {colItems.length === 0 ? (
                    <div className="text-center py-6 text-zinc-600 text-xs">No issues here yet</div>
                  ) : colItems.map(renderItem)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Issue Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-backdrop">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl space-y-4 modal-enter">
            <h3 className="text-base font-bold text-white">Track Custom Issue</h3>
            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Issue Title *</label>
                <input type="text" required placeholder="e.g. Implement WebSocket heartbeat" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Repository</label>
                <input type="text" placeholder="owner/repo" value={customRepo} onChange={(e) => setCustomRepo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Link (optional)</label>
                <input type="url" placeholder="https://github.com/..." value={customUrl} onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
