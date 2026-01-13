'use client';

import { useState } from 'react';
import { Download, Box, Lock, Loader2, Check } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';
//import useSoundFX from '@/app/hooks/useSoundFX'; // Uncomment when sound is ready

export default function AssetCrate({ asset }) {
  const { unlockedAssets, purchaseAsset, stats } = useTethys();
  // const { playRumble, playClick } = useSoundFX();
  const [loading, setLoading] = useState(false);

  const isUnlocked = unlockedAssets.includes(asset.id);
  const canAfford = stats.resin >= asset.cost;

  const handleInteract = async () => {
    if (isUnlocked) {
      // playClick();
      window.open(asset.cdnUrl, '_blank');
      return;
    }

    if (!canAfford) return;

    // playRumble(); 
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Cinematic delay
    
    const result = purchaseAsset(asset.id, asset.cost);
    setLoading(false);
    
    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <div className={`group relative bg-[#1c1917] border p-6 rounded-sm transition-all duration-300 flex flex-col justify-between h-full
      ${isUnlocked ? 'border-emerald-900/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-stone-800 hover:border-stone-600'}
    `}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded border ${isUnlocked ? 'bg-emerald-950/20 border-emerald-900 text-emerald-500' : 'bg-[#0c0a09] border-stone-700 text-stone-500'}`}>
            <Box size={24} />
          </div>
          <span className="text-[10px] font-mono text-stone-500 bg-black/40 px-2 py-1 rounded border border-stone-800">
            {asset.size} • {asset.format}
          </span>
        </div>

        <h3 className={`text-lg font-bold mb-1 ${isUnlocked ? 'text-emerald-100' : 'text-stone-300'}`}>
          {asset.title}
        </h3>
        <p className="text-xs text-stone-500 leading-relaxed mb-6">
          {asset.desc}
        </p>
      </div>

      <button 
        onClick={handleInteract}
        disabled={loading || (!isUnlocked && !canAfford)}
        className={`w-full py-3 flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em] font-bold border rounded-sm transition-all
          ${loading 
            ? 'bg-stone-800 border-stone-700 text-stone-400 cursor-wait'
            : isUnlocked
              ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400 hover:bg-emerald-900/40'
              : canAfford
                ? 'bg-cyan-950/20 border-cyan-800 text-cyan-400 hover:bg-cyan-900/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                : 'bg-red-950/10 border-red-900/30 text-red-700 cursor-not-allowed opacity-70'
          }`}
      >
        {loading ? (
          <>Decrypting <Loader2 size={12} className="animate-spin" /></>
        ) : isUnlocked ? (
          <>Download Access <Check size={12} /></>
        ) : canAfford ? (
          <>Unlock for {asset.cost} Resin <Lock size={12} className="text-cyan-500" /></>
        ) : (
          <>Insufficient Resin ({asset.cost}) <Lock size={12} /></>
        )}
      </button>
    </div>
  );
}
// World of Tethys || D.C. Barletta
