'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Scroll, Fingerprint, Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react';

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

  // Load & Listen for Evolution
  useEffect(() => {
    // 1. Load initial from storage
    const stored = typeof window !== 'undefined' ? localStorage.getItem('tethys_player_stats') : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      setStats(parsed);
      updateRank(parsed.total);
    }

    // 2. Listen for 'tethys:evolved' (triggered by discoveries)
    const handleEvolution = (e) => {
      const { weight } = e.detail; // e.g., 'creature', 'lore'
      setStats(prev => {
        const next = { 
          ...prev, 
          [weight]: (prev[weight] || 0) + 1,
          total: (prev.total || 0) + 1
        };
        localStorage.setItem('tethys_player_stats', JSON.stringify(next));
        updateRank(next.total);
        return next;
      });
    };

    window.addEventListener('tethys:evolved', handleEvolution);
    return () => window.removeEventListener('tethys:evolved', handleEvolution);
  }, []);

  const updateRank = (total) => {
    const newRank = RANKS.slice().reverse().find(r => total >= r.threshold) || RANKS[0];
    setRank(newRank);
  };

  // Dynamic Avatar Color based on dominant stat
  const getSoulColor = () => {
    const { lore, creature, geology } = stats;
    if (creature > lore && creature > geology) return 'text-[#10b981]'; // Emerald (Life)
    if (geology > lore && geology > creature) return 'text-[#ef4444]'; // Red (Earth)
    if (lore > creature && lore > geology) return 'text-[#8b5cf6]'; // Violet (Mystery)
    return 'text-[#8a3c23]'; // Default Rust (Tethys)
  };

  return (
    <div className="fixed top-24 right-0 z-[5000] font-body">
      {/* The Tab Handle (Collapsed) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ x: 20 }}
        animate={{ x: isOpen ? -10 : 0 }}
        whileHover={{ x: -5 }}
        className="flex items-center gap-2 bg-[#1a1510] text-[#e6ded0] border-l-2 border-y-2 border-[#8a3c23] p-3 rounded-l-lg shadow-[4px_4px_0_rgba(0,0,0,0.5)] relative group"
      >
        {/* Ghost Scroll Icon Animation */}
        <div className={`relative ${getSoulColor()}`}>
          <Fingerprint className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity" />
          <motion.div 
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }} 
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 blur-md bg-current rounded-full" 
          />
        </div>
        
        {/* Vertical Text Label (Hidden when open) */}
        {!isOpen && (
          <span className="writing-vertical-rl text-[10px] font-mono uppercase tracking-widest opacity-60">
            Identity
          </span>
        )}
      </motion.button>

      {/* The Dropdown (Expanded) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 50, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-full right-4 mt-2 w-64 bg-[#e6ded0] border-2 border-[#3d2b1f] shadow-[8px_8px_0_rgba(0,0,0,0.4)] overflow-hidden rounded-bl-3xl"
          >
            {/* Header: Rank & Avatar */}
            <div className="bg-[#1a1510] p-4 text-center relative overflow-hidden">
              {/* "Illuminates the place" - Glow behind avatar */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current ${getSoulColor()}`} />
              
              <div className="relative z-10 flex flex-col items-center gap-2">
                 <div className={`p-3 rounded-full border-2 border-[#8a3c23] bg-[#2b221b] ${getSoulColor()}`}>
                    <User className="w-8 h-8" />
                 </div>
                 <div>
                   <h3 className="text-[#e6ded0] font-display text-xl uppercase tracking-wider">{rank.title}</h3>
                   <p className="text-[10px] font-mono text-[#8a3c23] uppercase tracking-[0.3em]">Clearance Level {Math.floor(stats.total / 5)}</p>
                 </div>
              </div>
            </div>

            {/* Scroll: Stats List */}
            <div className="p-4 space-y-4 relative">
              <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-40 mix-blend-multiply" />
              
              <StatRow label="Lore Knowledge" value={stats.lore} icon={<Scroll className="w-3 h-3" />} />
              <StatRow label="Bio-Resonance" value={stats.creature} icon={<Fingerprint className="w-3 h-3" />} />
              <StatRow label="Geo-Mapping" value={stats.geology} icon={<MapIcon className="w-3 h-3" />} />

              <div className="pt-4 mt-4 border-t border-[#3d2b1f]/20 text-center">
                 <p className="text-[9px] font-mono text-[#5c4f43] uppercase italic">
                   "The archive remembers your path."
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2 text-[#5c4f43]">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-display text-[#1a1510]">{value}</span>
        {/* Small "tick" animation when value changes would go here */}
      </div>
    </div>
  );
}