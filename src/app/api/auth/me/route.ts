import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie, getUser } from '@/lib/auth/firebaseServer';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    const res = NextResponse.json({ user: null }, { status: 200 });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  }

  try {
    const decoded = await verifySessionCookie(sessionCookie);
    const userRecord = await getUser(decoded.uid);
    const res = NextResponse.json({
      user: { uid: userRecord.uid, email: userRecord.email || null }
    });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    console.info('[auth/me] success', { uid: userRecord.uid });
    return res;
  } catch (error) {
    console.error('[auth/me] error', error);
    const res = NextResponse.json({ user: null }, { status: 200 });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  }
}
