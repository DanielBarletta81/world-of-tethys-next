'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { generateStaffProfile } from '@/lib/staff-utils';
import { useTethys } from '@/context/TethysContext';
import { Hammer, Check, Loader2 } from 'lucide-react';
import StaffVisualizer from '@/components/StaffVisualizer';

export default function StaffSequencer({ initialStats, initialPath, inventoryOverride, onProfile, onFinalize }) {
  const [stats, setStats] = useState(initialStats || { geology: 0, creature: 0, lore: 0, human: 0 });
  const [staff, setStaff] = useState(null);
  const [path, setPath] = useState(initialPath || null);
  const [isForging, setIsForging] = useState(false); // <--- ADDED
  const [isComplete, setIsComplete] = useState(false); // <--- ADDED
  
  const { resin = 0, inventory = [], performDailyHarvest, forgeStaff, setEquippedStaff } = useTethys();

  const inventoryPool = useMemo(() => {
    if (inventoryOverride && inventoryOverride.length) return inventoryOverride;
    if (inventory.length) return inventory.map((item) => item.id || item.name).filter(Boolean);
    return ['Map_fragment'];
  }, [inventoryOverride, inventory]);

  // ... (Keep existing useEffects for loading stats/path)

  useEffect(() => {
    const profile = generateStaffProfile(stats, inventoryPool); 
    setStaff(profile);
    onProfile?.(profile);
  }, [stats, inventoryPool, onProfile]);

  const handleForge = async () => {
    setIsForging(true);
    // Cinematic delay
    await new Promise(r => setTimeout(r, 2000));
    
    // Save to Context (Simulating an equip)
    // Note: In a real app, you might want a dedicated 'equipStaff' function, 
    // but performDailyHarvest works if you just pass the staff.
    // Or you can expose setEquippedStaff in context if you prefer.
    // For now, we assume performDailyHarvest handles it:
    if (forgeStaff) {
      forgeStaff(staff);
    } else if (performDailyHarvest) {
      performDailyHarvest(staff);
    } else if (setEquippedStaff) {
      setEquippedStaff(staff);
    }
    
    setIsForging(false);
    setIsComplete(true);
    onFinalize?.(staff);
  };

  if (!staff) return <div className="text-xs font-mono text-cyan-500 animate-pulse">Initializing...</div>;

  return (
    <div className="w-full max-w-lg mx-auto p-1 bg-gradient-to-br from-stone-700 to-stone-900 rounded-xl shadow-2xl relative">
      
      {/* SUCCESS OVERLAY */}
      {isComplete && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur flex flex-col items-center justify-center rounded-xl animate-in fade-in">
          <div className="w-20 h-20 bg-emerald-900/30 rounded-full flex items-center justify-center border-2 border-emerald-500 mb-4 shadow-[0_0_30px_#10b981]">
            <Check size={40} className="text-emerald-400" />
          </div>
          <h3 className="text-2xl font-serif text-white tracking-widest">SEQUENCE LOCKED</h3>
          <p className="text-stone-400 text-xs mt-2 font-mono">Staff data written to core memory.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-3 rounded-full border border-stone-700/80 bg-stone-900/60 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-stone-200 hover:border-amber-400/70 hover:text-amber-200"
          >
            <span className="relative h-8 w-8 overflow-hidden rounded-full border border-amber-400/40 bg-black/30">
              <Image
                src="/symbols/tethys-seal.png"
                alt=""
                fill
                sizes="32px"
                className="object-cover"
                priority
              />
            </span>
            Return Home
          </Link>
        </div>
      )}

      <div className="bg-[#0c0a09] p-6 rounded-[10px] relative overflow-hidden">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70 font-mono">Sequence Draft</p>
            <h3 className="text-xl text-stone-100 font-serif">{staff.name}</h3>
            <p className="text-xs text-stone-500 mt-1">{staff.lore?.summary}</p>
          </div>
          <StaffVisualizer staffData={staff} />
          <div className="grid grid-cols-3 gap-2 text-[10px] text-stone-300 uppercase tracking-[0.2em]">
            <div className="bg-stone-900/70 border border-stone-700/60 rounded px-2 py-2 text-center">
              Core
              <div className="text-[11px] text-amber-300 mt-1">{staff.components?.core?.label}</div>
            </div>
            <div className="bg-stone-900/70 border border-stone-700/60 rounded px-2 py-2 text-center">
              Wrap
              <div className="text-[11px] text-amber-300 mt-1">{staff.components?.wrap?.label}</div>
            </div>
            <div className="bg-stone-900/70 border border-stone-700/60 rounded px-2 py-2 text-center">
              Apex
              <div className="text-[11px] text-amber-300 mt-1">{staff.components?.apex?.label}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 uppercase tracking-[0.2em]">
            <span>Power</span>
            <span className="text-emerald-300">{Math.round(staff.stats?.power || 0)}</span>
          </div>
          {staff.perks?.length ? (
            <ul className="text-[11px] text-stone-400 space-y-1">
              {staff.perks.map((perk, idx) => (
                <li key={`${perk}-${idx}`}>• {perk}</li>
              ))}
            </ul>
          ) : null}
        </div>
        
        {/* EXPORT BUTTON */}
        <button 
          onClick={handleForge}
          disabled={isForging || isComplete}
          className={`w-full mt-6 py-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] transition-all rounded border
            ${isForging 
              ? 'bg-amber-900/20 border-amber-600 text-amber-500' 
              : 'bg-cyan-900/30 border-cyan-800 hover:bg-cyan-900/50 text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]'
            }`}
        >
          {isForging ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Forging Sequence...
            </>
          ) : (
            <>
              <Hammer size={16} />
              Finalize & Equip
            </>
          )}
        </button>

      </div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
