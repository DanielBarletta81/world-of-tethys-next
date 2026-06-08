/**
 * REGION REGISTRY — single source of truth for all Tethys map locations.
 *
 * Merges data from:
 *   - src/data/tethys-map.js          (book context, sensory, realWorld analogs)
 *   - src/content/map-lore-artifacts.json (era, history, recovered artifact)
 *   - src/data/tethys-crucible.js     (terrain substrate, color, hazards)
 *   - docs/tethys-atlas.md / .yaml    (biome, faction links, trade routes)
 *   - src/data/rumor-matrix.js        (myth ids per region)
 *   - src/data/bestiary.js            (linked creature ids)
 *   - public/img/*                    (local hero images actually on disk)
 *
 * Each entry shape:
 * {
 *   id: string                  — matches MAP_FRAGMENTS id
 *   label: string               — display name
 *   sublabel: string            — faction / biome type
 *   coords: { lat, lng }
 *
 *   lore: {
 *     era: string
 *     history: string           — 1–2 sentence lore hook
 *     biome: string             — biome classification from atlas
 *     realWorldAnalog: string   — real paleogeo analog
 *     factionLink: string       — which faction controls / is linked
 *     tradeRoutes: string[]     — trade route names passing through
 *   }
 *
 *   terrain: {
 *     type: string
 *     substrate: string
 *     color: string
 *     hazards: string[]
 *   }
 *
 *   book: {
 *     chapter: string
 *     sensory: string           — what the player smells/hears/feels
 *     event: string             — key story beat
 *     characters: string[]      — characters present in this location
 *   }
 *
 *   artifact: {
 *     name: string
 *     class: string
 *     note: string
 *   }
 *
 *   images: {
 *     hero: string              — primary location hero image (cdn path)
 *     alt: string[]             — additional images available locally
 *     faction: string|null      — faction image if available
 *     character: string|null    — character image most associated
 *   }
 *
 *   creatures: string[]         — bestiary creature ids present here
 *   myths: string[]             — myth ids from rumor-matrix
 *   subLocations: { id, name, desc }[]
 *   revealed: boolean           — true = Book 1 released, visible to all
 * }
 */

import cdn from '@/lib/cdn';
import { REGION_FOOD_WEB } from './tethys-food-web';

export const REGION_REGISTRY = [

  // ─── SKY CITY ────────────────────────────────────────────────────────────────
  {
    id: 'sky-city',
    label: 'Sky City',
    sublabel: 'Civilization Anchor · Upper Tiers',
    coords: { lat: -16.5, lng: -68.15 },
    lore: {
      era: 'Post-Rising Consolidation',
      history: 'The first permanent elevation doctrine was written here after repeated lowland collapses during geoidal surges. A vertical hierarchy governed by the Cohab Code suppresses the Root Walker bondline to keep the ground a myth.',
      biome: 'Mountain estuary · Cimmerian ledge zone',
      realWorldAnalog: 'Ahaggar Volcanic Field, Algeria (23.3°N, 5.5°E)',
      factionLink: 'Spire Architects — political compact, tiered governance',
      tradeRoutes: ['Ordovic Intake Loop', 'Cimmerian Drop', 'Khorat Salt Road'],
    },
    terrain: {
      type: 'mountain estuary',
      substrate: 'calcite shelf',
      color: 'chalk-ivory',
      hazards: ['dry shear', 'thin air', 'salt wind'],
    },
    book: {
      chapter: 'Sector 1',
      sensory: 'Smell of sulfur and unwashed bodies. The sound of wind whistling through The Stakes (impaling cliffs).',
      event: 'The execution of Exiles who refused The Quick.',
      characters: ['Igzier', 'Stryker', 'Marros'],
    },
    artifact: {
      name: 'Stormglass Survey Prism',
      class: 'Navigation Instrument',
      note: 'Used to triangulate safe ascent windows when mist columns hide ridge edges.',
    },
    images: {
      hero: cdn('/img/locations/sky_city_terrace_hero.PNG'),
      alt: [cdn('/img/locations/mid-terrace.png'), cdn('/img/locations/lower_tier_hero.png')],
      faction: null,
      character: cdn('/img/characters/Igzier_Sky_City.png'),
    },
    creatures: ['sauroposeidon', 'tapejara', 'tropeognathus'],
    myths: ['soft-kings', 'erased-coast'],
    subLocations: [
      { id: 'triumvirate-crown', name: 'Triumvirate Crown', desc: 'The ruling tier — three spire families share air rights and water charters.' },
      { id: 'weep-gate', name: 'The Weep Gate', desc: 'The exile drop. Condemned are sent over the ledge toward the Frenzy below.' },
      { id: 'lower-lattice', name: 'Lower Lattice Barracks', desc: 'The working tier — rope bridges, market stalls, hatchery relay points.' },
      { id: 'holding-cells', name: 'Political Holding Cells', desc: 'Subterranean chambers where dissidents wait for The Quick decision.' },
    ],
    revealed: true,
  },

  // ─── THE WEEP ─────────────────────────────────────────────────────────────────
  {
    id: 'the-weep',
    label: 'The Weep',
    sublabel: 'Exile Drop · Tidal Hazard Zone',
    coords: { lat: -15.9, lng: -67.5 },
    lore: {
      era: 'Exile Corridor Era',
      history: "Sentences once ended at the waterfall edge. Igzier's survival rewrote exile doctrine and city fear. The shelf below is a continuous feeding ground for apex marine predators — no one returns from the Frenzy.",
      biome: 'Delta scars · tidal shear wall',
      realWorldAnalog: 'Agulhas Bank Shelf, South African Margin (34.8°S, 20.0°E)',
      factionLink: 'Sky City — penal jurisdiction',
      tradeRoutes: [],
    },
    terrain: {
      type: 'delta scars',
      substrate: 'lime mud',
      color: 'chalk-ivory',
      hazards: ['shear tides', 'salt collapse', 'predator wake'],
    },
    book: {
      chapter: 'The Fall',
      sensory: 'Deafening roar of falling water. Salt spray mixed with the copper tang of blood. The vibration of the Frenzy below.',
      event: "The Hero's miraculous survival and injury on the shelf.",
      characters: ['Igzier'],
    },
    artifact: {
      name: 'Rim Hook Brace',
      class: 'Fall Survival Gear',
      note: 'A bent ascent hook found near the plunge shelf where condemned climbers vanished.',
    },
    images: {
      hero: cdn('/img/locations/the-weep4k.jpg'),
      alt: [],
      faction: null,
      character: cdn('/img/characters/Igzier_Sky_City.png'),
    },
    creatures: ['kronosaurus', 'suchomimus', 'GlassRay'],
    myths: ['erased-coast'],
    subLocations: [],
    revealed: true,
  },

  // ─── THE LEDGE ────────────────────────────────────────────────────────────────
  {
    id: 'the-ledge',
    label: 'The Ledge',
    sublabel: 'Coastal Shelf · Predator Frontier',
    coords: { lat: -15.1, lng: -66.8 },
    lore: {
      era: 'Sea-City Boundary Period',
      history: 'Where tide and stone negotiate each hour. Scouts learned to read predator wakes against the wall shadow. The half-eaten dinner plate shelf is the only land between city judgment and open sea.',
      biome: 'Tidal shelf · salt spray terrace',
      realWorldAnalog: 'Agulhas Bank outer shelf',
      factionLink: 'Independent — contested by Sky City scouts and coastal salvagers',
      tradeRoutes: [],
    },
    terrain: {
      type: 'tidal shelf',
      substrate: 'salt-scoured stone',
      color: 'chalk-grey',
      hazards: ['surge flood', 'predator ambush', 'wall collapse'],
    },
    book: {
      chapter: 'The Fall',
      sensory: 'Wet stone underfoot. Wind cutting from two directions at once. The smell of brine and opened flesh.',
      event: 'First contact with open sea and the Frenzy predators.',
      characters: ['Igzier'],
    },
    artifact: {
      name: 'Saltline Route Tablet',
      class: 'Tidal Chart',
      note: 'Marks narrow crossing windows between surge pulses and hunting swarms.',
    },
    images: {
      hero: cdn('/img/locations/the_ledge_hero.png'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['kronosaurus', 'void_shell', 'protostegid'],
    myths: [],
    subLocations: [],
    revealed: true,
  },

  // ─── SILURIAN RIVERLANDS ──────────────────────────────────────────────────────
  {
    id: 'silurian-riverlands',
    label: 'Silurian Riverlands',
    sublabel: 'Hidden Territory · Wetland Network',
    coords: { lat: -13.6, lng: -65.4 },
    lore: {
      era: 'Hidden Territory Recognition',
      history: "Sky City traded on denial while Silurian settlements watched every channel, seen and unseen. Stilted towns at Danian splits control brackish nurseries, tidal gates, and the single most important estuary chokepoint in the basin.",
      biome: 'Wetland swamp · Danian delta splits',
      realWorldAnalog: 'Wealden floodplains — braided river lowlands',
      factionLink: 'Silurian Groups — estuary engineers and tidal-gate controllers',
      tradeRoutes: ['Danian Run'],
    },
    terrain: {
      type: 'battle flats',
      substrate: 'cattail mud',
      color: 'silt grey',
      hazards: ['ambush reed', 'line traps', 'silt collapse'],
    },
    book: {
      chapter: 'Reed War',
      sensory: 'The smell of standing water and fermented reed. Clicking sounds — coordinated, not insect.',
      event: "Discovery of Kel's intelligence network threading through the delta.",
      characters: ['Kel', 'Igzier'],
    },
    artifact: {
      name: "Kel's Flood Marker",
      class: 'River Intelligence Instrument',
      note: 'A movable depth glyph used to map ambush currents through reed canyons.',
    },
    images: {
      hero: cdn('/img/factions/Silurians_hero.png'),
      alt: [],
      faction: cdn('/img/factions/Silurians_hero.png'),
      character: null,
    },
    creatures: ['suchomimus', 'ironback_sturgeon', 'Eel_hero'],
    myths: ['soft-kings'],
    subLocations: [
      { id: 'danian-split', name: 'The Danian Split', desc: 'Where the river forks into two lethal channels — each politically claimed by different Silurian branches.' },
      { id: 'tidal-gate', name: 'Tidal Lock Gate', desc: 'The physical control point for brackish nursery flooding. Whoever holds it controls food production downstream.' },
    ],
    revealed: true,
  },

  // ─── MYSTIC WOODS ─────────────────────────────────────────────────────────────
  {
    id: 'mystic-woods',
    label: 'Mystic Woods',
    sublabel: 'Asphodel · Pharmacopeia Basin',
    coords: { lat: 3.1, lng: 101.7 },
    lore: {
      era: 'Early Cambrian Archive Period',
      history: 'Root Whisperer circles converted toxin-heavy fungal belts into controlled pharmacology corridors. Home to Ravel and the Kith. The trees here evolve in real-time at 43.7 Hz. Every useful molecule sits beside a poison cousin.',
      biome: 'Fungal basin · mycorrhizal network · closed-loop horticulture',
      realWorldAnalog: 'Wealden Fern Swamps, Wessex Basin (50.6°N, 1.3°W)',
      factionLink: 'Root Whisperers — custodians of Danian headwaters and seasonal flood timing',
      tradeRoutes: ['Danian Run', 'Nubian Sandbar Exchange'],
    },
    terrain: {
      type: 'fungal basin',
      substrate: 'spore loam',
      color: 'ink-black',
      hazards: ['toxic bloom', 'lumen fog', 'thiaminase exposure'],
    },
    book: {
      chapter: "Ravel's Glade",
      sensory: 'The hum of the Kith network (43.7 Hz). Bioluminescent spores drifting in the shade. The smell of wet rot and something almost medicinal.',
      event: "The meeting with the Mystic pair (Ravel/Kith) after the Hero's fall.",
      characters: ['Ravel', 'Igzier'],
    },
    artifact: {
      name: 'Lye-Washed Sclerotium Case',
      class: 'Field Pharmacopeia',
      note: 'Carries processed clotting compounds and thermal-safe dosage slips.',
    },
    images: {
      hero: cdn('/img/locations/mystic-ironwoods.jpg'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['MistFly_hero', 'void_shell', 'mud_wing'],
    myths: ['hands-first'],
    subLocations: [
      { id: 'elder-stump', name: 'The Elder Stump', desc: 'The dead stump of the First Tree. The Kith network still routes through its root ghost.' },
      { id: 'magma-scars', name: 'The Magma Scars', desc: 'Lava channels that burned the old roots. Ravel says the fire was intentional — a memory burn.' },
      {
        id: 'oracle-pool',
        name: 'The Oracle Pool',
        desc: 'Not on any map. The water does not reflect the sky. Ravel hears through the roots; the Stone Listeners hear through the land. Both hear the same thing.',
        hidden: true,          // not shown in LoreRevealPanel until unlocked
        unlockCondition: 'deep_dwell on mystic-woods',
        unlockNote: 'Extended stillness in the Mystic Woods. The pool surfaces only to those who wait long enough to hear it.',
      },
    ],
    revealed: true,
  },

  // ─── IRONWOODS ────────────────────────────────────────────────────────────────
  {
    id: 'ironwoods',
    label: 'The Ironwoods',
    sublabel: 'Tartarus · Araucarian Megaforest',
    coords: { lat: 45.5, lng: -122.7 },
    lore: {
      era: 'Steel Labyrinth Fortification Phase',
      history: 'True North. Defensive growth shifted from manpower to armored corridor engineering. Ironback scute templates derived from sturgeon armor let small populations hold against larger threats. The roots connect all the way to the Mystic Woods.',
      biome: 'Ironwood domain · canopy emergent · braided-river log jam rafts',
      realWorldAnalog: 'Axel Heiberg Fossil Forest, High Arctic Cretaceous (79.9°N, 90.0°W)',
      factionLink: 'Ironwood Riverholds — log-raft markets, floodplain enclaves',
      tradeRoutes: ['Danian Run', 'Nubian Sandbar Exchange'],
    },
    terrain: {
      type: 'forest shelf',
      substrate: 'root weave',
      color: 'green-grey',
      hazards: ['root snare', 'flood pulses', 'canopy drop'],
    },
    book: {
      chapter: 'Canopy War',
      sensory: 'Creaking of massive timber. Filtered green light. The silence of the forest floor where only the roots speak.',
      event: 'The composition shift caused by the Danian River cut.',
      characters: ['Igzier'],
    },
    artifact: {
      name: 'Ironback Laminar Plate',
      class: 'Defensive Template',
      note: 'Patterned after sturgeon scute geometry for high-impact shelling zones.',
    },
    images: {
      hero: cdn('/img/locations/mystic-ironwoods.jpg'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['ironback_sturgeon', 'sauroposeidon', 'HogSpine_hero'],
    myths: ['hands-first', 'burrow-cities'],
    subLocations: [
      { id: 'steel-labyrinth', name: 'The Steel Labyrinth', desc: 'Fortified corridor network built into the root system — armored chokepoints, not walls.' },
      { id: 'root-dock', name: 'Root Dock', desc: 'Log-raft market platform at the Danian channel bend. Commerce and intelligence in one place.' },
    ],
    revealed: true,
  },

  // ─── WATCHER VOLCANO ──────────────────────────────────────────────────────────
  {
    id: 'watcher-volcano',
    label: 'Watcher Volcano',
    sublabel: 'Gargantua Domain · Active Caldera',
    coords: { lat: 38.2, lng: 16.0 },
    lore: {
      era: 'Watcher Wake Phase',
      history: 'When the cone stirs, every map lies. Stryker flights logged plume vectors instead of borders. Ash columns at 14 km. Thermal vents beneath the eastern shelf. Approach corridors sealed by the Compact.',
      biome: 'Gargantua domain · stratovolcano · caldera rim · lava tubes',
      realWorldAnalog: 'Kohistan-Ladakh intra-oceanic arc — volcanic island chain',
      factionLink: 'Stryker aerial scouts — emergency recon, patrol compact',
      tradeRoutes: ['Pumice Lane'],
    },
    terrain: {
      type: 'volcanic sequence',
      substrate: 'ash glass',
      color: 'ember basalt',
      hazards: ['ashfall', 'sulfur plumes', 'lava tube collapse'],
    },
    book: {
      chapter: 'Ash Oath',
      sensory: 'Heat shimmer on every horizon. The acrid sting of sulfur. Ground that vibrates in 4-second pulses.',
      event: 'Stryker recon flight logs a new vent opening on the east flank.',
      characters: ['Stryker'],
    },
    artifact: {
      name: 'Stryker Wing Ledger',
      class: 'Aerial Recon Archive',
      note: 'Heat-scored route cards from emergency flyovers over the crater throat.',
    },
    images: {
      hero: cdn('/img/locations/watcher_mountain_hero.png'),
      alt: [
        cdn('/img/locations/watcher_hero4.png'),
        cdn('/img/locations/watcher_mountain_alt2.png'),
        cdn('/img/locations/watcher_mountain_hero2.png'),
        cdn('/img/locations/Mount_Shastea_hero.png'),
      ],
      faction: null,
      character: cdn('/img/characters/Igzier_Stryker_hero2.png'),
    },
    creatures: ['volcanic_bird_hero', 'tropeognathus', 'tapejara'],
    myths: ['robber-purple-shore'],
    subLocations: [
      { id: 'crater-throat', name: 'Crater Throat', desc: 'The active vent mouth. No sanctioned crossings. Stryker logs show 3 failed attempts.' },
      { id: 'east-flank', name: 'East Flank Vents', desc: 'New thermal vents opened during the Watcher Wake — sealed the Compact approach corridor.' },
      { id: 'pumice-drift', name: 'Pumice Drift Lanes', desc: 'Floating pumice islands used by Thal scouts as temporary waypoints toward the mixing zone.' },
    ],
    revealed: true,
  },

  // ─── PURGESS FLATS ────────────────────────────────────────────────────────────
  {
    id: 'purgess',
    label: 'Purgess Flats',
    sublabel: 'Caldera Shelf · Ash Runoff Zone',
    coords: { lat: 35.8, lng: 13.4 },
    lore: {
      era: 'Ash Runoff Migration',
      history: 'The west flats became a pressure valve for ash and panic as Watcher cycles intensified. Basalt drift compasses keep caravans alive in charged ash plumes. Nothing lives here permanently — it is a crossing, not a home.',
      biome: 'Caldera shelf · cinder fields · ash plain',
      realWorldAnalog: 'Volcanic arc ash plain analogs — Kohistan tephra fields',
      factionLink: 'No faction — contested crossing zone used by all',
      tradeRoutes: ['Pumice Lane'],
    },
    terrain: {
      type: 'caldera shelf',
      substrate: 'cinder crust',
      color: 'ember basalt',
      hazards: ['heat vents', 'glass shards', 'disorientation in ash fog'],
    },
    book: {
      chapter: 'Ash Migration',
      sensory: 'Crunching glass underfoot. No shadow — flat white sky. The smell of sulfur and old fire.',
      event: 'A refugee column from the Watcher Wake crosses Purgess carrying nothing but tools.',
      characters: [],
    },
    artifact: {
      name: 'Basalt Drift Compass',
      class: 'Volcanic Navigation',
      note: 'Needle oscillates with charged ash plumes, warning caravans of unstable air.',
    },
    images: {
      hero: cdn('/img/locations/watcher_mountain_alt2.png'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['volcanic_bird_hero', 'void_shell'],
    myths: [],
    subLocations: [],
    revealed: true,
  },

  // ─── ARNN RIDGE ───────────────────────────────────────────────────────────────
  {
    id: 'arnn-ridge',
    label: 'Arnn Ridge',
    sublabel: 'Ridgehold Marches · Alliance Seam',
    coords: { lat: 44.8, lng: -120.4 },
    lore: {
      era: 'Ridgehold Marches',
      history: "Ridge camps linked inland factions after exile routes collapsed, binding Sae's coalition by necessity. The Ironwood Oath Spike still marks the pact site — driven into granite, seal resin still stained.",
      biome: 'Ridge seam · igneous crust · high-ground waypoint',
      realWorldAnalog: 'Cascade Arc analog — high-ground ridge system',
      factionLink: "Sae's Coalition — inland faction alliance formed after exile route collapse",
      tradeRoutes: ['Danian Run'],
    },
    terrain: {
      type: 'ridge seam',
      substrate: 'igneous crust',
      color: 'ember basalt',
      hazards: ['rockfall', 'heat vents', 'wind shear'],
    },
    book: {
      chapter: 'Ridge Pact',
      sensory: 'Thin cold air. The smell of pine resin from ironwood torches. Wind that never stops.',
      event: "Sae's coalition oath — factions bound by ridge necessity, not choice.",
      characters: ['Sae'],
    },
    artifact: {
      name: 'Ironwood Oath Spike',
      class: 'Alliance Relic',
      note: 'Driven into ridge granite at pact-signing; still stained with seal resin.',
    },
    images: {
      hero: cdn('/img/locations/sector-4-hero.png'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['tropeognathus', 'Roller_hero'],
    myths: [],
    subLocations: [
      { id: 'oath-stone', name: 'Oath Stone', desc: 'The granite face where the coalition pact was signed. The spike is still there.' },
    ],
    revealed: true,
  },

  // ─── NORTHERN MOUNTAINS ───────────────────────────────────────────────────────
  {
    id: 'northern-mountains',
    label: 'Northern Mountains',
    sublabel: 'Cold Route Trials · Passage Zone',
    coords: { lat: 48.2, lng: -120.9 },
    lore: {
      era: 'Cold Route Trials',
      history: 'High passes culled weak planning. Only crews with memory maps and ration discipline crossed alive. The rimeproof satchel lining kept knot-codes readable during freeze winds — the difference between intelligence and frostbite.',
      biome: 'High-altitude rock passage · freeze-thaw cycle',
      realWorldAnalog: 'High Arctic passage analog — polar forest margins',
      factionLink: 'No permanent faction — seasonal crossing point for northern coalitions',
      tradeRoutes: [],
    },
    terrain: {
      type: 'cold passage',
      substrate: 'freeze-shattered stone',
      color: 'ice grey',
      hazards: ['freeze winds', 'route memory failure', 'exposure'],
    },
    book: {
      chapter: 'Cold Crossing',
      sensory: 'The sound of wind through bare stone. Numbness spreading from the fingertips. The smell of nothing — cold kills smell.',
      event: 'A crew crosses with memory maps only, losing two members to exposure.',
      characters: [],
    },
    artifact: {
      name: 'Rimeproof Satchel Lining',
      class: 'Expedition Gear',
      note: 'Insulated weave that protected knot-codes during freeze winds.',
    },
    images: {
      hero: cdn('/img/locations/sector-4-hero.png'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['Lantern_Swift_hero'],
    myths: [],
    subLocations: [],
    revealed: true,
  },

  // ─── MT. CINDER ───────────────────────────────────────────────────────────────
  {
    id: 'mt-cinder',
    label: 'Mt. Cinder',
    sublabel: 'Volcanic Sister · Ash Source',
    coords: { lat: 37.7, lng: 15.0 },
    lore: {
      era: 'Ash Oath',
      history: "The angry sister to Mt. Shastea. Smoke drifts from her peak, feeding the Mystic Woods with ash. Cinder tremors ripple through the canopy — the Kith feel them before the instruments do.",
      biome: 'Gargantua domain · stratovolcano sister peak',
      realWorldAnalog: 'Cascade Arc analog — volcanic sibling peak',
      factionLink: 'Watcher Compact — monitored but not controlled',
      tradeRoutes: [],
    },
    terrain: {
      type: 'volcanic sister',
      substrate: 'igneous crust',
      color: 'ember basalt',
      hazards: ['tremors', 'ash curtain', 'hot rain'],
    },
    book: {
      chapter: 'Ash Oath',
      sensory: 'Dry thunder in the distance. A metallic taste in the air. Ash that smells of copper.',
      event: 'Cinder tremors ripple through the canopy, disrupting the Kith network.',
      characters: [],
    },
    artifact: {
      name: 'Cinder Tremor Log',
      class: 'Seismic Record',
      note: 'Kith-annotated bone tablet tracking Cinder pulse intervals relative to Watcher activity.',
    },
    images: {
      hero: cdn('/img/locations/Mount_Shastea_hero.png'),
      alt: [cdn('/img/locations/watcher_mountain_alt2.png')],
      faction: null,
      character: null,
    },
    creatures: ['volcanic_bird_hero', 'tapejara'],
    myths: [],
    subLocations: [],
    revealed: true,
  },

  // ─── DIER LAKE ────────────────────────────────────────────────────────────────
  {
    id: 'dier-lake',
    label: 'Dier Lake',
    sublabel: 'Mirrorwater Basin · Storm Warning',
    coords: { lat: 41.6, lng: -71.2 },
    lore: {
      era: 'Mirrorwater Surveillance',
      history: 'The eastern lake reflected storm fronts hours before impact, making it a strategic warning basin. Mirrorwake poles read vibration signatures of large aquatic predators — a lake that both warns and feeds.',
      biome: 'Freshwater shelf · storm-mirror basin',
      realWorldAnalog: 'Large interior freshwater lake — carbonate basin analog',
      factionLink: 'Scout networks — early warning relay point',
      tradeRoutes: [],
    },
    terrain: {
      type: 'freshwater mirror basin',
      substrate: 'carbonate drift',
      color: 'slate teal',
      hazards: ['current shear', 'predator wakes', 'sudden storm'],
    },
    book: {
      chapter: 'Mirror Reading',
      sensory: 'Stillness so complete you hear your own pulse. Then the water shifts — subtle, low, something large moving below.',
      event: "A scout reads predator wakes correctly and warns the column. First use of the Mirrorwake protocol.",
      characters: [],
    },
    artifact: {
      name: 'Mirrorwake Pole',
      class: 'Hydro-Signal Tool',
      note: 'Lake-skin probe for reading vibration signatures of large aquatic predators.',
    },
    images: {
      hero: cdn('/img/locations/pteros-island-sun.png'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['kronosaurus', 'protostegid', 'manatee_hero'],
    myths: [],
    subLocations: [],
    revealed: true,
  },

  // ─── STRAITS OF DIER ──────────────────────────────────────────────────────────
  {
    id: 'straits-of-dier',
    label: 'Straits of Dier',
    sublabel: 'Maritime Relay · Courier Corridor',
    coords: { lat: 41.6, lng: -71.2 },
    lore: {
      era: 'Maritime Relay Expansion',
      history: 'Neutral transit charters were negotiated here to preserve courier movement through predator-heavy channels. The Matsu-Knot sleeve encodes route class and urgency for open-water relays — intelligence that moves faster than armies.',
      biome: 'Narrow strait · tidal channel · relay crossing',
      realWorldAnalog: 'Strait of Dier — narrow tidal channel analog',
      factionLink: 'Neutral — all factions use courier charter rights',
      tradeRoutes: ['Danian Run', 'Apulia Shelfway'],
    },
    terrain: {
      type: 'narrow strait',
      substrate: 'silt channel',
      color: 'ink teal',
      hazards: ['cross-currents', 'honest seam', 'patrol ambush'],
    },
    book: {
      chapter: 'Courier Run',
      sensory: 'Two walls of water moving in opposite directions. The constant sound of current against stone.',
      event: 'A courier breaks the neutral transit charter — opening the strait to faction conflict.',
      characters: ['Jairo', 'Kel'],
    },
    artifact: {
      name: 'Matsu-Knot Transit Sleeve',
      class: 'Signal Cryptography',
      note: 'Encodes route class, urgency, and hand-to-hand restrictions for open-water relays.',
    },
    images: {
      hero: cdn('/img/locations/pteros-island-sun.png'),
      alt: [],
      faction: null,
      character: cdn('/img/characters/jairo_hero.png'),
    },
    creatures: ['kronosaurus', 'GlassRay_hero', 'Shore_Turtle_hero'],
    myths: ['robber-purple-shore'],
    subLocations: [
      { id: 'neutral-dock', name: 'Neutral Dock', desc: 'The only sanctioned landing for cross-faction couriers. Charter seals required.' },
    ],
    revealed: true,
  },

  // ─── TWIN STRAITS OF DIER ─────────────────────────────────────────────────────
  {
    id: 'twin-straits-of-dier',
    label: 'Twin Straits of Dier',
    sublabel: 'Split Current · Route Decision',
    coords: { lat: 40.8, lng: -70.1 },
    lore: {
      era: 'Split Current Campaign',
      history: 'The Danian split around Pteros turned one passage into two lethal choices, each with different luck. The dual-current knotline signals safe branch choice under pursuit — two strands, two fates.',
      biome: 'Split tidal channel · pursuit corridor',
      realWorldAnalog: 'Twin passage analog — delta bifurcation zone',
      factionLink: 'Contested — no single faction controls both branches',
      tradeRoutes: ['Danian Run'],
    },
    terrain: {
      type: 'bifurcated channel',
      substrate: 'silt-clay bed',
      color: 'brine teal',
      hazards: ['split current drag', 'wrong-branch penalty', 'ambush lanes'],
    },
    book: {
      chapter: 'The Split',
      sensory: 'Two sounds of water, pulling in different directions. The knot-reader calls the left branch.',
      event: 'A faction patrol forces a column to use the unmarked branch. Half the group is lost.',
      characters: ['Jairo', 'Kel'],
    },
    artifact: {
      name: 'Dual Current Knotline',
      class: 'Route Selection Code',
      note: 'Two-strand knot language for signaling safe branch choice under pursuit.',
    },
    images: {
      hero: cdn('/img/locations/pteros-island-sun.png'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['kronosaurus', 'silt_hunter'],
    myths: [],
    subLocations: [],
    revealed: true,
  },

  // ─── DANIAN RIVER ─────────────────────────────────────────────────────────────
  {
    id: 'danian-river',
    label: 'Danian River',
    sublabel: 'Book I Return Arc · River Corridor',
    coords: { lat: 7.8, lng: -44.0 },
    lore: {
      era: 'Book I Return Circuit',
      history: "Jairo and Kel held close to city influence here while Igzier's inland arc bent toward reunion. The river is the spine of the world — everything political that matters either travels with the current or against it.",
      biome: 'Braided river · floodplain · Danian corridor',
      realWorldAnalog: 'Paleo-Nile / Nubian floodplain system',
      factionLink: 'Mystics control headwaters; Silurians control estuary — river is disputed middle',
      tradeRoutes: ['Danian Run', 'Ordovic Intake Loop'],
    },
    terrain: {
      type: 'braided river',
      substrate: 'quartz-rich sand',
      color: 'silt brown',
      hazards: ['flood surge', 'log jam rafts', 'current ambush'],
    },
    book: {
      chapter: 'River Return',
      sensory: 'The smell of wet sand and distance. The sound of moving water that never goes away.',
      event: "Igzier's return arc brings the three storylines back into collision.",
      characters: ['Igzier', 'Jairo', 'Kel'],
    },
    artifact: {
      name: 'Riverfork Dead-Reckoner',
      class: 'Current Navigation',
      note: 'Bone-scribed current wheel used to estimate split times before channel divergence.',
    },
    images: {
      hero: cdn('/img/locations/pteros-island-sun.png'),
      alt: [],
      faction: null,
      character: cdn('/img/characters/jairo_hero.png'),
    },
    creatures: ['suchomimus', 'nigersaurus', 'ironback_sturgeon'],
    myths: ['soft-kings'],
    subLocations: [],
    revealed: true,
  },

  // ─── DANIAN DELTA ─────────────────────────────────────────────────────────────
  {
    id: 'danian-delta',
    label: 'Danian Delta',
    sublabel: 'Glow Tide Zone · Book I Climax',
    coords: { lat: 5.2, lng: -36.7 },
    lore: {
      era: 'Glow Tide Ashfall',
      history: "At Glow Tide the ash began to fall, the Watcher woke, and every political lie in Sky City came due. The Glow-Ash Filter Veil was worn by delta crews during the first ash rain while extraction routes collapsed. The delta is where the book ends. Recumbent rudists (Titanosarcolites — up to 1.3m across) were the deep-dredge prize of Cambrian fisheries here before the OAE collapse.",
      biome: 'Deltaic estuary · bioluminescence zone · ashfall convergence · Recumbent rudist beds',
      realWorldAnalog: 'Nubian Sandbar Run — deltaic sand islands, flood pulse shifting',
      factionLink: 'No faction controls the delta at Glow Tide — it belongs to the ash',
      tradeRoutes: ['Nubian Sandbar Exchange'],
      codexNote: 'During OAE 1b, the Cambrian Fisheries Codex records "Purple Tide" events here — massive fish and reptile carrion washing onto the delta as H₂S-laden water rose into the photic zone. Death Glimmer bioluminescence preceded each event by 6-12 hours.',
    },
    terrain: {
      type: 'delta shelf',
      substrate: 'sulfur mud',
      color: 'brine teal',
      hazards: ['anoxic pulses', 'silt collapse', 'ash rain'],
    },
    book: {
      chapter: 'Glow Tide',
      sensory: 'Bioluminescence turning the water electric blue. Ash falling like slow snow. The smell of sulfur mixed with salt.',
      event: "The Watcher wakes. Every alliance reorders. Book I's final sequence.",
      characters: ['Igzier', 'Jairo', 'Kel', 'Ravel'],
    },
    artifact: {
      name: 'Glow-Ash Filter Veil',
      class: 'Survival Cloth',
      note: 'Worn by delta crews during the first ash rain while extraction routes collapsed.',
    },
    images: {
      hero: cdn('/img/map/tethys-ember-scar.png'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['kronosaurus', 'tapejara', 'GlassRay_hero', 'protostegid'],
    myths: ['soft-kings', 'robber-purple-shore'],
    subLocations: [
      { id: 'glow-tide-margin', name: 'Glow-Tide Bloom Margin', desc: 'Bioluminescent hazard band — seasonal filter-fishing and predator congregation zone.' },
      { id: 'ash-shore', name: 'Ash Shore', desc: 'The landward edge where the first ash rain settled. Filter veils required.' },
    ],
    revealed: true,
  },

  // ─── PTEROS ISLAND ────────────────────────────────────────────────────────────
  {
    id: 'pteros',
    label: 'Pteros Island',
    sublabel: 'Estuary Hub · Aerial Relay Charter',
    coords: { lat: -3.7, lng: -38.5 },
    lore: {
      era: 'Eyrie Charter Standardization',
      history: "The central hub where sky and sea meet in a violent feeding frenzy. The island became a logistics hinge where aerial relay ethics were codified across rival settlements — and where a hybrid escape changed the city's balance of fear. The Eyrie Charter's Pteroswift relay stations still honor neutrality here.",
      biome: 'Rookery domain · estuary shelf · tidal platform · Rudist Elevator thickets',
      realWorldAnalog: 'Crato Formation, Araripe Basin, Brazil (7.2°S, 39.4°W)',
      factionLink: 'Multi-faction hub — Eyrie Charter relay; no single faction controls',
      tradeRoutes: ['Danian Run', 'Pumice Lane', 'Apulia Shelfway'],
      codexNote: 'Cambrian Fisheries Codex notes Pteros as the primary harvesting ground for Elevator rudists (Caprinidae). The tidal resonance of the estuary drove herring schools into stone weirs — early automated mass-harvesting. Xiphactinus surface-feeding frenzies documented at high tide.',
    },
    terrain: {
      type: 'estuary shelf',
      substrate: 'rookery silt',
      color: 'green-grey',
      hazards: ['brine mist', 'rookery crush', 'soft sinkholes'],
    },
    book: {
      chapter: 'The Hatchery',
      sensory: 'Screeching pterosaurs. The humid weight of the estuary. The smell of brine and rotting fish.',
      event: 'The scramble for food during high tide. First aerial relay seen from ground level.',
      characters: ['Igzier', 'Jairo'],
    },
    artifact: {
      name: 'Resin-Sealed Reed Tube',
      class: 'Courier Payload',
      note: 'Windproof message carrier with horn-stamp verification scar.',
    },
    images: {
      hero: cdn('/img/locations/pteros-island-sun.png'),
      alt: [],
      faction: null,
      character: cdn('/img/characters/jairo_hero.png'),
    },
    creatures: ['tapejara', 'tropeognathus', 'kronosaurus', 'Shore_Turtle_hero', 'Lobster_hero'],
    myths: ['soft-kings', 'walking-island'],
    subLocations: [
      { id: 'eyrie-dock', name: 'Eyrie Dock', desc: 'The sanctioned relay landing. Charter seals and courier loads processed here.' },
      { id: 'frenzy-shore', name: 'Frenzy Shore', desc: 'The tidal edge where aerial and marine predators overlap. No one lingers.' },
    ],
    revealed: true,
  },

  // ─── AMBER PLAINS ─────────────────────────────────────────────────────────────
  {
    id: 'amber-plains',
    label: 'The Amber Plains',
    sublabel: 'Thal Territory · Titan Migration',
    coords: { lat: -1.4, lng: 35.2 },
    lore: {
      era: 'Thal Bond Doctrine',
      history: "A sea of golden grass where the Titan-Walkers migrate. The bond is strongest here, and the ground remembers every hoof. Igzier's lineage is revealed at the rim of the plains. The Thals have intermittent access to mixing-zone nutrient pulses via pumice lanes.",
      biome: 'Open grassland · titan migration corridor · Serengeti-Okavango analog',
      realWorldAnalog: 'Serengeti-Okavango Analog, Southern Interior (3.0°S, 31.0°E)',
      factionLink: 'Thal Assembly — creature bonding, titan-walker herding, grassland stewardship',
      tradeRoutes: ['Pumice Lane', 'Nubian Sandbar Exchange'],
    },
    terrain: {
      type: 'open grassland',
      substrate: 'root-threaded soil',
      color: 'amber-gold',
      hazards: ['stampede paths', 'predator migration', 'flash flood channels'],
    },
    book: {
      chapter: 'Bond at Dawn',
      sensory: 'Warm wind over tall grass. Distant mammoth calls like drumbeats. The smell of dry earth and animal heat.',
      event: "Igzier's lineage is revealed at the rim of the plains — Thal bloodline confirmed.",
      characters: ['Igzier'],
    },
    artifact: {
      name: 'Thal Bond Collar',
      class: 'Creature Binding Instrument',
      note: 'Woven grass-fiber collar with knot-language recording the first creature-bond event.',
    },
    images: {
      hero: cdn('/img/factions/Thals_hero.png'),
      alt: [cdn('/img/factions/Assemb_Thals.png'), cdn('/img/factions/Thal_Creature_Chaos.png')],
      faction: cdn('/img/factions/Thals_hero.png'),
      character: null,
    },
    creatures: ['sauroposeidon', 'nigersaurus', 'Hybrid_Tank'],
    myths: ['soft-kings', 'walking-island'],
    subLocations: [
      { id: 'plains-rim', name: 'The Plains Rim', desc: 'The elevated edge overlooking the migration corridor — where lineage revelation scenes occur.' },
      { id: 'bond-circle', name: 'Bond Circle', desc: 'Thal ritual space for first creature bonding. Ground worn smooth by generations of ceremony.' },
    ],
    revealed: true,
  },

  // ─── MAMMOTH-HAND ISLAND ──────────────────────────────────────────────────────
  {
    id: 'mammoth',
    label: 'Mammoth Island',
    sublabel: 'Titan Territory · Northern Reach',
    coords: { lat: 61.2, lng: -149.9 },
    lore: {
      era: 'Pre-Compact Northern Period',
      history: 'A volcanic chain with a central peak and twin sisters. Mammoth Island anchors the northern extreme of the Tethys world — contact rare, intel sparse. Burrow city rumors trace here.',
      biome: 'Volcanic island arc · northern megafauna range',
      realWorldAnalog: 'Kerguelen Plateau above sea level (49.3°S, 69.3°E)',
      factionLink: 'No active faction — periodic Thal and northern scout contact only',
      tradeRoutes: [],
    },
    terrain: {
      type: 'volcanic island',
      substrate: 'basalt shelf',
      color: 'grey-black',
      hazards: ['isolation', 'storm surge', 'magnetic interference'],
    },
    book: {
      chapter: 'The Sleeping Giant',
      sensory: 'Rhythmic tremors (Nute\'s heartbeat). The heat of volcanic vents. The smell of sulfur and deep cold.',
      event: "The awakening of the 'Island' during the First Human War.",
      characters: [],
    },
    artifact: {
      name: 'Mammoth Knot Chart',
      class: 'Navigation Archive',
      note: 'Northern approach chart with hand-counted star positions and tide warnings.',
    },
    images: {
      hero: cdn('/img/locations/watcher_mountain_alt2.png'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: ['sauroposeidon', 'Hybrid_Tank'],
    myths: ['burrow-cities', 'walking-island'],
    subLocations: [],
    revealed: false,
  },

  // ─── TETHYS SEA ───────────────────────────────────────────────────────────────
  {
    id: 'tethys-sea',
    label: 'Tethys Sea',
    sublabel: 'Open Ocean · Equatorial Heat Engine',
    coords: { lat: 34.5, lng: 18.5 },
    lore: {
      era: 'Super-Greenhouse Climate',
      history: 'The equatorial heat engine with westward circumglobal current and paired gyres. Strong stratification: freshwater surface lid over warm, saline, low-oxygen deep water. When the purple tides come, the sea itself is lethal.',
      biome: 'Open ocean · euxinic deep water · photic zone euxinia risk',
      realWorldAnalog: 'Neo-Tethys Ocean — equatorial circulation 111 Ma',
      factionLink: 'No faction — universal hazard zone',
      tradeRoutes: ['Pumice Lane', 'Apulia Shelfway'],
      codexNote: 'The Cambrian Fisheries Codex distinguishes three OAE phases here. During Purple Ocean events, Mosasaurus descends to the Twilight Zone (200-1000m) to avoid H₂S surface layers — this is the only window for open-water crossing. Sivulliusalmo (salmonid ancestors) survived OAE 1b by seeking oxic surface lenses.',
    },
    terrain: {
      type: 'open shelf',
      substrate: 'carbonate drift',
      color: 'slate teal',
      hazards: ['current shear', 'purple water toxic bloom', 'H2S fog', 'salt glass'],
    },
    book: {
      chapter: 'Open Water',
      sensory: 'No land in sight. The color of the water changing — green, then blue, then wrong. The smell of brine and something older.',
      event: 'First purple-water warning encountered — all transit stops.',
      characters: [],
    },
    artifact: {
      name: 'Open-Water Survival Raft',
      class: 'Emergency Vessel',
      note: 'Pumice-and-reed raft with brine filter and star-navigation bone chart.',
    },
    images: {
      hero: cdn('/img/map/epic_map_hero.PNG'),
      alt: [cdn('/img/map/tethys-atlas-clean.png')],
      faction: null,
      character: null,
    },
    creatures: ['kronosaurus', 'GlassRay_hero', 'protostegid', 'manatee_hero'],
    myths: ['robber-purple-shore', 'walking-island'],
    subLocations: [],
    revealed: true,
  },

  // ─── PERMIAN DESERT ───────────────────────────────────────────────────────────
  {
    id: 'permian-desert',
    label: 'Permian Desert',
    sublabel: 'Khorat Salt Analog · Southern Extreme',
    coords: { lat: -23.4, lng: -69.3 },
    lore: {
      era: 'Khorat Basin Isolation',
      history: 'Red beds and massive evaporites from seasonal aridity and basin isolation. Salt road commerce keeps the southern extreme connected to Sky City sealant markets. No one lives here voluntarily.',
      biome: 'Evaporite basin · Khorat red-bed analog · salt flat crossing',
      realWorldAnalog: 'Khorat Basin, Southeast Asia — red beds and evaporites',
      factionLink: 'Brine guild outposts — salt commerce only',
      tradeRoutes: ['Khorat Salt Road'],
    },
    terrain: {
      type: 'evaporite basin',
      substrate: 'salt crystal crust',
      color: 'red ochre',
      hazards: ['salt exposure', 'dehydration', 'mirage disorientation'],
    },
    book: {
      chapter: 'Salt Road',
      sensory: 'Blinding white at midday. Salt crystals crunching underfoot. No sound except wind and your own breathing.',
      event: 'Brine guild convoy crosses the permian flat — salt exchange determines sealant supply for the entire City.',
      characters: [],
    },
    artifact: {
      name: 'Salt Road Brine Gauge',
      class: 'Evaporite Survey Tool',
      note: 'Measures salt crystal depth to estimate crossing viability after wet season.',
    },
    images: {
      hero: cdn('/img/locations/sector-4-hero.png'),
      alt: [],
      faction: null,
      character: null,
    },
    creatures: [],
    myths: [],
    subLocations: [],
    revealed: false,
  },

];

/**
 * Look up a single region by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getRegion(id) {
  const region = REGION_REGISTRY.find((r) => r.id === id);
  if (!region) return undefined;
  // Attach food web profile inline so consumers get it automatically
  return { ...region, foodWeb: REGION_FOOD_WEB[id] ?? null };
}

/**
 * Look up a region by any of the legacy id aliases used in tethys-crucible.js.
 * Falls back to exact id match.
 */
const ALIAS_MAP = {
  'watcher-volcano': 'watcher-volcano',
  'watcher':         'watcher-volcano',
  'watcher-flats':   'watcher-volcano',
  'mountain-estuary': 'sky-city',
  'sky-city-estuary': 'sky-city',
  'ironwood':        'ironwoods',
  'mount-shastea':   'mt-cinder',
  'thal-territory':  'amber-plains',
  'mammoth-hand-island': 'mammoth',
  'pteros-island':   'pteros',
  'pteros-rookery':  'pteros',
};

export function getRegionByAlias(id) {
  const resolved = ALIAS_MAP[id] || id;
  return getRegion(resolved);
}

/**
 * All regions with revealed: true (Book 1 published — all core regions revealed).
 */
export function getRevealedRegions() {
  return REGION_REGISTRY.filter((r) => r.revealed);
}

// World of Tethys || D.C. Barletta
