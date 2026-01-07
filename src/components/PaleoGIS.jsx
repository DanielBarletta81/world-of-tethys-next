'use client';
import { useState } from 'react';
import { Map, Crosshair, ExternalLink } from 'lucide-react';

const REAL_WORLD_DATA = [
  { 
    id: 'pteros', 
    gameName: 'Pteros Island', 
    realName: 'Crato Formation', 
    location: 'Araripe Basin, Brazil',
    coords: '7.2° S, 39.4° W',
    desc: 'Lagerstätte famous for exceptionally preserved pterosaurs and insects. The defining inspiration for the Estuary ecology.',
    x: 32, y: 58 
  },
  { 
    id: 'sky-city', 
    gameName: 'Sky City', 
    realName: 'Ahaggar Volcanic Field', 
    location: 'Hoggar Swell, Algeria',
    coords: '23.3° N, 5.5° E',
    desc: 'Volcanic field active during the Cretaceous separation of Africa. Provides the verticality and geothermal vents for the city structure.',
    x: 52, y: 35 
  },
  { 
    id: 'iron-sands', 
    gameName: 'Iron Sands', 
    realName: 'Kem Kem Beds', 
    location: 'Morocco / Algeria Border',
    coords: '30.9° N, 4.1° W',
    desc: 'The "River of Giants." High concentration of large carnivorous dinosaurs (Spinosaurus, Carcharodontosaurus). The source of the "Apex" threat level.',
    x: 48, y: 32 
  }
];

export default function PaleoGIS() {
  const [activePoint, setActivePoint] = useState(null);

  return (
    <section className="bg-[#0f172a] border border-slate-700 rounded-sm overflow-hidden font-sans text-slate-200 shadow-2xl relative h-[600px] flex flex-col">
      
      {/* 1. GIS OVERLAY (Grid Lines) */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* 2. HEADER */}
      <div className="relative z-10 flex justify-between items-center p-4 border-b border-slate-700 bg-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-sm"><Map size={16} className="text-white" /></div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Paleo-GIS System</h3>
            <p className="text-[10px] text-slate-400">Layer: Early Cretaceous (Aptian) • 111 MYA</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4 text-[10px] font-mono text-blue-400">
          <span className="flex items-center gap-1"><Crosshair size={10} /> SAT-LINK ACTIVE</span>
          <span>PROJECTION: MERCATOR-CRETACEOUS</span>
        </div>
      </div>

      {/* 3. MAP VIEWPORT */}
      <div className="relative flex-1 bg-[#020617] overflow-hidden group cursor-crosshair">
        
        {/* Abstract Continent Shapes (CSS placeholder for Tethys Ocean margins) */}
        {/* Africa Plate */}
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[70%] bg-slate-800/30 rounded-[40%_20%_50%_60%] border border-slate-700/50 blur-[1px]" />
        {/* South America Plate */}
        <div className="absolute top-[45%] left-[5%] w-[30%] h-[50%] bg-slate-800/30 rounded-[20%_60%_30%_10%] border border-slate-700/50 blur-[1px]" />

        {/* Tethys Ocean Label */}
        <div className="absolute top-[40%] left-[45%] text-slate-700 font-serif italic text-2xl opacity-50 select-none">
          Tethys Ocean
        </div>

        {/* DATA POINTS */}
        {REAL_WORLD_DATA.map((point) => (
          <button
            key={point.id}
            onClick={() => setActivePoint(point)}
            className={`absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center transition-all duration-300 group/point ${activePoint?.id === point.id ? 'z-30' : 'z-20'}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <div className={`w-2 h-2 rounded-full transition-all ${activePoint?.id === point.id ? 'bg-blue-500 scale-150' : 'bg-slate-400 group-hover/point:bg-blue-400'}`} />
            <div className={`absolute inset-0 border border-blue-500/50 rounded-full ${activePoint?.id === point.id ? 'animate-ping opacity-100' : 'opacity-0 group-hover/point:opacity-50'}`} />
          </button>
        ))}

        {/* CONNECTING LINES (GIS Style) */}
        {activePoint && (
          <svg className="absolute inset-0 pointer-events-none z-10">
            <line 
              x1={`${activePoint.x}%`} y1={`${activePoint.y}%`} 
              x2={window.innerWidth < 768 ? "50%" : "80%"} 
              y2={window.innerWidth < 768 ? "80%" : "70%"} 
              stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" 
              className="opacity-50"
            />
            <circle cx={`${activePoint.x}%`} cy={`${activePoint.y}%`} r="3" fill="#3b82f6" />
          </svg>
        )}

        {/* 4. DATA SIDEBAR (Appears on Selection) */}
        {activePoint && (
          <div className="absolute bottom-0 md:bottom-8 md:right-8 w-full md:w-80 bg-slate-900/95 border-t-4 md:border-t-0 md:border-l-4 border-blue-600 p-6 shadow-2xl z-40 backdrop-blur-sm font-sans text-xs animate-in slide-in-from-bottom-4 md:slide-in-from-right-4">
            <div className="flex justify-between items-start mb-2">
               <div>
                 <span className="text-[9px] text-blue-400 uppercase tracking-widest block mb-1">Real World Location</span>
                 <h4 className="text-white text-lg font-bold uppercase">{activePoint.realName}</h4>
               </div>
               <button onClick={() => setActivePoint(null)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            
            <div className="text-slate-400 mb-4 border-b border-slate-700 pb-2">{activePoint.location}</div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="block text-[9px] text-slate-500 uppercase tracking-wider mb-1">Game Node</span>
                <span className="text-slate-200 font-bold">{activePoint.gameName}</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 uppercase tracking-wider mb-1">Coordinates</span>
                <span className="text-slate-200 font-mono">{activePoint.coords}</span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed italic border-l-2 border-slate-700 pl-3 mb-4">
              "{activePoint.desc}"
            </p>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePoint.realName + ' ' + activePoint.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600/10 border border-blue-600/50 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors uppercase tracking-widest text-[9px] rounded-sm"
            >
              View Satellite Data <ExternalLink size={10} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}