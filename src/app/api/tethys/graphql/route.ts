import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { query, variables } = body || {};

  if (!query) {
    return NextResponse.json({ error: 'query required' }, { status: 400 });
  }

  const tethysBase = process.env.TETHYS_API_BASE || process.env.NEXT_PUBLIC_TETHYS_API_BASE;
  const wpEndpoint = process.env.WP_GRAPHQL_ENDPOINT;
  const wpUser = process.env.WP_USER;
  const wpAppPass = process.env.WP_APP_PASS;

  const target = tethysBase
    ? `${tethysBase.replace(/\/$/, '')}/graphql`
    : wpEndpoint;

  if (!target) {
    return NextResponse.json({ error: 'Missing TETHYS_API_BASE or WP_GRAPHQL_ENDPOINT.' }, { status: 500 });
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!tethysBase && wpUser && wpAppPass) {
    const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');
    headers.Authorization = `Basic ${auth}`;
  }

  const res = await fetch(target, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  });

  const text = await res.text();
  let payload: unknown = { error: text };
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { error: text };
  }

  return NextResponse.json(payload, { status: res.status });
}
