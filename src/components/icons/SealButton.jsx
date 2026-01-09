// src/components/icons/SealButton.jsx
import React, { useMemo, useState } from "react";
import { Seal } from "./Seal";
import {
  GlyphWatcherVolcano,
  GlyphPteros,
  GlyphIronwood,
  GlyphPith,
  GlyphMammothHand,
  GlyphMountShastea,
  GlyphCambria,
  GlyphTwinStraits,
  GlyphDenisova,
  GlyphCimmeria,
  GlyphGargantuaArchipelago,
  GlyphSkyCity,
} from "./tethysGlyphs";

const GLYPHS = {
  watcher: GlyphWatcherVolcano,
  pteros: GlyphPteros,
  ironwood: GlyphIronwood,
  pith: GlyphPith,
  mammoth: GlyphMammothHand,
  shastea: GlyphMountShastea,
  cambria: GlyphCambria,
  twin_straits: GlyphTwinStraits,
  denisova: GlyphDenisova,
  cimmeria: GlyphCimmeria,
  gargantua: GlyphGargantuaArchipelago,
  skycity: GlyphSkyCity,
};

export function SealButton({
  kind,
  active = false,
  size = 72,
  onClick,
  title,
  className = "",
}) {
  const [hover, setHover] = useState(false);
  const state = active ? "active" : hover ? "hover" : "idle";

  const Glyph = useMemo(() => GLYPHS[kind], [kind]);
  if (!Glyph) return null;

  const stroke = active ? "#fde68a" : hover ? "#99f6e4" : "#cbd5e1";
  const fill = active ? "#fde68a" : hover ? "#99f6e4" : "#cbd5e1";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center justify-center rounded-full outline-none focus:ring-2 focus:ring-emerald-400/40 ${className}`}
    >
      <Seal size={size} state={state} title={title}>
        {/* inner glyph */}
        <g transform="translate(0,0)">
          {kind === "pith" ? <Glyph fill={fill} /> : <Glyph stroke={stroke} />}
        </g>

        {/* Pith: ring appears on hover (your requirement) */}
        {kind === "pith" && hover && !active && (
          <circle cx="50" cy="54" r="10" fill="none" stroke="#99f6e4" strokeWidth="2" opacity="0.8" />
        )}
      </Seal>
    </button>
  );
}
// World of Tethys || D.C. Barletta
