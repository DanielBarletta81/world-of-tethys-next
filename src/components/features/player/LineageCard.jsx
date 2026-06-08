'use client';

/**
 * LineageCard — post-authentication display of the player's faction DNA.
 * Shows dominant lineage with faction color, faction weights as a bar chart,
 * active hybrids, galvanized traits, and accolade count.
 *
 * Used in: IdentityAirLock (after woven), portal/page.js auth strip,
 *          and eventually the player profile page.
 */

import { useMemo } from 'react';

// Faction config — mirrors lineage-registry.js but kept local to avoid
// loading the full registry into the auth modal bundle
const FACTION_CONFIG = {
  thal: {
    label: 'Thal',
    sublabel: 'Nomadic Apex · Animal Bond',
    sym: 'T',
    color: '#d97706',       // amber
    bg: 'bg-amber-950/40',
    border: 'border-amber-700/40',
    text: 'text-amber-300',
    glow: '0 0 32px rgba(217,119,6,0.35)',
    bar: 'bg-amber-500',
  },
  silurian: {
    label: 'Silurian',
    sublabel: 'Wetland Engineers · Estuary Adapted',
    sym: 'S',
    color: '#0891b2',       // cyan
    bg: 'bg-cyan-950/40',
    border: 'border-cyan-700/40',
    text: 'text-cyan-300',
    glow: '0 0 32px rgba(8,145,178,0.35)',
    bar: 'bg-cyan-500',
  },
  triumvirate: {
    label: 'Triumvirate',
    sublabel: 'City Doctrine · Vertical Hierarchy',
    sym: 'C',
    color: '#7c3aed',       // violet
    bg: 'bg-violet-950/40',
    border: 'border-violet-700/40',
    text: 'text-violet-300',
    glow: '0 0 32px rgba(124,58,237,0.35)',
    bar: 'bg-violet-500',
  },
  mystic: {
    label: 'Mystic',
    sublabel: 'Root Whisperer · Kith Network',
    sym: 'M',
    color: '#059669',       // emerald
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-700/40',
    text: 'text-emerald-300',
    glow: '0 0 32px rgba(5,150,105,0.35)',
    bar: 'bg-emerald-500',
  },
};

const SYM_TO_ID = { T: 'thal', S: 'silurian', C: 'triumvirate', M: 'mystic' };

const PLATE_LABELS = [
  '', 'Scute Cluster', 'Partial Dorsal', '5-Row Pattern', 'Lateral Plates', 'Full Ironback', 'Old One',
];

// ── Weight bar row ────────────────────────────────────────────────────────────
function WeightRow({ sym, value }) {
  const id = SYM_TO_ID[sym];
  const cfg = FACTION_CONFIG[id];
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <span className={`w-16 text-[10px] uppercase tracking-[0.2em] ${cfg.text} flex-shrink-0`}>
        {cfg.label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-stone-800">
        <div
          className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-stone-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LineageCard({ lineage, compact = false }) {
  const dom = lineage?.dominantLineage;
  const cfg = dom ? FACTION_CONFIG[dom] : FACTION_CONFIG.mystic;
  const weights = lineage?.factionWeights ?? { T: 0.25, S: 0.25, C: 0.25, M: 0.25 };
  const isNew = !dom || (lineage?.totalEvents ?? 0) === 0;

  const sortedSyms = useMemo(() =>
    ['T', 'S', 'C', 'M'].sort((a, b) => (weights[b] ?? 0) - (weights[a] ?? 0)),
    [weights]
  );

  if (isNew) {
    return (
      <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Lineage Forming</p>
        <p className="mt-2 text-xs text-stone-400">Explore the map to reveal your heritage.</p>
        <div className="mt-3 flex gap-1 justify-center">
          {['T','S','C','M'].map((s) => (
            <span key={s} className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono text-stone-600 border border-stone-800">
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4 space-y-3`}
      style={{ boxShadow: cfg.glow }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-[10px] uppercase tracking-[0.35em] ${cfg.text}`}>
            Dominant Lineage
          </p>
          <p className={`mt-0.5 text-lg font-tethys-volcanic ${cfg.text} leading-tight`}>
            {cfg.label}
          </p>
          {!compact && (
            <p className="text-[10px] text-stone-400 mt-0.5">{cfg.sublabel}</p>
          )}
        </div>
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-full border ${cfg.border} flex items-center justify-center`}
          style={{ boxShadow: cfg.glow }}
        >
          <span className={`font-mono text-sm font-bold ${cfg.text}`}>{cfg.sym}</span>
        </div>
      </div>

      {/* Faction weight bars */}
      {!compact && (
        <div className="space-y-1.5">
          {sortedSyms.map((s) => (
            <WeightRow key={s} sym={s} value={weights[s] ?? 0} />
          ))}
        </div>
      )}

      {/* Silurian plate tier */}
      {(lineage?.siluriianPlateTier ?? 0) > 0 && (
        <div className={`rounded-lg border border-cyan-800/30 bg-cyan-950/20 px-3 py-1.5`}>
          <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400/80">
            Ironback Plating — Tier {lineage.siluriianPlateTier}
          </p>
          <p className="text-[11px] text-cyan-300/70 mt-0.5">
            {PLATE_LABELS[lineage.siluriianPlateTier]}
          </p>
        </div>
      )}

      {/* Active hybrids */}
      {(lineage?.activeHybrids?.length ?? 0) > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1.5">
            Hybrid Expressions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {lineage.activeHybrids.map((id) => (
              <span
                key={id}
                className="rounded-full border border-stone-600/50 bg-stone-800/50 px-2.5 py-0.5 text-[10px] text-stone-300 capitalize"
              >
                {id.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Galvanized traits */}
      {(lineage?.galvanizedTraits?.length ?? 0) > 0 && !compact && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1.5">
            Galvanized
          </p>
          <div className="flex flex-wrap gap-1.5">
            {lineage.galvanizedTraits.map((t) => (
              <span
                key={t}
                className="rounded-full border border-amber-700/40 bg-amber-950/30 px-2.5 py-0.5 text-[10px] text-amber-300 capitalize"
              >
                {t.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="flex gap-4 pt-1 border-t border-stone-800">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-stone-600">Regions</p>
          <p className="text-[11px] text-stone-300">{lineage?.discoveredRegions?.length ?? 0}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-stone-600">Events</p>
          <p className="text-[11px] text-stone-300">{lineage?.totalEvents ?? 0}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-stone-600">Accolades</p>
          <p className="text-[11px] text-stone-300">{lineage?.accolades?.length ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
