'use client';

import { useMemo } from 'react';
import { selectNpcRumor } from '@/lib/rumor-utils';

export function useNpcRumorMatrix({
  npc,
  regionId,
  myths,
  rumors,
  regionWeights
}) {
  return useMemo(() => {
    if (!npc?.faction) return null;
    return selectNpcRumor({
      faction: npc.faction,
      regionId,
      myths,
      rumors,
      regionWeights
    });
  }, [npc?.faction, regionId, myths, rumors, regionWeights]);
}
