'use client';

import Link from 'next/link';

export default function BreadcrumbTrail({ trail = [], className = '' }) {
  if (!trail.length) return null;

  return (
    <nav
      aria-label="breadcrumb"
      className={`w-full ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.35em] font-mono text-stone-400">
        {trail.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
            {crumb.href && !crumb.current ? (
              <Link
                href={crumb.href}
                className="text-stone-400 hover:text-amber-300 transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={`${
                  crumb.current ? 'text-white' : 'text-stone-400'
                }`}
                aria-current={crumb.current ? 'page' : undefined}
              >
                {crumb.label}
              </span>
            )}
            {index < trail.length - 1 && (
              <span aria-hidden="true" className="text-stone-600">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
