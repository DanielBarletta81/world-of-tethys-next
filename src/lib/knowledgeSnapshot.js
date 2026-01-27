export function createKnowledgeSnapshot({ faction, knowledge }) {
  return {
    faction,
    myths: knowledge?.myths ?? {},
    regions: knowledge?.regions ?? {},
    exportedAt: Date.now()
  };
}

export function resolveFrozenKnowledge({
  frozen = false,
  snapshot,
  knowledge,
  faction
}) {
  const effectiveKnowledge = frozen ? snapshot : knowledge;
  const effectiveFaction = frozen ? snapshot?.faction ?? faction : faction;

  return { effectiveKnowledge, effectiveFaction };
}
// World of Tethys || D.C. Barletta
