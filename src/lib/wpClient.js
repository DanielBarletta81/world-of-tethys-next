const { WORDPRESS_API_URL, WP_USER, WP_APP_PASS } = process.env;

/**
 * Fetches archival posts from WordPress using Basic Auth (app password).
 * Only call from server-side contexts (Next.js routes/server components).
 */
export async function fetchArchivalPosts() {
  if (!WORDPRESS_API_URL) {
    throw new Error('WORDPRESS_API_URL is not set');
  }
  if (!WP_USER || !WP_APP_PASS) {
    throw new Error('WP_USER or WP_APP_PASS is not set');
  }

  const base64Auth = Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');

  const res = await fetch(`${WORDPRESS_API_URL}/archival_post`, {
    headers: {
      Authorization: `Basic ${base64Auth}`,
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP fetch failed (${res.status}): ${text}`);
  }

  return res.json();
}
