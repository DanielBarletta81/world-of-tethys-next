'use client';

import React from 'react';
import InkDropOverlay from '@/components/InkDropOverlay';
import HomeContent from '@/components/HomeContent';
import BookBanner from '@/components/BookBanner';
import WayFinderNav from '@/components/WayFinderNav';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif selection:bg-amber-900 selection:text-white relative overflow-x-hidden">
      <InkDropOverlay/>
      <WayFinderNav />
      <div className="pt-20">
        <BookBanner />
        <HomeContent creatures={[]} characters={[]} />
      </div>
      <Footer />
    </main>
  );
}
