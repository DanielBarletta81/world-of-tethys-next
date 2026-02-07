import { NextResponse } from 'next/server';
import { fetchAPI } from '@/lib/wordpress';
import { SCIENCE_DISCOVERIES } from '@/data/science-discoveries';

export async function GET() {
  try {
    const data = await fetchAPI(
      `
      query ScienceDiscoveries($first: Int!) {
        scienceDiscoveries(first: $first) {
          nodes {
            id
            title
            excerpt
            content
            scienceDiscoveryMeta {
              sourceTitle
              sourceUrl
              publishedOn
              summary
              tethysAnalogs
            }
          }
        }
      }
    `,
      { first: 10 }
    );

    const nodes = data?.scienceDiscoveries?.nodes ?? [];
    if (nodes.length) {
      const items = nodes.map((node) => ({
        id: node.id,
        title: node.title,
        summary: node.scienceDiscoveryMeta?.summary || node.excerpt || '',
        sourceTitle: node.scienceDiscoveryMeta?.sourceTitle,
        sourceUrl: node.scienceDiscoveryMeta?.sourceUrl,
        publishedOn: node.scienceDiscoveryMeta?.publishedOn,
        tethysAnalogs: (node.scienceDiscoveryMeta?.tethysAnalogs || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      }));

      return NextResponse.json({ items });
    }
  } catch (error) {
    // Fall back to static data below.
  }

  return NextResponse.json({ items: SCIENCE_DISCOVERIES });
}
