import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteUser, verifySessionCookie, getFirestore } from '@/lib/auth/firebaseServer';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { getSessionCookieOptions } from '@/lib/auth/session-options';

export const runtime = 'nodejs';

export async function POST() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    console.warn('[auth/delete] missing session cookie');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = await verifySessionCookie(sessionCookie);
    const db = getFirestore();
    await db.collection('players').doc(decoded.uid).delete();
    await deleteUser(decoded.uid);

    const res = NextResponse.json({ ok: true });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      ...getSessionCookieOptions(0)
    });
    console.info('[auth/delete] success', { uid: decoded.uid });
    return res;
  } catch (error) {
    console.error('[auth/delete] error', error);
    const res = NextResponse.json({ error: 'Delete failed' }, { status: 400 });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  }
}
