'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home', tone: 'amber' },
  { href: '/author', label: 'Author', tone: 'stone' },
  { href: '/world-of-tethys-book-1', label: 'Book', tone: 'ember' },
  { href: '/blog', label: 'Essays', tone: 'emerald' },
  { href: '/press-kit', label: 'Press', tone: 'cyan' },
  { href: '/contact', label: 'Contact', tone: 'violet' },
];

function normalizePath(pathname) {
  if (!pathname) return '/';
  const [path] = pathname.split('?');
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

export default function PersistentNav() {
  const pathname = normalizePath(usePathname());

  return (
    <nav
      role="navigation"
      aria-label="Global navigation"
      className="persistent-nav-shell fixed inset-x-0 top-3 z-[120] flex justify-center px-2"
    >
      <div className="persistent-nav-panel w-full max-w-6xl rounded-2xl border border-white/15 bg-black/40 px-2 py-2 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-lg">
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`persistent-nav-link tone-${item.tone} ${active ? 'is-active' : ''}`}
                >
                  <span className="persistent-nav-fault" aria-hidden="true" />
                  <span className="persistent-nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
