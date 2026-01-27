import { derivePlayerDna } from './playerDna.js';
import { deriveStaffPhenotype } from './staff-phenotype.js';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hashString(value = '') {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function deriveCoordsFromSeed(seed) {
  const x = seed % 360;
  const y = Math.floor(seed / 360) % 360;
  return { x, y };
}

const LORE_ACTIONS = new Set([
  'lore_read',
  'video_watch',
  'site_retention'
]);

const MAP_ACTIONS = new Set([
  'map_retention',
  'travel'
]);

const NUCLEOTIDES = ['A', 'C', 'G', 'T'];
const FLAGGED_ROUTES = {
  'sky-city': 0,
  cambria: 0,
  'cambria-ruins': 0,
  ironwoods: 1,
  'mammoth-hand-island': 1,
  'mount-shastea': 1,
  'mystic-woods': 2,
  pteros: 3,
  'straits-of-dier': 3,
  'tethys-sea': 3
};

const EPIGENETIC_REGION_RULES = {
  'cimmerian-mtns': {
    modifiers: { grainBias: 0.08, warpBias: -0.05, wetnessBias: -0.04 },
    decayHalfLifeHours: 18
  },
  'watcher-volcano': {
    modifiers: { chipBias: 0.15, glowBias: -0.05, wetnessBias: -0.12 },
    decayHalfLifeHours: 2
  },
  'watcher-flats': {
    modifiers: { chipBias: 0.12, glowBias: -0.04, wetnessBias: -0.1 },
    decayHalfLifeHours: 2
  },
  purgess: {
    modifiers: { chipBias: 0.12, glowBias: -0.03, wetnessBias: -0.08 },
    decayHalfLifeHours: 2
  }
};

const DEFAULT_EPIGENETIC_RULE = {
  modifiers: { grainBias: 0.02, wetnessBias: 0.02, glowBias: 0.01, warpBias: 0.01 },
  decayHalfLifeHours: 18
};

function basePairsToFlags(basePairs = []) {
  if (!Array.isArray(basePairs) || basePairs.length < 4) {
    return null;
  }
  return basePairs.slice(0, 4).map((value) => NUCLEOTIDES[value % 4]);
}

function ensureFlags(prevFlags, derived) {
  if (Array.isArray(prevFlags) && prevFlags.length === 4) {
    return prevFlags;
  }
  const fromPairs = basePairsToFlags(derived?.traits?.basePairs);
  return fromPairs || ['A', 'C', 'G', 'T'];
}

function mutateFlags(flags, seedSource, override = {}) {
  const next = [...flags];
  const slot =
    override.flagSlot != null
      ? Math.max(0, Math.min(3, Number(override.flagSlot)))
      : hashString(seedSource) % 4;
  const base = override.flagValue
    ? NUCLEOTIDES.indexOf(override.flagValue.toUpperCase())
    : (hashString(`${seedSource}:flag`) >> 2) % 4;
  const nextValue = NUCLEOTIDES[(base + 4) % 4];
  if (next[slot] === nextValue) {
    next[slot] = NUCLEOTIDES[(base + 1) % 4];
  } else {
    next[slot] = nextValue;
  }
  return next;
}

function resolveFlagTrigger(event = {}) {
  const regionKey = event.locationId || event.region;
  if (!regionKey) return null;
  const slot = FLAGGED_ROUTES[regionKey];
  if (slot == null) return null;
  return { flagTrigger: true, flagSlot: slot };
}

function decayModifiers(modifiers = {}, elapsedHours = 0, halfLifeHours = 18) {
  if (!elapsedHours || !halfLifeHours) return modifiers;
  const decayFactor = Math.pow(0.5, elapsedHours / halfLifeHours);
  return Object.fromEntries(
    Object.entries(modifiers).map(([key, value]) => [key, value * decayFactor])
  );
}

function evolveEpigenetics(prevEpigenetics, event = {}) {
  const now = Date.now();
  const prev = prevEpigenetics || {};
  const elapsedHours = prev.lastUpdatedAt ? (now - new Date(prev.lastUpdatedAt).getTime()) / 36e5 : 0;
  const decayHalfLifeHours = prev.decayHalfLifeHours || 18;
  const decayed = decayModifiers(prev.modifiers || {}, elapsedHours, decayHalfLifeHours);

  const regionKey = event.locationId || event.region;
  const rule = (regionKey && EPIGENETIC_REGION_RULES[regionKey]) || DEFAULT_EPIGENETIC_RULE;
  const delta = event.epigeneticDelta || (event.action === 'ravel_remedy'
    ? { glowBias: 0.18, wetnessBias: 0.08, chipBias: -0.05 }
    : event.action === 'lore_read'
      ? { glowBias: 0.05, grainBias: 0.03 }
      : event.action === 'travel'
        ? rule.modifiers
        : {});

  const nextModifiers = {
    wetnessBias: (decayed.wetnessBias || 0) + (delta.wetnessBias || 0),
    glowBias: (decayed.glowBias || 0) + (delta.glowBias || 0),
    grainBias: (decayed.grainBias || 0) + (delta.grainBias || 0),
    warpBias: (decayed.warpBias || 0) + (delta.warpBias || 0),
    chipBias: (decayed.chipBias || 0) + (delta.chipBias || 0)
  };

  return {
    modifiers: nextModifiers,
    decayHalfLifeHours: rule.decayHalfLifeHours || decayHalfLifeHours,
    lastRegion: regionKey || prev.lastRegion || null,
    lastUpdatedAt: new Date().toISOString()
  };
}

function parseSeed(hex) {
  if (!hex) return null;
  try {
    return BigInt(`0x${hex}`);
  } catch {
    return null;
  }
}

function blendSeeds(prevSeed, nextSeed) {
  if (prevSeed == null) return nextSeed;
  const blended = (prevSeed * 3n + nextSeed) / 4n;
  return blended & 0xffffffffffffffffn;
}

export function evolvePlayerDna(prevDna, event = {}) {
  const seedSource = `${event.region || ''}:${event.action || ''}:${event.pathMode || ''}:${event.locationId || ''}`;
  const fallbackSeed = hashString(seedSource);
  const coordinates = event.coordinates || deriveCoordsFromSeed(fallbackSeed);
  const defaultPressure = LORE_ACTIONS.has(event.action) ? 0.05 : 0.15;
  const envPressure = clamp(event.envPressure ?? defaultPressure, 0, 1);

  const derived = derivePlayerDna({
    coordinates,
    envPressure,
    pathMode: event.pathMode || 'wild',
    region: event.region || 'default',
    eventId: event.eventId || event.action || null,
    timestamp: event.timestamp || Date.now()
  });

  const prevSeed = parseSeed(prevDna?.seed);
  const nextSeed = parseSeed(derived.seed);
  const blendedSeed = blendSeeds(prevSeed, nextSeed || 0n);
  const blended = derivePlayerDna({
    ...event,
    coordinates,
    envPressure,
    pathMode: event.pathMode || 'wild',
    region: event.region || 'default',
    eventId: event.eventId || event.action || null,
    timestamp: event.timestamp || Date.now(),
    seedOverride: blendedSeed
  });

  const flagsBase = ensureFlags(prevDna?.flags, blended);
  const routeTrigger = event.action === 'travel' ? resolveFlagTrigger(event) : null;
  const shouldMutate =
    event.flagTrigger ||
    event.flagSlot != null ||
    event.flagValue ||
    LORE_ACTIONS.has(event.action) ||
    event.action === 'travel' ||
    Boolean(routeTrigger);
  const mutationEvent = routeTrigger ? { ...event, ...routeTrigger } : event;
  const nextFlags = shouldMutate ? mutateFlags(flagsBase, seedSource, mutationEvent) : flagsBase;
  const nextEpigenetics = evolveEpigenetics(prevDna?.epigenetics, event);
  const baseModel = {
    seed: blended.seed,
    flags: nextFlags,
    phenotype: deriveStaffPhenotype({
      dna: { flags: nextFlags },
      pathMode: event.pathMode || prevDna?.lean || 'wild',
      progress: {},
      epigenetics: nextEpigenetics
    })
  };

  const lean =
    event.lean ||
    (LORE_ACTIONS.has(event.action) ? 'mystic' : null) ||
    (MAP_ACTIONS.has(event.action) ? (event.pathMode || 'wild') : null) ||
    event.pathMode ||
    prevDna?.lean ||
    'wild';

  const history = Array.isArray(prevDna?.history) ? [...prevDna.history] : [];
  const nextHistory = [
    {
      seed: blended.seed,
      region: event.region || event.locationId || 'unknown',
      action: event.action || event.type || 'unknown',
      at: new Date().toISOString()
    },
    ...history
  ].slice(0, 12);

  return {
    ...blended,
    lean,
    flags: nextFlags,
    baseModel,
    epigenetics: nextEpigenetics,
    lastFlagShiftAt: shouldMutate ? new Date().toISOString() : prevDna?.lastFlagShiftAt || null,
    history: nextHistory,
    lastUpdatedAt: new Date().toISOString()
  };
}
