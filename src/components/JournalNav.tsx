'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const WORLD_MAP_URL = `${(process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com').replace(/\/$/, '')}/map`;

const NAV_ITEMS = [
  { href: '/survey', label: 'survey' },
  { href: WORLD_MAP_URL, label: 'map', external: true },
  { href: '/fauna', label: 'fauna' },
  { href: '/flora', label: 'flora' },
  { href: '/fractures', label: 'fractures' }
];

export default function JournalNav({ className = '' }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={clsx('flex flex-wrap gap-4', className)}>
      {NAV_ITEMS.map((item) => {
        const active = item.external ? false : pathname === item.href;
        const className = clsx(
          'px-1 pb-2 text-[10px] tracking-[0.25em] uppercase border-b transition-colors duration-500',
          active
            ? 'text-stone-200 border-stone-400'
            : 'text-stone-500 border-transparent hover:text-stone-300 hover:border-stone-600'
        );
        if (item.external) {
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {item.label}
            </a>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={className}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
