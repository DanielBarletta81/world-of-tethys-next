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
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Admin init failed.' },
      { status: 500 }
    );
  }
}
