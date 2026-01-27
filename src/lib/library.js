import cdn from '@/lib/cdn';

export const BOOKS = [
  {
    id: 'book1',
    title: 'Book I: Sky City of Tethys',
    isbn: 'B0G572X42L', // <--- Add your real ISBN here
    // ... keep your hardcoded desc as a fallback
    desc: 'When Igzier refuses to play along with a poisoned natural causes verdict, the city gives him a choice: execution… or exile off the ledge. He survives the fall, Stryker—a ptero-raptor who jumps after him. Igzier collides with:• Ravel, a synesthetic forest healer who hears the world in colors and vibrations instead of words. Karys, a greenhouse heir in Sky City who sees the rot in its pipes and politics. Jairo, another mixed-lineage talent caught between loyalty and doubt. Silurian river clans, Mystic Woods healers and menaces, and ancient Cambrian symbols that suggest Tethys has been watching this experiment for much longer than the City thinks. Im D.C. Barletta —biologist, coder, nerd with a nail gun. I build systems in real life and I break them in fiction. If you like epic fantasy with real biology and evolution under the hood, sky cities, bonded creatures, and morally messy revolutions - character-driven dialogue, weird healers, and political fallout, then welcome to World of Tethys. This is Book I of The Ash Age Trilogy.',
  coverUrl: cdn('/img/books/book1-cover.png'),
  amazonLink: 'https://www.amazon.com/dp/B0G572X42L'
    },

    {                                       
    id: 'book2',
    title: 'Unraveling Ravel: 5 Short Stories from the World of Tethys',
    isbn: 'B0GB5CR6HX', // <--- Add your real ISBN here
    // ... keep your hardcoded desc as a fallback
    desc: 'Ravel, a synesthetic forest healer who hears the world in colors and vibrations instead of words. Im D.C. Barletta —biologist, coder, nerd with a nail gun. I build systems in real life and I break them in fiction. If you like epic fantasy with real biology and evolution under the hood, sky cities, bonded creatures, and morally messy revolutions - character-driven dialogue, weird healers, and political fallout, then welcome to World of Tethys. This is Book I of The Ash Age Trilogy. More to come soon.',
    coverUrl: cdn('/img/books/ravel-kindle.png'),
    amazonLink: 'https://www.amazon.com/dp/B0GB5CR6HX' 
  },
   {
    id: 'book3',
    title: 'Unraveling Ravel: 5 Short Stories - Paperback Edition',
    isbn: 'B0GB9D9H3Z',
    desc: 'Ravel, a synesthetic forest healer who hears the world in colors and vibrations instead of words. Im D.C. Barletta —biologist, coder, nerd with a nail gun. I build systems in real life and I break them in fiction. If you like epic fantasy with real biology and evolution under the hood, sky cities, bonded creatures, and morally messy revolutions - character-driven dialogue, weird healers, and political fallout, then welcome to World of Tethys. This is Book I of The Ash Age Trilogy. More to come soon.',
    coverUrl: cdn('/img/books/ravel-paperback.png'),
    amazonLink: 'https://www.amazon.com/dp/B0GB9D9H3Z' 
   },
   {
    id: 'book4',
    title: 'What the Roots Remember: A Tethys Short Story',
    isbn: ' B0G672S7YC',
    desc: 'Ravel, a synesthetic forest healer who hears the world in colors and vibrations instead of words. Im D.C. Barletta —biologist, coder, nerd with a nail gun. I build systems in real life and I break them in fiction. If you like epic fantasy with real biology and evolution under the hood, sky cities, bonded creatures, and morally messy revolutions - character-driven dialogue, weird healers, and political fallout, then welcome to World of Tethys. This is Book I of The Ash Age Trilogy. More to come soon.',
    coverUrl: cdn('/img/books/roots-remember.png'),
    amazonLink: 'https://www.amazon.com/dp/ B0G672S7YC'
   }
];

export const ARCHIVE_CRATE = [
  {
    id: 'book_sky-city',
    title: 'Sky City of Tethys',
    type: 'Manifest',
    desc: "The official record. Igzier's fall, the verdict, and the first map of the vertical hierarchy.",
    condition: null,
    coverUrl: cdn('/img/books/book1-cover.png'),
    amazonLink: 'https://www.amazon.com/dp/B0G572X42L'
  },
  {
    id: 'book_ravel_tales',
    title: 'Unraveling Ravel',
    type: 'Field Notes',
    desc: 'Banned in the Upper Tiers. Five accounts of the root-whisperer that contradict the Ledger.',
    condition: { type: 'lore', val: 5, label: 'Requires 5 Lore' },
    coverUrl: cdn('/img/books/ravel-kindle.png'),
    amazonLink: 'https://www.amazon.com/dp/B0GB5CR6HX'
  },
  {
    id: 'book_roots',
    title: 'What the Roots Remember',
    type: 'Forbidden Scroll',
    desc: 'A side-story the Triumvirate tried to burn. It connects the Ironwoods to the Deep.',
    condition: { type: 'resin', val: 50, label: 'Bribe: 50 Resin' },
    coverUrl: cdn('/img/books/roots-remember.png'),
    amazonLink: 'https://www.amazon.com/dp/B0G672S7YC'
  }
];

export const watcherEvents = [
  {
    "id": "w_watchers-breath_01",
    "regionId": "watcher-volcano",
    "intensityBand": "near",
    "tags": ["ash", "moon-mountain", "eruption"],
    "gibberish": "hh—hh—hh… coin-air… lung of stone…",
    "translation": "Watcher is breathing again. The mountain is not angry—only awake."
  },
  {
    "id": "w_ledge-unobstructed_02",
    "regionId": "the-ledge",
    "intensityBand": "near",
    "tags": ["dread", "view", "sky-city"],
    "gibberish": "open-eye… no-blink…",
    "translation": "The Ledge shows you what mercy hides. Do not look for long. Your body will remember."
  },
  {
    "id": "w_flats-old-lava_03",
    "regionId": "watcher-flats",
    "intensityBand": "near",
    "tags": ["lavafield", "purgess", "scar"],
    "gibberish": "glass-ground… foot-scream…",
    "translation": "Watcher Flats is the cooled lie. One crack and it becomes the old truth again."
  },
  {
    "id": "w_purgess-breach_04",
    "regionId": "purgess",
    "intensityBand": "near",
    "tags": ["breach", "north", "death-zone"],
    "gibberish": "north-mouth… wide… wide…",
    "translation": "The northern side is already opened. It will eat the wind first, then the names of places."
  },
  {
    "id": "w_ashfall-mystic_05",
    "regionId": "mystic-woods",
    "intensityBand": "mid",
    "tags": ["ashfall", "fungus", "listening"],
    "gibberish": "spore-script… on leaves…",
    "translation": "Ash writes on every surface. The Mystics read it like scripture and call it weather."
  },
  {
    "id": "w_skycity-vaultblind_06",
    "regionId": "sky-city",
    "intensityBand": "mid",
    "tags": ["vault", "denial", "ornate-map"],
    "gibberish": "gold-ink… false-safe…",
    "translation": "Sky City paints courage on paper. The walls believe the paper."
  },
  {
    "id": "w_thal-distant-rumble_07",
    "regionId": "thals",
    "intensityBand": "far",
    "tags": ["distant", "sea", "rumble"],
    "gibberish": "low-drum… under-salt…",
    "translation": "Far out, the Thals feel it as a slow drum under the tide. They do not call it danger. They call it time."
  },
  {
    "id": "w_shastea-snow-smoke_08",
    "regionId": "mount-shastea",
    "intensityBand": "far",
    "tags": ["cold", "signal", "pressure"],
    "gibberish": "white-breath… black-breath…",
    "translation": "On Shastea, smoke looks like weather until it isn’t. The mountain air turns honest first."
  },
  {
    "id": "w_ironwood-quiet-animals_09",
    "regionId": "ironwoods",
    "intensityBand": "far",
    "tags": ["silence", "migration", "warning"],
    "gibberish": "no-birds… too-still…",
    "translation": "Ironwood goes quiet before it goes loud. When the small things leave, the big things arrive."
  },
  {
    "id": "w_cambria-ruins-remember_10",
    "regionId": "cambria-ruins",
    "intensityBand": "mid",
    "tags": ["ruins", "memory", "fertile-estuary"],
    "gibberish": "old-heat… spared-bowl…",
    "translation": "Cambria remembers the last roulette spin. The estuary was spared once. It is not owed twice."
  },
  {
    "id": "w_gargantua-chainreaction_11",
    "regionId": "gargantua-archipelago",
    "intensityBand": "far",
    "tags": ["islands", "echo", "aftershock"],
    "gibberish": "chain… chain… chain…",
    "translation": "In Gargantua, you won’t see the eruption. You’ll see its consequences arrive in a line."
  },
  {
    "id": "w_pteros-outside-brunt_12",
    "regionId": "pteros",
    "intensityBand": "far",
    "tags": ["outside-brunt", "flight", "warning"],
    "gibberish": "wing-sense… air-wrong…",
    "translation": "Pteros sits just outside the bite. Stryker feels it anyway—the air changes shape before the world does."
  },
  {
    "id": "w_danian-edge_13",
    "regionId": "danian",
    "intensityBand": "far",
    "tags": ["edge", "tide", "signal"],
    "gibberish": "tide-hesitates…",
    "translation": "Danian is safe by distance, not by grace. Watch the tide when it forgets its schedule."
  }
]
// World of Tethys || D.C. Barletta
