'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

// Define the shape of a Card for TypeScript safety
// interface Card {
//   id: number;
//   name: string;
//   blurb: string;
//   image: string;
// }

const CARDS = [
  { 
    id: 1, 
    name: 'Ash Drake', 
    blurb: '"Born of the soot, they breathe not fire, but choking dust."', 
    image: '/img/creatures/drake.jpg' 
  },
  { 
    id: 2, 
    name: 'Lava Strider', 
    blurb: '"Their legs are basalt; their blood is the flow."', 
    image: '/img/creatures/strider.jpg' 
  },
  { 
    id: 3, 
    name: 'The Scribe', 
    blurb: '"Ink freezes in the upper air. We write in blood."', 
    image: '/img/creatures/scribe.jpg' 
  },
  // Added a 4th card so you can actually scroll/test the carousel effect
  { 
    id: 4, 
    name: 'Cinder Wisp', 
    blurb: '"A fleeting spark of consciousness in the dying heat."', 
    image: '/img/creatures/wisp.jpg' 
  }
];

export default function MagmaCarousel() {
  const [activeId, setActiveId] = useState(null);

  return (
    <>
    <div className="relative w-full">
      {/* Scrollable Container */}
      <div className="flex space-x-8 overflow-x-auto pb-12 pt-4 px-6 snap-x hide-scrollbar">
        {CARDS.map((card) => {
          const isCooled = activeId === card.id;

          return (
            <motion.div
              key={card.id}
              onClick={() => setActiveId(isCooled ? null : card.id)}
              className={`relative flex-shrink-0 w-72 h-96 rounded-2xl cursor-pointer group snap-center transition-all duration-700 overflow-hidden border ${
                isCooled
                  ? 'border-cyan-900/50 bg-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.1)]'
                  : 'border-stone-800 bg-stone-900 hover:border-amber-600/50'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {/* LAVA BACKGROUND (Magma State) */}
              {!isCooled && (
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900 via-red-900 to-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              )}

              {/* STEAM EFFECT (Cooling State) */}
              <AnimatePresence>
                {isCooled && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: [0, 0.4, 0], scale: 2, y: -50 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-cyan-500/20 mix-blend-screen z-20 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* CARD CONTENT */}
              <div className="relative z-10 h-full flex flex-col p-6">
                
                {/* IMAGE */}
                <div
                  className={`relative w-full h-48 rounded-lg overflow-hidden mb-6 transition-all duration-700 ${
                    isCooled
                      ? 'grayscale opacity-80'
                      : 'grayscale-[50%] group-hover:grayscale-0 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                  }`}
                >
                  <Image src={card.image} alt={card.name} fill className="object-cover" />
                </div>

                {/* NAME */}
                <h3
                  className={`font-serif text-2xl mb-2 transition-colors duration-500 ${
                    isCooled
                      ? 'text-cyan-100'
                      : 'text-stone-300 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]'
                  }`}
                >
                  {card.name}
                </h3>

                {/* BLURB */}
                <p
                  className={`text-sm italic leading-relaxed transition-colors duration-500 ${
                    isCooled ? 'text-slate-400' : 'text-stone-500 group-hover:text-stone-300'
                  }`}
                >
                  {card.blurb}
                </p>

                {/* STATUS TEXT */}
                <div className="mt-auto flex justify-end">
                  <div
                    className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${
                      isCooled ? 'text-cyan-500' : 'text-stone-700 group-hover:text-orange-500'
                    }`}
                  >
                    {isCooled ? 'OBSIDIAN LOCKED' : 'MOLTEN'}
                  </div>
                </div>
              </div>

              {/* BORDER GLOW */}
              <div
                className={`absolute inset-0 border-2 rounded-2xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
                  isCooled ? 'border-cyan-500/20' : 'border-orange-500/40 blur-sm'
                }`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
    </>
  );
}