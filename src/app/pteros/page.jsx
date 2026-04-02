'use client';

import { useEffect, useState } from 'react';
import CaveWallTerminal from '@/components/page-specific/science/CaveWallTerminal';
import TriFoldNav from '@/components/layout/navigation/TriFoldNav';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import cdn from '@/lib/cdn';
import { fetchMediaManifest } from '@/lib/media-manifest';
import { PTEROS_FALLBACK_MEDIA } from '@/data/pteros-media';
import { PTEROS_SIGNAL_WINDOW } from '@/data/pteros-signal-window';
import { useTethys } from '@/context/TethysContext';
import Script from 'next/script';

export default function PterosTerminalPage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [signalItems, setSignalItems] = useState(PTEROS_SIGNAL_WINDOW);
  const { applyPlayerAction } = useTethys();

  useEffect(() => {
    let mounted = true;
    const cdnBase =
      process.env.NEXT_PUBLIC_CDN_DIST ||
      process.env.NEXT_PUBLIC_CDN_BASE ||
      process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
    if (!cdnBase) return;
    fetchMediaManifest(cdnBase)
      .then((items) => {
        if (mounted) setMediaItems(items);
      })
      .catch(() => {
        if (mounted) setMediaItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        fetch('/api/pteros/media')
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.items?.length) setMediaItems(data.items);
          })
          .catch(() => null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch('/api/pteros/signals')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data?.items?.length) setSignalItems(data.items);
      })
      .catch(() => null);
    return () => {
      mounted = false;
    };
  }, []);

  const entries = mediaItems.length ? mediaItems : PTEROS_FALLBACK_MEDIA;

  const handleWatchProgress = (item) => (msWatched, threshold) => {
    const reward = Math.max(1, Math.round(threshold / 10));
    applyPlayerAction({
      id: `terminal_watch_${item.id}_${threshold}`,
      type: 'curiosity',
      intensity: 0.35,
      xp: reward,
      restorative: true,
      repeatPenalty: false,
      envPressure: 0.05
    });
  };

  const signalWindow = signalItems.map((item) => ({
    ...item,
    embedSrc: `https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`,
    watchUrl: `https://www.youtube.com/watch?v=${item.youtubeId}`,
    thumbnailUrl: `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
  }));

  const signalSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: signalWindow.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'VideoObject',
        name: item.title,
        description: item.description,
        thumbnailUrl: item.thumbnailUrl,
        uploadDate: item.uploadDate || '2024-01-01',
        keywords: Array.isArray(item.tags) ? item.tags.join(', ') : undefined,
        contentUrl: item.watchUrl,
        embedUrl: item.embedSrc
      }
    }))
  };

  const PTEROS_BREADCRUMB = [
    { label: 'Home', href: '/' },
    { label: 'Pteros', href: '/pteros', current: true }
  ];

  return (
    <main className="min-h-screen bg-[#060605] text-stone-100 font-serif">
      <Script id="pteros-signal-schema" type="application/ld+json">
        {JSON.stringify(signalSchema)}
      </Script>
      <div className="sticky top-0 z-40 border-b border-stone-900/80 bg-[#060605]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          
          <TriFoldNav className="ml-auto w-60" sticky={false} />
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url(${cdn('/img/locations/pteros_island_hero.png')})` }}
        />
        <div
          className="absolute inset-0 opacity-25 mix-blend-screen"
          style={{ backgroundImage: `url(${cdn('/img/watcher-ashfall.svg')})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060605] via-transparent to-[#060605]" />
        <div className="relative z-10 px-6 pt-32 pb-16 max-w-6xl mx-auto space-y-6">
          <BreadcrumbTrail trail={PTEROS_BREADCRUMB} className="mb-2" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">
              Pteros Station
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-stone-100 tracking-tight">
              Echo Wall Terminal
            </h1>
          </div>
          <p className="text-stone-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Bioluminescent projections are archived here. Nothing is promised,
            but attention is often rewarded.
          </p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 pb-24 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {entries.map((item) => (
            <CaveWallTerminal
              key={item.id}
              mediaId={item.id}
              title={item.title}
              type={item.type}
              src={item.src}
              previewSrc={item.preview}
              thumbnail={item.thumbnail}
              rewards={item.rewards}
              onWatchProgress={handleWatchProgress(item)}
            />
          ))}
        </div>

        <section className="border border-stone-800 bg-black/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">
                Signal Window
              </p>
              <h2 className="text-2xl font-display text-stone-100">Open Broadcast</h2>
            </div>
            <p className="text-xs text-stone-500 max-w-md">
              Echoes carried in open channels. These streams do not alter your record.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {signalWindow.map((item) => (
              <div
                key={item.id}
                className="relative w-full aspect-video border border-stone-800 rounded-md overflow-hidden bg-black shadow-[0_0_60px_rgba(0,0,0,0.45)]"
              >
                <iframe
                  src={item.embedSrc}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={item.title}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
            {signalWindow.flatMap((item) =>
              (item.tags || []).map((tag) => (
                <span
                  key={`${item.id}-${tag}`}
                  className="rounded-full border border-stone-800 px-3 py-1 bg-black/40 text-stone-400"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-stone-400">
            {signalWindow.map((item) => (
              <a
                key={`${item.id}-watch`}
                href={item.watchUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-stone-700 px-4 py-2 uppercase tracking-[0.25em] text-[10px] text-stone-300 hover:text-amber-200 hover:border-amber-400/60 transition-colors"
              >
                Watch on YouTube
              </a>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-stone-800 bg-black/40 rounded-lg p-5">
            <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400 mb-3">
              Serious Study
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Longform research logs, excavation reports, and analysis modules
              for the Field Station.
            </p>
          </div>
          <div className="border border-stone-800 bg-black/40 rounded-lg p-5">
            <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400 mb-3">
              Casual Learning
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Short projections and quick field notes to anchor the lore without
              the full archive dive.
            </p>
          </div>
          <div className="border border-stone-800 bg-black/40 rounded-lg p-5">
            <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400 mb-3">
              Kith for Kiddos
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Gentle primers for younger explorers. No spoilers, no pressure,
              just wonder.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
