const base = process.env.EXPO_PUBLIC_CDN_BASE ?? '';

export function cdn(path: string) {
  if (!base || !path) return '';
  if (path.startsWith('http')) return path;
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${trimmedBase}/${trimmedPath}`;
}

export function hasCdn() {
  return Boolean(base);
}
