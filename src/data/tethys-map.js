// src/data/tethys-map.js

export const TETHYS_MAP_DATA = [
  { 
    id: 'sky-city', 
    gameName: 'Sky City', 
    realName: 'Ahaggar Volcanic Field', 
    location: 'Hoggar Swell, Algeria', 
    coords: '23.3° N, 5.5° E',
    type: 'Civilization Anchor',
    desc: 'Hidden by the Cimmerian Mountains to the North. A vertical hierarchy governed by the "Cohab Code." The Spire Architects suppress the Root Walker bondline to keep the ground a myth.',
    book_context: {
      chapter: 'Sector 1',
      sensory: 'Smell of sulfur and unwashed bodies. The sound of wind whistling through the "The Stakes" (impaling cliffs).',
      event: 'The execution of Exiles who refused "The Quick."'
    },
    x: 52, y: 35 
  },
  { 
    id: 'the-weep', 
    gameName: 'The Weep / The Ledge', 
    realName: 'Agulhas Bank Shelf', 
    location: 'South African Margin', 
    coords: '34.8° S, 20.0° E',
    type: 'Hazard Zone',
    desc: 'A deadly shelf ("The Ledge") resembling a half-eaten dinner plate. Below lies the frenzy—an endless feeding ground for aquatic apex predators.',
    book_context: {
      chapter: 'The Fall',
      sensory: 'Deafening roar of falling water. Salt spray mixed with the copper tang of blood. The vibration of the "Frenzy" below.',
      event: 'The Hero’s miraculous survival and injury on the shelf.'
    },
    x: 55, y: 65 
  },
  { 
    id: 'pteros', 
    gameName: 'Pteros Island', 
    realName: 'Crato Formation', 
    location: 'Araripe Basin, Brazil', 
    coords: '7.2° S, 39.4° W',
    type: 'Estuary Hub',
    desc: 'The central hub where sky and sea meet in a violent feeding frenzy. Home to the hatchery and the first test of survival.',
    book_context: {
      chapter: 'The Hatchery',
      sensory: 'Screeching pterosaurs. The humid weight of the estuary. The smell of brine and rotting fish.',
      event: 'The scramble for food during the high tide.'
    },
    x: 32, y: 58 
  },
  { 
    id: 'ironwoods', 
    gameName: 'The Ironwoods', 
    realName: 'Axel Heiberg Fossil Forest', 
    location: 'High Arctic (Cretaceous)', 
    coords: '79.9° N, 90.0° W',
    type: 'Biome: Gigantism',
    desc: 'True North. Land of "Redwoods on Steroids." Canopy-adapted humans hold strong here. The roots connect all the way to the Mystic Woods.',
    book_context: {
      chapter: 'Canopy War',
      sensory: 'Creaking of massive timber. Filtered green light. The silence of the forest floor where only the roots speak.',
      event: 'The composition shift caused by the Danian River cut.'
    },
    x: 45, y: 20 
  },
  {
    id: 'ironwood-spires',
    gameName: 'Ironwood Spires',
    realName: 'Canopy Rise (Analog)',
    location: 'Ironwood western edge',
    coords: '76.0° N, 95.0° W',
    type: 'Sky City Outskirts',
    desc: 'The vertical ocean. Ascended spires anchored into living timber, a reminder that height is both sanctuary and cage.',
    book_context: {
      chapter: 'Hidden Bloodline',
      sensory: 'Resin haze and wind-swept rope bridges. Bells rattling on the highest beams.',
      event: 'The rumor of a bonded Ascended spreads in the lower tiers.'
    },
    x: 40, y: 22
  },
  { 
    id: 'mystic-woods', 
    gameName: 'Mystic Woods', 
    realName: 'Wealden Fern Swamps', 
    location: 'Wessex Basin, UK', 
    coords: '50.6° N, 1.3° W',
    type: 'Biome: Psionic',
    desc: 'Between Watcher Mountain and the Albian Riverlands. Home to Ravel and the Kith. The trees here evolve in real-time.',
    book_context: {
      chapter: 'Ravel’s Glade',
      sensory: 'The hum of the Kith network (43.7 Hz). Bioluminescent spores drifting in the shade.',
      event: 'The meeting with the Mystic pair (Ravel/Kith) after the Hero’s fall.'
    },
    subLocations: [
      { id: 'the-tree', name: 'The Elder Stump', desc: 'The dead stump of the First Tree.' },
      { id: 'the-scars', name: 'The Magma Scars', desc: 'Lava channels that burned the old roots.' }
    ],
    x: 48, y: 28 
  },
  {
    id: 'mt-cinder',
    gameName: 'Mt. Cinder',
    realName: 'Cascade Arc (Analog)',
    location: 'Northeastern highlands',
    coords: '46.0° N, 121.0° W',
    type: 'Volcanic Sister',
    desc: 'The angry sister to Mt. Shastea. Smoke drifts from her peak, feeding the Mystic Woods with ash.',
    book_context: {
      chapter: 'Ash Oath',
      sensory: 'Dry thunder in the distance. A metallic taste in the air.',
      event: 'Cinder tremors ripple through the canopy.',
    },
    x: 78, y: 12
  },
  {
    id: 'amber-plains',
    gameName: 'The Amber Plains',
    realName: 'Serengeti-Okavango Analog',
    location: 'Southern interior',
    coords: '3.0° S, 31.0° E',
    type: 'Thal Territory',
    desc: 'A sea of golden grass where the Titan-Walkers migrate. The bond is strongest here, and the ground remembers every hoof.',
    book_context: {
      chapter: 'Bond at Dawn',
      sensory: 'Warm wind over tall grass. Distant mammoth calls like drumbeats.',
      event: 'Igzier’s lineage is revealed at the rim of the plains.'
    },
    x: 62, y: 72
  },
  { 
    id: 'southeast-chain', 
    gameName: 'Nute’s Rest', 
    realName: 'Kerguelen Plateau (Above Sea Level)', 
    location: 'Southern Indian Ocean', 
    coords: '49.3° S, 69.3° E',
    type: 'Titan Territory',
    desc: 'A volcanic chain with a central peak and twin sisters. Nute (Titanosaur/T-Rex hybrid) sleeps here, often mistaken for an island.',
    book_context: {
      chapter: 'The Sleeping Giant',
      sensory: 'Rhythmic tremors (Nute’s heartbeat). The heat of the volcanic vents.',
      event: 'The awakening of the "Island" during the First Human War.'
    },
    x: 75, y: 70 
  },
  { 
    id: 'cambria', 
    gameName: 'Cambria (Ruins)', 
    realName: 'Lost Continent of Adria', 
    location: 'Mediterranean Basin', 
    coords: '41.9° N, 12.5° E',
    type: 'Ancestral Ruin',
    desc: 'A lost Venice/Atlantis. Submerged by the tidal ride and the First Human War. Full of relics and murals of the "Godzillas."',
    book_context: {
      chapter: 'The Prequel',
      sensory: 'Muffled underwater silence. The gloom of the deep shelf. Glowing relics.',
      event: 'The scrambling of alliances during the Great Flood.'
    },
    x: 60, y: 45 
  }
];
// World of Tethys || D.C. Barletta
