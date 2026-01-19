'use client';

import { usePathname } from 'next/navigation';
import { cdn } from '@/lib/cdn';

const FOOTER_PLATES = [
  { match: (p) => p === '/', plate: '/img/plates/footer/footer-home-watcher.webp' },
  { match: (p) => p.startsWith('/map'), plate: '/img/plates/footer/footer-map-ghostrelief.webp' },
  { match: (p) => p.startsWith('/creatures'), plate: '/img/plates/footer/footer-creatures-rookery.webp' },
  { match: (p) => p.startsWith('/mystics'), plate: '/img/plates/footer/footer-mystics-moonwater.webp' },
  { match: () => true, plate: '/img/plates/footer/footer-home-watcher.webp' },
];

export default function SiteFooter() {
  const pathname = usePathname() || '/';
  const plate = (FOOTER_PLATES.find((x) => x.match(pathname)) ?? FOOTER_PLATES.at(-1)).plate;
  const isMystics = pathname.startsWith('/mystics');
  const isHome = pathname === '/';

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

      <img
        src={cdn('/icons/creator_seal_coin.svg')}
        alt=""
        className={
          isMystics
            ? 'pointer-events-none absolute left-1/2 top-10 w-[160px] -translate-x-1/2 opacity-[0.18]'
            : 'pointer-events-none absolute bottom-[32px] right-[118px] w-[160px] opacity-[0.16]'
        }
        style={{ filter: 'drop-shadow(0 10px 24px rgba(255,106,42,0.35))', mixBlendMode: 'screen' }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 text-white/70">
        <div className="text-sm tracking-[0.28em] uppercase">
          D.C. Barletta • World of Tethys
        </div>
        <div className="mt-2 text-xs text-white/45">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
// World of Tethys || D.C. Barletta
