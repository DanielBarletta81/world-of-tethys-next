// src/components/weather/SurvivabilityMeter.jsx
'use client';

import { AlertTriangle, Shield, Activity } from 'lucide-react';
import { calculateSurvivability, getSurvivabilityColors } from './weatherUtils';

/**
 * SurvivabilityMeter - Compact weather hazard indicator
 * Shows survivability score and warnings for a specific location
 * Can be embedded in map overlays, tooltips, or info panels
 */
export default function SurvivabilityMeter({ weatherData, locationName, compact = false, className = '' }) {
  if (!weatherData || weatherData.error) {
    return (
      <div className={`flex items-center gap-2 text-stone-500 text-xs ${className}`}>
        <Activity size={14} className="opacity-50" />
        <span className="italic">Weather data unavailable</span>
      </div>
    );
  }

  const survivability = calculateSurvivability(weatherData);
  const colors = getSurvivabilityColors(survivability.level);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded ${colors.bg} ${colors.border} border ${className}`}>
        <Shield size={12} className={colors.text} />
        <span className={`text-xs font-mono font-semibold ${colors.text}`}>
          {survivability.score}%
        </span>
        {survivability.warnings.length > 0 && (
          <AlertTriangle size={12} className={colors.text} />
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg ${colors.bg} ${colors.border} border ${colors.glow} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield size={16} className={colors.text} />
          <span className={`text-xs uppercase tracking-wider font-semibold ${colors.text}`}>
            Survivability
          </span>
        </div>
        <div className={`text-2xl font-mono font-bold ${colors.text}`}>
          {survivability.score}%
        </div>
      </div>

      {/* Location */}
      {locationName && (
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-3">
          {locationName}
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative h-2 bg-black/40 rounded-full overflow-hidden mb-3">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${colors.text.replace('text-', 'bg-')}`}
          style={{ width: `${survivability.score}%` }}
        />
      </div>

      {/* Risk Level */}
      <div className="flex items-center justify-between text-xs mb-3">
        <span className={`uppercase tracking-wider font-semibold ${colors.text}`}>
          {survivability.level.toUpperCase()} RISK
        </span>
        <span className="text-stone-500 font-mono">
          {survivability.level === 'high' ? '✓ Safe' : 
           survivability.level === 'medium' ? '⚠ Caution' : 
           '⛔ Dangerous'}
        </span>
      </div>

      {/* Warnings */}
      {survivability.warnings.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-current/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
            <AlertTriangle size={14} />
            <span>Active Hazards</span>
          </div>
          {survivability.warnings.map((warning, idx) => (
            <div key={idx} className="text-xs text-stone-400 pl-6">
              • {warning}
            </div>
          ))}
        </div>
      )}

      {/* Weather Conditions */}
      <div className="mt-3 pt-3 border-t border-stone-800 grid grid-cols-2 gap-2 text-[10px] text-stone-500">
        <div>
          <span className="block uppercase tracking-widest mb-1">Temp</span>
          <span className="font-mono text-stone-300">
            {Math.round(weatherData.main?.temp || 0)}°C
          </span>
        </div>
        <div>
          <span className="block uppercase tracking-widest mb-1">Wind</span>
          <span className="font-mono text-stone-300">
            {Math.round(weatherData.wind?.speed || 0)} m/s
          </span>
        </div>
        <div className="col-span-2">
          <span className="block uppercase tracking-widest mb-1">Conditions</span>
          <span className="capitalize text-stone-300">
            {weatherData.weather?.[0]?.description || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
}

// World of Tethys || D.C. Barletta
