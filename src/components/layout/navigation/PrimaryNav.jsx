'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Youtube, Music2 } from 'lucide-react';

export const PRIMARY_NAV_ITEMS = [
  { id: 'map', label: 'Atlas', href: '/map', hint: 'Terrain, gates, fragments' },
  { id: 'science', label: 'Science', href: '/science', hint: 'Field station' },
  { id: 'mystics', label: 'Mystics', href: '/mystics', hint: 'The Veil' },
  { id: 'pteros', label: 'Pteros', href: '/pteros', hint: 'Echo Wall' },
  { id: 'signals', label: 'Signals', href: '/signals', hint: 'Open broadcasts' },
  { id: 'peek', label: 'Peek', href: '/peek', hint: 'World primer' },
  { id: 'bookstore', label: 'Bookstore', href: '/bookstore', hint: 'Supply drop' },
];

const normalizePath = (pathname) => {
  if (!pathname) return '/';
  const [path] = pathname.split('?');
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
};

export default function PrimaryNav({ className = '' }) {
  const pathname = normalizePath(usePathname());
  const socialLinks = [
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/worldoftethys/',
      Icon: Instagram
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      href: 'https://www.tiktok.com/@worldoftethys_writer',
      Icon: Music2
    },
    {
      id: 'youtube',
      label: 'YouTube',
      href: 'https://www.youtube.com/@worldoftethysauthor',
      Icon: Youtube
    }
  ];

  return (
    <nav
      role="navigation"
      aria-label="Primary navigation"
      className={`w-full ${className}`}
    >
      <div className="bg-white/5 border border-white/10 rounded-3xl px-3 py-3 backdrop-blur-sm shadow-[inset_0_0_40px_rgba(6,5,5,0.6)] flex flex-col gap-3 text-[10px] uppercase tracking-[0.3em] font-mono sm:flex-wrap sm:justify-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const normalizedHref = normalizePath(item.href);
            const active = pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full text-center px-3 py-3 min-h-[44px] rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 sm:w-auto ${
                  active
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-[0_10px_20px_rgba(238,153,57,0.35)]'
                    : 'text-stone-300 hover:text-white hover:border-white/40'
                }`}
                aria-current={active ? 'page' : undefined}
                title={item.hint}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-3">
          {socialLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className="group relative w-10 h-10 rounded-full border border-amber-900/50 bg-black/50 flex items-center justify-center text-amber-200/70 hover:text-amber-100 transition-colors"
              title={item.label}
            >
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(251,146,60,0.35),transparent_60%)] opacity-40 group-hover:opacity-80 transition-opacity" />
              <span className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.45),transparent_65%)] blur-md opacity-30 group-hover:opacity-70 transition-opacity social-lava" />
              <item.Icon size={16} className="relative z-10" />
            </a>
          ))}
        </div>
      </div>
      <style jsx>{`
        .social-lava {
          animation: lavaPulse 4.8s ease-in-out infinite;
        }
        @keyframes lavaPulse {
          0% {
            transform: scale(0.92);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.92);
            opacity: 0.25;
          }
        }
      `}</style>
    </nav>
  );
}
