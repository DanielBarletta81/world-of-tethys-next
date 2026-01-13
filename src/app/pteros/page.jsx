'use client';

import { useEffect, useState } from 'react';
import CaveWallTerminal from '@/components/CaveWallTerminal';
import TriFoldNav from '@/components/TriFoldNav';
import cdn from '@/lib/cdn';
import { fetchMediaManifest } from '@/lib/media-manifest';

export default function PterosTerminalPage() {
  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    const cdnBase = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
    if (!cdnBase) return;
    fetchMediaManifest(cdnBase)
      .then((items) => {
        if (mounted) setMediaItems(items);
      })
      .catch(() => {
        if (mounted) setMediaItems([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const fallbackItems = [
    {
      id: 'pteros_intro_v1',
      title: 'Pteros Overview: The Weep',
      type: 'video',
      src: 'https://www.youtube.com/embed/aAbtMoKsNw4?autoplay=1&rel=0&modestbranding=1',
      thumbnail: cdn('/img/bg/obsidian-coast-4k.jpg'),
      rewards: { lore: 5 }
    }
  ];

  const entries = mediaItems.length ? mediaItems : fallbackItems;

  return (
    <main className="min-h-screen bg-[#060605] text-stone-100 font-serif">
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
        <div className="relative z-10 px-6 pt-28 pb-16 max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">
                Pteros Station
              </p>
              <h1 className="text-4xl md:text-6xl font-black text-stone-100 tracking-tight">
                Echo Wall Terminal
              </h1>
            </div>
            <TriFoldNav />
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
            />
          ))}
        </div>

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
