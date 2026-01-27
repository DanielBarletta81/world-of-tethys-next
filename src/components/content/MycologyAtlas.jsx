'use client';

import { useEffect, useState } from 'react';
import { FlaskConical, Leaf, Sparkles } from 'lucide-react';

export default function MycologyAtlas() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/mycology/entries');
        if (!res.ok) throw new Error('Mycology archive offline');
        const data = await res.json();
        if (!cancelled) setEntries(Array.isArray(data.entries) ? data.entries : []);
      } catch (err) {
        if (!cancelled) setError('Mycology archive unavailable.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono">
          <Leaf size={14} />
          Mycology Field Bridge
        </div>
        <div className="text-[10px] text-emerald-700 uppercase tracking-widest">
          Real-world analogs | Ravel remedies
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-emerald-900/40 bg-black/40 p-6 text-emerald-300 text-sm">
          Listening to the spore network...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-900/10 p-6 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="rounded-lg border border-stone-800 bg-black/40 p-6 text-stone-400 text-sm">
          No mycology entries yet. Seed the archive to populate this panel.
        </div>
      )}

      <div className="space-y-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-emerald-900/40 bg-[#070b0a] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
          >
            <div className="flex flex-col md:flex-row">
              {entry.image && (
                <div className="md:w-1/3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.image}
                    alt={entry.imageAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-6">
                <h3 className="text-xl font-serif text-emerald-100 mb-4">
                  {entry.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-400 font-mono">
                      <FlaskConical size={12} />
                      Real-world analog
                    </div>
                    {entry.realWorld.commonName && (
                      <div className="text-sm text-cyan-200 font-semibold">
                        {entry.realWorld.commonName}
                      </div>
                    )}
                    <p className="text-sm text-cyan-100/80 leading-relaxed">
                      {entry.realWorld.analog}
                    </p>
                    {entry.realWorld.taxonomyNotes && (
                      <p className="text-[11px] text-cyan-500">
                        Taxonomy: {entry.realWorld.taxonomyNotes}
                      </p>
                    )}
                    {entry.realWorld.estuaryObservations && (
                      <p className="text-[11px] text-cyan-600">
                        Estuary: {entry.realWorld.estuaryObservations}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 bg-black/30 border border-emerald-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-400 font-mono">
                      <Sparkles size={12} />
                      Ravel remedy
                    </div>
                    <p className="text-sm text-emerald-100/90 leading-relaxed italic">
                      {entry.ravel.remedy}
                    </p>
                    {entry.ravel.notes && (
                      <p className="text-[11px] text-emerald-400">
                        {entry.ravel.notes}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-[10px] text-emerald-500 uppercase tracking-widest">
                      {entry.ravel.bioluminescent !== null && (
                        <span>
                          {entry.ravel.bioluminescent ? 'Bioluminescent' : 'Non-luminescent'}
                        </span>
                      )}
                      {entry.ravel.luminescenceCycle && (
                        <span>Cycle: {entry.ravel.luminescenceCycle}</span>
                      )}
                      {entry.ravel.sporeVector && (
                        <span>Vector: {entry.ravel.sporeVector}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// World of Tethys || D.C. Barletta
