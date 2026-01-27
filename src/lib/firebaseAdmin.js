// src/lib/firebaseAdmin.js
import "server-only"; // Prevents this file from ever crashing the client
import admin from "firebase-admin";

function loadCredential() {
  const rawServiceAccount =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
  if (rawServiceAccount) {
    try {
      const jsonString = rawServiceAccount.includes('{')
        ? rawServiceAccount
        : Buffer.from(rawServiceAccount, 'base64').toString('utf8');
      const parsed = JSON.parse(jsonString);
      return admin.credential.cert(parsed);
    } catch (error) {
      throw new Error('Firebase Admin Credential Error: Invalid FIREBASE_SERVICE_ACCOUNT_JSON.');
    }
  }

  // 1. Vercel / Production (Environment Variables)
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL ||
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  // Handle Vercel/newline escaping and base64-encoded keys.
  const rawKey =
    process.env.FIREBASE_PRIVATE_KEY ||
    process.env.FIREBASE_PRIVATE_KEY_BASE64;
  let privateKey;
  if (rawKey) {
    if (rawKey.includes('BEGIN PRIVATE KEY')) {
      privateKey = rawKey.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
    } else {
      try {
        const decoded = Buffer.from(rawKey, 'base64').toString('utf8');
        privateKey = decoded.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
      } catch {
        privateKey = rawKey.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
      }
    }
    privateKey = privateKey.trim().replace(/^"|"$/g, '');
  }

  if (projectId && clientEmail && privateKey) {
    return admin.credential.cert({ projectId, clientEmail, privateKey });
  }

  // 2. Local Development Fallback (Service Account File)
  // We use `require` inside the function so it doesn't break the client build
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccountPath) {
    try {
      const fs = require("fs"); 
      if (fs.existsSync(serviceAccountPath)) {
        return admin.credential.cert(JSON.parse(fs.readFileSync(serviceAccountPath, "utf8")));
      }
    } catch (e) { /* Ignore local file errors in production */ }
  }

  throw new Error("Firebase Admin Credential Error: Missing FIREBASE_PRIVATE_KEY, CLIENT_EMAIL, or PROJECT_ID.");
}

function initAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  admin.initializeApp({
    credential: loadCredential(),
    ...(storageBucket ? { storageBucket } : {})
  });

  return admin.app();
}

export function getFirebaseAdmin() {
  const app = initAdmin();
  const db = app.firestore();
  const bucket = app.storage().bucket();
  return { app, db, bucket };
}
