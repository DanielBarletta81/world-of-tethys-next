import 'dotenv/config';
import admin from 'firebase-admin';
import { createRequire } from 'module';
import fs from 'fs';

const require = createRequire(import.meta.url);
const { env, argv } = process;

if (!env.GOOGLE_APPLICATION_CREDENTIALS && !env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_PRIVATE_KEY before running.');
}

if (!admin.apps.length) {
  const creds = env.GOOGLE_APPLICATION_CREDENTIALS
    ? (() => {
        if (!fs.existsSync(env.GOOGLE_APPLICATION_CREDENTIALS)) {
          throw new Error(
            `GOOGLE_APPLICATION_CREDENTIALS file not found at ${env.GOOGLE_APPLICATION_CREDENTIALS}`
          );
        }
        return require(env.GOOGLE_APPLICATION_CREDENTIALS);
      })()
    : {
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      };

  admin.initializeApp({ credential: admin.credential.cert(creds) });
}

const db = admin.firestore();

const userArgs = argv.slice(2);
const targetUsers =
  userArgs.length > 0
    ? userArgs
    : ['mock-user-a', 'mock-user-b', 'mock-user-c']; // small default set

const baseEvent = {
  coordinates: { x: 37.2, y: 120.5 },
  region: 'cambria_ruins',
  pathMode: 'wild',
  envPressure: 0.43,
  metadata: {
    fogBoost: 0.08,
    watcherIntensity: 'mid'
  },
  timestamp: admin.firestore.FieldValue.serverTimestamp()
};

async function run() {
  for (const userId of targetUsers) {
    const eventRef = db.collection('players').doc(userId).collection('dnaEvents').doc();
    await eventRef.set({ ...baseEvent });
    console.log(`Written sample dnaEvents/${eventRef.id} for player ${userId}`);
  }
}

run().catch((err) => {
  console.error('Failed to write sample event', err);
  process.exit(1);
});
