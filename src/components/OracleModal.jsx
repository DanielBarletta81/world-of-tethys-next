'use client';

import { X } from 'lucide-react';

export default function OracleModal({ open, onClose, entry }) {
  if (!open || !entry) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative max-w-lg w-full bg-[#0b0f14] border border-emerald-900/40 rounded-lg shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-500 hover:text-stone-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-500 mb-1">
          {entry.locationLabel || 'Unknown Relay'}
        </div>
        <h3 className="text-xl font-serif text-emerald-100 mb-2">{entry.title}</h3>
        <p className="text-sm text-stone-300 leading-relaxed mb-3 italic">"{entry.body}"</p>
        {entry.hint && (
          <p className="text-[11px] text-amber-300 uppercase tracking-[0.2em]">{entry.hint}</p>
        )}
        {entry.gibberish && (
          <p className="mt-3 text-[11px] text-emerald-400 font-mono">Signal: {entry.gibberish}</p>
        )}
      </div>
    </div>
  );
}
