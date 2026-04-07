'use client';

import { useMemo, useState } from 'react';

const SUBSTACK_URL =
  process.env.NEXT_PUBLIC_SUBSTACK_URL ||
  'https://pteroswifts.substack.com';

export default function PostLoginNewsletterCard({
  user,
  playerProfile,
  setPlayerProfile,
  applyPlayerAction
}) {
  const [optInChecked, setOptInChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  const newsletterState = playerProfile?.marketing?.newsletter || {};
  const alreadyDecided = Boolean(newsletterState?.decisionAt);
  const shouldShow = Boolean(user?.uid) && !alreadyDecided;

  const welcomeName = useMemo(
    () => user?.displayName || user?.email?.split('@')[0] || 'Scout',
    [user?.displayName, user?.email]
  );

  if (!shouldShow) return null;

  const saveDecision = async (optedIn) => {
    if (saving) return;
    setSaving(true);
    const nowIso = new Date().toISOString();

    setPlayerProfile((prev) => ({
      ...prev,
      marketing: {
        ...(prev?.marketing || {}),
        newsletter: {
          ...(prev?.marketing?.newsletter || {}),
          promptedAt: prev?.marketing?.newsletter?.promptedAt || nowIso,
          decisionAt: nowIso,
          optedIn,
          source: 'post_login_map_prompt'
        }
      }
    }));

    if (optedIn) {
      applyPlayerAction?.({
        id: 'newsletter_opt_in',
        type: 'restorative',
        restorative: true,
        xp: 8
      });
      if (typeof window !== 'undefined') {
        window.open(`${SUBSTACK_URL}/subscribe`, '_blank', 'noopener,noreferrer');
      }
    }

    setSaving(false);
  };

  return (
    <div className="bg-[#11100f] p-6 border border-stone-800 rounded-lg">
      <h3 className="text-stone-300 text-xs uppercase tracking-widest mb-3">
        Welcome, {welcomeName}
      </h3>
      <p className="text-sm text-stone-300 leading-relaxed">
        Want dispatches when new lore and artifacts drop? Sign-in stays independent; this is a separate opt-in.
      </p>

      <label className="mt-4 flex items-start gap-2 text-xs text-stone-400">
        <input
          type="checkbox"
          checked={optInChecked}
          onChange={(e) => setOptInChecked(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 accent-amber-600"
        />
        <span>I want email field dispatches from Tethys.</span>
      </label>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => saveDecision(false)}
          className="px-3 py-2 rounded border border-stone-700 bg-stone-900 text-xs uppercase tracking-[0.18em] text-stone-300 hover:border-stone-500 disabled:opacity-50"
        >
          Not Now
        </button>
        <button
          type="button"
          disabled={!optInChecked || saving}
          onClick={() => saveDecision(true)}
          className="px-3 py-2 rounded border border-amber-700/70 bg-amber-900/30 text-xs uppercase tracking-[0.18em] text-amber-200 hover:bg-amber-900/50 disabled:opacity-40"
        >
          Save & Subscribe
        </button>
      </div>
    </div>
  );
}
