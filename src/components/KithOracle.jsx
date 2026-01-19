// src/components/KithOracle.jsx
'use client';

import { useState } from 'react';
import { Sparkles, Send, Eye } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';

export default function KithOracle() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { playerProfile } = useTethys();

  const readRecent = () => {
    if (typeof window === 'undefined') return { weekKey: null, ids: [] };
    try {
      const raw = window.localStorage.getItem('tethys_oracle_recent');
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && Array.isArray(parsed.ids)) return parsed;
    } catch {
      /* ignore */
    }
    return { weekKey: null, ids: [] };
  };

  const writeRecent = (weekKey, ids) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        'tethys_oracle_recent',
        JSON.stringify({ weekKey, ids })
      );
    } catch {
      /* ignore */
    }
  };

  const askTheSpores = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    
    // Simulate network delay for "immersion" if API is too fast
    // await new Promise(r => setTimeout(r, 1000));

    try {
      const recent = readRecent();
      const res = await fetch('/api/tethys/consult_oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          dnaSeed: playerProfile?.dna?.seed || '',
          dnaLean: playerProfile?.dna?.lean || '',
          recentIds: recent.ids || []
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Spores fell silent.');
      setResponse({ text: data.text || data.reply, speaker: data.speaker || 'Ravel' });
      if (data.id) {
        const nextIds = [data.id, ...(recent.ids || [])].slice(0, 6);
        writeRecent(data.weekKey || recent.weekKey, nextIds);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group bg-[#0a0808] border border-purple-900/30 p-6 rounded-xl shadow-2xl overflow-hidden">
      
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(88,28,135,0.15),transparent_50%)] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-purple-400">
        <Eye size={16} className="animate-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Kith Uplink Active</span>
      </div>

      {/* Output Screen */}
      <div className="min-h-[80px] mb-4 p-4 rounded bg-black/40 border border-purple-900/20 font-serif text-sm leading-relaxed text-purple-100/90 italic shadow-inner">
        {loading ? (
          <span className="animate-pulse text-purple-500/50">Translating mycelial network...</span>
        ) : response?.text ? (
          `“${response.text}”`
        ) : (
          <span className="opacity-40">The spores are listening. Ask of the deep history.</span>
        )}
      </div>

      {/* Input Field */}
      <div className="relative flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Transmit query..."
          className="w-full bg-[#1a1510] border border-[#3d2b1f] focus:border-purple-500 text-stone-200 text-xs font-mono p-3 rounded-sm outline-none transition-colors placeholder:text-stone-600"
          onKeyDown={(e) => e.key === 'Enter' && askTheSpores()}
        />
        <button
          onClick={askTheSpores}
          disabled={loading}
          className="absolute right-2 text-purple-500 hover:text-purple-300 disabled:opacity-50 transition-colors"
        >
          {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      {error && <p className="mt-2 text-[10px] text-red-400 font-mono text-center">{error}</p>}
    </div>
  );
}
// World of Tethys || D.C. Barletta
