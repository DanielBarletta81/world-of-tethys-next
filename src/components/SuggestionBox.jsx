'use client';

import { useState } from 'react';
import { useExpedition } from '@/lib/useExpedition';

export default function SuggestionBox() {
  const { inventory } = useExpedition();
  const isUnlocked = inventory.includes('ArchitectKey');
  const [submitted, setSubmitted] = useState(false);

  if (!isUnlocked) {
    return (
      <div className="artifact-card p-6 opacity-60 border-dashed border-ancient-ink/30 grayscale">
        <h3 className="font-display text-lg mb-2">Architect&apos;s Drop Box</h3>
        <p className="text-xs font-mono">[LOCKED] — Requires &apos;ArchitectKey&apos; (45m Session Resonance)</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="artifact-card p-6 border-2 border-ancient-gold/50 shadow-[0_0_30px_rgba(122,58,35,0.25)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-xl text-ancient-ink">Proposal Uplink</h3>
        <span className="px-2 py-1 bg-ancient-gold text-white text-[9px] font-mono uppercase">Access Granted</span>
      </div>
      <p className="text-sm mb-4 leading-relaxed">
        You have observed enough to build. Submit your theory for the next epoch.
      </p>
      {submitted ? (
        <p className="text-sm font-mono text-ancient-accent">Transmission queued. The archive considers your design.</p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <textarea
            className="w-full bg-white/80 p-3 border border-ancient-ink/20 font-serif"
            placeholder="Describe your proposed mutation..."
            required
          />
          <button className="w-full py-2 border border-ancient-accent text-ancient-accent font-mono text-xs uppercase hover:bg-ancient-accent hover:text-white transition-all">
            Transmit to D.C. Barletta
          </button>
        </form>
      )}
    </div>
  );
}
