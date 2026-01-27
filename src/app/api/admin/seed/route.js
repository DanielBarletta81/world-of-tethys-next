import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

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
    const seedType = body?.seedType?.trim();
    const payload = body?.payload;

    if (!seedType || !payload || !Array.isArray(payload)) {
      return NextResponse.json({ error: 'Missing seedType or payload array.' }, { status: 400 });
    }

    const { db } = getFirebaseAdmin();
    const batch = db.batch();
    const createdAt = new Date().toISOString();

    payload.forEach((item) => {
      const docRef = db.collection('seed_queue').doc();
      batch.set(docRef, {
        seedType,
        payload: item,
        createdAt
      });
    });

    await batch.commit();

    return NextResponse.json({ ok: true, count: payload.length });
  } catch (error) {
    console.error('Seed admin error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

