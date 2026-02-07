import { NextResponse } from 'next/server';
import { catalogItems } from '@/data/catalog';
import { graphqlFetch } from '@/lib/graphql';

export async function GET() {
  const enabled = process.env.WP_CATALOG_ENABLED === 'true';
  if (!enabled || !process.env.WP_GRAPHQL_ENDPOINT) {
    return NextResponse.json({ items: catalogItems });
  }

  try {
    const data = await graphqlFetch(`
      query CatalogItems {
        catalogItems(first: 50) {
          nodes {
            id
            slug
            databaseId
            title
            subtitle
            format
            price
            url
            cover
            type
            boost
          }
        }
      }
    `);

    const nodes = data?.catalogItems?.nodes;
    if (!nodes?.length) return NextResponse.json({ items: catalogItems });

    const items = nodes.map((node) => ({
      id: node?.id || node?.slug || `wp-${node?.databaseId || 'unknown'}`,
      title: node?.title || '',
      subtitle: node?.subtitle || '',
      format: node?.format || '',
      price: node?.price || '',
      url: node?.url || '',
      cover: node?.cover || '',
      type: node?.type || '',
      boost: node?.boost || ''
    }));

    return NextResponse.json({ items });
  } catch (err) {
    console.error('[Catalog API] WP GraphQL fallback to local catalog.', err);
    return NextResponse.json({ items: catalogItems });
  }
}
