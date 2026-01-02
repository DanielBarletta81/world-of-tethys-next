'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LocationPlaceholder() {
  const params = useParams();
  const slug = params?.slug || 'unknown';

  return (
    <main className="min-h-screen bg-[#0c0a09] text-stone-200 p-8 pt-32">
      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Location Placeholder</p>
        <h1 className="text-4xl font-display">Location: {slug}</h1>
        <p className="text-stone-400">
          This location is not yet mapped. The path will illuminate once the Foundry records are restored.
        </p>
        <Link href="/" className="text-amber-400 underline">Return to Hub</Link>
      </div>
    </main>
  );
}
