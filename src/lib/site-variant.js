const DEFAULT_WORLD_URL = 'https://worldoftethys.com';

function normalizeHost(hostValue = '') {
  if (!hostValue) return '';
  const firstHost = String(hostValue).split(',')[0]?.trim().toLowerCase() || '';
  return firstHost.replace(/:\d+$/, '');
}

function toHost(url, fallback = DEFAULT_WORLD_URL) {
  try {
    return new URL(url || fallback).host.toLowerCase();
  } catch {
    return new URL(fallback).host.toLowerCase();
  }
}

export function getRequestHost(headerStore) {
  if (!headerStore) return '';
  return normalizeHost(headerStore.get('x-forwarded-host') || headerStore.get('host') || '');
}

export function getConfiguredSiteUrls() {
  const worldSiteUrl = (process.env.NEXT_PUBLIC_WORLD_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_WORLD_URL).replace(/\/$/, '');
  const authorSiteUrl = (process.env.NEXT_PUBLIC_AUTHOR_SITE_URL || worldSiteUrl).replace(/\/$/, '');
  return { worldSiteUrl, authorSiteUrl };
}

export function getSiteVariantFromConfig() {
  const { worldSiteUrl, authorSiteUrl } = getConfiguredSiteUrls();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || worldSiteUrl).replace(/\/$/, '');
  const worldHost = toHost(worldSiteUrl);
  const authorHost = toHost(authorSiteUrl, worldSiteUrl);
  const siteHost = toHost(siteUrl, worldSiteUrl);

  if (authorHost && authorHost !== worldHost && siteHost === authorHost) {
    return 'author';
  }

  return 'world';
}

export function getSiteVariantFromHost(host) {
  const normalizedHost = normalizeHost(host);
  const { worldSiteUrl, authorSiteUrl } = getConfiguredSiteUrls();
  const worldHost = toHost(worldSiteUrl);
  const authorHost = toHost(authorSiteUrl, worldSiteUrl);

  if (authorHost && authorHost !== worldHost && normalizedHost === authorHost) {
    return 'author';
  }

  return 'world';
}
