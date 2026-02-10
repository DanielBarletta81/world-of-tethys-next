import { NextResponse } from 'next/server';
import { graphqlFetch } from '@/lib/graphql';
import { buildOracleResponse, OracleFacts, OracleTerm } from '@/lib/oracle/oracleService';

export const runtime = 'nodejs';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

async function fetchWeather(city?: string, lat?: number, lon?: number) {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('Missing OPENWEATHER_API_KEY');
  }
  const base = 'https://api.openweathermap.org/data/2.5/weather';
  const q = city ? `q=${encodeURIComponent(city)}` : `lat=${lat}&lon=${lon}`;
  const url = `${base}?${q}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Weather upstream error ${res.status}`);
  }
  return res.json();
}

async function fetchOracleTerms(tags: string[] = []) {
  const data = await graphqlFetch(
    `query OracleTerms($tags: [String]) {
      oracleTerms(where: { tag: $tags }) {
        nodes { id slug name kind }
      }
    }`,
    { tags }
  );

  const nodes = data?.oracleTerms?.nodes ?? [];
  return nodes.map((n: any): OracleTerm => ({
    id: n.slug || n.id,
    label: n.name,
    kind: n.kind || 'other'
  }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city, lat, lon, tags = [] } = body || {};

    const weatherData = await fetchWeather(city, lat, lon);
    const facts: OracleFacts = {
      weather: {
        tempC: weatherData?.main?.temp ?? 0,
        windKph: Math.round((weatherData?.wind?.speed ?? 0) * 3.6),
        condition: weatherData?.weather?.[0]?.main || 'Unknown'
      }
    };

    const terms = await fetchOracleTerms(tags);

    const oracle = await buildOracleResponse({ terms, facts });

    return NextResponse.json({ ok: true, oracle });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Oracle failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
