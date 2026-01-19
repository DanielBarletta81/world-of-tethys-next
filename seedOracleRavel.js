/**
 * Firestore batch seeder for Ravel Oracle Pool.
 * Run with: GOOGLE_APPLICATION_CREDENTIALS=/path/to/creds.json node seedOracleRavel.js
 * Idempotent via merge on meta + per-doc overwrite of responses.
 */

const admin = require("firebase-admin");
const seeder = require("./oracle_pool/ravel_seeder.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

async function seedRavelOracle() {
  const batch = db.batch();
  const weekKey = isoWeekKey();

  // meta/config doc
  const metaRef = db.doc("oracle/seeders/ravel_v1");
  batch.set(
    metaRef,
    {
      id: seeder.id,
      speaker: seeder.speaker,
      tone: seeder.tone,
      rules: seeder.rules,
      selectors: seeder.selectors,
      fallback: seeder.fallback,
      version: 1,
      weekKey,
      seededAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // responses collection
  (seeder.responses || []).forEach((resp) => {
    const ref = db.doc(`oracle/responses/${resp.id}`);
    batch.set(ref, {
      ...resp,
      speaker: seeder.speaker,
      version: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`✅ Seeded Ravel Oracle (${seeder.responses.length} responses)`);
}

seedRavelOracle().catch((err) => {
  console.error("Seeder failed:", err);
  process.exit(1);
});

// World of Tethys || D.C. Barletta
