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

function toSlug(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const title = body?.title?.trim();
    const content = body?.content?.trim();

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing title or content.' }, { status: 400 });
    }

    const slug = body?.slug?.trim() || toSlug(title);
    const payload = {
      title,
      slug,
      summary: body?.summary?.trim() || '',
      content,
      category: body?.category?.trim() || 'cambria_archive',
      region: body?.region?.trim() || null,
      faction: body?.faction?.trim() || null,
      tags: Array.isArray(body?.tags) ? body.tags : [],
      status: body?.status?.trim() || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { db } = getFirebaseAdmin();
    const docRef = db.collection('lore_papers').doc();
    await docRef.set(payload);

    return NextResponse.json({ ok: true, id: docRef.id, slug });
  } catch (error) {
    console.error('Lore admin error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

