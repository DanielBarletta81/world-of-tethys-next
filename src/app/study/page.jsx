'use client';

import TriFoldNav from '@/components/TriFoldNav';
import ContrabandItem from '@/components/ContrabandItem';
import { ARCHIVE_CRATE } from '@/lib/library';
import { cdn } from '@/lib/cdn';
import { PackageOpen } from 'lucide-react';

export default function StudyPage() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-stone-200 font-serif relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://world-of-tethys-site.s3.us-east-1.amazonaws.com/img/bg/sector-4-hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09] via-[#120d09]/90 to-[#0c0a09]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <TriFoldNav />

      <div className="relative z-10 pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-stone-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3 text-amber-500/80 mb-3">
              <PackageOpen size={20} />
              <span className="text-[10px] uppercase tracking-[0.4em] font-mono">
                Cambria Dead Drop
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-stone-100 uppercase tracking-tight">
              The Smuggler&apos;s Drop
            </h1>
            <p className="mt-4 text-sm text-stone-400 max-w-xl italic">
              Buried under ash and cedar. These volumes move hand to hand, never openly.
            </p>
          </div>
          <div className="text-right text-xs uppercase tracking-[0.35em] text-stone-500 font-mono">
            Manifest: CRB-09
          </div>
        </header>

        <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARCHIVE_CRATE.map((item) => (
            <ContrabandItem key={item.id} item={item} />
          ))}
        </section>

        <div className="mt-16 border-t border-stone-800/70 pt-6 text-center text-[10px] uppercase tracking-[0.3em] text-stone-500 font-mono">
          Unsealed texts are logged as salvage, not confession.
        </div>
      </div>
    </main>
  );
}
