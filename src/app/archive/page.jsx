"use client";

import React from 'react';
import { ArrowLeft, Skull, Shield, Database, Microscope } from 'lucide-react';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import StrataNav from '@/components/layout/navigation/StrataNav';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import NpcRumorCard from '@/components/npc/NpcRumorCard';

const SkyCityArchiveNpc = nextDynamic(
  () => import('@/components/npc/SkyCityArchiveNpc'),
  { ssr: false }
);

export const dynamic = 'force-dynamic';

const ARCHIVE_BREADCRUMB = [
  { label: 'Home', href: '/' },
  { label: 'Archive', href: '/archive', current: true }
];

const SECTORS = [
  {
    id: 'creature',
    title: 'Xeno-Biology',
    icon: <Skull size={32} className="text-orange-600" />,
    desc: 'Predators, prey, and the titans that once ruled.',
    link: '/archive/creature'
  },
  {
    id: 'faction',
    title: 'Factions',
    icon: <Shield size={32} className="text-orange-600" />,
    desc: 'The Iron-Borers, The Root-Walkers, and the politics of survival.',
    link: '/archive/faction'
  },
  {
    id: 'science',
    title: 'Geophysics',
    icon: <Microscope size={32} className="text-orange-600" />,
    desc: 'Tectonic shifts, atmospheric ash models, and the salinity churn.',
    link: '/archive/science'
  },
  {
    id: 'record',
    title: 'Cambria Fragments',
    icon: <Database size={32} className="text-orange-600" />,
    desc: 'Clay and slate witness fragments: storms, lost peoples, and route knowledge.',
    link: '/archive/cambria'
  }
];

export default function ArchiveIndex() {
  const marrosNpc = {
    id: 'npc-marros',
    name: 'Marros',
    faction: 'sky-city',
    regionId: 'sky-city',
    regionLabel: 'Sky City'
  };

  return (
    <main className="relative min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif bg-stone-grain p-6 md:p-8 pb-36 md:pb-20">

      <div className="max-w-6xl mx-auto px-0 py-8 space-y-2">
        
        <BreadcrumbTrail trail={ARCHIVE_BREADCRUMB} />
      </div>

      {/* NAV */}
        <div className="max-w-6xl mx-auto mb-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716c] hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={14} />
            Return
          </Link>
          <StrataNav />
        </div>

        {/* HEADER */}
      <header className="max-w-6xl mx-auto text-center mb-24 px-2">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-forge uppercase tracking-tighter mb-6">
          The Deep Archives
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-900 to-transparent mx-auto"></div>
        <p className="mt-6 text-[#a8a29e] italic max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
          "Knowledge is heavy. Carry only what you can defend."
        </p>
      </header>

      <div className="max-w-6xl mx-auto mb-16 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <SkyCityArchiveNpc />
        <NpcRumorCard npc={marrosNpc} />
      </div>

      {/* SECTOR GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTORS.map((sector) => (
          <Link 
            key={sector.id} 
            href={sector.link}
            className="group bg-[#1c1917] border border-[#292524] p-8 hover:border-orange-900/50 transition-all duration-500 relative overflow-hidden flex items-center gap-8"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-4 bg-[#0c0a09] border border-[#292524] rounded-full group-hover:border-orange-900/50 transition-colors relative z-10">
              {sector.icon}
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-[#e7e5e4] mb-2 font-serif uppercase tracking-wide group-hover:text-orange-100">
                {sector.title}
              </h2>
              <p className="text-sm text-[#78716c] leading-relaxed group-hover:text-[#a8a29e]">
                {sector.desc}
              </p>
            </div>

            {/* Corner Bracket */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#292524] group-hover:border-orange-900/30 transition-colors"></div>
          </Link>
        ))}
      </div>

    </main>
  );
}
// World of Tethys || D.C. Barletta
