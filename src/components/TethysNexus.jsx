import React, { useState } from 'react';
import { Network, X } from 'lucide-react';

const LOCATIONS = [
  {
    id: 'watcher',
    x: 80, y: 15, // North of Iron Sands
    name: 'Watcher Mountain',
    type: 'Active Volcano',
    proxy: 'Mt. Bromo, Indonesia',
    geo: 'Stromboli Vent',
    desc: 'A brooding, active peak that rains ash upon the Ironwoods.'
  },
  {
    id: 'iron-sands',
    x: 80, y: 30, // Northeast (Old Sky City Site)
    name: 'Iron Sands',
    type: 'Industrial/Ruins',
    proxy: 'Dubai, UAE',
    geo: 'Wadi Rum',
    desc: 'The rust-colored expanse where the glass spires of the Old City still pierce the dunes.'
  },
  {
    id: 'shastea',
    x: 65, y: 35, // Between Ironwoods (NE) and Pteros (Center)
    name: 'Mt. Shastea',
    type: 'Dormant Volcano',
    proxy: 'Mt. Shasta, USA',
    geo: 'Mauna Kea',
    desc: 'A massive, sleeping giant guarding the pass to the Ironwoods.'
  },
  {
    id: 'mystic-woods',
    x: 25, y: 30, // Northwest (West of River)
    name: 'Mystic Woods',
    type: 'Bioluminescent Forest',
    proxy: 'Da Nang, Vietnam',
    geo: 'Zhangjiajie Pillars',
    desc: 'Towering sandstone pillars connected by living bridges, shrouded in eternal mist.'
  },
  {
    id: 'pteros',
    x: 50, y: 50, // Dead Center
    name: 'Pteros Island',
    type: 'Estuarine Hub',
    proxy: 'Ha Long Bay, Vietnam',
    geo: 'Amazon Delta',
    desc: 'A massive rock island in the Twin Straits where the Danian River meets the Tethys brine. The ultimate feeding ground.'
  },
  {
    id: 'sky-city',
    x: 20, y: 75, // Swapped to Southwest
    name: 'Sky City (New)',
    type: 'Hydro-Metropolis',
    proxy: 'Singapore',
    geo: 'Victoria Falls',
    desc: 'A city suspended in the spray of "The Weep," utilizing massive hydro-turbines.'
  },
  {
    id: 'cambria',
    x: 80, y: 80, // Southeast
    name: 'Cambria',
    type: 'Sunken Capital',
    proxy: 'Santorini, Greece',
    geo: 'Great Blue Hole',
    desc: 'The ancient seat of power, built into the white walls of a submerged caldera.'
  }
];

const TethysNexus = () => {
  const [activeNode, setActiveNode] = useState(null);

  return (
    <div className="w-full min-h-[700px] bg-[#0c0a09] relative overflow-hidden font-serif text-[#e7e5e4] p-8 border border-[#292524] rounded-xl shadow-2xl">
      
      {/* Background Texture (Grid) */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(#44403c 1px, transparent 1px), linear-gradient(90deg, #44403c 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* The Danian River (Stylized SVG Background) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0">
        <path 
          d="M 500 0 C 520 200, 480 300, 500 350 S 500 600, 550 800" 
          stroke="#06b6d4" 
          strokeWidth="40" 
          fill="none" 
          className="blur-xl"
        />
        <text x="45%" y="10%" fill="#0e7490" className="text-xs uppercase tracking-[0.5em] opacity-50 font-sans">Danian Flow</text>
      </svg>

      {/* Header */}
      <div className="absolute top-6 left-8 z-20">
        <h2 className="text-3xl font-bold tracking-tighter text-amber-600 flex items-center gap-3">
          <Network className="w-6 h-6" /> TETHYS GEOSPATIAL WEB
        </h2>
        <p className="text-xs text-[#a8a29e] uppercase tracking-widest mt-1">
          Sector Map: <span className="text-emerald-500">Twin Straits Region</span>
        </p>
      </div>

      {/* The Network Map Area */}
      <div className="absolute inset-0 z-10">
        {LOCATIONS.map((loc) => (
          <div 
            key={loc.id}
            className="absolute transition-all duration-500"
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
          >
            {/* Connection Lines */}
            {activeNode?.id === loc.id && (
              <>
                 <div className="absolute w-[120px] h-[1px] bg-gradient-to-r from-amber-600 to-transparent -translate-y-1/2 rotate-[-45deg] origin-left animate-in fade-in duration-300" style={{ left: '20px', top: '0' }}></div>
                 <div className="absolute w-[120px] h-[1px] bg-gradient-to-r from-cyan-600 to-transparent -translate-y-1/2 rotate-[45deg] origin-left animate-in fade-in duration-300" style={{ left: '20px', top: '0' }}></div>
              </>
            )}

            {/* The Node Itself */}
            <button
              onClick={() => setActiveNode(activeNode?.id === loc.id ? null : loc)}
              className={`relative z-20 flex items-center justify-center transition-all duration-300 group rounded-full ${
                activeNode?.id === loc.id 
                  ? 'w-6 h-6 bg-amber-500 border-2 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.8)]' 
                  : 'w-4 h-4 bg-[#1c1917] border border-[#57534e] hover:border-amber-600 hover:bg-amber-900/50'
              }`}
            >
              {activeNode?.id === loc.id && <div className="absolute -inset-4 border border-amber-500/30 rounded-full animate-ping"></div>}
            </button>

            {/* Location Name Label */}
            <div className={`absolute top-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${activeNode?.id === loc.id ? 'text-amber-500 font-bold' : 'text-[#78716c] group-hover:text-[#a8a29e]'}`}>
              {loc.name}
            </div>

            {/* EXPANDED DATA CARD (Pop-up) */}
            {activeNode?.id === loc.id && (
              <div className="absolute top-0 left-8 w-[280px] z-30 animate-in slide-in-from-left-4 fade-in duration-300">
                
                {/* Real World Anchors */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="bg-black/90 backdrop-blur border-l-2 border-amber-600 p-2 pl-3">
                    <div className="text-[9px] text-[#78716c] uppercase tracking-wider">Proxy City</div>
                    <div className="text-amber-400 font-bold text-sm">{loc.proxy}</div>
                  </div>
                  <div className="bg-black/90 backdrop-blur border-l-2 border-cyan-600 p-2 pl-3">
                    <div className="text-[9px] text-[#78716c] uppercase tracking-wider">Geo Feature</div>
                    <div className="text-cyan-400 font-bold text-sm">{loc.geo}</div>
                  </div>
                </div>
                
                {/* Lore Description */}
                <div className="bg-[#1c1917] border border-[#44403c] p-4 rounded shadow-2xl relative">
                  <button onClick={(e) => { e.stopPropagation(); setActiveNode(null); }} className="absolute top-2 right-2 text-[#57534e] hover:text-[#e7e5e4]">
                    <X size={14} />
                  </button>
                  <h3 className="font-bold text-lg text-[#e7e5e4] mb-1">{loc.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                     <span className="text-[9px] bg-[#292524] px-2 py-0.5 rounded text-[#a8a29e] uppercase border border-[#44403c]">{loc.type}</span>
                  </div>
                  <p className="text-xs text-[#d6d3d1] italic leading-relaxed border-t border-[#292524] pt-2">
                    "{loc.desc}"
                  </p>
                </div>

              </div>
            )}

          </div>
        ))}
      </div>

      {/* Decorative Compass */}
      <div className="absolute bottom-8 right-8 pointer-events-none opacity-20">
        <div className="w-20 h-20 border border-[#44403c] rounded-full flex items-center justify-center relative">
          <span className="absolute top-1 text-[8px] uppercase">N</span>
          <span className="absolute bottom-1 text-[8px] uppercase">S</span>
          <div className="w-16 h-16 border border-[#292524] rounded-full"></div>
          <div className="absolute w-[1px] h-full bg-[#44403c]"></div>
          <div className="absolute h-[1px] w-full bg-[#44403c]"></div>
        </div>
      </div>

    </div>
  );
};

export default TethysNexus;