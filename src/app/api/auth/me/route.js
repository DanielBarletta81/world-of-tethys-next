import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie, getUser } from '@/lib/auth/firebaseServer';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = await verifySessionCookie(sessionCookie);
    const userRecord = await getUser(decoded.uid);
    return NextResponse.json({
      user: { uid: userRecord.uid, email: userRecord.email || null }
    });
  } catch (error) {
    console.error('Session verify error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
