'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://worldoftethys.com').replace(/\/$/, '');
const WORLD_SITE_URL = (process.env.NEXT_PUBLIC_WORLD_SITE_URL || SITE_URL).replace(/\/$/, '');
const AUTHOR_SITE_URL = (process.env.NEXT_PUBLIC_AUTHOR_SITE_URL || SITE_URL).replace(/\/$/, '');

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

const siteHost = toHost(SITE_URL);
const worldHost = toHost(WORLD_SITE_URL);
const authorHost = toHost(AUTHOR_SITE_URL);
const hasSplitDomains = Boolean(worldHost && authorHost && worldHost !== authorHost);
const isAuthorBuild = hasSplitDomains && siteHost === authorHost;
const worldHref = isAuthorBuild ? withPath(WORLD_SITE_URL, '/world') : '/world';
const authorHref = !isAuthorBuild && hasSplitDomains ? withPath(AUTHOR_SITE_URL, '/') : '/author';

export const PRIMARY_NAV_ITEMS = [
  { id: 'book', label: 'Book', href: '/world-of-tethys-book-1', hint: 'First opening' },
  { id: 'world', label: 'World', href: worldHref },
  { id: 'author', label: 'Author', href: authorHref, hint: 'D.C. Barletta' },
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
      <div className="bg-white/5 border border-white/10 rounded-3xl px-3 py-3 backdrop-blur-sm shadow-[inset_0_0_40px_rgba(6,5,5,0.6)] text-[10px] uppercase tracking-[0.3em] font-mono sm:flex-wrap sm:justify-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isExternal = item.href.startsWith('http');
            const normalizedHref = isExternal ? '' : normalizePath(item.href);
            const active = !isExternal && (pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`));
            const sharedClassName = `w-full text-center px-3 py-3 min-h-[44px] rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 sm:w-auto ${
              active
                ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-[0_10px_20px_rgba(238,153,57,0.35)]'
                : 'text-stone-300 hover:text-white hover:border-white/40'
            }`;

            if (isExternal) {
              return (
                <a key={item.id} href={item.href} className={sharedClassName} title={item.hint}>
                  {item.label}
                </a>
              );
            }

            return (
              <Link key={item.id} href={item.href} className={sharedClassName} aria-current={active ? 'page' : undefined} title={item.hint}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
