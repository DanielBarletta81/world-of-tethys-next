'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Import your components
import LandingSequence from '@/components/LandingSequence';
import MagmaCarousel from '@/components/MagmaCarousel';
import CharacterCarousel from '@/components/CharacterCarousel';
import { catalogItems } from '../data/catalog';
import PathSelector from '@/components/PathSelector';
import FieldKit from '@/components/FieldKit';

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);
  const [entryLog, setEntryLog] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('tethys_entries');
      if (stored) setEntryLog(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const recordEntry = (key) => {
    setEntryLog((prev) => {
      const next = { ...prev, [key]: (prev?.[key] || 0) + 1 };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('tethys_entries', JSON.stringify(next));
      }
      return next;
    });
  };

  const bookPaths = useMemo(
    () => (catalogItems || []).filter((item) => item.type === 'book').slice(0, 3),
    []
  );
  const lastEntry = useMemo(() => {
    const entries = Object.entries(entryLog || {});
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [entryLog]);

  return (
    <div className="min-h-screen pb-32">
      
      {/* 1. THE INTRO SEQUENCE */}
      {/* Only show the rest of the page once this finishes */}
      <AnimatePresence mode="wait">
        {!introFinished && (
          <LandingSequence onComplete={() => setIntroFinished(true)} />
        )}
      </AnimatePresence>

      {/* 2. MAIN CONTENT (Reveals after intro) */}
      {introFinished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* A. HERO SECTION */}
          <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <h1 className="text-7xl md:text-9xl font-header tracking-widest mb-6 text-forge-intense animate-forge-pulse">
                IRONWOOD
              </h1>
              <p className="max-w-xl mx-auto text-stone-400 text-lg md:text-xl italic mb-10">
                "The sky is choked with soot, but the heat beneath our feet... that is where the life is."
              </p>
              
              <Link 
                href="/map" 
                className="px-8 py-3 border border-forge-orange/50 text-forge-orange hover:bg-forge-orange/10 hover:border-forge-orange uppercase tracking-[0.2em] text-xs transition-all"
              >
                Open The Atlas
              </Link>
            </motion.div>
          </section>

          {/* Entry Points via Books */}
          <section className="relative py-16 border-t border-stone-800 bg-[#0e0c0b]">
            <div className="max-w-6xl mx-auto px-6 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono">Choose Your Gate</p>
                  <h2 className="text-3xl font-header text-stone-100">Enter Through the Text</h2>
                  <p className="text-stone-400 text-sm">
                    Different books, different entry vectors. Your path will shape the staff the Registry forges.
                  </p>
                  {lastEntry && (
                    <p className="text-xs text-amber-400 mt-2">Recent path: {lastEntry}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bookPaths.map((book) => (
                  <a
                    key={book.id}
                    href={book.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => recordEntry(book.title || book.id)}
                    className="group relative rounded-2xl overflow-hidden border border-amber-700/40 bg-[#1a120e] shadow-[0_0_30px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(255,120,60,0.08)] transition-transform hover:-translate-y-1"
                  >
                    <div
                      className="h-48 w-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundImage: `url(${book.cover})` }}
                    />
                    <div className="p-4 space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">{book.format}</p>
                      <h3 className="text-lg font-header text-stone-100 leading-tight">{book.title}</h3>
                      {book.subtitle && <p className="text-xs text-stone-400">{book.subtitle}</p>}
                      {book.price && <span className="inline-block text-[11px] font-mono text-amber-300">{book.price}</span>}
                    </div>
                    <div className="absolute inset-0 pointer-events-none border border-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* B. THE BESTIARY (Magma Carousel) */}
          <section className="relative py-24 border-t border-stone-800 bg-[#141210]">
             <div className="max-w-7xl mx-auto px-6 mb-12">
               <h2 className="text-3xl font-header text-stone-100">Native Fauna</h2>
               <div className="w-24 h-1 bg-gradient-to-r from-forge-orange to-transparent mt-2"></div>
             </div>
             {/* The Carousel Component */}
             <MagmaCarousel />
          </section>

          {/* PATH SELECTOR */}
          <PathSelector onPathChange={(p) => recordEntry(`path:${p}`)} />

          {/* WORKBENCH / RESIN ECONOMY */}
          <FieldKit />

          {/* C. THE CAMBRIAN NINE (Character Carousel) */}
          <section className="relative py-24 border-t border-stone-800 bg-[#0c0a09]">
             <div className="max-w-7xl mx-auto px-6 mb-8 text-right">
               <h2 className="text-3xl font-header text-stone-100">
                 The Cambrian Nine
               </h2>
               <p className="text-stone-500 font-mono text-xs uppercase tracking-widest mt-2">
                 Choose a bond to inherit their traits
               </p>
             </div>
             {/* The Character Component */}
             <CharacterCarousel />
          </section>

        </motion.div>
      )}
    </div>
  );
}
