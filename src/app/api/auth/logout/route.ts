import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { getSessionCookieOptions } from '@/lib/auth/session-options';

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  console.info('[auth/logout] success');
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    ...getSessionCookieOptions(0)
  });
  return res;
}
