'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getRegion } from '@/data/region-registry';
import { FOOD_WEB_NODES, TROPHIC_TRACKS } from '@/data/tethys-food-web';
import OraclePool from './OraclePool';
import { useAuth } from '@/context/AuthContext';

// ── Auth gate nudge — shown in Field/Artifact tabs when not signed in ─────────
function AuthNudge({ onSignIn }) {
  return (
    <div className="rounded-xl border border-stone-800/50 bg-stone-900/30 p-4 text-center space-y-2">
      <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-mono">Field Record</p>
      <p className="text-[11px] text-stone-400 leading-relaxed">
        Sign in to access chapter references, sensory logs, and recovered artifacts.
      </p>
      <button
        type="button"
        onClick={onSignIn}
        className="mt-1 px-4 py-1.5 rounded-full border border-emerald-700/40 text-[10px] uppercase tracking-[0.25em] text-emerald-400 hover:border-emerald-500/60 hover:text-emerald-300 transition-colors"
      >
        Weave Signal →
      </button>
    </div>
  );
}

// ── Static deep-lore content (shown when no region is selected) ──────────────
const FOUNDATIONS = [
  {
    title: 'Tethyan Heat Engine (~111 Ma)',
    science: 'Circum-global current redistributed solar energy, stabilizing thermal gradients.',
    reveal: '"Sync" is the Engine itself. When the Wallace-Rift slipped, the Great Inundation began.'
  },
  {
    title: 'Purple Ocean (OAE 1b)',
    science: 'Photic Zone Euxinia raised hydrogen sulfide; sulfur bacteria stained the sea.',
    reveal: '"Purple Years" were chemical, not poetic. Survivors hid in high caves like Pteros-4.'
  },
  {
    title: 'Kohistan–Ladakh Arc',
    science: 'A 2,000‑km intra‑oceanic arc with stealth eruptions and calc‑alkaline ash.',
    reveal: 'Watcher Volcano marks the arc; the Ash Curtain is its living output.'
  }
];

// ── Terrain hazard badge colors ───────────────────────────────────────────────
const HAZARD_COLORS = {
  'ashfall': 'border-orange-700/50 bg-orange-950/40 text-orange-300',
  'sulfur plumes': 'border-yellow-700/50 bg-yellow-950/40 text-yellow-300',
  'predator ambush': 'border-red-700/50 bg-red-950/40 text-red-300',
  'predator wake': 'border-red-700/50 bg-red-950/40 text-red-300',
  'toxic bloom': 'border-emerald-700/50 bg-emerald-950/40 text-emerald-300',
  'lumen fog': 'border-teal-700/50 bg-teal-950/40 text-teal-300',
  'flood pulses': 'border-blue-700/50 bg-blue-950/40 text-blue-300',
  'current shear': 'border-blue-700/50 bg-blue-950/40 text-blue-300',
  'anoxic pulses': 'border-purple-700/50 bg-purple-950/40 text-purple-300',
  'default': 'border-stone-700/50 bg-stone-900/40 text-stone-400',
};

function hazardColor(h) {
  return HAZARD_COLORS[h.toLowerCase()] || HAZARD_COLORS.default;
}

// ── Region panel ──────────────────────────────────────────────────────────────
function RegionPanel({ region, isAuthenticated, onSignIn, unlockedHidden = new Set(), stillnessLevel = 0, rumbleIntensity = 0, stormFrontActive = false, selectedRegionId = null }) {
  const [tab, setTab] = useState('lore');

  const tabs = [
    { id: 'lore', label: 'Lore' },
    { id: 'field', label: 'Field' },
    { id: 'artifact', label: 'Artifact' },
    ...(region.foodWeb ? [{ id: 'foodweb', label: 'Food Web' }] : []),
  ];

  return (
    <div className="space-y-4">
      {/* Hero image */}
      {region.images?.hero && (
        <div className="relative h-36 w-full overflow-hidden rounded-xl border border-stone-800">
          <Image
            src={region.images.hero}
            alt={region.label}
            fill
            className="object-cover object-center brightness-75"
            sizes="360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/90">{region.lore.era}</p>
            <p className="text-lg font-tethys-volcanic text-stone-100 leading-tight">{region.label}</p>
            <p className="text-[11px] text-stone-400">{region.sublabel}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-800 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] rounded-t transition-colors ${
              tab === t.id
                ? 'text-amber-300 border-b-2 border-amber-400'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lore tab */}
      {tab === 'lore' && (
        <div className="space-y-3 text-[12px]">
          <p className="text-stone-300 leading-relaxed">{region.lore.history}</p>

          <div className="rounded-lg border border-stone-800 bg-black/40 p-3 space-y-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Biome</span>
              <p className="text-stone-300 mt-0.5">{region.lore.biome}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Real Analog</span>
              <p className="text-stone-400 mt-0.5 italic">{region.lore.realWorldAnalog}</p>
            </div>
            {region.lore.factionLink && (
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Faction</span>
                <p className="text-stone-300 mt-0.5">{region.lore.factionLink}</p>
              </div>
            )}
          </div>

          {/* Terrain hazards */}
          {region.terrain?.hazards?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">Active Hazards</p>
              <div className="flex flex-wrap gap-1.5">
                {region.terrain.hazards.map((h) => (
                  <span
                    key={h}
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] ${hazardColor(h)}`}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sub-locations */}
          {region.subLocations?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">Known Sites</p>
              <div className="space-y-1.5">
                {region.subLocations.map((s) => (
                  <div key={s.id} className="rounded-lg border border-stone-800/60 bg-black/30 px-3 py-2">
                    <p className="text-[11px] font-semibold text-stone-200">{s.name}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trade routes */}
          {region.lore.tradeRoutes?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1.5">Trade Routes</p>
              <div className="flex flex-wrap gap-1.5">
                {region.lore.tradeRoutes.map((r) => (
                  <span key={r} className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-2.5 py-0.5 text-[10px] text-cyan-300">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Field tab (book context) */}
      {tab === 'field' && (
        <div className="space-y-3 text-[12px]">
          {!isAuthenticated ? (
            <AuthNudge onSignIn={onSignIn} />
          ) : (
            <>
              {region.book?.chapter && (
                <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 p-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400/80">Chapter Reference</p>
                  <p className="text-amber-200 font-semibold mt-1">{region.book.chapter}</p>
                </div>
              )}
              {region.book?.sensory && (
                <div className="rounded-lg border border-stone-800 bg-black/40 p-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1.5">Sensory Record</p>
                  <p className="text-stone-300 leading-relaxed italic">{region.book.sensory}</p>
                </div>
              )}
              {region.book?.event && (
                <div className="rounded-lg border border-stone-800 bg-black/40 p-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1.5">Key Event</p>
                  <p className="text-stone-300 leading-relaxed">{region.book.event}</p>
                </div>
              )}
              {region.book?.characters?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1.5">Characters Present</p>
                  <div className="flex flex-wrap gap-1.5">
                    {region.book.characters.map((c) => (
                      <span key={c} className="rounded-full border border-stone-700/60 bg-stone-900/50 px-2.5 py-0.5 text-[10px] text-stone-300">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {region.images?.character && (
                <div className="relative h-40 rounded-xl border border-stone-800 overflow-hidden">
                  <Image src={region.images.character} alt="Character" fill className="object-cover object-top brightness-80" sizes="360px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
              )}
              <div className="rounded-lg border border-stone-800 bg-black/40 p-3 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-[0.2em]">Substrate</span>
                  <p className="text-stone-300 mt-0.5">{region.terrain.substrate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-[0.2em]">Terrain</span>
                  <p className="text-stone-300 mt-0.5">{region.terrain.type}</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Artifact tab */}
      {tab === 'artifact' && (
        <div className="space-y-3 text-[12px]">
          {!isAuthenticated ? (
            <>
              {region.artifact && (
                <div className="rounded-xl border border-amber-900/30 bg-amber-950/10 p-4 opacity-60">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-amber-600/60">Recovered Artifact</p>
                  <p className="text-lg font-tethys-volcanic text-amber-400/60 mt-2">{region.artifact.name}</p>
                  <p className="text-[10px] text-amber-700/50 mt-1">{region.artifact.class}</p>
                  <p className="text-stone-600 mt-2 text-[11px] italic">Field note sealed — sign in to read.</p>
                </div>
              )}
              <AuthNudge onSignIn={onSignIn} />
            </>
          ) : (
            <>
              {region.artifact ? (
                <div className="rounded-xl border border-amber-900/40 bg-gradient-to-b from-amber-950/20 to-black/40 p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400/70">Recovered Artifact</p>
                  <p className="text-xl font-tethys-volcanic text-amber-200 mt-2 leading-tight">{region.artifact.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500/70 mt-1">{region.artifact.class}</p>
                  <p className="text-stone-300 mt-3 leading-relaxed">{region.artifact.note}</p>
                </div>
              ) : (
                <p className="text-stone-500 text-[12px] italic">No artifact recovered from this region.</p>
              )}
              {region.myths?.length > 0 && (
                <div className="rounded-lg border border-stone-800 bg-black/30 p-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">Myth Threads</p>
                  <div className="flex flex-wrap gap-1.5">
                    {region.myths.map((m) => (
                      <span key={m} className="rounded-full border border-purple-700/40 bg-purple-950/30 px-2.5 py-0.5 text-[10px] text-purple-300 capitalize">{m.replace(/-/g, ' ')}</span>
                    ))}
                  </div>
                </div>
              )}
              {region.creatures?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">Observed Fauna</p>
                  <div className="flex flex-wrap gap-1.5">
                    {region.creatures.map((c) => (
                      <span key={c} className="rounded-full border border-red-900/40 bg-red-950/20 px-2.5 py-0.5 text-[10px] text-red-300 capitalize">{c.replace(/_hero$/, '').replace(/_/g, ' ')}</span>
                    ))}
                  </div>
                </div>
              )}
              <Link href={`/world-of-tethys/${region.id}`} className="mt-2 flex items-center gap-2 rounded-full border border-stone-700 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-stone-300 hover:border-amber-500/50 hover:text-amber-200 transition-colors">
                Explore Region →
              </Link>
            </>
          )}

          {/* Oracle Pool — surfaces silently for Mystic Woods after deep_dwell unlock */}
          {region.id === 'mystic-woods' && (
            <OraclePool
              isUnlocked={unlockedHidden.has('oracle-pool')}
              currentRegion={selectedRegionId}
              stillnessLevel={stillnessLevel}
              rumbleIntensity={rumbleIntensity}
              stormFrontActive={stormFrontActive}
            />
          )}
        </div>
      )}

      {/* Food Web tab */}
      {tab === 'foodweb' && region.foodWeb && (
        <div className="space-y-3 text-[12px]">
          {/* Track badge */}
          <div className={`rounded-lg border px-3 py-2 ${
            region.foodWeb.dominantTrack === TROPHIC_TRACKS.CHEMO
              ? 'border-cyan-700/40 bg-cyan-950/20'
              : region.foodWeb.dominantTrack === TROPHIC_TRACKS.PHOTO
              ? 'border-emerald-700/40 bg-emerald-950/20'
              : 'border-amber-700/40 bg-amber-950/20'
          }`}>
            <p className={`text-[10px] uppercase tracking-[0.3em] ${
              region.foodWeb.dominantTrack === TROPHIC_TRACKS.CHEMO ? 'text-cyan-400' :
              region.foodWeb.dominantTrack === TROPHIC_TRACKS.PHOTO ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {region.foodWeb.dominantTrack === TROPHIC_TRACKS.CHEMO ? '⚗ Chemosynthetic Primary' :
               region.foodWeb.dominantTrack === TROPHIC_TRACKS.PHOTO ? '☀ Photosynthetic Primary' :
               '⚖ Mixed Dual-Track'}
            </p>
          </div>

          {/* Trophic chain — sorted by tier */}
          <div className="space-y-1.5">
            {FOOD_WEB_NODES
              .filter((n) => region.foodWeb.nodes.includes(n.id))
              .sort((a, b) => a.tier - b.tier)
              .map((node) => (
                <div
                  key={node.id}
                  className="flex gap-2.5 items-start rounded-lg border border-stone-800/60 bg-black/30 px-3 py-2"
                >
                  <div
                    className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: node.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[11px] font-semibold text-stone-200">{node.label}</p>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-stone-600">
                        Tier {node.tier}
                      </span>
                      <span className={`text-[9px] uppercase tracking-[0.15em] ${
                        node.track === TROPHIC_TRACKS.CHEMO ? 'text-cyan-500' :
                        node.track === TROPHIC_TRACKS.PHOTO ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {node.track === TROPHIC_TRACKS.CHEMO ? 'chemo' :
                         node.track === TROPHIC_TRACKS.PHOTO ? 'photo' : 'mixed'}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 italic mt-0.5 leading-relaxed">{node.role}</p>
                    {node.survivalNote && (
                      <p className="text-[10px] text-red-400/80 mt-0.5">⚠ {node.survivalNote}</p>
                    )}
                    {node.survivalBonus && (
                      <p className="text-[10px] text-emerald-400/80 mt-0.5">↑ {node.survivalBonus}</p>
                    )}
                  </div>
                </div>
              ))
            }
          </div>

          {/* OAE response */}
          <div className="rounded-lg border border-purple-800/30 bg-purple-950/15 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-purple-400/80 mb-1">OAE Response</p>
            <p className="text-[11px] text-purple-300/80 leading-relaxed">{region.foodWeb.oaeResponse}</p>
          </div>

          {/* Hazard note */}
          {region.foodWeb.hazardNote && (
            <div className="rounded-lg border border-red-800/30 bg-red-950/15 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-red-400/80 mb-1">Field Hazard</p>
              <p className="text-[11px] text-red-300/80 leading-relaxed">{region.foodWeb.hazardNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Static deep-lore fallback (no region selected) ────────────────────────────
function StaticLoreContent() {
  return (
    <div className="space-y-4 text-[12px] text-stone-300">
      <p className="text-stone-400 text-[11px]">Select a marker on the map to reveal region lore, field records, and recovered artifacts.</p>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80 mb-2">Foundations</p>
        <div className="space-y-2">
          {FOUNDATIONS.map((item) => (
            <div key={item.title} className="border border-stone-800 rounded-lg p-3 bg-black/40">
              <p className="text-sm text-stone-100">{item.title}</p>
              <p className="text-[11px] text-stone-400 mt-1">{item.science}</p>
              <p className="text-[11px] text-amber-200 mt-2 italic">{item.reveal}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main panel component ──────────────────────────────────────────────────────
export default function LoreRevealPanel({
  className = '',
  selectedRegionId = null,
  onRegionOpen = null,
  mycorrhizalActive,
  onMycorrhizalChange,
  foodWebActive,
  onFoodWebChange,
  unlockedHidden = new Set(),
  stillnessLevel = 0,
  rumbleIntensity = 0,
  stormFrontActive = false,
  onSignIn = null,   // callback to open IdentityAirLock from map page
}) {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const [open, setOpen] = useState(true);
  const isMycorrhizalOn = mycorrhizalActive ?? false;
  const isFoodWebOn = foodWebActive ?? false;
  const panelId = useMemo(() => 'tethys-lore-reveal', []);

  const region = selectedRegionId ? getRegion(selectedRegionId) : null;

  // Notify parent (→ dwell tracker → Firestore) whenever a region lore is opened
  useEffect(() => {
    if (selectedRegionId && open) {
      onRegionOpen?.(selectedRegionId);
    }
  }, [selectedRegionId, open, onRegionOpen]);

  if (!open) {
    return (
      <button
        type="button"
        aria-label="Open lore reveal"
        onClick={() => setOpen(true)}
        className={`group flex items-center justify-center h-12 w-12 rounded-full border border-stone-700/70 bg-black/70 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur ${className}`}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300">Lore</span>
      </button>
    );
  }

  return (
    <section
      id={panelId}
      aria-label="Region lore panel"
      className={`w-full rounded-2xl border border-stone-800 bg-black/85 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur ${className}`}
    >
      {/* Panel header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
            {region ? 'Region Intel' : 'Atlas Lore'}
          </p>
          <h3 className="mt-0.5 text-base text-stone-100 font-tethys-volcanic">
            {region ? region.label : 'Tethys in Deep Time'}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => onMycorrhizalChange?.(!isMycorrhizalOn)}
            className={`text-[9px] uppercase tracking-[0.25em] px-2.5 py-1.5 rounded-full border transition-colors ${
              isMycorrhizalOn
                ? 'border-emerald-400/60 text-emerald-200 bg-emerald-900/20'
                : 'border-stone-700 text-stone-500 hover:text-stone-300'
            }`}
          >
            Myco
          </button>
          <button
            type="button"
            onClick={() => onFoodWebChange?.(!isFoodWebOn)}
            className={`text-[9px] uppercase tracking-[0.25em] px-2.5 py-1.5 rounded-full border transition-colors ${
              isFoodWebOn
                ? 'border-cyan-400/60 text-cyan-200 bg-cyan-900/20'
                : 'border-stone-700 text-stone-500 hover:text-stone-300'
            }`}
          >
            Web
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[9px] uppercase tracking-[0.25em] text-stone-500 border border-stone-700 px-2.5 py-1.5 rounded-full hover:text-stone-300 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-700">
        {region ? (
          <RegionPanel
            region={region}
            isAuthenticated={isAuthenticated}
            onSignIn={onSignIn}
            unlockedHidden={unlockedHidden}
            stillnessLevel={stillnessLevel}
            rumbleIntensity={rumbleIntensity}
            stormFrontActive={stormFrontActive}
            selectedRegionId={selectedRegionId}
          />
        ) : <StaticLoreContent />}
      </div>
    </section>
  );
}
// World of Tethys || D.C. Barletta
