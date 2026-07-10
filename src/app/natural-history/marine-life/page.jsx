import Link from 'next/link';
import { getSiteVariantFromConfig } from '@/lib/site-variant';
import { cdn } from '@/lib/cdn';
import { HERO_IMAGE_URLS } from '@/lib/site-assets';

export const metadata = {
  title: 'Marine Life: Tethys Beneath the Surface | Natural History',
  description:
    'Mosasaurs, pliosaurs, ammonites, and the glass rays of the continental shelf. An ocean layered by oxygen zones, carbonate chemistry, and predator hierarchies.',
};

export default function MarineLifePage() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';

  return (
    <main 
      className="relative mx-auto max-w-5xl px-6 py-16"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.88), rgba(5,4,3,0.92)), url(${HERO_IMAGE_URLS.marineLife})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <article className="prose prose-invert prose-stone max-w-none">
        <Link
          href="/natural-history"
          className="mb-8 inline-block text-xs uppercase tracking-[0.2em] text-amber-300/70 hover:text-amber-300"
        >
          ← Natural History
        </Link>

        <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">
          Natural History • Marine Life
        </p>

        <h1 className="mt-4 font-tethys-volcanic text-5xl text-stone-50">
          Tethys Beneath the Surface
        </h1>

        <p className="lead text-lg text-stone-300">
          The Tethys Ocean was not a single habitat. It was a vertical stack of
          ecological zones, each defined by light, oxygen, temperature, and pressure.
          The surface teemed with plankton and predators. The thermocline hosted
          opportunistic hunters. The abyssal plains were silent, anoxic, and largely
          uninhabited — except for the lineages that refused to die.
        </p>

        <h2 className="text-stone-200">Surface Predators</h2>
        <p>
          Mosasaurs ruled the open water: sleek, fast, and equipped with double-hinged
          jaws that could swallow prey whole. <em>Tylosaurus</em>, <em>Mosasaurus</em>,
          and <em>Platecarpus</em> patrolled the coastlines, ambushing sea turtles,
          fish, and smaller marine reptiles.
        </p>
        <p>
          But they were not the apex. That role belonged to the pliosaurs — short-necked
          plesiosaurs with skulls the size of small boats and bite forces exceeding
          modern orcas. <em>Kronosaurus</em> could crush ammonite shells with a single
          snap. Cambrian navigators avoided deep channels during calving season, when
          pliosaurs gathered to hunt newborn mosasaurs.
        </p>

        <h2 className="text-stone-200">The Ammonite Archive</h2>
        <p>
          Ammonites were everywhere: from thumb-sized juveniles to coiled giants three
          meters across. Their diversity was staggering — ribbed, smooth, spined,
          uncoiled — each morphology reflecting a different ecological niche.
        </p>
        <p>
          Cambrian paleontologists treated them as temporal markers. Ammonite species
          evolved quickly and spread widely, making them ideal index fossils. If you
          found a particular ammonite, you could date the surrounding strata to within
          a few hundred thousand years.
        </p>
        <p>
          But there were exceptions. Certain ammonite lineages — small, unornamented,
          and restricted to deep shelf environments — showed no morphological change
          across tens of millions of years. They were called "living fossils" in
          Cambrian field notes, though the term was considered imprecise.
        </p>
        <p className="italic text-stone-400">
          "We recovered a specimen from a depth of 340 meters, encased in sediment
          dated to the late Aptian. The morphology matched shells recovered from
          Permian-age deposits in the southern barrens. Either the dating is wrong,
          or this lineage has persisted unchanged for 130 million years."
        </p>

        <h2 className="text-stone-200">The Glass Rays</h2>
        <p>
          The continental shelf — where sunlight reached the seafloor but nutrients
          were scarce — hosted a guild of filter feeders and scavengers. Among them:
          the glass rays, so named for their translucent pectoral fins and bioluminescent
          markings.
        </p>
        <p>
          They drifted along the shelf edge, wings undulating in slow, hypnotic pulses.
          Their diet consisted of particulate organic matter: dead plankton, fecal pellets,
          and decomposing jellyfish. They were harmless, elegant, and utterly indifferent
          to Cambrian observation.
        </p>
        <p>
          But their distribution was puzzling. Glass rays occurred only in regions where
          the seafloor exhibited specific mineral signatures: high concentrations of
          silica, phosphorus, and rare earth elements. Regions that, according to
          geological surveys, had once been dry land — during the Permian.
        </p>

        <h2 className="text-stone-200">Permian Ghosts</h2>
        <p>
          The term appears in naval logs, taxonomic notes, and bathymetric surveys.
          Not "Permian origin" this time, but "Permian ghosts" — lineages that
          should not exist but do.
        </p>
        <p>
          The ammonite that does not evolve. The ray that only inhabits ancient
          land. The deep-shelf brachiopods that match Permian fossils too closely
          to be convergent evolution.
        </p>
        <p>
          Cambrian scholars do not call them survivors. Survivors adapt. These
          lineages do not adapt. They persist, unchanged, as if the intervening
          180 million years never occurred.
        </p>
        <p>
          And when submersible teams explored the deepest trenches — below the
          oxygen minimum zone, below the carbonate compensation depth — they
          found sediment cores containing spores. Fungal spores. In anoxic,
          lightless, nutrient-poor mud.
        </p>
        <p className="italic text-stone-400">
          "The ocean remembers what the land forgot."
        </p>

        <hr className="border-stone-700" />

        <p className="text-sm text-stone-500">
          <strong>Further Reading:</strong> For Cretaceous marine reptile ecology,
          see Everhart (2005). For ammonite biostratigraphy and the "living fossil"
          problem, consult Archive Codex X, restricted access.
        </p>
      </article>
    </main>
  );
}
