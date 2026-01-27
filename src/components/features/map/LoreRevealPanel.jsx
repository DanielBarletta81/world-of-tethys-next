'use client';

import { useMemo, useState } from 'react';

const FOUNDATIONS = [
  {
    title: 'Tethyan Heat Engine (~111 Ma)',
    science: 'Circum-global current redistributed solar energy, stabilizing thermal gradients.',
    reveal: '“Sync” is the Engine itself. When the Wallace-Rift slipped, the Great Inundation began.'
  },
  {
    title: 'Purple Ocean (OAE 1b)',
    science: 'Photic Zone Euxinia raised hydrogen sulfide; sulfur bacteria stained the sea.',
    reveal: '“Purple Years” were chemical, not poetic. Survivors hid in high caves like Pteros-4.'
  },
  {
    title: 'Kohistan–Ladakh Arc',
    science: 'A 2,000‑km intra‑oceanic arc with stealth eruptions and calc‑alkaline ash.',
    reveal: 'Watcher Volcano marks the arc; the Ash Curtain is its living output.'
  }
];

const ECHO_NODES = [
  {
    location: 'Apulia Platform',
    proxy: 'Adria Microplate',
    seed: 'Island Rule: ration discipline during isolated reef cycles.'
  },
  {
    location: 'Frenelopsis Belts',
    proxy: 'Cheirolepidiaceae “mangroves”',
    seed: 'Breath‑Gate Protocol: pollen scum filtered with resin pastes.'
  },
  {
    location: 'Rudist Meadows',
    proxy: 'Hippuritida bivalve reefs',
    seed: 'Shadow Hunt: grate sluices mimic upright cones to break ambush lanes.'
  },
  {
    location: 'Biolume Deep',
    proxy: 'Dinoflagellate radiation',
    seed: 'Burglar Alarm: stillness to avoid biolume flashes.'
  }
];

const SURVIVAL_PROTOCOLS = [
  {
    title: 'Reading the Tide (Pteros Outpost)',
    detail: 'Slack tide is frenzy; storm churn grounds aerial hunters and disperses bait.'
  },
  {
    title: 'Tectonic Foresight (Wallace‑Rift)',
    detail: 'Sync nodes map seafloor instability; low resonance warns of seiche surges.'
  },
  {
    title: 'Atmospheric Aerobics',
    detail: 'High‑oxygen eras amplify fire cycles; movement shifts to colder silicate intervals.'
  }
];

const FUNGAL_LEGACY = [
  {
    title: 'Post‑Extinction Bloom',
    detail: 'After the Great Inundation, collapse of forests fed a fungal spike. Kith colonized the Old City.'
  },
  {
    title: 'Saprotrophic Engine',
    detail: 'Root‑Healers honor decay as reset; mycelium turns ruin into fuel.'
  }
];

const FUNGAL_ANALOGS = [
  {
    name: 'Lyco‑Spore Puffballs',
    basis: 'Lycoperdon',
    seed: 'Coagulant for basalt‑shatter wounds; field medicine of Root Healers.'
  },
  {
    name: 'Choir‑Haze Mycelium',
    basis: 'Mycorrhizae',
    seed: 'Powderdust spores induce “Choir Haze,” enabling Cambric marginalia listening.'
  },
  {
    name: 'Vitrified Prototaxites',
    basis: 'Prototaxites',
    seed: 'Pillar fungi; “Dead Stone” predecessors mimicked by Vane concrete.'
  },
  {
    name: 'Spore‑Drop Threads',
    basis: 'Hyphae',
    seed: 'Kith neural mesh; encrypted packets through soil when signals fail.'
  }
];

export default function LoreRevealPanel({
  className = '',
  mycorrhizalActive,
  onMycorrhizalChange,
  foodWebActive,
  onFoodWebChange
}) {
  const [open, setOpen] = useState(true);
  const isMycorrhizalOn = mycorrhizalActive ?? false;
  const isFoodWebOn = foodWebActive ?? false;
  const panelId = useMemo(() => 'tethys-lore-reveal', []);

  if (!open) {
    return (
      <button
        type="button"
        aria-label="Open lore reveal"
        onClick={() => setOpen(true)}
        className={`group absolute bottom-6 left-6 z-40 h-12 w-12 rounded-full border border-stone-700/70 bg-black/70 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur ${className}`}
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(245,158,11,0.35),transparent_60%)] opacity-60" />
        <span className="relative text-[10px] uppercase tracking-[0.25em] text-amber-300">Lore</span>
      </button>
    );
  }

  return (
    <section
      id={panelId}
      aria-label="Lore reveal"
      className={`absolute bottom-6 left-6 z-40 w-[min(90vw,520px)] rounded-2xl border border-stone-800 bg-black/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">Lore Reveal</p>
          <h3 className="mt-1 text-xl text-stone-100 font-serif">Tethys in Deep Time</h3>
          <p className="mt-2 text-xs text-stone-400">
            Survival by reasoning, anchored to real geologic pressure points.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMycorrhizalChange?.(!isMycorrhizalOn)}
            className={`text-[10px] uppercase tracking-[0.3em] px-3 py-2 rounded-full border transition-colors ${
              isMycorrhizalOn
                ? 'border-cyan-400/70 text-cyan-200 bg-cyan-900/20'
                : 'border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500'
            }`}
          >
            Mycorrhizal Layer
          </button>
          <button
            type="button"
            onClick={() => onFoodWebChange?.(!isFoodWebOn)}
            className={`text-[10px] uppercase tracking-[0.3em] px-3 py-2 rounded-full border transition-colors ${
              isFoodWebOn
                ? 'border-cyan-400/70 text-cyan-200 bg-cyan-900/20'
                : 'border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500'
            }`}
          >
            Food Web
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[10px] uppercase tracking-[0.3em] text-stone-400 border border-stone-700 px-3 py-2 rounded-full hover:text-stone-200 hover:border-stone-500 transition-colors"
          >
            Fold
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4 text-[12px] text-stone-300">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">Foundations</p>
          <div className="mt-2 space-y-2">
            {FOUNDATIONS.map((item) => (
              <div key={item.title} className="border border-stone-800 rounded-lg p-3 bg-black/40">
                <p className="text-sm text-stone-100">{item.title}</p>
                <p className="text-[11px] text-stone-400 mt-1">{item.science}</p>
                <p className="text-[11px] text-amber-200 mt-2 italic">{item.reveal}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300/80">Echo Nodes</p>
          <div className="mt-2 grid gap-2">
            {ECHO_NODES.map((node) => (
              <div key={node.location} className="border border-stone-800 rounded-lg p-3 bg-black/40">
                <p className="text-sm text-stone-100">{node.location}</p>
                <p className="text-[11px] text-stone-400">{node.proxy}</p>
                <p className="text-[11px] text-stone-300 mt-1">{node.seed}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/80">Survival Protocols</p>
          <div className="mt-2 space-y-2">
            {SURVIVAL_PROTOCOLS.map((item) => (
              <div key={item.title} className="border border-stone-800 rounded-lg p-3 bg-black/40">
                <p className="text-sm text-stone-100">{item.title}</p>
                <p className="text-[11px] text-stone-300 mt-1">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300/80">Fungal Legacy</p>
          <div className="mt-2 space-y-2">
            {FUNGAL_LEGACY.map((item) => (
              <div key={item.title} className="border border-stone-800 rounded-lg p-3 bg-black/40">
                <p className="text-sm text-stone-100">{item.title}</p>
                <p className="text-[11px] text-stone-300 mt-1">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-teal-300/80">Fungal Analogs</p>
          <div className="mt-2 space-y-2">
            {FUNGAL_ANALOGS.map((item) => (
              <div key={item.name} className="border border-stone-800 rounded-lg p-3 bg-black/40">
                <p className="text-sm text-stone-100">{item.name}</p>
                <p className="text-[11px] text-stone-400">{item.basis}</p>
                <p className="text-[11px] text-stone-300 mt-1">{item.seed}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-stone-500">
            Toggle to reveal subterranean Kith signal routes on the map.
          </p>
        </div>
      </div>
    </section>
  );
}
// World of Tethys || D.C. Barletta
