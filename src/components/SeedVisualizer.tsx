'use client';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// Titles based on specific stat thresholds
function pickTitle(scores: { lore?: number; creature?: number; geology?: number }) {
  const lore = scores.lore || 0;
  const creature = scores.creature || 0;
  const geology = scores.geology || 0;
  const total = lore + creature + geology;

  if (total > 150) return { title: 'Tectonic Seer', color: 'text-indigo-400', border: 'border-indigo-500/50' };
  if (geology > 50) return { title: 'Rift Walker', color: 'text-orange-400', border: 'border-orange-500/50' };
  if (creature > 50) return { title: 'Apex Hybrid', color: 'text-emerald-400', border: 'border-emerald-500/50' };
  if (lore > 50) return { title: 'Chronicler', color: 'text-cyan-400', border: 'border-cyan-500/50' };
  return { title: 'Hatchling', color: 'text-stone-400', border: 'border-stone-700' };
}

export default function SeedVisualizer({ initialSeed = 'H-0000', scores = { lore: 0, creature: 0, geology: 0 } }) {
  const [seed, setSeed] = useState(initialSeed);
  const [currentScores, setCurrentScores] = useState(scores);

  const { title, color, border } = useMemo(() => pickTitle(currentScores), [currentScores]);

  // Robust Event Listener
  useEffect(() => {
    const handler = (e: any) => {
      // If the event carries new data, use it. Otherwise, refresh from state.
      if (e.detail) {
        setCurrentScores((prev) => ({ ...prev, ...e.detail }));
      }
    };
    
    window.addEventListener('tethys:evolved', handler);
    return () => window.removeEventListener('tethys:evolved', handler);
  }, []);

  return (
    <motion.div 
      layout
      className={`relative p-6 rounded-xl bg-stone-900/80 backdrop-blur-md border ${border} shadow-2xl w-full max-w-xs`}
    >
      {/* 1. Header: The Seed ID */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Genetic ID</div>
          <div className="font-mono text-xl text-stone-200 tracking-wider">{seed}</div>
        </div>
        {/* Rank Icon placeholder */}
        <div className={`w-8 h-8 rounded-full border ${border} flex items-center justify-center`}>
           <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`} />
        </div>
      </div>

      {/* 2. The Title (Glow Effect) */}
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-1">Current Class</div>
        <motion.h3 
          key={title} // Triggers animation when title changes
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-serif text-2xl ${color} drop-shadow-md`}
        >
          {title}
        </motion.h3>
      </div>

      {/* 3. Stat Bars (The "Robust" Part) */}
      <div className="space-y-3">
        <StatBar label="Lore" value={currentScores.lore || 0} color="bg-cyan-500" />
        <StatBar label="Creature" value={currentScores.creature || 0} color="bg-emerald-500" />
        <StatBar label="Geology" value={currentScores.geology || 0} color="bg-orange-500" />
      </div>

      {/* Decorative Corner Scanlines */}
      <div className="absolute top-0 right-0 p-2 opacity-20">
         <div className="w-16 h-16 border-t border-r border-white rounded-tr-lg" />
      </div>
    </motion.div>
  );
}

// Helper Component for the Bars
function StatBar({ label, value, color }: { label: string, value: number, color: string }) {
  // Cap value at 100 for visual width
  const percent = Math.min(value, 100);
  
  return (
    <div className="group">
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-500 mb-1 group-hover:text-stone-300 transition-colors">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} shadow-[0_0_10px_currentColor]`}
        />
      </div>
    </div>
  );
}