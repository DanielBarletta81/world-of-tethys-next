'use client';
import WayFinderNav from '@/components/WayFinderNav';
import BookManifest from '@/components/BookManifest';
import BondForge from '@/components/BondForge';
import CharacterCarousel from '@/components/CharacterCarousel';
import { getCleanCharacters } from '@/lib/tethysData'; // Assuming you have data fetching
import { useState, useEffect } from 'react';

export default function StudyPage() {
  // Optional: Fetch real characters if connected to WP, else use defaults inside carousel
  const [chars, setChars] = useState([]);

  return (
    <main className="min-h-screen bg-[#1c1917] text-amber-50 font-serif pt-20 pb-12 px-6 bg-stone-grain">
      
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-amber-600 uppercase tracking-tighter mb-4">
          The Chronicle
        </h1>
        <p className="text-stone-400 text-sm max-w-xl mx-auto font-sans">
          For the readers. Dive into the narrative, forge emotional bonds, and access the library.
        </p>
      </header>

      <WayFinderNav />

      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* 1. The Bookshelf */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl text-amber-100 font-header">The Ash Age Trilogy</h2>
            <p className="text-lg text-stone-400 leading-relaxed">
              When Igzier refuses to play along with a poisoned verdict, the city gives him a choice: execution or exile. He chooses the fall.
            </p>
            <div className="flex gap-4">
               {/* Primary CTA */}
               <Link href="https://amazon.com/..." className="px-8 py-3 bg-amber-700 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-amber-600 transition">
                 Read Book I
               </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <BookManifest /> {/* This serves as the featured item */}
          </div>
        </section>

        {/* 2. Character Bonds (Narrative Gameplay) */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-stone-700 flex-1"></div>
            <h2 className="text-2xl text-amber-500 uppercase tracking-widest font-bold">The Cast & Bonds</h2>
            <div className="h-px bg-stone-700 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <CharacterCarousel characters={chars} />
            </div>
            <div className="lg:col-span-1 pt-12">
               <BondForge />
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}