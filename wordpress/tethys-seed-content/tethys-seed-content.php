<?php
/**
 * Plugin Name: Tethys Seed Content
 * Description: Import lore entries into Tethys Core post types from JSON or CSV.
 * Version: 0.1.0
 * Author: World of Tethys
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Tethys_Seed_Content {
    private const MENU_SLUG = 'tethys-seed-content';
    private const RESULT_TRANSIENT = 'tethys_seed_content_result';
    private const LAST_CONFIG_OPTION = 'tethys_seed_content_last_config';

    private array $supported_post_types = [
        'character',
        'location',
        'faction',
        'artifact',
        'event',
        'story',
    ];

    private array $supported_taxonomies = [
        'era',
        'region',
        'canon_tier',
        'theme',
        'spoiler_level',
    ];

    public static function boot(): void {
        static $instance = null;

        if ($instance === null) {
            $instance = new self();
        }
    }

    private function __construct() {
        add_action('admin_menu', [$this, 'register_admin_page']);
        add_action('admin_post_tethys_seed_content_import', [$this, 'handle_import']);
    }

    public function register_admin_page(): void {
        add_management_page(
            'Tethys Seed Content',
            'Tethys Seed Content',
            'manage_options',
            self::MENU_SLUG,
            [$this, 'render_admin_page']
        );
    }

    public function render_admin_page(): void {
        if (!current_user_can('manage_options')) {
            wp_die('You are not allowed to access this page.');
        }

        $config = wp_parse_args(get_option(self::LAST_CONFIG_OPTION, []), $this->default_config());
        $result = get_transient(self::RESULT_TRANSIENT);
        delete_transient(self::RESULT_TRANSIENT);

        $source_type = esc_attr($config['source_type']);
        $default_post_type = esc_attr($config['default_post_type']);
        $delimiter = esc_attr($config['delimiter']);
        $update_existing = !empty($config['update_existing']);
        $dry_run = !empty($config['dry_run']);

        echo '<div class="wrap">';
        echo '<h1>Tethys Seed Content</h1>';
        echo '<p>Import lore content from JSON or CSV and map it to Tethys Core post types, taxonomies, and meta fields.</p>';

        if (is_array($result)) {
            $this->render_result($result);
        }

        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '" enctype="multipart/form-data">';
        wp_nonce_field('tethys_seed_content_import');
        echo '<input type="hidden" name="action" value="tethys_seed_content_import" />';

        echo '<table class="form-table" role="presentation">';
        echo '<tbody>';

        echo '<tr>';
        echo '<th scope="row"><label for="source_type">Source Type</label></th>';
        echo '<td>';
        echo '<select name="source_type" id="source_type">';
        echo '<option value="auto" ' . selected($source_type, 'auto', false) . '>Auto detect</option>';
        echo '<option value="json" ' . selected($source_type, 'json', false) . '>JSON</option>';
        echo '<option value="csv" ' . selected($source_type, 'csv', false) . '>CSV</option>';
        echo '</select>';
        echo '<p class="description">If you provide both JSON text and a file upload, JSON text wins.</p>';
        echo '</td>';
        echo '</tr>';

        echo '<tr>';
        echo '<th scope="row"><label for="default_post_type">Default Post Type</label></th>';
        echo '<td>';
        echo '<select name="default_post_type" id="default_post_type">';
        echo '<option value="">None</option>';
        foreach ($this->supported_post_types as $post_type) {
            echo '<option value="' . esc_attr($post_type) . '" ' . selected($default_post_type, $post_type, false) . '>' . esc_html($post_type) . '</option>';
        }
        echo '</select>';
        echo '<p class="description">Used only when a row does not define <code>post_type</code>.</p>';
        echo '</td>';
        echo '</tr>';

        echo '<tr>';
        echo '<th scope="row"><label for="delimiter">List Delimiter</label></th>';
        echo '<td>';
        echo '<input type="text" id="delimiter" name="delimiter" class="regular-text" maxlength="1" value="' . $delimiter . '" />';
        echo '<p class="description">Used for taxonomy and related entry lists. Commas are always accepted.</p>';
        echo '</td>';
        echo '</tr>';

        echo '<tr>';
        echo '<th scope="row">Behavior</th>';
        echo '<td>';
        echo '<label><input type="checkbox" name="update_existing" value="1" ' . checked($update_existing, true, false) . ' /> Update existing rows matched by slug + post type</label><br />';
        echo '<label><input type="checkbox" name="dry_run" value="1" ' . checked($dry_run, true, false) . ' /> Dry run only (no writes)</label>';
        echo '</td>';
        echo '</tr>';

        echo '<tr>';
        echo '<th scope="row"><label for="json_payload">JSON Payload</label></th>';
        echo '<td>';
        echo '<textarea id="json_payload" name="json_payload" rows="12" class="large-text code"></textarea>';
        echo '<p class="description">Paste JSON array of records. If provided, this is imported instead of file upload.</p>';
        echo '</td>';
        echo '</tr>';

        echo '<tr>';
        echo '<th scope="row"><label for="import_file">Upload File</label></th>';
        echo '<td>';
        echo '<input type="file" id="import_file" name="import_file" accept=".json,.csv,text/csv,application/json" />';
        echo '<p class="description">Supported: CSV or JSON.</p>';
        echo '</td>';
        echo '</tr>';

        echo '</tbody>';
        echo '</table>';

        submit_button('Run Import');
        echo '</form>';

        echo '<h2>Accepted Columns / Keys</h2>';
        echo '<p><code>post_type,title,slug,content,excerpt,status,era,region,canon_tier,theme,spoiler_level,timeline_start,timeline_end,map_enabled,lat,lng,map_zoom,source_story,hero_image,related_entries</code></p>';
        echo '<p><code>related_entries</code> can include IDs or slugs. <code>source_story</code> accepts story ID or story slug.</p>';

        echo '</div>';
    }

    private function render_result(array $result): void {
        $class = !empty($result['errors']) ? 'notice notice-warning' : 'notice notice-success';
        $source = esc_html($result['source'] ?? 'unknown');

        echo '<div class="' . esc_attr($class) . '"><p>';
        echo '<strong>Import complete.</strong> Source: ' . $source . '. ';
        echo 'Processed: ' . intval($result['processed'] ?? 0) . '. ';
        echo 'Created: ' . intval($result['created'] ?? 0) . '. ';
        echo 'Updated: ' . intval($result['updated'] ?? 0) . '. ';
        echo 'Skipped: ' . intval($result['skipped'] ?? 0) . '. ';
        echo 'Errors: ' . intval($result['errors'] ?? 0) . '.';
        echo '</p></div>';

        if (!empty($result['messages']) && is_array($result['messages'])) {
            echo '<h2>Row Details</h2>';
            echo '<table class="widefat striped">';
            echo '<thead><tr><th>Row</th><th>Status</th><th>Message</th></tr></thead>';
            echo '<tbody>';
            foreach ($result['messages'] as $row_message) {
                echo '<tr>';
                echo '<td>' . intval($row_message['row']) . '</td>';
                echo '<td>' . esc_html($row_message['status']) . '</td>';
                echo '<td>' . esc_html($row_message['message']) . '</td>';
                echo '</tr>';
            }
            echo '</tbody></table>';
        }
    }

    public function handle_import(): void {
        if (!current_user_can('manage_options')) {
            wp_die('You are not allowed to perform imports.', 403);
        }

        check_admin_referer('tethys_seed_content_import');

        $config = [
            'source_type'     => $this->sanitize_source_type($_POST['source_type'] ?? 'auto'),
            'default_post_type' => sanitize_key(wp_unslash($_POST['default_post_type'] ?? '')),
            'delimiter'       => $this->sanitize_delimiter($_POST['delimiter'] ?? '|'),
            'update_existing' => !empty($_POST['update_existing']),
            'dry_run'         => !empty($_POST['dry_run']),
        ];

        update_option(self::LAST_CONFIG_OPTION, $config, false);

        $payload_result = $this->resolve_payload($config['source_type']);
        if (is_wp_error($payload_result)) {
            $this->store_result_and_redirect([
                'source'    => 'none',
                'processed' => 0,
                'created'   => 0,
                'updated'   => 0,
                'skipped'   => 0,
                'errors'    => 1,
                'messages'  => [[
                    'row'     => 0,
                    'status'  => 'error',
                    'message' => $payload_result->get_error_message(),
                ]],
            ]);
        }

        $result = $this->run_import($payload_result['records'], $payload_result['source'], $config);
        $this->store_result_and_redirect($result);
    }

    private function store_result_and_redirect(array $result): void {
        set_transient(self::RESULT_TRANSIENT, $result, 300);
        wp_safe_redirect(admin_url('tools.php?page=' . self::MENU_SLUG));
        exit;
    }

    private function resolve_payload(string $source_type) {
        $json_payload = trim((string) wp_unslash($_POST['json_payload'] ?? ''));
        if ($json_payload !== '') {
            $records = $this->parse_json_payload($json_payload);
            if (is_wp_error($records)) {
                return $records;
            }

            return [
                'source'  => 'json',
                'records' => $records,
            ];
        }

        if (empty($_FILES['import_file']) || !is_array($_FILES['import_file'])) {
            return new WP_Error('tethys_import_missing_input', 'Provide JSON payload or upload a CSV/JSON file.');
        }

        $file = $_FILES['import_file'];
        if (!empty($file['error'])) {
            return new WP_Error('tethys_import_upload_error', 'File upload failed with code ' . intval($file['error']) . '.');
        }

        $tmp_name = $file['tmp_name'] ?? '';
        if (!is_string($tmp_name) || $tmp_name === '' || !is_uploaded_file($tmp_name)) {
            return new WP_Error('tethys_import_invalid_upload', 'Uploaded file is not valid.');
        }

        $raw = file_get_contents($tmp_name);
        if (!is_string($raw) || $raw === '') {
            return new WP_Error('tethys_import_empty_file', 'Uploaded file is empty.');
        }

        $filename = sanitize_file_name((string) ($file['name'] ?? ''));
        $detected = $this->detect_source_type($source_type, $filename);

        if ($detected === 'json') {
            $records = $this->parse_json_payload($raw);
        } else {
            $records = $this->parse_csv_payload($raw);
        }

        if (is_wp_error($records)) {
            return $records;
        }

        return [
            'source'  => $detected,
            'records' => $records,
        ];
    }

    private function parse_json_payload(string $raw) {
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return new WP_Error('tethys_import_json_invalid', 'JSON payload must decode to an array or object.');
        }

        if (array_key_exists('records', $decoded) && is_array($decoded['records'])) {
            $decoded = $decoded['records'];
        }

        if ($this->is_associative_array($decoded)) {
            $decoded = [$decoded];
        }

        $records = [];
        foreach ($decoded as $row) {
            if (is_array($row)) {
                $records[] = $this->normalize_array_keys($row);
            }
        }

        if (count($records) === 0) {
            return new WP_Error('tethys_import_json_empty', 'JSON payload did not contain any importable records.');
        }

        return $records;
    }

    private function parse_csv_payload(string $raw) {
        $stream = fopen('php://temp', 'r+');
        if (!is_resource($stream)) {
            return new WP_Error('tethys_import_csv_stream', 'Could not open temporary CSV stream.');
        }

        fwrite($stream, $raw);
        rewind($stream);

        $headers = fgetcsv($stream);
        if (!is_array($headers) || count($headers) === 0) {
            fclose($stream);
            return new WP_Error('tethys_import_csv_headers', 'CSV must include a header row.');
        }

        $normalized_headers = [];
        foreach ($headers as $header) {
            $normalized_headers[] = $this->normalize_header((string) $header);
        }

        $records = [];
        while (($row = fgetcsv($stream)) !== false) {
            if (!is_array($row)) {
                continue;
            }

            $assoc = [];
            $has_value = false;

            foreach ($normalized_headers as $index => $key) {
                $value = isset($row[$index]) ? trim((string) $row[$index]) : '';
                if ($value !== '') {
                    $has_value = true;
                }
                $assoc[$key] = $value;
            }

            if ($has_value) {
                $records[] = $assoc;
            }
        }

        fclose($stream);

        if (count($records) === 0) {
            return new WP_Error('tethys_import_csv_empty', 'CSV did not contain any data rows.');
        }

        return $records;
    }

    private function run_import(array $records, string $source, array $config): array {
        $result = [
            'source'    => $source,
            'processed' => 0,
            'created'   => 0,
            'updated'   => 0,
            'skipped'   => 0,
            'errors'    => 0,
            'messages'  => [],
        ];

        foreach ($records as $index => $record) {
            $row_number = $index + 1;
            $normalized_record = $this->normalize_record($record, $config['default_post_type'], $config['delimiter']);

            if (is_wp_error($normalized_record)) {
                $result['errors']++;
                $result['messages'][] = [
                    'row'     => $row_number,
                    'status'  => 'error',
                    'message' => $normalized_record->get_error_message(),
                ];
                continue;
            }

            $row_result = $this->import_record($normalized_record, $config);
            $result['processed']++;

            if ($row_result['status'] === 'created') {
                $result['created']++;
            } elseif ($row_result['status'] === 'updated') {
                $result['updated']++;
            } elseif ($row_result['status'] === 'skipped') {
                $result['skipped']++;
            } else {
                $result['errors']++;
            }

            $result['messages'][] = [
                'row'     => $row_number,
                'status'  => $row_result['status'],
                'message' => $row_result['message'],
            ];
        }

        return $result;
    }

    private function normalize_record(array $record, string $default_post_type, string $delimiter) {
        $record = $this->normalize_array_keys($record);

        $post_type = sanitize_key((string) ($record['post_type'] ?? $record['type'] ?? $default_post_type));
        if ($post_type === '') {
            return new WP_Error('tethys_import_record_post_type', 'Missing post_type.');
        }

        $title = sanitize_text_field((string) ($record['title'] ?? ''));
        if ($title === '') {
            return new WP_Error('tethys_import_record_title', 'Missing title.');
        }

        $slug_input = (string) ($record['slug'] ?? '');
        $slug = sanitize_title($slug_input !== '' ? $slug_input : $title);

        $status = sanitize_key((string) ($record['status'] ?? 'publish'));
        if (!in_array($status, ['publish', 'draft', 'pending', 'private'], true)) {
            $status = 'publish';
        }

        $taxonomies = [];
        foreach ($this->supported_taxonomies as $taxonomy) {
            $raw_value = $record[$taxonomy] ?? $record[str_replace('_', '-', $taxonomy)] ?? '';
            $taxonomies[$taxonomy] = $this->tokenize_list($raw_value, $delimiter);
        }

        $related_raw = $record['related_entries'] ?? $record['related_slugs'] ?? '';

        return [
            'post_type'      => $post_type,
            'title'          => $title,
            'slug'           => $slug,
            'content'        => wp_kses_post((string) ($record['content'] ?? $record['body'] ?? '')),
            'excerpt'        => sanitize_text_field((string) ($record['excerpt'] ?? '')),
            'status'         => $status,
            'taxonomies'     => $taxonomies,
            'meta'           => [
                'excerpt_short' => sanitize_text_field((string) ($record['excerpt_short'] ?? $record['excerpt'] ?? '')),
                'timeline_start' => sanitize_text_field((string) ($record['timeline_start'] ?? '')),
                'timeline_end' => sanitize_text_field((string) ($record['timeline_end'] ?? '')),
                'map_enabled' => $this->normalize_boolean($record['map_enabled'] ?? false),
                'lat' => $this->normalize_number($record['lat'] ?? 0),
                'lng' => $this->normalize_number($record['lng'] ?? 0),
                'map_zoom' => $this->normalize_number($record['map_zoom'] ?? 5),
                'source_story' => $record['source_story'] ?? '',
                'hero_image' => absint($record['hero_image'] ?? 0),
                'related_entries' => $this->tokenize_list($related_raw, $delimiter),
            ],
        ];
    }

    private function import_record(array $record, array $config): array {
        if (!post_type_exists($record['post_type'])) {
            return [
                'status'  => 'error',
                'message' => 'Post type does not exist: ' . $record['post_type'],
            ];
        }

        $existing = get_page_by_path($record['slug'], OBJECT, $record['post_type']);
        $is_update = ($existing instanceof WP_Post);

        if ($is_update && !$config['update_existing']) {
            return [
                'status'  => 'skipped',
                'message' => 'Skipped existing entry: ' . $record['post_type'] . '/' . $record['slug'],
            ];
        }

        if ($config['dry_run']) {
            return [
                'status'  => $is_update ? 'updated' : 'created',
                'message' => '[Dry run] ' . ($is_update ? 'Would update ' : 'Would create ') . $record['post_type'] . '/' . $record['slug'],
            ];
        }

        $postarr = [
            'post_type'    => $record['post_type'],
            'post_title'   => $record['title'],
            'post_name'    => $record['slug'],
            'post_content' => $record['content'],
            'post_excerpt' => $record['excerpt'],
            'post_status'  => $record['status'],
        ];

        if ($is_update) {
            $postarr['ID'] = $existing->ID;
        }

        $post_id = wp_insert_post($postarr, true);
        if (is_wp_error($post_id)) {
            return [
                'status'  => 'error',
                'message' => $post_id->get_error_message(),
            ];
        }

        foreach ($record['taxonomies'] as $taxonomy => $tokens) {
            if (!taxonomy_exists($taxonomy)) {
                continue;
            }

            $term_ids = $this->resolve_term_ids($taxonomy, $tokens);
            if (!empty($term_ids)) {
                wp_set_object_terms($post_id, $term_ids, $taxonomy, false);
            }
        }

        update_post_meta($post_id, 'excerpt_short', $record['meta']['excerpt_short']);
        update_post_meta($post_id, 'timeline_start', $record['meta']['timeline_start']);
        update_post_meta($post_id, 'timeline_end', $record['meta']['timeline_end']);
        update_post_meta($post_id, 'map_enabled', $record['meta']['map_enabled']);
        update_post_meta($post_id, 'lat', $record['meta']['lat']);
        update_post_meta($post_id, 'lng', $record['meta']['lng']);
        update_post_meta($post_id, 'map_zoom', $record['meta']['map_zoom']);

        $source_story_id = $this->resolve_story_reference($record['meta']['source_story']);
        update_post_meta($post_id, 'source_story', $source_story_id);

        $hero_image_id = absint($record['meta']['hero_image']);
        update_post_meta($post_id, 'hero_image', $hero_image_id);
        if ($hero_image_id > 0 && get_post_type($hero_image_id) === 'attachment') {
            set_post_thumbnail($post_id, $hero_image_id);
        }

        $related_entry_ids = $this->resolve_related_entries($record['meta']['related_entries']);
        update_post_meta($post_id, 'related_entries', $related_entry_ids);

        return [
            'status'  => $is_update ? 'updated' : 'created',
            'message' => ($is_update ? 'Updated ' : 'Created ') . $record['post_type'] . '/' . $record['slug'] . ' (ID ' . $post_id . ')',
        ];
    }

    private function resolve_term_ids(string $taxonomy, array $tokens): array {
        $term_ids = [];

        foreach ($tokens as $token) {
            $token = trim((string) $token);
            if ($token === '') {
                continue;
            }

            if (is_numeric($token)) {
                $term = get_term((int) $token, $taxonomy);
                if ($term instanceof WP_Term) {
                    $term_ids[] = (int) $term->term_id;
                    continue;
                }
            }

            $slug = sanitize_title($token);
            $existing = get_term_by('slug', $slug, $taxonomy);
            if ($existing instanceof WP_Term) {
                $term_ids[] = (int) $existing->term_id;
                continue;
            }

            $created = wp_insert_term($token, $taxonomy, ['slug' => $slug]);
            if (!is_wp_error($created) && !empty($created['term_id'])) {
                $term_ids[] = (int) $created['term_id'];
            }
        }

        return array_values(array_unique(array_map('intval', $term_ids)));
    }

    private function resolve_story_reference($value): int {
        if (is_numeric($value)) {
            $id = absint($value);
            if ($id > 0 && get_post_type($id) === 'story') {
                return $id;
            }
        }

        $slug = sanitize_title((string) $value);
        if ($slug === '') {
            return 0;
        }

        $posts = get_posts([
            'name'           => $slug,
            'post_type'      => 'story',
            'post_status'    => 'any',
            'numberposts'    => 1,
            'fields'         => 'ids',
            'suppress_filters' => true,
        ]);

        return !empty($posts) ? (int) $posts[0] : 0;
    }

    private function resolve_related_entries(array $tokens): array {
        $ids = [];

        foreach ($tokens as $token) {
            $token = trim((string) $token);
            if ($token === '') {
                continue;
            }

            if (is_numeric($token)) {
                $id = absint($token);
                if ($id > 0) {
                    $post = get_post($id);
                    if ($post instanceof WP_Post) {
                        $ids[] = $id;
                    }
                }
                continue;
            }

            $slug = sanitize_title($token);
            if ($slug === '') {
                continue;
            }

            $posts = get_posts([
                'name'           => $slug,
                'post_type'      => $this->supported_post_types,
                'post_status'    => 'any',
                'numberposts'    => 1,
                'fields'         => 'ids',
                'suppress_filters' => true,
            ]);

            if (!empty($posts)) {
                $ids[] = (int) $posts[0];
            }
        }

        return array_values(array_unique(array_map('intval', $ids)));
    }

    private function tokenize_list($value, string $delimiter): array {
        if (is_array($value)) {
            $values = $value;
        } else {
            $normalized = (string) $value;
            $delimiters = ',';
            if ($delimiter !== '' && $delimiter !== ',') {
                $delimiters .= preg_quote($delimiter, '/');
            }
            $values = preg_split('/[' . $delimiters . ']/', $normalized) ?: [];
        }

        $tokens = [];
        foreach ($values as $item) {
            $token = trim((string) $item);
            if ($token !== '') {
                $tokens[] = $token;
            }
        }

        return array_values(array_unique($tokens));
    }

    private function normalize_array_keys(array $value): array {
        $normalized = [];
        foreach ($value as $key => $item) {
            if (!is_string($key)) {
                continue;
            }
            $normalized[$this->normalize_header($key)] = $item;
        }

        return $normalized;
    }

    private function normalize_header(string $header): string {
        $header = strtolower(trim($header));
        $header = str_replace([' ', '-', '.'], '_', $header);
        return preg_replace('/[^a-z0-9_]/', '', $header) ?: '';
    }

    private function normalize_boolean($value): bool {
        if (is_bool($value)) {
            return $value;
        }

        $normalized = strtolower(trim((string) $value));
        return in_array($normalized, ['1', 'true', 'yes', 'on'], true);
    }

    private function normalize_number($value): float {
        if (!is_numeric($value)) {
            return 0.0;
        }

        return (float) $value;
    }

    private function sanitize_source_type($value): string {
        $source_type = sanitize_key(wp_unslash($value));
        if (!in_array($source_type, ['auto', 'json', 'csv'], true)) {
            return 'auto';
        }

        return $source_type;
    }

    private function sanitize_delimiter($value): string {
        $raw = trim((string) wp_unslash($value));
        if ($raw === '') {
            return '|';
        }

        return substr($raw, 0, 1);
    }

    private function detect_source_type(string $requested, string $filename): string {
        if (in_array($requested, ['json', 'csv'], true)) {
            return $requested;
        }

        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if ($extension === 'json') {
            return 'json';
        }

        return 'csv';
    }

    private function default_config(): array {
        return [
            'source_type' => 'auto',
            'default_post_type' => '',
            'delimiter' => '|',
            'update_existing' => true,
            'dry_run' => false,
        ];
    }

    private function is_associative_array(array $array): bool {
        if ($array === []) {
            return false;
        }

        return array_keys($array) !== range(0, count($array) - 1);
    }
}

Tethys_Seed_Content::boot();
