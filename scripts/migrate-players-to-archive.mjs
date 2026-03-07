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
  console.log(`Usage: node scripts/migrate-players-to-archive.mjs [options]

Options:
  --commit        Apply writes (default is dry-run)
  --overwrite     Overwrite existing userArchiveRecords
  --limit <n>     Limit number of players processed
  --verbose       Log each uid processed

Environment:
  FIREBASE_SERVICE_ACCOUNT_JSON (or _BASE64) preferred
  FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY fallback
  GOOGLE_APPLICATION_CREDENTIALS (path) fallback
  ARCHIVE_WORLD_YEAR (optional)
  ARCHIVE_CYCLE_PHASE (optional)
`);
  process.exit(0);
}

const DRY_RUN = !hasFlag('--commit');
const OVERWRITE = hasFlag('--overwrite');
const VERBOSE = hasFlag('--verbose');
const LIMIT = Number.parseInt(getArgValue('--limit') || '0', 10) || 0;

const VALID_CYCLE_PHASES = new Set(['stable', 'elevated', 'active']);
const VALID_CONTINUITY = new Set(['maintained', 'pre-active', 'lapsed']);
const VALID_CLEARANCE = new Set(['level1', 'level2', 'admin']);

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
    try {
      const jsonString = rawServiceAccount.includes('{')
        ? rawServiceAccount
        : Buffer.from(rawServiceAccount, 'base64').toString('utf8');
      const parsed = JSON.parse(jsonString);
      if (parsed?.private_key) parsed.private_key = normalizePrivateKey(parsed.private_key);
      const hasProject = !!(parsed.project_id || parsed.projectId);
      const hasEmail = !!(parsed.client_email || parsed.clientEmail);
      const hasKey = !!(parsed.private_key || parsed.privateKey);
      if (!hasProject || !hasEmail || !hasKey) {
        throw new Error('Service account JSON missing required fields.');
      }
      return admin.credential.cert(parsed);
    } catch (err) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON (or _BASE64).');
    }
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
        const decoded = Buffer.from(rawKey, 'base64').toString('utf8');
        privateKey = normalizePrivateKey(decoded);
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

const isValidPhase = (value) => VALID_CYCLE_PHASES.has(String(value));
const pickPhase = (value, fallback) => (isValidPhase(value) ? String(value) : fallback);
const pickContinuity = (value) =>
  VALID_CONTINUITY.has(String(value)) ? String(value) : 'maintained';
const pickClearance = (value) =>
  VALID_CLEARANCE.has(String(value)) ? String(value) : 'level1';

const toTimestamp = (value) => {
  if (value instanceof admin.firestore.Timestamp) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return admin.firestore.Timestamp.fromDate(value);
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return admin.firestore.Timestamp.fromDate(parsed);
    }
  }
  if (typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return admin.firestore.Timestamp.fromDate(parsed);
    }
  }
  return null;
};

function buildArchiveRecord(existing, player, defaults) {
  const now = admin.firestore.Timestamp.now();
  const createdAt =
    toTimestamp(existing?.createdAt) || toTimestamp(player?.createdAt) || now;
  const updatedAt =
    toTimestamp(existing?.updatedAt) || toTimestamp(player?.lastLoginAt) || createdAt;

  const clearanceCandidate = existing?.clearance ?? player?.clearance;
  const witnessedCandidate = existing?.witnessedMajorEvent ?? player?.witnessedMajorEvent;

  return {
    firstAccessWorldYear: Number.isInteger(existing?.firstAccessWorldYear)
      ? existing.firstAccessWorldYear
      : defaults.worldYear,
    firstAccessCyclePhase: pickPhase(existing?.firstAccessCyclePhase, defaults.cyclePhase),
    lastAccessWorldYear: Number.isInteger(existing?.lastAccessWorldYear)
      ? existing.lastAccessWorldYear
      : defaults.worldYear,
    lastSeenCyclePhase: pickPhase(existing?.lastSeenCyclePhase, defaults.cyclePhase),
    continuityTier: pickContinuity(existing?.continuityTier),
    clearance: pickClearance(clearanceCandidate),
    witnessedMajorEvent: typeof witnessedCandidate === 'boolean' ? witnessedCandidate : false,
    createdAt,
    updatedAt
  };
}

async function main() {
  initAdmin();
  const db = admin.firestore();

  const worldStateSnap = await db.collection('worldState').doc('current').get();
  const worldState = worldStateSnap.exists ? worldStateSnap.data() : null;

  let defaultWorldYear = Number.parseInt(process.env.ARCHIVE_WORLD_YEAR || '', 10);
  if (!Number.isInteger(defaultWorldYear) && Number.isInteger(worldState?.worldYear)) {
    defaultWorldYear = worldState.worldYear;
  }
  if (!Number.isInteger(defaultWorldYear)) defaultWorldYear = 111000000;

  let defaultCyclePhase = process.env.ARCHIVE_CYCLE_PHASE;
  if (!isValidPhase(defaultCyclePhase) && isValidPhase(worldState?.cyclePhase)) {
    defaultCyclePhase = worldState.cyclePhase;
  }
  if (!isValidPhase(defaultCyclePhase)) defaultCyclePhase = 'elevated';

  console.log(
    `Defaults: worldYear=${defaultWorldYear} cyclePhase=${defaultCyclePhase} (dry-run=${DRY_RUN})`
  );

  let query = db.collection('players');
  if (LIMIT > 0) query = query.limit(LIMIT);
  const playersSnap = await query.get();

  let batch = db.batch();
  let pending = 0;
  let created = 0;
  let skipped = 0;
  let updated = 0;

  for (const doc of playersSnap.docs) {
    const uid = doc.id;
    const playerData = doc.data() || {};
    const archiveRef = db.collection('userArchiveRecords').doc(uid);
    const archiveSnap = await archiveRef.get();

    if (archiveSnap.exists && !OVERWRITE) {
      skipped += 1;
      if (VERBOSE) console.log(`skip ${uid} (exists)`);
      continue;
    }

    const archiveData = archiveSnap.exists ? archiveSnap.data() || {} : {};
    const record = buildArchiveRecord(archiveData, playerData, {
      worldYear: defaultWorldYear,
      cyclePhase: defaultCyclePhase
    });

    if (DRY_RUN) {
      if (VERBOSE) console.log(`dry-run ${uid}`);
    } else {
      batch.set(archiveRef, record);
      pending += 1;
      if (pending >= 400) {
        await batch.commit();
        batch = db.batch();
        pending = 0;
      }
    }

    if (archiveSnap.exists) updated += 1;
    else created += 1;
  }

  if (!DRY_RUN && pending > 0) {
    await batch.commit();
  }

  console.log(
    `Done. created=${created} updated=${updated} skipped=${skipped} total=${playersSnap.size}`
  );
  if (DRY_RUN) {
    console.log('Dry-run complete. Re-run with --commit to apply.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
