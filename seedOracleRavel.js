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

async function seedRavelOracle() {
  const batch = db.batch();

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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
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
