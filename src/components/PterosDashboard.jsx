'use client'; // 1. CRITICAL FIX: Tells Next.js this is a Client Component

import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Droplets, Anchor, Navigation, Waves, Fish, AlertTriangle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useTethys } from '@/context/TethysContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const PterosDashboard = () => {
  const { playerProfile } = useTethys();
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [oracleStatus, setOracleStatus] = useState(null);
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleError, setOracleError] = useState(null);
  const [showUnlockHint, setShowUnlockHint] = useState(false);
  const [activeLore, setActiveLore] = useState(null);
  const weatherUnlocked = Boolean(playerProfile?.progression?.weatherUnlocked);
  const oracleConsultedAt = playerProfile?.progression?.oracleConsultedAt;
  const loreScrolls = useMemo(
    () => ({
      br: {
        title: 'Burn Rate (BR)',
        body:
          'Rate of danger accumulation. A higher BR means the air is pulling heat out of you or pushing it in. ' +
          'Sky City logs BR as a warning. Ironwood only notes when it crosses the shade line.'
      },
      sf: {
        title: 'Spine Flow (SF)',
        body:
          'River vitality measured in spine-pulse. A higher SF means the channel carries memory and force. ' +
          'Pteros stations treat SF as life-risk, not bounty.'
      },
      sw: {
        title: 'Salt Wake (SW)',
        body:
          'Estuary influence. SW climbs when the sea asserts itself. High SW shifts the hatchery schedule and ' +
          'changes which predators cross the straits.'
      },
      sb: {
        title: 'Silt Breath (SB)',
        body:
          'How much the water remembers stone. SB rises after tempests and ashfall. Loaded water changes the color ' +
          'of everything it touches.'
      }
    }),
    []
  );

  useEffect(() => {
    if (!weatherUnlocked) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();

    async function initSystem() {
      try {
        const res = await fetch('/api/tethys-intel?focus=pteros&ai=true', { signal: controller.signal });
        const data = await res.json();
        const pterosReport = data.reports?.find((report) => report.id === 'pteros');

        setTelemetry({
          weather: pterosReport?.weather,
          aiBrief: data.aiSummary,
          integrity: pterosReport?.signalIntegrity
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Signal Lost:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    initSystem();

    return () => controller.abort();
  }, [weatherUnlocked]);

  useEffect(() => {
    if (!weatherUnlocked || !oracleConsultedAt) return;
    const consultedAt = new Date(oracleConsultedAt).getTime();
    if (!Number.isFinite(consultedAt)) return;
    const windowMs = 2 * 60 * 1000;
    if (Date.now() - consultedAt > windowMs) return;
    setShowUnlockHint(true);
    const timer = setTimeout(() => setShowUnlockHint(false), 5000);
    return () => clearTimeout(timer);
  }, [oracleConsultedAt, weatherUnlocked]);

  async function checkOracleStatus() {
    setOracleLoading(true);
    setOracleError(null);
    try {
      const res = await fetch('/api/admin/seed-oracle', {
        headers: {
          'x-admin-key': adminKey
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Status check failed');
      }
      setOracleStatus(data);
    } catch (err) {
      setOracleError(err.message);
      setOracleStatus(null);
    } finally {
      setOracleLoading(false);
    }
  }

  const activityData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Bait Biomass (Tons)',
        data: [120, 115, 200, 350, 340, 180, 130],
        borderColor: '#06b6d4', 
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Apex Activity',
        data: [10, 5, 15, 85, 90, 40, 20],
        borderColor: '#f43f5e', 
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: { color: '#292524' },
        ticks: { color: '#78716c' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#78716c' }
      }
    },
    plugins: {
      legend: { labels: { color: '#a8a29e' } }
    }
  };

  if (!weatherUnlocked) {
    return (
      <div className="bg-[#1c1917] border border-amber-900/40 p-8 rounded-lg flex flex-col items-center justify-center text-center space-y-3">
        <div className="text-xs uppercase tracking-[0.3em] text-amber-500/80">Signal Muted</div>
        <p className="text-sm text-stone-400 max-w-md">
          The station cannot read the sky without a spore link.
          Consult the Oracle Pool to attune the carrier.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] p-8 flex items-center justify-center">
        <div className="text-amber-600 animate-pulse uppercase tracking-widest text-xs">
          Initializing Pteros Sensor Array...
        </div>
      </div>
    );
  }

  const weatherMain = telemetry?.weather?.weather?.[0]?.main?.toLowerCase() || '';
  const isStorming = weatherMain.includes('rain') || weatherMain.includes('storm') || weatherMain.includes('thunder');
  const temp = telemetry?.weather?.main?.temp ?? 30;
  const calculatedFlow = isStorming ? 12000 : 8500;
  const calculatedSalinity = temp > 32 ? 38 : 34;
  const calculatedTurbidity = isStorming ? 6.8 : 4.2;
  const thermalDrift = Math.round((temp + 12) * 1.2);
  const now = telemetry?.weather?.dt;
  const sunrise = telemetry?.weather?.sys?.sunrise;
  const sunset = telemetry?.weather?.sys?.sunset;
  const isNight = typeof now === 'number' && typeof sunrise === 'number' && typeof sunset === 'number'
    ? now < sunrise || now > sunset
    : false;
  const threatLevel = isStorming ? 'TEMPEST' : 'ELEVATED';

  return (
    <div
      className={`min-h-screen text-[#e7e5e4] font-mono p-4 md:p-8 transition-colors duration-1000 ${
        isNight ? 'bg-[#07060a]' : 'bg-[#0b0705]'
      }`}
    >
      {showUnlockHint && (
        <div className="mb-6 border border-emerald-900/40 bg-emerald-950/30 text-emerald-300 text-[10px] uppercase tracking-[0.3em] px-4 py-3 rounded">
          Spore Link Sealed
        </div>
      )}
      
      {/* Top Bar: Station Info */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#3a2416] pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-amber-400 uppercase flex items-center gap-3">
            <Anchor className="w-8 h-8" /> Pteros River Watch
          </h1>
          <p className="text-xs text-[#78716c] uppercase tracking-[0.2em] mt-1">
            Twin Straits River-ward • Estuary Vault
          </p>
          <p className="mt-2 text-[10px] font-mono text-amber-500/80 leading-relaxed uppercase">
            {">"} {telemetry?.aiBrief || 'Awaiting Gemini Packet...'}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-[#150c08] p-3 rounded border border-[#3a2416]">
          <div className="text-right">
            <div className="text-[10px] text-[#78716c] uppercase">Current Era</div>
            <div className="font-bold text-amber-500">111.4 M.Y.A.</div>
          </div>
          <div className="h-8 w-[1px] bg-[#4a2b18]"></div>
          <div className="text-right">
            <div className="text-[10px] text-[#78716c] uppercase">Threat Status</div>
            <div className={`font-bold ${threatLevel === 'TEMPEST' ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`}>
              {threatLevel}
            </div>
          </div>
          <div className="h-8 w-[1px] bg-[#4a2b18]"></div>
          <div className="text-right">
            <div className="text-[10px] text-[#78716c] uppercase">BR</div>
            <div className="font-bold text-amber-500">
              {Number.isFinite(thermalDrift) ? `${thermalDrift} (m/s)` : '--'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#78716c] uppercase">Signal Integrity</div>
            <div className="font-bold text-amber-500">
              {telemetry?.integrity ? `${Math.round(telemetry.integrity * 100)}%` : '--'}
            </div>
          </div>
        </div>
      </header>
      <div className="mb-6 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-stone-500">
        {['BR', 'SF', 'SW', 'SB'].map((sigil) => (
          <button
            key={sigil}
            type="button"
            onMouseEnter={() => setActiveLore(sigil.toLowerCase())}
            onMouseLeave={() => setActiveLore(null)}
            onFocus={() => setActiveLore(sigil.toLowerCase())}
            onBlur={() => setActiveLore(null)}
            onClick={() => setActiveLore((prev) => (prev === sigil.toLowerCase() ? null : sigil.toLowerCase()))}
            className="relative flex h-7 w-7 items-center justify-center rounded-full border border-amber-700/40 bg-[#120b07] text-[9px] text-amber-200/80 transition hover:border-amber-400/70"
            aria-label={`Open lore for ${sigil}`}
          >
            {sigil}
          </button>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Hydro-Dynamics */}
        <div className="space-y-6">
          
          <div className="bg-[#150c08] border border-[#3a2416] p-6 rounded-lg relative overflow-hidden group hover:border-amber-700 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Waves size={64} /></div>
            <h3 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <Navigation className="w-4 h-4" /> SF
            </h3>
            <div className="flex items-end gap-2 mb-2">
              {/* Data is safe to render now because of 'mounted' check */}
              <span className="text-4xl font-bold text-white">{Math.floor(calculatedFlow)}</span>
              <span className="text-sm text-[#78716c] mb-1">SF (m/s)</span>
            </div>
            <div className="w-full bg-[#0b0705] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500/80 w-[75%] animate-pulse"></div>
            </div>
            <p className="text-[10px] text-[#78716c] mt-3">
              {isStorming
                ? 'Tempest surge detected from offshore systems. Tidal backflow expected.'
                : 'Freshwater pulse detected from Ironwoods watershed. Nutrient load increasing.'}
            </p>
          </div>

          <div className="bg-[#150c08] border border-[#3a2416] p-6 rounded-lg relative overflow-hidden group hover:border-amber-700 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Droplets size={64} /></div>
            <h3 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> SW
            </h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-white">{calculatedSalinity.toFixed(1)}</span>
              <span className="text-sm text-[#78716c] mb-1">SW (m/s)</span>
            </div>
            <div className="flex text-[10px] uppercase tracking-wider justify-between text-[#57534e] mt-2">
              <span>Fresh (0)</span>
              <span>Brackish (15)</span>
              <span>Marine (35)</span>
            </div>
            <div className="w-full h-2 rounded-full mt-1 bg-gradient-to-r from-amber-300 via-orange-500 to-red-900 relative">
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-white border border-black shadow"
                style={{ left: `${(calculatedSalinity / 35) * 100}%`, transition: 'left 1s ease' }}
              ></div>
            </div>
          </div>

        </div>

        {/* Column 2: The Feeding Frenzy (Central Chart) */}
        <div className="lg:col-span-2 bg-[#150c08] border border-[#3a2416] p-6 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#a8a29e] text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <Fish className="w-4 h-4" /> Biomass Interaction Log
            </h3>
            <span className="px-2 py-1 bg-[#292524] text-[10px] uppercase text-rose-400 border border-rose-900/30 rounded animate-pulse">
              Frenzy Imminent
            </span>
          </div>
          
          <div className="h-[300px] w-full">
            <Line data={activityData} options={chartOptions} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#3a2416]">
             <div>
               <div className="text-[10px] text-[#78716c] uppercase">Dominant Bait</div>
               <div className="text-cyan-400 font-bold">Silver-Scale Schools</div>
             </div>
             <div>
               <div className="text-[10px] text-[#78716c] uppercase">Dominant Predator</div>
               <div className="text-rose-400 font-bold">Spinosaurus Aegyptiacus</div>
             </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: The Twin Straits Status */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-[#150c08] border border-[#3a2416] p-4 rounded flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#0b0705] flex items-center justify-center border border-[#3a2416] text-[#57534e]">W</div>
            <div>
              <h4 className="font-bold text-sm text-[#e7e5e4]">West Strait</h4>
              <p className="text-[10px] text-[#78716c] uppercase">SB: {calculatedTurbidity.toFixed(1)} (m/s)</p>
            </div>
          </div>
          <div className="text-emerald-500 text-xs font-bold bg-emerald-950/30 px-3 py-1 rounded border border-emerald-900">
            SAFE PASSAGE
          </div>
        </div>

        <div className="bg-[#150c08] border-l-4 border-rose-600 p-4 rounded flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#0b0705] flex items-center justify-center border border-[#3a2416] text-rose-800">E</div>
            <div>
              <h4 className="font-bold text-sm text-[#e7e5e4]">East Strait</h4>
              <p className="text-[10px] text-[#78716c] uppercase">SW: {calculatedSalinity.toFixed(1)} (m/s)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-950/30 px-3 py-1 rounded border border-rose-900">
            <AlertTriangle size={12} />
            APEX BREACH
          </div>
        </div>

      </div>

      <div className="mt-6 bg-[#120b07] border border-[#3a2416] p-4 rounded">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#78716c]">Oracle Seeder Status</div>
            <div className="text-xs text-amber-500/80 mt-1">
              {oracleStatus
                ? `Last seeded: ${oracleStatus.lastSeededAt || 'Unknown'} • Count: ${oracleStatus.count ?? '--'}`
                : 'No status fetched yet.'}
            </div>
            {oracleError && <div className="text-[10px] text-rose-400 mt-1">Error: {oracleError}</div>}
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <input
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Admin key"
              className="bg-[#150c08] border border-[#3a2416] rounded px-3 py-2 text-xs text-[#e7e5e4] placeholder:text-[#57534e]"
            />
            <button
              type="button"
              onClick={checkOracleStatus}
              className="px-3 py-2 text-xs uppercase tracking-widest bg-amber-600/20 text-amber-400 border border-amber-900/40 rounded hover:bg-amber-600/30 transition-colors"
              disabled={oracleLoading || !adminKey}
            >
              {oracleLoading ? 'Checking...' : 'Check Status'}
            </button>
          </div>
        </div>
      </div>

      {activeLore && loreScrolls[activeLore] ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4" onClick={() => setActiveLore(null)}>
          <div
            className="max-w-md w-full rounded-2xl border border-amber-700/40 bg-[#120b07] p-6 text-stone-200 shadow-[0_20px_60px_rgba(0,0,0,0.6)] lore-portal"
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setActiveLore(null)}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.3em] text-amber-300">{loreScrolls[activeLore].title}</div>
              <button
                type="button"
                onClick={() => setActiveLore(null)}
                className="text-[10px] uppercase tracking-[0.3em] text-stone-400 hover:text-amber-200"
              >
                Close
              </button>
            </div>
            <div className="mt-4 max-h-[45vh] overflow-y-auto text-sm leading-relaxed text-stone-300">
              {loreScrolls[activeLore].body}
            </div>
          </div>
        </div>
      ) : null}
      <style jsx>{`
        .lore-portal {
          position: relative;
          animation: portalBloom 420ms ease-out;
        }
        .lore-portal::before {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 18px;
          border: 1px solid rgba(88, 248, 220, 0.18);
          box-shadow:
            0 0 18px rgba(88, 248, 220, 0.18),
            0 0 28px rgba(251, 191, 36, 0.16);
          background: radial-gradient(circle at 30% 20%, rgba(88, 248, 220, 0.08), transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.08), transparent 50%);
          animation: portalRing 4.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes portalBloom {
          0% {
            transform: scale(0.96);
            opacity: 0.1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes portalRing {
          0%,
          100% {
            opacity: 0.28;
            filter: blur(0.2px);
          }
          50% {
            opacity: 0.65;
            filter: blur(1px);
          }
        }
      `}</style>
      
    </div>
  );
};

export default PterosDashboard;
// World of Tethys || D.C. Barletta
