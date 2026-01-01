import { NextResponse } from 'next/server';

/**
 * Fetch the current WP user via REST using App Password auth.
 * Requires NEXT_PUBLIC_WP_URL, WP_USER, WP_APP_PASS.
 */
export async function GET() {
  const wpBase = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '');
  const wpUser = process.env.WP_USER;
  const wpAppPass = process.env.WP_APP_PASS;

  if (!wpBase || !wpUser || !wpAppPass) {
    return NextResponse.json(
      { error: 'Missing WP configuration (NEXT_PUBLIC_WP_URL, WP_USER, WP_APP_PASS).' },
      { status: 500 }
    );
  }

  const auth = Buffer.from(`${wpUser}:${wpAppPass}`).toString('base64');

  try {
    const res = await fetch(`${wpBase}/wp-json/wp/v2/users/me?context=edit`, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'WorldOfTethys-NextApp'
      },
      // Cache very briefly; user data is sensitive
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('WP user fetch failed:', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch user from WP.' }, { status: res.status });
    }

    const wpUserData = await res.json();
    // Return a safe subset
    const payload = {
      id: wpUserData?.id,
      name: wpUserData?.name,
      username: wpUserData?.slug,
      roles: wpUserData?.roles,
      description: wpUserData?.description
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('WP user route error:', error);
    return NextResponse.json({ error: 'User lookup failed.' }, { status: 500 });
  }
}
