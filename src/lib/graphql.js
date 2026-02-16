import 'server-only';
import fetch from 'cross-fetch';

const tethysBase = process.env.TETHYS_API_BASE || process.env.NEXT_PUBLIC_TETHYS_API_BASE;
const endpoint = tethysBase ? `${tethysBase.replace(/\/$/, '')}/graphql` : process.env.WP_GRAPHQL_ENDPOINT;
const wpUser = process.env.WP_USER;
const wpAppPass = process.env.WP_APP_PASS;

if (!endpoint) {
  throw new Error('Missing TETHYS_API_BASE or WP_GRAPHQL_ENDPOINT environment variable.');
}

export async function graphqlFetch(query, variables = {}) {
  const headers = { 'Content-Type': 'application/json' };

  // Use Basic Auth only when talking directly to WPGraphQL
  if (!tethysBase && wpUser && wpAppPass) {
    const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 } // Cache for 60s
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[GraphQL Error] Status: ${res.status} ${res.statusText}`);
      throw new Error(`GraphQL request failed: ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error('[GraphQL Error] Query Errors:', json.errors);
      // Don't throw here; let it return data: null so the UI handles it gracefully
    }

    return json.data;
  } catch (err) {
    console.error('[GraphQL Network Error]:', err);
    return null;
  }
}

export async function graphqlFetchWithErrors(query, variables = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (!tethysBase && wpUser && wpAppPass) {
    const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[GraphQL Error] Status: ${res.status} ${res.statusText}`);
      return { data: null, errors: [{ message: text }] };
    }

    const json = await res.json();
    if (json.errors) {
      console.error('[GraphQL Error] Query Errors:', json.errors);
    }

    return { data: json.data ?? null, errors: json.errors ?? null };
  } catch (err) {
    console.error('[GraphQL Network Error]:', err);
    return { data: null, errors: [{ message: err.message }] };
  }
}

export async function getPageBySlug(slug) {
  // Remove leading slash if present (e.g. "/characters" -> "characters")
  // WPGraphQL expects URI without leading slash for pages usually
  const uri = slug.replace(/^\//, '');

  const data = await graphqlFetch(
    `query PageBySlug($id: ID!) {
      page(id: $id, idType: URI) {
        title
        content
        slug
      }
    }`,
    { id: uri }
  );

  return data?.page || null;
}
// World of Tethys || D.C. Barletta
