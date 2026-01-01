'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapPlaceholder from '@/components/MapPlaceholder';
import HydroValvePuzzle from '@/components/HydroValvePuzzle';
import Link from 'next/link';

export default function MapPage() {
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Listen for the puzzle completion
  // In a real app, you'd pass a callback to the puzzle component, 
  // but for now we can simulate it or wrap the puzzle state.
  // actually, let's update the Puzzle component to accept an 'onSolve' prop in the next step if needed,
  // but for now, we'll wrap the puzzle in a way that implies connection.
  
  // NOTE: You will need to slightly update your HydroValvePuzzle to accept an "onSolve" prop
  // or we can just use the internal state if we move logic up. 
  // For this drop, I'll assume the puzzle handles its own win state visually, 
  // and we show the map regardless, but "fogged" until they click a "Check Pressure" button or similar.
  // BETTER YET: Let's assume you pass a callback.
  
  const handlePuzzleSolve = () => {
    setIsGateOpen(true);
    setTimeout(() => setShowReward(true), 1500); // Delay for dramatic effect
  };

  return (
    <div className="min-h-screen bg-slate-950 text-stone-200 p-6 pt-32 relative overflow-hidden">
      
      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-900/20 blur-[100px] rounded-full"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COL: THE MAP (The Prize) */}
        <div className="relative">
          <div className="mb-6">
            <h1 className="text-4xl font-serif text-white mb-2">Sector 4: The Undercity</h1>
            <p className="text-stone-500 text-sm uppercase tracking-widest">
              Status: {isGateOpen ? <span className="text-emerald-400">HYDRAULICS ACTIVE</span> : <span className="text-red-500">PRESSURE LOCKED</span>}
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-stone-800 shadow-2xl group">
            {/* The Actual Map Component */}
            <div className={`transition-all duration-1000 ${isGateOpen ? 'blur-0 opacity-100' : 'blur-md opacity-30 grayscale'}`}>
               <MapPlaceholder />
            </div>

            {/* Locked Overlay */}
            {!isGateOpen && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40">
                <div className="text-6xl mb-4">🔒</div>
                <div className="text-red-500 font-mono text-xs uppercase tracking-[0.2em] bg-black/80 px-4 py-2 border border-red-900 rounded">
                  Sluice Gate Closed
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COL: THE PUZZLE (The Key) */}
        <div className="space-y-12">
          
          {/* Instructions */}
          <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg">
             <h3 className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-2">Engineer's Note</h3>
             <p className="text-stone-400 font-serif italic">
               "The main valves are rusted stuck. You need to balance the pressure to 50 / 80 / 20 to bypass the lock mechanism. Watch the lights."
             </p>
          </div>

          {/* The Puzzle Component */}
          {/* We will pass a prop here. Ensure you update the component to accept it. */}
          <div className={isGateOpen ? 'pointer-events-none opacity-50 transition-opacity' : ''}>
             <HydroValvePuzzle onSolve={handlePuzzleSolve} />
          </div>

        </div>
      </div>

      {/* REWARD MODAL (Appears after solving) */}
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