'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cdn } from '@/lib/cdn';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://worldoftethys.com').replace(/\/$/, '');
const AUTHOR_SITE_URL = (process.env.NEXT_PUBLIC_AUTHOR_SITE_URL || SITE_URL).replace(/\/$/, '');
const WORLD_SITE_URL = (process.env.NEXT_PUBLIC_WORLD_SITE_URL || SITE_URL).replace(/\/$/, '');
const GIVEAWAY_ENDS_AT = process.env.NEXT_PUBLIC_KINDLE_GIVEAWAY_ENDS_AT || '2026-03-26T23:59:59-04:00';
const GIVEAWAY_URL =
  'https://www.goodreads.com/giveaway/enter_kindle_giveaway/435539-world-of-tethys-book-1-sky-city';

function normalizePath(pathname) {
  if (!pathname) return '/';
  const [path] = pathname.split('?');
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

function toHost(url) {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return '';
  }
}

function withPath(baseUrl, path) {
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

function formatCountdown(millisecondsRemaining) {
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  const days = Math.floor(millisecondsRemaining / dayMs);
  const hours = Math.floor((millisecondsRemaining % dayMs) / hourMs);
  const minutes = Math.max(1, Math.floor((millisecondsRemaining % hourMs) / minuteMs));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

function buildNavItems({ isAuthorSite, hasSplitDomains }) {
  const worldHref = isAuthorSite && hasSplitDomains ? withPath(WORLD_SITE_URL, '/world') : '/world';
  const authorHref = !isAuthorSite && hasSplitDomains ? withPath(AUTHOR_SITE_URL, '/') : '/author';

  return [
    { href: '/world-of-tethys-book-1', label: 'Book', tone: 'ember', external: false },
    { href: worldHref, label: 'World', tone: 'amber', external: worldHref.startsWith('http') },
    { href: authorHref, label: 'Author', tone: 'stone', external: authorHref.startsWith('http') },
  ];
}

export default function PersistentNav({ siteVariant = 'world' }) {
  const pathname = normalizePath(usePathname());
  const isAuthorSite = siteVariant === 'author';
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Date.now());
  const hasSplitDomains = Boolean(toHost(WORLD_SITE_URL) && toHost(AUTHOR_SITE_URL) && toHost(WORLD_SITE_URL) !== toHost(AUTHOR_SITE_URL));
  const navItems = buildNavItems({ isAuthorSite, hasSplitDomains });
  const giveawayEndTimestamp = useMemo(() => Date.parse(GIVEAWAY_ENDS_AT), []);
  const isGiveawayActive = Number.isFinite(giveawayEndTimestamp) && currentTimestamp < giveawayEndTimestamp;
  const giveawayMsRemaining = isGiveawayActive ? giveawayEndTimestamp - currentTimestamp : 0;
  const isFinalWindow = giveawayMsRemaining > 0 && giveawayMsRemaining <= 48 * 60 * 60 * 1000;
  const giveawayLabel = isGiveawayActive ? formatCountdown(giveawayMsRemaining) : '';
  const panelClassName = isAuthorSite
    ? 'persistent-nav-panel w-full max-w-6xl rounded-2xl border border-amber-900/20 bg-[#f7f1e6]/85 px-2 py-2 shadow-[0_12px_34px_rgba(26,16,6,0.18)] backdrop-blur-lg'
    : 'persistent-nav-panel w-full max-w-6xl rounded-2xl border border-white/15 bg-black/40 px-2 py-2 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-lg';
  const giveawayThemeClass = isAuthorSite
    ? 'inline-flex items-center rounded-full border border-amber-700/50 bg-amber-100/80 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-amber-900 transition hover:border-amber-800/70'
    : 'inline-flex items-center rounded-full border border-orange-500/50 bg-orange-500/20 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-orange-100 transition hover:border-orange-300';
  const giveawayClassName = `${giveawayThemeClass} giveaway-badge ${isFinalWindow ? 'giveaway-badge--urgent' : ''}`;

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentTimestamp(Date.now()), 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <nav
      role="navigation"
      aria-label="Global navigation"
      className="persistent-nav-shell fixed inset-x-0 top-3 z-[120] flex justify-center px-2"
    >
      <div className={panelClassName}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Logo and Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-3 px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
            aria-label="World of Tethys Home"
          >
            <Image
              src={cdn('/img/icons/tethys-seal-coin.svg')}
              alt="World of Tethys"
              width={32}
              height={32}
              className={isAuthorSite ? 'opacity-80' : 'opacity-90'}
              unoptimized
            />
            <span className={`text-sm font-semibold tracking-wide ${
              isAuthorSite ? 'text-[#3d2b1f]' : 'text-stone-200'
            }`}>
              World of Tethys
            </span>
          </Link>

          {/* Navigation Items */}
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {navItems.map((item) => {
            const active = !item.external && (pathname === item.href || pathname.startsWith(`${item.href}/`));
            const className = `persistent-nav-link ${isAuthorSite ? 'author-nav-link' : ''} tone-${item.tone} ${active ? 'is-active' : ''}`;

            if (item.external) {
              return (
                <li key={item.href}>
                  <a href={item.href} className={className}>
                    <span className="persistent-nav-fault" aria-hidden="true" />
                    <span className="persistent-nav-label">{item.label}</span>
                  </a>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={active ? 'page' : undefined} className={className}>
                  <span className="persistent-nav-fault" aria-hidden="true" />
                  <span className="persistent-nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        </div>
        {isGiveawayActive ? (
          <div className="mt-2 flex justify-center">
            <a
              href={GIVEAWAY_URL}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className={giveawayClassName}
            >
              Kindle Giveaway · {giveawayLabel}
            </a>
          </div>
        ) : null}
      </div>
      <style jsx>{`
        .giveaway-badge {
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .giveaway-badge--urgent {
          animation: giveawayPulse 2.8s ease-in-out infinite;
        }
        @keyframes giveawayPulse {
          0% {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(251, 146, 60, 0);
          }
          50% {
            transform: translateY(-1px);
            box-shadow: 0 0 16px rgba(251, 146, 60, 0.28);
          }
          100% {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(251, 146, 60, 0);
          }
        }
      `}</style>
    </nav>
  );
}
