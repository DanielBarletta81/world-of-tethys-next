'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import TethysNexus from '@/components/TethysNexus';
import StaffSequencer from '@/components/StaffSequencer';
import AtmosphericTotem from '@/components/AtmosphericTotem';


export default function MapPage() {
  const [hatched, setHatched] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 p-6 pt-32 relative overflow-hidden font-mono">
      
      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-900/10 blur-[100px] rounded-full"></div>
      <AtmosphericTotem proxyCity="Athens, GR" biome="High_Altitude" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COL: THE MAP (The Prize) */}
        <div className="relative">
          {/* Header for the Map */}
          <div className="mb-6">
            <h1 className="text-4xl font-serif text-white mb-2">Sector 4: The Undercity</h1>
            <p className="text-stone-500 text-sm uppercase tracking-widest">
              Status: <span className="text-emerald-400 animate-pulse">Survey Open</span>
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-stone-800 shadow-2xl bg-[#1c1917] group">
            <div className="transition-all duration-700">
              <div className="relative">
                <TethysNexus />
                {/* Mask to focus on Pteros Island region */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,125,40,0.18),rgba(12,10,9,0.8))] mix-blend-screen" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL: HATCH + PROFILE */}
        <div className="space-y-8">
          
          <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg shadow-lg relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
             <h3 className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-2">Hatch Protocol</h3>
             <p className="text-stone-400 font-serif italic">
               "Only the Pteros Island strait is visible. Anchor your egg here to sync staff, profile, and bond traits."
             </p>
             <div className="mt-4 flex flex-col gap-3">
               <button
                 onClick={() => setHatched(true)}
                 className="px-4 py-3 bg-amber-900/30 border border-amber-700/50 text-amber-200 uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-amber-900/50 transition"
               >
                 Hatch at Pteros Island
               </button>
               <p className="text-[11px] text-stone-500">
                 Hatching links your staff components, egg imprint, and profile. Once linked, the Registry can export VR metadata.
               </p>
             </div>
          </div>

          {hatched && (
            <div className="bg-[#0c0a09] border border-emerald-800/40 rounded-lg p-4 shadow-lg">
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-mono mb-2">Staff Sequencer</p>
              <StaffSequencer />
            </div>
          )}

        </div>
      </div>

      {/* BACK LINK */}
      <div className="absolute top-6 left-6">
         <Link href="/" className="text-stone-500 hover:text-white text-xs uppercase tracking-widest transition-colors">
           &larr; Return to Hub
         </Link>
      </div>

    </div>
  );
}
