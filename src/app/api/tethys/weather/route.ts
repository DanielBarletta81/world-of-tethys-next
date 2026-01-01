import { NextResponse } from 'next/server';

// 1. THE 7 PALEO-PROXIES (Updated Spire -> Madagascar)
const PROXIES: Record<string, { lat: number, lon: number, label: string, biome: string }> = {
  skyCity:   { lat: 1.3521, lon: 103.8198, label: 'Equatorial Shelf (Singapore)', biome: 'Jungle' },
  weep:      { lat: 45.4408, lon: 12.3155, label: 'Sinking Delta (Venice)', biome: 'Swamp' },
  foundry:   { lat: 37.5079, lon: 15.0830, label: 'Volcanic Arc (Catania)', biome: 'Volcanic' },
  gargantua: { lat: 36.1408, lon: -5.3536, label: 'The Narrows (Gibraltar)', biome: 'Oceanic' },
  barrens:   { lat: 30.0444, lon: 31.2357, label: 'Southern Shore (Cairo)', biome: 'Desert' },
  ironwood:  { lat: 30.3422, lon: 130.5144, label: 'Ancient Canopy (Yakushima)', biome: 'Forest' },
  
  // NEW: Madagascar Proxy
  spire:     { lat: -18.8792, lon: 47.5079, label: 'Crystalline Peaks (Madagascar)', biome: 'Highland' }
};

// 2. LORE TRANSLATOR
function interpretCondition(code: number, biome: string) {
  // Biome-specific overrides
  if (biome === 'Volcanic' && code < 3) return 'Magma Venting';
  if (biome === 'Swamp' && code >= 45) return 'Toxic Miasma';
  if (biome === 'Desert' && code >= 30) return 'Silica Storm';
  
  // Madagascar Specific: It gets intense cyclones and heavy Highland mist
  if (biome === 'Highland' && code >= 80) return 'Cyclonic Shear'; 
  if (biome === 'Highland' && code >= 51) return 'Cloud-Forest Mist';

  // Standard Tethys mapping
  if (code >= 95) return 'Veiled Storm (Severe)';
  if (code >= 80) return 'Monsoon Deluge';
  if (code >= 60) return 'Acid Rain';
  if (code >= 51) return 'Heavy Mist';
  if (code >= 45) return 'Ash Fall';
  if (code <= 3) return 'Heat Haze'; 
  
  return 'Stable Zephyr';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locKey = searchParams.get('loc') || 'skyCity';
  
  const target = PROXIES[locKey] || PROXIES.skyCity;
  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${target.lat}&longitude=${target.lon}&current_weather=true`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 900 } });
    if (!res.ok) throw new Error(`Upstream failed (${res.status})`);
    
    const data = await res.json();
    const weather = data.current_weather || {};
    
    const condition = interpretCondition(weather.weathercode ?? 0, target.biome);
    const tempC = weather.temperature;
    
    // Sync Level Logic
    let syncLevel = 'Harmonic';
    if (weather.windspeed > 25 || tempC > 35 || tempC < 0) syncLevel = 'Dissonant';
    if (weather.windspeed > 50) syncLevel = 'Critical';

    return NextResponse.json({
      location: locKey.charAt(0).toUpperCase() + locKey.slice(1),
      condition: condition,
      temperature: `${tempC}°C`,
      windSpeed: `${weather.windspeed} km/h`,
      ashIndex: weather.windspeed > 15 ? 'Rising' : 'Stable',
      visibility: weather.weathercode > 40 ? 'Low' : 'High',
      syncLevel: syncLevel,
      proxyLabel: target.label,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Paleo-weather error:', error);
    return NextResponse.json({
      location: 'Signal Lost',
      condition: 'Static',
      temperature: '--',
      syncLevel: 'Unknown'
    });
  }
}