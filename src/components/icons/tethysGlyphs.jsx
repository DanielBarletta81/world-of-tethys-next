// src/components/icons/tethysGlyphs.jsx
import React from "react";

/** Watcher Volcano: cone + ember vent */
export function GlyphWatcherVolcano({ stroke = "#e2e8f0" }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
      <path d="M30 70 L50 34 L70 70 Z" />
      <path d="M46 40 C48 37 52 37 54 40" />
      <path d="M50 30 V24" />
      <path d="M48 24 C47 21 49 18 50 16 C51 18 53 21 52 24" />
      <path d="M28 70 H72" />
    </g>
  );
}

/** Pteros Island: ptero silhouette simplified (wings + beak) */
export function GlyphPteros({ stroke = "#e2e8f0" }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
      <path d="M25 58 C34 48 42 44 50 44 C58 44 66 48 75 58" />
      <path d="M50 44 C48 54 44 62 38 68" />
      <path d="M50 44 C52 54 56 62 62 68" />
      <path d="M52 46 L66 42" />
      <path d="M66 42 L74 44" />
    </g>
  );
}

/** Ironwood: root-vein spiral + trunk */
export function GlyphIronwood({ stroke = "#e2e8f0" }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
      <path d="M50 70 V42" />
      <path d="M50 42 C46 38 42 36 36 34" />
      <path d="M50 42 C54 38 58 36 64 34" />
      <path d="M50 70 C40 70 34 64 34 58 C34 52 40 48 46 48" />
      <path d="M50 70 C60 70 66 64 66 58 C66 52 60 48 54 48" />
      <path d="M46 48 C42 48 40 46 38 44" />
      <path d="M54 48 C58 48 60 46 62 44" />
    </g>
  );
}

/** Pith: two dots; hover adds ring handled elsewhere */
export function GlyphPith({ fill = "#e2e8f0" }) {
  return (
    <g opacity="0.9">
      <circle cx="44" cy="54" r="2.8" fill={fill} />
      <circle cx="56" cy="54" r="2.8" fill={fill} />
    </g>
  );
}

/** Mammoth Hand Island: palm silhouette */
export function GlyphMammothHand({ stroke = "#e2e8f0" }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
      <path d="M40 70 C38 62 38 52 40 44" />
      <path d="M60 70 C62 62 62 52 60 44" />
      <path d="M40 44 C42 36 46 32 50 30 C54 32 58 36 60 44" />
      <path d="M38 54 C30 52 28 48 28 44 C28 40 30 38 34 38" />
      <path d="M62 54 C70 52 72 48 72 44 C72 40 70 38 66 38" />
      <path d="M38 70 H62" />
    </g>
  );
}

/** Mount Shastea: mesa + ridge lines */
export function GlyphMountShastea({ stroke = "#e2e8f0" }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
      <path d="M28 70 H72" />
      <path d="M32 70 C36 58 42 50 50 44 C58 50 64 58 68 70" />
      <path d="M40 60 H60" />
      <path d="M44 54 H56" />
    </g>
  );
}

/** Cambria: stepped cliff-terraces + fall line */
export function GlyphCambria({ stroke = "#e2e8f0" }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
      <path d="M30 68 H70" />
      <path d="M34 62 H66" />
      <path d="M38 56 H62" />
      <path d="M42 50 H58" />
      <path d="M50 34 V68" />
    </g>
  );
}


/** Twin Straits of Dier: two narrow channels + central split ridge (reads at 24px) */
export function GlyphTwinStraits({ stroke = "#e2e8f0" }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      {/* left pinch */}
      <path d="M30 72 V30 C30 28 32 26 34 27 L46 33 C49 34 49 40 46 41 L38 46 C35 48 34 50 34 54 V72" />
      {/* right pinch */}
      <path d="M70 72 V30 C70 28 68 26 66 27 L54 33 C51 34 51 40 54 41 L62 46 C65 48 66 50 66 54 V72" />
      {/* channel split marker */}
      <path d="M50 28 V72" />
      {/* two straits “seams” */}
      <path d="M46 36 C44 44 44 52 46 60" />
      <path d="M54 36 C56 44 56 52 54 60" />
    </g>
  );
}

/** Denisova: cliff teeth + canyon notch (rugged, human-wild border) */
export function GlyphDenisova({ stroke = "#e2e8f0" }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      {/* jagged ridge */}
      <path d="M28 66 L34 54 L40 60 L46 46 L52 58 L58 44 L64 58 L70 50 L72 66" />
      {/* canyon cut */}
      <path d="M50 34 V66" />
      <path d="M46 40 H54" />
      <path d="M44 48 H56" />
      <path d="M42 56 H58" />
    </g>
  );
}

/** Cimmeria: long mountain spine + two secondary ridges */
export function GlyphCimmeria({ stroke = "#e2e8f0" }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      {/* primary spine */}
      <path d="M28 70 C34 58 40 52 50 42 C60 52 66 58 72 70" />
      {/* secondary ridges */}
      <path d="M34 62 C38 56 42 52 50 46" />
      <path d="M66 62 C62 56 58 52 50 46" />
      {/* base line (readable “range”) */}
      <path d="M30 70 H70" />
    </g>
  );
}

/** Gargantua Archipelago: three major islands + outer chain dots (no “giant” implication) */
export function GlyphGargantuaArchipelago({ stroke = "#e2e8f0", fill = "#e2e8f0" }) {
  return (
    <g opacity="0.92">
      {/* 3 primary islands */}
      <path d="M38 62 C33 60 32 54 36 50 C40 46 48 48 48 54 C48 60 43 64 38 62 Z" fill="none" stroke={stroke} strokeWidth="2.6" />
      <path d="M62 62 C57 60 56 54 60 50 C64 46 72 48 72 54 C72 60 67 64 62 62 Z" fill="none" stroke={stroke} strokeWidth="2.6" />
      <path d="M50 44 C46 42 45 36 49 33 C53 30 58 33 58 37 C58 41 54 46 50 44 Z" fill="none" stroke={stroke} strokeWidth="2.6" />

      {/* surrounding chain (balanced) */}
      <circle cx="30" cy="52" r="1.6" fill={fill} />
      <circle cx="28" cy="60" r="1.4" fill={fill} />
      <circle cx="72" cy="44" r="1.6" fill={fill} />
      <circle cx="74" cy="60" r="1.4" fill={fill} />
      <circle cx="50" cy="70" r="1.5" fill={fill} />
    </g>
  );
}

/** Sky City: aqueduct arc + lantern pillar + three tier blocks (your motif token: lantern/aqueduct) */
export function GlyphSkyCity({ stroke = "#e2e8f0", ember = "#fde68a" }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
      {/* aqueduct arc */}
      <path d="M26 58 C34 44 66 44 74 58" stroke={stroke} strokeWidth="2.6" />
      {/* tiers */}
      <path d="M34 66 H66" stroke={stroke} strokeWidth="2.6" />
      <path d="M38 60 H62" stroke={stroke} strokeWidth="2.6" />
      <path d="M42 54 H58" stroke={stroke} strokeWidth="2.6" />
      {/* pillar */}
      <path d="M50 54 V72" stroke={stroke} strokeWidth="2.6" />
      {/* lantern ember (small, controlled) */}
      <path
        d="M50 32 C54 36 56 40 54 46 C52 50 50 52 50 56 C50 52 48 50 46 46 C44 40 46 36 50 32 Z"
        fill={ember}
        stroke={stroke}
        strokeWidth="1.8"
      />
    </g>
  );
}
