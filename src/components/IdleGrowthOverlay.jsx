'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const IDLE_TIMEOUT_MS = 45000;
const STAGE_TWO_MS = 90000;
const STAGE_THREE_MS = 150000;

export default function IdleGrowthOverlay() {
  const pathname = usePathname();
  const isEnabled = pathname?.startsWith('/mystics') || pathname?.startsWith('/map');
  const [idleMs, setIdleMs] = useState(0);
  const lastActiveRef = useRef(Date.now());

  useEffect(() => {
    if (!isEnabled) return undefined;
    const bump = () => {
      lastActiveRef.current = Date.now();
      setIdleMs(0);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => window.addEventListener(event, bump, { passive: true }));

    const timer = setInterval(() => {
      const elapsed = Date.now() - lastActiveRef.current;
      setIdleMs(elapsed);
    }, 1000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, bump));
      clearInterval(timer);
    };
  }, [isEnabled]);

  const stage = idleMs >= STAGE_THREE_MS ? 3 : idleMs >= STAGE_TWO_MS ? 2 : idleMs >= IDLE_TIMEOUT_MS ? 1 : 0;
  const isActive = stage > 0;

  if (!isEnabled) return null;

  return (
    <div
      className={`idle-growth ${isActive ? 'idle-growth--active' : ''}`}
      data-stage={stage}
      aria-hidden="true"
    >
      <div className="idle-growth__film" />
      <div className="idle-growth__algae" />
      <div className="idle-growth__moss" />
      <div className="idle-growth__spores" />
    </div>
  );
}

// World of Tethys || D.C. Barletta
