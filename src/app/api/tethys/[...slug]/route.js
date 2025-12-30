import { NextResponse } from 'next/server';

const wpBase = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '');
const wpUser = process.env.WP_USER;
const wpAppPass = process.env.WP_APP_PASS;

async function proxy(request, { params }) {
  if (!wpBase || !wpUser || !wpAppPass) {
    return NextResponse.json(
      { error: 'Missing WordPress credentials (NEXT_PUBLIC_WP_URL, WP_USER, WP_APP_PASS)' },
      { status: 500 }
    );
  }

  const slugArray = Array.isArray(params.slug) ? params.slug : [];
  const endpoint = slugArray.join('/');
  const useTethysNamespace = ['discover', 'active-events'].includes(slugArray[0]);
  const namespace = useTethysNamespace ? 'tethys/v1' : 'wp/v2';
  const targetUrl = `${wpBase}/wp-json/${namespace}/${endpoint}${request.nextUrl.search}`;
  const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');

  const isBodyMethod = !['GET', 'HEAD'].includes(request.method);
  const body = isBodyMethod ? await request.text() : undefined;

  const wpRes = await fetch(targetUrl, {
    method: request.method,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body
  });

  const text = await wpRes.text();
  const contentType = wpRes.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? JSON.parse(text || '{}') : text;

  return NextResponse.json(payload, { status: wpRes.status });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
