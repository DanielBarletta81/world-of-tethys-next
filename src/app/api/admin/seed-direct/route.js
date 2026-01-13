import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

const ALLOWED_COLLECTIONS = new Set([
  'lore_papers',
  'daily_whispers',
  'oracle_responses',
  'npc_variants',
  'seed_queue'
]);

const ALLOWED_PATHS = new Set([
  'oracle/responses',
  'oracle/seeders',
  'npc_variants',
  'daily_whispers',
  'lore/cambria/papers',
  'lore/sky-city/papers',
  'lore/ironwood/papers',
  'lore/mystics/papers',
  'lore/thal/papers'
]);

function isAuthorized(req) {
  const authHeader = req.headers.get('x-admin-key');
  const bearer = req.headers.get('authorization');
  const bearerToken = bearer?.startsWith('Bearer ') ? bearer.slice(7) : null;
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  const cronSecret = process.env.CRON_SECRET;

  return (
    (authHeader && adminSecret && authHeader === adminSecret) ||
    (bearerToken && ((cronSecret && bearerToken === cronSecret) || (adminSecret && bearerToken === adminSecret)))
  );
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const collectionName = body?.collection?.trim();
    const collectionPath = body?.collectionPath?.trim();
    const payload = body?.payload;

    if (!collectionName && !collectionPath) {
      return NextResponse.json({ error: 'Missing collection or collectionPath.' }, { status: 400 });
    }

    if (collectionName && !ALLOWED_COLLECTIONS.has(collectionName)) {
      return NextResponse.json({ error: 'Collection not allowed.' }, { status: 400 });
    }

    if (collectionPath && !ALLOWED_PATHS.has(collectionPath)) {
      return NextResponse.json({ error: 'Collection path not allowed.' }, { status: 400 });
    }

    if (!payload || !Array.isArray(payload)) {
      return NextResponse.json({ error: 'Payload must be a JSON array.' }, { status: 400 });
    }

    const { db } = getFirebaseAdmin();
    const batch = db.batch();
    const now = new Date().toISOString();

    payload.forEach((item) => {
      const docRef = collectionPath
        ? db.collection(collectionPath).doc()
        : db.collection(collectionName).doc();
      batch.set(docRef, {
        ...item,
        createdAt: item?.createdAt || now,
        updatedAt: now
      });
    });

    await batch.commit();

    return NextResponse.json({
      ok: true,
      count: payload.length,
      collection: collectionName || null,
      collectionPath: collectionPath || null
    });
  } catch (error) {
    console.error('Seed direct error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
