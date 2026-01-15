'use client';
// src/lib/firebase.js

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "process.env.NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "process.env.NEXT_PUBLIC_FIREBASE_APP_ID",
  measurementId: "process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" // optional
};

// Only require the keys the client SDK actually needs; measurementId is optional.
const requiredKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID"
];

const hasFirebaseConfig = requiredKeys.every((key) => Boolean(process.env[key]));

if (typeof window !== "undefined") {
  const missing = requiredKeys.filter((key) => !process.env[key]);
  if (missing.length) {
    console.warn(`[tethys] Firebase env vars missing: ${missing.join(", ")}`);
  }
}

const app = hasFirebaseConfig
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const googleProvider = new GoogleAuthProvider();
const analytics =
  app && typeof window !== "undefined" && firebaseConfig.measurementId
    ? getAnalytics(app)
    : null;

export { app, auth, googleProvider, db, analytics, hasFirebaseConfig };
// World of Tethys || D.C. Barletta
