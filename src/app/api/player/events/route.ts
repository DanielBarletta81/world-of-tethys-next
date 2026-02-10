import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { requireSession } from '@/lib/auth/requireSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const { db } = getFirebaseAdmin();
    const { searchParams } = new URL(req.url);
    const limitParam = Number(searchParams.get('limit') || '100');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 100;
    const startAfterValue = searchParams.get('startAfter');
    const startAfterId = searchParams.get('startAfterId');
    const type = searchParams.get('type');
    const regionId = searchParams.get('regionId');
    const since = searchParams.get('since');
    const until = searchParams.get('until');

    let query: any = db
      .collection('players')
      .doc(uid)
      .collection('events');

    if (type) {
      query = query.where('type', '==', type);
    }
    if (regionId) {
      query = query.where('regionId', '==', regionId);
    }
    if (since) {
      query = query.where('createdAt', '>=', since);
    }
    if (until) {
      query = query.where('createdAt', '<=', until);
    }

    query = query.orderBy('createdAt', 'desc');
    if (startAfterId) {
      const cursorSnap = await db
        .collection('players')
        .doc(uid)
        .collection('events')
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
    const nextCursor = items.length ? lastItem?.createdAt || null : null;
    const nextCursorId = items.length ? lastItem?.id || null : null;
    return NextResponse.json({ items, nextCursor, nextCursorId });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Events fetch failed';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const payload = await req.json();
    const { db } = getFirebaseAdmin();

    const nowIso = new Date().toISOString();
    const event = {
      ...payload,
      at: payload.at || nowIso,
      createdAt: payload.createdAt || nowIso,
      updatedAt: nowIso
    };

    await db.runTransaction(async (tx) => {
      const eventRef = db.collection('players').doc(uid).collection('events').doc();
      const playerRef = db.collection('players').doc(uid);
      tx.set(eventRef, event);
      tx.set(playerRef, { eventCount: admin.firestore.FieldValue.increment(1) }, { merge: true });
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Event log failed';
    return NextResponse.json({ error: message }, { status });
  }
}
