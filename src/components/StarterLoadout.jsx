'use client';

import React, { useState, useEffect } from 'react';
import { Hammer, RefreshCw, Lock, Shield, Brain, Clock, Gem } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';

// --- DATA POOLS ---
const STAFF_PARTS = {
  conditions: ['Salt-Cured', 'Barnacle-Encrusted', 'Sun-Bleached', 'Storm-Splintered', 'Algae-Slicked'],
  materials: ['Pteros Driftwood', 'Iron-Mangrove Root', 'Petrified Fern-Stem', 'Hollowed Coral-Branch'],
  accents: ['embedded with Raw Amber', 'wrapped in Copper Wire', 'tipped with a Raptor Tooth', 'glowing with Blue Moss', 'bound in Shark Leather']
};

const RAVEL_KIT_POOL = [
  { id: 'h_01', name: 'Vigor-Root', type: 'Healing', effect: 'Regen', icon: '🌱', rarity: 'Common' },
  { id: 'h_02', name: 'Luminous Mycelium', type: 'Wisdom', effect: 'Night Vision', icon: '🍄', rarity: 'Uncommon' },
  { id: 'h_03', name: 'Mud-Balm', type: 'Survival', effect: 'Cure Toxin', icon: '🏺', rarity: 'Common' },
  { id: 'h_04', name: 'Crystal Nectar', type: 'Energy', effect: 'Stamina', icon: '💎', rarity: 'Rare' },
  { id: 'h_05', name: 'Void-Fungi', type: 'Stealth', effect: 'Masking', icon: '🌑', rarity: 'Epic' },
  { id: 'h_06', name: 'Brine-Salt', type: 'Survival', effect: 'Stanch', icon: '🧂', rarity: 'Common' },
  { id: 'h_07', name: 'Amber Lozenge', type: 'Wisdom', effect: 'Stabilize', icon: '💊', rarity: 'Uncommon' },
  { id: 'h_08', name: 'Ghost Spores', type: 'Utility', effect: 'Camo', icon: '🌿', rarity: 'Rare' }
];

const StarterLoadout = () => {
  const { canHarvest, performDailyHarvest, inventory, equippedStaff, stats } = useTethys();
  const [mounted, setMounted] = useState(false);

  // Local state for display ONLY
  const [displayStaff, setDisplayStaff] = useState(null);
  const [displayInventory, setDisplayInventory] = useState([]);

  useEffect(() => {
    setMounted(true);
    if (equippedStaff) setDisplayStaff(equippedStaff);
    if (inventory.length > 0) setDisplayInventory(inventory);
  }, [equippedStaff, inventory]);

  const handleHarvest = () => {
    if (!canHarvest) return;
    
    const cond = STAFF_PARTS.conditions[Math.floor(Math.random() * STAFF_PARTS.conditions.length)];
    const mat = STAFF_PARTS.materials[Math.floor(Math.random() * STAFF_PARTS.materials.length)];
    const acc = STAFF_PARTS.accents[Math.floor(Math.random() * STAFF_PARTS.accents.length)];
    
    const newStaff = {
      uid: `staff_${Math.floor(Math.random() * 9999)}`,
      name: `${cond} ${mat}`,
      desc: `A weathered stave found on the shores of Pteros, ${acc}.`,
      power: Math.floor(Math.random() * 20) + 10
    };

    const shuffled = [...RAVEL_KIT_POOL].sort(() => 0.5 - Math.random());
    const newItems = shuffled.slice(0, 5);

    const wisdomBoost = newItems.filter(i => i.rarity === 'Rare' || i.rarity === 'Epic').length * 10;
    const survivalBoost = newItems.filter(i => i.type === 'Survival' || i.type === 'Healing').length * 12;
    
    const newStats = {
      kith: 40 + wisdomBoost + Math.floor(Math.random() * 10),
      igzier: 40 + survivalBoost + Math.floor(Math.random() * 10)
    };

    performDailyHarvest(newStaff, newItems, newStats);
  };

  if (!mounted) return <div className="p-8 text-orange-900/50 font-mono text-center uppercase tracking-widest text-xs">Syncing Supply...</div>;

  return (
    <div className="w-full bg-[#1c1917] border border-[#292524] shadow-2xl font-serif text-[#e7e5e4] relative overflow-hidden rounded-sm">
      
      {/* Decorative Corner Brackets */}
      <div className="hidden md:block absolute top-0 left-0 w-4 h-4 border-t border-l border-orange-900/50"></div>
      <div className="hidden md:block absolute top-0 right-0 w-4 h-4 border-t border-r border-orange-900/50"></div>

      {/* Header */}
      <div className="bg-[#0c0a09] p-4 md:p-6 border-b border-[#292524] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-lg md:text-xl font-bold text-[#e7e5e4] tracking-widest uppercase flex items-center justify-center md:justify-start gap-3">
            <Hammer className="text-orange-700" size={18} /> Provisioning
          </h2>
        </div>
        
        {/* Mobile: Full Width Button */}
        <button 
          onClick={handleHarvest}
          disabled={!canHarvest}
          className={`w-full md:w-auto group flex items-center justify-center gap-2 px-6 py-3 md:py-2 border transition-all uppercase text-[10px] tracking-[0.2em] font-sans ${
            canHarvest 
              ? 'bg-[#292524] border-orange-900/50 hover:border-orange-500 hover:text-orange-500 cursor-pointer active:scale-95' 
              : 'bg-black/50 border-[#292524] text-[#44403c] cursor-not-allowed'
          }`}
        >
          {canHarvest ? (
            <>
              <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
              Forage Drift
            </>
          ) : (
            <>
              <Lock size={12} />
              Depleted
            </>
          )}
        </button>
      </div>

      {!displayStaff ? (
        <div className="p-12 text-center">
          <p className="text-[#44403c] uppercase tracking-widest text-xs font-sans">The table is empty.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          
          {/* GEAR LAYOUT */}
          <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[#292524] space-y-8 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
            
            {/* The Staff */}
            <div>
              <h3 className="text-[10px] font-sans uppercase tracking-widest text-orange-900 mb-2 font-bold">Weaponry</h3>
              <div className="bg-[#0c0a09]/80 border border-[#292524] p-4 shadow-lg rounded-sm">
                <div className="text-lg font-bold text-orange-100 mb-1 font-serif leading-tight">{displayStaff.name}</div>
                <p className="text-xs text-[#78716c] italic leading-relaxed">"{displayStaff.desc}"</p>
                <div className="mt-3 text-[9px] uppercase tracking-widest text-orange-800 border-t border-[#292524] pt-2">
                   Power Rating: {displayStaff.power}
                </div>
              </div>
            </div>

            {/* The Potions */}
            <div>
              <h3 className="text-[10px] font-sans uppercase tracking-widest text-orange-900 mb-2 font-bold">Apothecary</h3>
              <div className="grid grid-cols-1 gap-2">
                {displayInventory.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center gap-4 border-b border-[#292524] pb-2 last:border-0 last:pb-0">
                    <div className="text-xl opacity-80">{item.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm text-[#d6d3d1] font-serif font-bold">{item.name}</div>
                      <div className="text-[9px] text-[#57534e] uppercase tracking-wide">{item.effect}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* STATS SHEET */}
          <div className="bg-[#0c0a09] p-6 md:p-8 flex flex-col gap-6 lg:min-w-[300px]">
            
            {/* Resin (New) */}
            <div className="flex items-center justify-between bg-[#1c1917] p-3 border border-orange-900/30 rounded-sm">
                <div className="flex items-center gap-2 text-orange-500 uppercase tracking-widest text-[10px] font-bold">
                    <Gem size={14} /> Resin
                </div>
                <span className="text-xl font-mono text-[#e7e5e4]">{stats.resin || 0}</span>
            </div>

            {/* Kith */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#78716c]">Kith (Wisdom)</span>
                <span className="text-lg font-bold text-orange-500 font-serif">{stats.kith}</span>
              </div>
              <div className="h-1.5 w-full bg-[#1c1917] rounded-full overflow-hidden">
                <div className="h-full bg-orange-800 transition-all duration-1000" style={{ width: `${stats.kith}%` }}></div>
              </div>
            </div>

            {/* Igzier */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#78716c]">Igzier (Survival)</span>
                <span className="text-lg font-bold text-red-600 font-serif">{stats.igzier}</span>
              </div>
              <div className="h-1.5 w-full bg-[#1c1917] rounded-full overflow-hidden">
                <div className="h-full bg-red-900 transition-all duration-1000" style={{ width: `${stats.igzier}%` }}></div>
              </div>
            </div>

            {!canHarvest && (
              <div className="mt-4 lg:mt-auto text-center border-t border-[#1c1917] pt-4">
                 <div className="inline-flex items-center gap-2 text-[9px] text-[#44403c] uppercase tracking-widest px-4 py-2 bg-[#1c1917] rounded-full">
                    <Clock size={10} /> Supply Route Cooldown: 24h
                 </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default StarterLoadout;