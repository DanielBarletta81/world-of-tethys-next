import Link from 'next/link';

export const metadata = {
  title: 'D.C. Barletta - Author of World of Tethys',
  description:
    'About author D.C. Barletta, creator of World of Tethys. Explore his biology background, natural history interests, and approach to prehistoric fiction storytelling.',
  keywords: ['about dc barletta', 'science fiction author', 'prehistoric fiction', 'natural history storytelling'],
};

export default function AboutDcBarlettaPage() {
  const worldSiteUrl = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';
  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'D.C. Barletta',
    url: 'https://dcbarletta.com/about-dc-barletta',
    jobTitle: 'Author',
    knowsAbout: ['Prehistoric fiction', 'Natural history storytelling', 'Science fiction'],
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-24 text-stone-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }} />
      <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">D.C. Barletta - Author of World of Tethys</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        D.C. Barletta is a science fiction author focused on prehistoric fiction, environmental
        tension, and natural history storytelling. His work combines narrative momentum with
        evolutionary logic, asking how civilizations might adapt under deep-time ecological
        pressures.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Biology and Natural History Background</h2>
        <p className="mt-3 text-stone-300 leading-relaxed">
          The World of Tethys series is shaped by biology, ecological systems, and behavior under
          selective pressure. Predator dynamics, migration routes, and resource cycles inform both
          setting design and plot structure.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Inspiration for World of Tethys</h2>
        <p className="mt-3 text-stone-300 leading-relaxed">
          Inspiration comes from paleontology, volcanic landscapes, and the tension between human
          intent and environmental reality. The goal is a living world where place, species, and
          climate drive conflict as strongly as any individual character.
        </p>
      </section>

      <p className="mt-12 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
      <p className="mt-3 text-stone-200">
        Explore the immersive world archive at <a href={worldSiteUrl} target="_blank" rel="noreferrer" className="underline hover:text-orange-300">worldoftethys.com</a>.
      </p>
      <p className="mt-3 text-stone-200">
        Visit the new <Link href="/author" className="underline hover:text-orange-300">Author Hub</Link> and <Link href="/world" className="underline hover:text-orange-300">World Hub</Link>.
      </p>
    </main>
  );
}
