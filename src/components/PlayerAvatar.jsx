'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Flame, Zap, Mountain, X, Activity } from 'lucide-react';

// RANKS REIMAGINED AS HEAT LEVELS
const RANKS = [
  { threshold: 0, title: 'Cold Iron' },
  { threshold: 5, title: 'Smoldering' },
  { threshold: 15, title: 'Tempered' },
  { threshold: 30, title: 'White Hot' },
  { threshold: 50, title: 'Molten Core' }
];

export default function PlayerAvatar({ statsOverride }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(statsOverride || { lore: 0, creature: 0, geology: 0, human: 0, total: 0 });
  const [rank, setRank] = useState(RANKS[0]);
  const [nextRank, setNextRank] = useState(RANKS[1]);
  const menuRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);
  const STORAGE_KEY = 'tethys_player_stats';

  const normalizeStats = (raw = {}) => {
    const lore = raw.lore ?? 0;
    const creature = raw.creature ?? 0;
    const geology = raw.geology ?? 0;
    const human = raw.human ?? 0;
    const total = raw.total ?? Math.round((lore + creature + geology + human) / 10);
    return { lore, creature, geology, human, total };
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  useEffect(() => {
    if (statsOverride) {
      setStats(normalizeStats(statsOverride));
      setHydrated(true);
      return;
    }
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setStats(normalizeStats(JSON.parse(stored)));
      }
    } catch {
      // ignore parse failures
    } finally {
      setHydrated(true);
    }
  }, [statsOverride]);

  useEffect(() => {
    if (statsOverride || !hydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore storage failures
    }
  }, [stats, hydrated, statsOverride]);

  useEffect(() => {
    if (statsOverride || typeof window === 'undefined') return;
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          setStats(normalizeStats(JSON.parse(event.newValue)));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [statsOverride]);

  useEffect(() => {
    const current = [...RANKS].reverse().find(r => stats.total >= r.threshold) || RANKS[0];
    const idx = RANKS.findIndex(r => r.threshold === current.threshold);
    setRank(current);
    setNextRank(RANKS[Math.min(idx + 1, RANKS.length - 1)]);
  }, [stats.total]);

  // DYNAMIC HEAT COLOR (Based on dominant stat)
  const getThermalState = () => {
    const { lore, creature, geology } = stats;
    // Creature = Organic Fuel (Yellow/Orange)
    if (creature > lore && creature > geology) return { color: 'text-forge-yellow', icon: <Flame className="w-4 h-4"/>, label: 'Bio-Fuel' };
    // Geology = Magma Heat (Deep Red)
    if (geology > lore && geology > creature) return { color: 'text-forge-red', icon: <Mountain className="w-4 h-4"/>, label: 'Geothermal' };
    // Lore = Arcane Spark (White Hot)
    if (lore > creature && lore > geology) return { color: 'text-forge-white', icon: <Zap className="w-4 h-4"/>, label: 'Arcane Spark' };
    
    // Default
    return { color: 'text-forge-orange', icon: <Activity className="w-4 h-4"/>, label: 'Ambience' }; 
  };

  const thermal = getThermalState();
  
  // Progress to next "Melting Point"
  const progressPercent = Math.min(100, Math.max(0, 
    ((stats.total - rank.threshold) / (nextRank.threshold - rank.threshold)) * 100
  ));

  return (
    <div ref={menuRef} className="fixed top-24 right-0 z-[50] font-mono">
      
      {/* 1. THE TOGGLE HANDLE (Heat Sink Style) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ x: 20 }}
        animate={{ x: isOpen ? -10 : 0 }}
        whileHover={{ x: -5 }}
        // NEW: Molten Border and Dark Background
        className={`flex items-center justify-center w-14 h-16 bg-[#0c0a09] text-stone-300 border-l-2 border-y-2 rounded-l-lg shadow-[0_0_20px_rgba(234,88,12,0.2)] relative group transition-colors
          ${isOpen ? 'border-forge-orange' : 'border-stone-800 hover:border-forge-orange'}`}
      >
        <div className={`relative ${thermal.color}`}>
          {isOpen ? <X className="w-6 h-6" /> : thermal.icon}
          
          {/* HEAT PULSE ANIMATION (Only when closed) */}
          {!isOpen && (
            <motion.div 
              animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 blur-md bg-current rounded-full" 
            />
          )}
        </div>
      </motion.button>

      {/* 2. THE DROPDOWN (The Furnace) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 50, height: 0 }}
            className="absolute top-full right-4 mt-2 w-80 bg-[#1c1917] border-2 border-forge rounded-bl-3xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.3)]"
          >
            {/* Header: Core Temp */}
            <div className="bg-black/60 p-6 text-center relative overflow-hidden border-b border-stone-800">
              {/* Backglow */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] opacity-30 bg-current ${thermal.color}`} />
              
              <div className="relative z-10 flex flex-col items-center gap-3">
                 {/* Avatar Circle with Glow */}
                 <div className={`p-4 rounded-full border-2 bg-[#0c0a09] shadow-[0_0_15px_currentColor] ${thermal.color} border-current`}>
                    <User className="w-8 h-8" />
                 </div>
                 
                 <div>
                   <h3 className="text-forge-intense text-2xl uppercase tracking-widest animate-forge-pulse">
                     {rank.title}
                   </h3>
                   <p className="text-[10px] font-mono text-forge-orange uppercase tracking-[0.3em] mt-1">
                     Core Temp: {stats.total * 100}°F
                   </p>
                 </div>
              </div>

              {/* Heat Bar */}
              <div className="mt-6 relative h-1.5 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r from-forge-red via-forge-orange to-forge-yellow shadow-[0_0_10px_#f59e0b]`}
                />
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-stone-500 font-mono uppercase">
                <span>Ignition</span>
                <span>Critical Mass ({nextRank.threshold * 100}°)</span>
              </div>
            </div>

            {/* Stats List */}
            <div className="p-6 space-y-5 relative">
              <StatRow label="Arcane Knowledge" value={stats.lore} icon={<Zap className="w-3 h-3" />} color="text-forge-white" />
              <StatRow label="Biological Fuel" value={stats.creature} icon={<Flame className="w-3 h-3" />} color="text-forge-yellow" />
              <StatRow label="Geothermal Resonance" value={stats.geology} icon={<Mountain className="w-3 h-3" />} color="text-forge-red" />
              
              <div className="pt-4 border-t border-stone-800/50 text-center">
                 <p className="text-[9px] font-mono text-stone-600 uppercase italic">
                   "Keep the fire burning, Warden."
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatRow({ label, value, icon, color }) {
  return (
    <div className="flex items-center justify-between group">
      <div className={`flex items-center gap-3 text-stone-500 group-hover:${color} transition-colors duration-300`}>
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-mono ${color} drop-shadow-[0_0_5px_currentColor]`}>
          {value}
        </span>
      </div>
    </div>
  );
}
