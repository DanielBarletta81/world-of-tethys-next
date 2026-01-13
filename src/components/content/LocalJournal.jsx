"use client";

import { useEffect, useState } from "react";

/**
 * Local-only journal renderer (reads from localStorage key: tethys_journal_v1).
 * No sync, no identifiers. Entries are stored elsewhere (e.g., OraclePool) and
 * this simply displays them in reverse-chronological order.
 */
export default function LocalJournal({ title = "Field Journal" }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tethys_journal_v1");
      setEntries(raw ? JSON.parse(raw) : []);
    } catch {
      setEntries([]);
    }
  }, []);

  if (!entries.length) {
    return (
      <div className="text-stone-500 text-sm italic">
        {title}: no entries yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-xs uppercase tracking-[0.3em] text-stone-500">{title}</div>
      {entries.map((e) => (
        <div
          key={e.id}
          className={`journal-entry rounded-lg border border-white/5 bg-black/30 p-3 ${
            e.withheld ? "journal--withheld" : ""
          }`}
        >
          <p className="text-sm text-stone-200 leading-relaxed">{e.text}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <span>{e.type ?? "entry"}</span>
            {e.tags?.map((tag) => (
              <span key={tag} className="px-2 py-[2px] rounded-full bg-white/5 text-stone-400">
                {tag}
              </span>
            ))}
            {e.withheld && <span className="text-amber-400">withheld</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// World of Tethys || D.C. Barletta
