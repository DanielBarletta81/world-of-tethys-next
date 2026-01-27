'use client';

import { useMemo } from 'react';
import { useTethys } from '@/context/TethysContext';
import { buildNpcVariantContext, resolveNpcVariantLine } from '@/lib/npcVariantResolver';

export function useNpcVariantLine({ npc, pack }) {
  const { userId, currentLocation, locationHistory, playerProfile } = useTethys();
  const rawImprints = playerProfile?.survivorship?.imprints;

  return useMemo(() => {
    if (!npc || !pack) return null;
    const imprints = rawImprints ?? { bruises: [], tracks: [] };
    const context = buildNpcVariantContext({
      npcId: npc.id,
      faction: npc.faction,
      userId,
      currentLocation,
      locationHistory,
      imprints
    });
    return resolveNpcVariantLine({ pack, context });
  }, [npc, pack, userId, currentLocation, locationHistory, rawImprints]);
}
// World of Tethys || D.C. Barletta
