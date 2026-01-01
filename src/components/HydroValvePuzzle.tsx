'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


export default function HydroValvePuzzle({ onSolve }: { onSolve?: () => void }) {
  // 3 Levers: Values 0-100. Target is roughly 50, 80, 20.
  const [valves, setValves] = useState([10, 10, 10]);
  const TARGETS = [50, 80, 20]; 
  const TOLERANCE = 10; // How easy it is (bigger number = easier)
  const [unlocked, setUnlocked] = useState(false);

  const handleSlide = (index: number, value: number) => {
    const newValves = [...valves];
    newValves[index] = value;
    setValves(newValves);
  };

  // Check win condition
  useEffect(() => {
  const isSolved = valves.every((val, i) => 
    Math.abs(val - TARGETS[i]) < TOLERANCE
  );
  if (isSolved && !unlocked) { // Check !unlocked to prevent double-firing
    setUnlocked(true);
    if (onSolve) onSolve(); // <--- Trigger the callback!
  }
}, [valves, unlocked, onSolve]);

  return (
    <div className="relative p-8 w-full max-w-md mx-auto bg-[#1c1917] border-4 border-[#3f3f46] rounded-xl shadow-2xl">
      {/* RIVETS (Decoration) */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-stone-600 shadow-inner"></div>
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-stone-600 shadow-inner"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-stone-600 shadow-inner"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-stone-600 shadow-inner"></div>

      <h2 className="text-center font-serif text-stone-400 mb-6 tracking-widest uppercase text-sm">
        Sluice Gate Hydraulics
      </h2>

      {/* THE SLIDERS */}
      <div className="space-y-8 relative z-10">
        {valves.map((val, i) => (
          <div key={i} className="relative h-12 flex items-center">
            {/* Track */}
            <div className="absolute w-full h-4 bg-black rounded-full shadow-inner border border-stone-700 overflow-hidden">
               {/* The "Sweet Spot" Marker (Hidden or subtle) */}
               <div 
                 className="absolute h-full bg-stone-800/50" 
                 style={{ left: `${TARGETS[i] - TOLERANCE}%`, width: `${TOLERANCE * 2}%` }}
               />
            </div>
            
            {/* The Handle (Input) */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={val}
              onChange={(e) => handleSlide(i, parseInt(e.target.value))}
              disabled={unlocked}
              className="w-full opacity-0 cursor-pointer absolute z-20 h-12"
            />
            
            {/* The Visual Handle (Brass Knob) */}
            <motion.div 
              className={`absolute w-8 h-12 rounded shadow-lg border-2 z-10 pointer-events-none flex items-center justify-center
                ${Math.abs(val - TARGETS[i]) < TOLERANCE 
                  ? 'bg-amber-500 border-amber-300 shadow-[0_0_15px_#f59e0b]' // Lit up when correct
                  : 'bg-[#78350f] border-[#92400e]' // Dull Brass
                }
              `}
              animate={{ left: `calc(${val}% - 16px)` }}
            >
              <div className="w-full h-1 bg-black/20"></div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* STATUS LIGHT */}
      <div className="mt-8 flex justify-center">
        <div className={`px-6 py-2 rounded border transition-all duration-1000
          ${unlocked 
            ? 'bg-emerald-900/50 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
            : 'bg-red-900/20 border-red-900 text-red-700'
          }
        `}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">
            {unlocked ? 'PRESSURE STABLE - GATE OPEN' : 'PRESSURE CRITICAL'}
          </span>
        </div>
      </div>
      
      {/* Steam Vent (Visual) */}
      {unlocked && (
         <div className="absolute -top-10 left-1/2 w-20 h-20 bg-white/10 blur-xl rounded-full animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
}