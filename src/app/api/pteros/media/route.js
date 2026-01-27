import { NextResponse } from 'next/server';
import { PTEROS_FALLBACK_MEDIA } from '@/data/pteros-media';
import { graphqlFetch } from '@/lib/graphql';

export async function GET() {
  const enabled = process.env.WP_PTEROS_MEDIA_ENABLED === 'true';
  if (!enabled || !process.env.WP_GRAPHQL_ENDPOINT) {
    return NextResponse.json({ items: PTEROS_FALLBACK_MEDIA });
  }

  try {
    const data = await graphqlFetch(`
      query PterosMediaItems {
        pterosMediaItems(first: 50) {
          nodes {
            id
            slug
            databaseId
            title
            mediaType
            src
            preview
            thumbnail
            rewards
          }
        }
      }
    `);

    const nodes = data?.pterosMediaItems?.nodes;
    if (!nodes?.length) return NextResponse.json({ items: PTEROS_FALLBACK_MEDIA });

    const items = nodes.map((node) => ({
      id: node?.id || node?.slug || `wp-${node?.databaseId || 'unknown'}`,
      title: node?.title || '',
      type: node?.mediaType || node?.type || 'video',
      src: node?.src || node?.mediaUrl || '',
      preview: node?.preview || '',
      thumbnail: node?.thumbnail || '',
      rewards: node?.rewards || {}
    }));

    return NextResponse.json({ items });
  } catch (err) {
    console.error('[Pteros Media API] WP GraphQL fallback to local media.', err);
    return NextResponse.json({ items: PTEROS_FALLBACK_MEDIA });
  }
}
