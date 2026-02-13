import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/requireSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const { id: creatureId } = await params;
    if (!creatureId) {
      return NextResponse.json({ error: 'Missing creature id' }, { status: 400 });
    }
    const { db } = getFirebaseAdmin();
    await db.collection('players').doc(uid).collection('creatures').doc(creatureId).delete();
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Creature delete failed';
    return NextResponse.json({ error: message }, { status });
  }
}
