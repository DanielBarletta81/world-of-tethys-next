// src/lib/weatherTranslator.js

export function translateWeatherToLore(weatherData, biome) {
  // If API fails or no data
  if (!weatherData) return {
    status: 'THE MISTS ARE THICK',
    color: 'text-stone-500',
    message: 'I cannot see the sky. The spirits are silent.'
  };

  const condition = weatherData.weather[0].main.toLowerCase(); // rain, clear, clouds, etc.

  // --- BIOME: MONSOON (e.g. The Mystic Wood) ---
  if (biome === 'Monsoon') {
    if (condition.includes('rain') || condition.includes('drizzle')) return {
      status: 'GLOW TIDE',
      color: 'text-emerald-400',
      message: 'Glow tide rises in the roots. The fungal paths widen.'
    };
    if (condition.includes('thunder') || condition.includes('storm')) return {
      status: 'TEMPEST',
      color: 'text-dissonant-red',
      message: 'The Tempest wakes. Keep low and let it pass.'
    };
    if (condition.includes('clear') || condition.includes('sun')) return {
      status: 'DORMANCY',
      color: 'text-amber-400',
      message: 'The canopy is dry. The hunting is good.'
    };
    if (condition.includes('cloud')) return {
      status: 'SHADOWED',
      color: 'text-stone-400',
      message: 'The sun is hidden. Watch for movement in the grey.'
    };
  }

  // --- BIOME: HIGH ALTITUDE (e.g. Sky City) ---
  if (biome === 'High_Altitude') {
    if (condition.includes('rain') || condition.includes('thunder')) return {
      status: 'WATCHER ASHFALL',
      color: 'text-forge-orange',
      message: 'Ash rides the rain. Keep to the lower stone.'
    };
    if (condition.includes('clouds')) return {
      status: 'BLINDING FOG',
      color: 'text-stone-400',
      message: 'We cannot see the peaks. The Drakes are grounded.'
    };
    return {
      status: 'CLEAR SKIES',
      color: 'text-cyan-400',
      message: 'The wind is steady. The Drakes rule the air today.'
    };
  }

  // Fallback for other biomes
  return {
    status: 'WATCHING',
    color: 'text-stone-400',
    message: `The winds whisper of ${condition}. Remain vigilant.`
  };
}
// World of Tethys || D.C. Barletta
