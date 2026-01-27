'use client';

import { useMemo } from 'react';
import { TETHYS_MEDICINAL_SYSTEM } from '@/data/tethys-medicinals';

export default function RavelToolkit({ compact = false, className = '', onSelect }) {
  const items = useMemo(() => TETHYS_MEDICINAL_SYSTEM.items, []);

  return (
    <div className={`bg-[#0b0a09] border border-emerald-900/30 rounded-2xl p-5 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-400 font-mono">
            Ravel’s Toolkit
          </p>
          <h3 className="text-lg text-emerald-200 font-mystic mt-2">Root War Pharmacopeia</h3>
          <p className="text-xs text-stone-400 mt-1">
            Poison and antidote co‑evolve. Nothing is neutral.
          </p>
        </div>
        <div className="text-[9px] uppercase tracking-[0.3em] text-emerald-500/80 border border-emerald-900/50 px-3 py-1 rounded-full">
          Processing Required
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {(compact ? items.slice(0, 3) : items).map((item) => (
          <div key={item.id} className="border border-stone-800 bg-black/40 rounded-lg p-3">
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              className="text-sm text-stone-100 hover:text-emerald-100"
            >
              {item.tethysName}
            </button>
            <p className="text-[10px] text-stone-500 mt-1">{item.realWorldAnalog.organism}</p>
            {!compact && (
              <>
                <p className="text-[11px] text-emerald-200 mt-2 italic">{item.oracleNotes}</p>
                <div className="mt-2 text-[10px] text-stone-400">
                  Prep: {item.preparation.method.join(' → ')}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-stone-500">
        Timing over quantity. Sequence over strength.
      </div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
