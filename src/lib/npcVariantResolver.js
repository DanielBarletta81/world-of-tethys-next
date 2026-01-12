function hashString(input) {
  let h1 = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h1 ^= input.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193);
  }
  return h1 >>> 0;
}

function mulberry32(seed) {
  let t = seed;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const LOCATION_DISTORTION = {
  sky_city: 0.35,
  'sky-city': 0.35,
  cambria: 0.55,
  cambria_ruins: 0.55,
  'mystic-woods': 0.6,
  mystic_woods: 0.6,
  watcher_volcano: 0.7,
  watcher_flats: 0.65,
  the_ledge: 0.8,
  'the-weep': 0.7,
  pteros: 0.25,
  ironwood: 0.45,
  'iron-sands': 0.5,
  thals: 0.3,
  'pteros-island': 0.25,
  pteros_island: 0.25,
  purgess: 0.75
};

function getLocationDistortion(locations = []) {
  if (!locations.length) return 0.4;
  const values = locations.map((loc) => LOCATION_DISTORTION[loc] ?? 0.4);
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

function scoreLine(line, context) {
  let score = line.weight ?? 1;
  const tags = line.tags ?? {};
  const recent = context.locations ?? [];
  const imprints = context.imprints ?? { bruises: [], tracks: [] };
  const bruiseList = imprints.bruises || [];
  const trackList = imprints.tracks || [];
  const combinedImprints = [...bruiseList, ...trackList];

  if (tags.locations?.length) {
    const hits = tags.locations.filter((loc) => recent.includes(loc)).length;
    score += hits * 2;
  }

  if (tags.imprints?.length) {
    let hits = 0;
    tags.imprints.forEach((imp) => {
      if (imp === 'bruise' && bruiseList.length) hits += 1;
      else if (imp === 'track' && trackList.length) hits += 1;
      else if (combinedImprints.includes(imp)) hits += 1;
    });
    score += hits * 2;
  }

  if (tags.faction && tags.faction === context.faction) {
    score += 1.5;
  }

  if (tags.clarity) {
    const preferred = context.clarity;
    if (tags.clarity === preferred) score += 1.25;
  }

  return score;
}

function deriveClarity(distortion) {
  if (distortion < 0.34) return 'firm';
  if (distortion < 0.67) return 'hedged';
  return 'distant';
}

export function resolveNpcVariantLine({ pack, context }) {
  if (!pack?.lines?.length) return null;

  const distortion = context.distortion ?? 0.4;
  const clarity = deriveClarity(distortion);
  const enriched = { ...context, clarity };

  const scored = pack.lines
    .map((line) => ({ line, score: scoreLine(line, enriched) }))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, Math.min(5, scored.length));
  const seedKey = [
    context.seedBase || '',
    pack.id,
    context.npcId,
    (context.locations || []).join(','),
    (context.imprints?.bruises || []).join(','),
    (context.imprints?.tracks || []).join(','),
    clarity
  ].join('|');

  const rand = mulberry32(hashString(seedKey));
  const pickIndex = Math.floor(rand() * top.length);
  return top[pickIndex]?.line?.text ?? null;
}

export function buildNpcVariantContext({
  npcId,
  faction,
  userId,
  currentLocation,
  locationHistory,
  imprints
}) {
  const locations = [...(locationHistory || []), currentLocation].filter(Boolean);
  const distortion = getLocationDistortion(locations);
  return {
    npcId,
    faction,
    seedBase: userId || 'guest',
    locations,
    imprints,
    distortion
  };
}
// World of Tethys || D.C. Barletta
