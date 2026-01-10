const base = process.env.NEXT_PUBLIC_CDN_BASE || "";

export function cdn(path = "") {
  if (!base || !path) return path;
  if (path.startsWith("http")) return path;
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${trimmedBase}/${trimmedPath}`;
}

// World of Tethys || D.C. Barletta
