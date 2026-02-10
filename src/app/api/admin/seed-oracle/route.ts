import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

const GENAI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const MODEL = 'gemini-2.5-flash';

export async function POST(req) {
  const authHeader = req.headers.get('x-admin-key');
  const bearer = req.headers.get('authorization');
  const bearerToken = bearer?.startsWith('Bearer ') ? bearer.slice(7) : null;
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  const cronSecret = process.env.CRON_SECRET;

  const authorized =
    (authHeader && adminSecret && authHeader === adminSecret) ||
    (bearerToken && ((cronSecret && bearerToken === cronSecret) || (adminSecret && bearerToken === adminSecret)));

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!GENAI_API_KEY) {
    return NextResponse.json({ error: 'Missing GOOGLE_GENAI_API_KEY' }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GENAI_API_KEY });
    const prompt = `
Generate 6 cryptic, short "whispers" from a fungal hivemind 111 million years ago.
Themes: Tides, Magma, Evolution, Rot, The Watcher (Volcano).
Format: JSON Array of objects with keys: "gibberish" (made up alien sounds), "translation" (English), "intensity" (low/med/high).
Example: [{"gibberish": "Kzzzt... orem...", "translation": "The mountain breathes.", "intensity": "low"}]
`;

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const text = result?.text ?? '';
    const cleanJson = String(text).replace(/```json|```/g, '').trim();
    const whispers = JSON.parse(cleanJson);

    const { db } = getFirebaseAdmin();
    const batch = db.batch();

    const snapshot = await db.collection('daily_whispers').get();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));

    whispers.forEach((whisper) => {
      const docRef = db.collection('daily_whispers').doc();
      batch.set(docRef, { ...whisper, createdAt: new Date().toISOString() });
    });

    await batch.commit();

    console.info('Oracle seeded', {
      count: whispers.length,
      at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, count: whispers.length });
  } catch (error: any) {
    console.error('Oracle seed error', error);
    return NextResponse.json({ error: error?.message || 'Oracle seed failed' }, { status: 500 });
  }
}

export async function GET(req) {
  const authHeader = req.headers.get('x-admin-key');
  const bearer = req.headers.get('authorization');
  const bearerToken = bearer?.startsWith('Bearer ') ? bearer.slice(7) : null;
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  const cronSecret = process.env.CRON_SECRET;
  const authorized =
    (authHeader && adminSecret && authHeader === adminSecret) ||
    (bearerToken && ((cronSecret && bearerToken === cronSecret) || (adminSecret && bearerToken === adminSecret)));

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db } = getFirebaseAdmin();
    const snapshot = await db.collection('daily_whispers').get();
    const count = snapshot.size;
    const newest = snapshot.docs
      .map((doc) => doc.data()?.createdAt)
      .filter(Boolean)
      .sort()
      .at(-1);

    return NextResponse.json({
      ok: true,
      count,
      lastSeededAt: newest || null
    });
  } catch (error: any) {
    console.error('Oracle status error', error);
    return NextResponse.json({ error: error?.message || 'Oracle status failed' }, { status: 500 });
  }
}
// World of Tethys || D.C. Barletta
