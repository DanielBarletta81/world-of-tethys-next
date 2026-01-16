import 'server-only';
import admin from 'firebase-admin';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { SESSION_MAX_AGE_MS } from './session';

const API_KEY = process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_AUTH_BASE = 'https://identitytoolkit.googleapis.com/v1';

if (!API_KEY) {
  throw new Error('Missing FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_API_KEY.');
}

async function firebaseAuthRequest(path, payload) {
  const res = await fetch(`${FIREBASE_AUTH_BASE}/${path}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (!res.ok) {
    const message = json?.error?.message || 'Firebase auth request failed.';
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return json;
}

export async function signUpWithEmail(email, password) {
  return firebaseAuthRequest('accounts:signUp', {
    email,
    password,
    returnSecureToken: true
  });
}

export async function signInWithPassword(email, password) {
  return firebaseAuthRequest('accounts:signInWithPassword', {
    email,
    password,
    returnSecureToken: true
  });
}

export async function createSessionCookie(idToken) {
  const { app } = getFirebaseAdmin();
  return app.auth().createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
}

export async function verifySessionCookie(sessionCookie) {
  const { app } = getFirebaseAdmin();
  return app.auth().verifySessionCookie(sessionCookie, true);
}

export async function deleteUser(uid) {
  const { app } = getFirebaseAdmin();
  await app.auth().deleteUser(uid);
}

export async function getUser(uid) {
  const { app } = getFirebaseAdmin();
  return app.auth().getUser(uid);
}

export function getFirestore() {
  const { db } = getFirebaseAdmin();
  return db;
}

export function getServerTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}
