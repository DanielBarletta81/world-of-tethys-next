<?php
/*
Plugin Name: Tethys Data Seeder
Description: One-click population of Lore, Creatures, and Factions. Activates on plugin load.
Version: 1.0
Author: World of Tethys Architect - D.C. Barletta
*/

function tethys_seed_database() {
    // 1. Check if we've already seeded to prevent duplicates
    if (get_option('tethys_data_seeded')) {
        return;
    }

    // --- THE RAD DATA ---
    $entries = [
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
        [
            'title' => 'The Iron-Binders',
            'category' => 'Faction',
            'content' => 'A scavenger cult residing in the Iron Sands. They believe the flesh is weak and actively replace limbs with scavenged pistons and ceramics found in the ruins.',
            'acf' => [
                'threat_level' => 'Caution',
                'kith_requirement' => 15,
                'real_world_analog' => 'Cargo Cults / Industrial Revolution',
                'biological_traits' => [
                    ['trait' => 'Base of Operations', 'value' => 'The Rust Spire'],
                    ['trait' => 'Technology', 'value' => 'Steam & Hydraulic'],
                    ['trait' => 'Allegiance', 'value' => 'None']
                ]
            ]
        ],
        [
            'title' => 'The Root-Walkers',
            'category' => 'Faction',
            'content' => 'Symbiotes of the Mystic Woods. They allow the bioluminescent mycelium to thread through their nervous systems, granting them a hive-mind connection to the forest.',
            'acf' => [
                'threat_level' => 'Caution',
                'kith_requirement' => 35,
                'real_world_analog' => 'Mycorrhizal Networks',
                'biological_traits' => [
                    ['trait' => 'Base of Operations', 'value' => 'The Vernal Core'],
                    ['trait' => 'Ability', 'value' => 'Photosynthetic Skin'],
                    ['trait' => 'Leader', 'value' => 'Ravel (Disputed)']
                ]
            ]
        ],
        [
            'title' => 'The Churn (Salinity Shift)',
            'category' => 'Science',
            'content' => 'The violent mixing zone where the fresh water of the Danian River crashes into the hyper-saline Tethys Ocean. The density difference creates a wall of turbulence that traps nutrients and corpses.',
            'acf' => [
                'threat_level' => 'Lethal',
                'kith_requirement' => 50,
                'real_world_analog' => 'Amazon River Plume / Halocline',
                'biological_traits' => [
                    ['trait' => 'Salinity Gradient', 'value' => '0.5ppt to 35ppt'],
                    ['trait' => 'Danger', 'value' => 'Vortex Currents'],
                    ['trait' => 'Resource', 'value' => 'High Biomass Accumulation']
                ]
            ]
        ]
    ];

    // --- THE INSERTION LOGIC ---
    
    foreach ($entries as $entry) {
        // 1. Create the Post
        $post_id = wp_insert_post([
            'post_title'    => $entry['title'],
            'post_content'  => $entry['content'],
            'post_status'   => 'publish',
            'post_type'     => 'archive_entry', // Ensure this matches your CPT registration
        ]);

        if ($post_id) {
            // 2. Set Taxonomy (Category)
            wp_set_object_terms($post_id, $entry['category'], 'archive_category');

            // 3. Set ACF Fields
            update_field('threat_level', $entry['acf']['threat_level'], $post_id);
            update_field('kith_requirement', $entry['acf']['kith_requirement'], $post_id);
            update_field('real_world_analog', $entry['acf']['real_world_analog'], $post_id);
            update_field('biological_traits', $entry['acf']['biological_traits'], $post_id);
        }
    }

    // Mark as done so it doesn't run again on page refresh
    update_option('tethys_data_seeded', true);
}

// Run logic when plugin is activated
register_activation_hook(__FILE__, 'tethys_seed_database');