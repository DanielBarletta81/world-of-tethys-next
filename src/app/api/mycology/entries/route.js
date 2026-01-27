import { NextResponse } from 'next/server';
import { graphqlFetchWithErrors } from '@/lib/graphql';

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const QUERY_WITH_META = `
  query MycologyEntries($first: Int!) {
    fungi(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        databaseId
        title
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        fungusMeta {
          taxonomyNotes
          bioluminescent
          luminescenceColor
          luminescenceCycle
          sporeVector
          estuaryObservations
          realWorldAnalog
          realWorldCommonName
          ravelRemedy
          ravelNotes
        }
      }
    }
  }
`;

const QUERY_FALLBACK = `
  query MycologyEntriesFallback($first: Int!) {
    fungi(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        databaseId
        title
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

const normalizeMycologyEntry = (node) => {
  const meta = node?.fungusMeta ?? {};
  const realWorldAnalog =
    stripHtml(meta.realWorldAnalog || '') ||
    stripHtml(node?.excerpt || '') ||
    stripHtml(node?.content || '');
  const ravelRemedy =
    stripHtml(meta.ravelRemedy || '') ||
    'Ravel has not catalogued a remedy yet.';

  return {
    id: `fungus_${node?.databaseId ?? node?.id ?? Math.random()}`,
    title: stripHtml(node?.title || 'Unknown fungus'),
    date: node?.date || null,
    image: node?.featuredImage?.node?.sourceUrl || null,
    imageAlt: node?.featuredImage?.node?.altText || node?.title || 'Fungal specimen',
    realWorld: {
      commonName: meta.realWorldCommonName || null,
      analog: realWorldAnalog || 'Real-world analog data pending.',
      taxonomyNotes: stripHtml(meta.taxonomyNotes || ''),
      estuaryObservations: stripHtml(meta.estuaryObservations || ''),
    },
    ravel: {
      remedy: ravelRemedy,
      notes: stripHtml(meta.ravelNotes || ''),
      bioluminescent: meta.bioluminescent ?? null,
      luminescenceColor: meta.luminescenceColor || null,
      luminescenceCycle: meta.luminescenceCycle || null,
      sporeVector: meta.sporeVector || null,
    },
  };
};

async function fetchMycologyEntries() {
  const primary = await graphqlFetchWithErrors(QUERY_WITH_META, { first: 40 });
  if (!primary.data || primary.errors?.length) {
    const fallback = await graphqlFetchWithErrors(QUERY_FALLBACK, { first: 40 });
    return fallback?.data?.fungi?.nodes ?? [];
  }
  return primary.data?.fungi?.nodes ?? [];
}

export async function GET() {
  const nodes = await fetchMycologyEntries();
  const entries = Array.isArray(nodes)
    ? nodes.map(normalizeMycologyEntry)
    : [];

  return NextResponse.json({
    entries,
    count: entries.length,
    fetchedAt: new Date().toISOString(),
  });
}

// World of Tethys || D.C. Barletta
