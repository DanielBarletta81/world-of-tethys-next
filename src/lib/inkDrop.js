const radiusMap = {
  human: 0.15,
  creature: 0.25,
  lore: 0.2,
  geography: 0.3,
  geology: 0.35
};

const revelationParams = {
  migration: { turbulence: 0.7, pulseSpeed: 0.6 },
  geode: { turbulence: 0.4, pulseSpeed: 0.3 },
  forge: { turbulence: 0.5, pulseSpeed: 0.4 },
  lore: { turbulence: 0.6, pulseSpeed: 0.5 }
};

function safeJsonParse(value, fallback = {}) {
  if (!value || typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function selectActiveEvent(events = []) {
  const now = Date.now();
  return events.find((event) => {
    const start = new Date(event?.acf?.event_timing?.start_time || '').getTime();
    const end = new Date(event?.acf?.event_timing?.end_time || '').getTime();
    return start && end && now >= start && now <= end;
  }) || null;
}

export function buildInkDropEnvelope(archival, event) {
  if (!archival?.acf?.map_coords) return null;

  const coords = archival.acf.map_coords;
  const weights = archival.acf.genetic_weights || {};
  const triggers = safeJsonParse(archival.acf.technical_triggers);

  const center = {
    x: (coords.map_x ?? 50) / 100,
    y: (coords.map_y ?? 50) / 100
  };

  const primary = weights.primary_weight;
  const radius = radiusMap[primary] ?? 0.2;
  const revelation = archival.acf.revelation_type || 'lore';
  const { turbulence, pulseSpeed } = revelationParams[revelation] || { turbulence: 0.5, pulseSpeed: 0.5 };

  let color = 'rgba(226, 215, 197, 0.35)';
  let glowIntensity = 0.3;
  const shaderStack = [];
  let hudMessage;

  if (event) {
    const effect = safeJsonParse(event?.acf?.effect_payload);
    if (effect.map_pulse) color = effect.map_pulse;
    if (typeof effect.luck_multiplier === 'number') {
      glowIntensity = Math.min(1, effect.luck_multiplier / 5);
    }
    if (effect.global_shader) shaderStack.push(effect.global_shader);
    if (effect.hud_message) hudMessage = effect.hud_message;
  }

  if (triggers.filter) shaderStack.push(triggers.filter);

  return {
    center,
    radius,
    color,
    turbulence,
    pulseSpeed,
    glowIntensity,
    shaderStack,
    audioKey: triggers.sound,
    unlockKey: triggers.unlock,
    hudMessage
  };
}
