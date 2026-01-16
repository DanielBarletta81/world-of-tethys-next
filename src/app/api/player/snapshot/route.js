import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/requireSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const payload = await req.json();
    const { db } = getFirebaseAdmin();

    await db
      .collection('players')
      .doc(uid)
      .set(
        {
          ...payload,
          lastLoginAt: new Date().toISOString()
        },
        { merge: true }
      );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error.status || 401;
    return NextResponse.json({ error: 'Unauthorized' }, { status });
  }
}
