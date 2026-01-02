'use server';

const API_URL = process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!API_URL) {
  throw new Error('WORDPRESS_API_URL env var is missing.');
}

/**
 * Fetch data from WordPress with Tethys-specific defaults.
 * @param {string} endpoint - The WP-JSON endpoint (e.g., 'posts', 'creature', 'location')
 * @param {object} params - Additional query params (e.g., { slug: 'my-post' })
 */
export async function getTethysData(endpoint = 'posts', params = {}) {
  // 1. Build the Query String (Add _embed to get images/authors)
  const query = new URLSearchParams({
    _embed: 'true',
    per_page: '100', // Grab more items (default is 10)
    ...params,
  });

  // 2. The Fetch Call
  const res = await fetch(`${API_URL}/${endpoint}?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // 3. PERFORMANCE FIX: Cache data for 1 hour (3600s)
    next: { revalidate: 3600 }, 
  });

  if (!res.ok) {
    console.error(`Failed to fetch ${endpoint}:`, res.status, res.statusText);
    // Return empty array instead of crashing the whole app
    return []; 
  }

  return res.json();
}