'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cdn } from '@/lib/cdn';

const FOOTER_PLATES = [
  { match: (p) => p === '/', plate: '/img/plates/footer/footer-home-watcher.webp' },
  { match: (p) => p.startsWith('/map'), plate: '/img/plates/footer/footer-map-ghostrelief.webp' },
  { match: (p) => p.startsWith('/creatures'), plate: '/img/plates/footer/footer-creatures-rookery.webp' },
  { match: (p) => p.startsWith('/mystics'), plate: '/img/plates/footer/footer-mystics-moonwater.webp' },
  { match: () => true, plate: '/img/plates/footer/footer-home-watcher.webp' },
];

export default function SiteFooter({ siteVariant = 'world' }) {
  const pathname = usePathname() || '/';
  const isAuthorSite = siteVariant === 'author';
  const worldSiteUrl = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';
  const authorSiteUrl = process.env.NEXT_PUBLIC_AUTHOR_SITE_URL || 'https://dcbarletta.com';
  const amazonUrl = 'https://www.amazon.com/dp/B0GRHBR1HJ';
  const plate = (FOOTER_PLATES.find((x) => x.match(pathname)) ?? FOOTER_PLATES.at(-1)).plate;
  const isMystics = pathname.startsWith('/mystics');
  const isHome = pathname === '/';

  if (isAuthorSite) {
    return (
      <footer
        role="contentinfo"
        className="relative overflow-hidden border-t border-[#8e765b]/18 bg-[linear-gradient(180deg,#efe4d2,#e8dcc8)]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply"
          style={{ backgroundImage: `url(${cdn('/noise.svg')})`, backgroundSize: '420px 420px' }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-multiply"
          style={{
            backgroundImage: `url(${cdn('/img/map/tethys-atlas-clean.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <Image
          src={cdn('/img/icons/tethys-seal-coin.svg')}
          alt=""
          width={148}
          height={148}
          className="pointer-events-none absolute bottom-8 right-10 opacity-[0.14]"
          style={{ filter: 'drop-shadow(0 8px 20px rgba(138,92,48,0.25))', mixBlendMode: 'multiply' }}
          unoptimized
        />

        <div className="relative mx-auto max-w-6xl px-6 py-16 text-[#3d3027]">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
            <div>
              <p className="text-sm tracking-[0.28em] uppercase text-[#7a5f4c]">
                D.C. Barletta • Author Site
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-[#2b1d13]">
                Book first. Author-forward. Tethys still visible.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#5e4b3f]">
                Use this site for Book One, the author profile, essays, and media resources. Cross
                into{' '}
                <span className="font-semibold text-[#4b382a]">worldoftethys.com</span> for the
                atlas, Cambria fragments, and the deeper in-world record.
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#7a5f4c]">Start Here</p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-[#3d3027]">
                <Link href="/" className="transition-colors hover:text-[#1f1712]">
                  Landing Page
                </Link>
                <Link href="/world-of-tethys-book-1" className="transition-colors hover:text-[#1f1712]">
                  Book One
                </Link>
                <Link href="/about-dc-barletta" className="transition-colors hover:text-[#1f1712]">
                  About D.C. Barletta
                </Link>
                <Link href="/blog" className="transition-colors hover:text-[#1f1712]">
                  Essays
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#7a5f4c]">Go Deeper</p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-[#3d3027]">
                <Link href="/press-kit" className="transition-colors hover:text-[#1f1712]">
                  Press Kit
                </Link>
                <Link href="/archive/cambria" className="transition-colors hover:text-[#1f1712]">
                  Cambria Fragments
                </Link>
                <a href={amazonUrl} className="transition-colors hover:text-[#1f1712]">
                  Buy on Amazon
                </a>
                <a
                  href={worldSiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-[#1f1712]"
                >
                  Explore worldoftethys.com
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#8e765b]/14 pt-5 text-xs text-[#6c5443]">
            <p>Book and author pages live here. The larger atlas and archive live on the world domain.</p>
            <p>© {new Date().getFullYear()} D.C. Barletta</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      role="contentinfo"
      className="relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(1200px 380px at 50% 110%, rgba(255,106,42,0.18), rgba(0,0,0,0) 62%),
          linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.35)),
          url(${cdn(plate)})
        `,
        backgroundSize: 'cover',
        backgroundPosition: isMystics ? 'center top' : isHome ? '50% 50%' : 'center',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: `url(${cdn('/noise.svg')})`, backgroundSize: '420px 420px' }}
      />

      <Image
        src={cdn('/img/icons/tethys-seal-coin.svg')}
        alt=""
        width={160}
        height={160}
        className={
          isMystics
            ? 'pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 opacity-[0.18]'
            : 'pointer-events-none absolute bottom-[32px] right-[118px] opacity-[0.16]'
        }
        style={{ filter: 'drop-shadow(0 10px 24px rgba(255,106,42,0.35))', mixBlendMode: 'screen' }}
        unoptimized
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 text-white/70">
        <div className="text-sm tracking-[0.28em] uppercase">
          World of Tethys • Living Atlas and Archive
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <Link href="/world" className="underline underline-offset-4 hover:text-white">
            World Hub
          </Link>
          <Link href="/world/map" className="underline underline-offset-4 hover:text-white">
            Atlas
          </Link>
          <Link href="/archive" className="underline underline-offset-4 hover:text-white">
            Archive
          </Link>
          <Link href="/natural-history" className="underline underline-offset-4 hover:text-white">
            Natural History
          </Link>
          <a href={amazonUrl} className="underline underline-offset-4 hover:text-white">
            Buy on Amazon
          </a>
          <a href={`${authorSiteUrl.replace(/\/$/, '')}/author`} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">
            Author Hub
          </a>
          <Link href="/world-of-tethys-book-1" className="underline underline-offset-4 hover:text-white">
            Book Page
          </Link>
        </div>
        <div className="mt-2 text-xs text-white/45">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
