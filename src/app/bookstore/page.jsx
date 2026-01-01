"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { catalogItems } from "@/data/catalog";

export default function BookstorePage() {
  const books = catalogItems.filter((item) => item.type === "book");
  const extras = catalogItems.filter((item) => item.type !== "book");

  const Card = ({ item }) => (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-[#120d0b] border border-[#ff8c50]/30 shadow-[10px_12px_30px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(255,120,60,0.08)] rounded-xl overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,60,0.08),transparent_40%),url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-70 pointer-events-none" />
      <div className="relative p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="aspect-[4/5] w-full bg-[#1a120e] border border-[#ff8c50]/20 rounded-lg overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center opacity-90"
            style={{ backgroundImage: `url(${item.cover})` }}
            aria-label={item.title}
          />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffb87a] font-mono">{item.format}</p>
          <h2 className="text-2xl font-display text-[#f6eee2] leading-tight">{item.title}</h2>
          {item.subtitle && <p className="text-sm text-[#e8dfcf]/80">{item.subtitle}</p>}
          <div className="flex items-center gap-3 text-[#ffdcc3] text-sm">
            {item.price && <span className="font-mono bg-[#1f150f] px-2 py-1 rounded border border-[#ff8c50]/40">{item.price}</span>}
            {item.boost && <span className="text-[11px] font-mono text-[#ffb87a]">{item.boost}</span>}
          </div>
          <div className="pt-2">
            <Link
              href={item.url || "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 border border-[#ff8c50]/60 bg-[#261710] text-[#f6eee2] rounded shadow-[0_0_20px_rgba(255,120,60,0.2)] hover:border-[#ffc48f] transition"
            >
              Visit Listing
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );

  return (
    <main className="site-shell">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#ffb87a] font-mono">Supply Drop</p>
        <h1 className="text-4xl font-display text-[#f6eee2]">Bookstore & Signals</h1>
        <p className="text-sm text-[#e8dfcf]/80">Secure ebooks, paperbacks, and signals. Purchases aren’t required but illuminate the path.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-display text-[#f6eee2]">Books</h2>
        <div className="grid grid-cols-1 gap-6">
          {books.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-xl font-display text-[#f6eee2]">Audio & Downloads</h2>
        <div className="grid grid-cols-1 gap-6">
          {extras.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
