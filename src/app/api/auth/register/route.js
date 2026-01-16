import { NextResponse } from 'next/server';
import {
  signUpWithEmail,
  createSessionCookie,
  getFirestore,
  getServerTimestamp
} from '@/lib/auth/firebaseServer';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SEC } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const authData = await signUpWithEmail(email, password);
    const sessionCookie = await createSessionCookie(authData.idToken);

    const db = getFirestore();
    await db.collection('players').doc(authData.localId).set(
      {
        email: authData.email,
        createdAt: getServerTimestamp()
      },
      { merge: true }
    );

    const res = NextResponse.json({
      user: { uid: authData.localId, email: authData.email }
    });

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SEC
    });

    return res;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed.' }, { status: 400 });
  }
}
