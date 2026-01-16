import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/requireSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const payload = await req.json();
    const entries = Array.isArray(payload.entries) ? payload.entries : [];

    if (!entries.length) {
      return NextResponse.json({ error: 'No observations provided' }, { status: 400 });
    }

    const { db } = getFirebaseAdmin();
    const batch = db.batch();
    const nowIso = new Date().toISOString();

    entries.forEach((entry) => {
      const ref = db.collection('oracle_observations').doc();
      batch.set(ref, {
        ...entry,
        uid,
        createdAt: nowIso
      });
    });

    await batch.commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error.status || 401;
    return NextResponse.json({ error: 'Unauthorized' }, { status });
  }
}
