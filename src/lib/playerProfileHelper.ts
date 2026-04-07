import { getFirebaseAdmin } from './firebaseAdmin';
import { DEFAULT_PLAYER_PROFILE } from './player-defaults.js';

/**
 * Ensures a player profile exists and seeds guide/progress defaults if missing.
 * Call this from server-only contexts (API routes/server actions) with a trusted uid.
 */
export async function ensurePlayerProfile(uid, overrides = {}) {
  if (!uid) throw new Error('ensurePlayerProfile: uid required');

  const { db } = getFirebaseAdmin();
  const ref = db.collection('players').doc(uid);
  const snap = await ref.get();

  const base = {
    ...DEFAULT_PLAYER_PROFILE,
    onboarding: { ...DEFAULT_PLAYER_PROFILE.onboarding, status: 'new' },
    guide: { ...DEFAULT_PLAYER_PROFILE.guide },
    progress: { ...DEFAULT_PLAYER_PROFILE.progress },
    progression: { ...DEFAULT_PLAYER_PROFILE.progression },
    dna: { ...DEFAULT_PLAYER_PROFILE.dna },
    aura: { ...DEFAULT_PLAYER_PROFILE.aura },
    protection: { ...DEFAULT_PLAYER_PROFILE.protection },
    drift: { ...DEFAULT_PLAYER_PROFILE.drift },
    adornmentUnlockedAt: {},
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  if (!snap.exists) {
    await ref.set({ ...base, ...overrides });
    return { created: true, data: { ...base, ...overrides } };
  }

  const data = snap.data() || {};
  const patch = {
    lastLoginAt: new Date().toISOString(),
    history: {
      ...base.history,
      ...(data.history || {})
    },
    guide: data.guide || base.guide,
    progress: data.progress || base.progress,
    progression: {
      ...base.progression,
      ...(data.progression || {})
    },
    dna: data.dna || base.dna,
    aura: data.aura || base.aura,
    protection: data.protection || base.protection,
    drift: data.drift || base.drift,
    marketing: {
      ...base.marketing,
      ...(data.marketing || {}),
      newsletter: {
        ...(base.marketing?.newsletter || {}),
        ...(data.marketing?.newsletter || {})
      }
    },
    adornmentUnlockedAt: data.adornmentUnlockedAt || {}
  };

  await ref.set({ ...patch, ...overrides }, { merge: true });
  return { created: false, data: { ...data, ...patch, ...overrides } };
}
