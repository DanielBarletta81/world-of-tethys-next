import 'dotenv/config';
import { getFirebaseAdmin } from '../src/lib/firebaseAdmin.js';
import { BESTIARY } from '../src/data/bestiary.js';

const { db } = getFirebaseAdmin();
const collectionName = 'bestiaryEntries';

// Simple helper to make a stable id
const toId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// Lightweight marker generator to mimic microsatellite strings
const markersFor = (name) => {
  const base = toId(name);
  return [`microsat_${base}_a1`, `microsat_${base}_b2`, `microsat_${base}_c3`];
};

// Map BESTIARY era to our Data Connect archetype
const archetypeForEra = (era) => {
  if (!era) return 'TETHYS_SURVIVOR';
  const key = era.toLowerCase();
  if (key.includes('sky')) return 'TETHYS_SKY';
  if (key.includes('deep')) return 'TETHYS_DEEP';
  if (key.includes('apex') || key.includes('titan')) return 'TETHYS_WARDEN';
  return 'TETHYS_SURVIVOR';
};

// Cycle through sedimentary-inspired rarities
const RARITIES = ['SILT', 'SHALE', 'LIMESTONE', 'CHALK', 'BASALT', 'AMBER'];
const rarityForIndex = (i) => RARITIES[i % RARITIES.length];

async function run() {
  const batch = db.batch();
  let idx = 0;
  BESTIARY.forEach((era) => {
    (era.entries || []).forEach((entry) => {
      const id = toId(entry.name);
      const ref = db.collection(collectionName).doc(id);
      const archetype = archetypeForEra(era.era);
      const rarity = rarityForIndex(idx++);
      batch.set(ref, {
        id,
        name: entry.name,
        era: era.era,
        tag: entry.tag || null,
        niche: entry.niche || null,
        science: entry.science || null,
        imageUrl: entry.image || null,
        archetype,
        rarity,
        microsatelliteMarkers: markersFor(entry.name),
        createdAt: new Date().toISOString()
      });
    });
  });

  await batch.commit();
  console.log(`Seeded ${BESTIARY.reduce((sum, era) => sum + (era.entries?.length || 0), 0)} bestiary entries into ${collectionName}`);
}

run().catch((err) => {
  console.error('Failed to seed bestiary entries', err);
  process.exit(1);
});
