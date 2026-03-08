import Link from 'next/link';

export const metadata = {
  title: 'Could Humans Survive the Age of Dinosaurs?',
  description:
    'A natural history analysis of whether humans could survive in dinosaur-era ecosystems and what adaptation would require.',
};

export default function CouldHumansSurvivePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Could Humans Survive the Age of Dinosaurs?</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Human survival in Mesozoic ecosystems would depend less on physical strength and more on
        information, mobility, and shelter strategy. Predator scale and unfamiliar pathogens would
        punish static settlements. In practical terms, survival would require early-warning systems,
        elevated refuges, and strict route timing around migration corridors.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        The thought experiment is central to prehistoric fiction because it stresses what culture can
        do under environmental pressure. World of Tethys uses this same logic: ecological feedback
        loops shape social choices, and survival depends on reading the landscape correctly.
      </p>
      <p className="mt-8 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </article>
  );
}
