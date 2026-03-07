import { NextResponse } from 'next/server';
import { graphqlFetch } from '@/lib/graphql';
import { buildOracleResponse, OracleFacts, OracleTerm } from '@/lib/oracle/oracleService';
import { buildRateLimitHeaders, getClientIp, rateLimit } from '@/lib/ratelimit';

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
  const ip = getClientIp(req);
  const rl = rateLimit(`oracle-respond:${ip}`, 15, 60_000);
  const rlHeaders = buildRateLimitHeaders(rl);
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429, headers: rlHeaders });
  }

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

    const response = NextResponse.json({ ok: true, oracle });
    Object.entries(rlHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Oracle failed';
    const response = NextResponse.json({ ok: false, error: message }, { status: 500 });
    Object.entries(rlHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  }
}
