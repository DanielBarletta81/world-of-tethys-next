export default function SurveyPage() {
  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-serif text-stone-200">Chronological Survey</h2>
        <p className="mt-2 text-sm text-stone-500">
          Abridged intake. Measurements prioritized over narration.
        </p>
      </div>

      <div className="border border-stone-800 bg-black/40 p-5 space-y-3">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Subject</div>
        <div className="text-sm text-stone-300">Subject: Igzier</div>
        <div className="text-sm text-stone-400">
          Status: Active within Sky City perimeter. Classified bloodline variance under review.
        </div>
        <div className="text-sm text-stone-500">
          Behavioral note: Nonconforming decision patterns under pressure. Bonds with fauna recorded.
        </div>
      </div>

      <div className="border border-stone-800 bg-black/40 p-5 space-y-3">
        <div className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Protocol</div>
        <p className="text-sm text-stone-400">The archive does not persuade. It preserves.</p>
      </div>
    </section>
  );
}
