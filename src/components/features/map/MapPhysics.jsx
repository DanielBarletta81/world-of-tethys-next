"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const PHYSICS = {
  FRICTION: 0.92,
  SPRING: 0.15,
  MASS: 1.0,
  TOLERANCE: 0.1,
  MAX_VELOCITY: 45
};

const BOUNDS = {
  minX: -500,
  maxX: 500,
  minY: -400,
  maxY: 400
};

function intensityScalar(watcherIntensity) {
  if (watcherIntensity === "near") return 1.0;
  if (watcherIntensity === "mid") return 0.55;
  return 0.25;
}

export default function useMapPhysics({
  cfg,
  mode = "wild",
  watcherIntensity = "far",
  envPressure = 0,
  initialTransform = null
} = {}) {
  const MIN_SCALE = cfg?.MIN_SCALE ?? 0.9;
  const MAX_SCALE = cfg?.MAX_SCALE ?? 2.4;
  const STILL_DELAY = cfg?.STILL_DELAY ?? 1800;
  const STILL_FULL = cfg?.STILL_FULL ?? 2600;

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [tremor, setTremor] = useState({ x: 0, y: 0 });
  const [drift, setDrift] = useState({ x: 0, y: 0 });
  const [stillnessLevel, setStillnessLevel] = useState(0);

  const state = useRef({
    x: 0,
    y: 0,
    scale: 1,
    vx: 0,
    vy: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    lastInputTime: Date.now()
  });
  const initializedRef = useRef(false);

  const lastMoveAt = useRef(Date.now());
  const driftVel = useRef({ x: 0, y: 0 });
  const k = useMemo(() => intensityScalar(watcherIntensity), [watcherIntensity]);
  const stillnessRef = useRef(0);

  const onPointerDown = (e) => {
    state.current.isDragging = true;
    state.current.lastX = e.clientX;
    state.current.lastY = e.clientY;
    state.current.lastTime = Date.now();
    state.current.lastInputTime = Date.now();
    state.current.vx = 0;
    state.current.vy = 0;
  };

  const onPointerMove = (e) => {
    if (!state.current.isDragging) return;
    const now = Date.now();
    const dt = now - state.current.lastTime;
    state.current.lastInputTime = now;

    const resistance = 1 - envPressure * 0.25;
    const dx = (e.clientX - state.current.lastX) * resistance;
    const dy = (e.clientY - state.current.lastY) * resistance;

    state.current.x += dx;
    state.current.y += dy;

    if (dt > 0) {
      const vX = (dx / dt) * 16;
      const vY = (dy / dt) * 16;
      state.current.vx = state.current.vx * 0.5 + vX * 0.5;
      state.current.vy = state.current.vy * 0.5 + vY * 0.5;
    }

    if (mode === "city") {
      driftVel.current.x += dx * 0.02;
      driftVel.current.y += dy * 0.02;
    }

    lastMoveAt.current = now;
    state.current.lastX = e.clientX;
    state.current.lastY = e.clientY;
    state.current.lastTime = now;

    setTransform((prev) => ({
      ...prev,
      x: state.current.x,
      y: state.current.y
    }));
  };

  const onPointerUp = () => {
    state.current.isDragging = false;
    state.current.lastInputTime = Date.now();
  };

  const onWheel = (e) => {
    e.preventDefault?.();
    state.current.lastInputTime = Date.now();
    const delta = -e.deltaY;
    const zoom = delta > 0 ? 1.06 : 0.94;
    const nextScale = clamp(state.current.scale * zoom, MIN_SCALE, MAX_SCALE);
    state.current.scale = nextScale;
    setTransform((prev) => ({ ...prev, scale: nextScale }));
  };

  useEffect(() => {
    if (initializedRef.current) return;
    if (!initialTransform) return;
    state.current.x = initialTransform.x || 0;
    state.current.y = initialTransform.y || 0;
    state.current.scale = initialTransform.scale || 1;
    setTransform({
      x: state.current.x,
      y: state.current.y,
      scale: state.current.scale
    });
    initializedRef.current = true;
  }, [initialTransform]);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const s = state.current;
      const now = Date.now();

      if (!s.isDragging) {
        s.x += s.vx;
        s.y += s.vy;

        s.vx *= PHYSICS.FRICTION;
        s.vy *= PHYSICS.FRICTION;

        if (s.x < BOUNDS.minX) s.vx += (BOUNDS.minX - s.x) * PHYSICS.SPRING;
        else if (s.x > BOUNDS.maxX) s.vx += (BOUNDS.maxX - s.x) * PHYSICS.SPRING;

        if (s.y < BOUNDS.minY) s.vy += (BOUNDS.minY - s.y) * PHYSICS.SPRING;
        else if (s.y > BOUNDS.maxY) s.vy += (BOUNDS.maxY - s.y) * PHYSICS.SPRING;

        s.vx = clamp(s.vx, -PHYSICS.MAX_VELOCITY, PHYSICS.MAX_VELOCITY);
        s.vy = clamp(s.vy, -PHYSICS.MAX_VELOCITY, PHYSICS.MAX_VELOCITY);

        if (Math.abs(s.vx) < PHYSICS.TOLERANCE) s.vx = 0;
        if (Math.abs(s.vy) < PHYSICS.TOLERANCE) s.vy = 0;

        if (s.vx !== 0 || s.vy !== 0) {
          setTransform({ x: s.x, y: s.y, scale: s.scale });
        }
      }

      const idleMs = now - s.lastInputTime;
      const isPhysicallyStill =
        Math.abs(s.vx) < 0.5 && Math.abs(s.vy) < 0.5 && !s.isDragging;
      let targetStillness = 0;
      if (isPhysicallyStill && idleMs > STILL_DELAY) {
        targetStillness = clamp(
          (idleMs - STILL_DELAY) / (STILL_FULL - STILL_DELAY),
          0,
          1
        );
      }
      setStillnessLevel((prev) => {
        const next = prev + (targetStillness - prev) * 0.05;
        stillnessRef.current = next;
        return next;
      });

      if (mode !== "city") {
        const base = 0.35 * k;
        const mysticBoost = mode === "mystic" ? 0.25 + stillnessRef.current * 0.55 : 0.15;
        const amp = base * (0.35 + mysticBoost);
        const t = now * 0.001;
        const x = Math.sin(t * 0.9 + 10.2) * amp + Math.sin(t * 2.1) * (amp * 0.35);
        const y = Math.cos(t * 0.8 + 2.7) * amp + Math.sin(t * 1.7) * (amp * 0.25);
        setTremor({ x, y });
      } else {
        if (tremor.x !== 0 || tremor.y !== 0) setTremor({ x: 0, y: 0 });
      }

      if (mode === "city") {
        const sinceMove = now - lastMoveAt.current;
        const decay = sinceMove > 350 ? 0.92 : 0.98;
        driftVel.current.x *= decay;
        driftVel.current.y *= decay;

        const dx = clamp(drift.x + driftVel.current.x * 0.02, -18, 18);
        const dy = clamp(drift.y + driftVel.current.y * 0.02, -18, 18);

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
    tx: transform.x + tremor.x + drift.x,
    ty: transform.y + tremor.y + drift.y,
    scale: transform.scale,
    stillnessLevel,
    tremor,
    drift,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave: onPointerUp,
      onWheel
    }
  };
}
// World of Tethys || D.C. Barletta
