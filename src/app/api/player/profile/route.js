import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/requireSession';
import { ensurePlayerProfile } from '@/lib/playerProfileHelper';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const decoded = await requireSession();
    const uid = decoded.uid;
    const { data } = await ensurePlayerProfile(uid);
    return NextResponse.json({ profile: data });
  } catch (error) {
    const status = error?.status === 401 ? 401 : 500;
    const message = status === 401 ? 'Unauthorized' : 'Profile fetch failed';
    return NextResponse.json({ error: message }, { status });
  }
}
