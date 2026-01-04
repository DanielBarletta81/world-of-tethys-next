'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateStaffProfile } from '@/lib/staff-utils';
import { useTethys } from '@/context/TethysContext';



export default function StaffSequencer({
  initialStats,
  initialPath,
  inventoryOverride,
  onProfile
}) {
  // 1. GET REAL STATS FROM LOCAL STORAGE (Where PlayerAvatar saves them)
  const [stats, setStats] = useState(initialStats || { geology: 0, creature: 0, lore: 0, human: 0 });
  const [staff, setStaff] = useState(null);
  const [path, setPath] = useState(initialPath || null);
  const { resin = 0, inventory = [] } = useTethys();

  const inventoryPool = useMemo(() => {
    if (inventoryOverride && inventoryOverride.length) return inventoryOverride;
    if (inventory.length) return inventory.map((item) => item.id || item.name).filter(Boolean);
    return ['Map_fragment'];
  }, [inventoryOverride, inventory]);

  useEffect(() => {
    // Hydrate from props or storage
    if (initialStats) {
      setStats(initialStats);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tethys_player_stats');
      if (stored) {
        try {
          setStats(JSON.parse(stored));
        } catch (e) {
          console.error("Staff Sequencer: Corrupted Data");
        }
      }
    }
  }, [initialStats]);

  useEffect(() => {
    if (initialPath) {
      setPath(initialPath);
    } else if (typeof window !== 'undefined') {
      const savedPath = localStorage.getItem('tethys_path');
      if (savedPath) setPath(savedPath);
    }
  }, [initialPath]);

  useEffect(() => {
    // 2. GENERATE STAFF DYNAMICALLY
    const profile = generateStaffProfile(stats, inventoryPool); 
    setStaff(profile);
    onProfile?.(profile);
  }, [stats, inventoryPool, onProfile]);

  if (!staff) return <div className="text-xs font-mono text-cyan-500 animate-pulse">Initializing Fabricator...</div>;


  return (
    <div className="w-full max-w-lg mx-auto p-1 bg-gradient-to-br from-stone-700 to-stone-900 rounded-xl shadow-2xl">
      <div className="bg-[#0c0a09] p-6 rounded-[10px] relative overflow-hidden">
        
        {/* BACKGROUND GRID */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.1 
        }}></div>

        {/* HEADER */}
        <div className="relative z-10 flex justify-between items-start mb-8">
          <div>
            <div className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest mb-1">
              Fabricator Output // v2.0
            </div>
            <h2 className="text-2xl font-serif text-white tracking-widest uppercase">
              {staff.name}
            </h2>
            <div className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border ${
              staff.rarity === 'Rare' 
                ? 'border-purple-500/50 text-purple-400 bg-purple-900/20' 
                : 'border-stone-500/50 text-stone-400 bg-stone-800/20'
            }`}>
              Class: {staff.rarity}
            </div>
            <div className="mt-2 flex gap-3 text-[11px] text-stone-400">
              {path && <span className="uppercase tracking-[0.2em]">Path: {path.replace(/-/g, ' ')}</span>}
              <span className="uppercase tracking-[0.2em]">Resin: {resin}</span>
            </div>
          </div>
        </div>

        {/* THE VISUAL (CSS Generative Art) */}
        <div className="relative h-64 w-full border border-stone-800 bg-stone-900/50 rounded-lg mb-8 flex justify-center items-center overflow-hidden">
           
           {/* Glow Effect */}
           <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at center, ${staff.visuals.glowColor}, transparent 70%)` }}></div>

           {/* The Staff Shaft */}
           <motion.div 
             initial={{ height: 0 }}
             animate={{ height: '80%' }}
             transition={{ duration: 1 }}
             className="w-4 relative shadow-lg"
             style={{ background: staff.visuals.shaftGradient, borderRadius: '4px' }}
           >
              {/* The Wrap (Stripes) */}
              <div className="absolute inset-0 flex flex-col justify-center gap-2 opacity-80">
                {[...Array(5)].map((_, i) => (
                   <div key={i} className="h-1 w-full" style={{ background: staff.visuals.wrapColor }}></div>
                ))}
              </div>
           </motion.div>

           {/* The Apex (Head) */}
           <motion.div 
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.5, duration: 0.5 }}
             className="absolute top-12 w-8 h-8 rounded-full blur-[2px] animate-pulse"
             style={{ 
               background: staff.visuals.glowColor,
               boxShadow: `0 0 20px ${staff.visuals.glowColor}` 
             }}
           />
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="border border-stone-800 bg-stone-900/50 p-3 rounded">
             <div className="text-[9px] uppercase text-stone-500 tracking-widest">Power Output</div>
             <div className="text-xl font-mono text-white">{staff.stats.power.toFixed(1)} <span className="text-xs text-stone-600">MW</span></div>
           </div>
           <div className="border border-stone-800 bg-stone-900/50 p-3 rounded">
             <div className="text-[9px] uppercase text-stone-500 tracking-widest">Resonance</div>
             <div className="text-xl font-mono text-white">{staff.stats.resonance.toFixed(1)} <span className="text-xs text-stone-600">Hz</span></div>
           </div>
        </div>

        {/* COMPONENTS LIST */}
        <div className="space-y-2 border-t border-stone-800 pt-4">
          <ComponentRow label="Core Material" value={staff.components.core.label} />
          <ComponentRow label="Binding" value={staff.components.wrap.label} />
          <ComponentRow label="Focus Unit" value={staff.components.apex.label} />
        </div>

        {/* EXPORT BUTTON */}
        <button className="w-full mt-6 py-3 bg-cyan-900/30 border border-cyan-800 hover:bg-cyan-900/50 text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] transition-all rounded group">
          <span className="group-hover:hidden">Sequence Complete</span>
          <span className="hidden group-hover:inline">Export to Engine &rarr;</span>
        </button>

      </div>
    </div>
  );
}

// Simple Helper Component
function ComponentRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-uppercase tracking-wide">{label}</span>
      <span className="text-stone-300 font-serif">{value}</span>
    </div>
  );
}
