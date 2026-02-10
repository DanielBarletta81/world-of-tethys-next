import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { ensurePlayerProfile } from '@/lib/playerProfileHelper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 });
  }

  try {
    const { app } = getFirebaseAdmin();
    const decoded = await app.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const { created, data } = (await ensurePlayerProfile(uid)) as any;

    return NextResponse.json({
      ok: true,
      created,
      uid,
      profile: {
        guide: data.guide,
        progress: data.progress,
        adornmentUnlockedAt: data.adornmentUnlockedAt,
        onboarding: data.onboarding,
        path: data.path,
        staff: data.staff,
        progression: data.progression,
        dna: data.dna,
        aura: data.aura,
        protection: data.protection,
        drift: data.drift,
        lastLoginAt: data.lastLoginAt
      }
    });
  } catch (error: any) {
    console.error('ensure profile error', error);
    return NextResponse.json({ error: error?.message || 'Unauthorized' }, { status: 401 });
  }
}
