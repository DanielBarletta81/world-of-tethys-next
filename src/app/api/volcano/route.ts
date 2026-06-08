/**
 * /api/volcano — proxies the MAGMA Indonesia PVMBG volcanic activity API.
 *
 * Source: https://magma.esdm.go.id/api/v1/gunung-api/aktivitas
 * Monitored volcano: Mount Merapi (G.MERAPI) — the real-world anchor for
 * the Watcher Volcano in the Tethys world.
 *
 * Merapi alert levels → Tethys game values:
 *   1 Normal  → watcher: 'far',  rumble: 0,   stormFront: false
 *   2 Waspada → watcher: 'mid',  rumble: 0.3, stormFront: false
 *   3 Siaga   → watcher: 'near', rumble: 0.6, stormFront: true (0.4)
 *   4 Awas    → watcher: 'near', rumble: 1.0, stormFront: true (0.85)
 *
 * Cached for 10 minutes — volcano status doesn't need real-time polling.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 600; // 10-minute ISR cache

const MAGMA_URL = 'https://magma.esdm.go.id/api/v1/gunung-api/aktivitas';
const MERAPI_ID = 'G.MERAPI';

// Alert level → Tethys map intensity mapping
const LEVEL_MAP: Record<number, {
  watcherIntensity: 'far' | 'mid' | 'near';
  rumbleIntensity: number;
  stormFrontActive: boolean;
  stormFrontIntensity: number;
  cloudIntensity: number;
  weatherMistBoost: number;
  label: string;
  tethysLore: string;
}> = {
  1: {
    watcherIntensity: 'far',
    rumbleIntensity: 0,
    stormFrontActive: false,
    stormFrontIntensity: 0,
    cloudIntensity: 0.05,
    weatherMistBoost: 0,
    label: 'Normal',
    tethysLore: 'The Watcher sleeps. Ash scouts report standard fumarole activity. No route restrictions.',
  },
  2: {
    watcherIntensity: 'mid',
    rumbleIntensity: 0.3,
    stormFrontActive: false,
    stormFrontIntensity: 0,
    cloudIntensity: 0.25,
    weatherMistBoost: 0.15,
    label: 'Waspada',
    tethysLore: 'The Watcher stirs. Stryker patrols increased. Purgess Flats approach corridors under observation.',
  },
  3: {
    watcherIntensity: 'near',
    rumbleIntensity: 0.6,
    stormFrontActive: true,
    stormFrontIntensity: 0.45,
    cloudIntensity: 0.5,
    weatherMistBoost: 0.35,
    label: 'Siaga',
    tethysLore: 'Watcher Wake Phase active. Ash columns at altitude. The Compact has sealed eastern approach corridors. Purgess crossing suspended.',
  },
  4: {
    watcherIntensity: 'near',
    rumbleIntensity: 1.0,
    stormFrontActive: true,
    stormFrontIntensity: 0.85,
    cloudIntensity: 0.8,
    weatherMistBoost: 0.6,
    label: 'Awas',
    tethysLore: 'FULL ERUPTION EVENT. The Watcher has spoken. All routes within 10km sealed. Silurian Harmonics activated at Sky City. Every map lies — navigate by Earth Tune only.',
  },
};

export async function GET() {
  try {
    const res = await fetch(MAGMA_URL, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'TethysWorld/1.0' },
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      throw new Error(`MAGMA API returned ${res.status}`);
    }

    const data = await res.json();

    // Find Merapi in the response — field names vary, try common shapes
    const volcanoes: any[] = data?.data ?? data?.result ?? data ?? [];
    const merapi = Array.isArray(volcanoes)
      ? volcanoes.find((v: any) =>
          v.id_gunung_api?.toUpperCase().includes('MERAPI') ||
          v.nama?.toUpperCase().includes('MERAPI') ||
          v.code?.toUpperCase().includes('MERAPI') ||
          v.gunung_id?.toUpperCase().includes('MERAPI')
        )
      : null;

    const alertLevel: number = merapi?.status_level
      ?? merapi?.level
      ?? merapi?.tingkat_aktivitas
      ?? 1;

    const normalizedLevel = Math.min(4, Math.max(1, Number(alertLevel) || 1)) as 1 | 2 | 3 | 4;
    const tethysValues = LEVEL_MAP[normalizedLevel];

    // Ash column height if available
    const ashColumnM: number = merapi?.tinggi_asap ?? merapi?.ash_column_m ?? 0;

    return NextResponse.json({
      ok: true,
      source: 'magma.esdm.go.id',
      cachedAt: new Date().toISOString(),
      merapi: {
        alertLevel: normalizedLevel,
        alertLabel: tethysValues.label,
        ashColumnM,
        raw: merapi ?? null,
      },
      tethys: {
        ...tethysValues,
        // Boost mist slightly with ash column — 1000m column = +0.05 mist
        weatherMistBoost: Math.min(0.8, tethysValues.weatherMistBoost + (ashColumnM / 20000)),
      },
    });
  } catch (err: any) {
    // Return safe defaults on failure — the map still works, just no live data
    console.warn('[/api/volcano] MAGMA API unreachable, returning defaults:', err?.message);
    return NextResponse.json({
      ok: false,
      source: 'fallback',
      cachedAt: new Date().toISOString(),
      merapi: { alertLevel: 1, alertLabel: 'Normal', ashColumnM: 0, raw: null },
      tethys: LEVEL_MAP[1],
      error: err?.message ?? 'Unreachable',
    });
  }
}
