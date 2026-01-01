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
import StaffVisualizer from '@/components/StaffVisualizer';
import CelestialDisk from '@/components/CelestialDisk';
import LandingSequence from '@/components/LandingSequence';
import PlayerAvatar from '@/components/PlayerAvatar';
import KithOracle from '@/components/KithOracle';
import BookManifest from '@/components/BookManifest';
import PaleoGraph from '@/components/PaleoGraph';
import { useExpedition } from '@/lib/useExpedition';
import { generateStaffProfile } from '@/lib/staffSequencer';

// --- DATA ARRAYS (Restored) ---

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
  const droneRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Geodes');
  const [activeEvent, setActiveEvent] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markerError, setMarkerError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isMuted, setIsMuted] = useState(true); // Default to true initially to match server render
  const { sessionTime, inventory } = useExpedition();

  // 1. Mount Effect
  useEffect(() => {
    setIsClient(true);
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

  // Load persisted mute preference
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tethys_mute') : null;
    if (saved !== null) {
      setIsMuted(JSON.parse(saved));
    }
  }, []);

  // Hydrophone (Drone) Logic with gain ramp and persistence
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (!droneRef.current) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 55;
      gain.gain.value = 0;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      droneRef.current = { osc, gain };
    }

    const { gain } = droneRef.current;
    const now = ctx.currentTime;

    if (!isMuted) {
      if (ctx.state === 'suspended') ctx.resume();
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 2);
    } else {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 1);
    }

    localStorage.setItem('tethys_mute', JSON.stringify(isMuted));
  }, [isMuted]);

  // 2. Audio Logic
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

  const handlePointClick = useCallback((point) => {
    setSelectedMarker(point);
    const detail = document.getElementById('artifact-detail');
    if (detail) {
      detail.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // 3. Data Fetching
  useEffect(() => {
    const controller = new AbortController();
    
    // Fetch Events
    fetch('/wp-json/tethys/v1/active-events', { signal: controller.signal })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setActiveEvent(data[0]);
        }
      })
      .catch(() => {});

    // Fetch Markers (The Map Data)
    fetch('/api/tethys/archival_post', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        const valid = Array.isArray(data)
          ? data.filter(
              (post) =>
                post?.acf?.map_coords?.map_x !== undefined &&
                post?.acf?.map_coords?.map_y !== undefined
            )
          : [];
        setMarkers(valid);
        if (valid.length === 0 && Array.isArray(data) && data.length > 0) {
          console.warn("Posts found but no coordinates. Check ACF settings.");
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Map Load Failure:', err);
          setMarkerError('Map uplink severed (API Error).');
        }
      });

    return () => controller.abort();
  }, []);

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

  // --- CRITICAL: Loading check MUST be last before final return ---
  if (!isClient) {
    return (
      <div className="loading-shimmer text-xl tracking-widest text-ancient-accent" aria-busy="true">
        IGNITING VELLUM GRID...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      // IN-WORLD STYLE: Darker text, thicker border, larger padding
      className="min-h-screen p-8 lg:p-16 flex flex-col gap-10 bg-[#e6ded0] text-[#1a1510] border-[3px] border-[#3d2b1f] font-body relative overflow-hidden shadow-2xl"
    >
      <PlayerAvatar />
      <LandingSequence />
      
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-60 mix-blend-multiply z-0" />

      <div className="relative z-10 flex flex-col gap-10">
        <CelestialDisk />
        
        {/* Header: High Contrast, "Stamped" Look */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-[#3d2b1f] pb-6">
          <div>
            <h1 className="text-6xl font-display uppercase tracking-tighter leading-none text-[#2b221b] drop-shadow-sm">
              Tethys <span className="text-[#8a3c23]">Overseer</span>
            </h1>
            <p className="text-sm font-mono text-[#8a3c23] uppercase tracking-[0.3em] mt-2 font-bold">
              Sector: Sub-Basalt // Resonance Site Alpha
            </p>
            {activeEvent ? (
              <p className="text-[11px] font-mono text-[#5c4f43] mt-2">
                Event: <span className="text-[#8a3c23]">{activeEvent.title || activeEvent.slug}</span>
              </p>
            ) : (
              <p className="text-[11px] font-mono text-[#5c4f43]/50 mt-2">Event: None detected</p>
            )}
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <span className="block text-xs text-[#5c4f43] uppercase font-bold tracking-widest mb-1">Frequency</span>
              <span className={`text-4xl font-display ${syncFrequency < 400 ? 'text-[#8a3c23] animate-pulse' : 'text-[#1a1510]'}`}>
                {syncFrequency} <span className="text-lg">Hz</span>
              </span>
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                className="text-xs uppercase font-bold tracking-widest mb-1 hover:text-[#8a3c23]"
              >
                Hydrophone: {isMuted ? 'Off' : 'Live'}
              </button>
              <span className="block text-xs text-[#5c4f43] uppercase font-bold tracking-widest mb-1">Oil Yield</span>
              <span className="text-4xl font-display text-[#1a1510]">{oilLevel}%</span>
            </div>
          </div>
        </header>

        {/* The Map: Frame it like a window */}
        <ParchmentShader className="bg-[#dcd3c0] shadow-[inset_0_0_40px_rgba(61,43,31,0.15)] border-2 border-[#3d2b1f] rounded-lg min-h-[600px] relative">
          <div className="absolute top-4 left-4 z-10 bg-[#f5efe4] border border-[#3d2b1f] px-3 py-1 text-xs font-mono uppercase tracking-widest shadow-[2px_2px_0_#3d2b1f]">
            Live Cartography
          </div>
          {markerError && (
            <div className="p-4 text-red-800 font-bold text-center bg-red-100/50 border-b border-red-900">
              {markerError}
            </div>
          )}
          <UnfoldingMap
            mapImageUrl="/globe.svg"
            points={
              markers.length
                ? markers.map((post) => ({
                    id: post.id,
                    label: post?.title?.rendered || 'Unknown Site',
                    top: `${post?.acf?.map_coords?.map_y}%`,
                    left: `${post?.acf?.map_coords?.map_x}%`,
                    content: post?.content?.rendered || ''
                  }))
                : undefined
            }
            onPointClick={handlePointClick}
          />
        </ParchmentShader>

        <ParchmentShader id="artifact-detail" className="rounded-lg border-2 border-[#3d2b1f] shadow-lg p-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8a3c23] mb-2">
            Artifact Record
          </p>
          {selectedMarker ? (
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-[#1a1510]">{selectedMarker.label}</h3>
              <div
                className="prose prose-sm max-w-none text-[#3d2b1f]"
                dangerouslySetInnerHTML={{ __html: selectedMarker.content || '<p>No transcript available.</p>' }}
              />
            </div>
          ) : (
            <p className="text-sm text-[#5c4f43]">Tap a map marker to open its field report.</p>
          )}
        </ParchmentShader>

        {/* Dashboard Grid: Cards look like physical plates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls (Recessed inputs) */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-[#1a1510] border-2 border-[#3d2b1f] p-4 shadow-[6px_6px_0_rgba(61,43,31,0.2)]">
              <KithOracle />
            </div>

            <PaleoGraph />

            <div className="bg-[#f2eadd] border-2 border-[#3d2b1f] p-6 shadow-[6px_6px_0_rgba(61,43,31,0.15)]">
              <h3 className="text-[#8a3c23] font-mono text-[10px] uppercase tracking-[0.4em] mb-4 text-center">
                Biometric: Nute
              </h3>
              <NutePulse />
              <div className="text-[11px] text-[#5c4f43] italic text-center mt-2">
                {isNuteRoaring ? 'CAVITATION DETECTED' : 'HEART RATE STABLE'}
              </div>
            </div>

            <div className="bg-[#f2eadd] border-2 border-[#3d2b1f] p-6 shadow-[6px_6px_0_rgba(61,43,31,0.15)] space-y-6">
              <h3 className="text-[#8a3c23] font-mono text-[10px] uppercase tracking-[0.4em] mb-2">
                Sluice Maintenance
              </h3>
              
              <div>
                 <label className="text-xs font-bold uppercase tracking-widest text-[#5c4f43] mb-2 block">Resonance Tuning</label>
                 <input
                  type="range"
                  min="300"
                  max="600"
                  value={syncFrequency}
                  onChange={(e) => handleSyncChange(Number(e.target.value))}
                  className="w-full h-3 bg-[#2b221b] rounded-full appearance-none cursor-pointer accent-[#8a3c23] shadow-inner"
                 />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#5c4f43] mb-2 block">Oil Harvest</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={oilLevel}
                  onChange={(e) => handleOilChange(Number(e.target.value))}
                  className="w-full h-3 bg-[#2b221b] rounded-full appearance-none cursor-pointer accent-[#8a3c23] shadow-inner"
                />
              </div>
            </div>
          </aside>

          {/* Center: The Node (Visual Anchor) */}
          <main className="lg:col-span-6">
            <div className="bg-[#1a1510] border-2 border-[#3d2b1f] flex items-center justify-center min-h-[500px] shadow-[8px_8px_0_rgba(0,0,0,0.25)] relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
               <TeslaNode />
            </div>
          </main>

          {/* Right Column: Puzzles (Interactive Plate) */}
          <aside className="lg:col-span-3 flex flex-col gap-6">
            <BookManifest />
            <motion.a
              whileHover={{ scale: 1.02 }}
              href="/bookstore"
              className="bg-[#1a1510] border-2 border-[#ff8c50]/50 p-4 rounded-lg shadow-[8px_10px_24px_rgba(0,0,0,0.45),inset_0_0_30px_rgba(255,120,60,0.08)] flex items-center justify-between text-[#f6eee2]"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffb87a] font-mono">Supply Drop</p>
                <p className="text-lg font-display">Store & Signals</p>
              </div>
              <span className="px-3 py-1 text-[10px] font-mono border border-[#ff8c50]/40 rounded-full text-[#ffdcc3]">
                /bookstore
              </span>
            </motion.a>
            <div className="bg-[#f2eadd] border-2 border-[#3d2b1f] p-1 shadow-[6px_6px_0_rgba(61,43,31,0.15)]">
              <SluiceGatePuzzle onOpen={() => console.log('Sluice unlocked')} />
            </div>

            <div className="bg-[#f2eadd] border-2 border-[#3d2b1f] p-6 shadow-[6px_6px_0_rgba(61,43,31,0.15)] flex flex-col justify-end">
              <h4 className="text-[#1a1510] text-lg font-display mb-2 italic">Exile Log: Igzier</h4>
              <p className="text-sm text-[#5c4f43] leading-relaxed">
                “The staff realigned mid-plunge. The Wild Hybrid led me to the Sinking Sluice. Melden’s truth runs deeper than basalt.”
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="mt-4 py-3 border-2 border-[#8a3c23] text-[#8a3c23] font-bold text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#8a3c23] hover:text-[#f2eadd] transition-all"
              >
                Open Codex
              </motion.button>
            </div>
          </aside>
        </div>

        {/* Compendium Area */}
        <ParchmentShader className="main-compendium-area rounded-lg border-2 border-[#3d2b1f] shadow-lg p-8">
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

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ParchmentShader className="artifact-card">
            <StaffPreview profile={staffProfile} />
          </ParchmentShader>
          <ParchmentShader className="artifact-card">
            <StaffVisualizer staffData={staffProfile} />
          </ParchmentShader>
          <ParchmentShader className="artifact-card">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8a3c23]">
              Scholar&apos;s Chronometer
            </p>
            <h3 className="font-display text-2xl mb-2">Session Resonance</h3>
            <p className="text-sm">
              Time on site: <span className="font-mono">{Math.floor(sessionTime / 60)}m {sessionTime % 60}s</span>
            </p>
            <div className="mt-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8a3c23] mb-2">
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
                <article key={plate.id} className="flex flex-col gap-2 border border-[#3d2b1f]/15 p-4">
                  <p className="text-sm font-mono text-[#8a3c23] uppercase">{plate.title}</p>
                  <p className="text-lg font-display">{plate.specimen}</p>
                  <p className="text-sm text-[#5c4f43]">{plate.description}</p>
                </article>
              ))}
            </div>
          </ParchmentShader>

          <ParchmentShader className="plate-card">
            <h2 className="text-2xl font-display mb-4 uppercase tracking-wide">Civilization Scroll</h2>
            <div className="scroll-timeline">
              {civilizations.map((entry) => (
                <div key={entry.year} className="scroll-entry">
                  <p className="text-sm font-mono text-[#8a3c23] uppercase">{entry.year}</p>
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
                <img src={bio.image} alt={bio.name} className="plate-image border border-[#3d2b1f]" />
                <figcaption>
                  <motion.span whileHover={{ color: '#7a3a23' }} className="cursor-help underline decoration-dotted font-bold">
                    {bio.name}
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      whileHover={{ opacity: 1, x: 20 }}
                      className="absolute hidden md:block w-32 text-[10px] font-mono leading-tight text-[#5c4f43] border-l border-[#8a3c23] pl-2 top-0 left-full bg-[#f5efe4] p-2 shadow-md z-20"
                    >
                      Field note: {bio.note}
                    </motion.div>
                  </motion.span>
                  <p className="text-sm text-[#5c4f43]">{bio.note}</p>
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
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <WordPressDebug />
        </motion.div>
      </div>
    </motion.div>
  );
}
