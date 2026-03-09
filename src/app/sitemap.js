const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dcbarletta.com';

const staticRoutes = [
  '',
  '/author',
  '/world',
  '/world-of-tethys-book-1',
  '/about-dc-barletta',
  '/world-of-tethys',
  '/world-of-tethys/sky-city',
  '/world-of-tethys/stryker',
  '/world-of-tethys/the-watcher-volcano',
  '/world-of-tethys/ironwood-forest',
  '/world-of-tethys/pterosaurs',
  '/world-of-tethys/danian-delta',
  '/natural-history',
  '/natural-history/pterosaurs',
  '/natural-history/life-after-the-permian-extinction',
  '/natural-history/could-humans-survive-dinosaur-era',
  '/blog',
  '/blog/could-humans-survive-age-of-dinosaurs',
  '/blog/why-pterosaurs-ruled-the-ancient-sky',
  '/blog/life-after-the-permian-extinction',
  '/blog/ecology-of-volcanic-forests',
  '/press-kit',
  '/contact',
];

export default function sitemap() {
  const now = new Date();
  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' || route === '/world-of-tethys-book-1' ? 1 : 0.8,
  }));
}
