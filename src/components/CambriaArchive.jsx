'use client';

import MineralMap from '@/components/MineralMap';

const legends = [
  { color: 'bg-[#06b6d4]', label: 'Quartz / Amethyst (energy stores)' },
  { color: 'bg-[#10b981]', label: 'Evaporites (Halite, Gypsum)' },
  { color: 'bg-[#f43f5e]', label: 'Emerald / Garnet (high-pressure pods)' },
  { color: 'bg-[#f59e0b]', label: 'Sulfur / Iron Oolites' },
  { color: 'bg-[#22c55e]', label: 'Copper Carbonates (Malachite)' },
  { color: 'bg-[#38bdf8]', label: 'Turquoise Veins' }
];

const hierarchy = [
  { title: 'The High Council', desc: 'Keepers of the Source Code', color: 'border-amber-500 text-amber-400 bg-amber-900/15' },
  { title: 'Bio-Architects', desc: 'Designers of Flesh & Bone', color: 'border-emerald-600 text-emerald-400 bg-emerald-900/15' },
  { title: 'The Symbiotes', desc: 'Integrated Citizenry & Handlers', color: 'border-cyan-600 text-cyan-300 bg-cyan-900/10' },
  { title: 'The Vat-Born', desc: 'Servitor Hybrids & Labor Beasts', color: 'border-stone-700 text-stone-300 bg-stone-900/40' }
];

export default function CambriaArchive() {
  return (
    <div className="space-y-12">
      <header className="text-center space-y-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono">Cambria Archive</p>
        <h1 className="text-4xl md:text-5xl font-header text-stone-100">The Genetic Forge of the Cretaceous</h1>
        <p className="max-w-3xl mx-auto text-stone-400 text-sm md:text-base leading-relaxed">
          Beneath the ancient Tethys, Cambria thrived on biology, not steel. DNA from theropods, sauropods, pterosaurs, and marine reptiles
          became living infrastructure. These mineral anchors mark caches of that era.
        </p>
      </header>

      <MineralMap />

      <section className="bg-[#0c0a09] border border-amber-800/30 rounded-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] space-y-4">
        <h2 className="text-2xl font-header text-stone-100 flex items-center gap-2">
          DNA Source Code
        </h2>
        <p className="text-stone-400 text-sm">
          Cambria’s architects borrowed from giants: Theropod DNA for aggression, Sauropod mass for structure, Pterosaur agility for relays, and
          marine reptile lungs for amphibious work. Symbiosis—flora or fauna paired to a host—multiplied survival in oxygen-rich, predator-dense seas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-stone-300">
          <div className="bg-[#1a120e] border border-amber-800/40 rounded p-4">
            <p className="text-amber-400 text-xs uppercase tracking-[0.2em]">111 MYA</p>
            <p className="text-lg font-bold text-stone-100">Temporal Anchor</p>
            <p className="text-stone-500 text-xs">Aptian/Albian stage; closure of Tethys margins.</p>
          </div>
          <div className="bg-[#0f0b09] border border-stone-700/60 rounded p-4">
            <p className="text-emerald-400 text-xs uppercase tracking-[0.2em]">4,200+</p>
            <p className="text-lg font-bold text-stone-100">Viable Chimeras</p>
            <p className="text-stone-500 text-xs">Cataloged prior to Cascade Failure.</p>
          </div>
          <div className="bg-[#120d0b] border border-amber-700/50 rounded p-4">
            <p className="text-cyan-300 text-xs uppercase tracking-[0.2em]">Zero</p>
            <p className="text-lg font-bold text-stone-100">Mechanical Dependence</p>
            <p className="text-stone-500 text-xs">Infrastructure grown, not forged.</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0c0a09] border border-stone-800 rounded-lg p-5 space-y-3 shadow-inner">
          <h3 className="text-xl font-header text-stone-100">Key Mineral Types</h3>
          <ul className="space-y-2 text-sm text-stone-300">
            {legends.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                {item.label}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-stone-500">
            Anchored to real deposits along the former Tethys margins for geologic plausibility.
          </p>
        </div>

        <div className="bg-[#0f0b09] border border-amber-800/30 rounded-lg p-5 space-y-3">
          <h3 className="text-xl font-header text-stone-100">Engineering Notes</h3>
          <ul className="space-y-2 text-sm text-stone-300">
            <li>Forced Symbiosis: host + flora/fauna pairings to reduce caloric load.</li>
            <li>Hydrodynamic spines and osteoderm plating traded sprint speed for defense.</li>
            <li>Hybrid lungs (mosasaur splice) enabled amphibious guardianship.</li>
            <li>Instability rose during the Mutation Cascade; caches sealed in mineral vaults.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-header text-stone-100 text-center">Cambrian Hierarchy</h3>
        <div className="max-w-2xl mx-auto flex flex-col gap-2 items-center">
          {hierarchy.map((lvl, idx) => (
            <div
              key={lvl.title}
              className={`w-full max-w-[${200 + idx * 120}px] text-center px-4 py-3 border rounded-lg ${lvl.color} shadow-[0_0_20px_rgba(0,0,0,0.35)]`}
            >
              <p className="uppercase tracking-[0.2em] text-sm">{lvl.title}</p>
              <p className="text-[11px] text-stone-400">{lvl.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
