export default function FaunaPage() {
  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-serif text-stone-200">Fauna Registry</h2>
        <p className="mt-2 text-sm text-stone-500">Selected field entries. Non‑exhaustive.</p>
      </div>

      <div className="border border-stone-800 bg-black/40 p-5 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Entry</div>
        <div className="text-sm text-stone-300">Subject: Titan‑Walker (Amber Plains)</div>
        <div className="text-sm text-stone-500">
          Status: Migratory. Bond response observed under low stress.
        </div>
      </div>

      <div className="border border-stone-800 bg-black/40 p-5 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Entry</div>
        <div className="text-sm text-stone-300">Subject: Ash‑Wing Sentinel (Mt. Cinder)</div>
        <div className="text-sm text-stone-500">
          Status: Volcanic perimeter. Flight paths correlate with ashfall pulses.
        </div>
      </div>
    </section>
  );
}
