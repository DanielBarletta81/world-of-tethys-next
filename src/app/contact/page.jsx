import Link from 'next/link';

export const metadata = {
  title: 'Contact D.C. Barletta',
  description: 'Contact page for author D.C. Barletta and World of Tethys inquiries.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14 md:py-20 text-[#2a1f17]">
      <section className="rounded-3xl border border-amber-900/30 bg-[linear-gradient(145deg,#fbf6ee,#e9dac5)] p-8 shadow-[0_20px_46px_rgba(35,20,8,0.14)] md:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Contact</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-tethys-volcanic text-[#2f1f14]">Contact</h1>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          For media, speaking, and reader inquiries, use your preferred contact channel for D.C. Barletta.
        </p>
        <p className="mt-4 text-[#3f3024]">You can also follow updates via the blog and YouTube channel.</p>
      </section>
      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Media and Reader Resources</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/press-kit"
            className="rounded-full border border-[#8d5b36] bg-[#f2e2cd] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3a2617] transition hover:-translate-y-0.5 hover:bg-[#e8d2b7]"
          >
            Press Kit
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
          >
            Blog
          </Link>
        </div>
      </section>
    </main>
  );
}
