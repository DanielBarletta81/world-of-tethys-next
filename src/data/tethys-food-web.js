/**
 * TETHYS FOOD WEB DATA
 * Source: "The Sulfidic Archipelago: Trophic Architecture and Biogeographic
 * Convergence in the Shallow Tethys Realm"
 *
 * The Tethyan shallow food web ran on two parallel energy tracks that
 * intersected at the macro-consumer level:
 *   - CHEMOSYNTHETIC: volcanic H₂S → sulfur bacteria → Kuphus → crushers → apex
 *   - PHOTOSYNTHETIC:  solar → Frenelopsis/seagrass/phytoplankton → grazers → apex
 *
 * During OAE events the photosynthetic track partially collapsed;
 * the chemosynthetic track EXPANDED — "dead zones" were lifeboats.
 */

// ── TROPHIC NODE DEFINITIONS ──────────────────────────────────────────────────
// Each node is a trophic level entry. Nodes belong to one or both tracks.

export const TROPHIC_TRACKS = {
  CHEMO: 'chemosynthetic',
  PHOTO: 'photosynthetic',
  BOTH:  'mixed',
};

export const FOOD_WEB_NODES = [
  // ── PRIMARY PRODUCERS ────────────────────────────────────────────────────────
  {
    id: 'sulfur-mats',
    label: 'Sulfur Mats',
    scientific: 'Beggiatoa / Thiomargarita / Sulfurovum',
    track: TROPHIC_TRACKS.CHEMO,
    tier: 1,
    role: 'Fix carbon via H₂S oxidation — the volcano\'s energy reaches the food chain here. No sunlight required.',
    color: '#eab308',   // sulfur yellow
    regionPresence: ['tethys-sea', 'silurian-riverlands', 'danian-delta', 'pteros', 'watcher-volcano', 'purgess'],
    notableIn: 'All restricted basins during OAE events; expands as PZE rises.',
  },
  {
    id: 'frenelopsis',
    label: 'Frenelopsis Mangrove',
    scientific: 'Frenelopsis (Cheirolepidiaceae)',
    track: TROPHIC_TRACKS.PHOTO,
    tier: 1,
    role: 'Coastal conifer mangrove. Leaf litter drives benthic anoxia that feeds Kuphus. Amber forests trap insect fauna.',
    color: '#22c55e',   // green
    regionPresence: ['silurian-riverlands', 'danian-delta', 'pteros', 'danian-river', 'mystic-woods'],
    notableIn: 'Pteros Island estuary edges; Silurian riverland margins.',
  },
  {
    id: 'seagrass',
    label: 'Seagrass Meadows',
    scientific: 'Zostera ancestors (Alismatales)',
    track: TROPHIC_TRACKS.PHOTO,
    tier: 1,
    role: 'Tethyan origin. Root systems oxygenate sediment, creating micro-halos in otherwise reducing mud. Compete with sulfur mats.',
    color: '#4ade80',
    regionPresence: ['tethys-sea', 'danian-delta', 'straits-of-dier'],
    notableIn: 'Shallow shelf edges where sulfide pressure drops.',
  },
  {
    id: 'phytoplankton',
    label: 'Phytoplankton',
    scientific: 'Calcareous nannoplankton',
    track: TROPHIC_TRACKS.PHOTO,
    tier: 1,
    role: 'Surface productivity. Periodically wiped out by OAE sulfide toxicity — zooplankton shift to bacterial mat grazing when this collapses.',
    color: '#86efac',
    regionPresence: ['tethys-sea', 'tethys-estuary'],
    notableIn: 'Open water; collapses during Purple Ocean events.',
  },

  // ── PRIMARY CONSUMERS ─────────────────────────────────────────────────────────
  {
    id: 'kuphus',
    label: 'Kuphus Reef',
    scientific: 'Kuphus polythalamia (giant chemosymbiotic bivalve)',
    track: TROPHIC_TRACKS.CHEMO,
    tier: 2,
    role: 'The keystone engineer. 1.5m calcareous tubes anchor in sulfidic mud; sulfur-oxidizing gill symbionts do all the feeding. Tubes become infrastructure for Silurian settlements.',
    color: '#06b6d4',   // cyan
    mechanicNote: 'Thrives during OAE events — dead zones are Kuphus lifeboats.',
    regionPresence: ['silurian-riverlands', 'danian-delta', 'pteros', 'danian-river'],
    survivalBonus: 'Silurian players can harvest Kuphus tubes as structural material (unlocks sub-location access)',
  },
  {
    id: 'zooplankton',
    label: 'Zooplankton Bridge',
    scientific: 'Copepods / cladocerans',
    track: TROPHIC_TRACKS.BOTH,
    tier: 2,
    role: 'Shift from phytoplankton grazing to bacterial mat grazing during PZE events. Over 50% of carbon from chemosynthetic mats during peak euxinia — the "bacterial loop."',
    color: '#67e8f9',
    regionPresence: ['tethys-sea', 'danian-delta', 'pteros'],
    notableIn: 'The zooplankton bridge is what keeps the upper food chain alive during Purple Ocean collapse.',
  },
  {
    id: 'kentrophoros',
    label: 'Ciliate Gardens',
    scientific: 'Kentrophoros (sulfur-oxidizing ciliate)',
    track: TROPHIC_TRACKS.CHEMO,
    tier: 2,
    role: 'Ribbon-shaped ciliates carry sulfur-oxidizing symbionts on their dorsal surface. Migrate vertically through sediment to bridge sulfide-rich and oxidant-rich zones. Package bacterial biomass for larger grazers.',
    color: '#a5f3fc',
    regionPresence: ['silurian-riverlands', 'danian-delta'],
    notableIn: 'Invisible but essential — the mesh between the volcano\'s energy and visible fauna.',
  },
  {
    id: 'neritid-snails',
    label: 'Neritid Grazers',
    scientific: 'Nerita / Neritoptyx (Archaeogastropoda)',
    track: TROPHIC_TRACKS.PHOTO,
    tier: 2,
    role: 'Graze hard substrates of carbonate platforms and Frenelopsis roots. Tethyan guild — held back from temperate by the warm barrier until estuaries mixed.',
    color: '#bbf7d0',
    regionPresence: ['the-ledge', 'pteros', 'straits-of-dier'],
  },

  // ── FILTERERS & SCAVENGERS ────────────────────────────────────────────────────
  {
    id: 'henodus',
    label: 'Henodus',
    scientific: 'Henodus chelyops (filter-feeding placodont)',
    track: TROPHIC_TRACKS.CHEMO,
    tier: 3,
    role: 'Box-like carapace, baleen-like filter apparatus. Skims the toxic surface for bacterial blooms and zooplankton. Heavy armor as ballast to hover over soft toxic muds without disturbing sediment.',
    color: '#22d3ee',
    mechanicNote: 'The only large predator adapted to feed directly from the chemosynthetic track surface.',
    regionPresence: ['danian-delta', 'silurian-riverlands', 'tethys-sea'],
  },
  {
    id: 'necrocarcinidae',
    label: 'Mud Hyenas',
    scientific: 'Necrocarcinidae (mangrove crabs)',
    track: TROPHIC_TRACKS.BOTH,
    tier: 3,
    role: 'The hyenas of the mudflat — scavenge Frenelopsis litter, dead fish, and crack smaller Kuphus tubes. Found associated with dinosaurian faunas in the Bahariya Formation (Egypt).',
    color: '#a3e635',
    regionPresence: ['silurian-riverlands', 'danian-delta', 'pteros', 'danian-river'],
    notableIn: 'Bridge between marine and terrestrial — overlap zone with Spinosaurus.',
  },
  {
    id: 'rudists',
    label: 'Rudist Reefs',
    scientific: 'Hippuritida (rudist bivalves)',
    track: TROPHIC_TRACKS.PHOTO,
    tier: 3,
    role: 'Filter feeders dominating warm carbonate platforms at 42°C. Three morphotypes: Elevators (harvesting grounds), Clingers (high-nutrient headlands), Recumbents (deep dredge prize).',
    color: '#86efac',
    regionPresence: ['tethys-sea', 'pteros', 'the-ledge', 'straits-of-dier'],
    collapseNote: 'Biocalcification crisis during OAE 1b suppresses rudist factories; Kuphus expands into the vacuum.',
  },

  // ── DUROPHAGES ────────────────────────────────────────────────────────────────
  {
    id: 'ptychodus',
    label: 'Ptychodus',
    scientific: 'Ptychodus (durophagous shark)',
    track: TROPHIC_TRACKS.BOTH,
    tier: 4,
    role: 'Giant Cretaceous shark with crushing tooth battery convergent with placodonts. Targets inoceramid clams and exposed Kuphus tube mouths. Represents the "new" durophagy style (chondrichthyan).',
    color: '#f59e0b',
    regionPresence: ['tethys-sea', 'straits-of-dier', 'danian-delta'],
  },
  {
    id: 'placodus',
    label: 'Placodus (Relict)',
    scientific: 'Placodus / Henodus (placodont)',
    track: TROPHIC_TRACKS.CHEMO,
    tier: 4,
    role: 'Triassic shell-crushers persisting as relicts in isolated toxic Tethyan lagoons. 4,000N bite force. The "old" durophagy style (reptilian). In the mixing zone, old and new durophage styles compete.',
    color: '#fbbf24',
    regionPresence: ['silurian-riverlands', 'danian-delta'],
    mechanicNote: 'Wallace Line mixing — Gondwanan and Laurasian durophage lineages converge in restricted lagoons.',
  },

  // ── APEX PREDATORS ────────────────────────────────────────────────────────────
  {
    id: 'spinosaurus',
    label: 'Spinosaurus',
    scientific: 'Spinosaurus aegyptiacus',
    track: TROPHIC_TRACKS.BOTH,
    tier: 5,
    role: 'The definitive apex predator of the sulfidic system. Osteosclerotic bone density allows bottom-walking in estuaries. Isotopic evidence confirms brackish/freshwater lifestyle. Bridges the dinosaurian terrestrial world and the chemosynthetic marine underworld.',
    color: '#ef4444',
    regionPresence: ['silurian-riverlands', 'danian-river', 'danian-delta', 'pteros'],
    survivalNote: 'Silurian tidal-gate control is the only reliable deterrent. Cannot be outrun — sonic deterrents slow approach.',
    predatorChronicleId: 'spinosaurus-estuarine',
  },
  {
    id: 'mosasaurus',
    label: 'Mosasaurus',
    scientific: 'Mosasaurus hoffmannii / Globidens',
    track: TROPHIC_TRACKS.PHOTO,
    tier: 5,
    role: 'Open ocean titan (17m). Globidens variant evolved spherical crushing teeth for hard-shelled Tethyan shelf prey. Descends to Twilight Zone (200-1000m) during Purple Ocean to avoid H₂S surface.',
    color: '#dc2626',
    regionPresence: ['tethys-sea', 'straits-of-dier', 'twin-straits-of-dier', 'pteros'],
    predatorChronicleId: 'mosasaurus-twilight-dive',
  },
  {
    id: 'pliosaurs',
    label: 'Pliosaurs',
    scientific: 'Kronosaurus / open-Tethys pliosaurs',
    track: TROPHIC_TRACKS.PHOTO,
    tier: 5,
    role: 'Apex predators of the open Tethys. Bite forces exceeding 33,000N — periodically enter deeper lagoons to hunt large prey including other marine reptiles.',
    color: '#b91c1c',
    regionPresence: ['tethys-sea', 'dier-lake', 'twin-straits-of-dier'],
  },
];

// ── REGION FOOD WEB PROFILES ──────────────────────────────────────────────────
// Maps each region to its dominant track and relevant node IDs.
// track: 'chemosynthetic' | 'photosynthetic' | 'mixed'
// Used by LoreRevealPanel food web tab and map overlay coloring.

export const REGION_FOOD_WEB = {
  'silurian-riverlands': {
    dominantTrack: 'chemosynthetic',
    nodes: ['sulfur-mats', 'frenelopsis', 'kuphus', 'kentrophoros', 'necrocarcinidae', 'henodus', 'placodus', 'spinosaurus'],
    oaeResponse: 'EXPANDS — Kuphus beds and sulfur mats thrive. Spinosaurus hunting becomes denser as prey concentrates.',
    hazardNote: 'Spinosaurus bottom-walks in these channels. Tidal-gate control is the only reliable deterrent.',
  },
  'danian-delta': {
    dominantTrack: 'mixed',
    nodes: ['sulfur-mats', 'frenelopsis', 'kuphus', 'zooplankton', 'necrocarcinidae', 'henodus', 'ptychodus', 'spinosaurus', 'mosasaurus'],
    oaeResponse: 'MAXIMUM MIXING — both tracks converge at the delta mouth. Death Glimmer bioluminescence signals chemocline excursion.',
    hazardNote: 'Most dangerous zone during Glow Tide — every trophic tier active simultaneously.',
  },
  'pteros': {
    dominantTrack: 'mixed',
    nodes: ['frenelopsis', 'kuphus', 'zooplankton', 'neritid-snails', 'rudists', 'necrocarcinidae', 'ptychodus', 'spinosaurus', 'mosasaurus'],
    oaeResponse: 'MIXED — photosynthetic tidal zone coexists with chemosynthetic lagoon. Xiphactinus surface frenzies at high tide.',
    hazardNote: 'Eyrie Charter relay stations here. Xiphactinus and Mosasaurus surface-feeding frenzies documented at high tide.',
  },
  'tethys-sea': {
    dominantTrack: 'mixed',
    nodes: ['sulfur-mats', 'phytoplankton', 'seagrass', 'zooplankton', 'rudists', 'ptychodus', 'mosasaurus', 'pliosaurs'],
    oaeResponse: 'SPLIT — photosynthetic track collapses, chemosynthetic track surface-expands. Purple Ocean visible from 30km.',
    hazardNote: 'Mosasaurus descends during Purple Ocean — this is the only open-water crossing window.',
  },
  'danian-river': {
    dominantTrack: 'photosynthetic',
    nodes: ['frenelopsis', 'seagrass', 'zooplankton', 'necrocarcinidae', 'spinosaurus'],
    oaeResponse: 'STABLE — river flow maintains oxygenated corridor. Spinosaurus concentration increases as delta narrows.',
    hazardNote: 'Stepped migration windows align with current patterns. Spinosaurus uses river current ambush.',
  },
  'mystic-woods': {
    dominantTrack: 'photosynthetic',
    nodes: ['frenelopsis', 'seagrass', 'zooplankton', 'neritid-snails'],
    oaeResponse: 'BUFFERED — Kith mycorrhizal network detects chemocline approach hours before arrival.',
    hazardNote: 'Frenelopsis leaf litter export feeds downstream Kuphus beds. The woods fuel the chemosynthetic estuary.',
  },
  'watcher-volcano': {
    dominantTrack: 'chemosynthetic',
    nodes: ['sulfur-mats', 'kuphus', 'kentrophoros'],
    oaeResponse: 'SOURCE — Watcher eruptions inject H₂S into shallow vent zones, seeding sulfur mat expansion across the basin.',
    hazardNote: 'Shallow vent pH 5.5-8.1. Calcareous shells dissolve near active vents — Kuphus chitinous tube survives.',
  },
  'straits-of-dier': {
    dominantTrack: 'mixed',
    nodes: ['seagrass', 'rudists', 'neritid-snails', 'ptychodus', 'mosasaurus'],
    oaeResponse: 'COMPRESSED — narrow geometry concentrates predators during surface toxicity events.',
    hazardNote: 'Crossing windows exist only during megatide slack. Mosasaurus corridor patrol known from Codex.',
  },
  'the-ledge': {
    dominantTrack: 'photosynthetic',
    nodes: ['rudists', 'neritid-snails', 'ptychodus', 'mosasaurus', 'pliosaurs'],
    oaeResponse: 'EXPOSED — no shelter from surface predator convergence during PZE events.',
    hazardNote: 'Predator convergence zone. The Ledge is where Xiphactinus, Mosasaurus, and diving pterosaurs overlap.',
  },
  'amber-plains': {
    dominantTrack: 'photosynthetic',
    nodes: ['frenelopsis', 'neritid-snails'],
    oaeResponse: 'TERRESTRIAL — distant from marine euxinia but Thal migration patterns track nutrient pulse timing from the delta.',
    hazardNote: 'Titan-walker migrations follow volcanic nutrient seeding cycles — Thal lineage reads this as Earth Tune.',
  },
};

// ── LEGACY EXPORTS (kept for backward compatibility) ──────────────────────────
export const TETHYS_FOOD_WEB_ANALOGS = FOOD_WEB_NODES.map((node) => ({
  id: node.id,
  tethys: node.label,
  realWorld: node.scientific,
  role: node.role,
  regions: node.regionPresence,
  creatureId: null,
}));
