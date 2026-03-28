const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldoftethys.com';

const staticRoutes = [
  '',
  '/world',
  '/map',
  '/archive',
  '/creatures',
  '/natural-history',
  '/signals',
  '/science',
  '/timeline',
  '/stories/the-weep',
  '/mystics',
  '/pteros',
  '/peek',
  '/listen',
  '/login',
  '/privacy',
  '/terms',
];

const routePriority = {
  '': 1,
  '/world': 0.95,
  '/map': 0.95,
  '/archive': 0.9,
  '/natural-history': 0.9,
  '/signals': 0.85,
  '/science': 0.85,
  '/timeline': 0.85,
};

export default function sitemap() {
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency:
      route === '' || route === '/world' || route === '/map'
        ? 'weekly'
        : 'monthly',
    priority: routePriority[route] ?? 0.7,
  }));
}
