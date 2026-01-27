const BETRAYAL_EVENT = 'tethys:betrayal';

export function triggerBetrayalEvent(npc, meta = {}) {
  if (typeof window === 'undefined' || !npc?.id) return;

  const detail = {
    npcId: npc.id,
    faction: npc.faction,
    name: npc.name,
    at: Date.now(),
    ...meta
  };

  window.dispatchEvent(new CustomEvent(BETRAYAL_EVENT, { detail }));
}
// World of Tethys || D.C. Barletta
