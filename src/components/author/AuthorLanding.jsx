import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Compass, Feather, Waves } from 'lucide-react';
import GoodreadsWidget from '@/components/content/GoodreadsWidget';
import SubscribeSection from '@/components/content/SubscribeSection';
import { TETHYS_OCEAN_RESEARCH_BRIEF } from '@/data/tethys-ocean-research';
import { cdn } from '@/lib/cdn';

const WORLD_SITE_URL = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';
const AMAZON_URL = 'https://www.amazon.com/dp/B0GRHBR1HJ';
const AUTHOR_SEAL_URL = cdn('/img/icons/tethys-seal-coin.svg');

const heroMarks = [
  { label: 'First Breach', value: 'Book One' },
  { label: 'Waterline', value: 'Sky City' },
  { label: 'Older Name', value: 'Cambria' },
];

const routeCards = [
  {
    title: 'Book One',
    description: 'The first opening.',
    href: '/world-of-tethys-book-1',
    imageSrc: cdn('/img/books/book1-cover.png'),
    imageAlt: 'World of Tethys Book One cover art',
    cta: 'Book One',
    external: false,
  },
  {
    title: 'D.C. Barletta',
    description: 'A name above the waterline.',
    href: '/about-dc-barletta',
    imageSrc: '/ray_smile.jpg',
    imageAlt: 'Portrait of D.C. Barletta',
    cta: 'The Author',
    external: false,
  },
  {
    title: 'Field Notes',
    description: 'Ash, weather, and drift.',
    href: '/blog',
    imageSrc: cdn('/img/watcher_mountain3.png'),
    imageAlt: 'World of Tethys volcanic mountain landscape',
    cta: 'Essays',
    external: false,
  },
  {
    title: 'The World',
    description: 'The larger ruin below.',
    href: WORLD_SITE_URL,
    imageSrc: cdn('/img/plates/footer/footer-home-watcher.webp'),
    imageAlt: 'World of Tethys atmosphere artwork',
    cta: 'World',
    external: true,
  },
];

const deepWorldRoutes = [
  {
    title: 'Tethys Ocean',
    description: 'Salt, pressure, old currents.',
    href: '/natural-history/tethys-ocean',
    cta: 'Ocean',
    Icon: Waves,
  },
  {
    title: 'Cambria',
    description: 'A lost city speaking in fragments.',
    href: '/archive/cambria',
    cta: 'Cambria',
    Icon: Compass,
  },
];

const outerChannels = [
  {
    label: 'Amazon',
    href: AMAZON_URL,
    body: 'The book in the wild.',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@WorldofTethys',
    body: 'Signals from the edge.',
  },
  {
    label: 'Goodreads',
    href: 'https://www.goodreads.com/book/show/249368560-world-of-tethys',
    body: 'Reader echoes.',
  },
];

const heroSurfaceClass =
  'relative overflow-hidden rounded-[2.3rem] border border-[#8e765b]/20 bg-[linear-gradient(145deg,rgba(252,247,239,0.98),rgba(236,225,206,0.94))] shadow-[0_24px_60px_rgba(35,20,8,0.12)]';

const cardSurfaceClass =
  'group relative overflow-hidden rounded-[1.75rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(242,232,216,0.92))] shadow-[0_10px_24px_rgba(33,20,10,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#ad7a4b]/45 hover:shadow-[0_18px_36px_rgba(33,20,10,0.14)]';

const sectionSurfaceClass =
  'relative overflow-hidden rounded-[1.95rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(250,244,235,0.96),rgba(239,229,211,0.92))] shadow-[0_12px_28px_rgba(33,20,10,0.08)]';

export default function AuthorLanding() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 text-[#2a1f17] md:py-20">
      <section className={`${heroSurfaceClass} px-8 py-8 md:px-10 md:py-10`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
          style={{
            backgroundImage: 'url(/img/map/tethys-atlas-canon.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(111,169,166,0.18),transparent_26%),radial-gradient(circle_at_88%_14%,rgba(185,119,66,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.26),transparent_28%)]" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-52 w-52 rounded-full bg-[#7cc5bf]/18 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d7a372]/20 blur-3xl" />
        <Image
          src={AUTHOR_SEAL_URL}
          alt=""
          width={132}
          height={132}
          className="pointer-events-none absolute bottom-6 right-6 opacity-[0.18] mix-blend-multiply"
          aria-hidden="true"
        />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#8e765b]/20 bg-white/55 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[#6c4d38]">
                <Feather className="h-3.5 w-3.5" />
                D.C. Barletta // Author Site
              </p>
              <h1 className="max-w-4xl text-4xl font-tethys-volcanic leading-[0.92] text-[#2f1f14] md:text-6xl">
                A world rising out of ash, salt, and rumor.
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-[#3f3024] md:text-lg">
                Book One breaks the surface. The rest waits below.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/world-of-tethys-book-1"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#6d4c36] bg-[#2f2219] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#f7eee2] transition hover:-translate-y-0.5 hover:bg-[#20160f]"
              >
                Book One
              </Link>
              <Link
                href="/about-dc-barletta"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#8d5b36] bg-[#f2e2cd] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#3a2617] transition hover:-translate-y-0.5 hover:bg-[#e8d2b7]"
              >
                The Author
              </Link>
              <Link
                href="/blog"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#7a8b8d]/30 bg-[#eef4f1] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#264041] transition hover:-translate-y-0.5 hover:bg-[#e3efea]"
              >
                Essays
              </Link>
              <a
                href={WORLD_SITE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
              >
                World
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroMarks.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.35rem] border border-[#8e765b]/18 bg-white/55 px-4 py-4 backdrop-blur"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#7c6250]">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-[#2f1f14]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.62fr_0.38fr] lg:grid-cols-1 xl:grid-cols-[0.62fr_0.38fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#8e765b]/20 bg-[#f5ebdc]/90 p-3 shadow-[0_18px_42px_rgba(35,20,8,0.14)]">
              <div className="relative overflow-hidden rounded-[1.55rem] border border-[#8e765b]/18 bg-[#ece1cf]">
                <Image
                  src={cdn('/img/books/book1-cover.png')}
                  alt="World of Tethys Book One cover"
                  width={720}
                  height={1080}
                  priority
                  className="h-auto w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.16))]" />
              </div>
              <div className="mt-4 rounded-[1.35rem] border border-[#8e765b]/18 bg-white/55 p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#7c6250]">First Opening</p>
                <p className="mt-2 text-lg font-semibold text-[#2f1f14]">World of Tethys Book One</p>
                <p className="mt-2 text-sm leading-relaxed text-[#4d3a2c]">
                  Sky City breaks the surface first.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.6rem] border border-[#8e765b]/18 bg-white/60 p-5 shadow-[0_10px_22px_rgba(33,20,10,0.08)]">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#7c6250]">Ledge Script</p>
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-[#433225]">
                  <p>Sky City above.</p>
                  <p>Cambria below.</p>
                  <p>Signals crossing the dark.</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.6rem] border border-[#8e765b]/18 bg-white/60 shadow-[0_10px_22px_rgba(33,20,10,0.08)]">
                <div
                  className="h-28 w-full border-b border-[#8e765b]/15 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.22)), url(/img/map/tethys-atlas-canon.png)',
                  }}
                />
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#7c6250]">Below the Waterline</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#433225]">
                    More of Tethys is still surfacing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#7c6250]">Openings</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#2f1f14] md:text-4xl">
              Four thresholds.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-[#5a4638]">
            Only a few names are showing.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {routeCards.map((card) => {
            const content = (
              <>
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.1rem] border border-[#8e765b]/16 bg-[#e8dcc8] md:h-20 md:w-20">
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 768px) 64px, 80px"
                      className="object-cover transition duration-300 group-hover:scale-[1.05] group-hover:saturate-110"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-[#312115] transition-colors group-hover:text-[#24170f]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4f3c30] transition-colors group-hover:text-[#3b2c22]">
                      {card.description}
                    </p>
                  </div>
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.03em] text-[#7a4f30] transition-colors group-hover:text-[#5f3c23]">
                  <span>{card.cta}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </>
            );

            if (card.external) {
              return (
                <a
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${cardSurfaceClass} p-6`}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={card.title} href={card.href} className={`${cardSurfaceClass} p-6`}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className={`${sectionSurfaceClass} p-6 md:p-8`}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#7c6250]">Strata</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#2f1f14]">What stays beneath</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f3c30]">
            Pressure. Salt. Lost routes.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {TETHYS_OCEAN_RESEARCH_BRIEF.slice(0, 3).map((entry) => (
              <article
                key={entry.title}
                className="rounded-[1.3rem] border border-[#8e765b]/18 bg-white/65 p-4"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6f4f38]">
                  {entry.title}
                </h3>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {deepWorldRoutes.map((item) => {
              const Icon = item.Icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[1.45rem] border border-[#8e765b]/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,235,221,0.82))] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#ad7a4b]/45 hover:shadow-[0_18px_32px_rgba(33,20,10,0.12)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#8e765b]/18 bg-white/70 text-[#6f4f38]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#312115]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#4f3c30]">{item.description}</p>
                      <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#7a4f30]">
                        <span>{item.cta}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className={`${sectionSurfaceClass} p-6 md:p-8`}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#7c6250]">Echoes</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2f1f14]">Reader echoes</h2>
            <div className="mt-3">
              <GoodreadsWidget theme="light" headerText="Echoes around Book One" />
            </div>
          </div>

          <div className={`${sectionSurfaceClass} p-6`}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#7c6250]">Outer Water</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2f1f14]">Elsewhere</h2>
            <div className="mt-4 space-y-3">
              {outerChannels.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start justify-between gap-4 rounded-[1.3rem] border border-[#8e765b]/18 bg-white/60 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#ad7a4b]/45 hover:shadow-[0_14px_28px_rgba(33,20,10,0.12)]"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#312115]">{item.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#4f3c30]">{item.body}</p>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#7a4f30] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 px-2">
        <SubscribeSection siteVariant="author" />
      </section>
    </main>
  );
}
