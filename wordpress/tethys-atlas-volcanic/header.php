<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" role="banner">
  <div class="site-wrapper">
    <div class="site-title">
      <?php if ( has_custom_logo() ) : the_custom_logo(); else : ?>
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
          <?php bloginfo( 'name' ); ?>
        </a>
      <?php endif; ?>
    </div>

    <?php if ( has_nav_menu( 'primary' ) ) : ?>
      <nav class="main-nav" aria-label="Primary">
        <?php wp_nav_menu( [
          'theme_location' => 'primary',
          'container'      => false,
          'fallback_cb'    => false,
        ] ); ?>
      </nav>
    <?php endif; ?>
  </div>
</header>
