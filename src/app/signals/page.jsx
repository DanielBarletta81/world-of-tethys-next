'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import PrimaryNav from '@/components/layout/navigation/PrimaryNav';
import TriFoldNav from '@/components/layout/navigation/TriFoldNav';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import { PTEROS_SIGNAL_WINDOW } from '@/data/pteros-signal-window';
import { SCIENCE_DISCOVERIES } from '@/data/science-discoveries';
import {
  selectLoreSeeds,
  selectAudioClips,
  getDefaultLoreContext
} from '@/lib/lore-seed-runtime';

export default function SignalsPage() {
  const [activeTag, setActiveTag] = useState('all');
  const [signals, setSignals] = useState(PTEROS_SIGNAL_WINDOW);
  const [discoveries, setDiscoveries] = useState(SCIENCE_DISCOVERIES);
  const introAudioUrl = 'https://world-of-tethys-site.s3.us-east-1.amazonaws.com/audio/World-Audio-Trailer.MP3';
  const [audioStatus, setAudioStatus] = useState('idle'); // idle | playing | blocked
  const introAudioRef = useRef(null);
  const loreContext = useMemo(() => getDefaultLoreContext(), []);
  const travelAudio = useMemo(() => {
    const clips = selectAudioClips({ context: loreContext, limit: 12 });
    if (clips.length) return clips;
    return selectAudioClips({ context: {}, limit: 12 });
  }, [loreContext]);
  const skyCityCirculation = useMemo(
    () =>
      selectLoreSeeds({
        regionId: 'sky-city',
        ui: 'signals',
        context: loreContext,
        limit: 6
      }),
    [loreContext]
  );
  const triVersion = {
    title: 'Triumvirate Notice // Public Circulation',
    body: [
      'Suspicious heart failure reported in Melden. Judicial exile authorized for technician Igzier.',
      'Incident classified as biological liability event. Containment protocols enacted.',
      'Public advisory: unlicensed fungal remedies remain prohibited.'
    ]
  };
  const listeningNotes = [
    'Bioluminescent caves pulse brighter and lower. Remain still to keep the glow silent.',
    'Audio stories and travel clips will be archived here as route memory.'
  ];
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Signals', href: '/signals', current: true }
  ];

  useEffect(() => {
    let mounted = true;
    fetch('/api/pteros/signals')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data?.items?.length) setSignals(data.items);
      })
      .catch(() => null);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let audio;
    let fadeTimer;
    let active = true;
    const fadeIn = () => {
      if (!audio) return;
      const targetVolume = 0.65;
      const step = 0.02;
      fadeTimer = setInterval(() => {
        if (!active || !audio) return;
        audio.volume = Math.min(targetVolume, audio.volume + step);
        if (audio.volume >= targetVolume) {
          clearInterval(fadeTimer);
        }
      }, 120);
    };
    const startAudio = async () => {
      try {
        audio = new Audio(introAudioUrl);
        audio.volume = 0;
        audio.preload = 'auto';
        await audio.play();
        setAudioStatus('playing');
        fadeIn();
      } catch {
        // Autoplay blocked or unsupported
        setAudioStatus('blocked');
      }
    };
    startAudio();
    return () => {
      active = false;
      if (fadeTimer) clearInterval(fadeTimer);
      if (audio) {
        audio.pause();
        audio.src = '';
        audio = null;
      }
    };
  }, [introAudioUrl]);

  useEffect(() => {
    if (audioStatus !== 'blocked') return;
    introAudioRef.current = new Audio(introAudioUrl);
    introAudioRef.current.volume = 0.6;
    introAudioRef.current.preload = 'auto';
    return () => {
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current.src = '';
        introAudioRef.current = null;
      }
    };
  }, [audioStatus, introAudioUrl]);

  const handleAudioManualStart = async () => {
    if (!introAudioRef.current) return;
    try {
      await introAudioRef.current.play();
      setAudioStatus('playing');
    } catch {
      // still blocked
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch('/api/science/discoveries')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data?.items?.length) setDiscoveries(data.items);
      })
      .catch(() => null);
    return () => {
      mounted = false;
    };
  }, []);

  const SIGNAL_FEEDS = signals.map((item) => ({
    ...item,
    watchUrl: `https://www.youtube.com/watch?v=${item.youtubeId}`,
    thumbnailUrl: `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
  }));

  const tags = Array.from(
    new Set(SIGNAL_FEEDS.flatMap((signal) => signal.tags || []))
  );
  const filteredSignals =
    activeTag === 'all'
      ? SIGNAL_FEEDS
      : SIGNAL_FEEDS.filter((signal) => signal.tags?.includes(activeTag));

  return (
    <main className="min-h-screen bg-[#060605] text-stone-100 font-serif">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="relative z-10 px-6 pt-28 pb-16 max-w-6xl mx-auto space-y-6">
          <PrimaryNav className="mb-1" />
          <BreadcrumbTrail trail={trail} className="mb-2" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">
                Signal Archive
              </p>
              <h1 className="text-4xl md:text-6xl font-black text-stone-100 tracking-tight">
                Open Broadcasts
              </h1>
            </div>
            <TriFoldNav />
          </div>
          <p className="text-stone-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Public echoes, not the archive. These signals are meant to be found.
          </p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 pb-24 space-y-10">
        <div className="border border-emerald-900/40 bg-black/70 rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.45)] listening-room">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 font-mono">
                Listening Room
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-stone-100">
                Biolume Cavern Relay
              </h2>
              <p className="text-sm text-stone-400 mt-3 max-w-2xl">
                {listeningNotes[0]}
              </p>
              <p className="text-xs text-stone-500 mt-2 max-w-2xl">
                {listeningNotes[1]}
              </p>
            </div>
            <span className="rounded-full border border-emerald-500/40 text-emerald-200 text-[10px] uppercase tracking-[0.3em] px-4 py-2">
              Low Light Channel
            </span>
          </div>
          {audioStatus === 'blocked' && (
            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-emerald-500/40 bg-black/60 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-emerald-200">
              <span>Audio Ready</span>
              <button
                type="button"
                onClick={handleAudioManualStart}
                className="px-3 py-1 border border-emerald-600/50 rounded-full hover:border-emerald-300 hover:text-white transition-colors"
              >
                Tap to Play
              </button>
            </div>
          )}
        </div>

        <div className="border border-stone-800/80 bg-black/60 rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300 font-mono">
                Travel Audio
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-stone-100">
                Route Memory Clips
              </h2>
              <p className="text-sm text-stone-400 mt-3 max-w-2xl">
                Drop in clips as you record them. These slots are ready for map travel audio.
              </p>
            </div>
            <span className="rounded-full border border-cyan-500/40 text-cyan-200 text-[10px] uppercase tracking-[0.3em] px-4 py-2">
              Empty Slots
            </span>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelAudio.map((clip) => (
              <div
                key={clip.id}
                className="border border-stone-800 rounded-xl p-4 bg-black/50"
              >
                <p className="text-sm text-stone-100">{clip.title}</p>
                {clip.file ? (
                  <p className="text-[10px] text-stone-600 mt-2 font-mono">
                    {clip.file}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2 text-[9px] uppercase tracking-[0.2em] text-stone-500">
                  {(clip.tags || []).map((tag) => (
                    <span key={`${clip.id}-${tag}`} className="px-2 py-1 border border-stone-800 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-stone-600">
                  Audio pending
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-stone-800/80 bg-black/60 rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-mono">
                Sky City Circulation
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-stone-100">
                {triVersion.title}
              </h2>
            </div>
            <span className="rounded-full border border-amber-500/40 text-amber-200 text-[10px] uppercase tracking-[0.3em] px-4 py-2">
              Public Bulletin
            </span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-stone-400 leading-relaxed">
            {skyCityCirculation.length
              ? skyCityCirculation.map((seed) => (
                  <p key={seed.id}>{seed.text}</p>
                ))
              : triVersion.body.map((line, index) => (
                  <p key={`tri-${index}`}>{line}</p>
                ))}
          </div>
        </div>

        <div className="border border-stone-800/80 bg-black/60 rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 font-mono">
                Real Science Signal
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-stone-100">
                Recent Discovery
              </h2>
            </div>
            <span className="rounded-full border border-emerald-500/40 text-emerald-200 text-[10px] uppercase tracking-[0.3em] px-4 py-2">
              Open Source
            </span>
          </div>
          <div className="mt-6 space-y-6">
            {discoveries.map((item) => (
              <article key={item.id} className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-stone-500">
                  {item.publishedOn ? <span>{item.publishedOn}</span> : null}
                  {item.sourceTitle ? (
                    <span className="text-emerald-300">{item.sourceTitle}</span>
                  ) : null}
                </div>
                <h3 className="text-xl md:text-2xl text-stone-100">{item.title}</h3>
                <p className="text-sm md:text-base text-stone-400 leading-relaxed">
                  {item.summary}
                </p>
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 px-4 py-2 uppercase tracking-[0.25em] text-[10px] text-emerald-200 hover:text-white hover:border-emerald-300 transition-colors"
                  >
                    View Source
                  </a>
                ) : null}
                {item.tethysAnalogs?.length ? (
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 font-mono mb-2">
                      Tethys Analogs
                    </p>
                    <ul className="space-y-2 text-sm text-stone-400">
                      {item.tethysAnalogs.map((analog, index) => (
                        <li key={`${item.id}-analog-${index}`}>{analog}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center text-[10px] uppercase tracking-[0.25em] text-stone-500">
          <span className="text-stone-600">Filter</span>
          <button
            type="button"
            onClick={() => setActiveTag('all')}
            className={`rounded-full border px-4 py-2 transition-colors ${
              activeTag === 'all'
                ? 'border-amber-400/60 text-amber-200'
                : 'border-stone-800 text-stone-400 hover:text-amber-200 hover:border-amber-400/60'
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`rounded-full border px-4 py-2 transition-colors ${
                activeTag === tag
                  ? 'border-amber-400/60 text-amber-200'
                  : 'border-stone-800 text-stone-400 hover:text-amber-200 hover:border-amber-400/60'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSignals.map((signal) => (
            <article
              key={signal.id}
              className="group border border-stone-800 bg-black/50 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.35)]"
            >
              <div className="relative aspect-video bg-black">
                <Image
                  src={signal.thumbnailUrl}
                  alt={signal.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
              </div>
              <div className="p-5 space-y-3">
                <div className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-mono">
                  Pteros Relay
                </div>
                <h2 className="text-xl font-display text-stone-100">{signal.title}</h2>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {signal.description}
                </p>
                {signal.tags?.length ? (
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                    {signal.tags.map((tag) => (
                      <span
                        key={`${signal.id}-${tag}`}
                        className="rounded-full border border-stone-800 px-3 py-1 bg-black/40 text-stone-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <a
                  href={signal.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-700 px-4 py-2 uppercase tracking-[0.25em] text-[10px] text-stone-300 hover:text-amber-200 hover:border-amber-400/60 transition-colors"
                >
                  Watch on YouTube
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <style jsx>{`
        .listening-room {
          position: relative;
          overflow: hidden;
        }
        .listening-room::before {
          content: '';
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle at 30% 30%, rgba(16,185,129,0.25), transparent 55%),
            radial-gradient(circle at 70% 60%, rgba(34,211,238,0.18), transparent 60%),
            radial-gradient(circle at 50% 80%, rgba(56,189,248,0.12), transparent 60%);
          animation: cavePulse 6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes cavePulse {
          0% {
            opacity: 0.35;
            transform: translateY(6px) scale(0.98);
          }
          50% {
            opacity: 0.7;
            transform: translateY(-6px) scale(1.02);
          }
          100% {
            opacity: 0.35;
            transform: translateY(6px) scale(0.98);
          }
        }
      `}</style>
    </main>
  );
}
