'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Scroll, Fingerprint, Map as MapIcon, X } from 'lucide-react';

const RANKS = [
  { threshold: 0, title: 'Drifter' },
  { threshold: 5, title: 'Observer' },
  { threshold: 15, title: 'Cartographer' },
  { threshold: 30, title: 'Chronicler' },
  { threshold: 50, title: 'Warden of Tethys' }
];

export default function PlayerAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({ lore: 0, creature: 0, geology: 0, total: 0 });
  const [rank, setRank] = useState(RANKS[0]);
  const [nextRank, setNextRank] = useState(RANKS[1]);
  
  // Ref for "Click Outside" detection
  const menuRef = useRef(null);

  // 1. CLICK OUTSIDE LISTENER
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // 2. LOAD & LISTEN (With improved safety)
  useEffect(() => {
    const updateRankLogic = (currentTotal) => {
      const current = RANKS.slice().reverse().find(r => currentTotal >= r.threshold) || RANKS[0];
      const next = RANKS.find(r => r.threshold > currentTotal) || { threshold: 100, title: 'Ascended' };
      setRank(current);
      setNextRank(next);
    };

    // Load initial
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tethys_player_stats');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStats(parsed);
          updateRankLogic(parsed.total || 0);
        } catch (e) {
          console.error("Corrupted archive found.", e);
        }
      }
    }

    // Listen for evolution
    const handleEvolution = (e) => {
      const { weight } = e.detail || {}; // Safety check
      if (!weight) return;

      setStats(prev => {
        const nextStats = { 
          ...prev, 
          [weight]: (prev[weight] || 0) + 1,
          total: (prev.total || 0) + 1
        };
        localStorage.setItem('tethys_player_stats', JSON.stringify(nextStats));
        updateRankLogic(nextStats.total);
        return nextStats;
      });
    };

    window.addEventListener('tethys:evolved', handleEvolution);
    return () => window.removeEventListener('tethys:evolved', handleEvolution);
  }, []);

  // Dynamic Avatar Color
  const getSoulColor = () => {
    const { lore, creature, geology } = stats;
    if (creature > lore && creature > geology) return 'text-emerald-500 border-emerald-500/50';
    if (geology > lore && geology > creature) return 'text-red-500 border-red-500/50';
    if (lore > creature && lore > geology) return 'text-violet-500 border-violet-500/50';
    return 'text-amber-600 border-amber-600/50'; // Default
  };

  // Calculate Progress % to next rank
  const progressPercent = Math.min(100, Math.max(0, 
    ((stats.total - rank.threshold) / (nextRank.threshold - rank.threshold)) * 100
  ));

  return (
    <div ref={menuRef} className="fixed top-24 right-0 z-[50] font-sans">
      
      {/* TOGGLE HANDLE */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ x: 20 }}
        animate={{ x: isOpen ? -10 : 0 }}
        whileHover={{ x: -5 }}
        className={`flex items-center justify-center w-12 h-14 bg-[#1c1917] text-stone-300 border-l-2 border-y-2 border-stone-800 rounded-l-lg shadow-xl relative group transition-colors ${isOpen ? 'bg-stone-900' : ''}`}
        aria-label="Toggle Player Stats"
      >
        <div className={`relative transition-colors duration-500 ${getSoulColor().split(' ')[0]}`}>
          {isOpen ? <X className="w-6 h-6" /> : <Fingerprint className="w-6 h-6 opacity-80 group-hover:opacity-100" />}
          
          {/* Pulse Effect (Only when closed) */}
          {!isOpen && (
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }} 
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 blur-md bg-current rounded-full" 
            />
          )}
        </div>
      </motion.button>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 50, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-full right-4 mt-2 w-72 bg-[#1c1917] border border-stone-700 shadow-2xl rounded-bl-3xl overflow-hidden"
          >
            {/* Header: Rank & Avatar */}
            <div className="bg-black/40 p-6 text-center relative overflow-hidden border-b border-stone-800">
              
              {/* Background Glow */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[60px] opacity-20 bg-current ${getSoulColor().split(' ')[0]}`} />
              
              <div className="relative z-10 flex flex-col items-center gap-3">
                 <div className={`p-4 rounded-full border-2 bg-[#0c0a09] shadow-lg ${getSoulColor()}`}>
                    <User className="w-8 h-8" />
                 </div>
                 <div>
                   <h3 className="text-stone-200 font-serif text-xl uppercase tracking-widest">{rank.title}</h3>
                   <p className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.3em]">
                     Clearance Level {Math.floor(stats.total / 5)}
                   </p>
                 </div>
              </div>

              {/* Progress Bar to Next Rank */}
              <div className="mt-4 relative h-1 w-full bg-stone-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                  className={`absolute top-0 left-0 h-full ${getSoulColor().split(' ')[0].replace('text-', 'bg-')}`}
                />
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-stone-600 font-mono uppercase">
                <span>{stats.total} XP</span>
                <span>Next: {nextRank.title} ({nextRank.threshold})</span>
              </div>
            </div>

            {/* Stats List */}
            <div className="p-6 space-y-5 relative">
               {/* Paper Texture Overlay */}
               <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
              
              <StatRow label="Lore Knowledge" value={stats.lore} icon={<Scroll className="w-4 h-4" />} color="text-violet-400" />
              <StatRow label="Bio-Resonance" value={stats.creature} icon={<Fingerprint className="w-4 h-4" />} color="text-emerald-400" />
              <StatRow label="Geo-Mapping" value={stats.geology} icon={<MapIcon className="w-4 h-4" />} color="text-red-400" />

              <div className="pt-4 border-t border-stone-800 text-center">
                 <p className="text-[10px] font-mono text-stone-600 uppercase italic">
                   "The archive remembers."
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 3. IMPROVED ROW COMPONENT (With number animation)
function StatRow({ label, value, icon, color }) {
  return (
    <div className="flex items-center justify-between group">
      <div className={`flex items-center gap-3 text-stone-500 group-hover:${color} transition-colors`}>
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {/* Key changes trigger a pop animation */}
        <motion.span 
          key={value}
          initial={{ scale: 1.5, color: '#fff' }}
          animate={{ scale: 1, color: '#a8a29e' }}
          className="text-sm font-mono text-stone-400"
        >
          {value}
        </motion.span>
      </div>
    </div>
  );
}