'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { getSiteVariantFromConfig } from '@/lib/site-variant';

export default function SubscribeConfirmPage() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthor = siteVariant === 'author';

  useEffect(() => {
    // Fire Google Ads conversion for newsletter sign-up
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-17612201186/60E2CMC8uJQcEOK5k85B',
      });
    }
  }, []);

  if (isAuthor) {
    return (
      <main className="min-h-screen bg-[#f4efe6] text-[#2f241d] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center space-y-8">
          <div
            className="mx-auto w-24 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(122,79,48,0.5), transparent)' }}
          />

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#7c6250] font-mono">
              Confirmed
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-[#2f1f14] tracking-tight">
              You're in.
            </h1>
            <p className="text-[#5c4033] text-sm leading-relaxed max-w-sm mx-auto">
              Welcome to{' '}
              <span className="font-semibold text-[#3d2b1a]">Pteroswifts from Tethys</span>.
              Check your inbox to confirm — your first dispatch is queued.
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[#8e765b]/25 bg-white/60 p-6 text-left space-y-3">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#7c6250] font-mono">
              What to expect
            </p>
            <ul className="space-y-2 text-sm text-[#5c4033]">
              <li className="flex gap-3">
                <span className="text-[#7a4f30] mt-0.5">—</span>
                <span>Field notes and lore from Tethys not in the main record</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#7a4f30] mt-0.5">—</span>
                <span>Exclusive imagery, creature sketches, and author notes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#7a4f30] mt-0.5">—</span>
                <span>Writing updates, early access, and behind-the-page writing</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="rounded-[1.3rem] border border-[#8e765b]/30 bg-white/50 px-6 py-3 text-sm font-medium text-[#4f3c30] hover:bg-white/70 transition"
            >
              Return Home
            </Link>
            <Link
              href="/world-of-tethys-book-1"
              className="rounded-[1.3rem] bg-[#7a4f30] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5d3a22] transition"
            >
              Read Book One
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // World site variant
  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div
          className="mx-auto w-24 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(217,119,6,0.6), transparent)' }}
        />
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.5em] text-amber-600/80 font-mono">
            Signal Confirmed
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#e3dcd2] to-[#9c7e5e] tracking-tight">
            You're in.
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed max-w-sm mx-auto">
            Welcome to{' '}
            <span className="text-amber-300 font-semibold">Pteroswifts from Tethys</span>.
            Check your inbox to confirm your address.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-[1.2rem] border border-white/10 bg-black/30 px-6 py-3 text-sm font-medium text-stone-300 hover:border-white/20 hover:text-white transition"
          >
            Return Home
          </Link>
          <Link
            href="/world-of-tethys-book-1"
            className="rounded-[1.2rem] bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition"
          >
            Explore Book One
          </Link>
        </div>
      </div>
    </main>
  );
}
