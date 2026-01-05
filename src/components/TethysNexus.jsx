// src/components/TethysNexus.jsx
'use client';
import React, { useState } from 'react';
import { Network, X, Lock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTethys } from '@/context/TethysContext';
import {useSoundFX} from '@/app/hooks/useSoundFX';

const LOCATIONS = [
  {
    id: 'pteros', // Starting Node
    x: 50, y: 50,
    name: 'Pteros Island',
    type: 'Estuarine Hub',
    desc: 'Where the Danian River meets the Tethys brine. The hatching ground.',
    // Background image when this node is active (Submap)
    bg: 'url("/img/locations/pteros_map_bg.jpg")' 
  },
  {
    id: 'sky-city',
    x: 20, y: 75,
    name: 'Sky City',
    type: 'Hydro-Metropolis',
    desc: 'Suspended in the spray of "The Weep."',
    bg: 'url("/img/locations/sky_city_bg.jpg")'
  },
  {
    id: 'iron-sands',
    x: 80, y: 30,
    name: 'Iron Sands',
    type: 'Ruins',
    desc: 'Glass spires piercing the dunes.',
    bg: 'url("/img/locations/desert_bg.jpg")'
  },
  // ... add your others here
];

export default function TethysNexus() {
  const [activeNode, setActiveNode] = useState(null);
  const { unlockedNodes } = useTethys(); 
  const { playHover, playShriek } = useSoundFX();// Connects to your game state

  // Default Grid Texture
  const defaultBg = 'linear-gradient(#44403c 1px, transparent 1px), linear-gradient(90deg, #44403c 1px, transparent 1px)';

  return (
    <div className="w-full min-h-[700px] bg-[#0c0a09] relative overflow-hidden font-serif text-[#e7e5e4] p-8 border border-[#292524] rounded-xl shadow-2xl transition-all duration-1000">
      
      {/* 1. DYNAMIC BACKGROUND (The Submap Effect) */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none opacity-30"
        style={{ 
          backgroundImage: activeNode ? activeNode.bg : defaultBg,
          backgroundSize: activeNode ? 'cover' : '40px 40px',
          backgroundPosition: 'center',
          filter: activeNode ? 'sepia(0.5) contrast(1.2)' : 'none'
        }}
      />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,#0c0a09_100%)] pointer-events-none" />

      {/* 2. HEADER */}
      <div className="absolute top-6 left-8 z-20">
        <h2 className="text-3xl font-bold tracking-tighter text-amber-600 flex items-center gap-3">
          <Network className="w-6 h-6" /> TETHYS ATLAS
        </h2>
        <p className="text-xs text-[#a8a29e] uppercase tracking-widest mt-1">
          {activeNode ? `Sector: ${activeNode.name}` : 'Overview: Twin Straits'}
        </p>
      </div>

      {/* 3. THE NODES */}
      <div className="absolute inset-0 z-10">
        {LOCATIONS.map((loc) => {
          // Check Logic
          const isUnlocked = unlockedNodes.includes(loc.id);
          const isActive = activeNode?.id === loc.id;

          return (
            <div 
              key={loc.id}
              className="absolute transition-all duration-500"
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            >
              <button
              onMouseOver={playHover}
                onClick={() => isUnlocked && setActiveNode(isActive ? null : loc)}
                className={`relative z-20 flex items-center justify-center transition-all duration-300 group rounded-full 
                  ${isActive ? 'w-8 h-8 bg-amber-500 border-2 border-white shadow-[0_0_40px_rgba(245,158,11,1)]' : 
                    isUnlocked ? 'w-4 h-4 bg-[#1c1917] border border-amber-600 hover:scale-125' : 
                    'w-3 h-3 bg-[#292524] border border-stone-800 cursor-not-allowed opacity-50'
                  }`}
              >
                {/* Icons inside the node */}
                {isActive && <MapPin size={16} className="text-black" />}
                {!isUnlocked && <Lock size={10} className="text-stone-500" />}
                
                {/* Pulse for Active/Unlocked */}
                {isUnlocked && !isActive && <div className="absolute -inset-2 border border-amber-900/30 rounded-full animate-ping opacity-50"></div>}
              </button>

              {/* Label */}
              <div className={`absolute top-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors duration-300 
                ${isActive ? 'text-amber-400 font-bold' : isUnlocked ? 'text-stone-400' : 'text-stone-700 blur-[1px]'}`}>
                {loc.name}
              </div>

              {/* 4. ACTIVE DATA CARD */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-0 left-12 w-64 bg-black/80 backdrop-blur-md border-l-2 border-amber-500 p-4 rounded-r-lg shadow-2xl z-50 text-left"
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveNode(null); }} 
                      className="absolute top-2 right-2 text-stone-500 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                    
                    <h3 className="text-amber-100 font-bold text-lg">{loc.name}</h3>
                    <span className="text-[9px] uppercase text-amber-600 tracking-widest block mb-2">{loc.type}</span>
                    <p className="text-xs text-stone-400 leading-relaxed italic border-t border-stone-800 pt-2">
                      "{loc.desc}"
                    </p>

                    {/* Action Button */}
                    <div className="mt-4">
                      <a href={`/${loc.id}`} className="block text-center py-2 bg-amber-900/40 border border-amber-800 text-amber-200 text-[10px] uppercase tracking-[0.2em] hover:bg-amber-800 hover:text-white transition-colors">
                        Enter Sector
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}