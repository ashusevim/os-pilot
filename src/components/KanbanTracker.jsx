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
    <div key={item.id} className="rounded-xl bg-slate-950 border border-slate-800 p-3 hover:border-indigo-500/40 transition space-y-2">
      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <span className="font-mono text-indigo-400 truncate max-w-[120px]">{item.repo_name}</span>
        <div className="flex items-center gap-1">
          {item.addedAt && <span className="text-[9px]">{formatDate(item.addedAt)}</span>}
          <a href={item.html_url} target="_blank" rel="noopener noreferrer" className="p-0.5 text-slate-500 hover:text-slate-200 transition">
            <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={() => onRemoveItem(item.id)} className="p-0.5 text-slate-500 hover:text-rose-400 transition">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <h4 onClick={() => onOpenIssueModal?.(item)} className="text-xs font-semibold text-slate-200 hover:text-indigo-300 cursor-pointer line-clamp-2 leading-snug">
        {item.title}
      </h4>

      {/* Notes */}
      <div>
        {editingNotesId === item.id ? (
          <div className="space-y-1">
            <textarea rows={2} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Branch name, notes..."
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500" />
            <div className="flex justify-end gap-1">
              <button onClick={() => setEditingNotesId(null)} className="px-2 py-0.5 text-[10px] text-slate-400">Cancel</button>
              <button onClick={() => handleSaveNote(item.id)} className="px-2 py-0.5 rounded bg-indigo-600 text-white font-semibold text-[10px]">Save</button>
            </div>
          </div>
        ) : (
          <div onClick={() => handleStartEditNote(item)}
            className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-[10px] text-slate-400 cursor-pointer flex items-center justify-between">
            <span className="truncate">{item.notes || 'Add note/branch...'}</span>
            <Edit3 className="w-2.5 h-2.5 text-slate-600 shrink-0 ml-1" />
          </div>
        )}
      </div>

      {/* Status Dropdown */}
      <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[9px] text-slate-500">Status:</span>
        <select value={item.status || 'bookmarked'} onChange={(e) => handleStatusChange(item.id, e.target.value)}
          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] focus:outline-none focus:border-indigo-500">
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
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold mb-2">
            <Kanban className="w-3 h-3 text-indigo-400" /> Pipeline Tracker
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Your Open Source Workspace</h2>
          <p className="text-[11px] text-slate-400 mt-1">Track issues from discovery to merged pull request.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition shrink-0">
          <Plus className="w-4 h-4" /> Track Issue
        </button>
      </div>

      {/* Desktop: 5-column grid */}
      <div className="hidden lg:grid grid-cols-5 gap-3 items-start">
        {KANBAN_COLUMNS.map(col => {
          const colItems = items.filter(i => (i.status || 'bookmarked') === col.id);
          return (
            <div key={col.id} className="flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 p-2.5 min-h-[450px]">
              <div className={`p-2.5 rounded-xl mb-2.5 flex items-center justify-between ${col.headerBg} border border-slate-800`}>
                <span className="text-[11px] font-bold text-slate-100">{col.title}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950/70 text-slate-200 font-mono text-[10px] font-bold">{colItems.length}</span>
              </div>
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[65vh] pr-1">
                {colItems.length === 0 ? (
                  <div className="text-center py-8 px-2 rounded-xl border border-dashed border-slate-800/80 text-slate-600 text-[11px]">
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
            <div key={col.id} className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setExpandedCol(isExpanded ? '' : col.id)}
                className={`w-full flex items-center justify-between p-3 ${col.headerBg} border-b border-slate-800 transition`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">{col.title}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-950/70 text-slate-200 font-mono text-[10px] font-bold">{colItems.length}</span>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {isExpanded && (
                <div className="p-2.5 space-y-2 max-h-[50vh] overflow-y-auto">
                  {colItems.length === 0 ? (
                    <div className="text-center py-6 text-slate-600 text-[11px]">No issues here yet</div>
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
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4 modal-enter">
            <h3 className="text-base font-bold text-white">Track Custom Issue</h3>
            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title *</label>
                <input type="text" required placeholder="e.g. Implement WebSocket heartbeat" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Repository</label>
                <input type="text" placeholder="owner/repo" value={customRepo} onChange={(e) => setCustomRepo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Link (optional)</label>
                <input type="url" placeholder="https://github.com/..." value={customUrl} onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
