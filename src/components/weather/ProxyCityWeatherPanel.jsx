// src/components/weather/ProxyCityWeatherPanel.jsx
'use client';

import { useState, useEffect } from 'react';
import { MapPin, Cloud, Wind, Thermometer, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { calculateSurvivability, getSurvivabilityColors, getWeatherIcon, PROXY_REGION_MAP } from './weatherUtils';

/**
 * ProxyCityWeatherPanel - Displays real-time weather from all proxy cities
 * Shows temperature, conditions, wind for each location
 * Links to corresponding Tethys map regions
 * Optimized for mobile-first responsive design
 */
export default function ProxyCityWeatherPanel({ className = '', showAllCities = true }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/tethys-intel?ai=false');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
      console.error('Proxy weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    if (autoRefresh) {
      // Refresh every 5 minutes
      const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filter to core proxy cities if needed
  const displayReports = showAllCities 
    ? data?.reports 
    : data?.reports?.filter(r => ['pteros_crato', 'shastea', 'dier_lake'].includes(r.id));

  return (
    <div className={`relative bg-[#050607] border border-cyan-500/20 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-black/40 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-cyan-400 flex items-center gap-2">
              <MapPin size={18} />
              Proxy City Weather Network
            </h3>
            <p className="text-[10px] text-cyan-600 uppercase tracking-widest mt-1">
              Real-world conditions mirroring Tethys regions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-cyan-500 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-cyan-500 bg-black/50"
              />
              <span className="hidden sm:inline">Auto-refresh</span>
            </label>
            
            <button
              onClick={fetchWeatherData}
              disabled={loading}
              className="p-2 text-cyan-500 hover:text-cyan-300 disabled:opacity-50 transition-colors"
              aria-label="Refresh weather data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {loading && !data ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-cyan-500/50"
            role="status"
            aria-live="polite"
          >
            <RefreshCw size={40} className="animate-spin mb-4" />
            <span className="text-xs uppercase tracking-[0.3em]">
              Polling weather stations...
            </span>
          </div>
        ) : error ? (
          <div
            className="flex items-start gap-3 p-4 bg-rose-900/20 border border-rose-500/40 rounded text-rose-400 text-sm"
            role="status"
            aria-live="polite"
          >
            <AlertCircle size={20} className="flex-shrink-0" />
            <div>
              <div className="font-semibold mb-1">Weather Network Error</div>
              <div className="text-xs opacity-80">{error}</div>
            </div>
          </div>
        ) : displayReports ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayReports.map((report) => {
              const regionInfo = PROXY_REGION_MAP[report.id];
              const weather = report.weather;
              const hasWeather = weather && !weather.error;
              const survivability = hasWeather ? calculateSurvivability(weather) : null;
              const colors = survivability ? getSurvivabilityColors(survivability.level) : {};
              const tempLabel = hasWeather ? `${Math.round(weather.main?.temp || 0)}°C` : 'Unknown temp';
              const conditionLabel = hasWeather ? (weather.weather?.[0]?.description || 'Conditions unknown') : 'Weather data unavailable';
              const cardDescription = `${report.label}: ${tempLabel}, ${conditionLabel}. Signal integrity ${(report.signalIntegrity * 100).toFixed(0)}%`;

              return (
                <article
                  key={report.id}
                  role="article"
                  aria-label={cardDescription}
                  className={`relative group bg-black/60 border rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                    hasWeather ? colors.border : 'border-stone-800'
                  }`}
                >
                  {/* Gradient Background */}
                  {hasWeather && (
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.bg}`} />
                  )}

                  <div className="relative p-4 space-y-3">
                    {/* Location Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm truncate">
                          {report.label}
                        </h4>
                        {regionInfo && (
                          <p className="text-[10px] text-cyan-500 uppercase tracking-wider mt-1">
                            → {regionInfo.tethysRegion}
                          </p>
                        )}
                      </div>
                      
                      {hasWeather && (
                        <span className="text-3xl flex-shrink-0" role="img" aria-label="weather icon">
                          {getWeatherIcon(weather)}
                        </span>
                      )}
                    </div>

                    {/* Weather Data */}
                    {hasWeather ? (
                      <>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-2 text-stone-300">
                            <Thermometer size={14} className="text-cyan-500" />
                            <span className="font-mono">
                              {Math.round(weather.main?.temp || 0)}°C
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-stone-300">
                            <Wind size={14} className="text-cyan-500" />
                            <span className="font-mono">
                              {Math.round(weather.wind?.speed || 0)} m/s
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <Cloud size={12} className="flex-shrink-0" />
                          <span className="capitalize truncate">
                            {weather.weather?.[0]?.description || 'Unknown'}
                          </span>
                        </div>

                        {/* Survivability Indicator */}
                        {survivability && (
                          <div
                            className={`flex items-center justify-between p-2 rounded text-xs ${colors.bg} ${colors.border} border`}
                            role="status"
                            aria-live="polite"
                          >
                            <span className={`uppercase tracking-wider font-semibold ${colors.text}`}>
                              {survivability.level} risk
                            </span>
                            <span className={`font-mono font-bold ${colors.text}`}>
                              {survivability.score}%
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-stone-500 italic py-2" aria-live="polite">
                        Weather data unavailable
                      </div>
                    )}

                    {/* Link to Map (if region has map access) */}
                    {regionInfo && (
                      <div className="pt-2 border-t border-stone-800">
                        <Link
                          href="/map"
                          className="flex items-center justify-between text-[10px] text-cyan-600 hover:text-cyan-400 uppercase tracking-widest transition-colors group/link"
                        >
                          <span>View on Atlas</span>
                          <ExternalLink size={12} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    )}

                    {/* Signal Integrity */}
                    <div className="text-[9px] text-stone-700 font-mono text-right" aria-live="polite">
                      Signal: {(report.signalIntegrity * 100).toFixed(0)}%
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      {data && (
        <div className="border-t border-cyan-500/20 bg-black/40 px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[9px] text-cyan-700 font-mono">
            <span role="status" aria-live="polite">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <span className="flex items-center gap-1" role="status" aria-live="polite">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              {displayReports?.length || 0} stations active
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// World of Tethys || D.C. Barletta
