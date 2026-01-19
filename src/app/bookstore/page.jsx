"use client";

import Link from "next/link";
import Image from "next/image";
import BreadcrumbTrail from "@/components/layout/BreadcrumbTrail";
import PrimaryNav from "@/components/layout/navigation/PrimaryNav";
import CelestialDisk from "@/components/CelestialDisk";
import { cdn } from "@/lib/cdn";

const BOOKSTORE_BREADCRUMB = [
  { label: 'Home', href: '/' },
  { label: 'Bookstore', href: '/bookstore', current: true }
];

export const dynamic = "force-dynamic";

const BOOKS = [
  {
    id: "sky-city",
    title: "Sky City of Tethys",
    format: "Kindle + Paperback",
    description:
      "A volcanic sky-archipelago opens after the seal breaks. Follow the first signal-bearers as they map the wind-forged cities and the war-horned gates that guard them.",
    coverUrl: cdn("/img/books/book1-cover.png"),
    amazonLink: "https://www.amazon.com/dp/B0G572X42L"
  },
  {
    id: "ravel",
    title: "Unraveling Ravel",
    format: "Kindle",
    description:
      "A thread of memory pulls the expedition into the root-bound deep. Factions clash, the weave tightens, and the pulse of the world begins to answer back.",
    coverUrl: cdn("/img/books/ravel-kindle.png"),
    amazonLink: "https://www.amazon.com/dp/B0GB5CR6HX",
    paperbackLink: "https://www.amazon.com/dp/B0GB9D9H3Z"
  },
  {
    id: "roots-remember",
    title: "What the Roots Remember",
    format: "Kindle",
    description:
      "The archive awakens and the biolum forests whisper their lineage. A chorus of ancient watchers reveals the price of remembrance in the Age of Tethys.",
    coverUrl: cdn("/img/books/roots-remember.png"),
    amazonLink: "https://www.amazon.com/dp/B0G672S7YC"
  }
];

const Card = ({ book }) => (
  <article className="group relative overflow-hidden rounded-2xl border border-amber-600/40 bg-[#0e0b09] shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,60,0.15),transparent_50%),radial-gradient(circle_at_90%_10%,rgba(255,90,20,0.12),transparent_55%)] opacity-70 pointer-events-none" />
    <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(18,12,10,0.9),rgba(6,5,4,0.85))] pointer-events-none" />
    <div className="absolute -inset-6 bg-[radial-gradient(circle,rgba(255,112,0,0.35),transparent_65%)] opacity-50 blur-2xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

    <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-6 p-6">
      <div className="relative mx-auto w-full max-w-[320px]">
        <div className="absolute -inset-4 bg-[radial-gradient(circle,rgba(255,136,0,0.45),transparent_70%)] opacity-60 blur-2xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
        <div className="relative overflow-hidden rounded-xl border border-amber-600/50 bg-[#14110f] p-2 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/35 pointer-events-none" />
          <Image
            src={book.coverUrl}
            alt={book.title}
            width={640}
            height={960}
            className="relative z-10 h-auto w-full rounded-lg object-cover shadow-[0_14px_24px_rgba(0,0,0,0.55)] group-hover:-translate-y-1 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400/80 font-mono">
          {book.format}
        </p>
        <h2 className="text-3xl md:text-4xl font-display text-[#f6eee2] leading-tight">
          {book.title}
        </h2>
        <p className="text-sm md:text-base text-stone-300/90 leading-relaxed">
          {book.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href={book.amazonLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-amber-500/70 bg-[#261710] text-[#f6eee2] uppercase tracking-[0.2em] text-[10px] font-mono rounded-sm shadow-[0_0_25px_rgba(255,120,60,0.25)] hover:border-amber-200 transition"
          >
            View on Amazon
          </Link>
          {book.paperbackLink ? (
            <Link
              href={book.paperbackLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-stone-600/70 bg-[#140f0b] text-stone-200 uppercase tracking-[0.2em] text-[10px] font-mono rounded-sm hover:border-amber-200 transition"
            >
              Paperback
            </Link>
          ) : null}
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500/70 font-mono">
            Tethys Chronicle
          </span>
        </div>
      </div>
    </div>
  </article>
);

export default function BookstorePage() {

  return (
    <main className="site-shell relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <div
          className="absolute -top-28 -left-24 h-[520px] w-[520px] bg-contain bg-no-repeat opacity-25 mix-blend-screen"
          style={{ backgroundImage: `url(${cdn("/icons/creator_seal_coin.svg")})` }}
        />
        <div
          className="absolute -bottom-28 -right-28 h-[600px] w-[600px] bg-contain bg-no-repeat opacity-20 mix-blend-screen"
          style={{ backgroundImage: `url(${cdn("/symbols/tethys-seal.png")})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,120,60,0.12),transparent_60%)]" />
      </div>
      <PrimaryNav className="mb-4" />
      <BreadcrumbTrail trail={BOOKSTORE_BREADCRUMB} className="mb-8" />
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400/80 font-mono">
              Chronicle Archive
            </p>
            <h1 className="text-4xl md:text-5xl font-display text-[#f6eee2]">
              World of Tethys Books
            </h1>
            <p className="text-sm text-[#e8dfcf]/80 max-w-2xl">
              The core trilogy, illuminated in full. Read the blurbs here and step into the chronicle when you are ready.
            </p>
          </div>
          <CelestialDisk label="Seal: Tethys Chronicle" className="hidden md:flex" />
        </div>
      </header>

      <section className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {BOOKS.map((book) => (
            <Card key={book.id} book={book} />
          ))}
        </div>
      </section>
    </main>
  );
}
// World of Tethys || D.C. Barletta
