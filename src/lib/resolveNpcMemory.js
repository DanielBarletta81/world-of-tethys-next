function pick(items) {
  if (!items?.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

export function resolveNpcParaphrase({
  textId,
  knowledge,
  faction,
  npcProximity = 0.5,
  paraphraseBlock
}) {
  if (!paraphraseBlock?.paraphrases) return null;

  const mythIds = paraphraseBlock.myths ?? [];
  const distortions = mythIds.map((id) => knowledge?.myths?.[id]?.distortion ?? 0);
  const baseDistortion = distortions.length ? Math.max(...distortions) : 0;

  const memoryDistortion = clamp01(
    baseDistortion + (1 - npcProximity) * 0.25
  );

  let effective = memoryDistortion;
  const bias = paraphraseBlock.factionBias?.[faction] ?? 0;

  if (memoryDistortion > 0.25 && memoryDistortion < 0.75) {
    effective = clamp01(memoryDistortion + bias);
  }

  const tiers = paraphraseBlock.paraphrases;
  const primary =
    effective < 0.33 ? tiers.low : effective < 0.66 ? tiers.mid : tiers.high;
  const fallback = tiers.mid ?? tiers.low ?? tiers.high ?? [];

  return pick(primary ?? fallback);
}
// World of Tethys || D.C. Barletta
