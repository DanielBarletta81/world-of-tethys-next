// src/components/Incubator.jsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Egg, Fingerprint, Sparkles } from 'lucide-react';
import  useSoundFX  from '@/app/hooks/useSoundFX';
import cdn from '@/lib/cdn';

export default function Incubator({ onHatch }) {
  const [hatching, setHatching] = useState(false);
  const { playRumble, playShriek, playLogoHit } = useSoundFX();

  const handleHatch = async () => {
    setHatching(true);
    playRumble(); // 1. Build tension

    // Cinematic delay simulating the shell cracking
    await new Promise(r => setTimeout(r, 2000));
    
    playShriek(); // 2. Creature emerges
    playLogoHit(); // 3. Impact
    onHatch(); // 4. Trigger parent unlock
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
      {/* Container pulsing glow */}
      <div className={`absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full transition-all duration-[2000ms] ${hatching ? 'scale-150 opacity-0' : 'scale-100 opacity-50'}`} />

      {/* The Egg Object */}
      <button 
        onClick={handleHatch}
        disabled={hatching}
        className="relative z-10 group cursor-pointer outline-none"
      >
        <motion.div
          animate={hatching ? {
            scale: [1, 1.1, 1.5, 0],
            rotate: [0, -5, 5, -10, 10, 0],
            filter: ["brightness(1)", "brightness(2)", "brightness(5)"]
          } : {
            y: [0, -10, 0],
          }}
          transition={hatching ? { duration: 2 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-48 h-64 bg-[#1c1917] border-2 border-stone-600 rounded-[50%_50%_40%_40%] relative overflow-hidden shadow-2xl flex items-center justify-center"
        >
          {/* Egg Texture */}
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: `url(${cdn('/noise.svg')})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-stone-500/20" />
          
          {/* Cracks (Only appear on hover/hatch) */}
          <div className="absolute inset-0 border-t-2 border-orange-500/0 group-hover:border-orange-500/50 transition-all duration-500 scale-0 group-hover:scale-100 origin-top" />

          {/* Icon/Prompt */}
          <div className="text-center opacity-60 group-hover:opacity-100 transition-opacity">
            <Egg size={48} className="mx-auto mb-2 text-stone-400 group-hover:text-orange-400" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 group-hover:text-orange-200">
              {hatching ? 'BREACHING...' : 'Initiate Hatch'}
            </span>
          </div>
        </motion.div>
      </button>

      {/* Status Readout */}
      {!hatching && (
        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 border border-stone-800 rounded-full text-xs font-mono text-stone-400">
            <Fingerprint size={12} className="text-emerald-500" />
            <span>DNA Lock: Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
// World of Tethys || D.C. Barletta
