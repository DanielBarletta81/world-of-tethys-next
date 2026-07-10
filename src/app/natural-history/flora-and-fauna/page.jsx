import Link from 'next/link';
import { getSiteVariantFromConfig } from '@/lib/site-variant';
import { cdn } from '@/lib/cdn';
import { HERO_IMAGE_URLS } from '@/lib/site-assets';

export const metadata = {
  title: 'Flora & Fauna of Tethys | Natural History',
  description:
    'The botanical and terrestrial architecture of the Cretaceous world — cycads, ferns, early angiosperms, and the enigmatic Ironwood lineages that carry markers of Permian origin.',
};

export default function FloraAndFaunaPage() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';

  return (
    <main 
      className="relative mx-auto max-w-5xl px-6 py-16"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.88), rgba(5,4,3,0.92)), url(${HERO_IMAGE_URLS.floraFauna})`,
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
          Natural History • Flora & Fauna
        </p>

        <h1 className="mt-4 font-tethys-volcanic text-5xl text-stone-50">
          The Green Architecture of Tethys
        </h1>

        <p className="lead text-lg text-stone-300">
          The terrestrial landscape of the mid-Cretaceous was not a primitive swamp awaiting
          evolutionary polish. It was a layered, competitive, and structurally sophisticated
          ecosystem — cycads anchoring the understory, ferns colonizing disturbed ground,
          and early angiosperms beginning their rapid diversification in marginal niches.
        </p>

        <h2 className="text-stone-200">The Lowland Canopy</h2>
        <p>
          Conifers — araucarias, podocarps, and the towering{' '}
          <em>Pehuenoides</em> — dominated the highlands. Their wood was dense,
          their seeds protected by thick scales. In wetter lowlands, tree ferns and
          cycads formed dense groves, their architecture optimized for high humidity
          and seasonal flooding.
        </p>
        <p>
          But the most aggressive colonizers were the angiosperms. Fast-growing,
          highly adaptable, and equipped with flowers that exploited insect pollination,
          they represented a new strategy: not durability, but speed.
        </p>

        <h2 className="text-stone-200">The Ironwood Groves</h2>
        <p>
          And then there were the Ironwoods. Distributed sparsely across the northern
          coastal ranges, these slow-growing hardwoods exhibited traits that troubled
          early Cambrian naturalists: wood density higher than any known conifer, leaf
          venation patterns that predated modern angiosperms, and a reproductive cycle
          that seemed to bypass flowering entirely.
        </p>
        <p>
          Chemical analysis of Ironwood sap revealed compounds no longer present in
          any living plant. Bark cores suggested ages exceeding 800 years — anomalous
          for a mid-Cretaceous ecosystem where disturbance events typically reset
          succession every few decades.
        </p>
        <p className="italic text-stone-400">
          The Cambrian Archive records only this: "The Ironwood does not colonize. It
          persists. Where it stands, it has always stood. Even fire does not erase it —
          the roots survive, the shoots return, and the grove remembers."
        </p>

        <h2 className="text-stone-200">Permian Origin</h2>
        <p>
          The phrase appears in three separate botanical surveys conducted between
          112 and 118 CE (Cambrian Standard). But no surveyor defines it. Is it
          taxonomic shorthand? A geographic reference to the Desert in Permia, far
          to the south? Or something else — a temporal marker that no one wishes to
          clarify?
        </p>
        <p>
          The Ironwoods remain. Their distribution has not changed in 400 years.
          And when Cambrian engineers needed a material that would not rot, burn,
          or yield to stone saws, they returned to the groves — carefully, quietly,
          and always with offerings left at the boundary.
        </p>

        <h2 className="text-stone-200">Terrestrial Fauna</h2>
        <p>
          The land was dense with life: hadrosaurs browsing cycad fronds,
          ceratopsians defending nesting grounds, and theropods tracking migratory
          herds across seasonal floodplains. But fauna followed flora — where the
          plants dictated water, soil, and shelter, the herbivores adapted, and
          the predators followed.
        </p>
        <p>
          Cambrian scouts learned quickly: avoid the Ironwood Groves. Not because
          of predators — the opposite. The groves were silent. No herbivores grazed
          there. No theropods hunted. Even insects seemed fewer.
        </p>
        <p>
          The Archive does not explain why. It only warns: "What grows in silence
          should be left to silence."
        </p>

        <hr className="border-stone-700" />

        <p className="text-sm text-stone-500">
          <strong>Further Reading:</strong> For analysis of Cretaceous angiosperm
          radiation, see Taylor & Taylor (2009). For Cambrian botanical surveys and
          the Ironwood documentation gap, consult Archive Codex VII, restricted access.
        </p>
      </article>
    </main>
  );
}
