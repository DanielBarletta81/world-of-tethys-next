import { NextResponse } from 'next/server';
import { PTEROS_SIGNAL_WINDOW } from '@/data/pteros-signal-window';
import { graphqlFetch } from '@/lib/graphql';

export async function GET() {
  const enabled = process.env.WP_PTEROS_SIGNAL_ENABLED === 'true';
  if (!enabled || !process.env.WP_GRAPHQL_ENDPOINT) {
    return NextResponse.json({ items: PTEROS_SIGNAL_WINDOW });
  }

  try {
    const data = await graphqlFetch(`
      query PterosSignalWindow {
        pterosSignalWindowItems(first: 50) {
          nodes {
            id
            slug
            databaseId
            title
            description
            youtubeId
            uploadDate
            tags
          }
        }
      }
    `);

    const nodes = data?.pterosSignalWindowItems?.nodes;
    if (!nodes?.length) return NextResponse.json({ items: PTEROS_SIGNAL_WINDOW });

    const items = nodes.map((node) => ({
      id: node?.id || node?.slug || `wp-${node?.databaseId || 'unknown'}`,
      title: node?.title || '',
      description: node?.description || '',
      youtubeId: node?.youtubeId || '',
      uploadDate: node?.uploadDate || '',
      tags: node?.tags || []
    }));

    return NextResponse.json({ items });
  } catch (err) {
    console.error('[Pteros Signal API] WP GraphQL fallback to local signals.', err);
    return NextResponse.json({ items: PTEROS_SIGNAL_WINDOW });
  }
}
