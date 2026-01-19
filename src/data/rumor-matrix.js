export const MYTHS = [
  {
    id: 'soft-kings',
    name: 'The Soft Kings',
    summary: 'Gentle giants that flattened the hills before the City learned to stack stone.',
    regions: ['tethys_estuary', 'danian', 'iron-sands', 'pteros', 'sky-city']
  },
  {
    id: 'robber-purple-shore',
    name: 'Robber of the Purple Shore',
    summary: 'A coastal hunter that counted what the sea returned during the purple tides.',
    regions: ['straits-of-dier', 'gargantua_archipelago', 'watcher_volcano']
  },
  {
    id: 'hands-first',
    name: 'The Hands That Came First',
    summary: 'Other hands learned the branches before ours. Their memory lingers in the canopy.',
    regions: ['mystic_woods', 'mystic-woods', 'ironwood', 'ironwoods', 'cambria']
  },
  {
    id: 'burrow-cities',
    name: 'The Burrow Cities',
    summary: 'Families who shaped the ground long before stone rose above it.',
    regions: ['ironwood', 'ironwoods', 'mount-shastea', 'mammoth-hand-island']
  },
  {
    id: 'walking-island',
    name: 'The Walking Island',
    summary: 'Land that moves, sleeps, and forgets. No one agrees on its direction.',
    regions: ['gargantua_archipelago', 'tethys_sea', 'pteros', 'mammoth-hand-island']
  },
  {
    id: 'erased-coast',
    name: 'The Erased Coast',
    summary: 'A coastline removed from record, still pressuring the archive.',
    regions: ['cambria', 'watcher_flats', 'sky-city']
  }
];

export const RUMORS = [
  {
    id: 'soft-kings-lower',
    mythId: 'soft-kings',
    faction: 'lower-tier',
    accuracy: 0.35,
    confidence: 0.62,
    bias: 'survival',
    tone: 'whispered',
    mutationTags: ['abundance', 'loss']
  },
  {
    id: 'soft-kings-archive',
    mythId: 'soft-kings',
    faction: 'sky-city',
    accuracy: 0.55,
    confidence: 0.38,
    bias: 'doctrine',
    tone: 'dismissive',
    mutationTags: ['misclassification']
  },
  {
    id: 'robber-purple-sailor',
    mythId: 'robber-purple-shore',
    faction: 'lower-tier',
    accuracy: 0.42,
    confidence: 0.7,
    bias: 'fear',
    tone: 'ritualized',
    mutationTags: ['taboo', 'counting']
  },
  {
    id: 'robber-purple-archivist',
    mythId: 'robber-purple-shore',
    faction: 'sky-city',
    accuracy: 0.6,
    confidence: 0.45,
    bias: 'doctrine',
    tone: 'asserted',
    mutationTags: ['anomaly']
  },
  {
    id: 'hands-first-mystic',
    mythId: 'hands-first',
    faction: 'mystic',
    accuracy: 0.48,
    confidence: 0.68,
    bias: 'awe',
    tone: 'ritualized',
    mutationTags: ['kinship', 'canopy']
  },
  {
    id: 'hands-first-ironwood',
    mythId: 'hands-first',
    faction: 'ironwood',
    accuracy: 0.4,
    confidence: 0.5,
    bias: 'survival',
    tone: 'whispered',
    mutationTags: ['warning']
  },
  {
    id: 'burrow-cities-mystic',
    mythId: 'burrow-cities',
    faction: 'mystic',
    accuracy: 0.45,
    confidence: 0.55,
    bias: 'awe',
    tone: 'ritualized',
    mutationTags: ['earth-shapers']
  },
  {
    id: 'burrow-cities-archive',
    mythId: 'burrow-cities',
    faction: 'sky-city',
    accuracy: 0.58,
    confidence: 0.32,
    bias: 'doctrine',
    tone: 'dismissive',
    mutationTags: ['rodent-misread']
  },
  {
    id: 'walking-island-common',
    mythId: 'walking-island',
    faction: 'lower-tier',
    accuracy: 0.3,
    confidence: 0.66,
    bias: 'awe',
    tone: 'asserted',
    mutationTags: ['moving-ground']
  },
  {
    id: 'erased-coast-archive',
    mythId: 'erased-coast',
    faction: 'sky-city',
    accuracy: 0.72,
    confidence: 0.25,
    bias: 'doctrine',
    tone: 'dismissive',
    mutationTags: ['redaction']
  },
  {
    id: 'erased-coast-mystic',
    mythId: 'erased-coast',
    faction: 'mystic',
    accuracy: 0.5,
    confidence: 0.6,
    bias: 'awe',
    tone: 'whispered',
    mutationTags: ['lost-ground']
  },
  {
    id: 'burrow-cities-scholar',
    mythId: 'burrow-cities',
    faction: 'scholar-outcast',
    accuracy: 0.62,
    confidence: 0.44,
    bias: 'curiosity',
    tone: 'asserted',
    mutationTags: ['survey-notes', 'fracture-theory']
  },
  {
    id: 'walking-island-thal',
    mythId: 'walking-island',
    faction: 'thal',
    accuracy: 0.48,
    confidence: 0.7,
    bias: 'survival',
    tone: 'asserted',
    mutationTags: ['tide-guides', 'drift-marks']
  },
  {
    id: 'burrow-cities-thal',
    mythId: 'burrow-cities',
    faction: 'thal',
    accuracy: 0.46,
    confidence: 0.52,
    bias: 'survival',
    tone: 'whispered',
    mutationTags: ['hollow-islands', 'hand-prints']
  }
];

export const REGION_MYTH_WEIGHTS = {
  'sky-city': {
    'erased-coast': 0.9,
    'soft-kings': 0.55
  },
  ironwood: {
    'burrow-cities': 0.9,
    'hands-first': 0.8,
    'soft-kings': 0.6
  },
  ironwoods: {
    'burrow-cities': 0.9,
    'hands-first': 0.8,
    'soft-kings': 0.6
  },
  mystic_woods: {
    'hands-first': 0.9,
    'burrow-cities': 0.5
  },
  'mystic-woods': {
    'hands-first': 0.9,
    'burrow-cities': 0.5
  },
  cambria: {
    'erased-coast': 0.9,
    'hands-first': 0.6
  },
  gargantua_archipelago: {
    'walking-island': 0.9,
    'robber-purple-shore': 0.6
  },
  watcher_volcano: {
    'robber-purple-shore': 0.8,
    'erased-coast': 0.4
  },
  tethys_estuary: {
    'soft-kings': 0.7,
    'walking-island': 0.4
  },
  'mount-shastea': {
    'burrow-cities': 0.85,
    'hands-first': 0.35
  },
  'mammoth-hand-island': {
    'walking-island': 0.85,
    'burrow-cities': 0.7
  }
};

export const RUMOR_FACTIONS = [
  'lower-tier',
  'sky-city',
  'mystic',
  'ironwood',
  'scholar-outcast',
  'thal'
];
