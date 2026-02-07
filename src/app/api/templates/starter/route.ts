import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get('templateId');
  if (!templateId) {
    return NextResponse.json({ error: 'Missing templateId' }, { status: 400 });
  }
  try {
    const { db } = getFirebaseAdmin();
    const candidates = [
      db.collection('templates').doc('starterLoadouts').collection('items').doc(templateId),
      db.collection('starterLoadouts').doc(templateId),
      db.collection('templates').doc('starterLoadouts').collection('starterLoadouts').doc(templateId)
    ];
    for (const ref of candidates) {
      const snap = await ref.get();
      if (snap.exists) {
        return NextResponse.json({ templateId, ...snap.data() });
      }
    }
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Template lookup failed' }, { status: 500 });
  }
}
