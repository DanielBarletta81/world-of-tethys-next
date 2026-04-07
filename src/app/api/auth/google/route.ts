import { NextResponse } from 'next/server';
import {
  createSessionCookie,
  getFirestore,
  getServerTimestamp,
  verifyIdToken
} from '@/lib/auth/firebaseServer';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SEC } from '@/lib/auth/session';
import { getSessionCookieOptions } from '@/lib/auth/session-options';

export const runtime = 'nodejs';

function toHost(value) {
  if (!value) return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

function getAllowedAuthHosts() {
  const hosts = new Set(
    (process.env.AUTH_ALLOWED_HOSTS || '')
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  );

  const fromSiteUrls = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_WORLD_SITE_URL,
    process.env.NEXT_PUBLIC_AUTHOR_SITE_URL
  ];

  for (const url of fromSiteUrls) {
    const host = toHost(url);
    if (host) hosts.add(host);
  }

  hosts.add('localhost:3000');
  hosts.add('127.0.0.1:3000');
  return hosts;
}

function isAllowedOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  const host = toHost(origin);
  if (!host) return false;
  return getAllowedAuthHosts().has(host);
}

export async function POST(req) {
  try {
    if (!isAllowedOrigin(req)) {
      console.warn('[auth/google] blocked origin', { origin: req.headers.get('origin') || null });
      return NextResponse.json({ error: 'Origin not allowed.' }, { status: 403 });
    }

    const { idToken } = await req.json();
    if (!idToken) {
      console.warn('[auth/google] missing token');
      return NextResponse.json({ error: 'Missing Google token.' }, { status: 400 });
    }

    const decoded = await verifyIdToken(idToken);
    const provider = decoded?.firebase?.sign_in_provider;
    if (provider && provider !== 'google.com') {
      console.warn('[auth/google] invalid provider', { provider });
      return NextResponse.json({ error: 'Token is not from Google sign-in.' }, { status: 400 });
    }

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
      ...getSessionCookieOptions(SESSION_MAX_AGE_SEC)
    });

    console.info('[auth/google] success', { uid });
    return res;
  } catch (error: any) {
    console.error('[auth/google] error', error);
    const res = NextResponse.json({ error: error?.message || 'Google sign-in failed.' }, { status: 401 });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  }
}
