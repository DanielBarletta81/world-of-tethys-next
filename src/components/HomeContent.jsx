'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LandingSequence from '@/components/LandingSequence';
import MagmaCarousel from '@/components/MagmaCarousel';
import CharacterCarousel from '@/components/CharacterCarousel';
import FirebaseLogin from '@/components/FirebaseLogin';



export default function HomeContent({ creatures, characters }) {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="pb-32">
      <AnimatePresence mode="wait">
        {!introFinished && (
          <LandingSequence onComplete={() => setIntroFinished(true)} />
        )}
      </AnimatePresence>

      {introFinished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5 }}
        >
          {/* Hero Section */}
          <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-7xl md:text-9xl font-header tracking-widest mb-6 text-forge-intense animate-forge-pulse">
                WORLD OF TETHYS
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/map" className="px-8 py-3 border border-forge-orange text-forge-orange uppercase">
                Open The Atlas
              </Link>
              <Link href="/community" className="px-8 py-3 border border-amber-700 text-amber-200 uppercase bg-amber-900/20 hover:bg-amber-900/30">
                Join the World
              </Link>
            </div>
          </section>

          {/* Identity / Auth */}
          <section className="relative max-w-4xl mx-auto px-6 -mt-20">
            <FirebaseLogin />
          </section>

          {/* Magma Carousel (With Real Data!) */}
          <section className="relative py-24 bg-[#141210]">
             <MagmaCarousel creatures={creatures} />
          </section>

          {/* Character Carousel (With Real Data!) */}
          <section className="relative py-24 bg-[#0c0a09]">
             <CharacterCarousel characters={characters} />
          </section>

        </motion.div>
      )}
    </div>
  );
}
