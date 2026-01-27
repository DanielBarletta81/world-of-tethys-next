'use client';

import React from 'react';
import TriFoldNav from '@/components/layout/navigation/TriFoldNav';
import PrimaryNav from '@/components/layout/navigation/PrimaryNav';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';

const PEEK_BREADCRUMB = [
  { label: 'Home', href: '/' },
  { label: 'Peek', href: '/peek', current: true }
];

const FACTION_INTEL = [
  {
    id: 'sky-city',
    name: 'Sky City (Triumvirate Copy)',
    voice: 'We rebuilt Tethysia into order. Height is safety; record is mercy.',
    climate: 'High volcanic plateau, thin air, ash-stung seasons.',
    topology: 'Vertical city stacked into basalt spires and cliff lattice.',
    predators: 'Wind-haunting carrion and cliff edge ambushes.',
    prey: 'Ridge birds, ash lizards, salvage herds.',
    civLevel: 'Reconstruction-tier: controlled ascent, strict archive law.',
    warNote: 'First Human War: the Thal–Silurian clash forced the City to rise.'
  },
  {
    id: 'ironwoods',
    name: 'Ironwoods (Canopy Ledger)',
    voice: 'The forest is older than law. Roots decide what climbs and what dies.',
    climate: 'Cool, dense canopy with long dim seasons.',
    topology: 'Root-locked megaforests and suspended corridors.',
    predators: 'Canopy stalkers, root-bound ambushers.',
    prey: 'Bark grazers, fungal herdlets.',
    civLevel: 'Tribal fortresses, canopy law, survival doctrine.',
    warNote: 'Warfront spillover: Ironwoods absorbed the Thal–Silurian pressure.'
  },
  {
    id: 'mystic-woods',
    name: 'Mystic Woods (Veil Whisper)',
    voice: 'We do not take the map. We listen until the map takes us.',
    climate: 'Humid, spore-saturated, soft storm cycles.',
    topology: 'Mutable glades and fungal thresholds.',
    predators: 'Silence hunters, misdirection by the trees.',
    prey: 'Glow-fish, pollen runners, memory keepers.',
    civLevel: 'Low footprint, ritual listening, indirect leadership.',
    warNote: 'First Human War: shielded, but marked by refugees and quiet pacts.'
  },
  {
    id: 'cambria',
    name: 'Cambria (Archive Redaction)',
    voice: 'Destroyed. Submerged. Empty. There is nothing to return to.',
    climate: 'Salt-damp, submerged pockets, cold surface breaks.',
    topology: 'Fractured shelves, drowned archives, collapsed channels.',
    predators: 'Reef-bound scavengers, relic-haunters.',
    prey: 'Shelf crustaceans, wandering scavenger schools.',
    civLevel: 'None. The record is broken.',
    warNote: 'First Human War: archives burned or submerged; memory split.'
  },
  {
    id: 'pteros',
    name: 'Pteros Island (Transit Relay)',
    voice: 'Every path passes through hunger. Pteros keeps the ledger honest.',
    climate: 'Hot estuary, vapor-heavy, sudden squalls.',
    topology: 'Mangrove edges, limestone vents, hatchery flats.',
    predators: 'Aerial packs, estuary hunters.',
    prey: 'Fish runs, hatchlings, tide-swarmed feeders.',
    civLevel: 'Transit hub, provisional order.',
    warNote: 'First Human War: contested supply line and evacuation route.'
  },
  {
    id: 'weep',
    name: 'The Weep (Survivor Record)',
    voice: 'The ledge takes what it wants. The rest of us learn fast.',
    climate: 'Salt-choked, violent mist, perpetual spray.',
    topology: 'Sheer drop shelf into the feeding frenzy below.',
    predators: 'Deep surf predators, cliff rushers.',
    prey: 'Shoreline schools, scavenger swarms.',
    civLevel: 'None. Survivors only.',
    warNote: 'First Human War: exile path and last-resort passage.'
  }
];

export default function CommunityPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif selection:bg-amber-900 selection:text-white relative overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-2 mt-10">
          <PrimaryNav className="mb-1" />
          <BreadcrumbTrail trail={PEEK_BREADCRUMB} />
        </div>
        <TriFoldNav />
        <section className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono">Peek into the World</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-orange-500 to-red-800">
              World Primer
            </h1>
            <p className="text-sm text-stone-400 mt-4 max-w-2xl mx-auto">
              A partial atlas. Each entry is told by the faction that wants it remembered. Time is short. The First Human
              War was driven by Thals and Silurians, spilling into Tethysia and the Ironwoods. These entries stay vague on
              purpose.
            </p>
            <p className="text-xs text-stone-500 mt-3 max-w-2xl mx-auto">
              There are places beyond this map. Some vanished on purpose. Some moved. The record pretends they never
              existed.
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-6 mt-12 grid gap-6 md:grid-cols-2">
            {FACTION_INTEL.map((zone) => (
              <article
                key={zone.id}
                className="rounded-2xl border border-[#2c241f] bg-[#12100e] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400">{zone.name}</div>
                <p className="mt-3 text-xs italic text-stone-400">"{zone.voice}"</p>
                <div className="mt-4 grid gap-3 text-xs text-stone-300">
                  <div>
                    <span className="uppercase tracking-[0.2em] text-stone-500">Climate</span>
                    <p className="mt-1">{zone.climate}</p>
                  </div>
                  <div>
                    <span className="uppercase tracking-[0.2em] text-stone-500">Topology</span>
                    <p className="mt-1">{zone.topology}</p>
                  </div>
                  <div>
                    <span className="uppercase tracking-[0.2em] text-stone-500">Predators</span>
                    <p className="mt-1">{zone.predators}</p>
                  </div>
                  <div>
                    <span className="uppercase tracking-[0.2em] text-stone-500">Prey</span>
                    <p className="mt-1">{zone.prey}</p>
                  </div>
                  <div>
                    <span className="uppercase tracking-[0.2em] text-stone-500">Civilization</span>
                    <p className="mt-1">{zone.civLevel}</p>
                  </div>
                  <div>
                    <span className="uppercase tracking-[0.2em] text-stone-500">First Human War</span>
                    <p className="mt-1">{zone.warNote}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
// World of Tethys || D.C. Barletta
