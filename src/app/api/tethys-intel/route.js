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
  { id: 'pteros_crato', label: 'Pteros (Crato Formation, Brazil)', city: 'Fortaleza,BR', biome: 'Tropical' },

  // Shastea proxy: Mount Shasta, CA
  { id: 'shastea', label: 'Mt Shastea (Mount Shasta, CA)', city: 'Mount Shasta,US', biome: 'Alpine' },

  // Dier Lake proxy: Sakonnet River / Tiverton, RI
  { id: 'dier_lake', label: 'Dier Lake (Sakonnet River, Tiverton, RI)', city: 'Tiverton,US', biome: 'Salt Pond' }
];

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
    return `- ${r.label}: ${main}, ${temp}°C, wind ${wind} m/s. Integrity ${r.signalIntegrity}.`;
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
      return {
        ...outpost,
        weather,
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
