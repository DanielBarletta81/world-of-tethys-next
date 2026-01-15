import 'dotenv/config';
import { getFirebaseAdmin } from '../src/lib/firebaseAdmin.js';

const { db } = getFirebaseAdmin();

const uid = process.argv[2];
const sigilId = process.argv[3] || 'starter_sigil';
const avatarType = process.argv[4] || 'sigil';
const creatureId = avatarType === 'creature' ? process.argv[5] || null : null;

if (!uid) {
  console.error('Usage: node scripts/seedGuideProfile.js <uid> [sigilId] [avatarType] [creatureId]');
  process.exit(1);
}

async function run() {
  const now = new Date().toISOString();
  const profilePatch = {
    guide: {
      sigilId,
      hatchedAt: now,
      avatarType,
      creatureId,
      swaps: [],
      adornments: ['sigil_hatched'],
      level: 1
    },
    progress: {
      timeOnSiteMs: 0,
      scrollDepthMax: 0,
      chaptersRead: 0,
      mapVisits: 0,
      hatchActions: 1,
      oracleConsults: 0,
      avatarSwaps: 0
    },
    adornmentUnlockedAt: {
      sigil_hatched: now
    },
    lastLoginAt: new Date().toISOString()
  };

  await db.collection('players').doc(uid).set(profilePatch, { merge: true });
  await db.collection('players').doc(uid).collection('events').add({
    type: 'GUIDE_SEEDED',
    at: now,
    sigilId,
    avatarType,
    creatureId
  });

  console.log(`Seeded guide profile for ${uid} with sigil=${sigilId}, avatar=${avatarType}${creatureId ? `, creature=${creatureId}` : ''}`);
}

run().catch((err) => {
  console.error('Failed to seed guide profile', err);
  process.exit(1);
});
