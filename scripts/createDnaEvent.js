const admin = require('firebase-admin');
const { env } = process;

if (!env.GOOGLE_APPLICATION_CREDENTIALS && !env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Set FIREBASE_PRIVATE_KEY/GMAIL... or GOOGLE_APPLICATION_CREDENTIALS before running.');
}

if (!admin.apps.length) {
  const creds = env.GOOGLE_APPLICATION_CREDENTIALS
n    ? require(env.GOOGLE_APPLICATION_CREDENTIALS)
    : {
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      };

  admin.initializeApp({ credential: admin.credential.cert(creds) });
}

const db = admin.firestore();

const userId = process.argv[2];
if (!userId) {
  console.error('Usage: node scripts/createDnaEvent.js <userId>');
  process.exit(1);
}

const eventRef = db.collection('players').doc(userId).collection('dnaEvents').doc();

const sampleEvent = {
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
  await eventRef.set(sampleEvent);
  console.log(`Written sample dnaEvents/${eventRef.id} for player ${userId}`);
}

run().catch((err) => {
  console.error('Failed to write sample event', err);
  process.exit(1);
});
