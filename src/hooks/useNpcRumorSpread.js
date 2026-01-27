'use client';

import { useCallback } from 'react';
import { setNpcMemory } from '@/lib/npcMemory';
import { logRumor } from '@/lib/rumorLog';
import { useTethys } from '@/context/TethysContext';

export function useNpcRumorSpread({
  speakerNpc,
  listenerNpc,
  quoteMemory
}) {
  const { logRumorEntry } = useTethys();

  const transmit = useCallback(() => {
    if (!quoteMemory || !speakerNpc?.id || !listenerNpc?.id) return null;

    const nextConfidence = Math.max(0.2, quoteMemory.confidence - 0.12);
    const nextDistortion = Math.min(
      1,
      quoteMemory.distortionAtHear + (1 - nextConfidence) * 0.18
    );

    const nextQuoteMemory = {
      originTextId: quoteMemory.originTextId,
      heardFromNpcId: speakerNpc.id,
      distortionAtHear: nextDistortion,
      factionAtHear: speakerNpc.faction,
      confidence: nextConfidence
    };

    setNpcMemory(listenerNpc.id, nextQuoteMemory);
    logRumor({ fromNpc: speakerNpc, toNpc: listenerNpc, quoteMemory: nextQuoteMemory });
    logRumorEntry?.({
      from: speakerNpc.id,
      to: listenerNpc.id,
      textId: nextQuoteMemory.originTextId,
      confidence: nextQuoteMemory.confidence,
      distortion: nextQuoteMemory.distortionAtHear
    });
    return nextQuoteMemory;
  }, [listenerNpc, logRumorEntry, quoteMemory, speakerNpc]);

  return { transmit };
}
// World of Tethys || D.C. Barletta
