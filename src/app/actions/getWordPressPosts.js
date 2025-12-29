'use server';

const API_URL = process.env.WORDPRESS_API_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!API_URL) {
  throw new Error('WORDPRESS_API_URL env var is required for getWordPressPosts action.');
}

export async function getWordPressPosts() {
  const res = await fetch(`${API_URL}/posts?_embed`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data from WordPress REST API.');
  }

  return res.json();
}
