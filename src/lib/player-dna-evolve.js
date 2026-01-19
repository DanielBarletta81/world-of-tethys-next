import { derivePlayerDna } from './playerDna.js';

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
    history: nextHistory,
    lastUpdatedAt: new Date().toISOString()
  };
}
