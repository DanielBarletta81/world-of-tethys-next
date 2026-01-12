export async function fetchMediaManifest(cdnBase, opts = {}) {
  if (!cdnBase) {
    throw new Error('Missing CDN base for media manifest.');
  }
  const url = `${cdnBase.replace(/\/$/, '')}/media/manifest.json`;
  const res = await fetch(url, {
    cache: 'no-store',
    ...opts
  });
  if (!res.ok) {
    throw new Error(`Manifest fetch failed: ${res.status}`);
  }
  const data = await res.json();
  if (!data || !Array.isArray(data.items)) {
    throw new Error('Invalid manifest payload.');
  }
  return data.items;
}
