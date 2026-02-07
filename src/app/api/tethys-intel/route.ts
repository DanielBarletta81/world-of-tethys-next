import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GENAI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const MODEL = 'gemini-2.5-flash';

// Proxy outposts that mirror Tethys regions
const OUTPOSTS = [
  // Core Tethys littoral
  { id: 'athens', label: 'Athens, Greece', city: 'Athens,GR', biome: 'Coastal' },
  { id: 'lisbon', label: 'Lisbon, Portugal', city: 'Lisbon,PT', biome: 'Atlantic' },
  { id: 'cairo', label: 'Cairo, Egypt', city: 'Cairo,EG', biome: 'Desert' },

  // Pteros proxy: Crato Formation / Araripe Basin, Brazil (closest major weather hub: Fortaleza)
  { id: 'pteros', label: 'Pteros (Crato Formation, Brazil)', city: 'Fortaleza,BR', biome: 'Tropical' },

  // Sky City proxy: Cimmerian Mountains
  { id: 'sky-city', label: 'Sky City (Cimmerian Mountains)', city: 'La Paz,BO', biome: 'High_Altitude' },

  // Watcher proxy: Volcanic outpost (Mt Etna)
  { id: 'watcher-volcano', label: 'Watcher (Volcanic Caldera)', city: 'Catania,IT', biome: 'Volcanic' },

  // Mystic Woods proxy: Monsoon rainforest
  { id: 'mystic-woods', label: 'Mystic Woods (Monsoon Canopy)', city: 'Kuala Lumpur,MY', biome: 'Monsoon' },

  // Ironwoods proxy: Temperate rainforest
  { id: 'ironwoods', label: 'Ironwoods (Temperate Rainforest)', city: 'Portland,US', biome: 'Temperate' },

  // Mammoth Hand proxy: Subarctic tundra
  { id: 'mammoth-hand-island', label: 'Mammoth Hand (Tundra Reaches)', city: 'Anchorage,US', biome: 'Subarctic' },

  // Permian Desert proxy: Atacama Desert, Chile
  { id: 'permian-desert', label: 'Permian Desert (Atacama Proxy)', city: 'San Pedro de Atacama,CL', biome: 'Desert' },

  // Shastea proxy: Mount Shasta, CA
  { id: 'mount-shastea', label: 'Mt Shastea (Mount Shasta, CA)', city: 'Mount Shasta,US', biome: 'Alpine' },

  // Dier Lake proxy: Sakonnet River / Tiverton, RI
  { id: 'dier-lake', label: 'Dier Lake (Sakonnet River, Tiverton, RI)', city: 'Tiverton,US', biome: 'Salt Pond' }
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildTethysReport(outpost, weather) {
  if (!weather || weather.error) return null;

  const tempC = Number(weather.main?.temp ?? 0);
  const wind = Number(weather.wind?.speed ?? 0);
  const pressure = Number(weather.main?.pressure ?? 1013);
  const humidity = Number(weather.main?.humidity ?? 50);
  const rain = Number(weather.rain?.['1h'] ?? 0);
  const storming = (weather.weather?.[0]?.main || '').toLowerCase().includes('storm') || rain > 2;

  const heatGrade = Math.round(tempC * 10) / 10;
  const burnRate = Math.round(Math.abs(tempC - 24) * 0.6 * 10) / 10;
  const spineFlow = Math.round((wind * 600) + (storming ? 3600 : 2100));
  const saltWake = Math.round((tempC > 32 ? 38 : 34) * 10) / 10;
  const siltBreath = Math.round(clamp((humidity / 10) + (storming ? 4 : 0), 2, 14) * 10) / 10;
  const veilPressure = Math.round(pressure * 10) / 10;
  const brimVein = Math.round(clamp((humidity / 8) + (storming ? 2 : 0), 1, 12) * 10) / 10;

  return {
    regionId: outpost.id,
    label: outpost.label,
    units: {
      heatGrade: 'HG',
      burnRate: 'BR',
      spineFlow: 'SF (m/s)',
      saltWake: 'SW (m/s)',
      siltBreath: 'SB (m/s)',
      veilPressure: 'VP',
      brimVein: 'BV'
    },
    metrics: {
      heatGrade,
      burnRate,
      spineFlow,
      saltWake,
      siltBreath,
      veilPressure,
      brimVein
    }
  };
}

async function fetchWeather(city) {
  if (!WEATHER_API_KEY) return { error: 'Missing OPENWEATHER_API_KEY' };
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    return { error: `Weather upstream error (${res.status})` };
  }
  return res.json();
}

function buildPrompt(reports, focus) {
  const lines = reports.map((r) => {
    const w = r.weather;
    if (!w || w.error) return `- ${r.label}: data missing; dispatch riders silent.`;
    const main = w.weather?.[0]?.description || 'unknown skies';
    const temp = Math.round(w.main?.temp ?? 0);
    const wind = Math.round(w.wind?.speed ?? 0);
    const tethys = r.tethys?.metrics;
    const hg = tethys?.heatGrade;
    const sf = tethys?.spineFlow;
    const vp = tethys?.veilPressure;
    return `- ${r.label}: ${main}, ${temp}°C, wind ${wind} m/s. HG ${hg ?? '--'}, SF ${sf ?? '--'} (m/s), VP ${vp ?? '--'}. Integrity ${r.signalIntegrity}.`;
  });

  return `
You are an Oracular Relay Scribe for the World of Tethys. Compose a concise field brief.
Format: two short bullet lines of factual signals + one poetic caution.
Focus region(s): ${focus || 'all outposts'}.
Signals:
${lines.join('\n')}
Anchor Sakonnet River/Tiverton as the Dier Lake salt-pond proxy (coastal, tidal, often foggy).
Treat Pteros via Crato/Araripe (Fortaleza feed) and Shastea via Mount Shasta alpine signals.
`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const focus = searchParams.get('focus');
  const includeAi = searchParams.get('ai') !== 'false';

  const reports = await Promise.all(
    OUTPOSTS.map(async (outpost) => {
      const weather = await fetchWeather(outpost.city);
      const tethys = buildTethysReport(outpost, weather);
      return {
        ...outpost,
        weather,
        tethys,
        signalIntegrity: Number((0.72 + Math.random() * 0.25).toFixed(2)) // “Pony Express” noise
      };
    })
  );

  // If Gemini key is missing or disabled, return weather-only
  if (!includeAi || !GENAI_API_KEY) {
    return NextResponse.json({ reports, aiSummary: null, aiEnabled: false });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GENAI_API_KEY });
    const prompt = buildPrompt(reports, focus);
    const result = await ai.models.generateContent({ model: MODEL, contents: prompt });
    const aiText = typeof result?.text === 'function' ? result.text() : result?.response?.text?.() || null;

    return NextResponse.json({
      reports,
      aiSummary: aiText,
      aiEnabled: true,
      model: MODEL
    });
  } catch (err) {
    console.error('Gemini relay error', err);
    return NextResponse.json({ reports, aiSummary: null, aiEnabled: false, error: 'Gemini relay failed' }, { status: 200 });
  }
}
// World of Tethys || D.C. Barletta
