// src/lib/firebaseAdmin.js
import "server-only"; // Prevents this file from ever crashing the client
import admin from "firebase-admin";

export function loadCredential() {
  // 1. Vercel / Production (Environment Variables)
  const projectId = 
    process.env.FIREBASE_PROJECT_ID || 
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
  const clientEmail = 
    process.env.FIREBASE_CLIENT_EMAIL || 
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  
  // Handle Vercel's private key newlines automatically
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawKey 
    ? rawKey.replace(/\\n/g, "\n") 
    : undefined;

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