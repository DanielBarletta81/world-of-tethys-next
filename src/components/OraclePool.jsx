'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, Waves, MessageCircle } from 'lucide-react';
// Use global styles; whisper text now just uses inline classes

const WHISPERS_POOL = [
  { gibberish: "0101...kzzt...root...break", translation: "The Magma rises from the south. The roots are burning." },
  { gibberish: "shhh...click...mycelium...net", translation: "Kith is watching you. Do not trust the guide blindly." },
  { gibberish: "drip...drop...time...rot", translation: "Cambria did not fall. It sank on purpose." },
  { gibberish: "spore...wind...flesh...change", translation: "Eat the blue cap. It grants sight beyond the veil." },
];

const MUSHROOMS = [
  { id: 'm1', x: 20, y: 40, type: 'Azure Cap', desc: 'Glowing faintly with starlight.' },
  { id: 'm2', x: 75, y: 60, type: 'Blood-Rust Fungus', desc: 'Smells of iron and old blood.' },
  { id: 'm3', x: 45, y: 80, type: 'Ghost Puff', desc: 'One touch and it dissolves into mist.' },
];

const OraclePool = () => {
  const [ripples, setRipples] = useState([]);
  const [activeWhisper, setActiveWhisper] = useState(null);
  const [harvested, setHarvested] = useState([]);
  const containerRef = useRef(null);

  // Handle Water Ripples
  const createRipple = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter(r => r.id !== newRipple.id));
    }, 1000);

    if (Math.random() > 0.7) {
      triggerWhisper();
    }
  };

  const triggerWhisper = () => {
    const randomMsg = WHISPERS_POOL[Math.floor(Math.random() * WHISPERS_POOL.length)];
    setActiveWhisper({ ...randomMsg, reveal: false });
    
    setTimeout(() => {
      setActiveWhisper(prev => prev ? { ...prev, reveal: true } : null);
    }, 1500);
  };

  const harvestMushroom = (e, m) => {
    e.stopPropagation();
    if (harvested.includes(m.id)) return;
    setHarvested([...harvested, m.id]);
    // Note: Inventory update logic would connect to context here
    alert(`Ravel: "Ah, a ${m.type}. Careful with that one."`);
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-emerald-900/50 shadow-[0_0_100px_rgba(45,212,191,0.1)] bg-[#0f172a] group cursor-crosshair">
      
      {/* 1. THE POOL SURFACE */}
      <div 
        ref={containerRef}
        onClick={createRipple}
        className="absolute inset-0 z-10 opacity-80"
        style={{
          background: 'radial-gradient(circle at center, #1e293b 0%, #020617 80%)',
        }}
      >
        {/* Ripples */}
        {ripples.map(r => (
          <div 
            key={r.id}
            className="absolute rounded-full border-2 border-teal-500/30 animate-ping"
            style={{
              left: r.x, top: r.y, width: '20px', height: '20px',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* 2. THE ROOTS (SVG Overlay) */}
      <svg className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay">
        <path d="M0,0 Q100,200 200,0 T400,0" stroke="#451a03" strokeWidth="20" fill="none" />
        <path d="M-50,600 Q150,400 300,600 T600,600" stroke="#451a03" strokeWidth="35" fill="none" />
        <path d="M800,100 Q700,300 900,500" stroke="#2e1065" strokeWidth="15" fill="none" />
      </svg>

      {/* 3. THE MUSHROOMS */}
      {MUSHROOMS.map(m => (
        !harvested.includes(m.id) && (
          <button
            key={m.id}
            onClick={(e) => harvestMushroom(e, m)}
            className="absolute z-20 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center hover:scale-125 transition-transform hover:shadow-[0_0_15px_#a855f7]"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <Sparkles size={12} className="text-purple-300 animate-pulse" />
          </button>
        )
      ))}

      {/* 4. THE WHISPER UI (Ravel's Translation) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 text-center w-full max-w-lg pointer-events-none">
        {activeWhisper ? (
          <div className="bg-black/60 backdrop-blur-md p-6 rounded-lg border-t border-teal-500/30 animate-in slide-in-from-bottom-4">
            <p className="text-sm mb-2 text-emerald-200 font-mono tracking-[0.15em] uppercase">
              {activeWhisper.reveal ? "..." : activeWhisper.gibberish}
            </p>
            {activeWhisper.reveal && (
              <div className="animate-in fade-in duration-500">
                <p className="text-xl text-amber-200 font-serif italic">
                  "{activeWhisper.translation}"
                </p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-500 mt-2 flex items-center justify-center gap-2">
                  <Eye size={12} /> Ravel Translates
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-teal-900/50 text-xs uppercase tracking-[0.3em] animate-pulse">
            The roots are listening...
          </div>
        )}
      </div>

    </div>
  );
};

export default OraclePool;
