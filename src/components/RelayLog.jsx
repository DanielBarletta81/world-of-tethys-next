'use client';

import { useEffect, useState } from 'react';
import { translateWeatherToLore } from '@/lib/weatherTranslator';
import { Radio, Activity, Loader2, WifiOff } from 'lucide-react';

// Fetches /api/tethys-intel and renders relay status for proxy outposts
export default function RelayLog({ focus = 'all' }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tethys-intel?focus=${encodeURIComponent(focus)}&ai=false`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setReports(data.reports || []);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'relay failure');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [focus]);

  return (
    <div className="bg-[#11100f] border border-stone-800 rounded-lg p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-400">
          <Radio size={14} className="text-amber-500" />
          Relay Log
        </div>
        {loading && <Loader2 size={14} className="animate-spin text-stone-500" />}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-900/30 rounded p-2">
          <WifiOff size={14} /> {error}
        </div>
      )}

      {!error && (
        <div className="space-y-3">
          {reports.map((r) => {
            const lore = translateWeatherToLore(r.weather, r.biome);
            const integrity = Math.round((r.signalIntegrity || 0) * 100);
            return (
              <div key={r.id} className="border border-stone-800 rounded p-3 bg-stone-950/40">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-stone-300">
                  <span>{r.label}</span>
                  <span className="flex items-center gap-1 text-[10px] text-stone-500">
                    <Activity size={12} className={integrity >= 80 ? 'text-emerald-400' : integrity >= 60 ? 'text-amber-400' : 'text-red-400'} />
                    {integrity}%
                  </span>
                </div>
                <div className={`mt-1 text-sm font-serif ${lore?.color || 'text-stone-300'}`}>
                  {lore?.status || 'No signal'}
                </div>
                <div className="text-[11px] text-stone-500 font-mono leading-snug">
                  {lore?.message || 'Listening...'}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
// World of Tethys || D.C. Barletta
