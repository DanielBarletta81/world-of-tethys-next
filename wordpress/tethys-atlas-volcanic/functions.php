<?php
/**
 * Tethys Atlas Volcanic — functions.php
 * Headless CMS theme for World of Tethys Atlas
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

// ── Theme support ──────────────────────────────────────────────────────────
add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', [
		'height'      => 60,
		'width'       => 200,
		'flex-height' => true,
		'flex-width'  => true,
	] );
	add_theme_support( 'html5', [
		'comment-list', 'comment-form', 'search-form',
		'gallery', 'caption', 'style', 'script',
	] );
	add_theme_support( 'editor-color-palette', [
		[ 'name' => 'Sulfur',     'slug' => 'sulfur',     'color' => '#c9a227' ],
		[ 'name' => 'Lava',       'slug' => 'lava',       'color' => '#c2410c' ],
		[ 'name' => 'Basalt',     'slug' => 'basalt',     'color' => '#0f0d04' ],
		[ 'name' => 'Ash',        'slug' => 'ash',        'color' => '#d4cbb8' ],
		[ 'name' => 'Gas',        'slug' => 'gas',        'color' => '#6b8a14' ],
	] );

	register_nav_menus( [
		'primary' => __( 'Primary Navigation', 'tethys-atlas-volcanic' ),
		'footer'  => __( 'Footer Navigation',  'tethys-atlas-volcanic' ),
	] );
} );

// ── Enqueue styles ─────────────────────────────────────────────────────────
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'tethys-atlas-volcanic',
		get_stylesheet_uri(),
		[],
		wp_get_theme()->get( 'Version' )
	);
} );

// ── Strip unnecessary WP head bloat (headless) ───────────────────────────
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );

// ── REST API: CORS headers for Next.js frontend ───────────────────────────
add_action( 'rest_api_init', function () {
	remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
	add_filter( 'rest_pre_serve_request', function ( $value ) {
		$allowed_origins = array_filter( [
			'https://atlas.worldoftethys.com',
			'https://worldoftethys.com',
			getenv( 'NEXT_PUBLIC_ATLAS_SITE_URL' ),
			getenv( 'NEXT_PUBLIC_WORLD_SITE_URL' ),
			// Dev origins
			'http://localhost:3000',
			'http://localhost:3001',
		] );

		$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

		if ( in_array( $origin, $allowed_origins, true ) ) {
			header( 'Access-Control-Allow-Origin: '  . esc_url_raw( $origin ) );
		} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			// Allow all origins in debug mode
			header( 'Access-Control-Allow-Origin: *' );
		}

		header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
		header( 'Access-Control-Allow-Credentials: true' );
		header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );
		return $value;
	} );
}, 15 );

// ── REST API: expose required fields on post types ────────────────────────
add_action( 'rest_api_init', function () {
	// Expose featured image source URL directly on posts
	register_rest_field(
		[ 'post', 'archival_post', 'tethys_event' ],
		'featured_image_url',
		[
			'get_callback' => function ( $object ) {
				if ( empty( $object['featured_media'] ) ) return null;
				$src = wp_get_attachment_image_src( $object['featured_media'], 'full' );
				return $src ? $src[0] : null;
			},
			'schema' => [ 'type' => 'string', 'format' => 'uri' ],
		]
	);
} );

// ── Remove XML-RPC ────────────────────────────────────────────────────────
add_filter( 'xmlrpc_enabled', '__return_false' );

// ── Disable comments sitewide (not needed for headless atlas CMS) ─────────
add_action( 'init', function () {
	foreach ( get_post_types() as $post_type ) {
		if ( post_type_supports( $post_type, 'comments' ) ) {
			remove_post_type_support( $post_type, 'comments' );
			remove_post_type_support( $post_type, 'trackbacks' );
		}
	}
} );
add_filter( 'comments_open',    '__return_false', 20, 2 );
add_filter( 'pings_open',       '__return_false', 20, 2 );
add_filter( 'comments_array',   '__return_empty_array', 10, 2 );

// ── Dashboard: show useful quick-access widgets only ─────────────────────
add_action( 'wp_dashboard_setup', function () {
	global $wp_meta_boxes;
	// Remove default noisy widgets
	remove_meta_box( 'dashboard_primary',   'dashboard', 'side' );
	remove_meta_box( 'dashboard_secondary', 'dashboard', 'side' );
	remove_meta_box( 'dashboard_quick_press', 'dashboard', 'side' );
	remove_meta_box( 'dashboard_recent_drafts', 'dashboard', 'side' );
} );

// ── Admin: brand the login page ───────────────────────────────────────────
add_action( 'login_enqueue_scripts', function () {
	echo '<style>
		body.login { background: #080705; }
		.login h1 a {
			background-image: none !important;
			font-size: 1.2rem;
			color: #c9a227;
			text-indent: 0;
			width: auto;
			height: auto;
			font-family: Georgia, serif;
			letter-spacing: 0.2em;
			text-transform: uppercase;
		}
		.login form {
			background: #0f0d04;
			border: 1px solid #2a2604;
			box-shadow: 0 0 32px rgba(201, 162, 39, 0.08);
		}
		.login label { color: #7a7368; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
		.login input[type="text"],
		.login input[type="password"] {
			background: #161208;
			border-color: #2a2604;
			color: #d4cbb8;
		}
		.login input[type="text"]:focus,
		.login input[type="password"]:focus { border-color: #c9a227; box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.15); }
		.wp-core-ui .button-primary {
			background: transparent;
			border-color: #7a6118;
			color: #c9a227;
			text-shadow: none;
			box-shadow: none;
			letter-spacing: 0.15em;
			text-transform: uppercase;
			font-size: 0.75rem;
		}
		.wp-core-ui .button-primary:hover { background: rgba(201, 162, 39, 0.12); border-color: #c9a227; }
		#login_error, .login .message { border-left-color: #c2410c; background: #1a0a04; color: #d4cbb8; }
	</style>';
} );

add_filter( 'login_headertext', function () {
	return 'Tethys Atlas CMS';
} );
