'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { cdn } from '@/lib/cdn';

const BOOKS = [
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

const BookBanner = () => {
  const looped = useMemo(() => [...BOOKS, ...BOOKS], []);

  return (
    <div className="group relative isolate z-40 w-full max-w-none mx-auto overflow-hidden py-6 px-6 mb-8 border border-amber-500/40 bg-[#0b0a08] backdrop-blur-md rounded-sm shadow-[0_22px_70px_rgba(0,0,0,0.6)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,147,30,0.18),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(255,70,0,0.14),transparent_50%)] pointer-events-none opacity-60 transition-opacity duration-700 group-hover:opacity-95" />
      <div className="absolute inset-0 magma-swell pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-700" />
      <div className="absolute inset-0 cooled-crust pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0b0a08] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0b0a08] to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center gap-10 marquee" aria-label="Book carousel with Amazon links">
        {looped.map((book, idx) => (
          <a
            key={`${book.id}-${idx}`}
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 pr-10 opacity-90 hover:opacity-100 hover:translate-y-[-2px] transition-all duration-700"
          >
            <div className="relative isolate z-20 w-36 h-52 flex-shrink-0 rounded-sm border border-amber-700/60 bg-[#14110f] shadow-[0_18px_34px_rgba(0,0,0,0.6)] group-hover:shadow-[0_0_55px_rgba(255,132,0,0.6)] group-hover:border-amber-300/90 transition-all duration-500">
              <div className="absolute -inset-3 bg-[radial-gradient(circle,rgba(255,112,0,0.4),transparent_65%)] opacity-50 blur-xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />
              <div className="absolute -inset-6 bg-gradient-to-r from-transparent via-[#ffb648]/55 to-transparent opacity-0 translate-x-[-70%] group-hover:opacity-100 group-hover:translate-x-[70%] transition-all duration-700 pointer-events-none" />
              <div className="absolute inset-0 border border-amber-400/30 rounded-sm pointer-events-none" />
              <div className="relative z-30 h-full w-full p-1">
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  sizes="144px"
                  className="object-cover rounded-[2px] shadow-[0_12px_20px_rgba(0,0,0,0.55)] group-hover:-translate-y-1 transition-transform duration-500"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500/70 font-mono">Amazon</span>
              <span className="text-base text-stone-200/90 font-serif whitespace-nowrap group-hover:text-amber-100 transition-colors">
                {book.title}
              </span>
            </div>
          </a>
        ))}
      </div>

      <style jsx>{`
        .magma-swell {
          background: radial-gradient(circle at 50% 120%, rgba(255, 115, 0, 0.55), rgba(110, 20, 5, 0.25) 45%, transparent 70%);
          filter: blur(18px);
          animation: magmaPulse 6s ease-in-out infinite;
        }
        .cooled-crust {
          background-image:
            radial-gradient(circle at 20% 30%, rgba(15, 10, 8, 0.9), transparent 40%),
            radial-gradient(circle at 80% 40%, rgba(20, 12, 10, 0.8), transparent 45%),
            linear-gradient(120deg, rgba(18, 12, 10, 0.9), rgba(6, 5, 4, 0.7));
          opacity: 0.85;
        }
        .marquee {
          animation: scroll 80s linear infinite;
          width: max-content;
        }
        .marquee:hover {
          animation-play-state: paused;
        }
        .group:hover .magma-swell {
          animation-duration: 3.5s;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes magmaPulse {
          0%, 100% { opacity: 0.45; transform: translateY(6px) scale(1); }
          50% { opacity: 0.9; transform: translateY(-6px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default BookBanner;
// World of Tethys || D.C. Barletta
