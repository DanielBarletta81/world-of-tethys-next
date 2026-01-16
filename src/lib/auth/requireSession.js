import { cookies } from 'next/headers';
import { verifySessionCookie } from './firebaseServer';
import { SESSION_COOKIE_NAME } from './session';

export async function requireSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
  return verifySessionCookie(sessionCookie);
}
