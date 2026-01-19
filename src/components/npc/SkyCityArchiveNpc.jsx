'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import NPCDialogue from '@/components/npc/NPCDialogue';
import RumorGraph from '@/components/debug/RumorGraph';
import { useNpcDialogue } from '@/hooks/useNpcDialogue';
import { useNpcRumorSpread } from '@/hooks/useNpcRumorSpread';
import { useNpcVariantLine } from '@/hooks/useNpcVariantLine';
import { loadKnowledge } from '@/app/hooks/useKnowledgeStore';
import { getNpcMemory, subscribeNpcMemory } from '@/lib/npcMemory';
import { checkNpcCollapse } from '@/lib/checkNpcCollapse';
import { triggerBetrayalEvent } from '@/lib/betrayalEvents';
import {
  LOWER_TIER_BOND_THREAD_ALIVE,
  LOWER_TIER_STRYKER_WOUNDED,
  LOWER_TIER_WATCHER_COUGH,
  LOWER_TIER_WRONG_KIND_OF_SMOKE,
  SKY_CITY_BOND_THREAD_ALIVE,
  SKY_CITY_STRYKER_WOUNDED,
  SKY_CITY_WATCHER_COUGH,
  SKY_CITY_WRONG_KIND_OF_SMOKE
} from '@/data/paraphrases/roots_remember_packs';
import {
  IRONWOOD_TRIAL,
  IRONWOOD_VERDICT,
  MYSTIC_TRIAL,
  MYSTIC_VERDICT
} from '@/data/paraphrases/sky_city_trial_packs';
import {
  DOCKHAND_VARIANTS,
  IRONWOOD_VARIANTS,
  MYSTIC_VARIANTS,
  SKY_CITY_ARCHIVE_VARIANTS
} from '@/data/npc-variants/sky_city_archive_variants';

const DOCKHAND_NPC = {
  id: 'cambria_dockhand_01',
  name: 'Dockhand',
  faction: 'lower-tier',
  wasPresent: false,
  proximity: 0.3
};

const ARCHIVIST_NPC = {
  id: 'sky_archive_01',
  name: 'Marros',
  faction: 'sky-city',
  wasPresent: false,
  proximity: 0.6
};

const MYSTIC_NPC = {
  id: 'mystic_listener_01',
  name: 'Root-Listener',
  faction: 'mystic',
  wasPresent: false,
  proximity: 0.4
};

const IRONWOOD_NPC = {
  id: 'ironwood_sentinel_01',
  name: 'Ironwood Sentinel',
  faction: 'ironwood',
  wasPresent: false,
  proximity: 0.4
};

const SCENES = [
  {
    id: 'wrong_kind_of_smoke',
    label: 'Wrong Kind of Smoke',
    lowerTier: LOWER_TIER_WRONG_KIND_OF_SMOKE,
    skyCity: SKY_CITY_WRONG_KIND_OF_SMOKE
  },
  {
    id: 'watcher_cough',
    label: 'Watcher Cough',
    lowerTier: LOWER_TIER_WATCHER_COUGH,
    skyCity: SKY_CITY_WATCHER_COUGH
  },
  {
    id: 'stryker_wounded',
    label: 'Stryker Wounded',
    lowerTier: LOWER_TIER_STRYKER_WOUNDED,
    skyCity: SKY_CITY_STRYKER_WOUNDED
  },
  {
    id: 'bond_thread_alive',
    label: 'Bond Thread Alive',
    lowerTier: LOWER_TIER_BOND_THREAD_ALIVE,
    skyCity: SKY_CITY_BOND_THREAD_ALIVE
  },
  {
    id: 'sky_city_trial',
    label: 'Sky City Trial',
    mystic: MYSTIC_TRIAL,
    ironwood: IRONWOOD_TRIAL
  },
  {
    id: 'sky_city_verdict',
    label: 'Sky City Verdict',
    mystic: MYSTIC_VERDICT,
    ironwood: IRONWOOD_VERDICT
  }
];

export default function SkyCityArchiveNpc() {
  const knowledge = useMemo(() => loadKnowledge(), []);
  const searchParams = useSearchParams();
  const debugRumors = searchParams?.get('debug') === 'rumors';
  const [activeScene, setActiveScene] = useState(SCENES[2]);
  const hasLowerTier = Boolean(activeScene.lowerTier);
  const hasSkyCity = Boolean(activeScene.skyCity);
  const hasMystic = Boolean(activeScene.mystic);
  const hasIronwood = Boolean(activeScene.ironwood);

  const dockhandDialogue = useNpcDialogue({
    npc: DOCKHAND_NPC,
    textId: activeScene.id,
    paraphraseBlock: activeScene.lowerTier,
    knowledge
  });

  const archivistDialogue = useNpcDialogue({
    npc: ARCHIVIST_NPC,
    textId: activeScene.id,
    paraphraseBlock: activeScene.skyCity,
    knowledge
  });

  const mysticDialogue = useNpcDialogue({
    npc: MYSTIC_NPC,
    textId: activeScene.id,
    paraphraseBlock: activeScene.mystic,
    knowledge
  });

  const ironwoodDialogue = useNpcDialogue({
    npc: IRONWOOD_NPC,
    textId: activeScene.id,
    paraphraseBlock: activeScene.ironwood,
    knowledge
  });

  const dockhandAside = useNpcVariantLine({
    npc: DOCKHAND_NPC,
    pack: DOCKHAND_VARIANTS
  });
  const archivistAside = useNpcVariantLine({
    npc: ARCHIVIST_NPC,
    pack: SKY_CITY_ARCHIVE_VARIANTS
  });
  const mysticAside = useNpcVariantLine({
    npc: MYSTIC_NPC,
    pack: MYSTIC_VARIANTS
  });
  const ironwoodAside = useNpcVariantLine({
    npc: IRONWOOD_NPC,
    pack: IRONWOOD_VARIANTS
  });

  const dockhandMemory = useSyncExternalStore(
    subscribeNpcMemory,
    () => getNpcMemory(DOCKHAND_NPC.id),
    () => null
  );
  const archivistMemory = useSyncExternalStore(
    subscribeNpcMemory,
    () => getNpcMemory(ARCHIVIST_NPC.id),
    () => null
  );

  const { transmit } = useNpcRumorSpread({
    speakerNpc: DOCKHAND_NPC,
    listenerNpc: ARCHIVIST_NPC,
    quoteMemory: dockhandMemory?.lastHeard
  });

  const lastBetrayalRef = useRef({});

  useEffect(() => {
    const candidates = [
      { npc: DOCKHAND_NPC, memory: dockhandMemory },
      { npc: ARCHIVIST_NPC, memory: archivistMemory }
    ];

    candidates.forEach(({ npc, memory }) => {
      if (!memory?.updatedAt) return;
      if (!checkNpcCollapse(npc, memory)) return;

      const lastTriggeredAt = lastBetrayalRef.current[npc.id];
      if (lastTriggeredAt === memory.updatedAt) return;

      lastBetrayalRef.current[npc.id] = memory.updatedAt;
      triggerBetrayalEvent(npc, { reason: 'confidence_collapse' });
    });
  }, [archivistMemory, dockhandMemory]);

  return (
    <section className="bg-[#0b0a0a] border border-slate-700/60 rounded-xl p-6 shadow-[0_16px_50px_rgba(0,0,0,0.45)] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400 font-mono">
            Sky City Archive
          </p>
          <h2 className="text-2xl font-header text-slate-100">Institutional Memory vs Rumor</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => setActiveScene(scene)}
              className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border transition-colors ${
                activeScene.id === scene.id
                  ? 'border-slate-200 text-slate-100'
                  : 'border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              {scene.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasLowerTier && (
            <button
              type="button"
              onClick={dockhandDialogue.speak}
              className="text-[10px] uppercase tracking-[0.2em] text-amber-300 border border-amber-700/60 px-3 py-1 rounded-full hover:border-amber-400 hover:text-amber-200 transition-colors"
            >
              Dockhand Speaks
            </button>
          )}
          {hasLowerTier && hasSkyCity && (
            <button
              type="button"
              onClick={transmit}
              disabled={!dockhandMemory?.lastHeard}
              className="text-[10px] uppercase tracking-[0.2em] text-slate-300 border border-slate-500/60 px-3 py-1 rounded-full hover:border-slate-300 hover:text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Relay to Archivist
            </button>
          )}
          {hasSkyCity && (
            <button
              type="button"
              onClick={archivistDialogue.speak}
              className="text-[10px] uppercase tracking-[0.2em] text-cyan-300 border border-cyan-700/60 px-3 py-1 rounded-full hover:border-cyan-400 hover:text-cyan-200 transition-colors"
            >
              Archivist Responds
            </button>
          )}
          {hasMystic && (
            <button
              type="button"
              onClick={mysticDialogue.speak}
              className="text-[10px] uppercase tracking-[0.2em] text-purple-300 border border-purple-700/60 px-3 py-1 rounded-full hover:border-purple-400 hover:text-purple-200 transition-colors"
            >
              Mystic Responds
            </button>
          )}
          {hasIronwood && (
            <button
              type="button"
              onClick={ironwoodDialogue.speak}
              className="text-[10px] uppercase tracking-[0.2em] text-emerald-300 border border-emerald-700/60 px-3 py-1 rounded-full hover:border-emerald-400 hover:text-emerald-200 transition-colors"
            >
              Ironwood Responds
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasLowerTier && (
          <div className="bg-[#14110f] border border-amber-900/40 rounded-lg p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono">
              Dockside Rumor
            </p>
            <NPCDialogue speaker={DOCKHAND_NPC} line={dockhandDialogue.line} />
            {dockhandAside && (
              <p className="text-xs text-amber-200/80 italic">{dockhandAside}</p>
            )}
          </div>
        )}
        {hasSkyCity && (
          <div className="bg-[#0e141b] border border-cyan-900/40 rounded-lg p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-mono">
              Archive Response
            </p>
            <NPCDialogue speaker={ARCHIVIST_NPC} line={archivistDialogue.line} />
            {archivistAside && (
              <p className="text-xs text-cyan-200/80 italic">{archivistAside}</p>
            )}
          </div>
        )}
        {hasMystic && (
          <div className="bg-[#120d1a] border border-purple-900/40 rounded-lg p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-purple-300 font-mono">
              Mystic Reading
            </p>
            <NPCDialogue speaker={MYSTIC_NPC} line={mysticDialogue.line} />
            {mysticAside && (
              <p className="text-xs text-purple-200/80 italic">{mysticAside}</p>
            )}
          </div>
        )}
        {hasIronwood && (
          <div className="bg-[#111913] border border-emerald-900/40 rounded-lg p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 font-mono">
              Ironwood Verdict
            </p>
            <NPCDialogue speaker={IRONWOOD_NPC} line={ironwoodDialogue.line} />
            {ironwoodAside && (
              <p className="text-xs text-emerald-200/80 italic">{ironwoodAside}</p>
            )}
          </div>
        )}
      </div>

      {debugRumors && (
        <div className="pt-4 border-t border-white/10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-mono mb-3">
            Rumor Graph (Debug)
          </div>
          <RumorGraph npcs={[DOCKHAND_NPC, ARCHIVIST_NPC]} />
        </div>
      )}
    </section>
  );
}
// World of Tethys || D.C. Barletta
