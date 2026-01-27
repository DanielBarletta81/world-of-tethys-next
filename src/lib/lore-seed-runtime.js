import loreSeedData from '@/data/lore-seeds.json';

const DEFAULT_CONTEXT = {
  timeOfDay: null,
  weather: null,
  tideState: null,
  predatorRisk: null,
  sporeSaturation: null,
  stillness: null,
  factions: null,
  regionId: null
};

function getLocalTimeOfDay() {
  try {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'dawn';
    if (hour >= 11 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  } catch {
    return 'day';
  }
}

export function getDefaultLoreContext(overrides = {}) {
  return {
    ...DEFAULT_CONTEXT,
    timeOfDay: getLocalTimeOfDay(),
    weather: 'clear',
    tideState: 'turning',
    ...overrides
  };
}

function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function matchesArrayCondition(conditionValues, contextValue) {
  const cond = asArray(conditionValues);
  if (!cond.length) return true;
  const ctx = asArray(contextValue);
  if (!ctx.length) return false;
  return cond.some((value) => ctx.includes(value));
}

function matchesScalarCondition(conditionValue, contextValue) {
  if (contextValue == null) return false;
  return conditionValue === contextValue;
}

function matchesConditions(seedConditions = {}, context = {}) {
  if (!seedConditions || Object.keys(seedConditions).length === 0) return true;
  return Object.entries(seedConditions).every(([key, value]) => {
    if (key.endsWith('Min')) {
      const field = key.slice(0, -3);
      const ctxValue = context[field];
      return typeof ctxValue === 'number' && ctxValue >= value;
    }
    if (key.endsWith('Max')) {
      const field = key.slice(0, -3);
      const ctxValue = context[field];
      return typeof ctxValue === 'number' && ctxValue <= value;
    }
    if (Array.isArray(value)) {
      return matchesArrayCondition(value, context[key]);
    }
    if (typeof value === 'boolean') {
      if (context[key] == null) return false;
      return context[key] === value;
    }
    return matchesScalarCondition(value, context[key]);
  });
}

function matchesRegions(seed, regionId) {
  if (!regionId) return true;
  const regions = asArray(seed.regions || []);
  if (!regions.length) return true;
  return regions.includes(regionId);
}

function matchesUi(seed, uiTarget) {
  if (!uiTarget) return true;
  const uis = asArray(seed.ui || []);
  if (!uis.length) return false;
  return uis.includes(uiTarget);
}

export function selectLoreSeeds({
  regionId = null,
  ui = null,
  context = {},
  limit = 6,
  cluster = null,
  type = null,
  tags = null
} = {}) {
  const resolvedContext = { ...context, regionId };
  const seeds = loreSeedData?.loreSeeds || [];
  const filtered = seeds.filter((seed) => {
    if (!matchesRegions(seed, regionId)) return false;
    if (!matchesUi(seed, ui)) return false;
    if (cluster) {
      const clusters = asArray(cluster);
      if (!clusters.includes(seed.cluster)) return false;
    }
    if (type) {
      const types = asArray(type);
      if (!types.includes(seed.type)) return false;
    }
    if (tags) {
      const tagList = asArray(tags);
      const seedTags = asArray(seed.tags || []);
      if (!tagList.some((tag) => seedTags.includes(tag))) return false;
    }
    return matchesConditions(seed.conditions, resolvedContext);
  });
  return filtered.slice(0, limit);
}

export function selectAudioClips({
  regionId = null,
  context = {},
  limit = 10
} = {}) {
  const resolvedContext = { ...context, regionId };
  const clips = loreSeedData?.audioClips || [];
  const filtered = clips.filter((clip) => {
    if (!matchesRegions(clip, regionId)) return false;
    return matchesConditions(clip.conditions, resolvedContext);
  });
  return filtered.slice(0, limit);
}

export function getLoreSeedSources() {
  return loreSeedData?.sources || [];
}

export function getOrganismAnalogs() {
  return loreSeedData?.organismAnalogs || [];
}

export function selectOrganismAnalogsByRegion({ regionId = null, limit = 6 } = {}) {
  const analogs = getOrganismAnalogs();
  if (!regionId) return analogs.slice(0, limit);
  const filtered = analogs.filter((analog) =>
    (analog?.regions || []).includes(regionId)
  );
  return filtered.slice(0, limit);
}
