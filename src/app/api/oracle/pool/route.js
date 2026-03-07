import { NextResponse } from 'next/server';
import { graphqlFetchWithErrors } from '@/lib/graphql';
import { buildRateLimitHeaders, getClientIp, rateLimit } from '@/lib/ratelimit';
import baseSeeder from '@/oracle_pool/ravel_seeder.json';

const DEFAULT_SELECTORS = {
  path: 'any',
  stillness: 'any',
  visit: 'any',
  watcherState: 'any',
};

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeSelector = (value, fallback) => {
  if (!value || value === 'any') return fallback;
  return String(value).toLowerCase();
};

const normalizeOracleEntry = (node) => {
  const meta = node?.oracleMeta ?? {};
  const translation =
    stripHtml(meta.oracleTranslation || '') ||
    stripHtml(node?.excerpt || '') ||
    stripHtml(node?.content || '') ||
    node?.title ||
    '';
  const gibberish =
    stripHtml(meta.oracleGibberish || '') ||
    stripHtml(node?.title || '') ||
    stripHtml(node?.excerpt || '') ||
    '';
  const weight = Number(meta.oracleWeight) || 1;
  const locationKey =
    meta.oracleLocationKey ||
    node?.regions?.nodes?.[0]?.slug ||
    null;

  const echo = meta.oracleEcho && meta.oracleEcho !== 'none' ? meta.oracleEcho : null;

  return {
    id: `wp_oracle_${node?.databaseId ?? node?.id ?? Math.random()}`,
    path: normalizeSelector(meta.oraclePath, DEFAULT_SELECTORS.path),
    stillness: normalizeSelector(meta.oracleStillness, DEFAULT_SELECTORS.stillness),
    visit: normalizeSelector(meta.oracleVisit, DEFAULT_SELECTORS.visit),
    watcherState: normalizeSelector(meta.oracleWatcherState, DEFAULT_SELECTORS.watcherState),
    echo,
    weight,
    locationKey,
    gibberish,
    text: translation,
    source: 'wp',
    updatedAt: node?.date || null,
  };
};

const QUERY_WITH_META = `
  query OraclePool($first: Int!) {
    loreEntries(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        databaseId
        title
        excerpt
        content
        date
        regions {
          nodes { slug }
        }
        oracleMeta {
          oracleGibberish
          oracleTranslation
          oraclePath
          oracleStillness
          oracleVisit
          oracleWatcherState
          oracleWeight
          oracleLocationKey
          oracleEcho
        }
      }
    }
  }
`;

const QUERY_FALLBACK = `
  query OraclePoolFallback($first: Int!) {
    loreEntries(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        databaseId
        title
        excerpt
        content
        date
        regions {
          nodes { slug }
        }
      }
    }
  }
`;

async function fetchOracleFromWp() {
  const primary = await graphqlFetchWithErrors(QUERY_WITH_META, { first: 60 });
  if (!primary.data || primary.errors?.length) {
    const fallback = await graphqlFetchWithErrors(QUERY_FALLBACK, { first: 60 });
    return fallback?.data?.loreEntries?.nodes ?? [];
  }
  return primary.data?.loreEntries?.nodes ?? [];
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`oracle-pool:${ip}`, 60, 60_000);
  const rlHeaders = buildRateLimitHeaders(rl);
  if (!rl.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: rlHeaders });
  }

  const wpNodes = await fetchOracleFromWp();
  const wpResponses = Array.isArray(wpNodes)
    ? wpNodes.map(normalizeOracleEntry).filter((entry) => entry.text || entry.gibberish)
    : [];

  const combined = [
    ...wpResponses,
    ...(baseSeeder.responses ?? []),
  ];

  const response = NextResponse.json({
    id: baseSeeder.id,
    speaker: baseSeeder.speaker,
    selectors: baseSeeder.selectors,
    rules: baseSeeder.rules,
    fallback: baseSeeder.fallback,
    responses: combined,
    source: {
      wpCount: wpResponses.length,
      localCount: baseSeeder.responses?.length ?? 0,
      fetchedAt: new Date().toISOString(),
    },
  });
  Object.entries(rlHeaders).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}

// World of Tethys || D.C. Barletta
