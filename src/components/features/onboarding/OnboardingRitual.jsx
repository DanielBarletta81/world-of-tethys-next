'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTethys } from '@/context/TethysContext';
import PathSelector from '@/components/features/onboarding/PathSelector';
import StarterLoadout from '@/components/features/onboarding/StarterLoadout';
import Incubator from '@/components/features/onboarding/Incubator';
import { Flame, Compass, Shield } from 'lucide-react';
import Link from 'next/link';

const PATH_TO_PRIMARY = {
  'root-whisper': 'wild',
  'bond-mystic': 'mystic',
  'triumvirate': 'city'
};

const PATH_LABELS = {
  'root-whisper': 'Root Whisper',
  'bond-mystic': 'Bond Mystic',
  'triumvirate': 'Triumvirate'
};

const ALLEGIANCE_LABELS = {
  kith: 'Kith',
  triumvirate: 'Triumvirate',
  ironwoods: 'Ironwoods'
};

const ALLEGIANCES = [
  {
    id: 'kith',
    label: 'Kith Oath',
    desc: 'Wardens of the root-thread, keepers of the field signs.',
    sigil: <Compass size={16} />
  },
  {
    id: 'triumvirate',
    label: 'Triumvirate Ledger',
    desc: 'Sky City accords, law of the tiers, signal discipline.',
    sigil: <Shield size={16} />
  },
  {
    id: 'ironwoods',
    label: 'Ironwood Covenant',
    desc: 'Riverholds and canopy alliances, flood-signal keepers.',
    sigil: <Flame size={16} />
  }
];

export default function OnboardingRitual() {
  const { playerProfile, setPlayerProfile, hatchFromTemplate } = useTethys();
  const [pathId, setPathId] = useState(playerProfile?.onboarding?.pathId || null);
  const [allegiance, setAllegiance] = useState(playerProfile?.onboarding?.allegiance || null);
  const [idleReady, setIdleReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (playerProfile?.onboarding?.pathId && playerProfile.onboarding.pathId !== pathId) {
      setPathId(playerProfile.onboarding.pathId);
    }
    if (playerProfile?.onboarding?.allegiance && playerProfile.onboarding.allegiance !== allegiance) {
      setAllegiance(playerProfile.onboarding.allegiance);
    }
  }, [playerProfile?.onboarding?.pathId, playerProfile?.onboarding?.allegiance, pathId, allegiance]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setIdleReady(true));
      return () => window.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setIdleReady(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('tethys_onboarding_dismissed');
      if (stored === '1') setDismissed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const status = playerProfile?.onboarding?.status;
  const step = useMemo(() => {
    if (status === 'complete') return 4;
    if (!pathId) return 1;
    if (!allegiance) return 2;
    return 3;
  }, [status, pathId, allegiance]);

  const updateOnboarding = (patch) => {
    const nowIso = new Date().toISOString();
    setPlayerProfile((prev) => {
      const currentStatus = prev?.onboarding?.status;
      const nextStatus = currentStatus === 'complete'
        ? 'complete'
        : currentStatus === 'new'
          ? 'in_progress'
          : currentStatus || 'in_progress';
      return {
        ...prev,
        onboarding: {
          ...prev.onboarding,
          ...patch,
          status: nextStatus,
          updatedAt: nowIso
        }
      };
    });
  };

  const handlePathChange = (nextPathId) => {
    const primary = PATH_TO_PRIMARY[nextPathId] || 'wild';
    setPathId(nextPathId);
    setAllegiance(null);
    const nowIso = new Date().toISOString();
    setPlayerProfile((prev) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        pathId: nextPathId,
        allegiance: null,
        tutorialStep: Math.max(prev.onboarding?.tutorialStep || 0, 1),
        status: prev.onboarding?.status === 'complete' ? 'complete' : 'in_progress',
        updatedAt: nowIso
      },
      path: {
        ...prev.path,
        primary,
        declaredAt: prev.path.declaredAt || nowIso,
        doctrineFlags: {
          ...prev.path.doctrineFlags,
          mysticModeEnabled: primary === 'mystic',
          cityModeEnabled: primary === 'city'
        }
      }
    }));
  };

  const clearPathChoice = () => {
    setPathId(null);
    setAllegiance(null);
    updateOnboarding({ pathId: null, allegiance: null, tutorialStep: 0 });
  };

  const handleAllegiance = (next) => {
    setAllegiance(next);
    updateOnboarding({ allegiance: next, tutorialStep: Math.max(playerProfile?.onboarding?.tutorialStep || 0, 2) });
  };

  const handleHatch = async () => {
    const templateId = playerProfile?.onboarding?.starterLoadoutId || 'starter_v1';
    const primary = PATH_TO_PRIMARY[pathId] || playerProfile?.path?.primary || 'mystic';
    await hatchFromTemplate(templateId, { path: primary });
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('tethys_onboarding_dismissed', '1');
      } catch {
        /* ignore */
      }
    }
  };

  if (status === 'complete') {
    if (dismissed) return null;
    const pathLabel = PATH_LABELS[pathId] || 'Path';
    const allegianceLabel = ALLEGIANCE_LABELS[allegiance] || 'Allegiance';
    return (
      <section className="relative mt-12 border border-stone-800 bg-[#0b0a09] rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at top, rgba(251,146,60,0.12), transparent 60%)" }} />
        <div className="relative z-10 p-6 md:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono">Ritual Sealed</p>
              <h2 className="text-2xl md:text-3xl font-header text-stone-100">Signal bound. The gate opens.</h2>
              <p className="text-stone-400 text-sm">
                Path: <span className="text-amber-200">{pathLabel}</span> · Allegiance:{' '}
                <span className="text-amber-200">{allegianceLabel}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/map"
                className="px-4 py-2 text-[10px] uppercase tracking-[0.3em] bg-amber-600 text-[#0c0a09] rounded shadow-[0_0_20px_rgba(255,120,60,0.3)] hover:bg-amber-500"
              >
                Enter Atlas
              </Link>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-[10px] uppercase tracking-[0.3em] bg-[#1a120e] border border-stone-700 text-stone-300 rounded hover:border-amber-400"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mt-12 border border-stone-800 bg-[#0b0a09] rounded-2xl shadow-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at top, rgba(251,146,60,0.12), transparent 60%)" }} />
      <div className="relative z-10 p-6 md:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono">Ritual of Entry</p>
            <h2 className="text-2xl md:text-3xl font-header text-stone-100">Bind your path. Mark your oath. Claim the kit.</h2>
            <p className="text-stone-400 text-sm max-w-2xl">
              No wasted words. Choose a vector, swear a banner, then take the marrow.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-stone-500 font-mono">
            <span className={step >= 1 ? 'text-amber-300' : ''}>Path</span>
            <span>·</span>
            <span className={step >= 2 ? 'text-amber-300' : ''}>Allegiance</span>
            <span>·</span>
            <span className={step >= 3 ? 'text-amber-300' : ''}>Starter Kit</span>
          </div>
        </div>

        {step === 1 && (
          <div className="rounded-2xl border border-stone-800 overflow-hidden">
            <PathSelector onPathChange={handlePathChange} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono">Allegiance</p>
                <h3 className="text-xl font-header text-stone-100">Seal your ledger.</h3>
                <p className="text-stone-400 text-sm">Your banner defines your signal lanes.</p>
              </div>
              <button
                onClick={clearPathChoice}
                className="text-[10px] uppercase tracking-[0.3em] text-stone-500 hover:text-amber-300"
              >
                Rebind Path
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ALLEGIANCES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAllegiance(item.id)}
                  className={`text-left rounded-2xl border p-4 transition-all ${
                    allegiance === item.id
                      ? 'border-amber-500/70 bg-[#1a120e] shadow-[0_0_25px_rgba(255,120,60,0.2)]'
                      : 'border-stone-800 bg-[#0f0b09] hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">
                    {item.sigil}
                    {item.label}
                  </div>
                  <p className="text-sm text-stone-300 mt-2">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono">Starter Kit</p>
              <h3 className="text-xl font-header text-stone-100">Break the seal. Take the marrow.</h3>
              <p className="text-stone-400 text-sm">Your kit will align to your path and oath.</p>
            </div>
            {!idleReady ? (
              <div className="text-xs uppercase tracking-[0.3em] text-stone-500 font-mono">Preparing the hatchery...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Incubator onHatch={handleHatch} />
                <StarterLoadout hideActions hideOnComplete={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
// World of Tethys || D.C. Barletta
