import Link from 'next/link';
import { getSiteVariantFromConfig } from '@/lib/site-variant';
import { cdn } from '@/lib/cdn';
import { HERO_IMAGE_URLS } from '@/lib/site-assets';

export const metadata = {
  title: 'The Architecture of Energy Flow | Natural History',
  description:
    'Producer, consumer, decomposer — the trophic cascade that sustains a greenhouse world. But certain nodes in the web defy placement: relict species, anachronistic survivors, lineages that predate the Triassic rebound.',
};

export default function FoodWebPage() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';

  return (
    <main 
      className="relative mx-auto max-w-5xl px-6 py-16"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.88), rgba(5,4,3,0.92)), url(${HERO_IMAGE_URLS.foodWeb})`,
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
          Natural History • Ecosystem
        </p>

        <h1 className="mt-4 font-tethys-volcanic text-5xl text-stone-50">
          The Architecture of Energy Flow
        </h1>

        <p className="lead text-lg text-stone-300">
          Every ecosystem is a network of dependencies: producers capture sunlight,
          herbivores consume the producers, predators consume the herbivores, and
          decomposers reclaim the dead. Energy flows upward through trophic levels,
          diminishing at each transfer, until only the apex predators remain — and
          even they eventually feed the soil.
        </p>

        <h2 className="text-stone-200">Primary Producers</h2>
        <p>
          In the Cretaceous, photosynthesis was abundant but not always efficient.
          Cycads, conifers, and ferns captured light through needle-like leaves or
          broad fronds, optimizing for either water retention or light interception
          but rarely both.
        </p>
        <p>
          Angiosperms changed that equation. With flat, broad leaves and faster growth
          rates, they could exploit marginal niches — riverbanks, disturbed soils,
          fire-prone grasslands — and outcompete slower-growing competitors. By the
          mid-Cretaceous, they were reshaping the lowland canopy.
        </p>
        <p>
          But in the coastal ranges, the Ironwoods remained dominant. Their strategy
          was not speed but endurance: slow growth, dense wood, and root systems that
          penetrated deep into bedrock, accessing water reserves unavailable to
          other plants.
        </p>

        <h2 className="text-stone-200">Herbivores and the Pressure Cascade</h2>
        <p>
          Herbivory is not passive grazing. It is evolutionary warfare. Plants evolve
          toxins, thorns, and tannins to deter consumption. Herbivores evolve gut
          bacteria, detoxification enzymes, and behavioral strategies to overcome
          defenses.
        </p>
        <p>
          Sauropods consumed cycads by the ton, relying on gastroliths to grind fibrous
          material and microbial fermentation to extract nutrients. Hadrosaurs specialized
          in angiosperms, using dental batteries to process tough leaves and stems.
          Ceratopsians defended nesting grounds with horns and frills, not just against
          predators but against rival herds competing for the same browse.
        </p>
        <p>
          And yet, no herbivore touched the Ironwoods. Not for lack of access. The groves
          were well within migratory ranges. The foliage was abundant. But every Cambrian
          observation recorded the same pattern: herbivores avoided the groves, even
          during drought when other food sources were scarce.
        </p>

        <h2 className="text-stone-200">Predators and the Apex Paradox</h2>
        <p>
          Apex predators regulate herbivore populations, preventing overgrazing and
          maintaining plant diversity. But they are also the most vulnerable to
          disruption: low population densities, slow reproduction, and high caloric
          demands make them the first to collapse when prey abundance declines.
        </p>
        <p>
          Tyrannosaurs, allosaurs, and other large theropods occupied the apex tier,
          but their dominance was not absolute. Pterosaurs competed for carrion.
          Pack-hunting dromaeosaurs targeted juveniles. And in coastal regions,
          crocodilians ambushed terrestrial prey at water crossings.
        </p>
        <p>
          Cambrian scouts documented predator distributions carefully: where the large
          theropods hunted, what they avoided, and when they migrated. Over time, a
          pattern emerged: predators avoided the Ironwood Groves not because herbivores
          sheltered there, but because nothing did.
        </p>

        <h2 className="text-stone-200">Decomposers and the Return Loop</h2>
        <p>
          Energy does not end with death. It recycles. Bacteria, fungi, and invertebrates
          break down organic matter, releasing nutrients back into the soil. Without
          decomposers, ecosystems would choke on their own waste.
        </p>
        <p>
          But decomposition is not universal. Some materials resist breakdown: lignin,
          keratin, chitin, and the sap-rich wood of the Ironwoods. Fungi that colonized
          Ironwood deadfall produced fruiting bodies unlike any other species — and
          when analyzed, the spores matched the Veil Spore from the groves.
        </p>
        <p className="italic text-stone-400">
          "We placed a freshly cut Ironwood log in a controlled decay study. After six
          months, no fungal colonization. After twelve months, no bacterial decomposition.
          After eighteen months, we introduced Veil Spore cultures. Within 48 hours,
          the log was 30% decomposed."
        </p>

        <h2 className="text-stone-200">Nodes That Don't Fit</h2>
        <p>
          In a stable ecosystem, every species occupies a trophic level. But in Tethys,
          certain lineages defied placement:
        </p>
        <ul>
          <li>
            The Ironwoods, which produce no flowers, attract no herbivores, and decompose
            only in the presence of a fungus that predates angiosperms.
          </li>
          <li>
            The Veil Spore, which colonizes no other substrate and fruits only in groves
            that herbivores avoid.
          </li>
          <li>
            The glass rays, which filter-feed in regions where ancient land once stood
            and exhibit morphologies unchanged since the Permian.
          </li>
          <li>
            The deep-shelf ammonites, which do not evolve, do not diversify, and persist
            across extinction events that eliminated 96% of marine species.
          </li>
        </ul>
        <p>
          These are not relict species. Relicts decline. These lineages do not decline.
          They occupy specific niches, they interact with specific substrates, and they
          trace back — always — to conditions that existed before the Triassic rebound.
        </p>
        <p>
          Before the world recovered from the Permian Extinction.
        </p>

        <h2 className="text-stone-200">The Unanswered Question</h2>
        <p>
          Cambrian ecologists do not use the term "living fossil." They prefer "temporal
          anachronism" or "phylogenetic discontinuity." But the scholars in the Archive's
          restricted wing use a different term:
        </p>
        <p className="text-xl italic text-amber-300/90">
          "Permian survivors."
        </p>
        <p>
          Not survivors of the extinction. Survivors of the world that preceded it.
        </p>
        <p>
          And if that is true — if these lineages are not Cretaceous natives but
          Permian refugees — then the question is not how they survived.
        </p>
        <p>
          The question is: what are they waiting for?
        </p>

        <hr className="border-stone-700" />

        <p className="text-sm text-stone-500">
          <strong>Further Reading:</strong> For trophic cascade theory and energy
          flow modeling, see Polis & Winemiller (1996). For Cambrian ecological
          anomalies and the "temporal anachronism" documentation, consult Archive
          Codex XI, restricted access.
        </p>
      </article>
    </main>
  );
}
