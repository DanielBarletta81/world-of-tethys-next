'use client';

import { useState } from 'react';
import PrimaryNav from '@/components/layout/navigation/PrimaryNav';
import TriFoldNav from '@/components/layout/navigation/TriFoldNav';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import { PTEROS_SIGNAL_WINDOW } from '@/data/pteros-signal-window';

const SIGNAL_FEEDS = PTEROS_SIGNAL_WINDOW.map((item) => ({
  ...item,
  watchUrl: `https://www.youtube.com/watch?v=${item.youtubeId}`,
  thumbnailUrl: `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
}));

export default function SignalsPage() {
  const [activeTag, setActiveTag] = useState('all');
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Signals', href: '/signals', current: true }
  ];

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
                <img
                  src={signal.thumbnailUrl}
                  alt={signal.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
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
    </main>
  );
}
