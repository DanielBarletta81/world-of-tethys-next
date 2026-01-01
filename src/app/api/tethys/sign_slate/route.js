import { NextResponse } from 'next/server';

export async function POST(request) {
  const wpBase = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '');
  const wpUser = process.env.WP_USER;
  const wpAppPass = process.env.WP_APP_PASS;

  if (!wpBase || !wpUser || !wpAppPass) {
    return NextResponse.json(
      { error: 'Server configuration missing (WP credentials)' },
      { status: 500 }
    );
  }

  try {
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'Signature requires name and inscription.' }, { status: 400 });
    }

    const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');
    const targetUrl = `${wpBase}/wp-json/wp/v2/guest_signature`;

    const wpRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content,
        status: 'publish'
      })
    });

    if (!wpRes.ok) {
      const errorText = await wpRes.text();
      console.error('WP Signature Error:', errorText);
      return NextResponse.json(
        { error: 'The slate rejected your mark. (CPT configuration error?)' },
        { status: wpRes.status }
      );
    }

    const data = await wpRes.json();
    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error('Slate Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to etch signature.' }, { status: 500 });
  }
}

export async function GET() {
  const wpBase = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '');
  const wpUser = process.env.WP_USER;
  const wpAppPass = process.env.WP_APP_PASS;

  if (!wpBase || !wpUser || !wpAppPass) {
    return NextResponse.json({ error: 'Config missing' }, { status: 500 });
  }

  try {
    const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');
    const wpRes = await fetch(
      `${wpBase}/wp-json/wp/v2/guest_signature?per_page=5&_fields=title,content,date`,
      {
        headers: { Authorization: `Basic ${auth}` },
        next: { revalidate: 60 }
      }
    );

    if (!wpRes.ok) throw new Error('Fetch failed');
    const posts = await wpRes.json();
    const signatures = posts.map((p) => ({
      handle: p?.title?.rendered,
      message: (p?.content?.rendered || '').replace(/<[^>]*>?/gm, ''),
      date: p?.date ? new Date(p.date).toLocaleDateString() : ''
    }));

    return NextResponse.json(signatures);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
