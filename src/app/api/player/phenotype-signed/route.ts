import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireSession } from '@/lib/auth/requireSession';
import { ensurePlayerProfile } from '@/lib/playerProfileHelper';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { deriveStaffPhenotype } from '@/lib/staff-phenotype';

export const runtime = 'nodejs';

function signPayload(payload, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

export async function GET(request) {
  try {
    const secret = process.env.DNA_EXPORT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Missing DNA_EXPORT_SECRET' }, { status: 500 });
    }

    const url = new URL(request.url);
    const ttlMinutes = Math.max(5, Math.min(1440, Number(url.searchParams.get('ttl') || 60)));

    const decoded = await requireSession();
    const uid = decoded.uid;
    const { data: profile } = (await ensurePlayerProfile(uid)) as any;
    const dna = profile?.dna || {};
    const flags = Array.isArray(dna.flags) && dna.flags.length === 4 ? dna.flags : ['A', 'C', 'G', 'T'];

    let baseModel = dna.baseModel;
    if (!baseModel || !baseModel.flags || !baseModel.phenotype) {
      const phenotype = deriveStaffPhenotype({
        dna: { flags },
        pathMode: profile?.path?.primary || 'wild',
        progress: profile?.progress || {}
      });
      baseModel = {
        seed: dna.seed || null,
        flags,
        phenotype
      };

      const { db } = getFirebaseAdmin();
      await db.collection('players').doc(uid).set(
        {
          dna: {
            ...dna,
            baseModel
          }
        },
        { merge: true }
      );
    }

    const issuedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
    const payload = {
      uid,
      issuedAt,
      expiresAt,
      baseModel
    };

    const signature = signPayload(payload, secret);

    return NextResponse.json({ payload, signature, alg: 'HMAC-SHA256' });
  } catch (error: any) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Signed phenotype fetch failed';
    return NextResponse.json({ error: message }, { status });
  }
}
