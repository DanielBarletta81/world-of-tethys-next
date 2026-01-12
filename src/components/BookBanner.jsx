'use client';

import React, { useMemo } from 'react';
import { cdn } from '@/lib/cdn';

const BOOKS = [
  {
    id: 1,
    title: 'Sky City of Tethys',
    coverUrl: cdn('/img/book1-cover.png'),
    amazonLink: 'https://www.amazon.com/dp/B0G572X42L'
  },
  {
    id: 2,
    title: 'Unraveling Ravel',
    coverUrl: cdn('/img/ravel-kindle.png'),
    amazonLink: 'https://www.amazon.com/dp/B0GB5CR6HX'
  },
  {
    id: 3,
    title: 'What the Roots Remember',
    coverUrl: cdn('/img/roots-remember.png'),
    amazonLink: 'https://www.amazon.com/dp/B0G672S7YC'
  }
];

const BookBanner = () => {
  const looped = useMemo(() => [...BOOKS, ...BOOKS], []);

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden py-3 px-4 mb-8 border border-amber-900/30 bg-[#0c0a09]/80 backdrop-blur-md rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.05),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.05),transparent_35%)] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0c0a09] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0c0a09] to-transparent pointer-events-none" />

      <div className="flex items-center gap-6 marquee" aria-label="Book carousel with Amazon links">
        {looped.map((book, idx) => (
          <a
            key={`${book.id}-${idx}`}
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 pr-6 hover:translate-y-[-2px] transition-transform duration-200"
          >
            <div className="relative w-18 h-28 flex-shrink-0 rounded-sm overflow-hidden border border-[#2a1b14] bg-[#1c1917] shadow-[0_10px_20px_rgba(0,0,0,0.35)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] group-hover:border-amber-500/70 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
              <div className="absolute inset-0 border border-amber-900/30 mix-blend-soft-light rounded-sm" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-mono">Amazon</span>
              <span className="text-sm text-stone-200 font-serif whitespace-nowrap group-hover:text-amber-200 transition-colors">
                {book.title}
              </span>
            </div>
          </a>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          animation: scroll 40s linear infinite;
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
};

export default BookBanner;
// World of Tethys || D.C. Barletta
