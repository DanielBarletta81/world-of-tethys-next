/**
 * Tethys Cloud Functions — DNA derivation pipeline
 *
 * Deploy:
 *   cd functions && npm install && firebase deploy --only functions
 *
 * Requires in functions/package.json:
 *   "firebase-functions": "^5.x",
 *   "firebase-admin": "^12.x"
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

if (!getApps().length) initializeApp();
const db = getFirestore();

// ── Constants ──────────────────────────────────────────────────────────────────
// Mirrors lineage-registry.js STARTING_WEIGHTS keys
const LINEAGE_SYMBOLS = ['T', 'S', 'C', 'M'];

// Decay factor: each new event shifts weights by at most this fraction
// Keeps early traits "sticky" while still allowing long-term drift
const WEIGHT_LEARNING_RATE = 0.06;

// Minimum weight any faction can reach (prevents total suppression)
const MIN_FACTION_WEIGHT = 0.04;

// ── Hybrid expression thresholds ─────────────────────────────────────────────
const HYBRID_THRESHOLDS = [
  { id: 'thal-silurian',        requires: { T: 0.35, S: 0.35 } },
  { id: 'silurian-mystic',      requires: { S: 0.35, M: 0.35 } },
  { id: 'thal-mystic',          requires: { T: 0.35, M: 0.35 } },
  { id: 'triumvirate-thal',     requires: { C: 0.35, T: 0.35 } },
  { id: 'all-four',             requires: { T: 0.20, S: 0.20, C: 0.20, M: 0.20 } },
];

// ── Dominant lineage label from weights ───────────────────────────────────────
function dominantLineage(weights) {
  let best = 'T';
  for (const sym of LINEAGE_SYMBOLS) {
    if ((weights[sym] ?? 0) > (weights[best] ?? 0)) best = sym;
  }
  const MAP = { T: 'thal', S: 'silurian', C: 'triumvirate', M: 'mystic' };
  return MAP[best] ?? 'thal';
}

// ── Active hybrid expressions ─────────────────────────────────────────────────
function activeHybrids(weights) {
  return HYBRID_THRESHOLDS
    .filter(({ requires }) =>
      Object.entries(requires).every(([sym, threshold]) => (weights[sym] ?? 0) >= threshold)
    )
    .map(({ id }) => id);
}

// ── Normalize weights so they sum to 1.0 ─────────────────────────────────────
function normalize(weights) {
  const total = LINEAGE_SYMBOLS.reduce((sum, s) => sum + (weights[s] ?? 0), 0);
  if (total === 0) return { T: 0.25, S: 0.25, C: 0.25, M: 0.25 };
  const out = {};
  for (const s of LINEAGE_SYMBOLS) {
    out[s] = Math.max(MIN_FACTION_WEIGHT, (weights[s] ?? 0) / total);
  }
  // Re-normalize after clamping
  const total2 = LINEAGE_SYMBOLS.reduce((sum, s) => sum + out[s], 0);
  for (const s of LINEAGE_SYMBOLS) out[s] = out[s] / total2;
  return out;
}

// ── Plate coverage tier from Silurian weight ─────────────────────────────────
function siluriianPlateTier(sWeight) {
  if (sWeight >= 0.70) return 6;
  if (sWeight >= 0.55) return 5;
  if (sWeight >= 0.42) return 4;
  if (sWeight >= 0.30) return 3;
  if (sWeight >= 0.18) return 2;
  if (sWeight >= 0.08) return 1;
  return 0;
}

// ── Event type multipliers (mirrors DWELL_EVENT_TYPES dnaMultiplier) ─────────
const EVENT_MULTIPLIERS = {
  dwell_threshold:  1.2,
  deep_dwell:       1.8,
  reread_event:     2.0,
  survive_event:    3.0,
  discovery_event:  1.5,
  sequence_event:   4.0,
};

// ─────────────────────────────────────────────────────────────────────────────
// CLOUD FUNCTION: onDnaEventCreated
//
// Triggers on every new dnaEvent written by the client.
// Reads the last N events, recomputes faction weights, writes playerProfiles.
// ─────────────────────────────────────────────────────────────────────────────
exports.onDnaEventCreated = onDocumentCreated(
  'players/{userId}/dnaEvents/{eventId}',
  async (event) => {
    const { userId } = event.params;
    const newEvent = event.data?.data() ?? {};

    // ── 1. Read current profile (or create defaults) ──────────────────────
    const profileRef = db.collection('playerProfiles').doc(userId);
    const profileSnap = await profileRef.get();

    const existing = profileSnap.exists ? profileSnap.data() : null;
    const currentWeights = existing?.factionWeights ?? { T: 0.25, S: 0.25, C: 0.25, M: 0.25 };
    const totalEvents = (existing?.totalEvents ?? 0) + 1;
    const discoveredRegions = new Set(existing?.discoveredRegions ?? []);
    const accolades = existing?.accolades ?? [];
    const galvanizedTraits = existing?.galvanizedTraits ?? [];

    // ── 2. Apply new event's DNA weights ─────────────────────────────────
    const eventWeights = newEvent.dnaWeights ?? {};
    const multiplier = EVENT_MULTIPLIERS[newEvent.eventType] ?? 1.0;

    // Weighted moving average: current × (1 - lr) + new × lr
    // Early events are stickier because lr shrinks as totalEvents grows
    const lr = WEIGHT_LEARNING_RATE * multiplier * Math.max(0.2, 1 / Math.sqrt(totalEvents));

    const updatedWeights = {};
    for (const sym of LINEAGE_SYMBOLS) {
      const current = currentWeights[sym] ?? 0.25;
      const incoming = eventWeights[sym] ?? 0;
      updatedWeights[sym] = current * (1 - lr) + incoming * lr;
    }
    const normalizedWeights = normalize(updatedWeights);

    // ── 3. Track discovered regions ───────────────────────────────────────
    if (newEvent.region) discoveredRegions.add(newEvent.region);

    // ── 4. Check for galvanize events ─────────────────────────────────────
    if (newEvent.eventType === 'survive_event') {
      const regionType = newEvent.metadata?.regionType ?? '';
      // Galvanize: Silurian surviving volcanic region
      if (normalizedWeights.S >= 0.35 && ['volcanic-core', 'dry-highland'].includes(regionType)) {
        if (!galvanizedTraits.includes('sil-heat-tempered-scute')) {
          galvanizedTraits.push('sil-heat-tempered-scute');
        }
      }
      // Galvanize: Thal surviving water region
      if (normalizedWeights.T >= 0.35 && ['deep-water', 'estuary'].includes(regionType)) {
        if (!galvanizedTraits.includes('thal-aquatic-predator-sense')) {
          galvanizedTraits.push('thal-aquatic-predator-sense');
        }
      }
      // Galvanize: Triumvirate surviving The Weep
      if (newEvent.region === 'the-weep' && normalizedWeights.C >= 0.35) {
        if (!galvanizedTraits.includes('tri-ground-truth')) {
          galvanizedTraits.push('tri-ground-truth');
        }
      }
      // Galvanize: Mystic surviving toxic event
      if (normalizedWeights.M >= 0.35 && ['toxic', 'anoxic'].includes(regionType)) {
        if (!galvanizedTraits.includes('mys-deep-signal')) {
          galvanizedTraits.push('mys-deep-signal');
        }
      }
    }

    // ── 5. Append accolade if applicable ─────────────────────────────────
    const ACCOLADE_MAP = {
      deep_dwell:       'field-notation-mark',
      reread_event:     'double-entry-glyph',
      survive_event:    'survival-scar',
      discovery_event:  'discovery-mark',
      sequence_event:   'chronicle-entry',
    };
    const newAccolade = ACCOLADE_MAP[newEvent.eventType];
    if (newAccolade) {
      accolades.push({
        type: newAccolade,
        region: newEvent.region ?? null,
        ts: Date.now(),
      });
    }

    // ── 6. Derive display-ready lineage fields ────────────────────────────
    const dominant = dominantLineage(normalizedWeights);
    const hybrids  = activeHybrids(normalizedWeights);
    const plateTier = siluriianPlateTier(normalizedWeights.S ?? 0);

    // ── 7. Write updated playerProfile (atomic) ───────────────────────────
    const profileUpdate = {
      factionWeights:    normalizedWeights,
      dominantLineage:   dominant,
      activeHybrids:     hybrids,
      siluriianPlateTier: plateTier,
      galvanizedTraits,
      totalEvents,
      discoveredRegions: Array.from(discoveredRegions),
      accolades:         accolades.slice(-100),   // keep last 100
      lastEventType:     newEvent.eventType ?? null,
      lastRegion:        newEvent.region ?? null,
      lastUpdated:       FieldValue.serverTimestamp(),
    };

    // Merge — don't overwrite fields the bootstrap route manages (latestDna, glyphHistory etc.)
    await profileRef.set(profileUpdate, { merge: true });

    console.log(
      `[tethys-dna] ${userId} updated: dominant=${dominant} weights=${JSON.stringify(normalizedWeights)} hybrids=${hybrids.join(',') || 'none'}`
    );
  }
);
