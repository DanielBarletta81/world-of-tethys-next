import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { app, db } = getFirebaseAdmin();
    await db.collection('health_checks').doc('ping').set(
      {
        checkedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return NextResponse.json({
      ok: true,
      projectId: app.options.projectId || null
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Health check failed.';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
