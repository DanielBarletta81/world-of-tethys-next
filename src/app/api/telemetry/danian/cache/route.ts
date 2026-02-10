import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const DEFAULT_CACHE_PATH = process.env.DANIAN_CACHE_PATH || 'data/danian_real.json';

function getBaseUrl(request: Request) {
  const host = request.headers.get('host') || process.env.VERCEL_URL;
  if (!host) return null;
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  return host.startsWith('http') ? host : `${proto}://${host}`;
}

async function writeCache(payload: any) {
  const abs = path.resolve(process.cwd(), DEFAULT_CACHE_PATH);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, JSON.stringify(payload, null, 2), 'utf-8');
  return abs;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (body?.telemetry) {
      const payload = {
        generated_at: new Date().toISOString(),
        source: body.source || null,
        telemetry: body.telemetry
      };
      const filePath = await writeCache(payload);
      return NextResponse.json({ ok: true, cachePath: filePath, source: payload.source });
    }

    const base = getBaseUrl(request);
    if (!base) {
      return NextResponse.json({ ok: false, error: 'Missing host for cache refresh.' }, { status: 400 });
    }
    const res = await fetch(`${base}/api/telemetry/danian?mode=usgs`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Upstream telemetry failed (${res.status}).` }, { status: 502 });
    }
    const data = await res.json();
    if (!data?.telemetry) {
      return NextResponse.json({ ok: false, error: 'Telemetry payload missing.' }, { status: 502 });
    }

    const payload = {
      generated_at: new Date().toISOString(),
      source: data.source || null,
      telemetry: data.telemetry
    };
    const filePath = await writeCache(payload);
    return NextResponse.json({ ok: true, cachePath: filePath, source: payload.source });
  } catch (error) {
    console.error('Danian cache update failed', error);
    return NextResponse.json({ ok: false, error: 'Cache update failed.' }, { status: 500 });
  }
}
