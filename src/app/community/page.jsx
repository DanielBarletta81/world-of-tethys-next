'use client';

import React from 'react';
import WayFinderNav from '@/components/WayFinderNav';
import BookBanner from '@/components/BookBanner';
import SideAuthPanel from '@/components/SideAuthPanel';
import FirebaseLogin from '@/components/FirebaseLogin';
import TheBlankSlate from '@/components/TheBlankSlate';
import Footer from '@/components/Footer';

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif selection:bg-amber-900 selection:text-white relative overflow-x-hidden">
      <WayFinderNav />
      <SideAuthPanel />
      <div className="pt-20 space-y-10">
        <BookBanner />

        <section className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono">Join the World</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-orange-500 to-red-800">
              Community Slate
            </h1>
            <p className="text-sm text-stone-400 mt-2">Sign in, etch your mark, and sync with the living archive.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="bg-[#12100e] border border-[#2c241f] rounded-xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
              <FirebaseLogin />
            </div>
            <TheBlankSlate />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
