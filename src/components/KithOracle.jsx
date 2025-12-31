'use client';

import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

export default function KithOracle() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askTheSpores = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tethys/consult_oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Spores fell silent.');
      }
      setResponse(data.reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-t-2 border-[#3d2b1f] bg-[#1a1510] text-[#e6ded0] space-y-3">
      <div className="flex items-center gap-2 text-[#10b981]">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-widest">Kith Uplink Active</span>
      </div>

      {response ? (
        <div className="text-sm font-serif italic leading-relaxed text-[#10b981]/90">
          “{response}”
        </div>
      ) : (
        <p className="text-xs opacity-60 font-mono">// Consult the network. Ask of lore, creatures, or history.</p>
      )}

      {error && <p className="text-[11px] text-dissonant-red">{error}</p>}

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Transmit query..."
          className="w-full bg-[#2b221b] border border-[#5c4f43] p-2 text-xs font-mono focus:border-[#10b981] outline-none text-[#e6ded0]"
          onKeyDown={(e) => e.key === 'Enter' && askTheSpores()}
        />
        <button
          onClick={askTheSpores}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#10b981] hover:text-white"
        >
          {loading ? <span className="animate-spin">✣</span> : <Send className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}
