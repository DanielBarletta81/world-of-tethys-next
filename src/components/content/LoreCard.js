import { loreCharacters, loreLocations, loreCreatures } from '@/lib/lore-seeds';
import { cdn } from '@/lib/cdn';

const allLore = [...loreCharacters, ...loreLocations, ...loreCreatures];

function resolveSeed(seedId) {
  if (!seedId) return null;
  return allLore.find((item) => item.id === seedId) || null;
}

export default function LoreCard({ title, type, excerpt, seedId }) {
  const seed = resolveSeed(seedId);
  const finalTitle = title || seed?.name;
  const finalType = type || seed?.tag || 'Lore';
  const finalExcerpt = excerpt || seed?.bio || seed?.blurb || seed?.hook || seed?.trait;
  const background = seed?.background || '';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-tethys-gold/50">
      {background ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center opacity-[0.15]" style={{ backgroundImage: `url(${background})` }} />
          <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundImage: `url(${cdn('/noise.svg')})`, opacity: 'var(--tethys-noise-opacity, 0.1)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.06), transparent 60%)', opacity: 'var(--tethys-fog-opacity, 0.14)' }} />
        </>
      ) : null}
      <div className="absolute top-0 right-0 h-12 w-12 border-t border-r border-tethys-gold/0 transition-all group-hover:border-tethys-gold/50" />
      <div className="relative z-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-tethys-gold/60">{finalType}</span>
        <h3 className="mt-2 font-serif text-2xl text-tethys-parchment transition-colors group-hover:text-tethys-gold">{finalTitle}</h3>
        <p className="mt-4 font-sans text-sm leading-relaxed text-gray-400">{finalExcerpt}</p>
      </div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
