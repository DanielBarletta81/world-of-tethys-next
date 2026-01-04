'use client';

import Link from 'next/link';

const BOOKS = [
  {
    id: 1,
    title: 'Sky City of Tethys',
    coverUrl: '/img/book1-cover.png',
    amazonLink: 'https://www.amazon.com/dp/B0G572X42L'
  },
  {
    id: 2,
    title: 'Unraveling Ravel',
    coverUrl: '/img/ravel-kindle.png',
    amazonLink: 'https://www.amazon.com/dp/B0GB5CR6HX'
  },
  {
    id: 3,
    title: 'What the Roots Remember',
    coverUrl: '/img/roots-remember.png',
    amazonLink: 'https://www.amazon.com/dp/B0G672S7YC'
  }
];

export default function BookCarousel() {
  const strip = [...BOOKS, ...BOOKS]; // Duplicate for seamless loop

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden py-3 mb-6 border border-amber-900/30 bg-[#0c0a09]/80 backdrop-blur-md rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.04),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.04),transparent_35%)] pointer-events-none" />
      
      <div className="relative flex items-center gap-4 pl-4 marquee">
        {strip.map((book, idx) => (
          <Link
            key={`${book.id}-${idx}`}
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 pr-6"
          >
            <div className="relative w-16 h-24 flex-shrink-0 rounded-sm overflow-hidden border border-amber-900/40 bg-[#1c1917] shadow-lg group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:border-amber-500/60 transition-all duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-mono">Amazon</span>
              <span className="text-sm text-stone-200 font-serif whitespace-nowrap group-hover:text-amber-200 transition-colors">{book.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          animation: scroll 28s linear infinite;
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
