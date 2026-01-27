const RUMOR_LOG_KEY = 'tethys_rumor_log_v1';
const RUMOR_LOG_EVENT = 'tethys:rumor-log';

function readLog() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RUMOR_LOG_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function logRumor({ fromNpc, toNpc, quoteMemory }) {
  if (typeof window === 'undefined') return;
  if (!fromNpc?.id || !toNpc?.id || !quoteMemory?.originTextId) return;

  const log = readLog();
  log.push({
    at: Date.now(),
    from: fromNpc.id,
    to: toNpc.id,
    faction: fromNpc.faction,
    confidence: quoteMemory.confidence,
    distortion: quoteMemory.distortionAtHear,
    textId: quoteMemory.originTextId
  });

  localStorage.setItem(RUMOR_LOG_KEY, JSON.stringify(log));
  window.dispatchEvent(new Event(RUMOR_LOG_EVENT));
}

export function getRumorLog() {
  return readLog();
}

export function subscribeRumorLog(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (event) => {
    if (event.key && event.key !== RUMOR_LOG_KEY) return;
    callback();
  };

  const handleLocal = () => callback();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(RUMOR_LOG_EVENT, handleLocal);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(RUMOR_LOG_EVENT, handleLocal);
  };
}
// World of Tethys || D.C. Barletta
