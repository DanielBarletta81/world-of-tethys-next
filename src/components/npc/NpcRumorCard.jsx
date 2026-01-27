'use client';

import { useNpcRumorMatrix } from '@/hooks/useNpcRumorMatrix';
import { MYTHS, RUMORS, REGION_MYTH_WEIGHTS } from '@/data/rumor-matrix';

function formatFaction(faction = '') {
  return faction.replace('-', ' ');
}

export default function NpcRumorCard({ npc, className = '' }) {
  const rumor = useNpcRumorMatrix({
    npc,
    regionId: npc?.regionId,
    myths: MYTHS,
    rumors: RUMORS,
    regionWeights: REGION_MYTH_WEIGHTS
  });

  const mythName = rumor?.myth?.name || 'No record';
  const mythSummary = rumor?.myth?.summary || 'No rumor logged yet.';

  return (
    <div className={`rounded-xl border border-stone-800 bg-[#141110] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.35)] ${className}`}>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-stone-500">
        <span>{npc?.regionLabel}</span>
        <span>{formatFaction(npc?.faction)}</span>
      </div>
      <div className="mt-2 text-lg font-serif text-stone-100">{npc?.name}</div>
      {npc?.role ? (
        <div className="text-[11px] uppercase tracking-[0.2em] text-stone-400">{npc.role}</div>
      ) : null}
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-amber-200/70">{mythName}</div>
      <p className="mt-2 text-xs leading-relaxed text-stone-300">{mythSummary}</p>
      {npc?.note ? (
        <div className="mt-2 text-[11px] text-stone-400">{npc.note}</div>
      ) : null}
      {rumor ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
          <span className="rounded-full border border-stone-700/70 px-2 py-[2px]">{rumor.tone}</span>
          <span className="rounded-full border border-stone-700/70 px-2 py-[2px]">{rumor.bias}</span>
        </div>
      ) : null}
    </div>
  );
}
