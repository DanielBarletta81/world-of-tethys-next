'use client';

import { useMemo, useState } from 'react';
import TriFoldNav from '@/components/layout/navigation/TriFoldNav';

const DEFAULT_SEED_JSON = `[
  {
    "id": "ravel_9001",
    "text": "The ash remembers you longer than you remember it.",
    "path": "mystic",
    "stillness": "high"
  }
]`;

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [status, setStatus] = useState(null);
  const [seedStatus, setSeedStatus] = useState(null);
  const [lore, setLore] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'cambria_archive',
    region: 'cambria_ruins',
    faction: 'cambria',
    tags: '',
    status: 'draft'
  });
  const [seedType, setSeedType] = useState('oracle_responses');
  const [seedPayload, setSeedPayload] = useState(DEFAULT_SEED_JSON);
  const [seedMode, setSeedMode] = useState('queue');
  const [seedCollection, setSeedCollection] = useState('lore_papers');
  const [seedPath, setSeedPath] = useState('oracle/responses');

  const parsedTags = useMemo(() => {
    return lore.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [lore.tags]);

  const handleLoreSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    try {
      const res = await fetch('/api/admin/lore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({
          ...lore,
          tags: parsedTags
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to save lore.');
      setStatus({ ok: true, message: `Saved lore: ${data.slug}` });
      setLore((prev) => ({
        ...prev,
        title: '',
        slug: '',
        summary: '',
        content: '',
        tags: ''
      }));
    } catch (error) {
      setStatus({ ok: false, message: error.message });
    }
  };

  const handleSeedSubmit = async (event) => {
    event.preventDefault();
    setSeedStatus(null);
    let payload;
    try {
      payload = JSON.parse(seedPayload);
    } catch (error) {
      setSeedStatus({ ok: false, message: 'Seed JSON is invalid.' });
      return;
    }

    if (!Array.isArray(payload)) {
      setSeedStatus({ ok: false, message: 'Seed payload must be a JSON array.' });
      return;
    }

    try {
      const endpoint =
        seedMode === 'direct' ? '/api/admin/seed-direct' : '/api/admin/seed';
      const body =
        seedMode === 'direct'
          ? { collection: seedCollection, collectionPath: seedPath, payload }
          : { seedType, payload };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Seed failed.');
      setSeedStatus({ ok: true, message: `Queued ${data.count} entries.` });
    } catch (error) {
      setSeedStatus({ ok: false, message: error.message });
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0a09] text-stone-100">
      <TriFoldNav />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20 space-y-12">
        <header className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Creator Console</p>
          <h1 className="text-4xl md:text-5xl font-black">Cambria Admin Bay</h1>
          <p className="text-sm text-stone-400 max-w-2xl">
            Private tooling for lore uploads and seed queues. Requires your admin key.
          </p>
        </header>

        <section className="bg-black/40 border border-stone-800 rounded-2xl p-6">
          <label className="text-xs uppercase tracking-[0.2em] text-stone-400">
            Admin Key
          </label>
          <input
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            placeholder="Paste ADMIN_SECRET_KEY"
            className="mt-2 w-full bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
          />
        </section>

        <section className="bg-black/40 border border-stone-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Upload Lore</h2>
            <p className="text-xs text-stone-400">Creates a new lore entry in Firestore.</p>
          </div>
          <form onSubmit={handleLoreSubmit} className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                placeholder="Title"
                value={lore.title}
                onChange={(event) => setLore((prev) => ({ ...prev, title: event.target.value }))}
              />
              <input
                className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                placeholder="Slug (optional)"
                value={lore.slug}
                onChange={(event) => setLore((prev) => ({ ...prev, slug: event.target.value }))}
              />
            </div>
            <input
              className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
              placeholder="Summary"
              value={lore.summary}
              onChange={(event) => setLore((prev) => ({ ...prev, summary: event.target.value }))}
            />
            <textarea
              className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm min-h-[180px]"
              placeholder="Lore content"
              value={lore.content}
              onChange={(event) => setLore((prev) => ({ ...prev, content: event.target.value }))}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                placeholder="Category"
                value={lore.category}
                onChange={(event) => setLore((prev) => ({ ...prev, category: event.target.value }))}
              />
              <input
                className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                placeholder="Region"
                value={lore.region}
                onChange={(event) => setLore((prev) => ({ ...prev, region: event.target.value }))}
              />
              <input
                className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                placeholder="Faction"
                value={lore.faction}
                onChange={(event) => setLore((prev) => ({ ...prev, faction: event.target.value }))}
              />
              <input
                className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                placeholder="Status"
                value={lore.status}
                onChange={(event) => setLore((prev) => ({ ...prev, status: event.target.value }))}
              />
            </div>
            <input
              className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
              placeholder="Tags (comma-separated)"
              value={lore.tags}
              onChange={(event) => setLore((prev) => ({ ...prev, tags: event.target.value }))}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-900/60 hover:bg-amber-800 text-amber-100 text-xs uppercase tracking-[0.2em] rounded border border-amber-700/40"
            >
              Save Lore
            </button>
            {status && (
              <div className={`text-sm ${status.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {status.message}
              </div>
            )}
          </form>
        </section>

        <section className="bg-black/40 border border-stone-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Seed Queue</h2>
            <p className="text-xs text-stone-400">
              Drops JSON payloads into the seed queue for later processing.
            </p>
          </div>
          <form onSubmit={handleSeedSubmit} className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <select
                className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                value={seedMode}
                onChange={(event) => setSeedMode(event.target.value)}
              >
                <option value="queue">Queue (seed_queue)</option>
                <option value="direct">Direct to collection</option>
              </select>
              {seedMode === 'direct' ? (
                <div className="grid gap-2">
                  <select
                    className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                    value={seedCollection}
                    onChange={(event) => setSeedCollection(event.target.value)}
                  >
                    <option value="lore_papers">lore_papers</option>
                    <option value="daily_whispers">daily_whispers</option>
                    <option value="oracle_responses">oracle_responses</option>
                    <option value="npc_variants">npc_variants</option>
                    <option value="seed_queue">seed_queue</option>
                  </select>
                  <input
                    className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                    placeholder="Collection path (oracle/responses)"
                    value={seedPath}
                    onChange={(event) => setSeedPath(event.target.value)}
                  />
                </div>
              ) : (
                <input
                  className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm"
                  placeholder="Seed Type (oracle_responses, lore_seeds, npc_variants)"
                  value={seedType}
                  onChange={(event) => setSeedType(event.target.value)}
                />
              )}
            </div>
            <textarea
              className="bg-black/60 border border-stone-700 rounded px-3 py-2 text-sm min-h-[180px] font-mono"
              value={seedPayload}
              onChange={(event) => setSeedPayload(event.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs uppercase tracking-[0.2em] rounded border border-stone-700/40"
            >
              Queue Seed Payload
            </button>
            {seedStatus && (
              <div className={`text-sm ${seedStatus.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {seedStatus.message}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
