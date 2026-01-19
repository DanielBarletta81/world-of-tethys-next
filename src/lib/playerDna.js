'use client';

const AFFINITY_TRAITS = [
  { id: 'mist', label: 'Mist-Woven', bonus: 'fog endurance' },
  { id: 'ember', label: 'Ember-Kindled', bonus: 'heat steadiness' },
  { id: 'storm', label: 'Storm-Cleaved', bonus: 'signal clarity' },
  { id: 'ash', label: 'Ash-Touched', bonus: 'terrain intuition' },
  { id: 'flare', label: 'Flare-Scarred', bonus: 'torch focus' },
  { id: 'iron', label: 'Iron-Bound', bonus: 'defensive pulse' },
  { id: 'lumen', label: 'Lumen-Thread', bonus: 'glyph resonance' },
  { id: 'silt', label: 'Silt-Seeded', bonus: 'resource whisper' }
];

const SCAR_PATTERNS = [
  'fractured-rune',
  'ember-vein',
  'frost-nidus',
  'tide-spiral',
  'iron-slice',
  'storm-ring',
  'mystic-drift',
  'brushstroke'
];

const STAFF_AURAS = [
  'pulse-glow',
  'cinder-bloom',
  'mist-lattice',
  'circuit-etch',
  'ravel-thread',
  'obsidian-rift',
  'echo-sheen',
  'silica-haze'
];

const CHRONICLE_TONES = [
  'Warden of Stillness',
  'Seeker of Thunder',
  'Archivist of Ash',
  'Voyager of Tides',
  'Librarian of Ember',
  'Harbinger of Silence',
  'Keeper of the Fold',
  'Cartographer of Veils'
];

const REGION_COEFFICIENTS = {
  pteros_island: 1.37,
  cambria_ruins: 1.23,
  mystic_woods: 1.18,
  gargantua_archipelago: 1.41,
  watcher_flats: 1.05,
  danian: 1.29,
  default: 1
};

function normalizeCoord(value) {
  const wrapped = ((value % 360) + 360) % 360;
  return Math.floor(wrapped * 1000);
}

function pathModeValue(mode) {
  switch (mode) {
    case 'mystic':
      return 3;
    case 'city':
      return 2;
    default:
      return 1;
  }
}

function traitFromTable(seed, shift, table) {
  const index = (seed >> shift) & 0xff;
  return table[index % table.length];
}

function glyphForSeed(seed) {
  const hue = (seed & 0xff) * 1.4 % 360;
  return {
    glyphId: `glyph-${('00' + ((seed >> 8) & 0xff)).slice(-2)}-${Math.round(hue)}`,
    color: `hsl(${hue.toFixed(1)}, 62%, 48%)`,
    hue
  };
}

export function derivePlayerDna(event = {}) {
  const coord = event.coordinates || { x: 0, y: 0 };
  const xInt = normalizeCoord(coord.x ?? 0);
  const yInt = normalizeCoord(coord.y ?? 0);
  const pm = pathModeValue(event.pathMode);
  const pressureByte = Math.min(255, Math.max(0, Math.round((event.envPressure ?? 0) * 255)));
  let seed = BigInt(xInt);
  seed = (seed << 56n) | (BigInt(yInt) << 32n) | (BigInt(pm) << 24n);
  seed = seed | BigInt(pressureByte);

  const regionFactor = REGION_COEFFICIENTS[event.region] ?? REGION_COEFFICIENTS.default;
  seed = BigInt(Math.abs(Number(seed) * regionFactor)) & 0xffffffffffffffffn; // keep 64-bit slice
  if (typeof event.seedOverride === 'bigint') {
    seed = event.seedOverride & 0xffffffffffffffffn;
  }

  const affinity = traitFromTable(Number(seed), 56, AFFINITY_TRAITS);
  const scar = SCAR_PATTERNS[Number((seed >> 48n) & 0xffn) % SCAR_PATTERNS.length];
  const aura = STAFF_AURAS[Number((seed >> 40n) & 0xffn) % STAFF_AURAS.length];
  const chronicle = CHRONICLE_TONES[Number((seed >> 32n) & 0xffn) % CHRONICLE_TONES.length];
  const glyph = glyphForSeed(Number(seed));

  const basePairs = Array.from({ length: 4 }, (_, slot) => {
    return ((Number(seed) >> (slot * 8)) & 0b11) % 4;
  });

  return {
    seed: seed.toString(16).padStart(16, '0'),
    traits: {
      affinity,
      scar,
      aura,
      chronicle,
      basePairs
    },
    glyph,
    eventRef: event.eventId || event.id || null,
    timestamp: event.timestamp || Date.now()
  };
}

export const dnaAnalytics = {
  AFFINITY_TRAITS,
  SCAR_PATTERNS,
  STAFF_AURAS,
  CHRONICLE_TONES,
  REGION_COEFFICIENTS
};
