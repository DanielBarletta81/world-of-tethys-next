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
      status: 'SPORE BLOOM',
      color: 'text-emerald-400',
      message: 'The rains feed the rot. The fungal paths are expanding.'
    };
    if (condition.includes('thunder') || condition.includes('storm')) return {
      status: 'SKY WRATH',
      color: 'text-dissonant-red',
      message: 'The Great Storm wakes. Hide beneath the roots.'
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
      status: 'ACID WASHOUT',
      color: 'text-forge-orange',
      message: 'The falling water burns. Retreat to the lower caves.'
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