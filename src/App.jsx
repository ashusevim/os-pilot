import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { searchGitHubIssues } from './services/githubApi';
import Navbar from './components/Navbar';
import IssueExplorer from './components/IssueExplorer';
import TokenModal from './components/TokenModal';
import IssueDetailModal from './components/IssueDetailModal';

// Lazy-loaded heavy tabs
const QueryBuilder = lazy(() => import('./components/QueryBuilder'));
const ContributionPlaybook = lazy(() => import('./components/ContributionPlaybook'));
const LearningAcademy = lazy(() => import('./components/LearningAcademy'));
const KanbanTracker = lazy(() => import('./components/KanbanTracker'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

const VALID_TABS = ['discover', 'dork-studio', 'playbook', 'academy', 'kanban'];

const DEFAULT_SEARCH = {
  query: 'label:"good first issue" comments:0..3',
  language: '',
  starRange: '',
  sort: 'updated-desc',
  onlyUnassigned: true,
  page: 1
};

function getInitialTab() {
  const hash = window.location.hash.replace('#', '');
  return VALID_TABS.includes(hash) ? hash : 'discover';
}

function LazyFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-zinc-400 font-medium">Loading module...</span>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [token, setToken] = useLocalStorage('osp_github_pat', '');
  const [kanbanItems, setKanbanItems] = useLocalStorage('osp_kanban_items', []);
  const [completedLessons, setCompletedLessons] = useLocalStorage('osp_completed_lessons', []);
  
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [searchParams, setSearchParams] = useLocalStorage('osp_search_params_v3', DEFAULT_SEARCH);

  // Issues State
  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [rateLimit, setRateLimit] = useState(null);

  // ── URL Hash Routing ─────────────────────────────────────────
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_TABS.includes(hash)) setActiveTab(hash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ── Keyboard Shortcuts ───────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // Don't capture when typing in inputs
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Ctrl+K / ⌘K → command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Escape → close modals
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) { setIsCommandPaletteOpen(false); return; }
        if (selectedIssue) { setSelectedIssue(null); return; }
        if (isTokenModalOpen) { setIsTokenModalOpen(false); return; }
        return;
      }

      // 1-5 → switch tabs
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setActiveTab(VALID_TABS[num - 1]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isCommandPaletteOpen, selectedIssue, isTokenModalOpen]);

  // ── Fetch Issues (debounced) ─────────────────────────────────
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchGitHubIssues({
        ...searchParams,
        token: token || null
      });

      if (result.aborted) return; // Request was superseded

      setIssues(result.issues || []);
      setTotalCount(result.totalCount || 0);
      setIsFallback(result.isFallback || false);
      if (result.rateLimit) setRateLimit(result.rateLimit);
      if (result.error) setError(result.error);
    } catch (err) {
      console.error('Failed to load issues:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchParams, token]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleUpdateParams = (newParams) => {
    setSearchParams(prev => ({ ...DEFAULT_SEARCH, ...prev, ...newParams }));
  };

  const handleExecuteFromStudio = (customQuery, customLang) => {
    setSearchParams(prev => ({
      ...prev,
      query: customQuery,
      language: customLang || prev.language,
      page: 1
    }));
    setActiveTab('discover');
  };

  // ── Kanban Handlers ──────────────────────────────────────────
  const handleToggleBookmark = (issue) => {
    const issueId = issue.id || issue.html_url;
    const exists = kanbanItems.some(i => (i.id || i.html_url) === issueId);
    if (exists) {
      setKanbanItems(kanbanItems.filter(i => (i.id || i.html_url) !== issueId));
    } else {
      setKanbanItems([...kanbanItems, { ...issue, id: issueId, status: 'bookmarked', notes: '', addedAt: new Date().toISOString() }]);
    }
  };

  const handleAddToKanbanWithStatus = (issue, status = 'in_progress') => {
    const issueId = issue.id || issue.html_url;
    const existingIndex = kanbanItems.findIndex(i => (i.id || i.html_url) === issueId);
    if (existingIndex >= 0) {
      const updated = [...kanbanItems];
      updated[existingIndex] = { ...updated[existingIndex], status, movedAt: new Date().toISOString() };
      setKanbanItems(updated);
    } else {
      setKanbanItems([...kanbanItems, { ...issue, id: issueId, status, notes: '', addedAt: new Date().toISOString() }]);
    }
  };

  const handleUpdateKanbanStatus = (itemId, newStatus) => {
    setKanbanItems(kanbanItems.map(item =>
      (item.id || item.html_url) === itemId
        ? { ...item, status: newStatus, movedAt: new Date().toISOString() }
        : item
    ));
  };

  const handleRemoveKanbanItem = (itemId) => {
    setKanbanItems(kanbanItems.filter(item => (item.id || item.html_url) !== itemId));
  };

  const handleUpdateKanbanNotes = (itemId, notes) => {
    setKanbanItems(kanbanItems.map(item =>
      (item.id || item.html_url) === itemId ? { ...item, notes } : item
    ));
  };

  const handleAddNewCustomIssue = (customIssue) => {
    setKanbanItems([{ ...customIssue, addedAt: new Date().toISOString() }, ...kanbanItems]);
  };

  const bookmarkedIssueIds = kanbanItems.map(i => i.id || i.html_url);

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 flex flex-col">
      
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        hasToken={Boolean(token)}
        rateLimit={rateLimit}
        kanbanItems={kanbanItems}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6">
        
        {activeTab === 'discover' && (
          <IssueExplorer
              issues={issues}
              totalCount={totalCount}
              loading={loading}
              error={error}
              isFallback={isFallback}
              rateLimit={rateLimit}
              searchParams={searchParams}
              onUpdateParams={handleUpdateParams}
              onRefresh={fetchIssues}
              onSelectIssue={(issue) => setSelectedIssue(issue)}
              bookmarkedIssueIds={bookmarkedIssueIds}
              onToggleBookmark={handleToggleBookmark}
              hasToken={Boolean(token)}
              onOpenTokenModal={() => setIsTokenModalOpen(true)}
            />
          )}

          <Suspense fallback={<LazyFallback />}>
            {activeTab === 'dork-studio' && <QueryBuilder onExecuteQuery={handleExecuteFromStudio} />}
            {activeTab === 'playbook' && <ContributionPlaybook />}
            {activeTab === 'academy' && (
              <LearningAcademy
                completedLessons={completedLessons}
                setCompletedLessons={setCompletedLessons}
              />
            )}
            {activeTab === 'kanban' && (
              <KanbanTracker
                items={kanbanItems}
                onUpdateStatus={handleUpdateKanbanStatus}
                onRemoveItem={handleRemoveKanbanItem}
                onUpdateNotes={handleUpdateKanbanNotes}
                onOpenIssueModal={(issue) => setSelectedIssue(issue)}
                onAddNewCustomIssue={handleAddNewCustomIssue}
              />
            )}
          </Suspense>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-zinc-500 gap-3">
          <span className="font-medium text-zinc-300">Pilot</span>
          <div className="flex items-center gap-4 text-zinc-600">
            <span>/ search</span>
            <span>⌘K palette</span>
            <span>1–5 tabs</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        token={token}
        onSaveToken={(newToken) => { setToken(newToken); fetchIssues(); }}
        onClearToken={() => { setToken(''); fetchIssues(); }}
      />

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          isBookmarked={bookmarkedIssueIds.includes(selectedIssue.id || selectedIssue.html_url)}
          onToggleBookmark={handleToggleBookmark}
          onAddToKanbanWithStatus={handleAddToKanbanWithStatus}
          token={token}
        />
      )}

      <Suspense fallback={null}>
        {isCommandPaletteOpen && (
          <CommandPalette
            onClose={() => setIsCommandPaletteOpen(false)}
            onNavigate={(tab) => { setActiveTab(tab); setIsCommandPaletteOpen(false); }}
            onOpenToken={() => { setIsTokenModalOpen(true); setIsCommandPaletteOpen(false); }}
            activeTab={activeTab}
          />
        )}
      </Suspense>

    </div>
  );
}
