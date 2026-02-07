import "server-only"; // Prevents this file from ever crashing the client
import admin from "firebase-admin";
import type { Bucket } from "@google-cloud/storage";


function normalizePrivateKey(key: string) {
  return String(key)
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .trim()
    .replace(/^"|"$/g, "");
}

function loadCredential() {
  const rawServiceAccount =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;

  // 0) Preferred: full service account JSON (plain or base64)
  if (rawServiceAccount) {
    try {
      const jsonString = rawServiceAccount.includes("{")
        ? rawServiceAccount
        : Buffer.from(rawServiceAccount, "base64").toString("utf8");

      const parsed = JSON.parse(jsonString);

      // Normalize common newline escaping in private_key if present
      if (parsed?.private_key) {
        parsed.private_key = normalizePrivateKey(parsed.private_key);
      }

      // Basic shape validation (prevents confusing runtime errors)
      const hasProject = !!(parsed.project_id || parsed.projectId);
      const hasEmail = !!(parsed.client_email || parsed.clientEmail);
      const hasKey = !!(parsed.private_key || parsed.privateKey);

      if (!hasProject || !hasEmail || !hasKey) {
        throw new Error(
          "Service account JSON missing required fields (project_id/client_email/private_key)."
        );
      }

      return admin.credential.cert(parsed);
    } catch {
      throw new Error(
        "Firebase Admin Credential Error: Invalid FIREBASE_SERVICE_ACCOUNT_JSON (or _BASE64)."
      );
    }
  }

  // 1) Env var trio fallback (supports your existing names)
  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // If we had to fall back to NEXT_PUBLIC_*, warn (not fatal)
  if (!process.env.FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn(
      "⚠️ Firebase Admin: using NEXT_PUBLIC_FIREBASE_PROJECT_ID fallback. Prefer FIREBASE_PROJECT_ID for server-only clarity."
    );
  }

  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  const rawKey = process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_BASE64;

  let privateKey: string | undefined;
  if (rawKey) {
    if (rawKey.includes("BEGIN PRIVATE KEY")) {
      privateKey = normalizePrivateKey(rawKey);
    } else {
      // likely base64 (but try decode safely)
      try {
        const decoded = Buffer.from(rawKey, "base64").toString("utf8");
        privateKey = normalizePrivateKey(decoded);
      } catch {
        privateKey = normalizePrivateKey(rawKey);
      }
    }
  }

  if (projectId && clientEmail && privateKey) {
    return admin.credential.cert({ projectId, clientEmail, privateKey });
  }

  // 2) Local Development Fallback (Service Account File)
  // Kept as `require` to avoid any bundler edge-cases (even though server-only protects it)
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccountPath) {
    try {
      const fs = require("fs");
      if (fs.existsSync(serviceAccountPath)) {
        const fileJson = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
        if (fileJson?.private_key) fileJson.private_key = normalizePrivateKey(fileJson.private_key);
        return admin.credential.cert(fileJson);
      }
    } catch {
      /* Ignore local file errors in production */
    }
  }

  throw new Error(
    "Firebase Admin Credential Error: missing credentials. Provide one of:\n" +
      "- FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_JSON_BASE64\n" +
      "- FIREBASE_PROJECT_ID + (FIREBASE_CLIENT_EMAIL|FIREBASE_ADMIN_CLIENT_EMAIL) + (FIREBASE_PRIVATE_KEY|FIREBASE_PRIVATE_KEY_BASE64)\n" +
      "- GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)"
  );
}

function initAdmin() {
  if (admin.apps.length > 0) return admin.app();

  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  admin.initializeApp({
    credential: loadCredential(),
    ...(storageBucket ? { storageBucket } : {}),
  });

  return admin.app();
}

export function getFirebaseAdmin() {
  const app = initAdmin();
  const db = app.firestore();

  // Bucket can fail in some environments if Storage isn't configured; keep it safe.
  let bucket: Bucket | null = null;
try {
  bucket = app.storage().bucket();
} catch {
  bucket = null;
}

  return { app, db, bucket };
}
