function normalizeBaseUrl(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, '');
  }

  // Allow env values like d111111abcdef8.cloudfront.net.
  return `https://${trimmed.replace(/^\/+/, '').replace(/\/$/, '')}`;
}

const base = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_CDN_DIST ||
  process.env.NEXT_PUBLIC_CDN_BASE ||
  process.env.CLOUDFRONT_URL ||
  ''
);

function cdn(path) {
  path = path || '';
  if (!base || !path) return path;
  if (path.startsWith('http')) return path;

  const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/${trimmedPath}`;
}

export { cdn, normalizeBaseUrl };
export default cdn;

// World of Tethys || D.C. Barletta
