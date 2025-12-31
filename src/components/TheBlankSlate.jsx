'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function TheBlankSlate() {
  const { user } = useUser();
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState(null);

  const handleSign = async (e) => {
    e.preventDefault();
    setError(null);
    const name = e.target.name.value.trim();
    const msg = e.target.message.value.trim();
    if (!name || !msg) {
      setError('Both name and inscription are required.');
      return;
    }

    try {
      const res = await fetch('/api/tethys/sign_slate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: name, content: msg })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to etch signature.');
      }
      setSigned(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="artifact-card p-8 bg-[#e2d7c5] relative overflow-hidden group">
      <h3 className="font-display text-2xl mb-2 text-ancient-ink">The Blank Slate</h3>
      <p className="text-xs font-mono opacity-60 mb-6 uppercase tracking-widest">
        Leave your mark before the tide rises.
      </p>

      {!user ? (
        <p className="text-sm italic text-dissonant-red">
          * Link your bio-signal (Login) to scratch the wall.
        </p>
      ) : signed ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
          <p className="text-xl font-display text-ancient-accent">Mark Recorded.</p>
          <p className="text-xs font-mono mt-2">The archive remembers.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSign} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase mb-1">Explorer Name</label>
            <input
              name="name"
              defaultValue={user.name}
              className="w-full bg-white/50 border border-ancient-ink/20 p-2 font-display text-lg focus:border-ancient-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase mb-1">Inscription</label>
            <textarea
              name="message"
              rows="3"
              placeholder="I was here..."
              className="w-full bg-white/50 border border-ancient-ink/20 p-2 font-serif text-sm focus:border-ancient-accent outline-none"
            />
          </div>
          {error && <p className="text-xs text-dissonant-red">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-ancient-ink text-[#e2d7c5] font-mono text-xs uppercase hover:bg-ancient-accent transition-colors"
          >
            Etch into Stone
          </button>
        </form>
      )}
    </div>
  );
}
