<?php
$entries = [
        // --- CHARACTERS: THE PROTAGONISTS ---
        [
            'title' => 'Igzier (The Exile)',
            'category' => 'Character',
            'content' => 'Born in the Ironwoods but raised in the gilded cage of Sky City, Igzier is a bridge between two worlds. A brilliant engineer and assistant to Melden, he was framed for his mentor\'s murder by the Triumvirate to silence the truth about the city\'s defenses. Fleeing into the toxic Purgess Caves, he survives by his wits and a stolen Pteros-bone shiv. He is unaware that he is the lost heir to the Ironwood throne, a lineage that could unite the wild factions.',
            'acf' => [
                'threat_level' => 'Caution', // Dangerous to the Triumvirate
                'kith_requirement' => 0,   // Entry-level knowledge
                'real_world_analog' => 'Aragorn / The Hero\'s Journey',
                'biological_traits' => [
                    ['trait' => 'Origin', 'value' => 'Ironwoods (Blood) / Sky City (Raised)'],
                    ['trait' => 'Weapon', 'value' => 'Pteros-Bone Shiv'],
                    ['trait' => 'Companion', 'value' => 'Stryker (Raptor)'],
                    ['trait' => 'Status', 'value' => 'Exile / Heir']
                ]
            ]
        ],
        [
            'title' => 'Melden',
            'category' => 'Character',
            'content' => 'The Architect of Sky City and the mind behind its survival. Small in stature but a giant in intellect, Melden invented the Photobioreactors that power the city and the chemical deterrent that repels Reapers. He was murdered by the Triumvirate because he sought to share his technology with the "savages" outside the walls. His lenses were his trademark.',
            'acf' => [
                'threat_level' => 'Safe',
                'kith_requirement' => 10,
                'real_world_analog' => 'Da Vinci / Galileo / Prometheus',
                'biological_traits' => [
                    ['trait' => 'Intellect', 'value' => 'Genius Level'],
                    ['trait' => 'Invention', 'value' => 'Algae-Biodiesel / Reptile Deterrent'],
                    ['trait' => 'Status', 'value' => 'Deceased (Martyr)'],
                    ['trait' => 'Legacy', 'value' => 'The Savior of the Outer World']
                ]
            ]
        ],
        [
            'title' => 'Karys',
            'category' => 'Character',
            'content' => 'A high-caste noblewoman of Sky City and Igzier\'s forbidden love. While Igzier believes their bond is broken by his exile, she remains his strongest political ally within the corrupt city walls. Intelligent and resourceful, she navigates the treacherous social court of the Triumvirate.',
            'acf' => [
                'threat_level' => 'Safe',
                'kith_requirement' => 15,
                'real_world_analog' => 'Arwen / The Diplomat',
                'biological_traits' => [
                    ['trait' => 'Caste', 'value' => 'Elite Nobility'],
                    ['trait' => 'Motivation', 'value' => 'Justice / Love'],
                    ['trait' => 'Location', 'value' => 'Sky City Inner Sanctum']
                ]
            ]
        ],
        [
            'title' => 'Zygo (The Hermit)',
            'category' => 'Character',
            'content' => 'The "Mad Hermit" of the wastes. A master survivalist who has lived outside the walls for decades. He creates "Smokers"—slow-burning fires that mask the scent of flesh from the blind Squaints. Though his mind is fractured by isolation ("cabin fever"), he becomes Igzier\'s guide to the savage laws of the wild.',
            'acf' => [
                'threat_level' => 'Caution', // Unpredictable
                'kith_requirement' => 20,
                'real_world_analog' => 'The Shaman / Survivalist',
                'biological_traits' => [
                    ['trait' => 'Skill', 'value' => 'Chemical Camouflage (Smokers)'],
                    ['trait' => 'Sanity', 'value' => 'Fractured'],
                    ['trait' => 'Role', 'value' => 'Wild Mentor'],
                    ['trait' => 'Nemesis', 'value' => 'The Squaints']
                ]
            ]
        ],
        [
            'title' => 'Byrge (The Star-Watcher)',
            'category' => 'Character',
            'content' => 'An astronomer whose obsession with the sky led many to believe he was an alien himself. He kept meticulous records of celestial events, including the "Strange Sunrise"—a phenomenon where the sun rose in the middle of the night. He vanished after his final entry, leaving behind logs that hint at the true nature of the Nine Visitors.',
            'acf' => [
                'threat_level' => 'Unknown',
                'kith_requirement' => 60,
                'real_world_analog' => 'Copernicus / The Oracle',
                'biological_traits' => [
                    ['trait' => 'Status', 'value' => 'Missing'],
                    ['trait' => 'Obsession', 'value' => 'The Horizon'],
                    ['trait' => 'Discovery', 'value' => 'The False Sunrise']
                ]
            ]
        ],
        [
            'title' => 'Rivar',
            'category' => 'Character',
            'content' => 'A mystic from the Hall of Imor. He possessed no material wealth yet commanded more respect and power than the kings of old. His teachings of "survival through connection" challenged the isolationist policies of the early tribes.',
            'acf' => [
                'threat_level' => 'Safe',
                'kith_requirement' => 45,
                'real_world_analog' => 'Gandhi / The Ascetic',
                'biological_traits' => [
                    ['trait' => 'Role', 'value' => 'Philosopher King'],
                    ['trait' => 'Base', 'value' => 'Hall of Imor'],
                    ['trait' => 'Power', 'value' => 'Influence / Wisdom']
                ]
            ]
        ],

        // --- CHARACTERS: THE CAMBRIA NINE (THE OBSERVERS) ---
        // Aliens from the Charr Mountains who mimic human form poorly.
        [
            'title' => 'Matsu (The Prime)',
            'category' => 'Character',
            'content' => 'The leader of the Nine Visitors. He observes the "Great Filter" of Tethys—the war between Mammal and Reptile. His smile is too wide, and he speaks of "natural selection" with a chilling, clinical detachment.',
            'acf' => [
                'threat_level' => 'Unknown',
                'kith_requirement' => 95,
                'real_world_analog' => 'Charles Darwin',
                'biological_traits' => [
                    ['trait' => 'Role', 'value' => 'Observer Prime'],
                    ['trait' => 'Origin', 'value' => 'Charr Mountains (Barren Side)'],
                    ['trait' => 'Obsession', 'value' => 'Evolutionary Success']
                ]
            ]
        ],
        [
            'title' => 'Bol (The Geographer)',
            'category' => 'Character',
            'content' => 'The explorer of the Nine. He maps the isolation barriers of Tethys, fascinated by how the Straits of Dier separate the evolutionary paths of the Ironwoods and the deserts. He walks through lethal territory unharmed, protected by unseen tech.',
            'acf' => [
                'threat_level' => 'Unknown',
                'kith_requirement' => 85,
                'real_world_analog' => 'Alfred Russel Wallace',
                'biological_traits' => [
                    ['trait' => 'Role', 'value' => 'Biogeographer'],
                    ['trait' => 'Ability', 'value' => 'Phase-Shift / Stealth'],
                    ['trait' => 'Obsession', 'value' => 'Speciation Barriers']
                ]
            ]
        ],
        [
            'title' => 'Erickerts (The Botanist)',
            'category' => 'Character',
            'content' => 'The Keeper of the Cell. He views the Ironwoods not as individual trees but as a single, cellular organism. He refuses to walk on grass, seeing it as "stepping on the machinery" of the planet.',
            'acf' => [
                'threat_level' => 'Safe',
                'kith_requirement' => 75,
                'real_world_analog' => 'Matthias Schleiden',
                'biological_traits' => [
                    ['trait' => 'Role', 'value' => 'Botanist'],
                    ['trait' => 'Focus', 'value' => 'Cell Theory'],
                    ['trait' => 'Quirk', 'value' => 'Phobia of trampling life']
                ]
            ]
        ],
         [
            'title' => 'Asora (The Structuralist)',
            'category' => 'Character',
            'content' => 'Cold and precise, Asora sees the hidden architecture of life (DNA). She claims the genetic code of the Tethys fauna has been tampered with. She helped design the lattice structure of Sky City\'s walls to mimic bone.',
            'acf' => [
                'threat_level' => 'Unknown',
                'kith_requirement' => 90,
                'real_world_analog' => 'Rosalind Franklin',
                'biological_traits' => [
                    ['trait' => 'Role', 'value' => 'Structuralist'],
                    ['trait' => 'Vision', 'value' => 'X-Ray / Microscopic'],
                    ['trait' => 'Obsession', 'value' => 'The Double Helix']
                ]
            ]
        ],
        [
            'title' => 'Lynixes (The Chemist)',
            'category' => 'Character',
            'content' => 'Fascinated by the hyper-oxygenated atmosphere. He understands the chemical bonds that allow the dinosaurs to grow to titan sizes. He gifted Zygo the formula for the "Smokers" as a test of human chemistry.',
            'acf' => [
                'threat_level' => 'Caution',
                'kith_requirement' => 80,
                'real_world_analog' => 'Linus Pauling',
                'biological_traits' => [
                    ['trait' => 'Role', 'value' => 'Chemist'],
                    ['trait' => 'Affinity', 'value' => 'Fire / Oxidation'],
                    ['trait' => 'Obsession', 'value' => 'Molecular Bonds']
                ]
            ]
        ],

        // --- CREATURES ---
        [
            'title' => 'Squaint',
            'category' => 'Creature',
            'content' => 'A blind, vile abomination of the Theropod family found in deep valleys and caves. It hunts purely by scent, capable of smelling blood and flesh from miles away. "Dirty bastards," as Zygo calls them. They are the apex scavengers of the dark.',
            'acf' => [
                'threat_level' => 'Lethal',
                'kith_requirement' => 15,
                'real_world_analog' => 'Naked Mole Rat x T-Rex',
                'biological_traits' => [
                    ['trait' => 'Senses', 'value' => 'Olfactory Overload (Blind)'],
                    ['trait' => 'Habitat', 'value' => 'Purgess Caves'],
                    ['trait' => 'Weakness', 'value' => 'Smoke / Ash']
                ]
            ]
        ],
        [
            'title' => 'The Rayke',
            'category' => 'Creature',
            'content' => 'A massive, untamable reptile often used as a metaphor for impossible tasks ("You have a better chance of riding a Rayke"). Likely a large, heavily armored Herbivore with a temperament so volatile it refuses domestication.',
            'acf' => [
                'threat_level' => 'Lethal',
                'kith_requirement' => 25,
                'real_world_analog' => 'Triceratops / Rhinoceros',
                'biological_traits' => [
                    ['trait' => 'Temperament', 'value' => 'Volatile'],
                    ['trait' => 'Usage', 'value' => 'None (Untamable)'],
                    ['trait' => 'Armor', 'value' => 'Heavy Plating']
                ]
            ]
        ],
        [
            'title' => 'Sky Reaper (Pteros)',
            'category' => 'Creature',
            'content' => 'The silent death from above. They circle the thermal currents of the Cimmerian ridge, waiting for the careless to leave the canopy. Their aerial dance of death is a constant threat to any who venture into the open.',
            'acf' => [
                'threat_level' => 'Lethal',
                'kith_requirement' => 5,
                'real_world_analog' => 'Quetzalcoatlus',
                'biological_traits' => [
                    ['trait' => 'Wingspan', 'value' => '10-12 Meters'],
                    ['trait' => 'Tactic', 'value' => 'Aerial Ambush'],
                    ['trait' => 'Zone', 'value' => 'Twin Straits / Cimmerian Ridge']
                ]
            ]
        ],
        [
            'title' => 'Stryker',
            'category' => 'Creature',
            'content' => 'Igzier’s faithful raptor companion. A pack-hunter separated from his kin, he bonded to Igzier through shared survival in the jungle. Intelligent and loyal, he represents the potential for coexistence between Man and Reaper.',
            'acf' => [
                'threat_level' => 'Caution',
                'kith_requirement' => 25,
                'real_world_analog' => 'Deinonychus',
                'biological_traits' => [
                    ['trait' => 'Intelligence', 'value' => 'High'],
                    ['trait' => 'Status', 'value' => 'Domesticated (Partial)'],
                    ['trait' => 'Bond', 'value' => 'Igzier']
                ]
            ]
        ],
         [
            'title' => 'Ignis-Theropod',
            'category' => 'Creature',
            'content' => 'A predator adapted to the ash-fall. Its scales mimic cooling magma, allowing it to ambush prey near the vents. It does not roar; it hisses like steam escaping a fissure.',
            'acf' => [
                'threat_level' => 'Lethal',
                'kith_requirement' => 20,
                'real_world_analog' => 'Komodo Dragon / Monitor Lizard',
                'biological_traits' => [
                    ['trait' => 'Heat Resistance', 'value' => '900°C'],
                    ['trait' => 'Diet', 'value' => 'Sulfur-based lifeforms'],
                    ['trait' => 'Habitat', 'value' => 'Watcher Mountain Caldera']
                ]
            ]
        ],
        [
            'title' => 'Void-Shell Turtle',
            'category' => 'Creature',
            'content' => 'Massive leatherback ancestors that drift through the deep pelagic zones. Their shells are porous and absorb sonar, making them invisible to the echo-location of Mosasaurs.',
            'acf' => [
                'threat_level' => 'Safe',
                'kith_requirement' => 5,
                'real_world_analog' => 'Protostegidae (Archelon)',
                'biological_traits' => [
                    ['trait' => 'Lifespan', 'value' => '400+ Years'],
                    ['trait' => 'Size', 'value' => '15m Diameter'],
                    ['trait' => 'Role', 'value' => 'Mobile Ecosystem']
                ]
            ]
        ],

        // --- LOCATIONS ---
        [
            'title' => 'Sky City (Tethysia)',
            'category' => 'Location',
            'content' => 'The impenetrable fortress at the southern edge of the Cimmerian Mountains. Powered by Melden\'s algae-biodiesel pumps, it is a paradise of fresh water and light, shielded from the dinosaur hordes by massive walls. But it is a gilded cage.',
            'acf' => [
                'threat_level' => 'Safe (Internal Threat)',
                'kith_requirement' => 5,
                'real_world_analog' => 'Minas Tirith / Wakanda',
                'biological_traits' => [
                    ['trait' => 'Power Source', 'value' => 'Photobioreactors (Algae)'],
                    ['trait' => 'Defense', 'value' => 'The Western Ridge'],
                    ['trait' => 'Rulers', 'value' => 'The Triumvirate']
                ]
            ]
        ],
        [
            'title' => 'The Ironwoods',
            'category' => 'Location',
            'content' => 'A northern forest of mammoth evergreens with high lignin content, making the wood as hard as iron. The Polarians have bored into the trunks to create camouflaged cities safe from large predators. It is the ancestral home of Igzier.',
            'acf' => [
                'threat_level' => 'Caution',
                'kith_requirement' => 30,
                'real_world_analog' => 'Redwood National Park (Hardened)',
                'biological_traits' => [
                    ['trait' => 'Flora', 'value' => 'High-Lignin Pine'],
                    ['trait' => 'Inhabitants', 'value' => 'The Polarians'],
                    ['trait' => 'Defense', 'value' => 'Camouflage / Elevation']
                ]
            ]
        ],
        [
            'title' => 'Purgess Caves',
            'category' => 'Location',
            'content' => 'A toxic purgatory where industrial smog meets volcanic vent gases. The absence of the sun makes it a haven for fungi and blind terrors like the Squaints. Igzier vanished into these depths to escape execution.',
            'acf' => [
                'threat_level' => 'Lethal',
                'kith_requirement' => 40,
                'real_world_analog' => 'Movile Cave, Romania',
                'biological_traits' => [
                    ['trait' => 'Air Quality', 'value' => 'Toxic'],
                    ['trait' => 'Visibility', 'value' => 'Zero'],
                    ['trait' => 'Resident', 'value' => 'The Squaints']
                ]
            ]
        ],
        [
            'title' => 'Fogar Desert',
            'category' => 'Location',
            'content' => 'A barren wasteland where the ancient scrolls were found. It lies in the shadow of the Charr Mountains, receiving little rain but plenty of volcanic ash.',
            'acf' => [
                'threat_level' => 'Lethal',
                'kith_requirement' => 50,
                'real_world_analog' => 'Atacama Desert',
                'biological_traits' => [
                    ['trait' => 'Artifacts', 'value' => 'The First Scrolls'],
                    ['trait' => 'Climate', 'value' => 'Hyper-Arid']
                ]
            ]
        ],
        [
            'title' => 'The Twin Straits of Dier',
            'category' => 'Location',
            'content' => 'The treacherous water passage surrounding Pteros Island. A "suicide mission" to cross due to the violent currents and the nightmarish creatures that inhabit the waters.',
            'acf' => [
                'threat_level' => 'Lethal',
                'kith_requirement' => 50,
                'real_world_analog' => 'Straits of Messina',
                'biological_traits' => [
                    ['trait' => 'Current', 'value' => 'Violent'],
                    ['trait' => 'Fauna', 'value' => 'Mosasaurs'],
                    ['trait' => 'Status', 'value' => 'Navigational Hazard']
                ]
            ]
        ],
        [
            'title' => 'Adrius & Aldyia',
            'category' => 'Location',
            'content' => 'The "Tectonic Terrors" of the Charr Mountains. Adrius is the massive, silent brother. Aldyia is the little sister who erupts frequently, sending smoke "like violent kisses" toward the coast.',
            'acf' => [
                'threat_level' => 'Lethal',
                'kith_requirement' => 40,
                'real_world_analog' => 'Vesuvius / Etna',
                'biological_traits' => [
                    ['trait' => 'Type', 'value' => 'Volcanic Pair'],
                    ['trait' => 'Activity', 'value' => 'Continuous'],
                    ['trait' => 'Atmosphere', 'value' => 'Ash-Heavy']
                ]
            ]
        ],
        
        // --- FACTIONS ---
        [
            'title' => 'The Iron-Binders',
            'category' => 'Faction',
            'content' => 'A scavenger cult residing in the Iron Sands. They believe the flesh is weak and actively replace limbs with scavenged pistons and ceramics found in the ruins.',
            'acf' => [
                'threat_level' => 'Caution',
                'kith_requirement' => 15,
                'real_world_analog' => 'Cargo Cults / Industrial Revolution',
                'biological_traits' => [
                    ['trait' => 'Base', 'value' => 'The Rust Spire'],
                    ['trait' => 'Tech', 'value' => 'Steam & Hydraulic']
                ]
            ]
        ],
        
        // --- RECORDS ---
        [
            'title' => 'The Strange Sunrise',
            'category' => 'Record',
            'content' => 'According to the lost astronomer Byrge, the sun once rose in the middle of the night, hovered for an hour, and set exactly where it rose. This event preceded the arrival of the Nine Visitors.',
            'acf' => [
                'threat_level' => 'Unknown',
                'kith_requirement' => 80,
                'real_world_analog' => 'Celestial Phenomenon',
                'biological_traits' => [
                    ['trait' => 'Source', 'value' => 'Byrge\'s Log'],
                    ['trait' => 'Date', 'value' => 'The Year of the Fire'],
                    ['trait' => 'Implication', 'value' => 'Artificial Manipulation']
                ]
            ]
        ]
    ];