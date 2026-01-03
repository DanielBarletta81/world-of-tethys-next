'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const BookBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BOOKS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentBook = BOOKS[currentIndex];

  return (
    <aside className="sticky top-24 self-start w-64 bg-[#0c0a09] border border-[#292524] p-4 shadow-[0_0_30px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden">
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#44403c 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
      <div className="relative z-10 space-y-3">
        <div className="text-center">
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716c]">The Archives</p>
          <div className="w-8 h-[1px] bg-amber-900/50 mx-auto mt-2"></div>
        </div>

        <a
          href={currentBook.amazonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative group aspect-[2/3] w-full bg-[#1c1917] rounded border border-[#292524] overflow-hidden shadow-lg transition-transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:border-amber-700/50"
        >
          <img
            src={currentBook.coverUrl}
            alt={currentBook.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity grayscale-[30%] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <span className="text-[10px] font-sans uppercase font-bold text-amber-100 tracking-widest bg-black/60 px-2 py-1 rounded border border-amber-500/30">
              Acquire
            </span>
          </div>
        </a>

        <div className="text-center text-[11px] text-stone-200 font-serif leading-tight">{currentBook.title}</div>

        <div className="flex justify-between items-center px-2">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? BOOKS.length - 1 : prev - 1))}
            className="text-[#57534e] hover:text-amber-500 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1 items-center">
            {BOOKS.map((book, idx) => (
              <div
                key={book.id}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-amber-600 shadow-[0_0_5px_rgba(245,158,11,0.8)]' : 'bg-[#292524]'}`}
              ></div>
            ))}
          </div>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % BOOKS.length)}
            className="text-[#57534e] hover:text-amber-500 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default BookBanner;
