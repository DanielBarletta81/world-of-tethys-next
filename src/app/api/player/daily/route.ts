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
    const dateKey = searchParams.get('date');
    const limitParam = Number(searchParams.get('limit') || '30');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 30;
    const startAfterValue = searchParams.get('startAfter');
    const startAfterId = searchParams.get('startAfterId');
    const since = searchParams.get('since');
    const until = searchParams.get('until');

    if (dateKey) {
      const snap = await db
        .collection('players')
        .doc(uid)
        .collection('daily')
        .doc(dateKey)
        .get();
      return NextResponse.json({ item: snap.exists ? { id: snap.id, ...snap.data() } : null });
    }

    let query: any = db
      .collection('players')
      .doc(uid)
      .collection('daily');

    if (since) {
      query = query.where('date', '>=', since);
    }
    if (until) {
      query = query.where('date', '<=', until);
    }

    query = query.orderBy('date', 'desc');
    if (startAfterId) {
      const cursorSnap = await db
        .collection('players')
        .doc(uid)
        .collection('daily')
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
    const nextCursor = items.length ? lastItem?.date || null : null;
    const nextCursorId = items.length ? lastItem?.id || null : null;
    return NextResponse.json({ items, nextCursor, nextCursorId });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Daily fetch failed';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const payload = await req.json();
    const { db } = getFirebaseAdmin();

    const dateKey = payload.date || payload.dateKey;
    if (!dateKey) {
      return NextResponse.json({ error: 'Missing date key' }, { status: 400 });
    }

    await db
      .collection('players')
      .doc(uid)
      .collection('daily')
      .doc(dateKey)
      .set(
        {
          ...payload,
          date: dateKey,
          claimedAt: payload.claimedAt || new Date().toISOString()
        },
        { merge: true }
      );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Daily log failed';
    return NextResponse.json({ error: message }, { status });
  }
}
