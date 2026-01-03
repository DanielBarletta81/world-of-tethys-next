<?php
/*
Plugin Name: Tethys Data Seeder
Description: Populate archive entries from bundled lore and allow authenticated explorers to seed new records via proxy data.
Version: 1.3
Author: World of Tethys
*/

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', 'tethys_seed_static_entries', 99);
add_action('rest_api_init', 'tethys_register_seed_endpoint');

function tethys_seed_static_entries() {
    // One-time seed gate
    if (get_option('tethys_seeded_v1_3')) {
        return;
    }

    // Ensure CPT is available
    if (!post_type_exists('archive_entry')) {
        error_log('Tethys Seeder Error: Post Type "archive_entry" not found. Is the Schema plugin active?');
        return;
    }

    // Load bundled entries
    $seeder_path = __DIR__ . '/tethys-seeder.php';
    if (!file_exists($seeder_path)) {
        error_log('Tethys Seeder Error: tethys-seeder.php missing.');
        return;
    }
    $entries = require $seeder_path;
    if (!is_array($entries)) {
        error_log('Tethys Seeder Error: Seeder file did not return an array.');
        return;
    }

    foreach ($entries as $entry) {
        if (empty($entry['title'])) {
            continue;
        }

        // Skip if already exists
        $existing = get_page_by_title($entry['title'], OBJECT, 'archive_entry');
        if ($existing) {
            continue;
        }

        $post_id = wp_insert_post([
            'post_title'   => sanitize_text_field($entry['title']),
            'post_content' => wp_kses_post($entry['content'] ?? ''),
            'post_type'    => 'archive_entry',
            'post_status'  => 'publish',
        ]);

        if ($post_id && !is_wp_error($post_id)) {
            if (!empty($entry['category'])) {
                wp_set_object_terms($post_id, sanitize_text_field($entry['category']), 'archive_category');
            }

            if (function_exists('update_field') && !empty($entry['acf'])) {
                $acf = $entry['acf'];
                if (isset($acf['threat_level'])) {
                    update_field('threat_level', sanitize_text_field($acf['threat_level']), $post_id);
                }
                if (isset($acf['kith_requirement'])) {
                    update_field('kith_requirement', (int) $acf['kith_requirement'], $post_id);
                }
                if (isset($acf['real_world_analog'])) {
                    update_field('real_world_analog', sanitize_text_field($acf['real_world_analog']), $post_id);
                }
                if (!empty($acf['biological_traits']) && is_array($acf['biological_traits'])) {
                    $clean_traits = [];
                    foreach ($acf['biological_traits'] as $trait) {
                        $clean_traits[] = [
                            'trait' => sanitize_text_field($trait['trait'] ?? ''),
                            'value' => sanitize_text_field($trait['value'] ?? ''),
                        ];
                    }
                    update_field('biological_traits', $clean_traits, $post_id);
                }
            }
        }
    }

    update_option('tethys_seeded_v1_3', true);
}

/**
 * Allow authenticated users to seed a new archive entry via REST.
 * This can be called from your front-end after pulling scientific data from a proxy API.
 */
function tethys_register_seed_endpoint() {
    register_rest_route('tethys/v1', '/seed-proxy', [
        'methods'             => 'POST',
        // Allow guests; rate limit and validate inside callback
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $request) {
            // Simple rate limit per IP (5 seeds / hour)
            $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : 'anon';
            $key = 'tethys_seed_rl_' . md5($ip);
            $count = (int) get_transient($key);
            if ($count >= 5) {
                return new WP_REST_Response(['error' => 'Rate limit reached. Try again later.'], 429);
            }

            $title   = sanitize_text_field($request->get_param('title'));
            $content = wp_kses_post($request->get_param('content'));
            $category = sanitize_text_field($request->get_param('category') ?: 'Field Report');
            $threat  = sanitize_text_field($request->get_param('threat_level') ?: 'Unknown');
            $kith    = (int) $request->get_param('kith_requirement') ?: 0;
            $analog  = sanitize_text_field($request->get_param('real_world_analog') ?: 'Explorer Proxy');

            if (empty($title)) {
                return new WP_REST_Response(['error' => 'Missing title'], 400);
            }

            $existing = get_page_by_title($title, OBJECT, 'archive_entry');
            if ($existing) {
                return new WP_REST_Response(['error' => 'Entry already exists'], 409);
            }

            $post_id = wp_insert_post([
                'post_title'   => $title,
                'post_content' => $content,
                'post_type'    => 'archive_entry',
                'post_status'  => 'publish',
            ]);

            if (is_wp_error($post_id)) {
                return new WP_REST_Response(['error' => $post_id->get_error_message()], 500);
            }

            wp_set_object_terms($post_id, $category, 'archive_category');

            if (function_exists('update_field')) {
                update_field('threat_level', $threat, $post_id);
                update_field('kith_requirement', $kith, $post_id);
                update_field('real_world_analog', $analog, $post_id);
            }

            // increment rate limit counter (1 hour)
            set_transient($key, $count + 1, HOUR_IN_SECONDS);

            return new WP_REST_Response(['success' => true, 'id' => $post_id], 201);
        },
    ]);
}
