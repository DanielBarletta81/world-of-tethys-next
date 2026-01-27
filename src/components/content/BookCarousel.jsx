'use client';

import React from 'react';
import Link from 'next/link';
import { cdn } from '@/lib/cdn';

const BOOKS = [
  {
    id: 1,
    title: 'Sky City of Tethys',
    coverUrl: cdn('/img/books/book1-cover.png'),
    amazonLink: 'https://www.amazon.com/dp/B0G572X42L'
  },
  {
    id: 2,
    title: 'Unraveling Ravel',
    coverUrl: cdn('/img/books/ravel-kindle.png'),
    amazonLink: 'https://www.amazon.com/dp/B0GB5CR6HX'
  },
  {
    id: 3,
    title: 'What the Roots Remember',
    coverUrl: cdn('/img/books/roots-remember.png'),
    amazonLink: 'https://www.amazon.com/dp/B0G672S7YC'
  }
];

export default function BookCarousel({ compact = false, className = '' }) {
  const strip = [...BOOKS, ...BOOKS]; // Duplicate for seamless loop
  const spacing = compact ? 'py-2' : 'py-5';
  const margin = compact ? 'mb-0' : 'mb-6';
  const coverSize = compact ? 'w-16 h-24' : 'w-28 h-40';
  const titleSize = compact ? 'text-xs' : 'text-base';
  const gap = compact ? 'gap-4' : 'gap-6';

  return (
    <div className={`relative w-full max-w-none mx-auto overflow-hidden ${spacing} ${margin} border border-amber-900/20 bg-[#0c0a09]/70 backdrop-blur-md rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.45)] ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.03),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.03),transparent_35%)] pointer-events-none" />
      
      <div className={`relative flex items-center ${gap} pl-6 marquee`}>
        {strip.map((book, idx) => (
          <Link
            key={`${book.id}-${idx}`}
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 pr-8 opacity-80 hover:opacity-100 transition-opacity duration-700"
          >
            <div className={`relative ${coverSize} flex-shrink-0 rounded-sm border border-amber-900/40 bg-[#1c1917] shadow-[0_12px_24px_rgba(0,0,0,0.45)] group-hover:shadow-[0_0_35px_rgba(255,140,0,0.45)] transition-all duration-500`}>
              <div className="absolute -inset-3 opacity-40 blur-xl bg-[radial-gradient(circle,rgba(255,136,0,0.35),transparent_60%)] group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
              <div className="relative h-full w-full rounded-sm overflow-hidden p-1 bg-gradient-to-b from-amber-500/20 via-transparent to-black/40">
                <div className="absolute inset-0 border border-amber-500/20 rounded-sm pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={book.coverUrl} alt={book.title} className="relative z-10 w-full h-full object-cover rounded-[2px] shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:-translate-y-1 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500/70 font-mono">Amazon</span>
              <span className={`${titleSize} text-stone-200/80 font-serif whitespace-nowrap group-hover:text-amber-200 transition-colors`}>{book.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          animation: scroll 70s linear infinite;
          width: max-content;
        }
        .marquee:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
// World of Tethys || D.C. Barletta
