export default function FracturesPage() {
  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-serif text-stone-200">Fracture Ledger</h2>
        <p className="mt-2 text-sm text-stone-500">Structural failures, ash events, and hazard shifts.</p>
      </div>

      <div className="border border-stone-800 bg-black/40 p-5 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Event</div>
        <div className="text-sm text-stone-300">Mt. Cinder: Ash Pulse</div>
        <div className="text-sm text-stone-500">
          Status: Elevated. Canopy drift corridors reduced by 12%.
        </div>
      </div>

      <div className="border border-stone-800 bg-black/40 p-5 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Event</div>
        <div className="text-sm text-stone-300">Root Tunnel Collapse</div>
        <div className="text-sm text-stone-500">
          Status: Partial. Ironwood–Mystic transit narrowed to single span.
        </div>
      </div>
    </section>
  );
}
