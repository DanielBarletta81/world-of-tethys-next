'use client';

/**
 * useVolcanoStatus — polls /api/volcano and returns live Merapi alert data
 * mapped to Tethys map props.
 *
 * Polls every 10 minutes (matching the server-side cache).
 * Returns safe defaults immediately so the map never blocks on this.
 *
 * Usage:
 *   const { tethys, merapi, loading } = useVolcanoStatus();
 *   <TethysNexus
 *     rumbleIntensity={tethys.rumbleIntensity}
 *     stormFrontActive={tethys.stormFrontActive}
 *     stormFrontIntensity={tethys.stormFrontIntensity}
 *     cloudIntensity={tethys.cloudIntensity}
 *     weatherMistBoost={tethys.weatherMistBoost}
 *     ...
 *   />
 */

import { useEffect, useRef, useState } from 'react';

const POLL_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const SAFE_DEFAULTS = {
  watcherIntensity: 'far',
  rumbleIntensity: 0,
  stormFrontActive: false,
  stormFrontIntensity: 0,
  cloudIntensity: 0.05,
  weatherMistBoost: 0,
  label: 'Normal',
  tethysLore: 'The Watcher sleeps.',
};

export function useVolcanoStatus() {
  const [tethys, setTethys] = useState(SAFE_DEFAULTS);
  const [merapi, setMerapi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const timerRef = useRef(null);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/volcano', { credentials: 'omit' });
      if (!res.ok) throw new Error(`volcano route ${res.status}`);
      const data = await res.json();
      setTethys(data.tethys ?? SAFE_DEFAULTS);
      setMerapi(data.merapi ?? null);
      setLastFetched(data.cachedAt ?? new Date().toISOString());
    } catch (err) {
      console.warn('[useVolcanoStatus] fetch failed, keeping current values:', err?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    timerRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  return { tethys, merapi, loading, lastFetched, refetch: fetchStatus };
}
