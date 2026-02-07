import { NextResponse } from 'next/server';
import {
  createSessionCookie,
  getFirestore,
  getServerTimestamp,
  verifyIdToken
} from '@/lib/auth/firebaseServer';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SEC } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      console.warn('[auth/google] missing token');
      return NextResponse.json({ error: 'Missing Google token.' }, { status: 400 });
    }

    const decoded = await verifyIdToken(idToken);
    const sessionCookie = await createSessionCookie(idToken);

    const uid = decoded.uid;
    const email = decoded.email || null;

    const db = getFirestore();
    await db.collection('players').doc(uid).set(
      {
        email,
        createdAt: getServerTimestamp()
      },
      { merge: true }
    );

    const res = NextResponse.json({
      user: { uid, email }
    });
    res.headers.set('Cache-Control', 'no-store, max-age=0');

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SEC
    });

    console.info('[auth/google] success', { uid });
    return res;
  } catch (error) {
    console.error('[auth/google] error', error);
    const res = NextResponse.json({ error: error.message || 'Google sign-in failed.' }, { status: 401 });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  }
}
