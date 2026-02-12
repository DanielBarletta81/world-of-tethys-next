export default function FloraPage() {
  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-serif text-stone-200">Flora Archive</h2>
        <p className="mt-2 text-sm text-stone-500">Abridged samples from canopy and rot layers.</p>
      </div>

      <div className="border border-stone-800 bg-black/40 p-5 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Entry</div>
        <div className="text-sm text-stone-300">Specimen: Ironwood Crown Resin</div>
        <div className="text-sm text-stone-500">
          Status: Stable. Used in Sky City spire seals.
        </div>
      </div>

      <div className="border border-stone-800 bg-black/40 p-5 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Entry</div>
        <div className="text-sm text-stone-300">Specimen: Mystic Spore Bloom</div>
        <div className="text-sm text-stone-500">
          Status: Adaptive. Emits low‑frequency hum during root exchange.
        </div>
      </div>
    </section>
  );
}
