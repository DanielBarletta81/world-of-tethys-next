import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { app } = getFirebaseAdmin();
    return NextResponse.json({
      ok: true,
      projectId: app.options.projectId || null
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Admin init failed.';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
