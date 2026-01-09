// src/app/mystics/page.jsx
'use client';

import TriFoldNav from '@/components/TriFoldNav';
import MysticsClient from '@/components/MysticsClient'; // Contains OraclePool, etc.
import PathSelector from '@/components/PathSelector';
import StaffSequencer from '@/components/StaffSequencer';
import { useState } from 'react';

export default function MysticsPage() {
  const [activeRitual, setActiveRitual] = useState('path'); 

  return (
    <main className="min-h-screen bg-[#050404] text-purple-100 font-serif pt-20 pb-12 px-6">
      
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-thin text-purple-400 uppercase tracking-widest mb-4">
          The Veil
        </h1>
        <p className="text-purple-200/50 text-sm max-w-xl mx-auto font-sans">
          For the seers. Choose your alignment, forge your staff, and consult the spores.
        </p>
      </header>

      <TriFoldNav />

      <div className="max-w-5xl mx-auto">
        
        {/* The Ritual Loop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Setup (Path & Staff) */}
          <div className="space-y-8">
            <div className="bg-[#0f0b09] border border-purple-900/30 p-6 rounded-2xl">
              <h2 className="text-xl text-purple-300 font-serif mb-4">1. Alignment</h2>
              <PathSelector onPathChange={(path) => console.log('Path set:', path)} />
            </div>

            <div className="bg-[#0f0b09] border border-purple-900/30 p-6 rounded-2xl">
              <h2 className="text-xl text-purple-300 font-serif mb-4">2. The Forge</h2>
              <StaffSequencer />
            </div>
          </div>

          {/* Right: The Oracles (Existing Component) */}
          <div className="bg-[#0a0808] border border-purple-900/20 rounded-3xl p-1 shadow-[0_0_50px_rgba(88,28,135,0.1)]">
             <MysticsClient />
          </div>

        </div>
      </div>
    </main>
  );
}
// World of Tethys || D.C. Barletta
