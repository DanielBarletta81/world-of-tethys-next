'use client';

import { useAudio } from '@/context/AudioContext';

export default function AudioUnlockOverlay() {
  const { requiresGesture, unlockAudio } = useAudio();

  if (!requiresGesture) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center pointer-events-none">
      <div className="mb-10 pointer-events-auto">
        <button
          onClick={unlockAudio}
          className="px-6 py-3 bg-[#11100f] text-stone-200 text-[11px] uppercase tracking-[0.3em] border border-stone-700/60 hover:border-stone-400 hover:text-white transition duration-500"
        >
          Awaken Sound
        </button>
      </div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
