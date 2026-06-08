/**
 * ORACLE POOL — the hidden listening space inside the Mystic Woods.
 *
 * Not on any map. Unlocked by deep stillness in the Mystic Woods (deep_dwell event).
 *
 * Two voices share the Pool:
 *   RAVEL       — hears through roots and mycelial network (43.7 Hz Kith signal)
 *   STONE LISTENER — hears through lithic substrate, infrasound, seismic precursors
 *
 * Both read the same tectonic forces. They render them differently.
 * The watcherState field mirrors the live volcano status from /api/volcano.
 *
 * Structure: responses are drawn by matching:
 *   - speaker:      'ravel' | 'stone'
 *   - watcherState: 'quiet' | 'stirring' | 'active' | 'any'
 *   - stillness:    'low' | 'medium' | 'high' | 'any'
 *   - visit:        'first' | 'repeat' | 'any'
 *
 * The Pool does not explain itself. It does not promise safety.
 * Silence is a valid response.
 */

import ravelSeedData from '../oracle_pool/ravel_seeder.json';

// Re-export Ravel's responses directly from the seeder
export const RAVEL_RESPONSES = ravelSeedData.responses;
export const RAVEL_TONE = ravelSeedData.tone;
export const RAVEL_RULES = ravelSeedData.rules;

// ── STONE LISTENER RESPONSES ──────────────────────────────────────────────────
// The Stone Listener speaks through the land, not the roots.
// Where Ravel hears chemistry and biology, the Stone Listener hears pressure and
// time. Both sources are the same volcanic force read through different mediums.
//
// The Stone Listener speaks rarely — fewer responses, higher weight per entry.
// Silence echoes from below, not above.

export const STONE_LISTENER_RESPONSES = [
  // ── Quiet / Normal Merapi ─────────────────────────────────────────────────────
  {
    id: 'stone_001',
    speaker: 'stone',
    watcherState: 'quiet',
    stillness: 'any',
    visit: 'first',
    text: 'The pressure is even. Something is holding its breath.',
    weight: 2,
  },
  {
    id: 'stone_002',
    speaker: 'stone',
    watcherState: 'quiet',
    stillness: 'high',
    visit: 'any',
    text: 'You are sitting on seventy kilometers of compressed heat. It does not notice you yet.',
    weight: 2,
  },
  {
    id: 'stone_003',
    speaker: 'stone',
    watcherState: 'quiet',
    stillness: 'medium',
    visit: 'repeat',
    text: 'The same stone. Different weight. You changed, not the ground.',
    weight: 1,
  },
  {
    id: 'stone_004',
    speaker: 'stone',
    watcherState: 'quiet',
    stillness: 'low',
    visit: 'any',
    text: 'Fast feet blur the signal.',
    weight: 1,
  },
  {
    id: 'stone_005',
    speaker: 'stone',
    watcherState: 'quiet',
    stillness: 'high',
    visit: 'first',
    text: 'The first time is just measurement. The pool is measuring you.',
    weight: 2,
  },

  // ── Stirring / Waspada ────────────────────────────────────────────────────────
  {
    id: 'stone_006',
    speaker: 'stone',
    watcherState: 'stirring',
    stillness: 'any',
    visit: 'any',
    text: 'Fourteen kilometers below, the rock is changing state. You have time. Not much.',
    weight: 3,
  },
  {
    id: 'stone_007',
    speaker: 'stone',
    watcherState: 'stirring',
    stillness: 'high',
    visit: 'any',
    text: 'The tremor repeats at intervals. That is a pattern. Patterns have ends.',
    weight: 3,
  },
  {
    id: 'stone_008',
    speaker: 'stone',
    watcherState: 'stirring',
    stillness: 'medium',
    visit: 'first',
    text: 'The ground is transferring weight upward. That is not normal. Take note.',
    weight: 2,
  },
  {
    id: 'stone_009',
    speaker: 'stone',
    watcherState: 'stirring',
    stillness: 'low',
    visit: 'any',
    text: 'You cannot outpace a shockwave. Slow down and read it.',
    weight: 2,
  },
  {
    id: 'stone_010',
    speaker: 'stone',
    watcherState: 'stirring',
    stillness: 'high',
    visit: 'repeat',
    text: 'You came back while the ground is counting its steps. It noticed.',
    weight: 3,
    echo: 'low_tremor',
  },

  // ── Active / Siaga / Awas ─────────────────────────────────────────────────────
  {
    id: 'stone_011',
    speaker: 'stone',
    watcherState: 'active',
    stillness: 'any',
    visit: 'any',
    text: 'The column is rising. Every map you have is already wrong.',
    weight: 4,
    echo: 'deep_rumble',
  },
  {
    id: 'stone_012',
    speaker: 'stone',
    watcherState: 'active',
    stillness: 'high',
    visit: 'any',
    text: 'You stayed to listen. The mountain stayed to answer. Do not mistake that for safety.',
    weight: 4,
    echo: 'deep_rumble',
  },
  {
    id: 'stone_013',
    speaker: 'stone',
    watcherState: 'active',
    stillness: 'low',
    visit: 'any',
    text: 'Your instinct is correct. The other instinct is also correct.',
    weight: 3,
  },
  {
    id: 'stone_014',
    speaker: 'stone',
    watcherState: 'active',
    stillness: 'medium',
    visit: 'first',
    text: 'You found this place on the worst possible day. That is not coincidence.',
    weight: 4,
    echo: 'crack',
  },
  {
    id: 'stone_015',
    speaker: 'stone',
    watcherState: 'active',
    stillness: 'any',
    visit: 'repeat',
    text: '',
    weight: 3,
    echo: 'deep_rumble',
  },

  // ── Silence entries ───────────────────────────────────────────────────────────
  {
    id: 'stone_900',
    speaker: 'stone',
    watcherState: 'quiet',
    stillness: 'high',
    visit: 'repeat',
    text: '',
    weight: 2,
    echo: 'silence',
  },
  {
    id: 'stone_901',
    speaker: 'stone',
    watcherState: 'stirring',
    stillness: 'any',
    visit: 'any',
    text: '',
    weight: 1,
    echo: 'low_tremor',
  },
];

// ── DRAW FUNCTION ─────────────────────────────────────────────────────────────
// Selects a response using weighted random from matching entries.
// This runs client-side — no server needed.

/**
 * @param {object} params
 * @param {'ravel'|'stone'} params.speaker
 * @param {'quiet'|'stirring'|'active'} params.watcherState
 * @param {'low'|'medium'|'high'} params.stillness
 * @param {'first'|'repeat'} params.visit
 * @returns {{ text: string, echo?: string, speaker: string } | null}
 */
export function drawOracleResponse({ speaker, watcherState, stillness, visit }) {
  const pool = speaker === 'stone' ? STONE_LISTENER_RESPONSES : RAVEL_RESPONSES;

  const candidates = pool.filter((r) => {
    const matchSpeaker  = r.speaker ? r.speaker === speaker : true;
    const matchWatcher  = r.watcherState === 'any' || r.watcherState === watcherState;
    const matchStill    = r.stillness === 'any' || r.stillness === stillness;
    const matchVisit    = r.visit === 'any' || r.visit === visit;
    return matchSpeaker && matchWatcher && matchStill && matchVisit;
  });

  if (!candidates.length) return null;

  // Weighted selection
  const totalWeight = candidates.reduce((sum, r) => sum + (r.weight ?? 1), 0);
  let pick = Math.random() * totalWeight;
  for (const r of candidates) {
    pick -= r.weight ?? 1;
    if (pick <= 0) {
      return {
        id: r.id,
        speaker,
        text: r.text ?? '',
        echo: r.echo ?? null,
        silent: !r.text,
      };
    }
  }
  return null;
}

// ── ORACLE POOL METADATA ──────────────────────────────────────────────────────
export const ORACLE_POOL = {
  id: 'oracle-pool',
  regionId: 'mystic-woods',
  label: 'The Oracle Pool',
  sublabel: 'Hidden · Kith Confluence',
  unlockCondition: 'deep_dwell',        // 30s stillness in mystic-woods
  unlockAccolade: 'oracle-pool-found',  // silent, player doesn't see it immediately

  lore: {
    description: 'The water does not reflect the sky. Below the surface, the Kith network intersects with a lithic pressure node that runs 70km down into the same magma plumbing that feeds the Watcher. Ravel hears it through roots. The Stone Listeners hear it through the land. They do not disagree.',
    ravelNote: 'Ravel never explains the pool. She acknowledges it by being quieter than usual near it.',
    stoneListenerNote: 'The Stone Listeners predate the Mystics by an unknown span. They do not bond with humans. They speak to those who stay still long enough.',
    cosmicNote: 'The Original Four recognized the pool. The Forest Woman\'s distributed consciousness still routes through it.',
  },

  voices: ['ravel', 'stone'],

  // These echo IDs map to audio cues in VR/future audio system
  echoTypes: {
    silence:     'No cue. The absence is the signal.',
    rumble:      'Low 43.7 Hz Kith resonance — the frequency Ravel uses.',
    low_tremor:  'Infrasonic tectonic precursor — what the Stone Listener reads.',
    deep_rumble: 'Both signals simultaneously. The Watcher is near the surface.',
    heartbeat:   'Biological synchronization — the pool matched your pulse.',
    crack:       'Lithic stress fracture acoustic — something shifted.',
    spores:      'Kith spore release — the network is communicating.',
  },
};
