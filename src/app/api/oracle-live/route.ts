import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { graphqlFetch } from '@/lib/graphql';

export const runtime = 'nodejs';

const GENAI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const WEATHER_KEY = process.env.OPENWEATHER_API_KEY;

const MODEL = 'gemini-2.5-flash';
const PTEROS_CITY = 'Fortaleza,BR';
const WATCHER_ID = '323020'; // Kīlauea

const FORBIDDEN_REALWORLD = ['earth', 'hawaii', 'kilauea', 'usa', 'united states', 'japan'];

function scrubRealWorld(text: string) {
  let output = text;
  for (const word of FORBIDDEN_REALWORLD) {
    output = output.replace(new RegExp(word, 'gi'), '').replace(/\s{2,}/g, ' ');
  }
  return output.trim();
}

async function getVolcanoStatus() {
  try {
    const res = await fetch(
      `https://volcanoes.usgs.gov/hans-public/api/volcano/${WATCHER_ID}/latest/status`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) {
      return { status: 'Dormant', color: 'Green', update: 'The mountain sleeps.' };
    }
    const data = await res.json();
    return {
      status: data.activity_level || 'Unknown',
      color: data.aviation_color_code || 'Green',
      update: data.volcano_notice_summary || 'The mountain sleeps.'
    };
  } catch {
    return { status: 'Offline', color: 'Gray', update: 'Seismic link severed.' };
  }
}

async function getWeather() {
  if (!WEATHER_KEY) return null;
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(PTEROS_CITY)}&units=metric&appid=${WEATHER_KEY}`,
      { next: { revalidate: 300 } }
    );
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

async function getLoreTerms() {
  const data = await graphqlFetch(
    `query OracleContext {
      archiveEntries(first: 3, where: { orderby: { field: RAND } }) {
        nodes {
          title
          tethysData { threatLevel }
        }
      }
    }`
  );
  return data?.archiveEntries?.nodes ?? [];
}

async function getDanianSignal(request: Request) {
  try {
    const url = new URL('/api/telemetry/danian?mode=auto', request.url);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.telemetry ?? null;
  } catch {
    return null;
  }
}

function buildPrompt(volcano: any, weather: any, lore: any[], danian: any) {
  const weatherDesc = weather?.weather?.[0]?.description || 'clear';
  const temp = weather?.main?.temp ?? 20;
  const loreTitles = lore.map((l) => l.title).join(', ');
  const flow = danian?.tethys?.metrics?.spineFlow;
  const deltaIndex = danian?.tethys?.raw?.delta_index;

  return `Act as the Oracle of the Watcher, a mystical fungal consciousness 111 million years ago (Aptian/Albian age).

LIVE SIGNALS:
1. THE MOUNTAIN (Real World Kīlauea): ${volcano.status} (Color Code: ${volcano.color}). Report: ${String(volcano.update).slice(0, 200)}...
2. THE SKY: ${weatherDesc}, ${temp}°C.
3. THE ARCHIVE: ${loreTitles || 'The archives are silent'}.
4. THE RIVER (Danian Flow): spine flow ${flow ?? 'unknown'}; delta pulse ${deltaIndex ?? 'unknown'}.

TASK:
Return JSON only with:
- atmosphere: 1 sentence blending sky + mountain
- threat_level: 1-5 (Red=5, Orange=4, Yellow=3; storms increase severity)
- whispers: array of 3 distinct, cryptic dockside rumors. Use archive fragments if possible.

TONE: Scientific yet archaic. \"Pressure rising\" becomes \"The earth holds its breath.\"
No real-world place names. Use in-world terminology only.`;
}

export async function GET(request: Request) {
  try {
    const [volcano, weather, lore, danian] = await Promise.all([
      getVolcanoStatus(),
      getWeather(),
      getLoreTerms(),
      getDanianSignal(request)
    ]);

    if (!GENAI_API_KEY) {
      return NextResponse.json({
        ok: true,
        meta: {
          timestamp: new Date().toISOString(),
          sources: { volcano: 'USGS/Kilauea', weather: 'OpenWeather/Fortaleza', lore: 'WPGraphQL' },
          aiEnabled: false
        },
        atmosphere: scrubRealWorld(`Watcher status ${volcano.status}. ${volcano.update}`),
        threat_level: 2,
        whispers: lore.slice(0, 3).map((l) => l.title)
      });
    }

    const ai = new GoogleGenAI({ apiKey: GENAI_API_KEY });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(volcano, weather, lore, danian),
      config: { responseMimeType: 'application/json' }
    });
    const raw = result?.text ?? '';
    const cleaned = String(raw).replace(/```json|```/gi, '').trim();
    const parsed = JSON.parse(cleaned || '{}');

    return NextResponse.json({
      ok: true,
      meta: {
        timestamp: new Date().toISOString(),
        sources: { volcano: 'USGS/Kilauea', weather: 'OpenWeather/Fortaleza', lore: 'WPGraphQL' },
        aiEnabled: true,
        model: MODEL
      },
      atmosphere: scrubRealWorld(parsed.atmosphere || ''),
      threat_level: parsed.threat_level ?? 2,
      whispers: (parsed.whispers || []).map((w: string) => scrubRealWorld(w))
    });
  } catch (err: unknown) {
    console.error('Oracle Failure:', err);
    return NextResponse.json({
      atmosphere: 'The link is severed. Static fills the void.',
      threat_level: 1,
      whispers: ['...silence...', '...silence...', '...silence...'],
      error: 'The Oracle is silent.'
    }, { status: 500 });
  }
}
