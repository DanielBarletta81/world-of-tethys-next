'use client';

import { useEffect, useState } from 'react';
import { fetchFungalProxy } from '@/lib/mycology-engine';
import { Leaf, Loader2, ExternalLink } from 'lucide-react';

export default function FungalProxyPanel() {
  const [specimens, setSpecimens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchFungalProxy();
      setSpecimens(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Mycology uplink failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="rounded-xl border border-emerald-900/50 bg-[#0a1310] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-900/40">
        <div className="flex items-center gap-2">
          <Leaf size={14} className="text-emerald-400" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-300">Mycology Uplink</span>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-[11px] uppercase tracking-[0.2em] px-3 py-1 border border-emerald-800 text-emerald-200 rounded-sm hover:border-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Sync…' : 'Refresh'}
        </button>
      </div>

      {error && <p className="p-4 text-sm text-rose-400">{error}</p>}
      {loading && (
        <div className="p-6 flex items-center gap-2 text-emerald-300 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Listening to spores…
        </div>
      )}

      <div className="divide-y divide-emerald-900/30">
        {specimens.map((item) => (
          <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              {item.realWorld.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.realWorld.imageUrl}
                  alt={item.realWorld.commonName}
                  className="w-full h-32 object-cover rounded border border-emerald-900/40"
                />
              ) : (
                <div className="w-full h-32 rounded border border-emerald-900/30 flex items-center justify-center text-xs text-emerald-700">
                  No image
                </div>
              )}
            </div>
            <div className="md:col-span-3 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-emerald-200 font-semibold">{item.tethys.name}</p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-sm">
                  {item.tethys.effect}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 border border-emerald-900 px-2 py-0.5 rounded-sm">
                  {item.tethys.rarity}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/90">{item.tethys.lore}</p>
              <p className="text-[11px] text-emerald-500">Substrate: {item.tethys.substrate}</p>
              <div className="text-[11px] text-emerald-700">
                Real: {item.realWorld.commonName} ({item.realWorld.scientificName}) — {item.realWorld.location}
                {item.realWorld.wikiLink && (
                  <a
                    href={item.realWorld.wikiLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 ml-2"
                  >
                    wiki <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {!loading && specimens.length === 0 && (
          <p className="p-4 text-sm text-emerald-400">No spores returned. Try refresh.</p>
        )}
      </div>
    </div>
  );
}
