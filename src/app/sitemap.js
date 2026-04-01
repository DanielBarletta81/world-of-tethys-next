import { fetchBlogPosts, STATIC_BLOG_SLUGS } from '@/lib/wp-posts';

const siteUrl =
  process.env.NEXT_PUBLIC_AUTHOR_SITE_URL || 'https://dcbarletta.com';

const staticRoutes = [
  { path: '',                              priority: 1,    freq: 'weekly' },
  { path: '/author',                       priority: 1,    freq: 'weekly' },
  { path: '/about-dc-barletta',            priority: 0.9,  freq: 'monthly' },
  { path: '/world-of-tethys-book-1',       priority: 1,    freq: 'weekly' },
  { path: '/blog',                         priority: 0.85, freq: 'weekly' },
  { path: '/blog/could-humans-survive-age-of-dinosaurs', priority: 0.8, freq: 'monthly' },
  { path: '/blog/why-pterosaurs-ruled-the-ancient-sky',  priority: 0.8, freq: 'monthly' },
  { path: '/blog/life-after-the-permian-extinction',     priority: 0.8, freq: 'monthly' },
  { path: '/blog/ecology-of-volcanic-forests',           priority: 0.8, freq: 'monthly' },
  { path: '/natural-history',              priority: 0.8,  freq: 'monthly' },
  { path: '/press-kit',                    priority: 0.75, freq: 'monthly' },
  { path: '/contact',                      priority: 0.6,  freq: 'monthly' },
  { path: '/privacy',                      priority: 0.3,  freq: 'yearly' },
  { path: '/terms',                        priority: 0.3,  freq: 'yearly' },
];

export default async function sitemap() {
  const now = new Date();

  // Static routes
  const staticEntries = staticRoutes.map(({ path, priority, freq }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  // Dynamic WP blog posts (excludes slugs already in staticRoutes above)
  let wpEntries = [];
  try {
    const posts = await fetchBlogPosts(100);
    wpEntries = posts
      .filter((p) => p.fromWP && !STATIC_BLOG_SLUGS.has(p.slug))
      .map((p) => ({
        url: `${siteUrl}/blog/${p.slug}`,
        lastModified: p.date ? new Date(p.date) : now,
        changeFrequency: 'monthly',
        priority: 0.8,
      }));
  } catch {
    // WP offline — static entries are sufficient
  }

  return [...staticEntries, ...wpEntries];
}
// World of Tethys || D.C. Barletta
