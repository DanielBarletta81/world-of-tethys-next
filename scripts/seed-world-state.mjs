#!/usr/bin/env node
import fs from 'node:fs';
import admin from 'firebase-admin';

const argv = process.argv.slice(2);
const hasFlag = (flag) => argv.includes(flag);
const getArgValue = (flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : null;
};

if (hasFlag('--help')) {
  console.log(`Usage: node scripts/seed-world-state.mjs [options]

Options:
  --commit        Apply write (default is dry-run)
  --overwrite     Overwrite if worldState/current exists
  --worldYear <n>
  --cyclePhase <stable|elevated|active>
  --season <migration|ashfall|tide>
  --migrationIntensity <low|moderate|high>
  --particulateLevel <low|moderate|severe>
  --seismicActivity <minimal|elevated|escalating>
  --minorShiftIndex <n>
  --majorEventFlag <string|null>

Environment (optional overrides):
  WORLD_STATE_WORLD_YEAR
  WORLD_STATE_CYCLE_PHASE
  WORLD_STATE_SEASON
  WORLD_STATE_MIGRATION_INTENSITY
  WORLD_STATE_PARTICULATE_LEVEL
  WORLD_STATE_SEISMIC_ACTIVITY
  WORLD_STATE_MINOR_SHIFT_INDEX
  WORLD_STATE_MAJOR_EVENT_FLAG
`);
  process.exit(0);
}

const DRY_RUN = !hasFlag('--commit');
const OVERWRITE = hasFlag('--overwrite');

const VALID_CYCLE_PHASES = new Set(['stable', 'elevated', 'active']);
const VALID_SEASONS = new Set(['migration', 'ashfall', 'tide']);
const VALID_INTENSITY = new Set(['low', 'moderate', 'high']);
const VALID_PARTICULATE = new Set(['low', 'moderate', 'severe']);
const VALID_SEISMIC = new Set(['minimal', 'elevated', 'escalating']);

function normalizePrivateKey(key) {
  return String(key)
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .trim()
    .replace(/^"|"$/g, '');
}

function loadCredential() {
  const rawServiceAccount =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;

  if (rawServiceAccount) {
    const jsonString = rawServiceAccount.includes('{')
      ? rawServiceAccount
      : Buffer.from(rawServiceAccount, 'base64').toString('utf8');
    const parsed = JSON.parse(jsonString);
    if (parsed?.private_key) parsed.private_key = normalizePrivateKey(parsed.private_key);
    return admin.credential.cert(parsed);
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_BASE64;

  let privateKey;
  if (rawKey) {
    if (rawKey.includes('BEGIN PRIVATE KEY')) {
      privateKey = normalizePrivateKey(rawKey);
    } else {
      try {
        privateKey = normalizePrivateKey(Buffer.from(rawKey, 'base64').toString('utf8'));
      } catch {
        privateKey = normalizePrivateKey(rawKey);
      }
    }
  }

  if (projectId && clientEmail && privateKey) {
    return admin.credential.cert({ projectId, clientEmail, privateKey });
  }

  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const fileJson = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    if (fileJson?.private_key) {
      fileJson.private_key = normalizePrivateKey(fileJson.private_key);
    }
    return admin.credential.cert(fileJson);
  }

  throw new Error('Missing Firebase Admin credentials.');
}

function initAdmin() {
  if (admin.apps.length > 0) return admin.app();
  admin.initializeApp({ credential: loadCredential() });
  return admin.app();
}

const pickEnv = (key) => {
  const value = process.env[key];
  return value === undefined ? null : value;
};

const pickString = (cliValue, envKey, fallback) => {
  const envValue = pickEnv(envKey);
  return cliValue ?? envValue ?? fallback;
};

const pickInt = (cliValue, envKey, fallback) => {
  const raw = cliValue ?? pickEnv(envKey);
  const parsed = Number.parseInt(raw ?? '', 10);
  return Number.isInteger(parsed) ? parsed : fallback;
};

const toMajorEventFlag = (cliValue, envKey) => {
  const raw = cliValue ?? pickEnv(envKey);
  if (raw === null || raw === undefined) return null;
  const trimmed = String(raw).trim();
  if (!trimmed || trimmed.toLowerCase() === 'null') return null;
  return trimmed;
};

const defaults = {
  worldYear: 111000000,
  cyclePhase: 'elevated',
  season: 'migration',
  migrationIntensity: 'moderate',
  particulateLevel: 'moderate',
  seismicActivity: 'escalating',
  minorShiftIndex: 3,
  majorEventFlag: null
};

const worldYear = pickInt(getArgValue('--worldYear'), 'WORLD_STATE_WORLD_YEAR', defaults.worldYear);
const cyclePhase = pickString(getArgValue('--cyclePhase'), 'WORLD_STATE_CYCLE_PHASE', defaults.cyclePhase);
const season = pickString(getArgValue('--season'), 'WORLD_STATE_SEASON', defaults.season);
const migrationIntensity = pickString(
  getArgValue('--migrationIntensity'),
  'WORLD_STATE_MIGRATION_INTENSITY',
  defaults.migrationIntensity
);
const particulateLevel = pickString(
  getArgValue('--particulateLevel'),
  'WORLD_STATE_PARTICULATE_LEVEL',
  defaults.particulateLevel
);
const seismicActivity = pickString(
  getArgValue('--seismicActivity'),
  'WORLD_STATE_SEISMIC_ACTIVITY',
  defaults.seismicActivity
);
const minorShiftIndex = pickInt(
  getArgValue('--minorShiftIndex'),
  'WORLD_STATE_MINOR_SHIFT_INDEX',
  defaults.minorShiftIndex
);
const majorEventFlag = toMajorEventFlag(getArgValue('--majorEventFlag'), 'WORLD_STATE_MAJOR_EVENT_FLAG');

if (!VALID_CYCLE_PHASES.has(cyclePhase)) {
  throw new Error(`Invalid cyclePhase: ${cyclePhase}`);
}
if (!VALID_SEASONS.has(season)) {
  throw new Error(`Invalid season: ${season}`);
}
if (!VALID_INTENSITY.has(migrationIntensity)) {
  throw new Error(`Invalid migrationIntensity: ${migrationIntensity}`);
}
if (!VALID_PARTICULATE.has(particulateLevel)) {
  throw new Error(`Invalid particulateLevel: ${particulateLevel}`);
}
if (!VALID_SEISMIC.has(seismicActivity)) {
  throw new Error(`Invalid seismicActivity: ${seismicActivity}`);
}

async function main() {
  initAdmin();
  const db = admin.firestore();

  const ref = db.collection('worldState').doc('current');
  const snap = await ref.get();
  if (snap.exists && !OVERWRITE) {
    console.log('worldState/current already exists. Re-run with --overwrite to replace.');
    process.exit(0);
  }

  const payload = {
    worldYear,
    cyclePhase,
    season,
    migrationIntensity,
    particulateLevel,
    seismicActivity,
    minorShiftIndex,
    majorEventFlag,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  console.log(`Seeding worldState/current (dry-run=${DRY_RUN})`);
  console.log(JSON.stringify({ ...payload, updatedAt: '<serverTimestamp>' }, null, 2));

  if (DRY_RUN) {
    console.log('Dry-run complete. Re-run with --commit to apply.');
    return;
  }

  await ref.set(payload);
  console.log('Seeded worldState/current.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
