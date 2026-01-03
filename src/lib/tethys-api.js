// The Bridge to your Headless CMS
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchGraphQL(query, variables = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (!API_URL) {
    console.warn('⚠️ WordPress API URL is missing. Returning null.');
    return null;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // Cache data for 60 seconds (ISR)
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

// --- PRE-FABRICATED QUERIES ---

export const GET_BOOKS_QUERY = `
  query GetBooks {
    books {
      nodes {
        id
        title
        bookFields {
          coverImage {
            sourceUrl
          }
          amazonLink
          tributeText
        }
      }
    }
  }
`;

export const GET_LOCATIONS_QUERY = `
  query GetLocations {
    locations {
      nodes {
        title
        slug
        locationFields {
          coordinateX
          coordinateY
          description
          proxyCity
        }
      }
    }
  }
`;