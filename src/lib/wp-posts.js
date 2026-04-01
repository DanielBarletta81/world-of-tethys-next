import 'server-only';

// Slugs that already have their own hardcoded static page files under /blog/
// These are excluded from the WP dynamic route to avoid routing conflicts.
export const STATIC_BLOG_SLUGS = new Set([
  'could-humans-survive-age-of-dinosaurs',
  'why-pterosaurs-ruled-the-ancient-sky',
  'life-after-the-permian-extinction',
  'ecology-of-volcanic-forests',
]);

// Static fallback list shown when WPGraphQL is unreachable.
export const STATIC_POSTS = [
  {
    slug: 'could-humans-survive-age-of-dinosaurs',
    title: 'Could Humans Survive the Age of Dinosaurs?',
    excerpt: null,
    date: null,
    fromWP: false,
  },
  {
    slug: 'why-pterosaurs-ruled-the-ancient-sky',
    title: 'Why Pterosaurs Ruled the Ancient Sky',
    excerpt: null,
    date: null,
    fromWP: false,
  },
  {
    slug: 'life-after-the-permian-extinction',
    title: 'Life After the Permian Extinction',
    excerpt: null,
    date: null,
    fromWP: false,
  },
  {
    slug: 'ecology-of-volcanic-forests',
    title: 'The Ecology of Volcanic Forests',
    excerpt: null,
    date: null,
    fromWP: false,
  },
];

const POSTS_QUERY = `
  query GetPosts($first: Int) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        slug
        title
        excerpt
        date
      }
    }
  }
`;

/**
 * Fetch published posts from WPGraphQL.
 * Returns STATIC_POSTS silently when WP is unreachable (pre-install / offline CMS).
 *
 * @param {number} limit  Max number of WP posts to fetch (default 50)
 * @returns {Promise<Array<{slug:string, title:string, excerpt:string|null, date:string|null, fromWP:boolean}>>}
 */
export async function fetchBlogPosts(limit = 50) {
  const endpoint = process.env.TETHYS_API_BASE
    ? `${process.env.TETHYS_API_BASE.replace(/\/$/, '')}/graphql`
    : process.env.WP_GRAPHQL_ENDPOINT;

  if (!endpoint) return STATIC_POSTS;

  try {
    const headers = { 'Content-Type': 'application/json' };
    const wpUser = process.env.WP_USER;
    const wpAppPass = process.env.WP_APP_PASS;
    if (wpUser && wpAppPass) {
      headers['Authorization'] =
        'Basic ' + Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: POSTS_QUERY, variables: { first: limit } }),
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });

    if (!res.ok) return STATIC_POSTS;

    const json = await res.json();
    const wpNodes = json?.data?.posts?.nodes ?? [];

    if (!wpNodes.length) return STATIC_POSTS;

    // Merge: WP posts first, then static posts not already in WP
    const wpSlugs = new Set(wpNodes.map((n) => n.slug));
    const staticOnly = STATIC_POSTS.filter((p) => !wpSlugs.has(p.slug));

    return [
      ...wpNodes.map((n) => ({
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt ? n.excerpt.replace(/<[^>]+>/g, '').trim() : null,
        date: n.date ?? null,
        fromWP: true,
      })),
      ...staticOnly,
    ];
  } catch {
    return STATIC_POSTS;
  }
}

/**
 * Fetch a single WP post by slug for the dynamic blog route.
 * Returns null when WP is unreachable.
 */
export async function fetchPostBySlug(slug) {
  const endpoint = process.env.TETHYS_API_BASE
    ? `${process.env.TETHYS_API_BASE.replace(/\/$/, '')}/graphql`
    : process.env.WP_GRAPHQL_ENDPOINT;

  if (!endpoint) return null;

  try {
    const headers = { 'Content-Type': 'application/json' };
    const wpUser = process.env.WP_USER;
    const wpAppPass = process.env.WP_APP_PASS;
    if (wpUser && wpAppPass) {
      headers['Authorization'] =
        'Basic ' + Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `
          query PostBySlug($id: ID!) {
            post(id: $id, idType: SLUG) {
              slug
              title
              content
              excerpt
              date
            }
          }
        `,
        variables: { id: slug },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.post ?? null;
  } catch {
    return null;
  }
}
// World of Tethys || D.C. Barletta
