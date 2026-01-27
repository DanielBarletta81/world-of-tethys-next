import { DEFAULT_PLAYER_PROFILE } from './player-defaults.js';

const STAGES = ['spark', 'ember', 'cinder', 'tide', 'thorn', 'veil', 'crown'];
const ACTION_TRAIL_MAX = 6;

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function getNextXp(level = 1) {
  return 100 + (level - 1) * 60;
}

function resolveStage(level = 1) {
  return STAGES[Math.min(STAGES.length - 1, Math.max(0, level - 1))];
}

function normalizeProfile(profile = {}) {
  return {
    ...DEFAULT_PLAYER_PROFILE,
    ...profile,
    staff: {
      ...DEFAULT_PLAYER_PROFILE.staff,
      ...(profile.staff || {})
    },
    progression: {
      ...DEFAULT_PLAYER_PROFILE.progression,
      ...(profile.progression || {})
    },
    aura: {
      ...DEFAULT_PLAYER_PROFILE.aura,
      ...(profile.aura || {})
    },
    protection: {
      ...DEFAULT_PLAYER_PROFILE.protection,
      ...(profile.protection || {})
    },
    drift: {
      ...DEFAULT_PLAYER_PROFILE.drift,
      ...(profile.drift || {})
    }
  };
}

function maybeUnlockAdornment(state, adornments, unlockedAt, nowIso, rule) {
  if (!rule.when(state)) return { adornments, unlockedAt, unlocked: false };
  if (adornments.includes(rule.id)) return { adornments, unlockedAt, unlocked: false };
  const next = [...adornments, rule.id];
  const nextUnlockedAt = { ...unlockedAt, [rule.id]: unlockedAt[rule.id] || nowIso };
  return { adornments: next, unlockedAt: nextUnlockedAt, unlocked: true };
}

const ADORNMENT_RULES = [
  {
    id: 'scar_ash_cuff',
    kind: 'scar',
    when: ({ drift }) => drift.aggression >= 40
  },
  {
    id: 'scar_fog_split',
    kind: 'scar',
    when: ({ drift }) => drift.ignorance >= 35
  },
  {
    id: 'blessing_root_coil',
    kind: 'blessing',
    when: ({ aura, drift }) => aura.tone >= 70 && aura.stability >= 60 && drift.aggression <= 15
  },
  {
    id: 'blessing_ember_guard',
    kind: 'blessing',
    when: ({ protection }) => protection.shell >= 80
  }
];

export function applyPlayerAction(profile, action = {}) {
  const nowIso = action.at || new Date().toISOString();
  const normalized = normalizeProfile(profile);
  const trail = Array.isArray(normalized.progression.actionTrail)
    ? [...normalized.progression.actionTrail]
    : [];
  const actionId = action.id || action.type || 'unknown';
  const repeated = trail.some((entry) => entry.id === actionId);
  const applyRepeatPenalty = action.repeatPenalty !== false;
  const intensity = Number(action.intensity || 1);
  const aggressive = Boolean(action.aggressive || action.type === 'aggressive');
  const restorative = Boolean(action.restorative || action.type === 'restorative');
  const ignorant = Boolean(action.ignorant || action.type === 'ignorant');

  let aggressionDelta = 0;
  let ignoranceDelta = 0;
  let auraDelta = 0;
  let stabilityDelta = 0;
  let protectionDelta = 0;
  let xpDelta = Number(action.xp || 0);

  if (aggressive) {
    aggressionDelta += 6 * intensity;
    auraDelta -= 2 * intensity;
    protectionDelta -= 3 * intensity;
  }
  if (repeated && applyRepeatPenalty) {
    ignoranceDelta += 4 * intensity;
    auraDelta -= 2 * intensity;
    stabilityDelta -= 2 * intensity;
  }
  if (ignorant) {
    ignoranceDelta += 3 * intensity;
    stabilityDelta -= 1 * intensity;
  }
  if (restorative) {
    aggressionDelta -= 4 * intensity;
    ignoranceDelta -= 5 * intensity;
    auraDelta += 6 * intensity;
    stabilityDelta += 5 * intensity;
    protectionDelta += 3 * intensity;
  }

  const nextDriftAgg = clamp(normalized.drift.aggression + aggressionDelta);
  const nextDriftIgn = clamp(normalized.drift.ignorance + ignoranceDelta);
  const driftTax = Math.round((nextDriftAgg * 0.05) + (nextDriftIgn * 0.06));

  const nextAuraTone = clamp(normalized.aura.tone + auraDelta - driftTax);
  const nextAuraStability = clamp(normalized.aura.stability + stabilityDelta - Math.round(nextDriftIgn * 0.03));
  const nextProtectionShell = clamp(normalized.protection.shell + protectionDelta - Math.round(nextDriftAgg * 0.04));
  const nextGlow = clamp01((nextAuraTone + nextAuraStability) / 200 - (nextDriftAgg + nextDriftIgn) / 300);

  const nextTrail = [
    { id: actionId, type: action.type || 'unknown', at: nowIso },
    ...trail
  ].slice(0, ACTION_TRAIL_MAX);

  let level = normalized.progression.level || 1;
  let xp = (normalized.progression.xp || 0) + xpDelta;
  let nextXp = normalized.progression.next || getNextXp(level);
  let leveledUp = false;
  while (xp >= nextXp) {
    xp -= nextXp;
    level += 1;
    nextXp = getNextXp(level);
    leveledUp = true;
  }

  const nextProgression = {
    ...normalized.progression,
    level,
    xp,
    next: nextXp,
    stage: resolveStage(level),
    actionTrail: nextTrail
  };

  let adornments = Array.isArray(normalized.staff.adornments)
    ? [...normalized.staff.adornments]
    : Array.isArray(normalized.staff.ornaments)
      ? [...normalized.staff.ornaments]
      : [];
  let unlockedAt = { ...(normalized.adornmentUnlockedAt || {}) };
  let newlyUnlocked = [];
  ADORNMENT_RULES.forEach((rule) => {
    const result = maybeUnlockAdornment(
      {
        aura: { tone: nextAuraTone, stability: nextAuraStability },
        protection: { shell: nextProtectionShell },
        drift: { aggression: nextDriftAgg, ignorance: nextDriftIgn }
      },
      adornments,
      unlockedAt,
      nowIso,
      rule
    );
    adornments = result.adornments;
    unlockedAt = result.unlockedAt;
    if (result.unlocked) newlyUnlocked.push(rule.id);
  });

  const nextProfile = {
    ...normalized,
    progression: nextProgression,
    aura: {
      ...normalized.aura,
      tone: nextAuraTone,
      stability: nextAuraStability,
      glow: nextGlow,
      lastShiftAt: nowIso
    },
    protection: {
      ...normalized.protection,
      shell: nextProtectionShell
    },
    drift: {
      ...normalized.drift,
      aggression: nextDriftAgg,
      ignorance: nextDriftIgn,
      lastActionId: actionId,
      lastActionAt: nowIso
    },
    staff: {
      ...normalized.staff,
      adornments
    },
    adornmentUnlockedAt: unlockedAt
  };

  return {
    profile: nextProfile,
    delta: {
      xp: xpDelta,
      leveledUp,
      repeated,
      drift: { aggression: aggressionDelta, ignorance: ignoranceDelta },
      aura: { tone: nextAuraTone, stability: nextAuraStability, glow: nextGlow },
      protection: { shell: nextProtectionShell },
      adornmentsUnlocked: newlyUnlocked
    }
  };
}
