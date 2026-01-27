function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function pickWeighted(items) {
  if (!items.length) return null;
  const total = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight || 1;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

export function selectNpcRumor({
  faction,
  regionId,
  myths = [],
  rumors = [],
  regionWeights = {}
}) {
  const pool = rumors.filter((rumor) => rumor.faction === faction);
  if (!pool.length) return null;

  const regionMap = regionWeights[regionId] || {};
  const weighted = pool.map((rumor) => {
    const regionBoost = regionMap[rumor.mythId] ?? 0.5;
    const weight = Math.max(0.1, (rumor.confidence || 0.2) * regionBoost);
    return { ...rumor, weight };
  });

  const selected = pickWeighted(weighted);
  if (!selected) return null;

  const myth = myths.find((entry) => entry.id === selected.mythId) || null;
  const driftedAccuracy = clamp01(selected.accuracy + (Math.random() * 0.2 - 0.1));
  const driftedConfidence = clamp01(selected.confidence + (Math.random() * 0.16 - 0.08));

  return {
    ...selected,
    myth,
    perceivedAccuracy: driftedAccuracy,
    expressedConfidence: driftedConfidence
  };
}
