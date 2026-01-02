import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) return NextResponse.json({ error: 'City missing' }, { status: 400 });

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Weather service not configured (OPENWEATHER_API_KEY missing)' },
      { status: 500 }
    );
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      const text = await res.text();
      console.error('Weather fetch failed:', res.status, text);
      return NextResponse.json({ error: 'Weather fetch failed' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Weather route error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
