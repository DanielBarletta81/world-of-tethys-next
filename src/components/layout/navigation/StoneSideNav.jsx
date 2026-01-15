'use client';

import Link from 'next/link';
import { Map, FlaskConical, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'chronicle', label: 'Chronicle', href: '/study', icon: BookOpen },
  { id: 'map', label: 'Atlas', href: '/map', icon: Map },
  { id: 'science', label: 'Science', href: '/science', icon: FlaskConical }
];

export default function StoneSideNav() {
  return (
    <nav className="fixed left-0 top-1/3 z-40 hidden md:flex flex-col gap-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            className="group relative flex items-center gap-3 pl-5 pr-6 py-3 bg-[#1a130f]/90 border border-[#2b221a] shadow-[0_10px_20px_rgba(0,0,0,0.4)] rounded-r-2xl translate-x-[-14px] hover:translate-x-0 transition-transform"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-700/70 bg-[#0e0a07] text-amber-400">
              <Icon size={14} />
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-stone-300 font-mono">
              {item.label}
            </span>
            <span className="absolute inset-y-2 left-0 w-[2px] bg-gradient-to-b from-amber-500/60 via-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        );
      })}
    </nav>
  );
}
