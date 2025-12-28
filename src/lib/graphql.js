import fetch from 'cross-fetch';
import { getAccessToken } from './token';

const endpoint = process.env.WP_GRAPHQL_ENDPOINT;

if (!endpoint) {
  throw new Error('Missing WP_GRAPHQL_ENDPOINT environment variable.');
}

export async function graphqlFetch(query, variables = {}) {
  const token = await getAccessToken();

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText} – ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    const messages = json.errors.map((e) => e.message).join('; ');
    throw new Error(`GraphQL errors: ${messages}`);
  }

  return json.data;
}

export async function getPageBySlug(slug) {
  const data = await graphqlFetch(
    `query PageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        title
        content
        excerpt
        slug
      }
    }`,
    { slug }
  );
  return data?.page || null;
}
