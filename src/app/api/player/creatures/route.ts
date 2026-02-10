import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/requireSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const { db } = getFirebaseAdmin();
    const { searchParams } = new URL(req.url);
    const limitParam = Number(searchParams.get('limit') || '200');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 200;
    const startAfterValue = searchParams.get('startAfter');
    const startAfterId = searchParams.get('startAfterId');
    const archetype = searchParams.get('archetype');

    let query: any = db
      .collection('players')
      .doc(uid)
      .collection('creatures');

    if (archetype) {
      query = query.where('archetype', '==', archetype);
    }

    query = query.orderBy('updatedAt', 'desc');
    if (startAfterId) {
      const cursorSnap = await db
        .collection('players')
        .doc(uid)
        .collection('creatures')
        .doc(startAfterId)
        .get();
      if (cursorSnap.exists) {
        query = query.startAfter(cursorSnap);
      }
    } else if (startAfterValue) {
      query = query.startAfter(startAfterValue);
    }

    const snap = await query.limit(limit).get();

    const items = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })) as any[];
    const lastItem = items[items.length - 1];
    const nextCursor = items.length ? lastItem?.updatedAt || null : null;
    const nextCursorId = items.length ? lastItem?.id || null : null;
    return NextResponse.json({ items, nextCursor, nextCursorId });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Creatures fetch failed';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const payload = await req.json();
    const { db } = getFirebaseAdmin();

    const creatureId = payload.creatureId || payload.id || `${Date.now()}`;
    const nowIso = new Date().toISOString();
    const creature = {
      ...payload,
      creatureId,
      updatedAt: nowIso,
      createdAt: payload.createdAt || nowIso
    };

    await db
      .collection('players')
      .doc(uid)
      .collection('creatures')
      .doc(creatureId)
      .set(creature, { merge: true });

    return NextResponse.json({ ok: true, creatureId });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Creature upsert failed';
    return NextResponse.json({ error: message }, { status });
  }
}
