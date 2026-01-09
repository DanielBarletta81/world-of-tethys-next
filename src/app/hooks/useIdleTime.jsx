"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks user inactivity (mouse, key, touch).
 * Returns idleMinutes (float) and idleMs.
 * Client-only. No persistence.
 */
export default function useIdleTime({
  throttleMs = 1000,
  idleAfterMs = 0, // no threshold; pure duration
} = {}) {
  const lastInputAt = useRef(Date.now());
  const [idleMs, setIdleMs] = useState(0);

  useEffect(() => {
    let raf;
    let lastTick = 0;

    const markActive = () => {
      lastInputAt.current = Date.now();
    };

    const tick = (t) => {
      if (t - lastTick >= throttleMs) {
        const now = Date.now();
        setIdleMs(Math.max(0, now - lastInputAt.current));
        lastTick = t;
      }
      raf = requestAnimationFrame(tick);
    };

    // User activity listeners
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "wheel"];
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    raf = requestAnimationFrame(tick);

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActive));
      cancelAnimationFrame(raf);
    };
  }, [throttleMs]);

  return {
    idleMs,
    idleMinutes: idleMs / 60000,
  };
}
