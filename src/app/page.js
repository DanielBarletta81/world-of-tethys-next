'use client';

import { motion } from 'framer-motion';
import { useTethys } from '@/context/TethysContext';
import TeslaNode from '@/components/TeslaNode';
import NutePulse from '@/components/NutePulse';
import SluiceGatePuzzle from '@/components/SluiceGatePuzzle';

export default function MapBridge() {
  const { syncFrequency, setSyncFrequency, oilLevel, setOilLevel, isNuteRoaring } = useTethys();

  return (
    <div className="min-h-screen p-6 lg:p-12 flex flex-col gap-8 bg-tethys-bg text-white rounded-[3rem] bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.15),_transparent_50%)]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sync-violet/20 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
            Tethys <span className="text-sync-glow">Overseer</span>
          </h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-[0.4em] mt-1">Sector: Sub-Basalt / Resonance Site Alpha</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <span className="block text-[10px] text-gray-500 uppercase font-mono">Sync Frequency</span>
            <span className={`text-2xl font-black ${syncFrequency < 400 ? 'text-dissonant-red animate-pulse' : 'text-sync-violet'}`}>
              {syncFrequency.toFixed(1)} Hz
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-gray-500 uppercase font-mono">Omega-Oil Yield</span>
            <span className="text-2xl font-black text-sync-glow">{oilLevel}%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-tethys-card border border-nute-emerald/20 p-6 rounded-3xl">
            <h3 className="text-nute-emerald font-mono text-[10px] uppercase mb-4 tracking-[0.4em] text-center">Biometric: Nute</h3>
            <NutePulse />
            <div className="mt-4 text-[10px] text-gray-500 italic text-center">{isNuteRoaring ? 'CAVITATION DETECTED' : 'HEART RATE STABLE'}</div>
          </div>

          <div className="bg-tethys-card border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.4em]">Sluice Maintenance</h3>
            <label className="text-[10px] text-gray-500 uppercase">Resonance Load</label>
            <input
              type="range"
              min="300"
              max="600"
              value={syncFrequency}
              onChange={(e) => setSyncFrequency(Number(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-sync-violet"
            />

            <label className="text-[10px] text-gray-500 uppercase">Oil Harvest</label>
            <input
              type="range"
              min="0"
              max="100"
              value={oilLevel}
              onChange={(e) => setOilLevel(Number(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-sync-glow"
            />
          </div>
        </aside>

        <main className="lg:col-span-6 relative bg-black/40 rounded-[3rem] border border-white/5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#8b5cf6_0%,transparent_70%)]" />
          <TeslaNode />
        </main>

        <aside className="lg:col-span-3 flex flex-col gap-6">
          <SluiceGatePuzzle onOpen={() => console.log('Sluice unlocked')} />

          <div className="flex-grow bg-tethys-card/50 border border-white/5 p-6 rounded-3xl flex flex-col justify-end">
            <h4 className="text-white text-sm font-bold mb-2 italic">Exile Log: Igzier</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              “The staff realigned mid-plunge. The Wild Hybrid led me to the Sinking Sluice. Melden’s truth runs deeper than basalt.”
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="mt-4 py-2 border border-sync-violet text-sync-violet text-[10px] font-mono uppercase tracking-[0.4em] hover:bg-sync-violet hover:text-white transition-all rounded-lg"
            >
              Open Codex
            </motion.button>
          </div>
        </aside>
      </div>
    </div>
  );
}
