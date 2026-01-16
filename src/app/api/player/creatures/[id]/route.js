import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/requireSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function DELETE(req, { params }) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const creatureId = params?.id;
    if (!creatureId) {
      return NextResponse.json({ error: 'Missing creature id' }, { status: 400 });
    }
    const { db } = getFirebaseAdmin();
    await db.collection('players').doc(uid).collection('creatures').doc(creatureId).delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error.status || 401;
    return NextResponse.json({ error: 'Unauthorized' }, { status });
  }
}
