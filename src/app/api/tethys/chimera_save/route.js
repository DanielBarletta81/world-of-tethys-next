import { NextResponse } from 'next/server';

export async function POST(request) {
  const wpBase = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '');
  const wpUser = process.env.WP_USER;
  const wpAppPass = process.env.WP_APP_PASS;

  if (!wpBase || !wpUser || !wpAppPass) {
    return NextResponse.json({ error: 'Missing WP configuration' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { title, profile, image } = body || {};

    if (!title || !profile) {
      return NextResponse.json({ error: 'Title and profile required' }, { status: 400 });
    }

    const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');
    const targetUrl = `${wpBase}/wp-json/wp/v2/archival_post`;

    const htmlContent = `
      <h3>${profile?.commonName || profile?.speciesName || 'Chimera Specimen'}</h3>
      <p><strong>Species:</strong> ${profile?.speciesName || 'Unknown'}</p>
      <p><strong>Habitat:</strong> ${profile?.habitat || 'Undisclosed'}</p>
      <p><strong>Description:</strong> ${profile?.scientificDescription || 'N/A'}</p>
      <pre>${JSON.stringify(profile, null, 2)}</pre>
      ${image ? `<img src="${image}" alt="Chimera specimen" />` : ''}
    `;

    const wpRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content: htmlContent,
        status: 'publish'
      })
    });

    if (!wpRes.ok) {
      const txt = await wpRes.text();
      console.error('Chimera save error:', txt);
      return NextResponse.json({ error: 'WP rejected specimen' }, { status: wpRes.status });
    }

    const data = await wpRes.json();
    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error('Chimera save route error:', error);
    return NextResponse.json({ error: 'Failed to save specimen' }, { status: 500 });
  }
}
