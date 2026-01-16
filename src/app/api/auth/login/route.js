import { NextResponse } from 'next/server';
import {
  signInWithPassword,
  createSessionCookie
} from '@/lib/auth/firebaseServer';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SEC } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const authData = await signInWithPassword(email, password);
    const sessionCookie = await createSessionCookie(authData.idToken);

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
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Login failed.' }, { status: 401 });
  }
}
