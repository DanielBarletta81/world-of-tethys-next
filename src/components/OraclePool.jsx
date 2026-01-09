'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye } from 'lucide-react';
// Use global styles; whisper text now just uses inline classes
import OracleModal from "@/components/OracleModal";
import TorchCursor from "@/components/ui/torchCursor";

const WHISPERS_POOL = [
  {
    gibberish: "drip...drop...time...rot",
    translation: "Cambria did not fall. It sank on purpose.",
    locationKey: "cambria",
  },
  {
    gibberish: "0101...kzzt...root...break",
    translation: "The Magma rises from the south. The roots are burning.",
    locationKey: "watcher",
  },
];



const OraclePool = () => {
  const [ripples, setRipples] = useState([]);
  const [activeWhisper, setActiveWhisper] = useState(null);
  const [harvested, setHarvested] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntry, setModalEntry] = useState(null);
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

    // open a modal for location-based whispers
    if (randomMsg.locationKey && LOCATION_ENTRIES[randomMsg.locationKey]) {
      setModalEntry({
        title: LOCATION_ENTRIES[randomMsg.locationKey].title,
        locationLabel: LOCATION_ENTRIES[randomMsg.locationKey].locationLabel,
        body: LOCATION_ENTRIES[randomMsg.locationKey].body,
        hint: LOCATION_ENTRIES[randomMsg.locationKey].hint,
        gibberish: randomMsg.gibberish,
      });
      setModalOpen(true);
    }
  }, 1500);
};

const harvestMushroom = (e, m) => {
  e.stopPropagation();
  if (harvested.includes(m.id)) return;
  setHarvested([...harvested, m.id]);

  setModalEntry({
    title: `Harvested — ${m.type}`,
    locationLabel: "Oracle Pool Rim",
    gibberish: "spore...wind...flesh...change",
    body: m.desc,
    hint: "Keep it. Use it when the map goes quiet.",
  });
  setModalOpen(true);
};



 

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-emerald-900/50 shadow-[0_0_100px_rgba(45,212,191,0.1)] bg-[#0f172a] group cursor-none">
    <TorchCursor enabled={true} />
      <OracleModal open={modalOpen} onClose={() => setModalOpen(false)} entry={modalEntry} />

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
