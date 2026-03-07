import admin from 'firebase-admin';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/requireSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

const VALID_CYCLE_PHASES = new Set(['stable', 'elevated', 'active']);
const VALID_CONTINUITY = new Set(['maintained', 'pre-active', 'lapsed']);
const VALID_CLEARANCE = new Set(['level1', 'level2', 'admin']);

const normalizeString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const pickPhase = (value: unknown, fallback: string) =>
  VALID_CYCLE_PHASES.has(String(value)) ? String(value) : fallback;

const pickContinuity = (value: unknown) =>
  VALID_CONTINUITY.has(String(value)) ? String(value) : 'maintained';

const pickClearance = (value: unknown) =>
  VALID_CLEARANCE.has(String(value)) ? String(value) : 'level1';

const pickBoolean = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback;

const isTimestamp = (value: unknown) => value instanceof admin.firestore.Timestamp;

function buildArchiveRecord(
  existing: Record<string, any>,
  worldYear: number,
  cyclePhase: string,
  now: admin.firestore.FieldValue
) {
  const firstAccessWorldYear = Number.isInteger(existing?.firstAccessWorldYear)
    ? existing.firstAccessWorldYear
    : worldYear;
  const firstAccessCyclePhase = pickPhase(existing?.firstAccessCyclePhase, cyclePhase);
  const continuityTier = pickContinuity(existing?.continuityTier);
  const clearance = pickClearance(existing?.clearance);
  const witnessedMajorEvent = pickBoolean(existing?.witnessedMajorEvent, false);
  const createdAt = isTimestamp(existing?.createdAt) ? existing.createdAt : now;

  return {
    firstAccessWorldYear,
    firstAccessCyclePhase,
    lastAccessWorldYear: worldYear,
    lastSeenCyclePhase: cyclePhase,
    continuityTier,
    clearance,
    witnessedMajorEvent,
    createdAt,
    updatedAt: now
  };
}

export async function POST(req: Request) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const payload = await req.json();

    const action = normalizeString(payload?.action);
    const locationId = normalizeString(payload?.locationId);
    if (!action || !locationId) {
      return NextResponse.json({ error: 'Invalid map interaction payload.' }, { status: 400 });
    }

    const { db } = getFirebaseAdmin();
    const worldStateSnap = await db.collection('worldState').doc('current').get();
    const worldState = worldStateSnap.exists ? worldStateSnap.data() : null;

    let worldYear = Number.isInteger(payload?.worldYear) ? payload.worldYear : null;
    let cyclePhase = VALID_CYCLE_PHASES.has(payload?.cyclePhase) ? payload.cyclePhase : null;

    if (worldState) {
      if (Number.isInteger(worldState.worldYear)) worldYear = worldState.worldYear;
      if (VALID_CYCLE_PHASES.has(worldState.cyclePhase)) cyclePhase = worldState.cyclePhase;
    }

    if (!Number.isInteger(worldYear) || !VALID_CYCLE_PHASES.has(String(cyclePhase))) {
      return NextResponse.json(
        { error: 'World state unavailable. Seed worldState/current first.' },
        { status: 409 }
      );
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const archiveRef = db.collection('userArchiveRecords').doc(uid);
    const interactionRef = archiveRef.collection('mapInteractions').doc();

    await db.runTransaction(async (tx) => {
      const archiveSnap = await tx.get(archiveRef);
      const existing = archiveSnap.exists ? archiveSnap.data() || {} : {};
      const archiveRecord = buildArchiveRecord(existing, worldYear, cyclePhase, now);

      tx.set(archiveRef, archiveRecord);
      tx.set(interactionRef, {
        action,
        locationId,
        worldYear,
        cyclePhase,
        recordedAt: now
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Map interaction failed';
    return NextResponse.json({ error: message }, { status });
  }
}
