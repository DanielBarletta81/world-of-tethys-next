'use client';

/**
 * useDwellTracker — passive dwell-time + event pipeline for the Tethys map.
 *
 * Tracks how long a player dwells on a region and fires DNA events at
 * graduated thresholds. Also fires discovery and reread events.
 *
 * Event tiers (from lineage-registry DWELL_EVENT_TYPES):
 *   - dwell_threshold : 8s  — silent, 1.2× DNA weight
 *   - deep_dwell      : 30s — field notation, 1.8× DNA weight
 *   - reread_event    : triggered on second open of same region lore
 *   - discovery_event : first-ever visit to a region
 *
 * Usage:
 *   const { onRegionChange, onStillnessChange, onLorePanelOpen } = useDwellTracker({ userId });
 *
 *   // In map page:
 *   <TethysNexus onStillnessChange={onStillnessChange} ... />
 *   // When region selected: onRegionChange(regionId)
 *   // When lore panel opened: onLorePanelOpen(regionId)
 */

import { useCallback, useEffect, useRef } from 'react';
import { writeDnaEvent } from '@/lib/dnaEventWriter';
import { getRegion } from '@/data/region-registry';

const DWELL_THRESHOLD_MS   = 8_000;
const DEEP_DWELL_MS        = 30_000;

// Regions with hidden locations unlocked by deep stillness
const HIDDEN_UNLOCK_MAP = {
  'mystic-woods': 'oracle-pool',
};

export function useDwellTracker({ userId, onHiddenUnlock }) {
  const currentRegionRef    = useRef(null);   // active region slug
  const regionEntryTimeRef  = useRef(null);   // Date.now() when region was entered
  const dwellThresholdFired = useRef(false);  // guard: fire each tier once per region visit
  const deepDwellFired      = useRef(false);
  const discoveredRef       = useRef(new Set());  // regions seen this session
  const loreOpenedRef       = useRef(new Set());  // regions whose lore was opened this session

  // ── Shared event emitter ─────────────────────────────────────────────────
  const emit = useCallback((regionId, eventType, extra = {}) => {
    if (!userId || !regionId) return;
    const region = getRegion(regionId);
    writeDnaEvent({
      userId,
      regionId,
      eventType,
      pathMode:    region?.lore?.factionLink?.includes('Mystic') ? 'mystic'
                 : region?.lore?.factionLink?.includes('Sky City') ? 'city'
                 : 'wild',
      envPressure: region?.terrain?.hazards?.length
        ? Math.min(1, region.terrain.hazards.length * 0.15)
        : 0,
      metadata: { ...extra },
    });
  }, [userId]);

  // ── Called when user selects / travels to a new region ───────────────────
  const onRegionChange = useCallback((regionId) => {
    currentRegionRef.current   = regionId;
    regionEntryTimeRef.current = Date.now();
    dwellThresholdFired.current = false;
    deepDwellFired.current      = false;

    if (!discoveredRef.current.has(regionId)) {
      discoveredRef.current.add(regionId);
      emit(regionId, 'discovery_event');
    }
  }, [emit]);

  // ── Called by TethysNexus stillnessLevel (0-1) changes ───────────────────
  const onStillnessChange = useCallback((level) => {
    const regionId = currentRegionRef.current;
    if (!regionId || level < 0.6) return;  // only act when player is genuinely still

    const elapsed = Date.now() - (regionEntryTimeRef.current ?? Date.now());

    if (!dwellThresholdFired.current && elapsed >= DWELL_THRESHOLD_MS) {
      dwellThresholdFired.current = true;
      emit(regionId, 'dwell_threshold', { stillnessLevel: level, elapsedMs: elapsed });
    }

    if (!deepDwellFired.current && elapsed >= DEEP_DWELL_MS) {
      deepDwellFired.current = true;
      emit(regionId, 'deep_dwell', { stillnessLevel: level, elapsedMs: elapsed });

      // Check if this region unlocks a hidden location
      const hiddenUnlock = HIDDEN_UNLOCK_MAP[regionId];
      if (hiddenUnlock) {
        onHiddenUnlock?.(regionId, hiddenUnlock);
      }
    }
  }, [emit]);

  // ── Called when lore panel is opened for a region ────────────────────────
  const onLorePanelOpen = useCallback((regionId) => {
    if (!regionId) return;

    if (loreOpenedRef.current.has(regionId)) {
      // Already opened this session — this is a reread
      emit(regionId, 'reread_event');
    } else {
      loreOpenedRef.current.add(regionId);
      // First open is captured by the dwell pipeline; no separate event needed
    }
  }, [emit]);

  // ── Cleanup on unmount (also fires a final dwell event if deep threshold
  //    was not yet reached — captures partial reads) ─────────────────────────
  useEffect(() => {
    return () => {
      const regionId = currentRegionRef.current;
      if (!regionId || dwellThresholdFired.current) return;
      const elapsed = Date.now() - (regionEntryTimeRef.current ?? Date.now());
      if (elapsed >= DWELL_THRESHOLD_MS * 0.5) {
        // Partial dwell — emit at reduced weight via metadata flag
        emit(regionId, 'dwell_threshold', { partial: true, elapsedMs: elapsed });
      }
    };
  }, [emit]);

  return { onRegionChange, onStillnessChange, onLorePanelOpen };
}
