'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import BookBanner from '@/components/BookBanner';
import TriFoldNav from '@/components/TriFoldNav';
import Footer from '@/components/Footer';
import FieldNotebook from '@/components/FieldNotebook';
import { BESTIARY } from '@/data/bestiary';
import { cdn } from '@/lib/cdn';

export default function CreaturesPage() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif selection:bg-amber-900 selection:text-white relative overflow-x-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-30 z-0"
        style={{ backgroundImage: `url(${cdn('/img/bg/parchment-map-table.png')})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0c0a09] via-transparent to-[#0c0a09] z-0" />

      <TriFoldNav />

      <div className="relative z-10 pt-24 pb-12 px-4 md:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-600 font-mono">Archive Access</p>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#e3dcd2] to-[#8c735a] uppercase tracking-tighter">
            The Bestiary
          </h1>
          <p className="text-stone-400 text-sm font-serif italic">
            "We classify them to understand them. We draw them to remember what killed us."
            <br />
            <span className="text-[10px] not-italic font-mono text-stone-600">— Field Notes of Melden</span>
          </p>
        </div>

        <FieldNotebook bestiary={BESTIARY} />

        <BookBanner />
      </div>
      <Footer />
    </main>
  );
}
// World of Tethys || D.C. Barletta
