import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const units = searchParams.get('units') || 'metric';

  if (!city) {
    return NextResponse.json({ error: 'Missing city' }, { status: 400 });
  }
  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing OPENWEATHER_API_KEY' }, { status: 500 });
  }

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Weather API error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
