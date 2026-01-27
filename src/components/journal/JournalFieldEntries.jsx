"use client";

import { useEffect, useMemo, useState } from "react";

const JOURNAL_KEY = "tethys_journal_v1";

const loadJournal = () => {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Minimal inline stamp set (monochrome, single path)
const STAMP_PATHS = {
  "sky-city": "M6 38 Q32 14 58 38 M20 38 V46 M44 38 V46",
  "mystic-woods": "M32 10 C18 14 14 30 26 36 C38 42 30 54 18 50",
  "watcher-volcano": "M20 12 A20 20 0 0 1 20 52 M44 12 A20 20 0 0 0 44 52",
  ironwood: "M32 8 V56 M18 24 C32 18 46 24 32 32 C18 40 18 24 32 24",
  cambria: "M16 16 H48 V48 H16 Z M16 32 H48",
  pteros: "M10 44 L32 20 L54 44 M32 20 V44",
  gargantua: "M20 44 H44 M16 32 H48 M24 20 H40",
  "thal-regions": "M8 36 C20 28 28 44 40 36 C52 28 56 36 56 36",
  cimmeria: "M32 12 A20 20 0 1 1 31.9 12",
  "watcher-flats": "M8 32 H56 M24 28 V36 M40 28 V36",
};

function Stamp({ id }) {
  const path = STAMP_PATHS[id];
  if (!path) return null;
  return (
    <div className="journal-stamp">
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d={path} stroke="currentColor" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
}

const REGION_LABELS = {
  "sky-city": "Sky City",
  "mystic-woods": "Mystic Woods",
  "watcher-volcano": "Watcher Volcano",
  "ironwood": "Ironwood",
  cambria: "Cambria",
  pteros: "Pteros Island",
  gargantua: "Gargantua",
  "thal-regions": "Thal Regions",
  cimmeria: "Cimmeria",
  "watcher-flats": "Watcher Flats",
};

/**
 * Field entries (world-written) grouped by region. Player cannot edit.
 * Props: open (bool), onClose (fn)
 */
export default function JournalFieldEntries({ open, onClose }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!open) return;
    setEntries(loadJournal().filter((e) => e.type === "field" || e.type === "dream"));
  }, [open]);

  const grouped = useMemo(() => {
    return entries.reduce((acc, e) => {
      const key = e.regionId || "unplaced";
      acc[key] = acc[key] || [];
      acc[key].push(e);
      return acc;
    }, {});
  }, [entries]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9900] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0a09]/92 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs uppercase tracking-[0.35em] text-stone-500">Field Entries</div>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md bg-white/5 text-stone-300 hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(grouped).map(([regionId, regionEntries]) => (
            <div key={regionId} className="border border-white/5 rounded-xl p-4 bg-black/30">
              <div className="flex items-center gap-3 mb-3">
                <Stamp id={regionId} />
                <div className="text-sm uppercase tracking-[0.25em] text-stone-400">
                  {REGION_LABELS[regionId] || "Unplaced"}
                </div>
              </div>

              <div className="space-y-3">
                {regionEntries.map((e) => (
                  <div
                    key={e.id}
                    className={`journal-entry rounded-lg border border-white/5 bg-white/2 p-3 ${
                      e.withheld ? "journal-entry--withheld" : ""
                    }`}
                  >
                    <p className="text-sm text-stone-100 leading-relaxed whitespace-pre-line">{e.text}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                      <span>{e.type}</span>
                      {e.path && <span>{e.path}</span>}
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
            </div>
          ))}

          {!entries.length && (
            <div className="text-stone-500 text-sm italic">No field entries yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// World of Tethys || D.C. Barletta
