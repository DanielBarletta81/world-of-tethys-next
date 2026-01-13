// src/components/weather/RavelWeatherOracle.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cloud, Wind, AlertTriangle, RefreshCw, Eye } from 'lucide-react';
import { calculateSurvivability, getSurvivabilityColors, getWeatherIcon } from './weatherUtils';

/**
 * RavelWeatherOracle - Displays poetic weather reports from proxy cities
 * Uses Gemini AI to generate Ravel-style atmospheric reports
 * Shows survivability warnings based on current conditions
 */
export default function RavelWeatherOracle({ focus = 'pteros_crato', className = '' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchWeatherReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({ focus, ai: 'true' });
      const res = await fetch(`/api/tethys-intel?${params}`);
      
      if (!res.ok) throw new Error('Oracle relay failed');
      
      const json = await res.json();
      setData(json);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Ravel weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [focus]);

  useEffect(() => {
    fetchWeatherReport();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeatherReport, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeatherReport]);

  // Find the focused region's weather
  const focusedReport = data?.reports?.find(r => r.id === focus);
  const survivability = focusedReport ? calculateSurvivability(focusedReport.weather) : null;
  const colors = survivability ? getSurvivabilityColors(survivability.level) : {};

  return (
    <div className={`relative bg-[#0a0808] border border-purple-900/30 rounded-xl shadow-2xl overflow-hidden ${className}`}>
      {/* Atmospheric Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(88,28,135,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none" />

      {/* Header */}
      <div className="relative border-b border-purple-900/20 bg-black/30 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-purple-400 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-purple-300">
              Ravel Weather Oracle
            </h3>
          </div>
          
          <button
            onClick={fetchWeatherReport}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 text-[10px] uppercase tracking-widest text-purple-500 hover:text-purple-300 disabled:opacity-50 transition-colors"
            aria-label="Refresh weather report"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
        
        {lastUpdate && (
          <p className="text-[9px] text-purple-600 mt-2 font-mono">
            Last signal: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="relative p-4 sm:p-6 space-y-6">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center py-12 text-purple-500/50">
            <RefreshCw size={32} className="animate-spin mb-3" />
            <span className="text-xs uppercase tracking-[0.3em] animate-pulse">
              Translating mycelial signals...
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-rose-900/20 border border-rose-500/40 rounded text-rose-400 text-sm">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        ) : data ? (
          <>
            {/* Survivability Meter */}
            {survivability && (
              <div className={`p-4 border rounded-lg ${colors.bg} ${colors.border} ${colors.glow} transition-all duration-500`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`text-2xl ${colors.text} font-bold font-mono`}>
                      {survivability.score}%
                    </div>
                    <div>
                      <div className={`text-xs uppercase tracking-wider ${colors.text} font-semibold`}>
                        Survivability
                      </div>
                      <div className="text-[10px] text-stone-500 uppercase tracking-widest">
                        {focusedReport?.label || 'Unknown Region'}
                      </div>
                    </div>
                  </div>
                  
                  {focusedReport?.weather && (
                    <div className="flex items-center gap-3 text-stone-300">
                      <span className="text-2xl" role="img" aria-label="weather icon">
                        {getWeatherIcon(focusedReport.weather)}
                      </span>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <Cloud size={12} />
                          <span>{focusedReport.weather.weather?.[0]?.description || 'unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind size={12} />
                          <span>{Math.round(focusedReport.weather.wind?.speed || 0)} m/s</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Warnings */}
                {survivability.warnings.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-current/20">
                    {survivability.warnings.map((warning, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        <span className="text-stone-300">{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Gemini AI Report */}
            {data.aiSummary && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-violet-900/5 rounded-lg" />
                <div className="relative p-5 bg-black/30 border border-purple-900/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-4 text-purple-400/70">
                    <Eye size={12} />
                    <span className="text-[9px] uppercase tracking-[0.25em] font-mono">
                      Ravel Interpretation
                    </span>
                  </div>
                  
                  <div className="font-serif text-sm leading-relaxed text-purple-100/90 space-y-3 whitespace-pre-wrap">
                    {data.aiSummary}
                  </div>
                </div>
              </div>
            )}

            {/* Signal Integrity */}
            {focusedReport?.signalIntegrity && (
              <div className="flex items-center justify-between text-[10px] text-stone-600 uppercase tracking-widest pt-3 border-t border-purple-900/20">
                <span>Signal Integrity</span>
                <span className="font-mono text-purple-500">
                  {(focusedReport.signalIntegrity * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Footer Attribution */}
      <div className="border-t border-purple-900/20 bg-black/20 px-4 sm:px-6 py-3">
        <p className="text-[9px] text-purple-600/60 text-center font-mono">
          Weather sourced via mycelial relay network • Translated by Oracle AI
        </p>
      </div>
    </div>
  );
}

// World of Tethys || D.C. Barletta
