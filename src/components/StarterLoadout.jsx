'use client';

import React, { useState, useEffect } from 'react';
import { Hammer, RefreshCw, Lock, Clock, Gem } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';

const StarterLoadout = () => {
  const {
    canHarvest,
    inventory,
    equippedStaff,
    stats,
    playerProfile,
    hatchFromTemplate,
    loadStarterTemplate,
    claimDailyReward,
    loadingData
  } = useTethys();

  const [mounted, setMounted] = useState(false);
  const [displayStaff, setDisplayStaff] = useState(null);
  const [displayInventory, setDisplayInventory] = useState([]);
  const [template, setTemplate] = useState(null);
  const [isHatching, setIsHatching] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const t = await loadStarterTemplate(playerProfile?.onboarding?.starterLoadoutId || 'starter_v1');
      if (active) setTemplate(t);
    })();
    return () => {
      active = false;
    };
  }, [loadStarterTemplate, playerProfile?.onboarding?.starterLoadoutId]);

  useEffect(() => {
    if (equippedStaff) setDisplayStaff(equippedStaff);
    if (inventory.length > 0) setDisplayInventory(inventory);
  }, [equippedStaff, inventory]);

  const handleHatch = async () => {
    if (isHatching || playerProfile?.onboarding?.status === 'complete') return;
    setIsHatching(true);
    const result = await hatchFromTemplate(template?.templateId || 'starter_v1');
    setDisplayStaff(result?.staff || null);
    setDisplayInventory(result?.items || []);
    setIsHatching(false);
  };

  const handleDailyClaim = async () => {
    if (!canHarvest || isClaiming) return;
    setIsClaiming(true);
    await claimDailyReward({ itemsGranted: displayInventory.map((i) => i.id) });
    setIsClaiming(false);
  };

  if (!mounted || loadingData) return <div className="p-8 text-orange-900/50 font-mono text-center uppercase tracking-widest text-xs">Syncing Supply...</div>;
 if (playerProfile.onboarding?.status === 'complete') {
  return { success: false, reason: 'already_hatched' };
}

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
        {playerProfile?.onboarding?.status !== 'complete' ? (
          <button
            onClick={handleHatch}
            disabled={isHatching}
            className={`w-full md:w-auto group flex items-center justify-center gap-2 px-6 py-3 md:py-2 border transition-all uppercase text-[10px] tracking-[0.2em] font-sans ${
              !isHatching
                ? 'bg-[#292524] border-orange-900/50 hover:border-orange-500 hover:text-orange-500 cursor-pointer active:scale-95'
                : 'bg-black/50 border-[#292524] text-[#44403c] cursor-not-allowed'
            }`}
          >
            {isHatching ? (
              <>
                <Clock size={12} className="animate-pulse" />
                Issuing Loadout...
              </>
            ) : (
              <>
                <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                Hatch Starter
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleDailyClaim}
            disabled={!canHarvest || isClaiming}
            className={`w-full md:w-auto group flex items-center justify-center gap-2 px-6 py-3 md:py-2 border transition-all uppercase text-[10px] tracking-[0.2em] font-sans ${
              canHarvest && !isClaiming
                ? 'bg-[#292524] border-orange-900/50 hover:border-orange-500 hover:text-orange-500 cursor-pointer active:scale-95'
                : 'bg-black/50 border-[#292524] text-[#44403c] cursor-not-allowed'
            }`}
          >
            {canHarvest && !isClaiming ? (
              <>
                <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                Daily Claim
              </>
            ) : (
              <>
                <Lock size={12} />
                Cooldown
              </>
            )}
          </button>
        )}
      </div>

      {!displayStaff ? (
        <div className="p-12 text-center">
          <p className="text-[#44403c] uppercase tracking-widest text-xs font-sans">
            {template ? `Awaiting ${template.name}` : 'The table is empty.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          
          {/* GEAR LAYOUT */}
          <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[#292524] space-y-8 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
            
            {/* The Staff */}
            <div>
              <h3 className="text-[10px] font-sans uppercase tracking-widest text-orange-900 mb-2 font-bold">Weaponry</h3>
              <div className="bg-[#0c0a09]/80 border border-[#292524] p-4 shadow-lg rounded-sm">
                <div className="text-lg font-bold text-orange-100 mb-1 font-serif leading-tight">{displayStaff.name || 'Starter Staff'}</div>
                <p className="text-xs text-[#78716c] italic leading-relaxed">"{displayStaff.desc || 'Issued from Pteros hatchery.'}"</p>
                <div className="mt-3 text-[9px] uppercase tracking-widest text-orange-800 border-t border-[#292524] pt-2">
                   Power Rating: {displayStaff.power || 10}
                </div>
              </div>
            </div>

            {/* The Potions */}
            <div>
              <h3 className="text-[10px] font-sans uppercase tracking-widest text-orange-900 mb-2 font-bold">Apothecary</h3>
              <div className="grid grid-cols-1 gap-2">
                {displayInventory.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center gap-4 border-b border-[#292524] pb-2 last:border-0 last:pb-0">
                    <div className="text-xl opacity-80">{item.icon || '🧭'}</div>
                    <div className="flex-1">
                      <div className="text-sm text-[#d6d3d1] font-serif font-bold">{item.name || item.id}</div>
                      <div className="text-[9px] text-[#57534e] uppercase tracking-wide">{item.effect || 'Provision'}</div>
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
