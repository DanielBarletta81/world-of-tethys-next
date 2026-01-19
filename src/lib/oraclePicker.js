import seeder from "../../oracle_pool/ravel_seeder.json";

const matches = (input, candidate) => candidate === "any" || input === candidate;

// Weighted random helper; allow custom rng for deterministic tests.
const pickWeighted = (items, rng = Math.random) => {
  const total = items.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  let roll = rng() * total;
  for (const item of items) {
    roll -= item.weight ?? 1;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
};

const hashString = (value = "") => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededRng = (seedValue) => {
  let t = seedValue >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const isoWeekKey = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

/**
 * Selects an oracle response from the ravel seeder based on path/stillness/visit/watcherState.
 * Returns a fallback object if nothing matches.
 */
export function pickRavelResponse(
  { path, stillness, visit, watcherState },
  opts = {}
) {
  const source = opts.seeder ?? seeder;
  const rng = opts.rng ?? Math.random;
  const recentIds = Array.isArray(opts.recentIds) ? opts.recentIds : [];
  const maxRecent = Number.isFinite(opts.maxRecent) ? opts.maxRecent : 4;
  const pool = (source.responses ?? []).filter((resp) =>
    matches(path, resp.path) &&
    matches(stillness, resp.stillness) &&
    matches(visit, resp.visit) &&
    matches(watcherState, resp.watcherState)
  );

  if (!pool.length) {
    return {
      id: "ravel_fallback",
      path: "any",
      stillness: "any",
      visit: "any",
      watcherState: "any",
      text: "",
      weight: 1,
      ...source.fallback,
    };
  }

  const recentSet = new Set(recentIds.slice(0, maxRecent));
  const available = pool.filter((resp) => !recentSet.has(resp.id));
  return pickWeighted(available.length ? available : pool, rng);
}

export function pickRavelWeeklyResponse(
  { path, stillness, visit, watcherState, query },
  opts = {}
) {
  const weekKey = opts.weekKey || isoWeekKey(opts.date);
  const seedSource = `${weekKey}:${opts.seed || ""}:${query || ""}:${path || ""}:${stillness || ""}`;
  const rng = seededRng(hashString(seedSource));
  const selection = pickRavelResponse(
    { path, stillness, visit, watcherState },
    { ...opts, rng }
  );
  return { ...selection, weekKey };
}

/**
 * Utility to get the full selector metadata and rules for UI/validation.
 */
export function getRavelMeta() {
  return {
    id: seeder.id,
    speaker: seeder.speaker,
    selectors: seeder.selectors,
    rules: seeder.rules,
    fallback: seeder.fallback,
  };
}

// World of Tethys || D.C. Barletta
