'use client';

import Link from 'next/link';

export default function UnknownCreature() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-stone-200 p-8 pt-32">
      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Bestiary</p>
        <h1 className="text-4xl font-display">Unknown Signal</h1>
        <p className="text-stone-400">
          The creature signature is garbled. Awaiting field report to classify and unlock this entry.
        </p>
        <Link href="/creatures" className="text-amber-400 underline">Return to Creatures</Link>
      </div>
    </main>
  );
}
