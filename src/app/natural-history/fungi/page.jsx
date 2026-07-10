import Link from 'next/link';
import { getSiteVariantFromConfig } from '@/lib/site-variant';
import { cdn } from '@/lib/cdn';
import { HERO_IMAGE_URLS } from '@/lib/site-assets';

export const metadata = {
  title: 'Fungi: Kingdom of Decomposition | Natural History',
  description:
    'Mycorrhizal networks, wood-rot specialists, and the enigmatic Veil Spore — a fungal lineage that predates most flowering plants and may trace to a Permian origin no modern taxonomy can confirm.',
};

export default function FungiPage() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';

  return (
    <main 
      className="relative mx-auto max-w-5xl px-6 py-16"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.88), rgba(5,4,3,0.92)), url(${HERO_IMAGE_URLS.fungi})`,
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
          Natural History • Fungi
        </p>

        <h1 className="mt-4 font-tethys-volcanic text-5xl text-stone-50">
          Kingdom of Decomposition
        </h1>

        <p className="lead text-lg text-stone-300">
          Fungi do not photosynthesize. They do not hunt. They dissolve the dead
          and reclaim nutrients from what others discard. In a greenhouse world
          where biomass turnover is rapid and organic matter accumulates faster
          than it decays, fungi are not a peripheral kingdom — they are the
          infrastructure that prevents ecosystem collapse.
        </p>

        <h2 className="text-stone-200">The Mycorrhizal Web</h2>
        <p>
          Beneath every forest floor, an unseen network extends: fungal hyphae
          wrapping around root tips, exchanging water and phosphorus for sugars
          synthesized by the plant. The partnership is ancient — older than land
          plants themselves — and it remains the foundation of terrestrial ecology.
        </p>
        <p>
          Cambrian agronomists understood this early. Crops planted without fungal
          inoculation failed in Tethys soils. The native mycorrhizae were too
          aggressive, too adapted to high-nutrient cycling. Imported strains from
          Earth-analogue regions withered within weeks.
        </p>
        <p>
          The solution was negotiation: controlled burns to reset soil chemistry,
          deliberate spore seeding from native mushrooms, and rotational fallows
          that allowed the fungal network to stabilize. Agriculture on Tethys was
          not farming. It was diplomacy with the soil.
        </p>

        <h2 className="text-stone-200">Wood-Rot Specialists</h2>
        <p>
          Dead wood does not disappear quickly in the Cretaceous. Without
          specialized decomposers, fallen logs would accumulate for decades,
          creating fuel loads that turned seasonal fires into catastrophic burns.
        </p>
        <p>
          Enter the wood-rot fungi: white rot, brown rot, and the soft rot
          specialists that colonize waterlogged timber. These organisms possess
          enzymes capable of breaking down lignin — the tough polymer that makes
          wood resistant to decay. Without them, forests would choke on their own
          dead.
        </p>
        <p>
          Cambrian scouts learned to read fungal fruiting patterns like weather
          signs: clusters of shelf fungi meant structural weakness in overhead
          branches; dense puffball fields indicated recent fire; and the absence
          of fungi in otherwise healthy deadfall was a warning.
        </p>

        <h2 className="text-stone-200">The Veil Spore</h2>
        <p>
          And then there is the Veil Spore — a name assigned by Cambrian
          mycologists who could not classify it by any known phylogeny.
        </p>
        <p>
          It fruits only in the deep interior of the Ironwood Groves, producing
          delicate, translucent caps that dissolve within hours of exposure to
          sunlight. The spores themselves are microscopic, durable, and capable
          of remaining dormant for years — perhaps centuries.
        </p>
        <p>
          Chemical analysis revealed secondary metabolites that matched no
          known fungal lineage. Some compounds resembled alkaloids typically
          produced by plants; others were structurally similar to bacterial
          quorum-sensing molecules. It was as if the Veil Spore sat at a
          phylogenetic crossroads — neither fully fungal nor entirely its own
          kingdom.
        </p>
        <p className="italic text-stone-400">
          Archive notation from 116 CE: "Spores collected from the Third Grove
          refused to germinate under standard conditions. Attempts to culture on
          cellulose, lignin, and protein substrates all failed. One sample was
          buried in sterilized soil from the Permian Barrens. Germination occurred
          within 48 hours."
        </p>

        <h2 className="text-stone-200">Permian Origin, Again</h2>
        <p>
          The phrase recurs. Not as taxonomy. Not as geography. But as a
          temporal signal that refuses explanation.
        </p>
        <p>
          The Veil Spore predates the angiosperms. It may predate the conifers.
          And if the Archive's restricted notes are correct, it predates the
          Triassic rebound — which means it survived the Permian Extinction,
          the most catastrophic biotic collapse in Earth's history.
        </p>
        <p>
          How does a fungus survive when 96% of species do not? How does it
          remain unchanged for 180 million years? And why does it only grow
          where the Ironwoods grow?
        </p>
        <p>
          Cambrian scholars do not answer. They document, they measure, and
          they leave the groves undisturbed.
        </p>

        <hr className="border-stone-700" />

        <p className="text-sm text-stone-500">
          <strong>Further Reading:</strong> For mycorrhizal evolution and
          ecological function, see Smith & Read (2008). For Cambrian fungal
          surveys and the Veil Spore documentation gap, consult Archive
          Codex IX, restricted access.
        </p>
      </article>
    </main>
  );
}
