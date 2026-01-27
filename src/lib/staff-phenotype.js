const NUCLEOTIDES = ['A', 'C', 'G', 'T'];
const NUCLEOTIDE_VALUES = { A: 0, C: 1, G: 2, T: 3 };

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function flagsToValues(flags = []) {
  return flags.map((flag) => NUCLEOTIDE_VALUES[flag] ?? 0);
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function toHex(value) {
  return Math.round(value).toString(16).padStart(2, '0');
}

function hexColor(r, g, b) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function shiftColor(base, delta) {
  return hexColor(
    clamp(base[0] + delta, 0, 255),
    clamp(base[1] + delta, 0, 255),
    clamp(base[2] + delta, 0, 255)
  );
}

export function deriveStaffPhenotype({
  dna = {},
  pathMode = 'wild',
  progress = {},
  epigenetics = null
} = {}) {
  const flags = Array.isArray(dna.flags) && dna.flags.length === 4 ? dna.flags : NUCLEOTIDES;
  const values = flagsToValues(flags);
  const signature = sum(values);

  const timeMs = (progress.timeOnSiteMs || 0) + (progress.mapTimeMs || 0);
  const dryFactor = clamp(timeMs / (1000 * 60 * 60 * 4), 0, 1);
  const wetness = clamp(0.72 - dryFactor * 0.42 + values[2] * 0.05, 0.18, 0.78);

  const warp = clamp((values[0] - values[3]) * 0.6, -1.2, 1.2);
  const grain = clamp(0.25 + values[1] * 0.12, 0.2, 0.75);
  const chip = clamp(0.12 + values[3] * 0.08, 0.1, 0.45);
  const wrapDensity = clamp(0.35 + values[0] * 0.08, 0.25, 0.65);

  const tealBase = [34, 211, 238];
  const woodBase = [76, 44, 32];
  const stainBase = [36, 26, 22];
  const glowAccent = shiftColor(tealBase, values[2] * 8);
  const woodDark = shiftColor(woodBase, -values[1] * 6);
  const woodLight = shiftColor(woodBase, 18 - values[0] * 4);
  const wetStain = shiftColor(stainBase, -values[3] * 6);

  const variant = pathMode === 'mystic' ? 'spore' : pathMode === 'city' ? 'etched' : 'driftwood';

  const modifiers = epigenetics?.modifiers || {};
  const mutated = {
    wetness: clamp(wetness + (modifiers.wetnessBias || 0), 0.1, 0.9),
    warp: clamp(warp + (modifiers.warpBias || 0), -1.5, 1.5),
    grain: clamp(grain + (modifiers.grainBias || 0), 0.15, 0.9),
    chip: clamp(chip + (modifiers.chipBias || 0), 0.05, 0.6),
    wrapDensity: clamp(wrapDensity, 0.2, 0.75),
    glowBoost: clamp(modifiers.glowBias || 0, -0.2, 0.4)
  };

  return {
    flags,
    signature,
    variant,
    wetness: mutated.wetness,
    warp: mutated.warp,
    grain: mutated.grain,
    chip: mutated.chip,
    wrapDensity: mutated.wrapDensity,
    glowAccent,
    woodDark,
    woodLight,
    wetStain,
    auraColor: glowAccent,
    glowBoost: mutated.glowBoost
  };
}

export function flagsLabel(flags = []) {
  const safe = Array.isArray(flags) ? flags : [];
  return safe.map((flag) => (NUCLEOTIDES.includes(flag) ? flag : 'A')).join('');
}
