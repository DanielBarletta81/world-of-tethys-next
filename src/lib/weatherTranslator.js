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

  // --- BIOME: VOLCANIC (e.g. Watcher) ---
  if (biome === 'Volcanic') {
    if (condition.includes('rain') || condition.includes('drizzle')) return {
      status: 'ASH VEIL',
      color: 'text-amber-400',
      message: 'Rain drags ash into the valleys. Keep the vents sealed.'
    };
    if (condition.includes('thunder') || condition.includes('storm')) return {
      status: 'FIRESTORM',
      color: 'text-rose-400',
      message: 'The caldera throws sparks. Do not linger on the ledges.'
    };
    if (condition.includes('cloud')) return {
      status: 'CINDER HAZE',
      color: 'text-stone-400',
      message: 'Ash hangs low. Keep your breath measured.'
    };
    return {
      status: 'EMBER CALM',
      color: 'text-orange-400',
      message: 'Heat rolls through the vents. The Watcher sleeps lightly.'
    };
  }

  // --- BIOME: TEMPERATE (e.g. Ironwoods) ---
  if (biome === 'Temperate') {
    if (condition.includes('rain')) return {
      status: 'IRON RAIN',
      color: 'text-emerald-400',
      message: 'The canopy drinks fast. Tracks wash clean.'
    };
    if (condition.includes('fog') || condition.includes('mist')) return {
      status: 'VEIL FOREST',
      color: 'text-stone-400',
      message: 'Mist pools in the roots. Move slow, listen for sap.'
    };
    return {
      status: 'GREEN STILL',
      color: 'text-emerald-300',
      message: 'The Ironwoods stand quiet. The air is thick with resin.'
    };
  }

  // --- BIOME: SUBARCTIC (e.g. Mammoth Hand) ---
  if (biome === 'Subarctic') {
    if (condition.includes('snow')) return {
      status: 'BONEFALL',
      color: 'text-sky-300',
      message: 'Snow cuts the ridges. Pack light, keep heat close.'
    };
    if (condition.includes('wind')) return {
      status: 'KNIFE WIND',
      color: 'text-cyan-300',
      message: 'The wind shears the tundra. Shelter in the lee.'
    };
    return {
      status: 'FROST CLEAR',
      color: 'text-slate-300',
      message: 'Cold holds steady. The mammoths keep moving.'
    };
  }

  // --- BIOME: DESERT (e.g. Permian Desert) ---
  if (biome === 'Desert') {
    if (condition.includes('wind') || condition.includes('sand')) return {
      status: 'GLASS WIND',
      color: 'text-amber-300',
      message: 'The dunes cut the horizon. Cover your eyes.'
    };
    if (condition.includes('cloud') || condition.includes('fog')) return {
      status: 'SALT HAZE',
      color: 'text-stone-400',
      message: 'Salt-laced air blurs the flats. Water is a mirage.'
    };
    return {
      status: 'HEAT WARD',
      color: 'text-amber-400',
      message: 'The desert burns clean. The sea never reached here.'
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
