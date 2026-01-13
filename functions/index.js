import admin from 'firebase-admin';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { derivePlayerDna } from '../src/lib/playerDna.js';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const enrichPlayerDnaEvent = onDocumentWritten(
  'players/{userId}/dnaEvents/{eventId}',
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
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const profileRef = db.collection('playerProfiles').doc(event.params.userId);
    const batch = db.batch();

    batch.set(snapshot.ref, { dnaSnapshot: dna }, { merge: true });
    batch.set(
      profileRef,
      {
        latestDna: dna,
        glyphHistory: admin.firestore.FieldValue.arrayUnion(glyphRecord),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    await batch.commit();
  }
);
