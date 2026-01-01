// src/lib/staff-utils.js

// --- 1. MATERIAL DATABASE ---
const CORES = [
  // GEOLOGY PATH
  {
    id: 'basalt', 
    label: 'Watcher Basalt', 
    tier: 1, 
    requires: 'geology', 
    threshold: 0,
    description: 'Porous volcanic stone that stays warm to the touch.',
    visual: { color: '#2e2a26', gradient: 'linear-gradient(180deg, #2e2a26 0%, #4a4036 100%)' }
  },
  {
    id: 'obsidian', 
    label: 'Rift Obsidian', 
    tier: 2, 
    requires: 'geology', 
    threshold: 40,
    description: 'Glassy, razor-sharp shard from the deep mantle.',
    visual: { color: '#000000', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #4a0404 100%)' }
  },
  // CREATURE PATH
  {
    id: 'bone', 
    label: 'Leviathan Bone', 
    tier: 1, 
    requires: 'creature', 
    threshold: 0,
    description: 'Bleached rib-bone from a Tethys grazer.',
    visual: { color: '#e5e5e5', gradient: 'linear-gradient(to bottom, #e5e5e5, #d4d4d4)' }
  },
  {
    id: 'chitin', 
    label: 'Dredge Chitin', 
    tier: 2, 
    requires: 'creature', 
    threshold: 40,
    description: 'Iridescent plating from a deep-sea predator.',
    visual: { color: '#0d9488', gradient: 'linear-gradient(45deg, #0f766e, #2dd4bf)' }
  },
  // LORE PATH
  {
    id: 'ironwood', 
    label: 'Inscribed Ironwood', 
    tier: 1, 
    requires: 'lore', 
    threshold: 0,
    description: 'Ancient wood carved with forgotten dialects.',
    visual: { color: '#3f2e26', gradient: 'linear-gradient(to bottom, #3f2e26, #5c4033)' }
  },
  {
    id: 'quartz', 
    label: 'Memory Quartz', 
    tier: 2, 
    requires: 'lore', 
    threshold: 40,
    description: 'A conductive crystal that hums near archives.',
    visual: { color: '#a5f3fc', gradient: 'linear-gradient(120deg, #cffafe 0%, #22d3ee 100%)' }
  }
];

const WRAPS = [
  {
    id: 'rope', label: 'Scavenger Rope', requires: 'human',
    visual: { color: '#d6d3d1' }
  },
  {
    id: 'gold-wire', label: 'Conductive Gold Wire', requires: 'geography',
    visual: { color: '#facc15' }
  },
  {
    id: 'kelp', label: 'Dried Kelp Leather', requires: 'creature',
    visual: { color: '#3f6212' }
  },
  {
    id: 'vellum', label: 'Ritual Vellum', requires: 'lore',
    visual: { color: '#f5f5f4' }
  }
];

const APEX_FOCI = [
  { id: 'lantern', label: 'Scout Lantern', requires: 'geography', effect: '+ Visibility in Fog', color: '#f59e0b' },
  { id: 'lens', label: 'Focusing Lens', requires: 'lore', effect: '+ Decipher Speed', color: '#22d3ee' },
  { id: 'ember', label: 'Dormant Ember', requires: 'geology', effect: '+ Heat Resistance', color: '#ef4444' },
  { id: 'claw', label: 'Raptor Claw', requires: 'creature', effect: '+ Beast Intimidation', color: '#10b981' }
];

// --- 2. LOGIC HELPERS ---

function getBestMaterial(list, stat, score) {
  const candidates = list
    .filter(m => m.requires === stat)
    .sort((a, b) => b.threshold - a.threshold);
  
  return candidates.find(m => score >= m.threshold) || candidates[candidates.length - 1];
}

function getStatHierarchy(stats) {
  const sorted = Object.entries(stats).sort(([, a], [, b]) => b - a);
  return {
    primary: { key: sorted[0]?.[0] || 'human', val: sorted[0]?.[1] || 0 },
    secondary: { key: sorted[1]?.[0] || 'human', val: sorted[1]?.[1] || 0 }
  };
}

function generateName(core, apex) {
  const prefix = core.tier === 2 ? 'Grand' : 'Novice';
  const nounMap = {
    geology: 'Spire',
    lore: 'Wand',
    creature: 'Prod',
    geography: 'Staff',
    human: 'Cane'
  };
  const noun = nounMap[core.requires] || 'Staff';
  const suffixMap = {
    lantern: 'of Light',
    lens: 'of Truth',
    ember: 'of Ash',
    claw: 'of the Hunt'
  };
  return `${prefix} ${noun} ${suffixMap[apex.id] || ''}`.trim();
}

// --- 3. MAIN EXPORT ---
export function generateStaffProfile(readingStats = {}, inventory = []) {
  const { primary, secondary } = getStatHierarchy(readingStats);

  // Fallbacks if stats are empty
  const coreStat = primary.val > 0 ? primary.key : 'human';
  const core = getBestMaterial(CORES, coreStat, primary.val) || CORES[4]; // Default to Ironwood

  const wrapKey = (secondary.key === primary.key || secondary.val === 0) ? 'human' : secondary.key;
  const wrap = WRAPS.find(w => w.requires === wrapKey) || WRAPS[0];

  const apexKey = primary.val > 0 ? primary.key : 'geography';
  const apex = APEX_FOCI.find(a => a.requires === apexKey) || APEX_FOCI[0];

  const perks = [
    apex.effect,
    core.tier === 2 ? `+ Masterwork ${core.requires} affinity` : null,
    inventory.includes('Map_fragment') ? '+ Secret Pathfinding' : null
  ].filter(Boolean);

  // "Blueprint" DNA String for Unreal Engine
  const blueprintId = `v2-${core.id}-${wrap.id}-${apex.id}-${core.tier}`;

  return {
    id: blueprintId,
    name: generateName(core, apex),
    rarity: core.tier === 2 ? 'Rare' : 'Common',
    components: {
      core: core,
      wrap: wrap,
      apex: apex
    },
    visuals: {
      shaftGradient: core.visual.gradient,
      wrapColor: wrap.visual.color,
      glowColor: apex.color
    },
    lore: {
      description: core.description,
      summary: `A ${core.label} shaft bound tightly with ${wrap.label}.`
    },
    stats: {
      power: Math.max(10, primary.val * 1.5),
      resonance: Math.max(5, secondary.val * 1.2)
    },
    perks
  };
}