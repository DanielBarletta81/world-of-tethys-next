// src/app/mystics/page.jsx
'use client';

import TriFoldNav from '@/components/layout/navigation/TriFoldNav';
import MysticsClient from '@/components/page-specific/mystics/MysticsClient'; // Contains OraclePool, etc.
import PathSelector from '@/components/features/onboarding/PathSelector';
import StaffSequencer from '@/components/features/onboarding/StaffSequencer';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import NpcRumorCard from '@/components/npc/NpcRumorCard';
import SensoryNetwork from '@/components/SensoryNetwork';
import PithSignals from '@/components/pith/PithSignals';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cdn } from '@/lib/cdn';

export default function MysticsPage() {
  const [activeRitual, setActiveRitual] = useState('path'); 
  const ravelNpc = {
    id: 'npc-ravel',
    name: 'Ravel',
    faction: 'mystic',
    regionId: 'mystic-woods',
    regionLabel: 'Mystic Woods'
  };

  return (
    <div className="min-h-screen bg-[#050404] text-purple-100 font-field">
      <Link
        href="/"
        className="fixed left-4 top-4 z-[10000] inline-flex items-center gap-3 rounded-full border border-purple-900/40 bg-black/70 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-purple-100/90 shadow-[0_12px_30px_rgba(0,0,0,0.45)] backdrop-blur hover:border-amber-400/60 hover:text-amber-100"
      >
        <span className="relative h-9 w-9 overflow-hidden rounded-full border border-amber-400/50 bg-black/40">
          <Image
            src={cdn('/symbols/tethys-seal.png')}
            alt="World of Tethys"
            fill
            sizes="36px"
            className="object-cover"
            priority
          />
        </span>
        Return Home
      </Link>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        Skip to main content
      </a>

      <main role="main" id="main-content" className="pt-20 pb-12 px-6">
        <div className="max-w-5xl mx-auto px-0 space-y-2 mb-8">
          
          <BreadcrumbTrail
            trail={[
              { label: 'Home', href: '/' },
              { label: 'Mystics', href: '/mystics', current: true }
            ]}
          />
        </div>
        <header role="banner" className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-mystic text-purple-400 uppercase tracking-widest mb-4">
            The Veil
          </h1>
          <p className="text-purple-200/50 text-sm max-w-xl mx-auto font-field">
            For the seers. Choose your alignment, forge your staff, and consult the spores.
          </p>
          <div className="mt-6">
            <PithSignals />
          </div>
        </header>

        <TriFoldNav />

      <div className="max-w-5xl mx-auto">
        
        {/* The Ritual Loop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Setup (Path & Staff) */}
          <div className="space-y-8">
            <div className="bg-[#0f0b09] border border-purple-900/30 p-6 rounded-2xl">
              <h2 className="text-xl text-purple-300 font-mystic mb-4">1. Alignment</h2>
              <PathSelector onPathChange={(path) => console.log('Path set:', path)} />
            </div>

            <div className="bg-[#0f0b09] border border-purple-900/30 p-6 rounded-2xl">
              <h2 className="text-xl text-purple-300 font-mystic mb-4">2. The Forge</h2>
              <StaffSequencer />
            </div>

            <div className="bg-[#0f0b09] border border-purple-900/30 p-6 rounded-2xl">
              <h2 className="text-xl text-purple-300 font-mystic mb-4">Ravel</h2>
              <NpcRumorCard npc={ravelNpc} className="border-purple-900/40" />
              <div className="mt-4 border border-purple-900/30 rounded-xl p-4 bg-black/30">
                <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 mb-2">
                  Ravel’s Philosophy
                </p>
                <p className="text-sm text-purple-100/80 italic">
                  “Nothing heals alone. The cure is a memory of the fight it survived.”
                </p>
                <p className="text-xs text-purple-300/70 mt-3">
                  “Preparation is the real ritual: ash, soak, heat, stillness.”
                </p>
              </div>
            </div>
          </div>

          {/* Right: The Oracles (Existing Component) */}
          <div className="bg-[#0a0808] border border-purple-900/20 rounded-3xl p-1 shadow-[0_0_50px_rgba(88,28,135,0.1)]">
             <MysticsClient />
          </div>

        </div>
      </div>
      </main>
      <SensoryNetwork enabled startChannelId="ironwood" />
    </div>
  );
}
// World of Tethys || D.C. Barletta
