'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import cdn from '@/lib/cdn';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import PrimaryNav from '@/components/layout/navigation/PrimaryNav';

export const dynamic = 'force-dynamic';

const TRACKS = [
  {
    id: 'weep_log_01',
    title: 'Log 001: The Weep',
    type: 'Audiobook - Episode 1 Preview',
    duration: '07:20',
    src: cdn('/audio/Ep_01_Preview.mp3'),
    frequency: 98.4,
    band: 1.2,
    hint: 'Fresh water presses into salt. The bay tastes thin.'
  },
  {
    id: 'weep_signal',
    title: 'Signal: The Weep',
    type: 'Ambient Lore',
    duration: '03:45',
    src: cdn('/audio/weep-ambience.mp3'),
    frequency: 94.7,
    band: 0.9,
    hint: 'The surface hums, then opens.'
  },
  {
    id: 'council_transmission',
    title: 'Transmission: Council',
    type: 'Podcast Ep. 4',
    duration: '45:10',
    src: cdn('/audio/podcast-4.mp3'),
    frequency: 103.1,
    band: 0.8,
    hint: 'The upper glass is vibrating.'
  }
];

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const MIN_FREQ = 90;
const MAX_FREQ = 110;
const MIN_ANGLE = -135;
const MAX_ANGLE = 135;

const freqToAngle = (freq) => {
  const t = (freq - MIN_FREQ) / (MAX_FREQ - MIN_FREQ);
  return MIN_ANGLE + t * (MAX_ANGLE - MIN_ANGLE);
};

const angleToFreq = (angle) => {
  const t = (angle - MIN_ANGLE) / (MAX_ANGLE - MIN_ANGLE);
  return MIN_FREQ + t * (MAX_FREQ - MIN_FREQ);
};

const LISTEN_BREADCRUMB = [
  { label: 'Home', href: '/' },
  { label: 'Listen', href: '/listen', current: true }
];

export default function ListenerPage() {
  const [dial, setDial] = useState(98.4);
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [discovered, setDiscovered] = useState(() => new Set());
  const audioRef = useRef(null);
  const dialRef = useRef(null);
  const draggingRef = useRef(false);
  const targetRef = useRef(98.4);
  const velocityRef = useRef(0);

  const nearest = useMemo(() => {
    let best = null;
    let bestStrength = 0;
    TRACKS.forEach((track) => {
      const distance = Math.abs(dial - track.frequency);
      const strength = clamp(1 - distance / track.band, 0, 1);
      if (strength > bestStrength) {
        bestStrength = strength;
        best = track;
      }
    });
    return { track: best, strength: bestStrength };
  }, [dial]);

  const canLock = nearest.track && nearest.strength >= 0.85;
  const signalTone = canLock ? 'Signal Locked' : 'Static';

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!currentTrack?.src) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const lockSignal = () => {
    if (!canLock || !nearest.track) return;
    setCurrentTrack(nearest.track);
    setIsPlaying(true);
    setDiscovered((prev) => new Set([...prev, nearest.track.id]));
    setTimeout(() => audioRef.current?.play(), 120);
  };

  const setDialFromEvent = (event) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    angle = clamp(angle, MIN_ANGLE, MAX_ANGLE);
    const next = angleToFreq(angle);
    targetRef.current = Number(next.toFixed(1));
  };

  useEffect(() => {
    const onMove = (event) => {
      if (!draggingRef.current) return;
      setDialFromEvent(event);
    };
    const onUp = () => {
      if (draggingRef.current) {
        velocityRef.current *= 0.85;
      }
      draggingRef.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const current = dial;
      const target = targetRef.current;
      const delta = target - current;
      const pressure = 0.08;
      const drag = 0.84;
      const accel = delta * pressure;
      let velocity = velocityRef.current + accel;

      if (current <= MIN_FREQ + 0.4 || current >= MAX_FREQ - 0.4) {
        velocity *= 0.6;
      }

      velocity *= drag;
      const next = clamp(current + velocity, MIN_FREQ, MAX_FREQ);
      velocityRef.current = velocity;

      if (Math.abs(next - current) > 0.001) {
        setDial(Number(next.toFixed(2)));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dial]);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 relative overflow-hidden font-serif">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${cdn('/noise.svg')})` }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-900/10 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-2">
          <PrimaryNav className="mb-1" />
          <BreadcrumbTrail trail={LISTEN_BREADCRUMB} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            THE HYDRO-PHONE
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-cyan-600/80">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Frequency: {dial.toFixed(1)} Hz
          </div>
        </header>

        <div className="bg-[#11100f] border border-stone-800 rounded-2xl p-8 md:p-12 shadow-2xl mb-16 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${cdn('/noise.svg')})`,
              opacity: 0.22 - nearest.strength * 0.18
            }}
          />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-[0.3em] text-stone-500">Tuning Dial</div>
              <div className="relative flex items-center gap-6">
                <div
                  ref={dialRef}
                  onPointerDown={(event) => {
                    draggingRef.current = true;
                    setDialFromEvent(event);
                  }}
                  className="relative w-40 h-40 rounded-full border border-stone-700 bg-[#0b0a09] shadow-inner cursor-pointer select-none"
                >
                  <div className="absolute inset-4 rounded-full border border-stone-800/70 bg-gradient-to-br from-[#11100f] to-[#050403]" />
                  <div className="absolute inset-0 rounded-full border border-cyan-900/40" />
                  <div
                    className="absolute left-1/2 top-1/2 w-16 h-1 bg-cyan-500/70 origin-left rounded-full"
                    style={{ transform: `translate(-50%, -50%) rotate(${freqToAngle(dial)}deg)` }}
                  />
                  <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-cyan-300 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                  <div className="absolute left-4 top-6 text-[9px] uppercase tracking-[0.25em] text-stone-600">90</div>
                  <div className="absolute right-4 top-6 text-[9px] uppercase tracking-[0.25em] text-stone-600">110</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Band</div>
                  <div className="text-2xl text-cyan-300 font-mono">{dial.toFixed(1)} Hz</div>
                  <input
                    type="range"
                    min={MIN_FREQ}
                    max={MAX_FREQ}
                    step="0.1"
                    value={dial}
                    onChange={(e) => {
                      targetRef.current = Number(e.target.value);
                    }}
                    className="w-32 accent-cyan-500 opacity-20"
                    aria-label="Frequency"
                  />
                </div>
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-stone-500">Carrier</div>
              <div className={`text-sm font-mono ${canLock ? 'text-cyan-300' : 'text-stone-500'}`}>
                {signalTone}
              </div>
              <div className="h-1 w-full bg-stone-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all"
                  style={{ width: `${Math.round(nearest.strength * 100)}%` }}
                />
              </div>
              <button
                onClick={lockSignal}
                disabled={!canLock}
                className="mt-4 px-6 py-2 border border-cyan-700/50 text-cyan-300 text-xs uppercase tracking-widest rounded hover:bg-cyan-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Lock Signal
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.3em] text-stone-500">Emergent Voice</div>
              <div className="text-xl text-stone-200 font-serif italic min-h-[72px]">
                {nearest.strength >= 0.55 && nearest.track ? `"${nearest.track.hint}"` : 'Static...'}
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">
                Source: {nearest.track ? nearest.track.title : 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-8 md:p-10 shadow-xl mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif text-white mb-1">Current Signal</h2>
              <p className="text-stone-500 text-xs uppercase tracking-widest">{currentTrack.type}</p>
            </div>
            <span className="text-xs font-mono text-stone-500">{currentTrack.duration}</span>
          </div>

          <audio ref={audioRef} src={currentTrack.src} onEnded={() => setIsPlaying(false)} />

          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="px-8 py-3 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-700 text-cyan-300 uppercase text-xs font-bold tracking-widest rounded"
            >
              {isPlaying ? 'Stop Signal' : 'Broadcast'}
            </button>
            <div className="h-px flex-1 bg-stone-800" />
            <span className="font-mono text-stone-500 text-xs">{dial.toFixed(1)} Hz</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <h3 className="text-stone-500 text-xs uppercase tracking-[0.2em] mb-6 border-b border-stone-800 pb-2">
            Recovered Frequencies
          </h3>
          <ul className="space-y-4">
            {TRACKS.map((track, index) => {
              const isDiscovered = discovered.has(track.id);
              return (
                <li
                  key={track.id}
                  className="flex items-center justify-between p-4 rounded border border-stone-800 bg-transparent"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold font-mono bg-stone-900 text-stone-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-serif text-stone-300">{track.title}</div>
                      <div className="text-[10px] text-stone-500 uppercase tracking-wide">{track.type}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-stone-600">
                    {isDiscovered ? `${track.frequency.toFixed(1)} Hz` : '???.? Hz'}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-20 text-center space-x-6">
          <a href="#" className="text-stone-500 hover:text-cyan-400 text-xs uppercase tracking-widest transition-colors">Spotify</a>
          <a href="#" className="text-stone-500 hover:text-cyan-400 text-xs uppercase tracking-widest transition-colors">Apple Podcasts</a>
          <a href="#" className="text-stone-500 hover:text-cyan-400 text-xs uppercase tracking-widest transition-colors">Audible</a>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-stone-700 hover:text-stone-400 text-[10px] uppercase tracking-[0.3em] transition-colors">
            &larr; Return to Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
