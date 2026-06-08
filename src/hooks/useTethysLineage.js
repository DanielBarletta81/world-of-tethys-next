'use client';

/**
 * useTethysLineage — reads faction weights + lineage from Firestore playerProfiles
 * in real-time via onSnapshot. Returns null while loading or if unauthenticated.
 *
 * Shape returned:
 * {
 *   loading: boolean,
 *   lineage: {
 *     dominantLineage:    'thal' | 'silurian' | 'triumvirate' | 'mystic' | null,
 *     factionWeights:     { T, S, C, M },   // 0-1 each, sum ~1
 *     activeHybrids:      string[],
 *     siluriianPlateTier: 0-6,
 *     galvanizedTraits:   string[],
 *     totalEvents:        number,
 *     discoveredRegions:  string[],
 *     accolades:          { type, region, ts }[],
 *     lastRegion:         string | null,
 *   } | null
 * }
 */

import { useEffect, useRef, useState } from 'react';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { LINEAGES, HYBRID_EXPRESSIONS } from '@/data/lineage-registry';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

function getDb() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

const DEFAULT_WEIGHTS = { T: 0.25, S: 0.25, C: 0.25, M: 0.25 };

export function useTethysLineage(userId) {
  const [loading, setLoading] = useState(true);
  const [lineage, setLineage] = useState(null);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      setLineage(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const db = getDb();
    const ref = doc(db, 'playerProfiles', userId);

    unsubRef.current = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          // New player — no profile yet; return safe defaults
          setLineage({
            dominantLineage:    null,
            factionWeights:     DEFAULT_WEIGHTS,
            activeHybrids:      [],
            siluriianPlateTier: 0,
            galvanizedTraits:   [],
            totalEvents:        0,
            discoveredRegions:  [],
            accolades:          [],
            lastRegion:         null,
          });
        } else {
          const data = snap.data();
          setLineage({
            dominantLineage:    data.dominantLineage ?? null,
            factionWeights:     data.factionWeights ?? DEFAULT_WEIGHTS,
            activeHybrids:      data.activeHybrids ?? [],
            siluriianPlateTier: data.siluriianPlateTier ?? 0,
            galvanizedTraits:   data.galvanizedTraits ?? [],
            totalEvents:        data.totalEvents ?? 0,
            discoveredRegions:  data.discoveredRegions ?? [],
            accolades:          data.accolades ?? [],
            lastRegion:         data.lastRegion ?? null,
          });
        }
        setLoading(false);
      },
      (err) => {
        console.warn('[useTethysLineage] snapshot error:', err?.message);
        setLoading(false);
      }
    );

    return () => {
      unsubRef.current?.();
    };
  }, [userId]);

  // Enrich with registry data for display
  const enriched = lineage ? {
    ...lineage,
    dominantDef: lineage.dominantLineage ? LINEAGES[lineage.dominantLineage] ?? null : null,
    hybridDefs: lineage.activeHybrids
      .map((id) => HYBRID_EXPRESSIONS.find((h) => h.id === id))
      .filter(Boolean),
  } : null;

  return { loading, lineage: enriched };
}
