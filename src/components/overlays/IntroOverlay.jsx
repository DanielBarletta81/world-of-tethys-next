'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play } from 'lucide-react';
import useSoundFX from '@/app/hooks/useSoundFX';
import cdn from '@/lib/cdn';

export default function IntroOverlay({ onStart }) {
  const [isEngaging, setIsEngaging] = useState(false);
  const { playClick } = useSoundFX(); // We trigger this to unlock the AudioContext

  const handleEnter = () => {
    setIsEngaging(true);
    playClick(); // This 'dummy' play unlocks audio for the whole session
    
    // Slight delay for the "Engagement" animation to play out
    setTimeout(() => {
      onStart();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center cursor-pointer" onClick={handleEnter}>
      
      {/* 1. The Rotating Seal (The Button) */}
      <div className="relative group">
        {/* Glow Ring */}
        <div className={`absolute inset-0 bg-orange-600 rounded-full blur-[50px] transition-opacity duration-1000 ${isEngaging ? 'opacity-100 scale-150' : 'opacity-20 group-hover:opacity-60'}`} />
        
        {/* The Image Container */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-orange-900/50 shadow-2xl transition-transform duration-500 ${isEngaging ? 'scale-0 opacity-0' : 'scale-100 group-hover:scale-105'}`}
        >
          <Image 
            src={cdn('/symbols/tethys-seal.png')} 
            alt="Enter Tethys" 
            fill
            className="object-cover sepia-[0.5] hover:sepia-0 transition-all duration-500"
          />
          
          {/* "Play" Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition-colors">
            <Play className="text-white opacity-50 group-hover:opacity-0 transition-opacity" size={32} />
          </div>
        </motion.div>
      </div>

      {/* 2. Text Prompt */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`mt-12 text-center space-y-2 transition-opacity duration-500 ${isEngaging ? 'opacity-0' : 'opacity-100'}`}
      >
        <h1 className="text-2xl md:text-4xl font-display text-white tracking-[0.2em] uppercase">
          World of Tethys
        </h1>
        <p className="text-xs text-stone-500 font-mono tracking-[0.4em] uppercase animate-pulse">
          Click to Initialize
        </p>
      </motion.div>

    </div>
  );
}
// World of Tethys || D.C. Barletta
