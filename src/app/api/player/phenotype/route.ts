import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/requireSession';
import { ensurePlayerProfile } from '@/lib/playerProfileHelper';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { deriveStaffPhenotype } from '@/lib/staff-phenotype';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const { data: profile } = await ensurePlayerProfile(uid);
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

    return NextResponse.json({ baseModel });
  } catch (error) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Phenotype fetch failed';
    return NextResponse.json({ error: message }, { status });
  }
}
