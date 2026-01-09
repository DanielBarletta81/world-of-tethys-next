import admin from 'firebase-admin';

let initialized = false;

function initAdmin() {
  if (initialized) return admin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const storageBucket = process.env.VR_METADATA_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase admin env: set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    }),
    ...(storageBucket ? { storageBucket } : {})
  });

  initialized = true;
  return admin;
}

export function getFirebaseAdmin() {
  const app = initAdmin();
  const db = app.firestore();
  const bucket =
    process.env.VR_METADATA_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      ? app.storage().bucket()
      : null;

  return { app, db, bucket };
}
