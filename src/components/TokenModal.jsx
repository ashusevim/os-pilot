import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, ExternalLink, X, Check, Trash2 } from 'lucide-react';

export default function TokenModal({ isOpen, onClose, token, onSaveToken, onClearToken }) {
  const [inputVal, setInputVal] = useState(token || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputVal(token || '');
      setSavedSuccess(false);
    }
  }, [isOpen, token]);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md modal-backdrop"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="token-modal-title"
        className="relative w-full max-w-lg rounded-2xl bg-[#131316] p-6 ring-1 ring-white/[0.08] shadow-2xl modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close token dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 id="token-modal-title" className="text-lg font-semibold text-white">GitHub token</h3>
            <p className="text-sm text-zinc-400">Raises the search limit from 60 to 5,000 requests/hr</p>
          </div>
        </div>

        <div className="mb-5 rounded-xl bg-white/[0.03] p-4 text-sm text-zinc-400 ring-1 ring-inset ring-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            Stored only in this browser
          </div>
          <p className="leading-relaxed">
            The token never leaves your machine except as an Authorization header to api.github.com. Public read-only is enough — no scopes required.
          </p>
          <a
            href="https://github.com/settings/tokens/new?description=OpenSourcePilot&scopes="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-300 hover:text-white"
          >
            Generate a token <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <label className="block text-sm font-medium text-zinc-300">
            Personal access token
            <input
              type="password"
              placeholder="ghp_… or github_pat_…"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="field mt-1.5 font-mono"
            />
          </label>

          <div className="flex items-center justify-between pt-1">
            {token ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-sm text-rose-400 hover:text-rose-300"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={!inputVal.trim()} className="btn-primary disabled:opacity-40">
                {savedSuccess ? <><Check className="w-4 h-4" /> Saved</> : 'Save token'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
