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

export default function BookCarousel() {
  const strip = [...BOOKS, ...BOOKS]; // Duplicate for seamless loop

  return (
    <div className="relative w-full max-w-none mx-auto overflow-hidden py-5 mb-6 border border-amber-900/20 bg-[#0c0a09]/70 backdrop-blur-md rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.03),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.03),transparent_35%)] pointer-events-none" />
      
      <div className="relative flex items-center gap-6 pl-6 marquee">
        {strip.map((book, idx) => (
          <Link
            key={`${book.id}-${idx}`}
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 pr-8 opacity-80 hover:opacity-100 transition-opacity duration-700"
          >
            <div className="relative w-24 h-36 flex-shrink-0 rounded-sm overflow-hidden border border-amber-900/30 bg-[#1c1917] shadow-lg group-hover:shadow-[0_0_20px_rgba(245,158,11,0.28)] group-hover:border-amber-500/50 transition-all duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover opacity-70 mix-blend-soft-light" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500/70 font-mono">Amazon</span>
              <span className="text-base text-stone-200/80 font-serif whitespace-nowrap group-hover:text-amber-200 transition-colors">{book.title}</span>
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
