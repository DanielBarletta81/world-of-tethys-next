import { fetchBlogPosts } from '@/lib/wp-posts';

const siteUrl = process.env.NEXT_PUBLIC_AUTHOR_SITE_URL || 'https://dcbarletta.com';

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(dateString) {
  if (!dateString) return new Date().toUTCString();
  const d = new Date(dateString);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

function buildItem(post) {
  const title = escapeXml(post.title || 'Untitled');
  const slug = post.slug || '';
  const url = `${siteUrl}/blog/${slug}`;
  const description = escapeXml(
    post.excerpt ||
      'A World of Tethys natural-history essay by D.C. Barletta.'
  );
  const pubDate = toRfc822(post.date);
  const guid = escapeXml(url);

  return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
}

export async function GET() {
  const posts = await fetchBlogPosts(100);

  const sortedPosts = [...posts].sort((a, b) => {
    const aTs = a?.date ? new Date(a.date).getTime() : 0;
    const bTs = b?.date ? new Date(b.date).getTime() : 0;
    return bTs - aTs;
  });

  const items = sortedPosts.map(buildItem).join('\n');
  const now = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>D.C. Barletta</title>
    <link>${siteUrl}</link>
    <description>Natural history, lore, and essays from the World of Tethys archive.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
