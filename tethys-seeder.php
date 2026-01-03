<?php

// Cambria Nine seeder payload (array of posts/entries)
return [
    [
        'title' => 'Matsu (The Prime)',
        'category' => 'Character',
        'content' => 'The leader of the Nine Visitors. He observes the "Great Filter" of Tethys, calculating whether humanity or reptiles will inherit the earth. His smile is too wide, and he speaks of "selection" with chilling detachment.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 95,
            'real_world_analog' => 'Charles Darwin',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Observer Prime'],
                ['trait' => 'Origin', 'value' => 'Charr Mountains (Base)'],
                ['trait' => 'Obsession', 'value' => 'Natural Selection'],
            ],
        ],
    ],
    [
        'title' => 'Bol (The Surveyor)',
        'category' => 'Character',
        'content' => 'The explorer of the group. He maps the isolation barriers of Tethys, understanding why species diverge in the Ironwoods versus the Estuary. He walks through lethal territory unharmed, protected by unseen tech.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 85,
            'real_world_analog' => 'Alfred Russel Wallace',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Biogeographer'],
                ['trait' => 'Ability', 'value' => 'Phase-Shift / Stealth'],
                ['trait' => 'Obsession', 'value' => 'Speciation'],
            ],
        ],
    ],
    [
        'title' => 'Asora (The Seer)',
        'category' => 'Character',
        'content' => 'Cold and precise, Asora sees the hidden architecture of life. She claims the genetic code of the Tethys fauna has been tampered with. She helped design the lattice structure of Sky City\'s walls.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 90,
            'real_world_analog' => 'Rosalind Franklin',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Structuralist'],
                ['trait' => 'Vision', 'value' => 'X-Ray / Microscopic'],
                ['trait' => 'Obsession', 'value' => 'The Helix'],
            ],
        ],
    ],
    [
        'title' => 'Lynixes (The Alchemist)',
        'category' => 'Character',
        'content' => 'Fascinated by the hyper-oxygenated atmosphere. He understands the chemical bonds that allow the dinosaurs to grow to titan sizes. He gifted Zygo the formula for the "Smokers" as a test.',
        'acf' => [
            'threat_level' => 'Caution',
            'kith_requirement' => 80,
            'real_world_analog' => 'Linus Pauling',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Chemist'],
                ['trait' => 'Affinity', 'value' => 'Fire / Oxidation'],
                ['trait' => 'Obsession', 'value' => 'Molecular Bonds'],
            ],
        ],
    ],
    [
        'title' => 'Clintok (The Mutator)',
        'category' => 'Character',
        'content' => 'She finds beauty in the broken. While others fear the Squaints, she studies their rapid genetic jumps. She believes "stability is death" and encourages the chaos of the Tethys environment.',
        'acf' => [
            'threat_level' => 'Caution',
            'kith_requirement' => 85,
            'real_world_analog' => 'Barbara McClintock',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Geneticist'],
                ['trait' => 'Interest', 'value' => 'Transposons / Mutations'],
                ['trait' => 'Quote', 'value' => '"It is not an error, it is an edit."'],
            ],
        ],
    ],
    [
        'title' => 'Val-Goodra (The Watcher)',
        'category' => 'Character',
        'content' => 'The only Observer who mimics empathy. She watches the Thals and the interaction between Igzier and his raptor. She believes the future lies in the bond between species, not domination.',
        'acf' => [
            'threat_level' => 'Safe',
            'kith_requirement' => 70,
            'real_world_analog' => 'Jane Goodall',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Ethologist'],
                ['trait' => 'Focus', 'value' => 'Social Structures'],
                ['trait' => 'Quirk', 'value' => 'Perfect Mimicry'],
            ],
        ],
    ],
    [
        'title' => 'Margul (The Weaver)',
        'category' => 'Character',
        'content' => 'Obsessed with the Root-Walkers. She teaches that the individual is a myth, and that all life is a colony. She is currently studying the symbiotic relationship between the Ironwood trees and the Polarians.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 80,
            'real_world_analog' => 'Lynn Margulis',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Symbiologist'],
                ['trait' => 'Theory', 'value' => 'Endosymbiosis'],
                ['trait' => 'Obsession', 'value' => 'The Network'],
            ],
        ],
    ],
    [
        'title' => 'Carsa (The Sentinel)',
        'category' => 'Character',
        'content' => 'The Warner. She monitors the toxicity levels of the Purgess Caves and the ash-fall. She predicts a "Silent Spring" for Tethys if the industrial efforts of the Iron-Binders continue unchecked.',
        'acf' => [
            'threat_level' => 'Safe',
            'kith_requirement' => 75,
            'real_world_analog' => 'Rachel Carson',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Toxicologist'],
                ['trait' => 'Gear', 'value' => 'Atmospheric Mask'],
                ['trait' => 'Warning', 'value' => 'System Collapse'],
            ],
        ],
    ],

    // --- THE MYSTERIOUS NINE (THE ELEVEN) ---
    [
        'title' => 'Prime Signal',
        'category' => 'Entity',
        'content' => 'A brief harmonic that ignited the Cambrian Revolution. It appeared once over Old Cambria and was interpreted as a summons.',
        'acf' => [
            'threat_level' => 'Incidental',
            'kith_requirement' => 99,
            'real_world_analog' => 'Prime Mover (Myth)',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Waveform / Beacon'],
                ['trait' => 'Effect', 'value' => 'Triggers adaptive cascades'],
                ['trait' => 'Epoch', 'value' => 'Pre-First Human War'],
            ],
        ],
    ],
    [
        'title' => 'Sable Architect',
        'category' => 'Entity',
        'content' => 'Known through lattice remnants under Cambria. It is credited with teaching matter to remember shapes.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 90,
            'real_world_analog' => 'Geometric Archetype',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Obsidian Planes'],
                ['trait' => 'Effect', 'value' => 'Structural resonance'],
                ['trait' => 'Trace', 'value' => 'Sky City lattice'],
            ],
        ],
    ],
    [
        'title' => 'Verdant Pulse',
        'category' => 'Entity',
        'content' => 'A spreading mycelial intelligence that whispered crop patterns and symbiosis to the first root-walkers.',
        'acf' => [
            'threat_level' => 'Safe',
            'kith_requirement' => 70,
            'real_world_analog' => 'Planetary Mycelium',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Spore fog'],
                ['trait' => 'Effect', 'value' => 'Boosts cooperative growth'],
                ['trait' => 'Trace', 'value' => 'Ironwood root hymns'],
            ],
        ],
    ],
    [
        'title' => 'Luminous Chorus',
        'category' => 'Entity',
        'content' => 'Seen as a crown of lights over the Weep; gifted bio-luminal code used in pteros relay crests.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 80,
            'real_world_analog' => 'Aurora Phenomenon',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Crown of arcs'],
                ['trait' => 'Effect', 'value' => 'Encodes light-signaling'],
                ['trait' => 'Trace', 'value' => 'Pteros crest glyphs'],
            ],
        ],
    ],
    [
        'title' => 'Iron Glyph',
        'category' => 'Entity',
        'content' => 'A magnetic script burned into basalt near the Foundry. It taught alloy instincts to the Iron-Binders.',
        'acf' => [
            'threat_level' => 'Caution',
            'kith_requirement' => 85,
            'real_world_analog' => 'Basaltic Petroglyph',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Metallic sigils'],
                ['trait' => 'Effect', 'value' => 'Guides forge-biology hybrids'],
                ['trait' => 'Trace', 'value' => 'Foundry hymnals'],
            ],
        ],
    ],
    [
        'title' => 'Riftwalker',
        'category' => 'Entity',
        'content' => 'Only footprints remain, crystallized mid-step. Believed to have pulled Cambria briefly out of phase to evade a storm.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 95,
            'real_world_analog' => 'Transient Graviton Event',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Absent / Implied'],
                ['trait' => 'Effect', 'value' => 'Phase-skipping'],
                ['trait' => 'Trace', 'value' => 'Glassified sand prints'],
            ],
        ],
    ],
    [
        'title' => 'Tide Oracle',
        'category' => 'Entity',
        'content' => 'Spoke once from the estuary mist; mapped the safe crossings before the First Human War.',
        'acf' => [
            'threat_level' => 'Safe',
            'kith_requirement' => 60,
            'real_world_analog' => 'Estuarine Seiche',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Mist silhouette'],
                ['trait' => 'Effect', 'value' => 'Predictive tide harmonics'],
                ['trait' => 'Trace', 'value' => 'Weep crossing chants'],
            ],
        ],
    ],
    [
        'title' => 'Ember Crown',
        'category' => 'Entity',
        'content' => 'Hovered above Watcher Mountain during ash winters. It seeded heat-resistant lineages.',
        'acf' => [
            'threat_level' => 'Caution',
            'kith_requirement' => 75,
            'real_world_analog' => 'Ball Lightning Myth',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Halo of sparks'],
                ['trait' => 'Effect', 'value' => 'Thermal tolerance encoding'],
                ['trait' => 'Trace', 'value' => 'Ash drake carapace patterns'],
            ],
        ],
    ],
    [
        'title' => 'Null Ferryman',
        'category' => 'Entity',
        'content' => 'A silent escort noted in exile records; crossings with it showed zero predation.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 88,
            'real_world_analog' => 'Psychopomp Archetype',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Void silhouette'],
                ['trait' => 'Effect', 'value' => 'Predator suppression'],
                ['trait' => 'Trace', 'value' => 'No tracks, only silence'],
            ],
        ],
    ],
    [
        'title' => 'Spiral Muse',
        'category' => 'Entity',
        'content' => 'Taught song-geometry to Kith oracles. Appeared as nested helixes in river foam.',
        'acf' => [
            'threat_level' => 'Safe',
            'kith_requirement' => 65,
            'real_world_analog' => 'Chladni Patterns',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Foam spirals'],
                ['trait' => 'Effect', 'value' => 'Memory encoding in chant'],
                ['trait' => 'Trace', 'value' => 'Root-walker hymn sequences'],
            ],
        ],
    ],
    [
        'title' => 'Veilkeeper',
        'category' => 'Entity',
        'content' => 'The only one believed still present. Seen at the edge of storms; filters what enters the valley.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 92,
            'real_world_analog' => 'Weather Front / Fata Morgana',
            'biological_traits' => [
                ['trait' => 'Form', 'value' => 'Storm veil'],
                ['trait' => 'Effect', 'value' => 'Selective passage'],
                ['trait' => 'Trace', 'value' => 'Mirage walls over the Strait of Dier'],
            ],
        ],
    ],

    // --- SKY CITY SCIENTISTS / ALLIANCE ---
    [
        'title' => 'Martha Chase Analogue (Sky City Geneticist)',
        'category' => 'Character',
        'content' => 'Co-proved that heredity rides on the helix, not protein—upending Triumvirate dogma. Quiet, relentless, leaves notes hidden in algae labs.',
        'acf' => [
            'threat_level' => 'Caution',
            'kith_requirement' => 78,
            'real_world_analog' => 'Martha Chase (Hershey-Chase)',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Helix Verifier'],
                ['trait' => 'Experiment', 'value' => 'Helix-tagged phage in Sky City raceways'],
                ['trait' => 'Ally', 'value' => 'Karys / Seris'],
            ],
        ],
    ],
    [
        'title' => 'Varrun (The Breakout Engineer)',
        'category' => 'Character',
        'content' => 'A rocket-minded strategist imprisoned for questioning Cohab Code. Smuggled out to join the Alliance of Cambria; trades propulsion math for freedom.',
        'acf' => [
            'threat_level' => 'Unknown',
            'kith_requirement' => 82,
            'real_world_analog' => 'Wernher von Braun (tainted genius)',
            'biological_traits' => [
                ['trait' => 'Role', 'value' => 'Propulsion / Siege Designer'],
                ['trait' => 'Arc', 'value' => 'Rescued from Sky City vaults'],
                ['trait' => 'Allies', 'value' => 'Karys, Seris, Lady Eldora'],
            ],
        ],
    ],
];
