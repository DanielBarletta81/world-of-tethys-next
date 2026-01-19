'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <nav
      role="navigation"
      aria-label="Primary navigation"
      className={`w-full ${className}`}
    >
      <div className="bg-white/5 border border-white/10 rounded-3xl px-3 py-3 backdrop-blur-sm shadow-[inset_0_0_40px_rgba(6,5,5,0.6)] flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] font-mono sm:flex-row sm:flex-wrap sm:justify-center">
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
    </nav>
  );
}
