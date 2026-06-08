/**
 * LINEAGE REGISTRY — canonical design source for the Tethys hominid lineage
 * and player DNA progression system.
 *
 * Design principles:
 *  - All players are hybrids. No pure lineage exists post-First Human War.
 *  - Four base factions act as "base pairs" — their weights combine like DNA
 *    alleles to produce a unique player phenotype.
 *  - Lineage is requested at onboarding (player declares a starting affinity)
 *    but the map shapes what actually expresses over time.
 *  - Exploration in a region weights DNA toward that region's dominant faction.
 *  - Early survival traits are "fixed" faster — they form the backbone of the
 *    player's long-term build. Later traits express but don't displace the core.
 *  - Traits compete when in opposing environments (Silurian plates are drag on
 *    volcanic terrain; Thal predator-sense degrades in deep water).
 *  - Surviving a hostile environment GALVANIZES the out-of-environment trait —
 *    a Silurian who survives the Ironwoods develops a rare hybrid adaptation.
 *  - Visual markers accumulate on the player model / avatar as traits mature.
 *  - Dwell-time + re-read events are the passive accolade pipeline.
 *
 * Cambria note: Cambria is the prequel. Silurian/Thal shared-border lore
 * originates there. The First Human War is the founding trauma that produced
 * the hybrid condition all players inherit.
 *
 * Subdomain plan:
 *  - atlas.worldoftethys.com — game shell, map, progression, DNA
 *  - worldoftethys.com       — book/educational site, author, world lore
 *  - dcbarletta.com          — author site
 */

// ── BASE FACTION DEFINITIONS ─────────────────────────────────────────────────
// Each faction is one "base pair." All players carry weights across all four.
// The dominant pair expresses most strongly; recessive pairs create nuance.

export const LINEAGES = {

  // ── THAL ────────────────────────────────────────────────────────────────────
  thal: {
    id: 'thal',
    label: 'Thal',
    sublabel: 'Nomadic Apex · Animal Bond',
    color: '#b45309',     // amber-700
    glowColor: 'rgba(180, 83, 9, 0.45)',
    homeRegions: ['amber-plains', 'mammoth', 'northern-mountains', 'arnn-ridge'],
    lore: {
      origin: 'Nomadic groups that followed titan-walker migrations across the amber plains. Bond-line practitioners — mutualism with megafauna is encoded biologically, not trained.',
      cambriaTie: 'Shared border with Silurians along the Danian estuary for generations before the First Human War. The war did not erase the kinship — it complicated it.',
      firstHumanWar: 'Fought from the open plains inward. Their speed and creature-bond tactics were devastating in open terrain; they were stopped at the treeline by Silurian wetland routing.',
    },
    coreTraits: [
      {
        id: 'thal-predator-sense',
        label: 'Predator Reading',
        description: 'Passive awareness of apex predator proximity on land. Activates visual cues in the UI when large terrestrial threats are within range.',
        mechanic: 'dwell_weight',   // increases with time spent in high-threat land regions
        maturation: 'slow',        // takes sustained exposure to develop
        competesIn: ['deep-water', 'estuary', 'volcanic-core'],  // degraded in these region types
        galvanizeOn: 'survive_hostile_water', // surviving a water-region hostile event upgrades this trait
      },
      {
        id: 'thal-bond',
        label: 'Creature Bond',
        description: 'Mutualism affinity. Bonded creatures reduce predator pressure, provide navigation assists, and unlock region-specific access (mammoth → northern passages, sabre-cat → forest ambush corridors).',
        mechanic: 'encounter_weight', // triggered by creature encounters on the map
        maturation: 'medium',
        bondTiers: [
          { tier: 1, creature: 'mammoth-analog',   bonus: 'northern-mountains passage unlock' },
          { tier: 2, creature: 'sabre-cat',         bonus: 'forest ambush detection' },
          { tier: 3, creature: 'titan-walker',      bonus: 'amber-plains full traverse, stamina restore' },
        ],
      },
      {
        id: 'thal-migration-memory',
        label: 'Migration Memory',
        description: 'Accumulated map knowledge persists between sessions. Reveals secondary routes and resource nodes in previously visited regions.',
        mechanic: 'visit_accumulation',
        maturation: 'fast',
      },
    ],
    visualMarkers: [
      { tier: 1, marker: 'dust-stripe pigmentation on forearms' },
      { tier: 2, marker: 'bone-cord shoulder brace (amber-plains material)' },
      { tier: 3, marker: 'titan-walker hide mantle fragment' },
      { tier: 4, marker: 'full migration scar pattern — earned only by completing a full atlas traverse' },
    ],
    dnaSymbol: 'T',
    pathMode: 'wild',
  },

  // ── SILURIAN ─────────────────────────────────────────────────────────────────
  silurian: {
    id: 'silurian',
    label: 'Silurian',
    sublabel: 'Wetland Engineers · Estuary Adapted',
    color: '#0e7490',     // cyan-700
    glowColor: 'rgba(14, 116, 144, 0.45)',
    homeRegions: ['silurian-riverlands', 'danian-river', 'danian-delta', 'straits-of-dier', 'twin-straits-of-dier', 'pteros'],
    lore: {
      origin: 'Water-adapted hominid lineage. Stilted wetland settlement engineers who control tidal gates and brackish nurseries. Dense-bone ballast enables bottom-walking; nasal drift supports surface breathing.',
      cambriaTie: 'Shared Danian estuary border with Thals from Cambrian period. Silurian infrastructure — tidal locks, brackish nurseries — was the material base the First Human War was fought over.',
      firstHumanWar: 'Fought from the wetlands outward using channel routing and tidal-gate weaponization. Sky City only survived because the Silurians could not hold the upper tiers without losing estuary control.',
    },
    coreTraits: [
      {
        id: 'sil-armor-plates',
        label: 'Ironback Plating',
        description: 'Subdermal scute development inspired by sturgeon Acipenseridae biology. Plates grow more detailed and cover more body area as the player survives more aquatic and high-pressure environments.',
        mechanic: 'survival_accumulation', // each hostile-region survival event in water adds plate coverage
        maturation: 'very_slow',           // this is the signature Silurian marker — grows over many sessions
        visualProgression: [
          { coverage: '5%',   description: 'small scute cluster, left shoulder' },
          { coverage: '15%',  description: 'shoulder and partial upper arm plating' },
          { coverage: '30%',  description: 'back plating begins, 5-row dorsal pattern visible' },
          { coverage: '50%',  description: 'lateral flanks, low-Mg calcite texture rendered' },
          { coverage: '75%',  description: 'full dorsal + partial ventral; "Old One" pattern' },
          { coverage: '100%', description: 'complete Ironback phenotype — rare; requires full Silurian arc' },
        ],
        competesIn: ['volcanic-core', 'dry-highland', 'canopy'],
        galvanizeOn: 'survive_volcanic', // surviving Watcher Volcano region upgrades plate heat-resistance property
      },
      {
        id: 'sil-tidal-read',
        label: 'Tidal Intelligence',
        description: 'Read current shifts, surge windows, and predator wake signatures. Unlocks crossing-window overlays on map for aquatic traversal events.',
        mechanic: 'dwell_weight',
        maturation: 'medium',
        competesIn: ['highland', 'volcanic'],
      },
      {
        id: 'sil-breath-hold',
        label: 'Depth Adaptation',
        description: 'PDE10A splenomegaly analog (Bajau Sea Nomads convergent evolution) — spleen +50–60% stores oxygenated red blood cells as a biological scuba tank. BDKRB2 diving reflex enables peripheral vasoconstriction. Dive depth >70m unlocked. Unlocks submerged route access in estuary and delta regions.',
        mechanic: 'survival_accumulation',
        maturation: 'slow',
        scientificBasis: 'PDE10A gene (enlarged spleen, thyroid hormone), BDKRB2 gene (diving reflex) — same pathway as modern Bajau Sea Nomads',
      },
    ],
    visualMarkers: [
      { tier: 1, marker: 'scute cluster shoulder' },
      { tier: 2, marker: 'partial dorsal plating, pale calcite tone' },
      { tier: 3, marker: '5-row dorsal pattern — full Ironback silhouette emerging' },
      { tier: 4, marker: 'lateral plates; player silhouette noticeably heavier in water' },
    ],
    dnaSymbol: 'S',
    pathMode: 'wild',
  },

  // ── TRIUMVIRATE LOYALISTS (formerly Sky City Elites) ─────────────────────────
  triumvirate: {
    id: 'triumvirate',
    label: 'Triumvirate Loyalist',
    sublabel: 'City Doctrine · Vertical Hierarchy',
    color: '#6b21a8',     // purple-800
    glowColor: 'rgba(107, 33, 168, 0.45)',
    homeRegions: ['sky-city', 'the-weep', 'the-ledge', 'arnn-ridge'],
    lore: {
      origin: 'Descendants of the three Spire families who wrote the Cohab Code after the First Human War. Survival through institutional control, vertical architecture, and the suppression of ground-truth knowledge.',
      cambriaTie: 'Sky City appropriated Cambrian archive records and reframed the First Human War as a city-defense action. Most Loyalists carry false history. Ground-truth awareness is a rare Loyalist trait.',
      firstHumanWar: 'The city held by sealing the Weep Gate and deploying aerial relay networks. The Compact that ended the war was written by Loyalist scribes — which is why Silurian and Thal grievances were erased from the record.',
    },
    coreTraits: [
      {
        id: 'tri-archive-access',
        label: 'Archive Clearance',
        description: 'Access to suppressed Loyalist records. Unlocks hidden lore fragments on map markers — the version of history Sky City does not want seen.',
        mechanic: 'dwell_weight',
        maturation: 'fast',
      },
      {
        id: 'tri-elevation-read',
        label: 'Vertical Navigation',
        description: 'Expert traversal of tiered and elevated terrain. Reduces threat exposure in Sky City, the Ledge, and elevated regions. Unlocks hidden upper-tier routes.',
        mechanic: 'visit_accumulation',
        maturation: 'fast',
        competesIn: ['deep-water', 'estuary', 'forest-floor'],
      },
      {
        id: 'tri-political-weight',
        label: 'Compact Authority',
        description: 'Passive diplomacy modifier. Reduces faction hostility in Sky City-aligned regions. Can unlock neutral transit access in contested straits.',
        mechanic: 'accolade_weight',  // builds from reading lore + re-reading key documents
        maturation: 'medium',
        competesIn: ['open-wild', 'amber-plains'],
        galvanizeOn: 'survive_exile', // surviving The Weep unlocks a deep "Ground-Truth" sub-trait
      },
    ],
    visualMarkers: [
      { tier: 1, marker: 'compact seal sigil on wrist — faint' },
      { tier: 2, marker: 'ledger-cord binding on forearm' },
      { tier: 3, marker: 'Cohab Code inscription on collar — partial' },
      { tier: 4, marker: 'full Spire seal regalia; rare sub-marker: Ground-Truth scar if Weep survived' },
    ],
    dnaSymbol: 'C',  // City
    pathMode: 'city',
  },

  // ── MYSTIC ───────────────────────────────────────────────────────────────────
  mystic: {
    id: 'mystic',
    label: 'Mystic',
    sublabel: 'Root Whisperer · Kith Network',
    color: '#065f46',     // emerald-800
    glowColor: 'rgba(6, 95, 70, 0.45)',
    homeRegions: ['mystic-woods', 'ironwoods', 'danian-river'],
    lore: {
      origin: 'Root Whisperer lineage. Pharmacological knowledge encoded in practice, not text. The Kith network (43.7 Hz mycelial resonance) functions as a distributed memory system that individual Mystics partially access.',
      cambriaTie: 'The Mystics held neutral ground in the First Human War, supplying pharmacopeia to both sides. They were not neutral — they were reading the system. Ravel carries this knowledge.',
      firstHumanWar: 'Mystics were the only faction that retained pre-war ecological records. The Root Whisperer circles converted toxin belts into controlled pharmacology corridors before either the Thals or Silurians could weaponize the Mystic Woods.',
    },
    coreTraits: [
      {
        id: 'mys-kith-resonance',
        label: 'Kith Resonance',
        description: 'Partial access to the mycelial network. Passive awareness of ecological state changes in connected regions — early warning for OAE events, Purple Water approach, volcanic pulse.',
        mechanic: 'dwell_weight',
        maturation: 'very_slow',     // Kith is the rarest and deepest trait
        competesIn: ['volcanic-core', 'open-ocean'],
        galvanizeOn: 'survive_toxic', // surviving a toxic-bloom or purple-water event deepens resonance
      },
      {
        id: 'mys-pharmacopeia',
        label: 'Root Whisperer Knowledge',
        description: 'Processing knowledge for toxic flora/fauna. Reduces damage from toxic environments. Unlocks craft actions at pharmacopeia nodes (lye-wash, thermal inactivation, sclerotium processing).',
        mechanic: 'encounter_weight',
        maturation: 'medium',
      },
      {
        id: 'mys-spore-trail',
        label: 'Spore Navigation',
        description: 'Bioluminescent spore trail awareness. Reveals hidden sub-routes in the Mystic Woods and Ironwoods. Passive — activates during extended stillness on the map.',
        mechanic: 'stillness_weight',  // the dwell-time hook — rewards patience specifically
        maturation: 'fast',
      },
    ],
    visualMarkers: [
      { tier: 1, marker: 'faint bioluminescent skin trace on neck' },
      { tier: 2, marker: 'spore-vein pattern on hands — visible in dim-light rendering' },
      { tier: 3, marker: 'Kith-thread root scar pattern on back' },
      { tier: 4, marker: 'full Root Whisperer phenotype — skin partially translucent over vein map' },
    ],
    dnaSymbol: 'M',
    pathMode: 'mystic',
  },
};

// ── DNA BASE-PAIRING LOGIC ────────────────────────────────────────────────────
// Players carry weights for all 4 factions (T, S, C, M).
// Weights sum to 1.0. Starting weights are set at lineage selection.
// Exploration shifts weights toward the dominant faction of visited regions.

export const STARTING_WEIGHTS = {
  thal:        { T: 0.55, S: 0.20, C: 0.15, M: 0.10 },
  silurian:    { T: 0.20, S: 0.55, C: 0.10, M: 0.15 },
  triumvirate: { T: 0.10, S: 0.10, C: 0.65, M: 0.15 },
  mystic:      { T: 0.15, S: 0.15, C: 0.10, M: 0.60 },
};

// Hybrid expressions — dominant pairings (>0.35 each) unlock hybrid traits
export const HYBRID_EXPRESSIONS = [
  {
    id: 'thal-silurian',
    label: 'Shore Walker',
    requires: { T: 0.35, S: 0.35 },
    description: 'Cambrian border ancestry surfacing. Creature bond functions in aquatic regions. Silurian plating carries Thal migration-memory engravings.',
    traitBonus: 'tidal-read amplified in transit; mammoth-bond extends to shore megafauna',
    historicalNote: 'This is the oldest hybrid — predates the First Human War.',
  },
  {
    id: 'silurian-mystic',
    label: 'Root Diver',
    requires: { S: 0.35, M: 0.35 },
    description: 'Wetland pharmacology lineage. Kith resonance propagates through water rather than soil. Depth adaptation reduces toxic exposure in purple-water events.',
    traitBonus: 'spore-trail visible underwater; scute growth accelerated by toxic-survival events',
  },
  {
    id: 'thal-mystic',
    label: 'Ember Whisperer',
    requires: { T: 0.35, M: 0.35 },
    description: 'The rarest pairing — creature bond merges with Kith resonance. Bonded creatures can sense mycelial signals. Predator-read extends to ecological threat warnings.',
    traitBonus: 'bonded creatures share kith-resonance warnings; predator-read works in forest',
  },
  {
    id: 'triumvirate-thal',
    label: 'Ground-Truth Loyalist',
    requires: { C: 0.35, T: 0.35 },
    description: 'The politically dangerous hybrid — city authority with nomadic ground knowledge. Carries suppressed Cambrian records that contradict Cohab Code doctrine.',
    traitBonus: 'archive-access unlocks Cambria prequel lore; Thal migration-memory works in city tiers',
    historicalNote: "Igzier's lineage type.",
  },
  {
    id: 'all-four',
    label: 'Traveler',
    requires: { T: 0.20, S: 0.20, C: 0.20, M: 0.20 },  // roughly equal all four
    description: 'No dominant lineage. The Ancient Nine recognized this phenotype as the most dangerous — unpredictable by any faction, impossible to fully read, adapted to everything and nothing.',
    traitBonus: 'all traits express at reduced strength; galvanize events are twice as powerful',
    historicalNote: 'The Travelers of the early Tethys. The founding type before factions hardened.',
  },
];

// ── REGION → FACTION WEIGHT MAP ──────────────────────────────────────────────
// When a player dwells in or survives events in these regions,
// these weights are added to their running DNA accumulation.
// Values are additive per event type (dwell, survive, discover).

export const REGION_DNA_WEIGHTS = {
  'sky-city':            { C: 0.6, T: 0.1, S: 0.1, M: 0.2 },
  'the-weep':            { C: 0.4, T: 0.3, S: 0.2, M: 0.1 },
  'the-ledge':           { T: 0.3, S: 0.4, C: 0.2, M: 0.1 },
  'silurian-riverlands': { S: 0.7, T: 0.2, C: 0.05, M: 0.05 },
  'mystic-woods':        { M: 0.7, S: 0.15, T: 0.1, C: 0.05 },
  'ironwoods':           { M: 0.4, S: 0.3, T: 0.2, C: 0.1 },
  'watcher-volcano':     { C: 0.2, T: 0.4, M: 0.3, S: 0.1 },
  'purgess':             { T: 0.5, C: 0.3, S: 0.1, M: 0.1 },
  'arnn-ridge':          { T: 0.5, C: 0.3, M: 0.15, S: 0.05 },
  'northern-mountains':  { T: 0.6, S: 0.1, C: 0.2, M: 0.1 },
  'mt-cinder':           { M: 0.4, T: 0.3, C: 0.2, S: 0.1 },
  'dier-lake':           { S: 0.5, T: 0.3, M: 0.15, C: 0.05 },
  'straits-of-dier':     { S: 0.5, C: 0.3, T: 0.15, M: 0.05 },
  'twin-straits-of-dier':{ S: 0.5, T: 0.3, C: 0.1, M: 0.1 },
  'danian-river':        { S: 0.4, T: 0.3, M: 0.2, C: 0.1 },
  'danian-delta':        { S: 0.4, M: 0.3, T: 0.2, C: 0.1 },
  'pteros':              { S: 0.35, T: 0.3, C: 0.2, M: 0.15 },
  'amber-plains':        { T: 0.75, S: 0.1, M: 0.1, C: 0.05 },
  'tethys-sea':          { S: 0.5, T: 0.2, M: 0.2, C: 0.1 },
  'permian-desert':      { C: 0.4, T: 0.4, S: 0.1, M: 0.1 },
  'mammoth':             { T: 0.8, S: 0.1, M: 0.05, C: 0.05 },
};

// ── DWELL-TIME EVENT PIPELINE ─────────────────────────────────────────────────
// These are the passive accolade triggers. The map already has stillnessLevel (0-1)
// and onStillnessChange. These event types extend that pipeline.
//
// Implementation order (build these one at a time):
//   1. dwell_threshold   — user pauses on a region > N seconds
//   2. reread_event      — user returns to same lore panel within a session
//   3. survive_event     — user navigates a hostile region and exits alive
//   4. bond_event        — user encounters a creature in its home region
//   5. discovery_event   — user reaches a region for the first time
//   6. sequence_event    — user visits regions in a narrative order (Pteros → Weep → Silurian = "Igzier's Arc")

export const DWELL_EVENT_TYPES = [
  {
    id: 'dwell_threshold',
    label: 'Extended Observation',
    triggerMs: 8000,      // 8 seconds still on a region
    dnaMultiplier: 1.2,   // 20% extra weight vs. a normal visit
    accolade: null,        // no visible accolade — silent accumulation
    description: 'Player pauses on a region. Map stillness system already tracks this via stillnessLevel.',
  },
  {
    id: 'deep_dwell',
    label: 'Field Notation',
    triggerMs: 30000,     // 30 seconds — player is reading
    dnaMultiplier: 1.8,
    accolade: 'field-notation-mark',  // small mark appears on map marker
    description: 'Player has been on this region long enough to have read the lore panel.',
  },
  {
    id: 'reread_event',
    label: 'Double Entry',
    triggerMs: null,       // triggered on second lore panel open for same region
    dnaMultiplier: 2.0,
    accolade: 'double-entry-glyph',
    description: 'Player returned to this region lore. Signal of genuine interest.',
  },
  {
    id: 'survive_event',
    label: 'Hostile Region Survival',
    triggerMs: null,       // triggered by hazard encounter + successful region exit
    dnaMultiplier: 3.0,    // survival is high-value signal
    accolade: 'survival-scar',
    galvanizeTrait: true,  // this event triggers galvanization logic
    description: 'Player navigated a hazard-tagged region and survived. Highest DNA weight event.',
  },
  {
    id: 'discovery_event',
    label: 'First Contact',
    triggerMs: null,       // triggered on first-ever visit to a region
    dnaMultiplier: 1.5,
    accolade: 'discovery-mark',
    description: 'First visit to a region. One-time weight bonus.',
  },
  {
    id: 'sequence_event',
    label: 'Narrative Arc',
    triggerMs: null,       // triggered when player completes a canonical region sequence
    dnaMultiplier: 4.0,    // biggest weight event — rewards story comprehension
    accolade: 'chronicle-entry',
    description: 'Player has visited regions in a meaningful narrative sequence.',
    sequences: [
      {
        id: 'igzier-arc',
        label: "Igzier's Arc",
        regions: ['sky-city', 'the-weep', 'silurian-riverlands', 'mystic-woods'],
        reward: 'Ground-Truth sub-trait unlock',
      },
      {
        id: 'danian-run',
        label: 'Danian Run',
        regions: ['mystic-woods', 'ironwoods', 'danian-river', 'silurian-riverlands', 'straits-of-dier'],
        reward: 'Shore Walker hybrid expression accelerated',
      },
      {
        id: 'watcher-circuit',
        label: 'Watcher Circuit',
        regions: ['watcher-volcano', 'mt-cinder', 'purgess', 'arnn-ridge'],
        reward: 'Ember Whisperer hybrid expression accelerated',
      },
      {
        id: 'cambria-prequel',
        label: 'Cambrian Echo',
        regions: ['silurian-riverlands', 'danian-delta', 'tethys-sea', 'amber-plains'],
        reward: 'Thal-Silurian border lore unlocked — Cambria backstory fragments',
        note: 'Links to Cambria prequel book.',
      },
    ],
  },
];

// ── TRAIT COMPETITION TABLE ───────────────────────────────────────────────────
// When a player's dominant trait is in a competing environment,
// these modifiers apply. Penalty is temporary — galvanize events remove it
// and replace with an upgraded cross-environment adaptation.

export const TRAIT_COMPETITION = [
  {
    trait: 'thal-predator-sense',
    penaltyIn: ['deep-water', 'estuary', 'volcanic-core'],
    penaltyMagnitude: 0.4,   // 40% reduction in trait effectiveness
    galvanizeReward: 'Silurian-Thal border sense — predator read extends to aquatic ambush',
  },
  {
    trait: 'sil-armor-plates',
    penaltyIn: ['volcanic-core', 'dry-highland', 'canopy'],
    penaltyMagnitude: 0.3,
    galvanizeReward: 'Heat-tempered scute — plate durability upgrades after volcanic survival',
  },
  {
    trait: 'tri-elevation-read',
    penaltyIn: ['deep-water', 'estuary', 'forest-floor'],
    penaltyMagnitude: 0.35,
    galvanizeReward: 'Exile Cartography — surviving The Weep gives the Loyalist ground-level nav',
  },
  {
    trait: 'mys-kith-resonance',
    penaltyIn: ['volcanic-core', 'open-ocean', 'urban'],
    penaltyMagnitude: 0.45,
    galvanizeReward: 'Deep Signal — surviving toxic ocean event extends Kith to chemosynthetic networks',
  },
];

// ── ACCOLADE TYPES (passive, player may not notice immediately) ───────────────
export const ACCOLADE_TYPES = [
  { id: 'field-notation-mark',  label: 'Field Notation',   visible: false, dnaWeight: 0.5 },
  { id: 'double-entry-glyph',   label: 'Double Entry',     visible: false, dnaWeight: 1.0 },
  { id: 'survival-scar',        label: 'Survival Scar',    visible: true,  dnaWeight: 2.0 },
  { id: 'discovery-mark',       label: 'First Contact',    visible: false, dnaWeight: 0.8 },
  { id: 'chronicle-entry',      label: 'Chronicle Entry',  visible: true,  dnaWeight: 3.0 },
  { id: 'bond-mark',            label: 'Creature Bond',    visible: true,  dnaWeight: 1.5 },
];

// ── PRE-FACTION DEEP HISTORY ──────────────────────────────────────────────────
// From: The Tethyan Paradox / Cambrian Fisheries Codex
// This history predates the four lineages. All players carry it as shared ancestry.

/**
 * THE ORIGINAL FOUR — the governing entities before factions hardened.
 * They controlled the Tethyan skies via mastery of hypercane-class storm systems.
 * The four lineages are NOT the Original Four — they are what the Original Four
 * became after the First Human War broke the unified governance structure.
 *
 * In gameplay: players who unlock the "Traveler" hybrid expression gain access
 * to Original Four lore fragments. These are the rarest chronicle entries.
 */
export const ORIGINAL_FOUR = [
  {
    id: 'the-mambo',
    title: 'The Mambo',
    domain: 'Ocean current manipulation; tidal-gate doctrine',
    analog: 'Silurian lineage progenitor — wetland engineers, tidal intelligence',
    codexNote: 'Accused of weaponizing storm surges against coastal settlements during the Compact disputes.',
    loreUnlock: 'silurian-mystic hybrid or Silurian plate tier 4+',
  },
  {
    id: 'the-soothsayer',
    title: 'The Soothsayer',
    domain: 'Ecological intelligence; seismic/infrasound reading; Earth Tune',
    analog: 'Thal lineage progenitor — migration memory, predator-sense',
    codexNote: 'Used bone-conduction hearing and seismic homing to navigate closed hypercane corridors. Called "cloud readers" by later scholars.',
    loreUnlock: 'thal-mystic hybrid or complete Cambrian Echo sequence arc',
  },
  {
    id: 'the-magi',
    title: 'The Magi',
    domain: 'Institutional memory; archive doctrine; Eyrie Charter authorship',
    analog: 'Triumvirate Loyalist progenitor — archive clearance, compact authority',
    codexNote: 'Wrote the first neutral signal protocols. The Eyrie Charter — still honored by Pteroswift relay stations — is their only surviving institutional creation.',
    loreUnlock: 'triumvirate-thal hybrid (Ground-Truth) or archive clearance tier 3',
  },
  {
    id: 'the-forest-woman',
    title: 'The Forest Woman',
    domain: 'Pharmacopeia; Kith network maintenance; mycorrhizal mapping',
    analog: 'Mystic lineage progenitor — Root Whisperer, Kith resonance',
    codexNote: 'The Kith network at 43.7 Hz is her surviving infrastructure. The Forest Woman did not die — she distributed.',
    loreUnlock: 'mystic dominance 0.60+ or full mys-kith-resonance maturation',
  },
];

/**
 * THE ANCIENT NINE TERRITORIES — the pre-war specialization zones.
 * Each is a center of "Too Quick" advancement — rapid knowledge radiation
 * triggered by extreme environmental stress.
 * The four current factions emerged from the collapse of nine into four
 * after the Age of Ragnarus.
 */
export const ANCIENT_NINE = [
  {
    id: 'asphodel',
    name: 'Asphodel (Gardens of Mist)',
    modernRegion: 'mystic-woods',
    domain: 'Pharmaceutical hub — food, medicine, exotic toxins',
    tooQuickAdvancement: 'Filtration and alkaline hydrolysis chemistry — fire-dust water (lye) that detoxifies ergopeptines',
  },
  {
    id: 'helgard',
    name: 'Helgard (Tower of Winter)',
    modernRegion: 'northern-mountains',
    domain: 'Scholarly archive — science and agricultural records',
    tooQuickAdvancement: 'High-altitude alpine glaciation used as a heat sink for record preservation — proto-cold-storage library',
  },
  {
    id: 'tartarus',
    name: 'Tartarus (Steel Labyrinth)',
    modernRegion: 'ironwoods',
    domain: 'Metallurgical discovery — automated structural defense',
    tooQuickAdvancement: 'Ironback scute templates for laminar armor; the Steel Labyrinth still partially operational',
  },
  {
    id: 'elysia',
    name: 'Elysia (City of Light)',
    modernRegion: 'sky-city',
    domain: 'Urban governance — regulation of "Incarnations" (faction-corrupted individuals)',
    tooQuickAdvancement: 'Lavaforming — 10% of eruption volume molded into structural material; hatchery surplus supporting 125× ecological footprint',
    collapse: 'Elysia\'s fall triggered the Age of Ragnarus — a 300-year dark age. Sky City is its remnant government.',
  },
  {
    id: 'cambria',
    name: 'Cambria (Adria Platform)',
    modernRegion: null, // submerged — accessible only via archive/prequel content
    domain: 'Marine fisheries codex; tidal resonance harvesting; neutral signal relay',
    tooQuickAdvancement: 'Resonant tidal stone weirs for automated mass-harvesting; first "no-take" ecological sanctuaries',
    collapse: 'Drowned by geoidal eustasy during the Aptian Crisis. The Cambrian Fisheries Codex is the only surviving record.',
    note: 'Cambria is the prequel book setting.',
  },
];

/**
 * THE AGE OF RAGNARUS — the 300-year dark age between Elysia's fall and
 * the emergence of the current four-faction structure.
 *
 * Key events (for lore panel enrichment and chronicle unlock conditions):
 */
export const AGE_OF_RAGNARUS = {
  duration: '~300 years',
  trigger: "Elysia's collapse when the city could no longer manage the Incarnations — individuals whose faction specialization exceeded ethical constraints",
  factionFormation: 'The four current lineages crystallized during Ragnarus as survival coalitions. The Original Four governance dissolved into hereditary faction doctrine.',
  keyLoss: 'Most Helgard scientific records. The Cambrian Fisheries Codex survived only because Cambria was already coastal-isolated at the time of collapse.',
  eyrieRole: 'Pteroswift relay networks maintained by Eyrie Charter stations were the only continuous institution across Ragnarus. This is why the Eyrie Charter still has neutral status.',
  playerUnlock: 'chronicle-entry accolade × 5 unlocks Ragnarus lore fragments',
};

/**
 * EYRIE CHARTER — neutral governance of signal relay and aerial communication.
 * From the Cambrian Fisheries Codex closing entry.
 *
 * In gameplay: Eyrie Charter access is a cross-faction mechanic. It cannot be
 * owned by any single faction. Players with high accolade counts and multi-faction
 * exposure unlock charter relay access, which provides early warning of
 * map-wide events (OAE, Purple Water, volcanic pulse).
 */
export const EYRIE_CHARTER = {
  description: 'Neutral governance system managing communication across Tethyan factions via homing raptors (Pteroswifts). Founded by The Magi before the First Human War.',
  rules: [
    'No weaponization of courier payloads',
    'Strict welfare standards for Pteroswift carriers',
    'Neutral transit rights across all faction territories',
    'Science neutrality — knowledge cannot be suppressed by charter relay stations',
  ],
  inGame: {
    mechanic: 'cross-faction accolade threshold',
    unlock: 'accolades ≥ 10 across ≥ 3 different region types',
    benefit: 'Passive early-warning for map-wide ecological events (OAE, Purple Water, volcanic pulse)',
    visual: 'Pteroswift feather glyph appears on player — faction-neutral marking',
  },
};

/**
 * PREDATOR BEHAVIORAL CHRONICLES — from the Cambrian Fisheries Codex.
 * Operational threat knowledge, not folklore.
 * Used by Thal lineage for predator-read trait enrichment.
 */
export const PREDATOR_CHRONICLES = [
  {
    id: 'xiphactinus-gluttony-trap',
    name: 'Xiphactinus — The Gluttony Trap',
    class: 'Surface Bulldog Fish',
    threat: 'High-speed surface strike; 6m, 60 kph, 90° hinged jaw',
    exploit: 'Deploy buoyant armored dummy prey — obstructs gills, induces suffocation without direct combat. Called the "Gluttony Trap" in the Codex.',
    regionPressure: ['pteros', 'danian-delta', 'straits-of-dier', 'tethys-sea'],
    thalBonus: 'Predator-read tier 2 reveals Xiphactinus surface-feeding behavior before engagement',
  },
  {
    id: 'mosasaurus-twilight-dive',
    name: 'Mosasaurus — Deep Sea Ambush',
    class: 'Open-Ocean Titan',
    threat: '17m hyper-apex predator; "Twilight Zone" dives 200-1000m; hunts near surface at night',
    exploit: 'Geoidal traps — exploit deep-current convergence points to redirect patrol corridors. Timing windows during megatide slack.',
    regionPressure: ['tethys-sea', 'danian-delta', 'pteros'],
    thalBonus: 'Predator-read tier 3 reveals Mosasaurus patrol corridors as map overlay',
  },
  {
    id: 'spinosaurus-estuarine',
    name: 'Spinosaurus — Estuarine Ambush',
    class: 'Walking Ambush Predator',
    threat: 'Semi-aquatic estuarine specialist; ambushes at waterline, reed-hidden approach',
    exploit: 'Sonic deterrents — infrasound disruption from Earth Tune practitioners. Silurian tidal-gate control can reroute approach corridors.',
    regionPressure: ['silurian-riverlands', 'danian-river', 'danian-delta'],
    thalBonus: 'Predator-read tier 1 reveals Spinosaurus waterline ambush approach vectors',
  },
];

/**
 * RUDIST ECOLOGY — from the Cambrian Fisheries Codex.
 * Keystone organisms of the Aptian-Albian Tethys.
 * Relevant to Pteros, Cambria, and Silurian estuary region lore.
 */
export const RUDIST_ECOLOGY = [
  {
    morphotype: 'Elevators (Caprinidae)',
    role: 'Vertical growth, dense thickets — primary harvesting grounds',
    application: 'Shells used for architectural reinforcement in Silurian stilted structures',
    regionLink: ['pteros', 'silurian-riverlands', 'danian-delta'],
  },
  {
    morphotype: 'Clingers (Requieniidae)',
    role: 'High-energy rocky headlands — high nutrient content',
    application: 'Targeted for protein; difficult harvest due to salt spray — Thal shore-teams only',
    regionLink: ['the-ledge', 'tethys-sea'],
  },
  {
    morphotype: 'Recumbents (Titanosarcolites)',
    role: 'Massive free-lying forms on soft substrate; up to 1.3m across',
    application: '"Super-prize" for deep-water dredging; shells prized for ornamental use and load-bearing',
    regionLink: ['danian-delta', 'tethys-sea'],
  },
];

// ── SUBDOMAIN SPLIT PLAN ─────────────────────────────────────────────────────
// Not wired yet — captured here for planning.
// Implementation: add 'atlas' as a third site variant in getSiteVariantFromConfig()
//
// atlas.worldoftethys.com → siteVariant === 'atlas'
//   - TethysNexus map (full game shell)
//   - Player DNA/lineage progression
//   - Dwell-time event pipeline
//   - Accolade system
//   - Creature bonding
//   - Subdomain routes: /atlas, /atlas/map, /atlas/lineage, /atlas/codex
//
// worldoftethys.com → siteVariant === 'world'
//   - Book/educational site
//   - Lore, regions, natural history
//   - Does NOT run DNA progression (read-only world info)
//   - Links to atlas subdomain for interactive elements
//
// dcbarletta.com → siteVariant === 'author'
//   - Author site, book sales, press

export const SUBDOMAIN_PLAN = {
  atlas:  { variant: 'atlas',  domain: 'atlas.worldoftethys.com',  role: 'game' },
  world:  { variant: 'world',  domain: 'worldoftethys.com',         role: 'education' },
  author: { variant: 'author', domain: 'dcbarletta.com',            role: 'author' },
};

// World of Tethys || D.C. Barletta
