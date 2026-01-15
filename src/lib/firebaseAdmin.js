import admin from "firebase-admin";
import fs from "fs";

export function loadCredential() {
  // 1) Prefer a service account file via GOOGLE_APPLICATION_CREDENTIALS
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccountPath) {
    try {
      if (fs.existsSync(serviceAccountPath)) {
        const json = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
        return admin.credential.cert(json);
      } else {
        console.warn(`GOOGLE_APPLICATION_CREDENTIALS does not exist: ${serviceAccountPath}`);
      }
    } catch (e) {
      console.error("Failed to load GOOGLE_APPLICATION_CREDENTIALS:", e);
    }
  }

  // 2) Fallback to env vars
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL ||
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawKey
    ? rawKey
        .replace(/^"+|"+$/g, "") // strip surrounding quotes if present
        .replace(/\\n/g, "\n") // handle literal \n
    : undefined;

  if (!projectId || !clientEmail || !privateKey) {
    const msg =
      "Missing Firebase Admin Env: Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set, or set GOOGLE_APPLICATION_CREDENTIALS to a service account json.";
    if (process.env.NODE_ENV === "development") {
      console.warn(msg);
    } else {
      throw new Error(msg);
    }
  }

  return admin.credential.cert({ projectId, clientEmail, privateKey });
}

function initAdmin() {
  // FIX: Check if an app specifically named "[DEFAULT]" or matching our project exists
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const storageBucket =
    process.env.VR_METADATA_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  // We wrap this in a try-catch to handle race conditions during hot-reload
  try {
    admin.initializeApp({
      credential: loadCredential(),
      ...(storageBucket ? { storageBucket } : {})
    });
  } catch (error) {
    // If it initialized between the check and the call, just return the existing app
    if (error.code === 'app/duplicate-app') {
      return admin.app();
    }
    throw error;
  }

  return admin.app();
}

export function getFirebaseAdmin() {
  const app = initAdmin();
  const db = app.firestore();

  // Safe bucket initialization
  let bucket = null;
  try {
    if (process.env.VR_METADATA_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
      bucket = app.storage().bucket();
    }
  } catch (e) {
    console.error("Storage bucket init failed:", e);
  }

  return { app, db, bucket };
}
