export function checkNpcCollapse(npc, memory) {
  if (!npc || !memory?.confidenceHistory?.length) return false;

  const sum = memory.confidenceHistory.reduce((acc, value) => acc + value, 0);
  const avg = sum / memory.confidenceHistory.length;

  const conflicting = memory.confidenceHistory.some(
    (value) => Math.abs(value - avg) > 0.25
  );

  const factionPressure =
    npc.faction === 'sky-city' || npc.faction === 'ironwood';

  return avg < 0.3 && conflicting && factionPressure;
}
// World of Tethys || D.C. Barletta
