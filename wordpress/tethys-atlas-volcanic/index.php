<?php get_header(); ?>

<main id="main" class="site-main">
  <div class="site-wrapper">
    <?php if ( is_front_page() && ! is_home() ) : ?>
      <div class="headless-notice">
        <div class="sigil">⊕</div>
        <h1>Tethys Atlas CMS</h1>
        <p>
          This is the content management system for
          <a href="https://atlas.worldoftethys.com">atlas.worldoftethys.com</a>.
          The public atlas is rendered by the Next.js frontend — there is nothing
          to view here directly.
        </p>
      </div>
    <?php elseif ( is_singular() ) : ?>
      <?php while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'av-card' ); ?>>
          <header class="entry-header">
            <h1 class="entry-title"><?php the_title(); ?></h1>
            <div class="entry-meta">
              <?php echo esc_html( get_the_date() ); ?>
              &nbsp;·&nbsp;
              <?php echo esc_html( get_post_type_object( get_post_type() )->labels->singular_name ); ?>
            </div>
          </header>
          <div class="entry-content">
            <?php the_content(); ?>
          </div>
        </article>
      <?php endwhile; ?>
    <?php else : ?>
      <ul class="posts-list">
        <?php while ( have_posts() ) : the_post(); ?>
          <li>
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
            <div class="entry-meta"><?php echo esc_html( get_the_date() ); ?></div>
          </li>
        <?php endwhile; ?>
      </ul>
      <div class="nav-links">
        <?php the_posts_pagination( [ 'mid_size' => 2 ] ); ?>
      </div>
    <?php endif; ?>
  </div>
</main>

<?php get_footer(); ?>
