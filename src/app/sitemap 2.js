const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldoftethys.com';

const staticRoutes = [
  '',
  '/author',
  '/about-dc-barletta',
  '/world-of-tethys-book-1',
  '/blog',
  '/blog/could-humans-survive-age-of-dinosaurs',
  '/blog/why-pterosaurs-ruled-the-ancient-sky',
  '/blog/life-after-the-permian-extinction',
  '/blog/ecology-of-volcanic-forests',
  '/press-kit',
  '/contact',
  '/privacy',
  '/terms',
];

export default function sitemap() {
  const now = new Date();
  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/author' || route === '/world-of-tethys-book-1' ? 'weekly' : 'monthly',
    priority: route === '' || route === '/author' || route === '/world-of-tethys-book-1' ? 1 : 0.8,
  }));
}
