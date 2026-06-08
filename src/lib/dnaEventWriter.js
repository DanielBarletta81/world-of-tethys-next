/**
 * dnaEventWriter — client-side Firestore writer for dnaEvents.
 *
 * Writes to: players/{userId}/dnaEvents/{eventId}
 *
 * The Cloud Function reads these and derives the player's DNA profile.
 * This module is the only place client code touches Firestore directly.
 * It is intentionally fire-and-forget — no await at the call site.
 */

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { REGION_DNA_WEIGHTS } from '@/data/lineage-registry';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

function getDb() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

/**
 * @param {object} params
 * @param {string}  params.userId      — Firebase Auth uid
 * @param {string}  params.regionId    — region slug (matches REGION_DNA_WEIGHTS keys)
 * @param {string}  params.eventType   — 'dwell_threshold' | 'deep_dwell' | 'reread_event' |
 *                                       'survive_event' | 'discovery_event' | 'sequence_event'
 * @param {string}  [params.pathMode]  — 'wild' | 'city' | 'mystic'
 * @param {number}  [params.envPressure] — 0-1 float; passed to DNA seed derivation
 * @param {object}  [params.metadata]  — optional extra context
 */
export async function writeDnaEvent({
  userId,
  regionId,
  eventType,
  pathMode = 'wild',
  envPressure = 0,
  metadata = {},
}) {
  if (!userId || !regionId) return;

  const dnaWeights = REGION_DNA_WEIGHTS[regionId] ?? null;

  const event = {
    region:      regionId,
    eventType,
    pathMode,
    envPressure: Math.max(0, Math.min(1, envPressure)),
    dnaWeights,            // faction weights for this region — read by Cloud Function
    coordinates: metadata.coordinates ?? { x: 0, y: 0 },
    metadata: {
      ...metadata,
      clientTs: Date.now(),
    },
    timestamp: serverTimestamp(),
  };

  try {
    const db = getDb();
    const ref = collection(db, 'players', userId, 'dnaEvents');
    await addDoc(ref, event);
  } catch (err) {
    // Non-fatal — progression events should never crash the map
    console.warn('[dnaEventWriter] Failed to write event:', err?.message ?? err);
  }
}
