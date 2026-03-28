'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const GIVEAWAY_URL =
  'https://www.goodreads.com/giveaway/enter_kindle_giveaway/435539-world-of-tethys-book-1-sky-city';
const DEFAULT_ENDS_AT = '2026-03-26T23:59:59-04:00';

function formatTimeRemaining(millisecondsRemaining) {
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  const days = Math.floor(millisecondsRemaining / dayMs);
  const hours = Math.floor((millisecondsRemaining % dayMs) / hourMs);
  const minutes = Math.max(0, Math.floor((millisecondsRemaining % hourMs) / minuteMs));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export default function KindleGiveawayBanner({
  className = '',
  theme = 'dark',
  giveawayUrl = GIVEAWAY_URL,
  endsAt = process.env.NEXT_PUBLIC_KINDLE_GIVEAWAY_ENDS_AT || DEFAULT_ENDS_AT,
}) {
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentTimestamp(Date.now()), 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const giveawayEndTimestamp = useMemo(() => Date.parse(endsAt), [endsAt]);

  if (!Number.isFinite(giveawayEndTimestamp)) return null;
  if (currentTimestamp >= giveawayEndTimestamp) return null;

  const timeLabel = formatTimeRemaining(giveawayEndTimestamp - currentTimestamp);
  const isLight = theme === 'light';
  const shellClass = isLight
    ? 'border-amber-900/25 bg-[#f8f2e8]/95 text-[#3b2a1e] shadow-[0_10px_24px_rgba(33,20,10,0.1)]'
    : 'border-orange-700/40 bg-gradient-to-r from-[#1a0f0a]/95 via-[#24140d]/95 to-[#1a0f0a]/95 text-stone-100 shadow-[0_14px_30px_rgba(0,0,0,0.35)]';
  const badgeClass = isLight
    ? 'border-amber-800/35 bg-amber-100/80 text-amber-900'
    : 'border-orange-500/40 bg-orange-500/20 text-orange-100';
  const subtextClass = isLight ? 'text-[#5b4638]' : 'text-stone-300';
  const secondaryCtaClass = isLight
    ? 'border-amber-900/35 bg-white/70 text-[#4b3828] hover:border-amber-800/55'
    : 'border-stone-500/70 bg-black/35 text-stone-200 hover:border-stone-300';

  return (
    <section className={`rounded-2xl border p-5 md:p-6 ${shellClass} ${className}`.trim()} aria-label="Kindle giveaway">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className={`inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.28em] ${badgeClass}`}>
            Kindle Giveaway Live
          </p>
          <h2 className="text-xl font-semibold md:text-2xl">World of Tethys Book 1 • Goodreads Giveaway</h2>
          <p className={`text-sm leading-relaxed ${subtextClass}`}>
            Front-and-center promotion is active now. Giveaway window: <span className="font-semibold">{timeLabel}</span>.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={giveawayUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-orange-400/60 bg-orange-500/25 px-5 py-2 text-xs uppercase tracking-[0.18em] text-orange-50 transition hover:border-orange-300 hover:bg-orange-500/35"
          >
            Enter Giveaway
          </a>
          <Link
            href="/world-of-tethys-book-1"
            className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-xs uppercase tracking-[0.18em] transition ${secondaryCtaClass}`}
          >
            View Book One
          </Link>
        </div>
      </div>
    </section>
  );
}
