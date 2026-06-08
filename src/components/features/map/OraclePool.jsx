'use client';

/**
 * OraclePool — the hidden listening space inside the Mystic Woods.
 *
 * Only renders when:
 *   1. Player has unlocked it (deep_dwell on mystic-woods)
 *   2. Current region is mystic-woods
 *
 * Uses live volcano status (watcherState) to weight responses.
 * Both Ravel and the Stone Listener hear the same tectonic force;
 * the component alternates between them based on session state.
 */

import { useCallback, useEffect, useState } from 'react';
import { drawOracleResponse, ORACLE_POOL } from '@/data/oracle-pool';

// Translate rumble intensity → watcherState selector
function toWatcherState(rumbleIntensity = 0, stormFrontActive = false) {
  if (stormFrontActive || rumbleIntensity >= 0.6) return 'active';
  if (rumbleIntensity >= 0.2) return 'stirring';
  return 'quiet';
}

// Translate stillness level (0-1) → stillness selector
function toStillness(level = 0) {
  if (level >= 0.75) return 'high';
  if (level >= 0.35) return 'medium';
  return 'low';
}

const SPEAKER_LABELS = {
  ravel: 'Ravel',
  stone: 'Stone Listener',
};

const SPEAKER_COLORS = {
  ravel: 'text-emerald-300',
  stone: 'text-stone-400',
};

export default function OraclePool({
  isUnlocked = false,
  currentRegion = null,
  stillnessLevel = 0,
  rumbleIntensity = 0,
  stormFrontActive = false,
  visitCount = 1,          // 1 = first, >1 = repeat
}) {
  const [response, setResponse] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sessionSpeaker, setSessionSpeaker] = useState('ravel'); // alternates each draw
  const [poolEntered, setPoolEntered] = useState(false);

  const isVisible = isUnlocked && currentRegion === 'mystic-woods';

  // Auto-draw when player first enters and is still enough
  useEffect(() => {
    if (!isVisible || poolEntered) return;
    if (stillnessLevel >= 0.65) {
      setPoolEntered(true);
      draw();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, stillnessLevel, poolEntered]);

  const draw = useCallback(() => {
    setIsDrawing(true);
    setResponse(null);

    const watcherState = toWatcherState(rumbleIntensity, stormFrontActive);
    const stillness = toStillness(stillnessLevel);
    const visit = visitCount <= 1 ? 'first' : 'repeat';

    // Small artificial delay — the pool doesn't rush
    setTimeout(() => {
      const result = drawOracleResponse({
        speaker: sessionSpeaker,
        watcherState,
        stillness,
        visit,
      });
      setResponse(result);
      setIsDrawing(false);
      // Next draw alternates speaker
      setSessionSpeaker((prev) => (prev === 'ravel' ? 'stone' : 'ravel'));
    }, 900);
  }, [rumbleIntensity, stormFrontActive, stillnessLevel, visitCount, sessionSpeaker]);

  if (!isVisible) return null;

  return (
    <div className="rounded-2xl border border-emerald-900/30 bg-gradient-to-b from-emerald-950/20 to-black/60 p-5 space-y-4">
      {/* Header — no label, just a hint */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-600/60">
            {ORACLE_POOL.label}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5 italic">
            {ORACLE_POOL.sublabel}
          </p>
        </div>
        {/* Watcher state indicator — subtle */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
          stormFrontActive     ? 'bg-red-500 animate-pulse' :
          rumbleIntensity > 0.2 ? 'bg-amber-500/60' :
          'bg-emerald-900/60'
        }`} />
      </div>

      {/* Response area */}
      <div className="min-h-[72px] flex items-center">
        {isDrawing ? (
          <div className="flex gap-1.5 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse [animation-delay:200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse [animation-delay:400ms]" />
          </div>
        ) : response ? (
          <div className="space-y-2">
            <p className={`text-[10px] uppercase tracking-[0.3em] ${SPEAKER_COLORS[response.speaker]}`}>
              {SPEAKER_LABELS[response.speaker]}
            </p>
            {response.silent ? (
              <p className="text-stone-700 italic text-[12px]">— silence —</p>
            ) : (
              <p className="text-stone-300 text-[13px] leading-relaxed font-light italic">
                "{response.text}"
              </p>
            )}
            {response.echo && (
              <p className="text-[9px] uppercase tracking-[0.3em] text-stone-700">
                ∿ {response.echo.replace(/_/g, ' ')}
              </p>
            )}
          </div>
        ) : (
          <p className="text-stone-700 text-[12px] italic">
            The water does not reflect the sky.
          </p>
        )}
      </div>

      {/* Listen again — only when still */}
      <button
        type="button"
        onClick={draw}
        disabled={isDrawing || stillnessLevel < 0.35}
        className={`w-full py-2 rounded-lg border text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ${
          stillnessLevel >= 0.35
            ? 'border-emerald-800/40 text-emerald-600/80 hover:border-emerald-600/60 hover:text-emerald-400'
            : 'border-stone-900 text-stone-800 cursor-not-allowed'
        }`}
      >
        {stillnessLevel < 0.35 ? 'Be still to listen' : 'Listen again'}
      </button>
    </div>
  );
}
