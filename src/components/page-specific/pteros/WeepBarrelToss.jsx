'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function WeepBarrelToss({
  size = 320,               // widget-friendly
  gravity = 1200,           // px/s^2
  onResult,                 // (result) => void
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTRef = useRef(0);

  // UI controls
  const [angleDeg, setAngleDeg] = useState(52);
  const [power, setPower] = useState(720);
  const [attempts, setAttempts] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return Number(localStorage.getItem('weep_best') || 0);
  });

  // Sim state (kept in refs to avoid rerender every frame)
  const simRef = useRef({
    running: false,
    landed: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    t: 0,
    clearCount: 0,
    result: null,
  });

  const W = size;
  const H = size;

  // --- Scene layout (big shapes for 320x320 readability)
  const scene = useMemo(() => {
    const margin = 14;

    // Launch ledge (top-left-ish)
    const launch = { x: margin + 26, y: H - 70 };

    // Three stakes (vertical cliffs)
    const stakes = [
      { x: W * 0.45, w: 10, h: 120 },
      { x: W * 0.56, w: 10, h: 140 },
      { x: W * 0.67, w: 10, h: 110 },
    ].map((s) => ({
      ...s,
      y: H - 38 - s.h,
    }));

    // Estuary landing zone (right-bottom)
    const estuary = {
      x: W * 0.72,
      y: H - 48,
      w: W * 0.22,
      h: 22,
    };

    // Waterfall strip (The Weep)
    const weep = {
      x: W * 0.28,
      y: 0,
      w: 44,
      h: H,
    };

    // Ground line
    const groundY = H - 38;

    return { margin, launch, stakes, estuary, weep, groundY };
  }, [W, H]);

  const resetBarrel = useCallback(() => {
    const s = simRef.current;
    s.running = false;
    s.landed = false;
    s.t = 0;
    s.clearCount = 0;
    s.result = null;
    s.x = scene.launch.x;
    s.y = scene.launch.y;
    s.vx = 0;
    s.vy = 0;
  }, [scene.launch.x, scene.launch.y]);

  useEffect(() => {
    resetBarrel();
  }, [resetBarrel]);

  const toss = useCallback(() => {
    const s = simRef.current;
    if (s.running) return;

    const rad = (angleDeg * Math.PI) / 180;
    s.x = scene.launch.x;
    s.y = scene.launch.y;
    s.vx = Math.cos(rad) * power;
    s.vy = -Math.sin(rad) * power; // up is negative
    s.running = true;
    s.landed = false;
    s.t = 0;
    s.clearCount = 0;
    s.result = null;

    setAttempts((a) => a + 1);
  }, [angleDeg, power, scene.launch.x, scene.launch.y]);

  const stepSim = useCallback(
    (dt) => {
      const s = simRef.current;
      if (!s.running) return;

      // Integrate
      s.vy += gravity * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.t += dt;

      // Count clears (passed stake x while above its top)
      for (const stake of scene.stakes) {
        const stakeTopY = stake.y;
        if (
          s.x > stake.x + stake.w / 2 &&
          s.x - s.vx * dt <= stake.x + stake.w / 2 // crossed this frame
        ) {
          if (s.y < stakeTopY) s.clearCount += 1;
        }
      }

      // Ground / landing check
      const barrelR = 7;
      const groundY = scene.groundY;

      if (s.y + barrelR >= groundY) {
        s.y = groundY - barrelR;
        s.running = false;
        s.landed = true;

        const inEstuary =
          s.x >= scene.estuary.x &&
          s.x <= scene.estuary.x + scene.estuary.w;

        const clearedAll = s.clearCount >= 3;

        const score =
          (inEstuary ? 100 : 0) +
          (clearedAll ? 60 : s.clearCount * 15) +
          Math.max(0, Math.round((s.x / W) * 40));

        const result = {
          inEstuary,
          cleared: s.clearCount,
          clearedAll,
          score,
          x: s.x,
        };

        s.result = result;

        // local best
        setBest((prev) => {
          const next = Math.max(prev, score);
          try {
            localStorage.setItem('weep_best', String(next));
          } catch {}
          return next;
        });

        onResult?.(result);
      }

      // Out of bounds
      if (s.x > W + 60 || s.y > H + 80) {
        s.running = false;
        s.landed = true;
        s.result = { inEstuary: false, cleared: s.clearCount, clearedAll: false, score: 0, x: s.x };
        onResult?.(s.result);
      }
    },
    [gravity, onResult, scene, W, H]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Background (dark forge / teal mist vibe)
    ctx.fillStyle = '#060708';
    ctx.fillRect(0, 0, W, H);

    // Water (estuary / sea)
    ctx.fillStyle = '#0a2a33';
    ctx.fillRect(0, scene.groundY, W, H - scene.groundY);

    // The Weep waterfall
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#0aa6b8';
    ctx.fillRect(scene.weep.x, 0, scene.weep.w, H);
    ctx.globalAlpha = 1;

    // Mist lines
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#7dd3fc';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 26 + i * 38);
      ctx.bezierCurveTo(W * 0.25, 18 + i * 38, W * 0.6, 40 + i * 38, W, 24 + i * 38);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Ground shelf
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(0, scene.groundY, W, 3);

    // Stakes (cliffs)
    for (const stake of scene.stakes) {
      ctx.fillStyle = '#2b2b2b';
      ctx.fillRect(stake.x, stake.y, stake.w, stake.h);

      // ember edge highlight
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#ff7a18';
      ctx.fillRect(stake.x + stake.w - 2, stake.y, 2, stake.h);
      ctx.globalAlpha = 1;
    }

    // Estuary landing zone
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(scene.estuary.x, scene.estuary.y, scene.estuary.w, scene.estuary.h);
    ctx.globalAlpha = 1;

    // Launch ledge
    ctx.fillStyle = '#242424';
    ctx.fillRect(scene.launch.x - 24, scene.launch.y + 8, 54, 18);

    // Barrel
    const s = simRef.current;
    const barrelR = 7;
    ctx.beginPath();
    ctx.arc(s.x, s.y, barrelR, 0, Math.PI * 2);
    ctx.fillStyle = '#c7a36b';
    ctx.fill();

    // Barrel outline
    ctx.strokeStyle = '#1f1f1f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Aim line (when not running)
    if (!s.running) {
      const rad = (angleDeg * Math.PI) / 180;
      const ax = scene.launch.x + Math.cos(rad) * 42;
      const ay = scene.launch.y - Math.sin(rad) * 42;

      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scene.launch.x, scene.launch.y);
      ctx.lineTo(ax, ay);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Result badge
    if (s.result) {
      const { score, inEstuary, cleared } = s.result;
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = '#000000';
      ctx.fillRect(10, 10, W - 20, 52);
      ctx.globalAlpha = 1;

      ctx.fillStyle = inEstuary ? '#34d399' : '#fbbf24';
      ctx.font = 'bold 12px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(inEstuary ? 'SPLASHDOWN: ESTUARY' : 'MISS: TRY AGAIN', 18, 30);

      ctx.fillStyle = '#93c5fd';
      ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(`Cleared: ${cleared}/3   Score: ${score}   Best: ${best}`, 18, 48);
    }
  }, [W, H, angleDeg, best, scene]);

  // Main loop
  useEffect(() => {
    const tick = (t) => {
      if (!lastTRef.current) lastTRef.current = t;
      const dt = clamp((t - lastTRef.current) / 1000, 0, 0.033);
      lastTRef.current = t;

      stepSim(dt);
      draw();

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [draw, stepSim]);

  return (
    <div className="w-[320px] rounded-xl overflow-hidden border border-cyan-900/50 bg-black shadow-[0_0_20px_rgba(34,211,238,0.12)]">
      <canvas ref={canvasRef} width={W} height={H} />

      <div className="p-3 bg-[#050608] border-t border-cyan-900/40">
        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300/80">
          <span>WEEP BARREL TOSS</span>
          <span>Attempts: {attempts}</span>
        </div>

        <div className="mt-2 space-y-2">
          <label className="block text-[10px] font-mono text-stone-300">
            Angle: {angleDeg}°
            <input
              className="w-full"
              type="range"
              min={20}
              max={75}
              value={angleDeg}
              onChange={(e) => setAngleDeg(Number(e.target.value))}
            />
          </label>

          <label className="block text-[10px] font-mono text-stone-300">
            Power: {power}
            <input
              className="w-full"
              type="range"
              min={420}
              max={980}
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
            />
          </label>

          <button
            onClick={toss}
            className="w-full py-2 text-[11px] font-bold tracking-widest rounded bg-cyan-900/30 text-cyan-200 border border-cyan-800 hover:bg-cyan-900/45"
          >
            TOSS
          </button>

          <button
            onClick={resetBarrel}
            className="w-full py-2 text-[11px] font-mono rounded bg-stone-900/40 text-stone-300 border border-stone-700 hover:bg-stone-900/60"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
