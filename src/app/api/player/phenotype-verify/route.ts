import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

function signPayload(payload, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

export async function POST(request) {
  try {
    const secret = process.env.DNA_EXPORT_SECRET;
    if (!secret) {
      return NextResponse.json({ valid: false, error: 'Missing DNA_EXPORT_SECRET' }, { status: 500 });
    }
    const skewMinutes = Math.max(0, Math.min(30, Number(process.env.DNA_EXPORT_SKEW_MINUTES || 5)));

    const body = await request.json();
    const payload = body?.payload;
    const signature = body?.signature;

    if (!payload || !signature) {
      return NextResponse.json({ valid: false, error: 'Missing payload or signature' }, { status: 400 });
    }

    const expected = signPayload(payload, secret);
    if (expected !== signature) {
      return NextResponse.json({ valid: false, error: 'Signature mismatch' }, { status: 401 });
    }

    if (payload.expiresAt) {
      const expiresAt = new Date(payload.expiresAt).getTime();
      const now = Date.now();
      if (now > expiresAt + skewMinutes * 60 * 1000) {
        return NextResponse.json({ valid: false, error: 'Token expired' }, { status: 401 });
      }
    }

    return NextResponse.json({ valid: true, payload });
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
  }
}
