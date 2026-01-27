// src/components/MarineShowcase.jsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BESTIARY } from '@/data/bestiary';

// Filter for only Marine/Survivor eras
const MARINE_DATA = BESTIARY.filter(era => 
  era.era === 'The Deep' || era.era === 'Tethys Survivors'
).flatMap(era => era.entries);

export default function MarineShowcase() {
  return (
    <section className="relative py-12 border-t border-stone-800 bg-[#080a0b]">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-display text-cyan-500 uppercase tracking-widest mb-2">
            Marine Survivors
          </h2>
          <p className="text-stone-400 text-sm max-w-xl">
            Species that endured the meteor and the salinity spikes.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-6 px-6 pb-8 snap-x hide-scrollbar">
        {MARINE_DATA.map((creature) => (
          <motion.div
            key={creature.name}
            whileHover={{ scale: 1.02 }}
            className="flex-shrink-0 w-80 bg-[#0f1115] border border-cyan-900/30 rounded-lg overflow-hidden snap-center group shadow-lg"
          >
            {/* Image Area */}
            <div className="h-48 w-full relative bg-[#050608] overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                   style={{ backgroundImage: `url(${creature.image})` }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] to-transparent"></div>
              
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[9px] uppercase tracking-widest text-cyan-400 border border-cyan-900/50 px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                  {creature.tag}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 space-y-3">
              <h3 className="text-xl font-serif text-stone-200 group-hover:text-white transition-colors">
                {creature.name}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
                {creature.niche}
              </p>
              {creature.realWorldAnalog ? (
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-500">
                  Analog: {creature.realWorldAnalog}
                </div>
              ) : null}
              <div className="pt-3 border-t border-cyan-900/20 text-[10px] font-mono text-cyan-600 uppercase tracking-wider">
                Status: Extant
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
// World of Tethys || D.C. Barletta
