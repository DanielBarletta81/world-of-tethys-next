import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpenText, Compass, Feather, Newspaper, ScrollText } from 'lucide-react';

const GOODREADS_PROFILE_URL = 'https://www.goodreads.com/author/show/63851248.D_C_Barletta';
const AMAZON_AUTHOR_URL = 'https://www.amazon.com/stores/D.C.-Barletta/author/B0G5LM24FM';
const WORLD_SITE_URL = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';

export const metadata = {
  title: 'Author | D.C. Barletta',
  description:
    'Author hub for D.C. Barletta with Book One, essays, press, and direct routes into Cambria and the wider World of Tethys.',
};

const primaryRoutes = [
  {
    title: 'Book One',
    description: 'The main series entry: synopsis, format links, reviews, and the current release frame.',
    href: '/world-of-tethys-book-1',
    imageSrc: '/img/books/book1-cover.png',
    imageAlt: 'World of Tethys Book One cover',
    cta: 'Open Book One',
    Icon: BookOpenText,
    external: false,
  },
  {
    title: 'About D.C. Barletta',
    description: 'Background, creative process, and the natural-history logic shaping the fiction.',
    href: '/about-dc-barletta',
    imageSrc: '/ray_smile.jpg',
    imageAlt: 'Portrait of D.C. Barletta',
    cta: 'Read the author profile',
    Icon: Feather,
    external: false,
  },
  {
    title: 'Essays and Updates',
    description: 'Writing around ecology, pressure, prehistoric imagination, and the ideas driving the project forward.',
    href: '/blog',
    imageSrc: '/img/watcher-eruption1.png',
    imageAlt: 'World of Tethys volcanic eruption visual',
    cta: 'Read essays',
    Icon: ScrollText,
    external: false,
  },
  {
    title: 'Press Kit',
    description: 'Fast access for media, podcasters, interview requests, and publishing context.',
    href: '/press-kit',
    imageSrc: '/img/plates/footer/footer-home-watcher.webp',
    imageAlt: 'Press kit visual',
    cta: 'Open press kit',
    Icon: Newspaper,
    external: false,
  },
];

const outsideChannels = [
  {
    title: 'worldoftethys.com',
    description: 'The larger world domain for atlas pages, Cambria fragments, and deeper in-world systems.',
    href: WORLD_SITE_URL,
    external: true,
  },
  {
    title: 'Amazon Author Page',
    description: 'Official Amazon storefront and author profile.',
    href: AMAZON_AUTHOR_URL,
    external: true,
  },
  {
    title: 'Goodreads Profile',
    description: 'Reader-side author profile and discovery shelf.',
    href: GOODREADS_PROFILE_URL,
    external: true,
  },
  {
    title: 'YouTube Channel',
    description: 'Trailers, shorts, and outward-facing World of Tethys media.',
    href: 'https://www.youtube.com/@WorldofTethys',
    external: true,
  },
];

const surfaceClass =
  'relative overflow-hidden rounded-[1.9rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(250,244,235,0.96),rgba(239,229,211,0.92))] shadow-[0_12px_28px_rgba(33,20,10,0.08)]';

const cardClass =
  'group relative overflow-hidden rounded-[1.65rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(242,232,216,0.92))] shadow-[0_10px_24px_rgba(33,20,10,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#ad7a4b]/45 hover:shadow-[0_18px_36px_rgba(33,20,10,0.14)]';

export default function AuthorHubPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 text-[#2a1f17] md:py-20">
      <section className={`${surfaceClass} px-8 py-8 md:px-10 md:py-10`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(118,181,175,0.16),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(185,119,66,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_22%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{
            backgroundImage: 'url(/img/map/tethys-atlas-clean.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Author Directory</p>
              <h1 className="mt-3 text-4xl font-tethys-volcanic text-[#2f1f14] md:text-6xl">
                Book, author, and world paths kept close together.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#3f3024] md:text-lg">
                This page serves as the short map of the author side: Book One, biography,
                essays, press, and a direct jump into the wider World of Tethys.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/world-of-tethys-book-1"
                className="rounded-full border border-[#6d4c36] bg-[#2f2219] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#f7eee2] transition hover:-translate-y-0.5 hover:bg-[#20160f]"
              >
                Book One First
              </Link>
              <Link
                href="/blog"
                className="rounded-full border border-[#7a8b8d]/30 bg-[#eef4f1] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#264041] transition hover:-translate-y-0.5 hover:bg-[#e3efea]"
              >
                Essays
              </Link>
              <a
                href={WORLD_SITE_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
              >
                World Site
              </a>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-[#8e765b]/18 bg-white/55 p-5 shadow-[0_14px_30px_rgba(33,20,10,0.08)]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#7c6250]">Where To Begin</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <BookOpenText className="mt-0.5 h-4 w-4 shrink-0 text-[#7a4f30]" />
                <p className="text-sm leading-relaxed text-[#4f3c30]">
                  <span className="font-semibold text-[#2f1f14]">New reader:</span> start with
                  Book One.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Feather className="mt-0.5 h-4 w-4 shrink-0 text-[#7a4f30]" />
                <p className="text-sm leading-relaxed text-[#4f3c30]">
                  <span className="font-semibold text-[#2f1f14]">Need author context:</span> use
                  the bio and essay pages.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[#7a4f30]" />
                <p className="text-sm leading-relaxed text-[#4f3c30]">
                  <span className="font-semibold text-[#2f1f14]">Want the deeper world:</span> go
                  to worldoftethys.com for the atlas, Cambria fragments, and deeper archive layers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Primary Routes</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#2f1f14]">What most visitors actually need</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-[#5a4638]">
            Use the author side for orientation, then cross into the world domain when you want the denser excavation.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {primaryRoutes.map((card) => {
            const Icon = card.Icon;
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
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#8e765b]/14 bg-white/60 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#7c6250]">
                      <Icon className="h-3.5 w-3.5" />
                      Route
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-[#312115] transition-colors group-hover:text-[#24170f]">
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
                  className={`${cardClass} p-6`}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={card.title} href={card.href} className={`${cardClass} p-6`}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className={`${surfaceClass} p-6`}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Why This Site Exists</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#2f1f14]">Author-first, but still clearly Tethys</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#4f3c30]">
            The author domain should explain the work quickly: who is writing it, where Book One
            begins, and where the larger Tethys material, including Cambria, keeps unfolding.
          </p>
          <div className="mt-5 rounded-[1.4rem] border border-[#8e765b]/18 bg-white/60 p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#7c6250]">Current Shape</p>
            <p className="mt-2 text-sm leading-relaxed text-[#4f3c30]">
              Book One stays in front. Essays and media support the author conversation. The world
              site remains the larger destination for maps, Cambria fragments, and natural-history depth.
            </p>
          </div>
        </div>

        <div className={`${surfaceClass} p-6`}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Outside Channels</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#2f1f14]">Use external platforms intentionally</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {outsideChannels.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[1.35rem] border border-[#8e765b]/18 bg-white/60 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#ad7a4b]/45 hover:shadow-[0_14px_28px_rgba(33,20,10,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#312115]">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#4f3c30]">{item.description}</p>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#7a4f30] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
