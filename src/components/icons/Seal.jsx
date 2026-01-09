// src/components/icons/Seal.jsx
import React from "react";

export function Seal({
  children,
  size = 64,
  state = "idle", // "idle" | "hover" | "active"
  className = "",
  title,
}) {
  const s = Number(size);

  // Tweak these 3 to fit your molten-lava dark mode
  const palette = {
    idle:   { ring: "#cbd5e1", metal1: "#1f2937", metal2: "#0b1220", glow: "rgba(16,185,129,0.15)" },
    hover:  { ring: "#e2e8f0", metal1: "#273244", metal2: "#0b1220", glow: "rgba(45,212,191,0.22)" },
    active: { ring: "#f8fafc", metal1: "#2b394f", metal2: "#0a0f1a", glow: "rgba(251,191,36,0.25)" },
  }[state];

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}

      <defs>
        {/* coin metal */}
        <radialGradient id={`metal-${state}`} cx="30%" cy="25%" r="80%">
          <stop offset="0%" stopColor={palette.metal1} />
          <stop offset="70%" stopColor={palette.metal2} />
          <stop offset="100%" stopColor="#05070d" />
        </radialGradient>

        {/* subtle relief shading */}
        <filter id={`relief-${state}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
          <feOffset in="blur" dx="-1" dy="-1" result="shadow1" />
          <feOffset in="blur" dx="1" dy="1" result="shadow2" />
          <feColorMatrix in="shadow1" type="matrix"
            values="0 0 0 0 0.0  0 0 0 0 0.0  0 0 0 0 0.0  0 0 0 .55 0" result="s1" />
          <feColorMatrix in="shadow2" type="matrix"
            values="0 0 0 0 1.0  0 0 0 0 1.0  0 0 0 0 1.0  0 0 0 .10 0" result="s2" />
          <feMerge>
            <feMergeNode in="s1" />
            <feMergeNode in="s2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* glow halo for hover/active */}
        <filter id={`glow-${state}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feColorMatrix in="b" type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0" />
        </filter>
      </defs>

      {/* outer halo */}
      {(state === "hover" || state === "active") && (
        <circle cx="50" cy="50" r="46" fill={palette.glow} filter={`url(#glow-${state})`} />
      )}

      {/* coin base */}
      <circle cx="50" cy="50" r="44" fill={`url(#metal-${state})`} />

      {/* double ring */}
      <circle cx="50" cy="50" r="44" fill="none" stroke={palette.ring} strokeOpacity="0.55" strokeWidth="2" />
      <circle cx="50" cy="50" r="39" fill="none" stroke={palette.ring} strokeOpacity="0.35" strokeWidth="2" />

      {/* glyph area (relief) */}
      <g filter={`url(#relief-${state})`}>
        {children}
      </g>
    </svg>
  );
}
