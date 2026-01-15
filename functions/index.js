import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { derivePlayerDna } from './lib/playerDna.js';

const app = getApps().length ? getApps()[0] : initializeApp();
const db = getFirestore(app);

export const enrichPlayerDnaEvent = onDocumentWritten(
  { document: 'players/{userId}/dnaEvents/{eventId}', region: 'us-central1' },
  async (event) => {
    const snapshot = event.data?.after ?? event.data?.before;
    if (!snapshot) return;

    const payload = snapshot.data();
    if (!payload) return;

    const dna = derivePlayerDna({ ...payload, eventId: snapshot.id });
    if (payload.dnaSnapshot?.seed === dna.seed) {
      return;
    }

    const glyphRecord = {
      region: payload.region || 'unknown',
      glyphId: dna.glyph.glyphId,
      color: dna.glyph.color,
      createdAt: FieldValue.serverTimestamp()
    };

    const profileRef = db.collection('playerProfiles').doc(event.params.userId);
    const batch = db.batch();

    batch.set(snapshot.ref, { dnaSnapshot: dna }, { merge: true });
    batch.set(
      profileRef,
      {
        latestDna: dna,
        glyphHistory: FieldValue.arrayUnion(glyphRecord),
        lastUpdated: FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    await batch.commit();
  }
);

export const helloDna = onRequest({ region: 'us-central1' }, (req, res) => {
  res.send('Hello from enrichPlayerDnaEvent!');
});
