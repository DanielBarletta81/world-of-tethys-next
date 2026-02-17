'use client';

import Image from 'next/image';
import { catalogItems } from '@/data/catalog';

const BOOK_IDS = new Set([
  'sky-city-kindle',
  'ravel-mystics-ebook',
  'roots-remember-kindle',
  'ravel-paperback'
]);

export default function HomeBookBanner() {
  const books = catalogItems.filter((item) => BOOK_IDS.has(item.id));
  const store = catalogItems.find((item) => item.id === 'author-store');

  return (
    <section className="w-full max-w-5xl mt-12 text-left">
      <div className="relative border border-stone-700/50 bg-black/45 backdrop-blur-sm rounded-sm px-6 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(120,113,108,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(71,85,105,0.16),transparent_50%)] pointer-events-none opacity-60" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500 font-mono">
              Archive Release
            </p>
            <h2 className="mt-2 text-lg text-stone-200 font-serif">
              Chronicle editions on Amazon
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Immediate access to the primary volumes.
            </p>
          </div>
          {store ? (
            <a
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.3em] text-stone-400 hover:text-stone-200 border border-stone-700/70 px-3 py-2 rounded-sm transition-colors"
            >
              Full author index
            </a>
          ) : null}
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <a
              key={book.id}
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-sm border border-stone-800/60 bg-black/20 p-3 hover:border-stone-500/80 hover:bg-black/30 transition-colors"
            >
              <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-[2px] border border-stone-700/60 bg-[#0b0a09] shadow-[0_10px_22px_rgba(0,0,0,0.45)]">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-[0.22em] text-stone-500 font-mono">
                  {book.format}
                </div>
                <div className="text-sm text-stone-200 leading-snug">
                  {book.title}
                </div>
                <div className="text-[10px] text-stone-500 leading-snug">
                  {book.subtitle}
                </div>
                <div className="mt-2 text-[9px] uppercase tracking-[0.3em] text-stone-400">
                  Amazon
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// World of Tethys || D.C. Barletta
