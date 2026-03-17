<?php
/**
 * Plugin Name: Tethys Core
 * Description: Core content model for World of Tethys lore.
 * Version: 0.1.0
 * Author: World of Tethys
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Tethys_Core {
    private const VERSION = '0.1.0';
    private const VERSION_OPTION = 'tethys_core_version';

    private static ?Tethys_Core $instance = null;

    public static function instance(): Tethys_Core {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action('init', [$this, 'register_taxonomies'], 5);
        add_action('init', [$this, 'register_post_types'], 10);
        add_action('init', [$this, 'register_meta_fields'], 20);
    }

    public static function activate(): void {
        $plugin = self::instance();
        $plugin->register_taxonomies();
        $plugin->register_post_types();
        $plugin->register_meta_fields();
        $plugin->seed_default_terms();

        flush_rewrite_rules();
        update_option(self::VERSION_OPTION, self::VERSION);
    }

    public static function deactivate(): void {
        flush_rewrite_rules();
    }

    public function register_post_types(): void {
        $taxonomies = array_keys($this->taxonomy_definitions());

        foreach ($this->post_type_definitions() as $post_type => $config) {
            $labels = [
                'name'                  => $config['plural'],
                'singular_name'         => $config['singular'],
                'menu_name'             => $config['plural'],
                'name_admin_bar'        => $config['singular'],
                'add_new'               => 'Add New',
                'add_new_item'          => 'Add New ' . $config['singular'],
                'new_item'              => 'New ' . $config['singular'],
                'edit_item'             => 'Edit ' . $config['singular'],
                'view_item'             => 'View ' . $config['singular'],
                'all_items'             => 'All ' . $config['plural'],
                'search_items'          => 'Search ' . $config['plural'],
                'not_found'             => 'No ' . strtolower($config['plural']) . ' found',
                'not_found_in_trash'    => 'No ' . strtolower($config['plural']) . ' found in Trash',
                'featured_image'        => $config['singular'] . ' Image',
                'set_featured_image'    => 'Set image',
                'remove_featured_image' => 'Remove image',
                'use_featured_image'    => 'Use as image',
                'archives'              => $config['singular'] . ' Archives',
            ];

            register_post_type(
                $post_type,
                [
                    'labels'             => $labels,
                    'public'             => true,
                    'show_in_rest'       => true,
                    'menu_icon'          => $config['icon'],
                    'has_archive'        => $config['slug'],
                    'rewrite'            => [
                        'slug'       => $config['slug'],
                        'with_front' => false,
                    ],
                    'supports'           => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'author'],
                    'taxonomies'         => $taxonomies,
                    'publicly_queryable' => true,
                    'show_ui'            => true,
                    'show_in_menu'       => true,
                    'show_in_nav_menus'  => true,
                    'show_in_admin_bar'  => true,
                    'hierarchical'       => false,
                    'query_var'          => true,
                    'menu_position'      => 20,
                ]
            );
        }
    }

    public function register_taxonomies(): void {
        foreach ($this->taxonomy_definitions() as $taxonomy => $config) {
            $labels = [
                'name'              => $config['plural'],
                'singular_name'     => $config['singular'],
                'search_items'      => 'Search ' . $config['plural'],
                'all_items'         => 'All ' . $config['plural'],
                'parent_item'       => 'Parent ' . $config['singular'],
                'parent_item_colon' => 'Parent ' . $config['singular'] . ':',
                'edit_item'         => 'Edit ' . $config['singular'],
                'update_item'       => 'Update ' . $config['singular'],
                'add_new_item'      => 'Add New ' . $config['singular'],
                'new_item_name'     => 'New ' . $config['singular'] . ' Name',
                'menu_name'         => $config['plural'],
            ];

            register_taxonomy(
                $taxonomy,
                array_keys($this->post_type_definitions()),
                [
                    'labels'            => $labels,
                    'public'            => true,
                    'show_ui'           => true,
                    'show_admin_column' => true,
                    'show_in_rest'      => true,
                    'hierarchical'      => $config['hierarchical'],
                    'rewrite'           => [
                        'slug'       => $config['slug'],
                        'with_front' => false,
                    ],
                    'query_var'         => true,
                ]
            );
        }
    }

    public function register_meta_fields(): void {
        $meta_fields = [
            'excerpt_short' => [
                'type'              => 'string',
                'single'            => true,
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
                'show_in_rest'      => true,
            ],
            'timeline_start' => [
                'type'              => 'string',
                'single'            => true,
                'default'           => '',
                'sanitize_callback' => [$this, 'sanitize_timeline_value'],
                'show_in_rest'      => true,
            ],
            'timeline_end' => [
                'type'              => 'string',
                'single'            => true,
                'default'           => '',
                'sanitize_callback' => [$this, 'sanitize_timeline_value'],
                'show_in_rest'      => true,
            ],
            'map_enabled' => [
                'type'              => 'boolean',
                'single'            => true,
                'default'           => false,
                'sanitize_callback' => [$this, 'sanitize_boolean_value'],
                'show_in_rest'      => true,
            ],
            'lat' => [
                'type'              => 'number',
                'single'            => true,
                'default'           => 0,
                'sanitize_callback' => [$this, 'sanitize_number_value'],
                'show_in_rest'      => true,
            ],
            'lng' => [
                'type'              => 'number',
                'single'            => true,
                'default'           => 0,
                'sanitize_callback' => [$this, 'sanitize_number_value'],
                'show_in_rest'      => true,
            ],
            'map_zoom' => [
                'type'              => 'number',
                'single'            => true,
                'default'           => 5,
                'sanitize_callback' => [$this, 'sanitize_number_value'],
                'show_in_rest'      => true,
            ],
            'source_story' => [
                'type'              => 'integer',
                'single'            => true,
                'default'           => 0,
                'sanitize_callback' => 'absint',
                'show_in_rest'      => true,
            ],
            'hero_image' => [
                'type'              => 'integer',
                'single'            => true,
                'default'           => 0,
                'sanitize_callback' => 'absint',
                'show_in_rest'      => true,
            ],
            'related_entries' => [
                'type'              => 'array',
                'single'            => true,
                'default'           => [],
                'sanitize_callback' => [$this, 'sanitize_post_id_array'],
                'show_in_rest'      => [
                    'schema' => [
                        'type'  => 'array',
                        'items' => [
                            'type' => 'integer',
                        ],
                    ],
                ],
            ],
        ];

        foreach (array_keys($this->post_type_definitions()) as $post_type) {
            foreach ($meta_fields as $meta_key => $args) {
                $args['auth_callback'] = [$this, 'can_edit_meta'];
                register_post_meta($post_type, $meta_key, $args);
            }
        }
    }

    public function can_edit_meta(
        bool $allowed,
        string $meta_key,
        int $post_id,
        int $user_id,
        string $cap = '',
        array $caps = []
    ): bool {
        if ($post_id > 0) {
            return user_can($user_id, 'edit_post', $post_id);
        }

        return user_can($user_id, 'edit_posts');
    }

    public function sanitize_timeline_value($value): string {
        if (!is_scalar($value)) {
            return '';
        }

        return sanitize_text_field((string) $value);
    }

    public function sanitize_boolean_value($value): bool {
        return rest_sanitize_boolean($value);
    }

    public function sanitize_number_value($value): float {
        return (float) $value;
    }

    public function sanitize_post_id_array($value): array {
        if (!is_array($value)) {
            return [];
        }

        $ids = [];
        foreach ($value as $item) {
            $id = absint($item);
            if ($id > 0) {
                $ids[] = $id;
            }
        }

        return array_values(array_unique($ids));
    }

    private function seed_default_terms(): void {
        $defaults = [
            'canon_tier' => [
                ['Core', 'core'],
                ['Expanded', 'expanded'],
                ['Legend', 'legend'],
            ],
            'spoiler_level' => [
                ['Safe', 'safe'],
                ['Moderate', 'moderate'],
                ['Major', 'major'],
            ],
        ];

        foreach ($defaults as $taxonomy => $terms) {
            foreach ($terms as $term_data) {
                [$name, $slug] = $term_data;

                if (!term_exists($slug, $taxonomy)) {
                    wp_insert_term(
                        $name,
                        $taxonomy,
                        [
                            'slug' => $slug,
                        ]
                    );
                }
            }
        }
    }

    private function post_type_definitions(): array {
        return [
            'character' => [
                'singular' => 'Character',
                'plural'   => 'Characters',
                'slug'     => 'lore/characters',
                'icon'     => 'dashicons-groups',
            ],
            'location' => [
                'singular' => 'Location',
                'plural'   => 'Locations',
                'slug'     => 'lore/locations',
                'icon'     => 'dashicons-location-alt',
            ],
            'faction' => [
                'singular' => 'Faction',
                'plural'   => 'Factions',
                'slug'     => 'lore/factions',
                'icon'     => 'dashicons-shield',
            ],
            'artifact' => [
                'singular' => 'Artifact',
                'plural'   => 'Artifacts',
                'slug'     => 'lore/artifacts',
                'icon'     => 'dashicons-hammer',
            ],
            'event' => [
                'singular' => 'Event',
                'plural'   => 'Events',
                'slug'     => 'lore/events',
                'icon'     => 'dashicons-calendar-alt',
            ],
            'story' => [
                'singular' => 'Story',
                'plural'   => 'Stories',
                'slug'     => 'lore/stories',
                'icon'     => 'dashicons-book',
            ],
        ];
    }

    private function taxonomy_definitions(): array {
        return [
            'era' => [
                'singular'     => 'Era',
                'plural'       => 'Eras',
                'slug'         => 'timeline',
                'hierarchical' => false,
            ],
            'region' => [
                'singular'     => 'Region',
                'plural'       => 'Regions',
                'slug'         => 'region',
                'hierarchical' => true,
            ],
            'canon_tier' => [
                'singular'     => 'Canon Tier',
                'plural'       => 'Canon Tiers',
                'slug'         => 'canon-tier',
                'hierarchical' => false,
            ],
            'theme' => [
                'singular'     => 'Theme',
                'plural'       => 'Themes',
                'slug'         => 'theme',
                'hierarchical' => false,
            ],
            'spoiler_level' => [
                'singular'     => 'Spoiler Level',
                'plural'       => 'Spoiler Levels',
                'slug'         => 'spoiler-level',
                'hierarchical' => false,
            ],
        ];
    }
}

Tethys_Core::instance();

register_activation_hook(__FILE__, ['Tethys_Core', 'activate']);
register_deactivation_hook(__FILE__, ['Tethys_Core', 'deactivate']);
