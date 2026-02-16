import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { graphqlFetch } from '@/lib/graphql';

export const runtime = 'nodejs';

const GENAI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const WEATHER_KEY = process.env.OPENWEATHER_API_KEY;

const MODEL = 'gemini-2.5-flash';
const PTEROS_CITY = 'Fortaleza,BR';
const LEDGE_COORDS = { lat: -34.35, lon: 18.47 }; // Cape Point, South Africa (The Ledge)
const WATCHER_ID = '323020'; // Kīlauea
const DANIAN_ID = '09380000'; // Colorado River at Lees Ferry (Danian)
const WEEP_ID = '04216000'; // Niagara River at Buffalo (The Weep)

const FORBIDDEN_REALWORLD = [
  'earth',
  'hawaii',
  'kilauea',
  'usa',
  'united states',
  'japan',
  'niagara',
  'colorado',
  'fortaleza',
  'cape point',
  'south africa',
  'buffalo',
  'lees ferry'
];

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
  if (!WEATHER_KEY) return { pteros: null, ledge: null };
  try {
    const fetchW = async (query: string) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${WEATHER_KEY}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      return res.ok ? res.json() : null;
    };

    const [pteros, ledge] = await Promise.all([
      fetchW(`q=${encodeURIComponent(PTEROS_CITY)}`),
      fetchW(`lat=${LEDGE_COORDS.lat}&lon=${LEDGE_COORDS.lon}`)
    ]);

    return { pteros, ledge };
  } catch {
    return { pteros: null, ledge: null };
  }
}

async function getLoreTerms() {
  const data = await graphqlFetch(
    `query OracleContext($first: Int!) {
      archiveEntries(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
        }
      }
    }`,
    { first: 12 }
  );
  const nodes = data?.archiveEntries?.nodes ?? [];
  return nodes.sort(() => 0.5 - Math.random()).slice(0, 3);
}

function parseUsgsValue(series: any[], siteId: string, code: string) {
  const entry = series.find(
    (t) =>
      t?.sourceInfo?.siteCode?.[0]?.value === siteId &&
      t?.variable?.variableCode?.[0]?.value === code
  );
  const raw = entry?.values?.[0]?.value?.[0]?.value;
  const parsed = raw !== undefined ? Number(raw) : null;
  return Number.isFinite(parsed) ? parsed : null;
}

async function getHydroStatus() {
  try {
    const sites = `${DANIAN_ID},${WEEP_ID}`;
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${sites}&parameterCd=00060,00065&siteStatus=all`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const series = data?.value?.timeSeries ?? [];

    return {
      danian: {
        flowCfs: parseUsgsValue(series, DANIAN_ID, '00060'),
        heightFt: parseUsgsValue(series, DANIAN_ID, '00065')
      },
      weep: {
        flowCfs: parseUsgsValue(series, WEEP_ID, '00060'),
        heightFt: parseUsgsValue(series, WEEP_ID, '00065')
      }
    };
  } catch {
    return null;
  }
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

function buildPrompt(volcano: any, weather: any, lore: any[], danian: any, hydro: any, jumpCondition: string) {
  const pterosDesc = weather?.pteros?.weather?.[0]?.description || 'clear';
  const ledgeDesc = weather?.ledge?.weather?.[0]?.description || 'clear';
  const ledgeWind = weather?.ledge?.wind?.speed ?? 0;
  const temp = weather?.pteros?.main?.temp ?? 20;
  const loreTitles = lore.map((l) => l.title).join(', ');
  const flow = danian?.tethys?.metrics?.spineFlow;
  const deltaIndex = danian?.tethys?.raw?.delta_index;
  const danianFlow = hydro?.danian?.flowCfs ?? 'unknown';
  const danianHeight = hydro?.danian?.heightFt ?? 'unknown';
  const weepFlow = hydro?.weep?.flowCfs ?? 'unknown';
  const weepHeight = hydro?.weep?.heightFt ?? 'unknown';

  return `Act as the Oracle of the Watcher, a mystical fungal consciousness 111 million years ago (Aptian/Albian age).

LIVE SIGNALS:
1. THE MOUNTAIN (Real World Kīlauea): ${volcano.status} (Color Code: ${volcano.color}). Report: ${String(volcano.update).slice(0, 200)}...
2. THE SKY (Pteros): ${pterosDesc}, ${temp}°C.
3. THE ARCHIVE: ${loreTitles || 'The archives are silent'}.
4. THE RIVER (Danian Flow): spine flow ${flow ?? 'unknown'}; delta pulse ${deltaIndex ?? 'unknown'}; raw flow ${danianFlow} cfs; height ${danianHeight} ft.
5. THE WEEP (Great Falls): raw flow ${weepFlow} cfs; height ${weepHeight} ft.
6. THE LEDGE (Pounding Coast): ${ledgeDesc}, wind ${ledgeWind} m/s. Jump condition: ${jumpCondition}.

TASK:
Return JSON only with:
- atmosphere: 1 sentence blending sky + mountain + water
- threat_level: 1-5 (Red=5, Orange=4, Yellow=3; storms increase severity; ledge wind > 12 m/s should increase danger)
- whispers: array of 4 distinct, cryptic dockside rumors. Include: Amber Plains (gold grass or mammoths), Mt. Cinder (awakening ash), Root Tunnels (heard by fungus listeners), and one using the archive fragments.

TONE: Scientific yet archaic. \"Pressure rising\" becomes \"The earth holds its breath.\"
No real-world place names. Use in-world terminology only.`;
}

export async function GET(request: Request) {
  try {
    const [volcano, weather, lore, danian, hydro] = await Promise.all([
      getVolcanoStatus(),
      getWeather(),
      getLoreTerms(),
      getDanianSignal(request),
      getHydroStatus()
    ]);

    const weepVolume = hydro?.weep?.flowCfs ?? 0;
    const ledgeWind = weather?.ledge?.wind?.speed ?? 0;
    let jumpCondition = 'Stable';
    if (weepVolume >= 220000) jumpCondition = 'Deep Cushion (High Survival)';
    if (weepVolume < 180000) jumpCondition = 'Thin Veil (Rock Impact Likely)';
    if (ledgeWind >= 12) jumpCondition = 'Gale Force (Lethal Drift)';

    if (!GENAI_API_KEY) {
      const baseWhispers = lore.slice(0, 1).map((l) => l.title);
      const danianFlow = hydro?.danian?.flowCfs;
      const weepFlow = hydro?.weep?.flowCfs;
      return NextResponse.json({
        ok: true,
        meta: {
          timestamp: new Date().toISOString(),
          sources: {
            volcano: 'USGS/Kilauea',
            pteros: 'OpenWeather/Fortaleza',
            ledge: 'OpenWeather/CapePoint',
            danian: 'USGS/Colorado',
            weep: 'USGS/Niagara',
            lore: 'WPGraphQL'
          },
          aiEnabled: false
        },
        hydroRaw: hydro,
        weatherRaw: weather,
        jumpCondition,
        atmosphere: scrubRealWorld(`Watcher status ${volcano.status}. ${volcano.update}`),
        threat_level: 2,
        whispers: [
          `The Watcher holds at ${volcano.status}.`,
          danianFlow ? `Danian flow steadies at ${danianFlow} cfs.` : 'Danian signal is faint.',
          weepFlow ? `The Weep thunders at ${weepFlow} cfs.` : 'The Weep is veiled.',
          baseWhispers[0] || 'The archives are silent.'
        ]
      });
    }

    const ai = new GoogleGenAI({ apiKey: GENAI_API_KEY });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(volcano, weather, lore, danian, hydro, jumpCondition),
      config: { responseMimeType: 'application/json' }
    });
    const raw = result?.text ?? '';
    const cleaned = String(raw).replace(/```json|```/gi, '').trim();
    const parsed = JSON.parse(cleaned || '{}');

    return NextResponse.json({
      ok: true,
      meta: {
        timestamp: new Date().toISOString(),
        sources: {
          volcano: 'USGS/Kilauea',
          pteros: 'OpenWeather/Fortaleza',
          ledge: 'OpenWeather/CapePoint',
          danian: 'USGS/Colorado',
          weep: 'USGS/Niagara',
          lore: 'WPGraphQL'
        },
        aiEnabled: true,
        model: MODEL
      },
      hydroRaw: hydro,
      weatherRaw: weather,
      jumpCondition,
      atmosphere: scrubRealWorld(parsed.atmosphere || ''),
      threat_level: parsed.threat_level ?? 2,
      whispers: (parsed.whispers || []).map((w: string) => scrubRealWorld(w))
    });
  } catch (err: unknown) {
    console.error('Oracle Failure:', err);
    return NextResponse.json({
      atmosphere: 'The link is severed. Static fills the void.',
      threat_level: 1,
      whispers: ['...silence...', '...silence...', '...silence...', '...silence...'],
      error: 'The Oracle is silent.'
    }, { status: 500 });
  }
}
