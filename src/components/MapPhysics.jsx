"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function intensityScalar(watcherIntensity) {
  if (watcherIntensity === "near") return 1.0;
  if (watcherIntensity === "mid") return 0.55;
  return 0.25; // far
}

/**
 * useMapPhysics
 * - Pan/zoom transform: tx, ty, scale
 * - Stillness detection (based on input inactivity):
 *   - STILL_DELAY: ms until stillness begins
 *   - STILL_FULL: ms until stillness hits 1.0
 * - Watcher tremor (Wild/Mystic) + City drift (unreliable map)
 *
 * Returns:
 * {
 *   tx, ty, scale,
 *   stillnessLevel,
 *   drift: { x, y },           // city-mode slight lie
 *   tremor: { x, y },          // watcher micro-jitter
 *   handlers: { onPointerDown, onPointerMove, onPointerUp, onWheel }
 * }
 */
export default function useMapPhysics({
  cfg,
  mode = "wild", // "wild" | "mystic" | "city"
  watcherIntensity = "far",
  envPressure = 0,
} = {}) {
  const MIN_SCALE = cfg?.MIN_SCALE ?? 0.9;
  const MAX_SCALE = cfg?.MAX_SCALE ?? 2.4;
  const STILL_DELAY = cfg?.STILL_DELAY ?? 1800;
  const STILL_FULL = cfg?.STILL_FULL ?? 2600;

  // base transform
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [scale, setScale] = useState(1);

  // “secondary motion”
  const [tremor, setTremor] = useState({ x: 0, y: 0 });
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  // stillness
  const [stillnessLevel, setStillnessLevel] = useState(0);

  const pointerDown = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const lastInputAt = useRef(Date.now());
  const lastMoveAt = useRef(Date.now());

  const driftVel = useRef({ x: 0, y: 0 });

  const k = useMemo(() => intensityScalar(watcherIntensity), [watcherIntensity]);

  const markInput = () => {
    lastInputAt.current = Date.now();
  };

  // --- handlers ---
  const onPointerDown = (e) => {
    pointerDown.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    lastMoveAt.current = Date.now();
    markInput();
  };

  const onPointerMove = (e) => {
    if (!pointerDown.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    lastPointer.current = { x: e.clientX, y: e.clientY };
    lastMoveAt.current = Date.now();
    markInput();

    const resistance = 1 - envPressure * 0.25;

    // pan with slight resistance under pressure
    setTx((v) => v + dx * resistance);
    setTy((v) => v + dy * resistance);

    // city drift accumulates while moving (unreliable map)
    if (mode === "city") {
      // drift is small; tied to movement but not perfectly
      driftVel.current.x += dx * 0.02;
      driftVel.current.y += dy * 0.02;
    }
  };

  const onPointerUp = () => {
    pointerDown.current = false;
    markInput();
  };

  const onWheel = (e) => {
    // zoom around center (simple)
    e.preventDefault?.();
    markInput();

    const delta = -e.deltaY; // wheel down -> negative
    const zoom = delta > 0 ? 1.06 : 0.94;

    const zoomDelay = envPressure > 0.6 ? 120 : 0;
    setTimeout(() => {
      setScale((s) => clamp(s * zoom, MIN_SCALE, MAX_SCALE));
    }, zoomDelay);
  };

  // --- rAF loop: stillness + tremor + drift decay ---
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const now = Date.now();
      const idleMs = now - lastInputAt.current;

      // Stillness ramps AFTER STILL_DELAY up to STILL_FULL
      if (idleMs <= STILL_DELAY) {
        if (stillnessLevel !== 0) setStillnessLevel(0);
      } else {
        const t = clamp((idleMs - STILL_DELAY) / STILL_FULL, 0, 1);
        // ease in slightly
        const eased = t * t * (3 - 2 * t);
        if (Math.abs(eased - stillnessLevel) > 0.002) setStillnessLevel(eased);
      }

      // Watcher tremor:
      // - Wild: clearer physical shake
      // - Mystic: subtle, “alive” oscillation (stronger during stillness)
      // - City: no tremor (denial)
      if (mode !== "city") {
        const base = 0.35 * k; // amplitude baseline
        const mysticBoost = mode === "mystic" ? (0.25 + stillnessLevel * 0.55) : 0.15;
        const amp = base * (0.35 + mysticBoost);

        // low frequency wobble + tiny noise
        const t = now * 0.001;
        const x = Math.sin(t * 0.9 + 10.2) * amp + Math.sin(t * 2.1) * (amp * 0.35);
        const y = Math.cos(t * 0.8 + 2.7) * amp + Math.sin(t * 1.7) * (amp * 0.25);

        setTremor({ x, y });
      } else {
        if (tremor.x !== 0 || tremor.y !== 0) setTremor({ x: 0, y: 0 });
      }

      // City drift:
      // - driftVel accumulates during movement
      // - slowly decays back toward 0 when idle
      if (mode === "city") {
        const sinceMove = now - lastMoveAt.current;
        const decay = sinceMove > 350 ? 0.92 : 0.98; // decays faster when you stop
        driftVel.current.x *= decay;
        driftVel.current.y *= decay;

        // cap total drift so it stays “subliminal”
        const dx = clamp(drift.x + driftVel.current.x * 0.02, -18, 18);
        const dy = clamp(drift.y + driftVel.current.y * 0.02, -18, 18);

        // ease drift back toward 0 over longer idle
        const idlePull = clamp((idleMs - 800) / 5000, 0, 1) * 0.02;
        const pulledX = dx + (0 - dx) * idlePull;
        const pulledY = dy + (0 - dy) * idlePull;

        setDrift({ x: pulledX, y: pulledY });
      } else {
        if (drift.x !== 0 || drift.y !== 0) setDrift({ x: 0, y: 0 });
        driftVel.current = { x: 0, y: 0 };
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, watcherIntensity, STILL_DELAY, STILL_FULL]);

  return {
    tx,
    ty,
    scale,
    stillnessLevel,
    tremor,
    drift,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onWheel,
    },
  };
}
// World of Tethys || D.C. Barletta
