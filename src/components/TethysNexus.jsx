// src/components/TethysNexus.jsx
'use client';

 import React, { useEffect, useMemo, useRef, useState } from 'react';
 import { useTethys } from '@/context/TethysContext';
 import Image from 'next/image';
/**
 * TethysNexus (Doctrine-compliant)
 * - No labels, no pins, no nodes.
 * - Stillness reveals slightly more; motion costs; comfort decays.
 *
 * Assets (place in /public/maps):
 *  - /maps/tethys-atlas-clean.webp   (UNLABELED, the actual usable atlas viewport)
 *  - /maps/tethys-relief-ghost.webp  (your cinematic labeled maps OK here; keep blurred + low opacity)
 *  - /maps/tethys-mist-noise.webp    (subtle noise / mist texture)
 *  - /maps/tethys-ember-scar.webp    (subtle localized ember “wound” overlay)
 */

export default function TethysNexus({
  atlasUrl = '/maps/tethys-atlas-clean.webp',
  reliefUrl = '/maps/tethys-relief-ghost.webp',
  mistUrl = '/maps/tethys-mist-noise.webp',
  emberUrl = '/maps/tethys-ember-scar.webp',
}) {
  const { unlockedNodes, currentLocation, travelTo } = useTethys();
  const shellRef = useRef(null);
  const confirmedNodeRef = useRef(null);
  const svgRef = useRef(null);


useEffect(() => {
  if (offerTravel && focusNode) {
    confirmedNodeRef.current = focusNode;
  }
  if (!offerTravel) {
    confirmedNodeRef.current = null;
  }
}, [offerTravel, focusNode]);
  // Viewport transform
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [scale, setScale] = useState(1);

  // Size tracking (for center → normalized world coords)
  const [size, setSize] = useState({ w: 1, h: 1 });
  // Initialize performance timing refs on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const now = performance.now();
      if (t0.current === null) t0.current = now;
      if (lastInputAt.current === null) lastInputAt.current = now;
      if (lastFocusTick.current === null) lastFocusTick.current = now;
    }
  }, []);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pith physics state
  const t0 = useRef(null);
  const lastInputAt = useRef(null);
  const dragStartAt = useRef(null);
  const restStartAt = useRef(null);

  const dragging = useRef(false);
  const lastPt = useRef(null);

  const [stillnessLevel, setStillnessLevel] = useState(0); // 0..1
  const [friction, setFriction] = useState(1.0);
  const [panSpeed, setPanSpeed] = useState(1.0);
  const [cursorLagMs, setCursorLagMs] = useState(0);
  const [costVignette, setCostVignette] = useState(0);
  const [focusNode, setFocusNode] = useState(null);
  const [offerTravel, setOfferTravel] = useState(false);
  const focusHeldMs = useRef(0);
  const lastFocusTick = useRef(null);
  const [calibrate, setCalibrate] = useState(false);
  const [draftGates, setDraftGates] = useState([]); // {id,x,y,r}
  const [draftRadius, setDraftRadius] = useState(0.10);
  const [draftId, setDraftId] = useState('sky-city');
  const [lockedFocus, setLockedFocus] = useState(false);
  const [draggingFrag, setDraggingFrag] = useState(null);

  const [fragments, setFragments] = useState(
  MAP_FRAGMENTS.map(f => ({
    ...f,
    pos: { x: Math.random(), y: Math.random() },
    snapped: false
  }))
);


  // --- Doctrine constants  ---
  const CFG = useMemo(() => ({
    // Half-Eye (stillness → clarity)
    STILL_DELAY: 1800,
    STILL_FULL: 2600,
    STILL_FADEOUT: 400,

    // Split Leaf (fast start penalty; sustained earns cooperation)
    FAST_START_WINDOW: 500,
    FAST_FRICTION: 1.35,
    FAST_SPEED: 0.75,
    FAST_LAG: 20,

    SUSTAINED_MS: 700,
    SUSTAINED_FRICTION: 0.85,
    SUSTAINED_SPEED: 1.1,

    // Offset Notch (rest zoom band)
    MIN_SCALE: 0.92,
    MAX_SCALE: 2.35,
    REST_SCALE: 1.55,
    REST_BAND: 0.10, // +/- around rest
    REST_ENTER_MS: 500,
    LINGER_1: 5000,
    LINGER_2: 9000,
    LINGER_3: 12000,

    // Fade Ring (cost zones; normalized 0..1 world coords)
         COST_ZONES: [
       { id: 'runoff', x: 0.22, y: 0.62, r: 0.14 },
       { id: 'strait', x: 0.50, y: 0.52, r: 0.11 },
       { id: 'volc',   x: 0.68, y: 0.32, r: 0.12 },
     ],
// Invisible region gates (never rendered, never labeled)
    REGION_GATES: [
      { id: 'pteros',         x: 0.50, y: 0.56, r: 0.12 },
      { id: 'sky-city',       x: 0.20, y: 0.70, r: 0.11 },
      { id: 'iron-sands',     x: 0.78, y: 0.74, r: 0.10 },
      { id: 'strait-of-dier', x: 0.52, y: 0.44, r: 0.12 },
    ],

    TRAVEL_STILLNESS_MIN: 0.85,
    TRAVEL_HOLD_MS: 1800,
  }), []);


// CFG.MAP_FRAGMENTS
 const MAP_FRAGMENTS = [
  {
    id: "sky_city_frag",
    region: "sky-city",
    anchor: { x: 0.62, y: 0.21 }, // normalized world coords
    radius: 0.06,
    svgPath: "/fragments/sky_city.svg",
    locked: false
  },
  {
    id: "ironwoods_frag",
    region: "ironwoods",
    anchor: { x: 0.41, y: 0.58 },
    radius: 0.07,
    svgPath: "/fragments/ironwoods.svg",
    locked: false
  }
];
// helpers

const SNAP_DISTANCE = 0.035; // normalized units


function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

useEffect(() => {
  if (!offerTravel) return;

  setFragments(frags =>
    frags.map(f => {
      if (f.snapped) return f;

      const d = dist(f.pos, f.anchor);

      if (d < SNAP_DISTANCE) {
        return {
          ...f,
          pos: { ...f.anchor },
          snapped: true,
          locked: true
        };
      }

      return f;
    })
  );
}, [offerTravel]);

function onFragDown(id) {
  setDraggingFrag(id);
}

function onFragUp() {
  setDraggingFrag(null);
}

function onFragMove(e) {
  if (!draggingFrag) return;

  const rect = svgRef.current.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;

  setFragments(frags =>
    frags.map(f =>
      f.id === draggingFrag && !f.locked
        ? { ...f, pos: { x, y } }
        : f
    )
  );
}


  const registerInput = () => {
    if (typeof window !== 'undefined') {
      lastInputAt.current = performance.now();
    }
  };

  // Compute a rough "world center" (0..1, 0..1) based on tx/ty/scale.
  // This doesn't need to be perfect; it only needs to be consistent.
  const worldCenter01 = useMemo(() => {
    if (typeof window === 'undefined') {
      return { x: 0.5, y: 0.5 }; // Default during SSR
    }
    
    // Assume the atlas image covers the shell. Translate moves the image; center is inverse.
    // We map viewport center back into atlas space (approx).
    const cx = size.w / 2;
    const cy = size.h / 2;

    const atlasX = (cx - tx) / Math.max(0.0001, scale * size.w);
    const atlasY = (cy - ty) / Math.max(0.0001, scale * size.h);

    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    return {
      x: clamp01(atlasX),
      y: clamp01(atlasY),
    };
  }, [tx, ty, scale, size.w, size.h]);

  // Region gate detection
  useEffect(() => {
    const gate = CFG.REGION_GATES.find((g) => {
      const dx = worldCenter01.x - g.x;
      const dy = worldCenter01.y - g.y;
      return dx * dx + dy * dy <= g.r * g.r;
    });

    setFocusNode(gate?.id ?? null);

    // reset offer when focus changes
    setOfferTravel(false);
    focusHeldMs.current = 0;
    lastFocusTick.current = performance.now();
  }, [worldCenter01, CFG.REGION_GATES]);



useEffect(() => {
  if (!focusNode) {
    setLockedFocus(false);
    return;
  }

  const unlocked = unlockedNodes?.includes(focusNode);
  setLockedFocus(!unlocked);
}, [focusNode, unlockedNodes]);


useEffect(() => {
  if (lockedFocus) {
    setFriction((f) => Math.max(f, 1.25));
    setPanSpeed((s) => Math.min(s, 0.9));
  }
}, [lockedFocus]);


useEffect(() => {
  if (!currentLocation) return;

  const gate = CFG.REGION_GATES.find(g => g.id === currentLocation);
  if (!gate) return;

  const targetX = size.w * (0.5 - gate.x * scale);
  const targetY = size.h * (0.5 - gate.y * scale);

  setTx(targetX);
  setTy(targetY);
}, [currentLocation, CFG.REGION_GATES, size.w, size.h, scale]);




useEffect(() => {
  // only enable with ?calibrate=1
  if (typeof window === 'undefined') return;
  const on = new URLSearchParams(window.location.search).get('calibrate') === '1';
  setCalibrate(on);
}, []);




  // Cost zone check
  useEffect(() => {
    const inZone = CFG.COST_ZONES.some((z) => {
      const dx = worldCenter01.x - z.x;
      const dy = worldCenter01.y - z.y;
      return dx * dx + dy * dy <= z.r * z.r;
    });

    setCostVignette(inZone ? 1 : 0);

    if (inZone) {
      // cost without blocking; never “hard lock”
      setFriction((prev) => Math.max(prev, 1.15));
      setPanSpeed((prev) => Math.min(prev, 0.95));
    }
  }, [worldCenter01, CFG.COST_ZONES]);

  // Main loop: stillness + sustained motion + rest decay
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let raf = 0;

    const tick = () => {
      const now = performance.now();
      if (!lastInputAt.current) lastInputAt.current = now;
      
      const idleFor = now - lastInputAt.current;

      // Half-Eye: stillness builds
      if (!dragging.current) {
        if (idleFor >= CFG.STILL_DELAY) {
          const t = clamp01((idleFor - CFG.STILL_DELAY) / (CFG.STILL_FULL - CFG.STILL_DELAY));
          setStillnessLevel(t);
        } else {
          // fade out quickly when input returns
          setStillnessLevel((prev) => {
            if (prev <= 0) return 0;
            const dec = 16 / CFG.STILL_FADEOUT;
            return Math.max(0, prev - dec);
          });
        }
      }

      // Split Leaf: sustained drag earns cooperation
      if (dragging.current && dragStartAt.current) {
        const dragFor = now - dragStartAt.current;
        if (dragFor >= CFG.SUSTAINED_MS) {
          setFriction(CFG.SUSTAINED_FRICTION);
          setPanSpeed(CFG.SUSTAINED_SPEED);
          setCursorLagMs(0);
        }
      }

      // Offset Notch: rest band + linger decay
      const inRestBand = Math.abs(scale - CFG.REST_SCALE) <= CFG.REST_BAND;
      if (inRestBand) {
        if (!restStartAt.current) restStartAt.current = now;

        const tRest = now - restStartAt.current;

        if (tRest > CFG.REST_ENTER_MS) {
          setFriction((prev) => Math.min(prev, 0.8));
          setPanSpeed((prev) => Math.max(prev, 1.05));
        }

        if (tRest > CFG.LINGER_1) setFriction((prev) => Math.max(prev, 1.1));
        if (tRest > CFG.LINGER_2) setCursorLagMs(30);
        if (tRest > CFG.LINGER_3) setPanSpeed((prev) => Math.min(prev, 0.85));
      } else {
        restStartAt.current = null;
        setCursorLagMs((prev) => (prev === 30 ? 0 : prev));
        // Allow friction/speed to drift back toward baseline gently
        setFriction((prev) => lerp(prev, 1.0, 0.06));
        setPanSpeed((prev) => lerp(prev, 1.0, 0.06));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [CFG, scale]);

  // Pointer handlers (pan)
  const onPointerDown = (e) => {
    const el = shellRef.current;
    if (!el) return;

    el.setPointerCapture(e.pointerId);
    registerInput();

    dragging.current = true;
    dragStartAt.current = performance.now();
    lastPt.current = { x: e.clientX, y: e.clientY };

    // Fast-start penalty (only right after mount)
    const now = performance.now();
    if (now - t0.current < CFG.FAST_START_WINDOW) {
      setFriction(CFG.FAST_FRICTION);
      setPanSpeed(CFG.FAST_SPEED);
      setCursorLagMs(CFG.FAST_LAG);
    } else {
      setCursorLagMs(0);
      setFriction(1.0);
      setPanSpeed(1.0);
    }
  };

  const onPointerMove = (e) => {
    if (!dragging.current || !lastPt.current) return;
    registerInput();

    const dxRaw = e.clientX - lastPt.current.x;
    const dyRaw = e.clientY - lastPt.current.y;
    lastPt.current = { x: e.clientX, y: e.clientY };

    const dx = (dxRaw * panSpeed) / friction;
    const dy = (dyRaw * panSpeed) / friction;

    // Optional micro-lag (unsettling, subtle)
    if (cursorLagMs > 0) {
      // cheap lag: smaller step per move (feels delayed without timers)
      setTx((v) => v + dx * 0.6);
      setTy((v) => v + dy * 0.6);
    } else {
      setTx((v) => v + dx);
      setTy((v) => v + dy);
    }
  };

  const endDrag = () => {
    dragging.current = false;
    dragStartAt.current = null;
    lastPt.current = null;
    setCursorLagMs(0);
  };

  // Wheel handlers (zoom). Trackpad micro-scroll ignored.
  const onWheel = (e) => {
    registerInput();
    if (Math.abs(e.deltaY) < 12) return;

    const zoomFactor = e.deltaY > 0 ? 0.98 : 1.02;

    setScale((prev) => {
      const next = clamp(prev * zoomFactor, CFG.MIN_SCALE, CFG.MAX_SCALE);
      return next;
    });
  };

const captureGateAtCenter = () => {
  const gate = {
    id: draftId,
    x: Number(worldCenter01.x.toFixed(4)),
    y: Number(worldCenter01.y.toFixed(4)),
    r: Number(draftRadius.toFixed(4)),
  };

  setDraftGates((prev) => {
    // replace if same id exists
    const without = prev.filter((g) => g.id !== gate.id);
    return [...without, gate].sort((a, b) => a.id.localeCompare(b.id));
  });
};

useEffect(() => {
  if (!calibrate) return;

  const onKeyDown = (e) => {
    if (e.key === 'Enter') captureGateAtCenter();   // save gate at center
    if (e.key === 'Backspace') setDraftGates([]);   // clear all
    if (e.key === '[') setDraftRadius((r) => Math.max(0.02, +(r - 0.01).toFixed(4)));
    if (e.key === ']') setDraftRadius((r) => Math.min(0.30, +(r + 0.01).toFixed(4)));
  };

  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [calibrate, worldCenter01, draftId, draftRadius]);

  // --- Doctrine-safe travel permission ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let raf = 0;
    const checkTravel = () => {
      const now = performance.now();
      if (!lastFocusTick.current) lastFocusTick.current = now;
      
      const dt = now - lastFocusTick.current;
      lastFocusTick.current = now;

      const nodeUnlocked = focusNode && unlockedNodes?.includes(focusNode);
      const nodeNotCurrent = focusNode && focusNode !== currentLocation;

      if (
        focusNode &&
        nodeUnlocked &&
        nodeNotCurrent &&
        stillnessLevel >= CFG.TRAVEL_STILLNESS_MIN &&
        !dragging.current
      ) {
        focusHeldMs.current += dt;
        if (focusHeldMs.current >= CFG.TRAVEL_HOLD_MS) {
          setOfferTravel(true);
        }
      } else {
        focusHeldMs.current = Math.max(0, focusHeldMs.current - dt * 1.2);
        setOfferTravel(false);
      }
      
      raf = requestAnimationFrame(checkTravel);
    };
    
    raf = requestAnimationFrame(checkTravel);
    return () => cancelAnimationFrame(raf);
  }, [focusNode, unlockedNodes, currentLocation, stillnessLevel, CFG.TRAVEL_STILLNESS_MIN, CFG.TRAVEL_HOLD_MS]);

  // Doctrine visual modulation
  const reliefOpacity = 0.045 + stillnessLevel * 0.020; // +2% at full stillness
  const mistOpacity = 0.040 - stillnessLevel * 0.010;   // -1% at full stillness
  const emberOpacity = 0.060; // constant; never reactive

  return (
    <div className="relative w-full">
      <div
        ref={shellRef}
        className="relative w-full overflow-hidden rounded-lg border border-stone-800 bg-[#0d0f12]"
        style={{
          height: 560,
          touchAction: 'none',
          userSelect: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        aria-label="Tethys Atlas"
      >
        {/* BACKGROUND STACK (not interactive) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Abyss base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #0d0f12 0%, #161a1f 100%)',
            }}
          />

          {/* Relief ghost (your cinematic labeled images are OK here; keep blurred + low opacity) */}
          <div
            className="absolute -inset-[2%]"
            style={{
              backgroundImage: `url(${reliefUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: reliefOpacity,
              filter: 'blur(0.8px)',
              mixBlendMode: 'soft-light',
            }}
          />

          {/* Mist noise */}
          <div
            className="absolute -inset-[8%]"
            style={{
              backgroundImage: `url(${mistUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: mistOpacity,
              mixBlendMode: 'screen',
            }}
          />

          {/* Ember scar (Watcher wound) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${emberUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: emberOpacity,
              mixBlendMode: 'lighten',
            }}
          />

          {/* Cost vignette (Fade Ring) */}
          <div
            className="absolute inset-0"
            style={{
              opacity: costVignette,
              transition: 'opacity 600ms cubic-bezier(0.22, 0.61, 0.36, 1)',
              background:
                'radial-gradient(closest-side, transparent 55%, rgba(0,0,0,0.35) 100%)',
            }}
          />
        </div>

      {/* VIEWPORT: atlas + fragments move together */}
<div
  className="absolute inset-0 will-change-transform"
  style={{
    transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
    transformOrigin: 'center',
    transition: dragging.current
      ? 'none'
      : 'transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1)',
  }}
>
  {/* ATLAS */}
  <Image
    src={atlasUrl}
    alt=""
    draggable={false}
    className="w-full h-full object-cover opacity-[0.96]"
  />

  {/* SVG OVERLAY  */}
  <svg
    ref={svgRef}
    className="absolute inset-0"
    viewBox="0 0 100 100"
    onMouseMove={onFragMove}
    onMouseUp={onFragUp}
    onMouseLeave={onFragUp}
  >
    {fragments.map(f => (
      <g
        key={f.id}
        transform={`translate(${f.pos.x * 100} ${f.pos.y * 100})`}
        onMouseDown={() => onFragDown(f.id)}
        style={{
          cursor: f.locked ? 'default' : 'grab',
          opacity: f.snapped ? 1 : 0.85
        }}
      >
        {/* TEMP PLACEHOLDER */}
        <rect
          x="-6"
          y="-6"
          width="12"
          height="12"
          rx="2"
          fill={f.snapped ? '#d97706' : '#64748b'}
          opacity="0.8"
        />
      </g>
    ))}
  </svg>
</div>

   
 
        {/* Minimal HUD (Doctrine-safe): no instructions, no labels, no markers.
            This is optional; keep it extremely quiet. */}
        <div className="absolute left-4 bottom-4 text-[10px] uppercase tracking-[0.22em] text-stone-500 pointer-events-none">
          Atlas
        </div>
      </div>

  {calibrate && (
  <div className="absolute inset-0 pointer-events-none">
    {/* Center reticle */}
    <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 opacity-60">
      <div className="absolute left-1/2 top-0 w-px h-6 bg-stone-200/70 -translate-x-1/2" />
      <div className="absolute left-0 top-1/2 h-px w-6 bg-stone-200/70 -translate-y-1/2" />
    </div>

    {/* HUD */}
    <div className="absolute left-3 top-3 text-[11px] font-mono text-stone-200/80 bg-black/40 rounded px-2 py-1">
      <div>calibrate=1</div>
      <div>center x:{worldCenter01.x.toFixed(4)} y:{worldCenter01.y.toFixed(4)}</div>
      <div>r:{draftRadius.toFixed(4)} id:{draftId}</div>
      <div className="text-stone-300/70">Enter=save  [ ]=radius  Backspace=clear</div>
    </div>

    {/* JSON dump */}
    <div className="absolute left-3 bottom-3 right-3 text-[11px] font-mono text-stone-200/80 bg-black/40 rounded px-2 py-2 whitespace-pre-wrap">
      {`REGION_GATES: ${JSON.stringify(draftGates, null, 2)}`}
    </div>
  </div>
)}
{calibrate && (
  <div className="mt-2 flex items-center gap-2 text-xs">
    <label className="text-stone-400">Gate</label>
    <select
      value={draftId}
      onChange={(e) => setDraftId(e.target.value)}
      className="bg-black/40 border border-stone-700 text-stone-200 rounded px-2 py-1"
    >
      <option value="pteros">pteros</option>
      <option value="sky-city">sky-city</option>
      <option value="iron-sands">iron-sands</option>
      <option value="strait-of-dier">strait-of-dier</option>
    </select>
  </div>
)}

<div className="mt-3 flex items-center justify-between">
  <div className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
    Atlas
  </div>

 <button
  type="button"
  onClick={() => confirmedNodeRef.current && travelTo(confirmedNodeRef.current)}
  disabled={!offerTravel}
>
    Proceed
  </button>
</div>

   
    </div>



  );
}// utils
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function clamp01(v) {
  return clamp(v, 0, 1);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
