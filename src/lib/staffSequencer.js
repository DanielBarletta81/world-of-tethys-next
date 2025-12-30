const CORE_MATERIALS = [
  {
    id: 'ironwood',
    label: 'Silurian Ironwood',
    requires: 'human',
    description: 'Dense alpine wood that hums under pressure.',
    visual: { texture: 'fibrous', color: '#4d2c26' }
  },
  {
    id: 'basalt',
    label: 'Watcher Basalt',
    requires: 'geology',
    description: 'Volcanic stone shot through with copper veins.',
    visual: { texture: 'striated', color: '#2e2a26' }
  },
  {
    id: 'aerolite',
    label: 'Sky City Aerolite',
    requires: 'geography',
    description: 'Lightweight alloy harvested from the High Commons.',
    visual: { texture: 'polished', color: '#b7b0a3' }
  }
];

const WRAPS = [
  {
    id: 'silurian-band',
    label: 'Silurian Skin Banding',
    requires: 'creature',
    description: 'Waterproof lattice that ripples when storms approach.',
    visual: { accent: '#0f4c5c' }
  },
  {
    id: 'atlas-scroll',
    label: 'Atlas Scrollwork',
    requires: 'lore',
    description: 'Hand-inked vellum strips etched with migration sigils.',
    visual: { accent: '#7a3a23' }
  },
  {
    id: 'hybrid-fronds',
    label: 'Hybrid Fronds',
    requires: 'hybrid',
    description: 'Bioluminescent fibers cultivated in the Hybrid Sanctum.',
    visual: { accent: '#25a18e' }
  }
];

const APEX_FOCI = [
  {
    id: 'crystal-eye',
    label: 'Crystal Eye',
    requires: 'geology',
    description: 'Resonant geode cut to amplify subterranean signals.',
    effect: '+ Resonance mapping'
  },
  {
    id: 'aether-lens',
    label: 'Aether Lens',
    requires: 'geography',
    description: 'Multi-axis lens used by Sky City surveyors.',
    effect: '+ Atmospheric readings'
  },
  {
    id: 'living-familiar',
    label: 'Living Familiar',
    requires: 'creature',
    description: 'Tamed Kith fragment that perches at the staff tip.',
    effect: '+ Creature empathy'
  }
];

const AURA_WEAVES = [
  {
    id: 'chorus',
    label: 'Chorus Veil',
    requires: 'lore',
    description: 'Audible chant drifting from the staff core.',
    bonus: 'Lore fragments auto-decipher'
  },
  {
    id: 'storm',
    label: 'Stormwake',
    requires: 'geography',
    description: 'Ionized corona; pulls moisture from the air.',
    bonus: 'Fog of Discovery dissipates quicker'
  },
  {
    id: 'ember',
    label: 'Ember Mantle',
    requires: 'geology',
    description: 'Red-shift glow carrying volcanic memories.',
    bonus: 'Battle revelations unlock early'
  }
];

function pickByPriority(list, dominantKeys) {
  return (
    list.find((item) => dominantKeys.includes(item.requires)) ||
    list[0]
  );
}

function calcDominantCategories(readingStats = {}) {
  const entries = Object.entries(readingStats);
  if (!entries.length) return [];
  const max = Math.max(...entries.map(([, value]) => value));
  return entries
    .filter(([, value]) => value === max)
    .map(([key]) => key);
}

export function generateStaffProfile({
  readingStats = {},
  inventory = [],
  environment = {}
} = {}) {
  const dominantCats = calcDominantCategories(readingStats);
  const core = pickByPriority(CORE_MATERIALS, dominantCats);
  const wrap = pickByPriority(WRAPS, dominantCats);
  const apex = pickByPriority(APEX_FOCI, dominantCats);
  const aura = pickByPriority(AURA_WEAVES, dominantCats);

  const dna = [
    `CORE:${core.id}`,
    `WRAP:${wrap.id}`,
    `APEX:${apex.id}`,
    `AURA:${aura.id}`,
    inventory.includes('Compass') ? 'RELIC:compass' : null,
    inventory.includes('SurveyorLens') ? 'RELIC:lens' : null,
    inventory.includes('Kith') ? 'COMPANION:kith' : null
  ]
    .filter(Boolean)
    .join('|');

  const perks = [
    apex.effect,
    aura.bonus,
    inventory.includes('Compass') && '+ Fast-travel triangulation',
    inventory.includes('SurveyorLens') && '+ Enhanced migration overlays',
    inventory.includes('Kith') && '+ Familiar scouting radius'
  ].filter(Boolean);

  return {
    dna,
    segments: {
      core,
      wrap,
      apex,
      aura
    },
    summary: `${core.label} shaft wrapped in ${wrap.label}, crowned with ${apex.label} and veiled by ${aura.label}.`,
    perks,
    environmentStamp: environment.biome || 'Unknown Biome'
  };
}

/**
 * Legacy/simple DNA generator for staff composition.
 * Maps reading history -> dominant traits -> hash/description + basic stats.
 */
export function generateStaffDNA(readingHistory = []) {
  const weights = readingHistory.reduce((acc, post) => {
    const raw = post?.category_slug;
    if (!raw) return acc;
    const key = String(raw).toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const geologyCount = weights.geology || 0;
  const humanCount = weights.human || 0;
  const hybridCount = weights.hybrids || weights.hybrid || 0;
  const creatureCount = weights.creature || 0;
  const loreCount = weights.lore || 0;

  const dominantCore = geologyCount > 10 ? 'Basalt' : 'Weathered_Oak';
  const dominantBinding = humanCount > 15 ? 'Silurian_Hide' : 'Linen_Wrap';
  const dominantApex = hybridCount > 0 ? 'Chimera_Eye' : 'Glass_Lens';

  const staffHash = `C-${dominantCore}_B-${dominantBinding}_A-${dominantApex}_T-${Date.now()}`;

  return {
    dna: staffHash,
    description: `A ${dominantCore} staff bound in ${dominantBinding}, crowned with a ${dominantApex}.`,
    stats: {
      aquatic: creatureCount * 1.2,
      thermal: geologyCount * 1.5,
      mystic: loreCount * 2.0
    }
  };
}
