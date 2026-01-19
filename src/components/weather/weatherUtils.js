// src/components/weather/weatherUtils.js
// Weather utility functions for survivability calculations and data formatting

/**
 * Calculate survivability score based on weather conditions
 * Returns: { level: 'high' | 'medium' | 'low', score: 0-100, warnings: string[] }
 */
export function calculateSurvivability(weatherData) {
  if (!weatherData || weatherData.error) {
    return { level: 'unknown', score: 50, warnings: ['Weather data unavailable'] };
  }

  let score = 100;
  const warnings = [];

  const { main, weather, wind } = weatherData;
  const temp = main?.temp;
  const condition = weather?.[0]?.main?.toLowerCase();
  const windSpeed = wind?.speed;

  // Temperature hazards
  if (temp !== undefined) {
    if (temp > 40) {
      score -= 30;
      warnings.push('Extreme heat - risk of heat exhaustion');
    } else if (temp > 35) {
      score -= 15;
      warnings.push('High heat - limited shade, stay hydrated');
    } else if (temp < -10) {
      score -= 30;
      warnings.push('Extreme cold - frostbite risk');
    } else if (temp < 0) {
      score -= 15;
      warnings.push('Freezing temperatures - hypothermia risk');
    }
  }

  // Weather condition hazards
  if (condition) {
    if (condition.includes('thunderstorm') || condition.includes('storm')) {
      score -= 40;
      warnings.push('Tempest active - seek shelter immediately');
    } else if (condition.includes('rain') && windSpeed > 10) {
      score -= 25;
      warnings.push('Glow tide with wind - visibility reduced');
    } else if (condition.includes('snow')) {
      score -= 20;
      warnings.push('Snowfall - reduced mobility');
    } else if (condition.includes('fog') || condition.includes('mist')) {
      score -= 10;
      warnings.push('Veil conditions - low visibility');
    }
  }

  // Wind hazards
  if (windSpeed !== undefined) {
    if (windSpeed > 20) {
      score -= 25;
      warnings.push('Dangerous winds - stay away from cliffs');
    } else if (windSpeed > 15) {
      score -= 10;
      warnings.push('Strong winds - exercise caution');
    }
  }

  score = Math.max(0, Math.min(100, score));

  let level = 'high';
  if (score < 40) level = 'low';
  else if (score < 70) level = 'medium';

  return { level, score, warnings };
}

/**
 * Get color classes for survivability level
 */
export function getSurvivabilityColors(level) {
  switch (level) {
    case 'high':
      return {
        bg: 'bg-emerald-900/20',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]'
      };
    case 'medium':
      return {
        bg: 'bg-amber-900/20',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]'
      };
    case 'low':
      return {
        bg: 'bg-rose-900/20',
        border: 'border-rose-500/40',
        text: 'text-rose-400',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]'
      };
    default:
      return {
        bg: 'bg-stone-900/20',
        border: 'border-stone-500/40',
        text: 'text-stone-400',
        glow: ''
      };
  }
}

/**
 * Format weather description for display
 */
export function formatWeatherDescription(weatherData) {
  if (!weatherData || weatherData.error) return 'Unknown conditions';
  
  const condition = weatherData.weather?.[0]?.description || 'unknown';
  return condition.charAt(0).toUpperCase() + condition.slice(1);
}

/**
 * Get weather icon based on condition
 */
export function getWeatherIcon(weatherData) {
  if (!weatherData || weatherData.error) return '❓';
  
  const main = weatherData.weather?.[0]?.main?.toLowerCase();
  const description = weatherData.weather?.[0]?.description?.toLowerCase() || '';
  
  if (main?.includes('thunder')) return '⛈️';
  if (main?.includes('drizzle')) return '🌧️';
  if (main?.includes('rain')) return '🌧️';
  if (main?.includes('snow')) return '🌨️';
  if (main?.includes('mist') || main?.includes('fog')) return '🌫️';
  if (main?.includes('smoke') || main?.includes('haze')) return '🌫️';
  if (main?.includes('dust') || main?.includes('sand')) return '💨';
  if (main?.includes('tornado')) return '🌪️';
  if (main?.includes('clear')) return '☀️';
  if (main?.includes('clouds')) {
    if (description.includes('few')) return '🌤️';
    if (description.includes('scattered')) return '⛅';
    return '☁️';
  }
  
  return '🌍';
}

/**
 * Map proxy cities to Tethys regions
 */
export const PROXY_REGION_MAP = {
  'pteros_crato': { 
    tethysRegion: 'Pteros Island', 
    realLocation: 'Crato Formation, Brazil',
    description: 'Tropical hatchery with freshwater lagoons'
  },
  'shastea': { 
    tethysRegion: 'Mt. Shastea', 
    realLocation: 'Mount Shasta, California',
    description: 'Alpine volcanic peak with mystical properties'
  },
  'dier_lake': { 
    tethysRegion: 'Dier Lake', 
    realLocation: 'Sakonnet River, Tiverton, RI',
    description: 'Tidal salt pond with brackish waters'
  },
  'athens': { 
    tethysRegion: 'Tethys Littoral', 
    realLocation: 'Athens, Greece',
    description: 'Ancient coastal settlement'
  },
  'lisbon': { 
    tethysRegion: 'Atlantic Fringe', 
    realLocation: 'Lisbon, Portugal',
    description: 'Western ocean gateway'
  },
  'cairo': { 
    tethysRegion: 'Desert Margins', 
    realLocation: 'Cairo, Egypt',
    description: 'Arid borderlands'
  }
};

// World of Tethys || D.C. Barletta
