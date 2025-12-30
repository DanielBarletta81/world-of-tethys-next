'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTethys } from '@/context/TethysContext';
import TeslaNode from '@/components/TeslaNode';
import NutePulse from '@/components/NutePulse';
import SluiceGatePuzzle from '@/components/SluiceGatePuzzle';
import WordPressDebug from '@/components/WordPressDebug';
import UnfoldingMap from '@/components/UnfoldingMap';
import ParchmentShader from '@/components/ParchmentShader';
import CategoryNav from '@/components/CategoryNav';
import ArtifactPlate from '@/components/ArtifactPlate';
import StaffPreview from '@/components/StaffPreview';
import { useExpedition } from '@/lib/useExpedition';
import { generateStaffProfile } from '@/lib/staffSequencer';

const geodePlates = [
  {
    id: 'lazuli',
    title: 'Plate I — Lazuli Bloom',
    specimen: 'Hydrothermal geode',
    description: 'Blue-veined chamber emitting low resonance hums.'
  },
  {
    id: 'amber',
    title: 'Plate II — Amber Trilith',
    specimen: 'Volcanic lattice',
    description: 'Holds fossilized spores used by mystic guilds.'
  }
];

const civilizations = [
  { year: 'Pre-Flood', event: 'Founding of the Tethyan Cartographers' },
  { year: 'Cycle 88', event: 'Discovery of the Resonant Vaults' },
  { year: 'Cycle 112', event: 'Exodus of the Glass Choir' }
];

const biodiversity = [
  { id: 'manta', name: 'Sky Manta', note: 'Conductive fins', image: '/window.svg' },
  { id: 'wyvern', name: 'Fen Wyvern', note: 'Mist digestion', image: '/globe.svg' },
  { id: 'orchid', name: 'Echo Orchid', note: 'Sings at dusk', image: '/file.svg' }
];

const sampleArtifacts = {
  Geodes: [
    {
      id: 'geo-001',
      slug: 'lazuli-bloom',
      title: 'Lazuli Bloom',
      image: '/window.svg',
      content:
        '<p>The Lazuli Bloom geode pulses with a soft cobalt glow. Field notes indicate it responds to chant frequencies between 380-410 Hz.</p>'
    }
  ],
  Civilizations: [
    {
      id: 'civ-101',
      slug: 'glass-choir',
      title: 'The Glass Choir',
      image: '/globe.svg',
      content:
        '<p>Scholars believe the Glass Choir migrated east after the third deluge, leaving harmonic glyphs along the canyon walls.</p>'
    }
  ],
  Biomes: [
    {
      id: 'bio-221',
      slug: 'fen-of-lanterns',
      title: 'Fen of Lanterns',
      image: '/file.svg',
      content:
        '<p>A marshland where bioluminescent reeds mark the tides. Expedition notes warn of mirage-like echoes.</p>'
    }
  ],
  Biodiversity: [
    {
      id: 'cre-301',
      slug: 'wild-hybrid',
      title: 'Wild Hybrid',
      image: '/vercel.svg',
      content:
        '<p>This creature adapts its hide to match aged manuscripts, making it nearly invisible amid field reports.</p>'
    }
  ]
};

export default function MapBridge() {
  const { syncFrequency, setSyncFrequency, oilLevel, setOilLevel, isNuteRoaring } = useTethys();
  const audioCtxRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Geodes');
  const [activeEvent, setActiveEvent] = useState(null);
  const { sessionTime, inventory } = useExpedition();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    return () => {
      audioCtxRef.current?.close?.();
    };
  }, []);

  const playRustle = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const duration = 0.35;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-3 * (i / data.length));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 2.5;
    noise.connect(filter).connect(ctx.destination);
    noise.start();
  }, []);

  const handleSyncChange = useCallback(
    (value) => {
      setSyncFrequency(value);
      playRustle();
    },
    [playRustle, setSyncFrequency]
  );

  const handleOilChange = useCallback(
    (value) => {
      setOilLevel(value);
      playRustle();
    },
    [playRustle, setOilLevel]
  );

  const applyGlobalEffects = useCallback((eventPayload) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (eventPayload?.shader?.filter) {
      root.style.setProperty('--tethys-event-filter', eventPayload.shader.filter);
    }
    if (eventPayload?.hudMessage) {
      console.info('[Tethys Event]', eventPayload.hudMessage);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchEvents = async () => {
      try {
        const res = await fetch('/wp-json/tethys/v1/active-events', { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setActiveEvent(data[0]);
          applyGlobalEffects(data[0]);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Failed to load Tethys events', error);
        }
      }
    };

    fetchEvents();
    return () => {
      controller.abort();
      if (typeof document !== 'undefined') {
        document.documentElement.style.removeProperty('--tethys-event-filter');
      }
    };
  }, [applyGlobalEffects]);

  const activeArtifacts = useMemo(() => sampleArtifacts[activeTab] || [], [activeTab]);

  const readingStats = useMemo(
    () => ({
      human: 25,
      creature: 40,
      lore: 30 + Math.floor(sessionTime / 300),
      geography: 35,
      geology: 28,
      hybrid: inventory.includes('Kith') ? 15 : 5
    }),
    [sessionTime, inventory]
  );

  const staffProfile = useMemo(
    () =>
      generateStaffProfile({
        readingStats,
        inventory,
        environment: { biome: 'Pteros Straights' }
      }),
    [readingStats, inventory]
  );

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="min-h-screen p-6 lg:p-12 flex flex-col gap-8 bg-ancient-bg/80 text-ancient-ink rounded-[2.5rem] border border-ancient-ink/20 shadow-[18px_18px_0_rgba(43,38,33,0.25)] font-body"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-ancient-ink/20 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display tracking-tight uppercase">
            Tethys <span className="text-ancient-accent">Overseer</span>
          </h1>
          <p className="text-xs font-mono text-ancient-accent uppercase tracking-[0.4em] mt-1">
            Sector: Sub-Basalt / Resonance Site Alpha
          </p>
          {activeEvent ? (
            <p className="text-[11px] font-mono text-ancient-ink/70 mt-2">
              Event: <span className="text-ancient-accent">{activeEvent.title || activeEvent.slug}</span>
            </p>
          ) : (
            <p className="text-[11px] font-mono text-ancient-ink/50 mt-2">Event: None detected</p>
          )}
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <span className="block text-[10px] text-ancient-accent uppercase font-mono">Sync Frequency</span>
            <span
              className={`text-2xl font-display ${
                syncFrequency < 400 ? 'text-ancient-accent animate-pulse' : 'text-ancient-ink'
              }`}
            >
              {syncFrequency.toFixed(1)} Hz
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-ancient-accent uppercase font-mono">Omega-Oil Yield</span>
            <span className="text-2xl font-display text-ancient-ink">{oilLevel}%</span>
          </div>
        </div>
      </header>

      <ParchmentShader className="bg-gradient-to-br from-[#e2d7c5] to-[#c7b6a1] shadow-inner-lg border border-ancient-ink/20 rounded-[2rem]">
        <UnfoldingMap mapImageUrl="/globe.svg" />
      </ParchmentShader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        <aside className="lg:col-span-3 space-y-6">
          <div className="artifact-card text-center space-y-4">
            <h3 className="text-ancient-accent font-mono text-[10px] uppercase tracking-[0.4em]">
              Biometric: Nute
            </h3>
            <NutePulse />
            <div className="text-[11px] text-ancient-ink/70 italic">
              {isNuteRoaring ? 'CAVITATION DETECTED' : 'HEART RATE STABLE'}
            </div>
          </div>

          <div className="artifact-card space-y-4">
            <h3 className="text-ancient-accent font-mono text-[10px] uppercase tracking-[0.4em]">Sluice Maintenance</h3>
            <label className="text-[10px] text-ancient-ink/70 uppercase">Resonance Load</label>
            <input
              type="range"
              min="300"
              max="600"
              value={syncFrequency}
              onChange={(e) => handleSyncChange(Number(e.target.value))}
              className="w-full h-1 bg-ancient-ink/20 rounded-lg appearance-none cursor-pointer accent-ancient-accent"
            />

            <label className="text-[10px] text-ancient-ink/70 uppercase">Oil Harvest</label>
            <input
              type="range"
              min="0"
              max="100"
              value={oilLevel}
              onChange={(e) => handleOilChange(Number(e.target.value))}
              className="w-full h-1 bg-ancient-ink/20 rounded-lg appearance-none cursor-pointer accent-ancient-accent"
            />
          </div>
        </aside>

        <main className="lg:col-span-6">
          <div className="artifact-card relative flex items-center justify-center overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,rgba(122,58,35,0.18),transparent_70%)]" />
            <TeslaNode />
          </div>
        </main>

        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div className="artifact-card">
            <SluiceGatePuzzle onOpen={() => console.log('Sluice unlocked')} />
          </div>

          <div className="artifact-card flex flex-col justify-end">
            <h4 className="text-ancient-ink text-lg font-display mb-2 italic">Exile Log: Igzier</h4>
            <p className="text-sm text-ancient-ink/80 leading-relaxed">
              “The staff realigned mid-plunge. The Wild Hybrid led me to the Sinking Sluice. Melden’s truth runs deeper than basalt.”
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="mt-4 py-2 border border-ancient-accent text-ancient-accent text-[11px] font-mono uppercase tracking-[0.4em] hover:bg-ancient-accent hover:text-white transition-all rounded-none"
            >
              Open Codex
            </motion.button>
          </div>
        </aside>
      </div>

      <ParchmentShader className="main-compendium-area rounded-[2rem] border border-ancient-ink/10">
        <CategoryNav activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeArtifacts.map((artifact) => (
          <ArtifactPlate
            key={artifact.id}
            artifact={{
              ...artifact,
              title: artifact.title,
              content: artifact.content
            }}
          />
        ))}
      </ParchmentShader>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StaffPreview profile={staffProfile} />
        <ParchmentShader className="artifact-card">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ancient-accent">
            Scholar&apos;s Chronometer
          </p>
          <h3 className="font-display text-2xl mb-2">Session Resonance</h3>
          <p className="text-sm">
            Time on site: <span className="font-mono">{Math.floor(sessionTime / 60)}m {sessionTime % 60}s</span>
          </p>
          <div className="mt-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ancient-accent mb-2">
              Inventory
            </p>
            <ul className="text-sm list-disc list-inside space-y-1">
              {inventory.length === 0 && <li>Empty satchel (stay longer to awaken relics)</li>}
              {inventory.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </ParchmentShader>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ParchmentShader className="plate-card">
          <h2 className="text-2xl font-display mb-4 uppercase tracking-wide">The Compendium — Geodes</h2>
          <div className="space-y-4">
            {geodePlates.map((plate) => (
              <article key={plate.id} className="flex flex-col gap-2 border border-ancient-ink/15 p-4">
                <p className="text-sm font-mono text-ancient-accent uppercase">{plate.title}</p>
                <p className="text-lg font-display">{plate.specimen}</p>
                <p className="text-sm text-ancient-ink/80">{plate.description}</p>
              </article>
            ))}
          </div>
        </ParchmentShader>

        <ParchmentShader className="plate-card">
          <h2 className="text-2xl font-display mb-4 uppercase tracking-wide">Civilization Scroll</h2>
          <div className="scroll-timeline">
            {civilizations.map((entry) => (
              <div key={entry.year} className="scroll-entry">
                <p className="text-sm font-mono text-ancient-accent uppercase">{entry.year}</p>
                <p className="text-base">{entry.event}</p>
              </div>
            ))}
          </div>
        </ParchmentShader>
      </section>

      <ParchmentShader className="plate-card">
        <h2 className="text-2xl font-display mb-6 uppercase tracking-wide">Biodiversity Plates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {biodiversity.map((bio) => (
            <figure key={bio.id} className="biodiversity-figure relative group">
              <img src={bio.image} alt={bio.name} className="plate-image" />
              <figcaption>
                <motion.span whileHover={{ color: '#7a3a23' }} className="cursor-help underline decoration-dotted">
                  {bio.name}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileHover={{ opacity: 1, x: 20 }}
                    className="absolute hidden md:block w-32 text-[10px] font-mono leading-tight text-stone-600 border-l border-stone-400 pl-2 top-0 left-full"
                  >
                    Field note: {bio.note}
                  </motion.div>
                </motion.span>
                <p className="text-sm text-ancient-ink/70">{bio.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </ParchmentShader>

      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <WordPressDebug />
      </motion.div>
    </motion.div>
  );
}
