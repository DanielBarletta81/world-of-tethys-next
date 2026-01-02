import { loreCharacters, loreLocations, loreCreatures } from '@/lib/lore-seeds';

const allLore = [...loreCharacters, ...loreLocations, ...loreCreatures];

function resolveSeed(seedId) {
  if (!seedId) return null;
  return allLore.find((item) => item.id === seedId) || null;
}

export default function LoreCard({ title, type, excerpt, seedId }) {
  const seed = resolveSeed(seedId);
  const finalTitle = title || seed?.name;
  const finalType = type || seed?.tag || 'Lore';
  const finalExcerpt = excerpt || seed?.blurb || seed?.hook || seed?.trait;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-tethys-gold/50">
      <div className="absolute top-0 right-0 h-12 w-12 border-t border-r border-tethys-gold/0 transition-all group-hover:border-tethys-gold/50" />
      <span className="text-[10px] uppercase tracking-[0.3em] text-tethys-gold/60">{finalType}</span>
      <h3 className="mt-2 font-serif text-2xl text-tethys-parchment transition-colors group-hover:text-tethys-gold">{finalTitle}</h3>
      <p className="mt-4 font-sans text-sm leading-relaxed text-gray-400">{finalExcerpt}</p>
    </div>
  );
}
