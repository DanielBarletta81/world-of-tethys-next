const siteUrl =
  process.env.NEXT_PUBLIC_AUTHOR_SITE_URL || 'https://dcbarletta.com';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/portal/', '/login'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
// World of Tethys || D.C. Barletta
