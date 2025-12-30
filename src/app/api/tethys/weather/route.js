const PROXIES = {
  skyCity: { lat: 27.71, lon: 85.32, label: 'Kathmandu Valley' },
  gargantua: { lat: 37.98, lon: 23.72, label: 'Mediterranean Coast' }
};

function interpretCondition(code) {
  if (code >= 60) return 'Monsoon Surge';
  if (code >= 50) return 'Heavy Mist';
  if (code >= 30) return 'Dust Bloom';
  return 'Stable Zephyr';
}

export async function GET() {
  const target = PROXIES.skyCity;
  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${target.lat}&longitude=${target.lon}&current_weather=true`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 600 } });
    if (!res.ok) {
      throw new Error(`Weather upstream failed (${res.status})`);
    }
    const data = await res.json();
    const weather = data?.current_weather || {};

    return Response.json({
      location: 'Sky City',
      proxy: target.label,
      condition: interpretCondition(weather.weathercode ?? 0),
      temperature: weather.temperature ? `${weather.temperature}°C` : 'Unknown',
      syncLevel: weather.windspeed > 20 ? 'Dissonant' : 'Stable',
      capturedAt: weather.time || new Date().toISOString()
    });
  } catch (error) {
    console.error('Paleo-weather error:', error);
    return Response.json({ error: 'Atmosphere unreadable' }, { status: 500 });
  }
}
