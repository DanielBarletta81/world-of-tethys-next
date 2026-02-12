'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import cdn from '@/lib/cdn';
import DeepTimeScene from '@/components/DeepTimeScene';

export default function Home() {
  const router = useRouter();
  const [recordOpen, setRecordOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#050403] text-stone-100 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <DeepTimeScene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-[#050403]" />
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{ backgroundImage: `url(${cdn('/noise.svg')})` }}
        />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-6xl text-stone-200 tracking-wide font-serif">
          World of Tethys
        </h1>
        <p className="mt-4 text-xs tracking-[0.4em] text-stone-500 uppercase font-mono">
          Chronological Survey Record
        </p>
        <p className="mt-2 text-sm text-stone-600">Estimated age: 111 million years</p>

        <button
          type="button"
          onClick={() => {
            setRecordOpen(true);
            router.push('/survey');
          }}
          className="mt-10 px-6 py-3 border border-stone-600 text-xs uppercase tracking-[0.35em] text-stone-200 hover:text-stone-100 hover:border-stone-400 transition-colors"
        >
          Open Record
        </button>
        {recordOpen ? (
          <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-stone-600">
            Record queued
          </p>
        ) : null}
      </main>
    </div>
  );
}
