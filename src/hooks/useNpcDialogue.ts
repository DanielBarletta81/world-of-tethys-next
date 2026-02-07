'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { resolveNpcParaphrase } from '@/lib/resolveNpcMemory';
import { resolveNpcMisquote } from '@/lib/resolveNpcMisquote';
import { getNpcMemory, setNpcMemory, subscribeNpcMemory } from '@/lib/npcMemory';

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function getBaseDistortion({ knowledge, paraphraseBlock }: { knowledge?: any; paraphraseBlock?: any }) {
  const mythIds = paraphraseBlock?.myths ?? [];
  const distortions = mythIds.map(
    (id) => knowledge?.myths?.[id]?.distortion ?? 0
  );
  return distortions.length ? Math.max(...distortions) : 0;
}

export function useNpcDialogue({
  npc,
  textId,
  paraphraseBlock,
  knowledge
}: {
  npc?: any;
  textId?: string;
  paraphraseBlock?: any;
  knowledge?: any;
}) {
  const memory = useSyncExternalStore(
    subscribeNpcMemory,
    () => getNpcMemory(npc?.id),
    () => null
  );

  const resolved = useMemo(() => {
    const lastHeard = memory?.lastHeard;

    if (lastHeard?.originTextId === textId) {
      return resolveNpcMisquote({
        quoteMemory: lastHeard,
        knowledge,
        speakerNpc: npc,
        paraphraseBlock
      });
    }

    const line = resolveNpcParaphrase({
      textId,
      knowledge,
      faction: npc?.faction,
      npcProximity: npc?.wasPresent ? 0.9 : npc?.proximity ?? 0.3,
      paraphraseBlock
    });

    const baseDistortion = getBaseDistortion({ knowledge, paraphraseBlock });
    const confidence = npc?.wasPresent ? 0.85 : 0.6;

    return {
      line,
      nextQuoteMemory: {
        originTextId: textId,
        heardFromNpcId: npc?.id,
        distortionAtHear: clamp01(baseDistortion),
        factionAtHear: npc?.faction,
        confidence: clamp01(confidence)
      }
    };
  }, [memory, npc, textId, paraphraseBlock, knowledge]);

  const speak = useCallback(() => {
    if (!resolved?.nextQuoteMemory || !npc?.id) return;
    setNpcMemory(npc.id, resolved.nextQuoteMemory);
  }, [npc?.id, resolved]);

  return {
    line: resolved?.line ?? '',
    speak
  };
}
// World of Tethys || D.C. Barletta
