import cdn from '../lib/cdn.js';

export const HERBARIUM_REGISTRY = {
  'frenelopsis-thicket': {
    id: 'BOT-001',
    name: 'Frenelopsis (Mangrove Analog)',
    lineage: 'Cheirolepidiaceae (Extinct Conifer)',
    era: 'Aptian-Albian (~111 Ma)',
    traits: {
      halophytic: 'High salinity resistance',
      morphology: 'Succulent segmented stems',
      defense: 'Resinous biomass (fire-adapted)'
    },
    bio: 'Salt-breath stems; the shoreline keeps their memory.',
    background: cdn('/img/bg/forest-2107470.jpg'),
    lore: 'Thrived in tidal flats. Produced massive Classopollis pollen scums.',
    material: 'Frenel Branch',
    survivalRole: 'Coastal stabilizer / aerial cover'
  },
  'laminar-algae': {
    id: 'BOT-002',
    name: 'Laminar Algal Mats',
    lineage: 'Cyanobacteria / stromatolite builders',
    era: 'Precambrian to Cretaceous',
    traits: {
      structural: 'Biogenic carbonate production',
      binding: 'Living concrete (mitosis-trigger)',
      oxygen: 'Local aeration plumes'
    },
    bio: 'Stone that is still alive. The wall remembers the tide.',
    background: cdn('/img/bg/obsidian-coast-4k.jpg'),
    lore: "The foundation of Cambria's walls. Binds sediment into wave-resistant frameworks.",
    material: 'Bio-Cement',
    survivalRole: 'Fortification material'
  },
  'seedfire-kelp': {
    id: 'BOT-003',
    name: 'Seedfire Kelp',
    lineage: 'Dinoflagellate symbionts',
    era: 'Mesozoic radiation',
    traits: {
      biolume: 'Luciferin-luciferase reaction',
      detection: 'Predator burglar alarm',
      clarity: 'Tideglass day indicator'
    },
    bio: 'Light that warns, then blinds.',
    background: cdn('/img/bg/obsidian-coast-4k.jpg'),
    lore: 'Glows neon blue when disturbed by plesiosaur movement.',
    material: 'Biolume Resin',
    survivalRole: 'Stealth / early warning'
  }
};
// World of Tethys || D.C. Barletta
