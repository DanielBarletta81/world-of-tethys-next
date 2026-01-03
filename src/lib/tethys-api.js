const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchArchive(category = null, slug = null) {
  const headers = { 'Content-Type': 'application/json' };
  
  // Dynamic Query Construction
  const query = `
    query GetArchive($category: String, $slug: ID) {
      archiveEntries(
        where: { 
          taxQuery: {
            taxArray: ${category ? `[{ taxonomy: "archive_category", field: SLUG, terms: ["${category}"] }]` : '[]'} 
          },
          name: $slug
        }
        first: 100
      ) {
        nodes {
          title
          slug
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
          archiveCategories {
            nodes {
              name
              slug
            }
          }
          tethysData {
            threatLevel
            kithRequirement
            realWorldAnalog
            biologicalTraits {
              trait
              value
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables: { category, slug } }),
      next: { revalidate: 60 }
    });
    const json = await res.json();
    return json.data.archiveEntries.nodes;
  } catch (e) {
    console.error("Archive Fetch Failed:", e);
    return [];
  }
}