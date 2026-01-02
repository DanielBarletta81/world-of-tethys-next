'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import HydroValvePuzzle from '@/components/HydroValvePuzzle'; 
import AtmosphericTotem from '@/components/AtmosphericTotem';
import UnfoldingMap from '@/components/UnfoldingMap';


export default function MapPage() {
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [activeLocation, setActiveLocation] = useState({
    proxy: 'Da Nang, VN',
    biome: 'Monsoon'
  });

  const handlePuzzleSolve = () => {
    setIsGateOpen(true);
    // Wait 1.5s for the gate animation to finish, then show the reward popup
    setTimeout(() => setShowReward(true), 1500); 
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 p-6 pt-32 relative overflow-hidden font-mono">
      
      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-900/10 blur-[100px] rounded-full"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COL: THE MAP (The Prize) */}
        <div className="relative">
          {/* Header for the Map */}
          <div className="mb-6">
            <h1 className="text-4xl font-serif text-white mb-2">Sector 4: The Undercity</h1>
            <p className="text-stone-500 text-sm uppercase tracking-widest">
              Status: {isGateOpen ? <span className="text-emerald-400 animate-pulse">HYDRAULICS ACTIVE</span> : <span className="text-red-500">PRESSURE LOCKED</span>}
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-stone-800 shadow-2xl bg-[#1c1917] group">
            <div className={`transition-all duration-[1500ms] ${isGateOpen ? 'opacity-100 blur-0' : 'opacity-20 blur-md grayscale pointer-events-none'}`}>
              <UnfoldingMap
                mapImageUrl="/img/map/epic_map_hero.PNG"
                onPointClick={(point) => setActiveLocation({ proxy: point.label, biome: point.tag || 'Unknown' })}
              />
            </div>

            {/* LOCKED OVERLAY (Disappears when solved) */}
            <AnimatePresence>
              {!isGateOpen && (
                <motion.div 
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm"
                >
                  <div className="text-6xl mb-4">🔒</div>
                  <div className="text-red-500 font-mono text-xs uppercase tracking-[0.2em] bg-black/80 px-4 py-2 border border-red-900 rounded shadow-lg">
                    Sluice Gate Closed
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Atmospheric readout of the last point clicked */}
          <div className="mt-4">
            <AtmosphericTotem 
              proxyCity={activeLocation.proxy}
              biome={activeLocation.biome}
            />
          </div>
        </div>

        {/* RIGHT COL: THE PUZZLE (The Key) */}
        <div className="space-y-8">
          
          {/* Instructions */}
          <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg shadow-lg relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
             <h3 className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-2">Engineer's Note</h3>
             <p className="text-stone-400 font-serif italic">
               "The main valves are rusted stuck. You need to balance the pressure to <strong className="text-stone-200">50 / 80 / 20</strong> to bypass the lock mechanism. Watch the lights."
             </p>
          </div>

          {/* THE INTERACTIVE PUZZLE */}
          {/* We pass the handlePuzzleSolve function here */}
          <div className={isGateOpen ? 'pointer-events-none opacity-50 transition-opacity grayscale' : ''}>
             <HydroValvePuzzle onSolve={handlePuzzleSolve} />
          </div>

        </div>
      </div>

      {/* REWARD POPUP */}
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-10 right-10 z-50 max-w-sm bg-stone-900 border border-emerald-500/50 p-6 rounded-lg shadow-[0_0_50px_rgba(16,185,129,0.2)]"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-emerald-400 uppercase tracking-widest text-xs font-bold">New Asset Acquired</h4>
              <button onClick={() => setShowReward(false)} className="text-stone-500 hover:text-white">&times;</button>
            </div>
            <p className="text-stone-300 font-serif text-sm mb-4">
              "You have drained the lower levels. A path to the <span className="text-emerald-300">Foundry District</span> is now visible."
            </p>
            
            {/* Link to the next area */}
            <Link href="/creatures" className="block w-full py-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 text-center text-xs uppercase tracking-widest border border-emerald-800 rounded transition-colors">
              Access Bestiary &rarr;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACK LINK */}
      <div className="absolute top-6 left-6">
         <Link href="/" className="text-stone-500 hover:text-white text-xs uppercase tracking-widest transition-colors">
           &larr; Return to Hub
         </Link>
      </div>

    </div>
  );
}
