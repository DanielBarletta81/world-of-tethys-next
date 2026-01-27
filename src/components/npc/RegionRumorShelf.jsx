'use client';

import NpcRumorCard from '@/components/npc/NpcRumorCard';

const REGION_NPCS = [
  {
    id: 'npc-archyn',
    name: 'Archyn',
    faction: 'lower-tier',
    regionId: 'tethys-estuary',
    regionLabel: 'Lower Tier Coast',
    role: 'Coastal cultivator',
    note: 'Forgot Sky City is divided.'
  },
  {
    id: 'npc-marros',
    name: 'Marros',
    faction: 'sky-city',
    regionId: 'sky-city',
    regionLabel: 'Sky City'
  },
  {
    id: 'npc-corge',
    name: 'Corge',
    faction: 'scholar-outcast',
    regionId: 'mount-shastea',
    regionLabel: 'Mt Shastea'
  },
  {
    id: 'npc-ravel',
    name: 'Ravel',
    faction: 'mystic',
    regionId: 'mystic-woods',
    regionLabel: 'Mystic Woods'
  },
  {
    id: 'npc-nok',
    name: 'Nok',
    faction: 'ironwood',
    regionId: 'ironwoods',
    regionLabel: 'Ironwood'
  },
  {
    id: 'npc-vraga',
    name: 'Vraga',
    faction: 'thal',
    regionId: 'mammoth-hand-island',
    regionLabel: 'Mammoth Hand Island'
  }
];

export default function RegionRumorShelf() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Regional Witnesses</p>
        <h3 className="text-xl font-serif text-stone-100">Rumor Drift</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {REGION_NPCS.map((npc) => (
          <NpcRumorCard key={npc.id} npc={npc} />
        ))}
      </div>
    </section>
  );
}
