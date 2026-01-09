"use client";

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

  return pickWeighted(pool, rng);
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
