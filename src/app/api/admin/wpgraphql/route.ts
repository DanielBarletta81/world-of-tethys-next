import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const endpoint = process.env.WP_GRAPHQL_ENDPOINT;
  const wpUser = process.env.WP_USER;
  const wpAppPass = process.env.WP_APP_PASS;

  if (!endpoint) {
    return NextResponse.json(
      { ok: false, error: 'WP_GRAPHQL_ENDPOINT is not set.' },
      { status: 500 }
    );
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (wpUser && wpAppPass) {
    const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');
    headers.Authorization = `Basic ${auth}`;
  }

  const query = `
    query Ping {
      generalSettings {
        title
        description
        url
      }
    }
  `;

  const startedAt = Date.now();

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query })
    });

    const elapsedMs = Date.now() - startedAt;

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          statusText: res.statusText,
          elapsedMs,
          bodySnippet: text.slice(0, 500)
        },
        { status: 502 }
      );
    }

    const json = await res.json();

    return NextResponse.json({
      ok: !json.errors,
      elapsedMs,
      data: json.data?.generalSettings || null,
      errors: json.errors || null
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'GraphQL request failed.';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
