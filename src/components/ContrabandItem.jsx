'use client';

import { useState } from 'react';
import { Lock, Eye, ShoppingBag, Loader2 } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';

function getLore(playerProfile) {
  return playerProfile?.staff?.stats?.lore || 0;
}

export default function ContrabandItem({ item }) {
  const { unlockedAssets, purchaseAsset, stats, playerProfile } = useTethys();
  const [loading, setLoading] = useState(false);
  const [inspected, setInspected] = useState(false);

  const isUnlocked = !item.condition || unlockedAssets.includes(item.id);
  const lore = getLore(playerProfile);
  const isResinGate = item.condition?.type === 'resin';
  const isLoreGate = item.condition?.type === 'lore';
  const canAffordResin = stats.resin >= (item.condition?.val || 0);
  const meetsLore = lore >= (item.condition?.val || 0);
  const canUnlock = !item.condition || (isResinGate ? canAffordResin : isLoreGate ? meetsLore : false);

  const handleUnlock = async () => {
    if (loading || isUnlocked) return;
    if (!canUnlock) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const cost = isResinGate ? item.condition.val : 0;
    const result = purchaseAsset(item.id, cost);
    setLoading(false);
    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <article
      className={`group relative rounded-sm border overflow-hidden transition-all duration-300 bg-[#140f0a]
        ${isUnlocked ? 'border-amber-900/40' : 'border-stone-800/80'}
      `}
      onMouseEnter={() => setInspected(true)}
      onMouseLeave={() => setInspected(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(148,85,52,0.16),transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />

      {!isUnlocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#241a12]/90">
          <div className="h-16 w-24 rounded-sm border border-stone-700/80 bg-[#1a120d]/70 flex items-center justify-center">
            <Lock className="text-stone-500" size={22} />
          </div>
          <div className="text-center px-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-mono">
              Sealed in Transit
            </div>
            <div className="mt-2 text-xs text-stone-500 italic">
              {item.condition?.label}
            </div>
          </div>
          <button
            onClick={handleUnlock}
            disabled={!canUnlock || loading}
            className={`mt-2 px-4 py-2 text-[10px] uppercase tracking-[0.25em] rounded-sm border transition-colors
              ${canUnlock
                ? 'border-amber-700/50 text-amber-300 hover:bg-amber-900/30'
                : 'border-stone-700/70 text-stone-600 cursor-not-allowed'
              }
            `}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                Unbinding <Loader2 size={12} className="animate-spin" />
              </span>
            ) : canUnlock ? 'Break Seal' : 'Seal Holds'}
          </button>
        </div>
      )}

      <div className={`relative z-10 ${!isUnlocked ? 'blur-sm grayscale' : ''}`}>
        <div className="relative aspect-[2/3] w-full overflow-hidden border-b border-stone-800/80">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ backgroundImage: `url(${item.coverUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120c08] via-transparent to-transparent opacity-90" />
          <div className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.2em] font-mono px-2 py-1 rounded-sm border border-amber-900/40 bg-black/60 text-amber-300">
            {item.type}
          </div>
          {item.read && (
            <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.3em] font-mono px-2 py-1 rounded-sm border border-emerald-900/40 bg-black/70 text-emerald-300">
              Archived
            </div>
          )}
          <div className={`absolute inset-0 transition-opacity duration-500 ${inspected ? 'opacity-0' : 'opacity-40'}`} />
        </div>

        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-lg text-amber-100 font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-xs text-stone-400 leading-relaxed">
              {item.desc}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
            {isUnlocked ? (
              <a
                href={item.amazonLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-amber-400 hover:text-amber-200 transition-colors"
              >
                <ShoppingBag size={12} />
                Acquire
              </a>
            ) : (
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-600 font-mono">
                Contraband
              </span>
            )}
            <Eye size={14} className={inspected ? 'text-amber-400' : 'text-stone-600'} />
          </div>
        </div>
      </div>
    </article>
  );
}
