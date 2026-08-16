import React, { useState } from 'react';
import { Key, ShieldCheck, ExternalLink, X, Check, Trash2, AlertCircle } from 'lucide-react';

export default function TokenModal({ isOpen, onClose, token, onSaveToken, onClearToken }) {
  const [inputVal, setInputVal] = useState(token || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveToken(inputVal.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setInputVal('');
    onClearToken();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">GitHub Personal Access Token</h3>
            <p className="text-xs text-slate-400">Supercharge your search rate limit from 60 to 5,000 requests/hr</p>
          </div>
        </div>

        {/* Informational Callout */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-start space-x-2 text-indigo-300 font-semibold">
            <ShieldCheck className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
            <span>100% Client-Side & Secure</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Your token is stored <strong>only in your local browser storage</strong> (<code className="text-indigo-300">localStorage</code>) and is sent directly to <code className="text-indigo-300">api.github.com</code> headers. It never touches any third-party server.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-cyan-400">
            <span>No scopes/permissions required (public read-only)</span>
            <a
              href="https://github.com/settings/tokens/new?description=OpenSourcePilot&scopes="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:underline font-semibold"
            >
              Generate token on GitHub <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Personal Access Token (classic or fine-grained)
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {token ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Token</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-600/30 transition"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Token</span>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
