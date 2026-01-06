'use client';

import { useEffect, useMemo, useState } from 'react';
import { Compass, Gem, Sparkles, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTethys } from '@/context/TethysContext';
import { generateStaffProfile } from '@/lib/staff-utils';
import PlayerAvatar from './PlayerAvatar';
import StaffVisualizer from './StaffVisualizer';
import SeedVisualizer from './SeedVisualizer';
import StaffSequencer from './StaffSequencer';

const DEFAULT_STATS = { geology: 35, creature: 25, lore: 20, human: 10 };
const PATH_CHOICES = [
  { id: 'root-whisper', label: 'Root Whisper' },
  { id: 'bond-mystic', label: 'Bond Mystic' },
  { id: 'triumvirate', label: 'Triumvirate' }
];

const STAT_FIELDS = [
  { key: 'geology', label: 'Geothermal Read', hint: 'Mantle / stone empathy', tone: 'from-orange-800/60 to-red-700/40' },
  { key: 'creature', label: 'Biologic Bond', hint: 'Beast whisper / kith', tone: 'from-amber-700/50 to-lime-700/40' },
  { key: 'lore', label: 'Lore Index', hint: 'Archive decipher speed', tone: 'from-cyan-700/50 to-sky-700/30' },
  { key: 'human', label: 'Human Factor', hint: 'Negotiation / trade', tone: 'from-stone-700/60 to-stone-600/30' }
];

const withTotals = (next) => ({
  ...next,
  total: Math.round((next.geology + next.creature + next.lore + next.human) / 10)
});

export default function PlayerProfile() {
  const { user } = useAuth();
  const { stats: tethysStats = {}, inventory = [] } = useTethys();
  
  // Local State for Tuning (Visual only until saved)
  const [playerStats, setPlayerStats] = useState(withTotals(DEFAULT_STATS));
  const [path, setPath] = useState(null);
  const [staffProfile, setStaffProfile] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const inventoryIds = useMemo(() => inventory.map((item) => item.id), [inventory]);

  // --- HYDRATION & PERSISTENCE ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('tethys_player_stats');
      const storedPath = window.localStorage.getItem('tethys_path');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPlayerStats(withTotals({ ...DEFAULT_STATS, ...parsed }));
      }
      if (storedPath) setPath(storedPath);
    } catch {
      setPlayerStats(withTotals(DEFAULT_STATS));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem('tethys_player_stats', JSON.stringify(playerStats));
  }, [playerStats, hydrated]);

  useEffect(() => {
    if (!hydrated || !path || typeof window === 'undefined') return;
    window.localStorage.setItem('tethys_path', path);
  }, [path, hydrated]);

  // Live Staff Preview Update
  useEffect(() => {
    const profile = generateStaffProfile(playerStats, inventoryIds.length ? inventoryIds : ['Map_fragment']);
    setStaffProfile(profile);
  }, [playerStats, inventoryIds]);

  const updateStat = (key, value) => {
    setPlayerStats((prev) => withTotals({ ...prev, [key]: Math.max(0, Math.min(100, value)) }));
  };

  // --- PROGRESSION MATH ---
  // Calculates how close you are to the next "Tier" based on total stat points
  const currentTier = Math.floor(playerStats.total / 10) + 1; 
  const progressToNext = (playerStats.total % 10) / 10 * 100;

  return (
    <section className="relative bg-[#0c0a09] border border-stone-800 rounded-2xl p-6 shadow-2xl overflow-hidden group/main">
      
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none" />
      <div className="absolute -left-24 top-0 w-72 h-72 bg-amber-900/10 blur-[120px] rounded-full transition-opacity duration-700 group-hover/main:opacity-80" />
      <div className="absolute right-0 -bottom-16 w-72 h-72 bg-cyan-900/10 blur-[120px] rounded-full transition-opacity duration-700 group-hover/main:opacity-80" />

      <div className="relative z-10 space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono mb-1">Operative Record</p>
            <h2 className="text-3xl font-serif text-white leading-none">{user?.displayName || 'Ghost Warden'}</h2>
          </div>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1c1917] border border-amber-700/40 rounded shadow-[0_0_10px_rgba(245,158,11,0.1)]">
              <Gem size={12} className="text-amber-500" />
              <span>Resin {tethysStats.resin ?? 0}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1c1917] border border-stone-700 rounded">
              <Compass size={12} className="text-cyan-400" />
              <span>{path ? PATH_CHOICES.find((p) => p.id === path)?.label || path : 'Unaligned'}</span>
            </div>
          </div>
        </header>

        {/* --- PROGRESSION RAIL (The New Feature) --- */}
        <div className="flex justify-center items-center gap-4 md:gap-12 py-4">
          
          {/* 1. CURRENT STATE (Active Avatar) */}
          <div className="relative group/avatar cursor-pointer">
             <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
             <PlayerAvatar statsOverride={playerStats} />
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-amber-500 font-mono whitespace-nowrap">
               Tier {currentTier}: Active
             </div>
          </div>

          {/* 2. THE LINE (Connecting Thread) */}
          <div className="flex-1 h-[2px] bg-stone-800 relative max-w-[120px] rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 via-orange-500 to-cyan-500" 
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* 3. FUTURE STATE (Ghost Staff Preview) */}
          <div className="relative group/ghost opacity-60 hover:opacity-100 transition-all duration-300">
             <div className="w-20 h-20 rounded-full border border-dashed border-stone-600 bg-stone-900/30 flex items-center justify-center group-hover/ghost:border-cyan-500/50 group-hover/ghost:bg-cyan-950/20 group-hover/ghost:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all">
               <Lock size={16} className="text-stone-500 group-hover/ghost:text-cyan-400" />
             </div>
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-stone-600 font-mono whitespace-nowrap group-hover/ghost:text-cyan-400 transition-colors">
               Tier {currentTier + 1} Locked
             </div>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-5 gap-6">
          
          {/* LEFT: STAT TUNER */}
          <div className="lg:col-span-2 bg-[#0f0b09] border border-stone-800 rounded-xl p-5 space-y-6 hover:border-stone-700 transition-colors">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-mono">Resonance Tuner</p>
              <span className="text-lg font-mono text-amber-200">{playerStats.total} <span className="text-[10px] text-stone-600">HEAT</span></span>
            </div>

            <div className="space-y-4">
              {STAT_FIELDS.map((field) => (
                <div key={field.key} className="group/slider">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 group-hover/slider:text-white transition-colors">{field.label}</span>
                    <span className="text-xs font-mono text-amber-200">{playerStats[field.key]}</span>
                  </div>
                  <div className={`h-2 rounded-full bg-stone-900 overflow-hidden relative border border-stone-800 group-hover/slider:border-stone-600 transition-colors`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${field.tone} opacity-50`} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={playerStats[field.key]}
                      onChange={(e) => updateStat(field.key, Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div 
                      className="h-full bg-stone-400 w-1 absolute top-0 pointer-events-none"
                      style={{ left: `${playerStats[field.key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-800">
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-3">Path Alignment</p>
              <div className="flex flex-wrap gap-2">
                {PATH_CHOICES.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => setPath(choice.id)}
                    className={`px-3 py-2 text-[10px] uppercase tracking-wider rounded border transition-all ${
                      path === choice.id
                        ? 'border-amber-600/60 text-amber-100 bg-amber-900/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                        : 'border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-300'
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: STAFF VISUALIZER */}
          <div className="lg:col-span-3 bg-[#0f0b09] border border-stone-800 rounded-xl p-5 flex flex-col gap-6 hover:border-cyan-900/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Sparkles size={120} />
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-600 font-mono">Projection</p>
                <h3 className="text-xl text-white font-serif tracking-wide">{staffProfile?.name || 'Uncalibrated'}</h3>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 bg-cyan-950/30 border border-cyan-800/50 px-2 py-1 rounded">
                {staffProfile?.rarity || 'Common'}
              </span>
            </div>

            <div className="bg-[#080605] border border-stone-800 rounded-lg p-4 shadow-inner relative">
              {staffProfile ? (
                <StaffVisualizer staffData={staffProfile} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-xs text-stone-600 font-mono uppercase tracking-widest">
                  Awaiting Input Sequence...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM: SEQUENCER & SEED */}
        <div className="grid md:grid-cols-2 gap-6">
           <div className="bg-[#0f0b09] border border-stone-800 rounded-xl p-5 hover:border-amber-900/30 transition-colors">
              <StaffSequencer
                initialStats={playerStats}
                initialPath={path}
                inventoryOverride={inventoryIds}
                onProfile={setStaffProfile}
              />
           </div>
           
           <div className="flex items-center justify-center">
              <SeedVisualizer seed={staffProfile?.seed || 'H-000'} currentScores={playerStats} />
           </div>
        </div>

      </div>
    </section>
  );
}