'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import PrimaryNav from '@/components/layout/navigation/PrimaryNav';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import NpcRumorCard from '@/components/npc/NpcRumorCard';

const LOCATION_NPCS = {
  ironwoods: {
    id: 'npc-nok',
    name: 'Nok',
    faction: 'ironwood',
    regionId: 'ironwoods',
    regionLabel: 'Ironwood'
  },
  'mount-shastea': {
    id: 'npc-corge',
    name: 'Corge',
    faction: 'scholar-outcast',
    regionId: 'mount-shastea',
    regionLabel: 'Mt Shastea'
  },
  'mammoth-hand-island': {
    id: 'npc-vraga',
    name: 'Vraga',
    faction: 'thal',
    regionId: 'mammoth-hand-island',
    regionLabel: 'Mammoth Hand Island'
  },
  'tethys-estuary': {
    id: 'npc-archyn',
    name: 'Archyn',
    faction: 'lower-tier',
    regionId: 'tethys_estuary',
    regionLabel: 'Lower Tier Coast',
    role: 'Coastal cultivator',
    note: 'Forgot Sky City is divided.'
  }
};

export default function LocationPlaceholder() {
  const params = useParams();
  const slug = params?.slug || 'unknown';

  const formattedSlug = slug
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

  const npc = LOCATION_NPCS[slug];

  const locationBreadcrumb = [
    { label: 'Home', href: '/' },
    { label: 'Locations', href: '/locations' },
    { label: formattedSlug, current: true }
  ];

  return (
    <main className="min-h-screen bg-[#0c0a09] text-stone-200 p-8 pt-32">
      <div className="max-w-7xl mx-auto px-0 space-y-2 pb-8">
        <PrimaryNav className="mb-1" />
        <BreadcrumbTrail trail={locationBreadcrumb} />
      </div>
      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Location Placeholder</p>
        <h1 className="text-4xl font-display">Location: {slug}</h1>
        <p className="text-stone-400">
          This location is not yet mapped. The path will illuminate once the Foundry records are restored.
        </p>
        {npc ? (
          <NpcRumorCard npc={npc} />
        ) : null}
        <Link href="/" className="text-amber-400 underline">Return to Hub</Link>
      </div>
    </main>
  );
}
// World of Tethys || D.C. Barletta
