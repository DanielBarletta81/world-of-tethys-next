'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/survey', label: 'survey' },
  { href: '/map', label: 'map' },
  { href: '/fauna', label: 'fauna' },
  { href: '/flora', label: 'flora' },
  { href: '/fractures', label: 'fractures' }
];

export default function JournalNav({ className = '' }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={clsx('flex flex-wrap gap-4', className)}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'px-1 pb-2 text-[10px] tracking-[0.25em] uppercase border-b transition-colors duration-500',
              active
                ? 'text-stone-200 border-stone-400'
                : 'text-stone-500 border-transparent hover:text-stone-300 hover:border-stone-600'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
