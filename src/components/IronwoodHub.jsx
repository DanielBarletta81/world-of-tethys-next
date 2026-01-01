'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

// The 4 Archetypes
const PATHS = [
  { 
    id: 'readers', 
    label: 'The Study', 
    icon: '📖', 
    desc: 'For those seeking the Chronicles directly.', 
    href: '/study', 
    position: 'left-10 top-32' // Shelf placement
  },
  { 
    id: 'listeners', 
    label: 'The Echoes', 
    icon: '🎧', 
    desc: 'Audio logs and signals from the deep.', 
    href: '/listen', 
    position: 'left-10 top-72' 
  },
  { 
    id: 'explorers', 
    label: 'The Undercity', 
    icon: '🧭', 
    desc: 'Map the unknown. Solve the machine.', 
    href: '/map', 
    position: 'right-10 top-32' 
  },
  { 
    id: 'villains', 
    label: 'The Weep', 
    icon: '🗡️', 
    desc: 'Power, politics, and the Triumvirate.', 
    href: '/factions', 
    position: 'right-10 top-72' 
  }
];

export default function IronwoodHub() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full h-screen bg-stone-950 overflow-hidden flex justify-center items-center">
      
      {/* 1. ATMOSPHERE: Stone Wall & Flickering Torch */}
      <div className="absolute inset-0 bg-[url('/img/stone-wall-texture.jpg')] bg-cover opacity-40"></div>
      <div className="absolute inset-0 bg-radial-gradient from-orange-900/20 to-black opacity-80 animate-pulse-slow"></div>

      {/* 2. THE CHIMERA (Centerpiece) */}
      <div className="relative z-10 text-center group cursor-pointer">
         {/* The Star Diagram (CSS representation) */}
         <div className="w-64 h-64 border border-stone-700/50 rounded-full flex items-center justify-center relative animate-[spin_60s_linear_infinite] hover:border-cyan-500/50 transition-colors">
            <div className="absolute inset-0 border border-stone-800 rotate-45"></div>
            <div className="text-cyan-500/80 font-mono text-xs tracking-widest animate-pulse">
               CHIMERA PROTOCOL
            </div>
         </div>
         <Link href="/creatures" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-stone-900 text-cyan-400 px-4 py-2 border border-cyan-500 rounded uppercase text-xs tracking-widest">
               Forge Life
            </span>
         </Link>
      </div>

      {/* 3. THE IRONWOOD SHELVES (Navigation) */}
      {PATHS.map((path) => (
        <Link 
          key={path.id} 
          href={path.href}
          className={`absolute ${path.position} w-64 p-4 border-b-4 border-stone-800 bg-stone-900/80 hover:bg-stone-800 transition-all duration-500 group`}
          onMouseEnter={() => setHovered(path.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Ironwood Shelf Texture */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-[#3e2723] rounded-sm shadow-xl"></div>

          <div className="flex items-center space-x-4">
            <div className="text-4xl filter drop-shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500">
              {path.icon}
            </div>
            <div>
              <h3 className="text-stone-300 font-serif text-lg group-hover:text-amber-500 transition-colors">
                {path.label}
              </h3>
              {/* Reveal Description on Hover */}
              <div className={`text-[10px] text-stone-500 uppercase tracking-wide overflow-hidden transition-all duration-500 ${hovered === path.id ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                {path.desc}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}