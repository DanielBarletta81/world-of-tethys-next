'use client';

import React from 'react';
import Link from 'next/link';
import cdn from '@/lib/cdn';

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
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden py-4 mb-6 border border-[#24160f] bg-[#050404] backdrop-blur-md rounded-sm shadow-[0_12px_70px_rgba(0,0,0,0.75),0_0_70px_rgba(234,88,12,0.32)]">
      <div className="absolute inset-0 relic-texture pointer-events-none" />
      <div className="absolute inset-0 ember-pulse pointer-events-none" />
      <div className="absolute inset-0 ember-grain pointer-events-none" />
      <div className="absolute inset-0 heat-haze pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(251,146,60,0.2),transparent_42%),radial-gradient(circle_at_85%_0%,rgba(249,115,22,0.36),transparent_38%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(234,88,12,0.45),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,6,5,0.2),rgba(10,6,5,0.78)),radial-gradient(circle_at_50%_50%,rgba(0,0,0,0),rgba(0,0,0,0.75))] pointer-events-none" />
      
      <div className="relative flex items-center gap-4 pl-4 marquee">
        {strip.map((book, idx) => (
          <Link
            key={`${book.id}-${idx}`}
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 pr-6"
          >
            <div className="relative w-16 h-24 flex-shrink-0 relic-card group-hover:relic-card-hot">
              <div className="relic-frame" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={book.coverUrl} alt={book.title} className="relic-image" />
              <div className="relic-carve" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-mono">Amazon</span>
              <span className="text-sm text-stone-100 font-serif whitespace-nowrap group-hover:text-orange-200 transition-colors">{book.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .relic-texture {
          background-image:
            radial-gradient(circle at 10% 20%, rgba(255, 145, 60, 0.1), transparent 55%),
            radial-gradient(circle at 90% 10%, rgba(255, 90, 0, 0.14), transparent 45%),
            repeating-linear-gradient(140deg, rgba(255, 255, 255, 0.035) 0px, rgba(255, 255, 255, 0.035) 1px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 6px);
          opacity: 0.9;
          mix-blend-mode: screen;
        }
        .ember-pulse {
          background: radial-gradient(circle at 40% 120%, rgba(255, 96, 0, 0.5), transparent 60%);
          opacity: 0.35;
          animation: ember 4.8s ease-in-out infinite;
        }
        .ember-grain {
          background-image:
            radial-gradient(circle, rgba(255, 120, 30, 0.18) 0.5px, transparent 0.6px),
            radial-gradient(circle, rgba(255, 180, 90, 0.12) 0.5px, transparent 0.6px);
          background-size: 40px 40px, 55px 55px;
          background-position: 0 0, 10px 20px;
          opacity: 0.12;
          mix-blend-mode: screen;
          animation: sparks 8s linear infinite;
        }
        .heat-haze {
          background: linear-gradient(90deg, rgba(255, 90, 0, 0.12), rgba(0, 0, 0, 0));
          opacity: 0.14;
          filter: blur(14px);
          animation: haze 10s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .ember-grain,
          .heat-haze {
            display: none;
          }
        }
        .marquee {
          animation: scroll 28s linear infinite;
          width: max-content;
        }
        .marquee:hover {
          animation-play-state: paused;
        }
        .marquee::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 120px;
          height: 100%;
          background: linear-gradient(270deg, rgba(8, 6, 5, 0.95), rgba(8, 6, 5, 0));
          pointer-events: none;
        }
        .marquee::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 90px;
          height: 100%;
          background: linear-gradient(90deg, rgba(8, 6, 5, 0.95), rgba(8, 6, 5, 0));
          pointer-events: none;
        }
        .relic-card {
          border-radius: 4px;
          background: linear-gradient(155deg, #1a1411, #060403);
          border: 1px solid rgba(80, 45, 25, 0.85);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            inset 0 -10px 18px rgba(0, 0, 0, 0.7),
            0 6px 18px rgba(0, 0, 0, 0.65);
          overflow: hidden;
          transition: box-shadow 300ms ease, border-color 300ms ease, transform 300ms ease;
        }
        .relic-card::before {
          content: "";
          position: absolute;
          inset: 2px;
          border-radius: 3px;
          border: 1px solid rgba(255, 150, 70, 0.1);
          box-shadow: inset 0 0 14px rgba(0, 0, 0, 0.85);
          pointer-events: none;
        }
        .relic-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(255, 190, 120, 0.08), rgba(0, 0, 0, 0)),
            radial-gradient(circle at 70% 30%, rgba(255, 100, 20, 0.08), transparent 55%);
          opacity: 0.85;
          pointer-events: none;
        }
        .relic-card-hot {
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -8px 16px rgba(0, 0, 0, 0.55),
            0 0 28px rgba(249, 115, 22, 0.6);
          border-color: rgba(255, 110, 30, 0.8);
          transform: translateY(-1px);
        }
        .relic-frame {
          position: absolute;
          inset: 6px;
          border-radius: 3px;
          background:
            linear-gradient(180deg, rgba(255, 140, 70, 0.1), rgba(0, 0, 0, 0.7)),
            radial-gradient(circle at 20% 30%, rgba(255, 110, 30, 0.12), transparent 60%);
          box-shadow:
            inset 0 0 0 1px rgba(255, 170, 90, 0.12),
            inset 0 0 14px rgba(0, 0, 0, 0.6);
          pointer-events: none;
        }
        .relic-image {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.9) contrast(1.08);
          transform: scale(1.025);
        }
        .relic-carve {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 110, 40, 0.18), transparent 48%),
            radial-gradient(circle at 70% 80%, rgba(255, 80, 0, 0.16), transparent 55%),
            linear-gradient(160deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0));
          mix-blend-mode: screen;
          opacity: 0.8;
          pointer-events: none;
        }
        @keyframes ember {
          0%, 100% { opacity: 0.25; transform: translateY(0); }
          50% { opacity: 0.55; transform: translateY(-2px); }
        }
        @keyframes sparks {
          0% { transform: translateY(4px); opacity: 0.08; }
          50% { transform: translateY(-3px); opacity: 0.16; }
          100% { transform: translateY(4px); opacity: 0.08; }
        }
        @keyframes haze {
          0% { transform: translateX(-6px) translateY(0); }
          50% { transform: translateX(8px) translateY(-1px); }
          100% { transform: translateX(-6px) translateY(0); }
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
