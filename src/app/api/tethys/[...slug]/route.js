import { NextResponse } from 'next/server';

async function proxy(request, { params }) {
  const wpBase = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '');
  const wpUser = process.env.WP_USER;
  const wpAppPass = process.env.WP_APP_PASS;

  if (!wpBase || !wpUser || !wpAppPass) {
    return NextResponse.json(
      { error: 'Server configuration missing (NEXT_PUBLIC_WP_URL, WP_USER, WP_APP_PASS)' },
      { status: 500 }
    );
  }

  const slugArray = Array.isArray(params.slug) ? params.slug : [];
  const endpoint = slugArray.join('/');
  const useTethysNamespace = endpoint.includes('discover') || endpoint.includes('active-events');
  const namespace = useTethysNamespace ? 'tethys/v1' : 'wp/v2';
  const targetUrl = `${wpBase}/wp-json/${namespace}/${endpoint}${request.nextUrl.search}`;
  const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');

  const isBodyMethod = !['GET', 'HEAD'].includes(request.method);
  const body = isBodyMethod ? await request.text() : undefined;

  try {
    const wpRes = await fetch(targetUrl, {
      method: request.method,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Tethys-World-Engine/1.0'
      },
      body
    });

    const text = await wpRes.text();
    const contentType = wpRes.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? JSON.parse(text || '{}') : text;
    return NextResponse.json(payload, { status: wpRes.status });
  } catch (error) {
    console.error('Tethys Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to communicate with Tethys Core' }, { status: 500 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
