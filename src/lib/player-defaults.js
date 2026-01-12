export const DEFAULT_PLAYER_PROFILE = {
  version: 1,
  createdAt: null,
  lastLoginAt: null,
  eventCount: 0,
  rumorCount: 0,
  identity: {
    handle: 'Ghost Ward',
    title: 'Watcher-in-Training',
    portrait: { base: 'ember_slate_v1', adornments: [] },
    voice: { preferredNarrator: 'ravel', muteVoiceovers: false }
  },
  history: {
    mediaConsumed: []
  },
  onboarding: { status: 'new', hatchedAt: null, starterLoadoutId: 'starter_v1', tutorialStep: 0 },
  path: {
    primary: 'mystic',
    declaredAt: null,
    mapAccess: true,
    doctrineFlags: { mysticModeEnabled: true, cityModeEnabled: false },
    accessLocks: {},
    history: []
  },
  perception: {
    mysticLevel: 0,
    cityBias: 0,
    wildSense: 0,
    stillness: 0,
    lastStillnessAt: null,
    unlockedLayers: ['atlas.base.clean.v1', 'overlay.fog.mystic.v1'],
    reliability: { mapTruth: 0.65, dangerSense: 0.4, labelNoise: 0.7 }
  },
  survivorship: {
    daysSurvived: 0,
    scars: [],
    imprints: { bruises: [], tracks: [] },
    moveCount: 0,
    bond: { focusType: 'none', strength: 0, lastBondAt: null, notes: '' },
    bondEncounter: {
      state: 'none',
      regionId: null,
      seed: null,
      spawnedAt: null,
      lastCheckAt: null,
      cooldownUntil: null,
      lastOutcome: null
    },
    lastFound: null
  },
  staff: {
    activeStaffId: null,
    stats: { geology: 0, creature: 0, lore: 0, human: 0, reliability: 1 },
    path: 'pteros',
    seed: 'KITH-EMBER-000',
    ornaments: [],
    variants: [],
    updatedAt: null
  },
  progression: {
    level: 1,
    xp: 0,
    regionUnlocks: {},
    weatherUnlocked: false,
    oracleConsultedAt: null,
    recentWhispers: { ids: [], updatedAt: null }
  },
  daily: {
    lastClaimAt: null,
    streak: 0,
    timezone: 'UTC',
    cooldowns: { whisperPullAt: null, forgeAt: null }
  },
  vr: {
    calibration: { worldScale: 1.0, handedness: 'right', comfortMode: 'standard' },
    lastPose: null
  }
};
// World of Tethys || D.C. Barletta
