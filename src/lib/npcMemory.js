const NPC_KEY = 'tethys_npc_memory_v1';
const NPC_EVENT = 'tethys:npc-memory';

function readAllMemory() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(NPC_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function getNpcMemory(npcId) {
  const all = readAllMemory();
  return all[npcId] ?? null;
}

export function setNpcMemory(npcId, quoteMemory) {
  if (typeof window === 'undefined') return;
  if (!npcId || !quoteMemory) return;
  const all = readAllMemory();
  const nextHistory = [
    ...(all[npcId]?.confidenceHistory ?? []),
    quoteMemory.confidence
  ].slice(-5);
  all[npcId] = {
    lastHeard: quoteMemory,
    updatedAt: Date.now(),
    confidenceHistory: nextHistory
  };
  localStorage.setItem(NPC_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(NPC_EVENT));
}

export function subscribeNpcMemory(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (event) => {
    if (event.key && event.key !== NPC_KEY) return;
    callback();
  };

  const handleLocal = () => callback();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(NPC_EVENT, handleLocal);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(NPC_EVENT, handleLocal);
  };
}
// World of Tethys || D.C. Barletta
