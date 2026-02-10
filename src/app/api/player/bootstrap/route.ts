import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/requireSession';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { ensurePlayerProfile } from '@/lib/playerProfileHelper';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const { db } = getFirebaseAdmin();

    const { data: profile } = await ensurePlayerProfile(uid);
    const creaturesSnap = await db.collection('players').doc(uid).collection('creatures').get();
    const eventsSnap = await db.collection('players').doc(uid).collection('events').get();

    const creatures = creaturesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const events = eventsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ profile, creatures, events });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Bootstrap failed';
    return NextResponse.json({ error: message }, { status });
  }
}
