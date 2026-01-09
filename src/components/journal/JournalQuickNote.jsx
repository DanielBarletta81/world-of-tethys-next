"use client";

import { useEffect, useState } from "react";

const JOURNAL_KEY = "tethys_journal_v1";

const loadJournal = () => {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveJournal = (entries) => {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries.slice(0, 100)));
};

/**
 * Quick Note modal: small, text-only, saves locally as type "note".
 * Props: open (bool), onClose (fn)
 */
export default function JournalQuickNote({ open, onClose }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) setText("");
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    if (!text.trim()) {
      onClose?.();
      return;
    }
    const entry = {
      id: crypto.randomUUID?.() ?? `note-${Date.now()}-${Math.random()}`,
      createdAt: Date.now(),
      type: "note",
      text: text.trim().slice(0, 240),
    };
    const journal = loadJournal();
    journal.unshift(entry);
    saveJournal(journal);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[9900] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0c0a09]/90 p-5 shadow-2xl">
        <div className="text-xs uppercase tracking-[0.35em] text-stone-500 mb-3">
          Field Note
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={240}
          className="w-full h-32 bg-black/30 border border-white/5 rounded-lg p-3 text-sm text-stone-100 outline-none placeholder:text-stone-600"
          placeholder="Write what mattered. No formatting. No timestamps."
        />
        <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
          <span>{240 - text.length} chars</span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-md bg-white/5 text-stone-300 hover:bg-white/10 transition"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 rounded-md bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700/70 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// World of Tethys || D.C. Barletta
