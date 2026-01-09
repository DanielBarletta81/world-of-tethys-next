# STAMP SYSTEM — FIELD VERIFICATION (NOT DECORATION)

Doctrine: A stamp proves contact, not control. Imperfect, not fully opaque, never perfectly centered, never continuously animated, can be partial/smudged/double-hit. Answers only: “Was someone here long enough to notice?”

Region taxonomy:
- Mynz (dwarf): broken concentric marks, off-axis, gaps where pressure skipped. Meaning: scale mismatch detected.
- Borok Deep (giant): thick perimeter, hollow/unfinished center. Meaning: presence acknowledged, not returned.
- Bronthel (fire pines): vertical scoring, heat fractures, no circles. Meaning: time recorded in burns.
- Dier Lake (salt basin): evaporative rings, crystalline edges, uneven density. Meaning: abundance without depth.
- Watcher Flats / Sulfur Crown: radial stress lines, partial collapse, faint ember tint (never glow). Meaning: pressure without release.
- Cambria (ruins): broken geometry, missing segments, repeated imprint attempts. Meaning: history resisting legibility.

SVG construction rules:
- Stroke-only, rounded caps, slight path noise, single color at render. Base 96×96, viewBox 0 0 96 96. No text ever.

Dynamic wear/degradation:
- Inputs: timeSinceStamp, envPressure, pathType, regionHazard.
- Effects: opacity decay, stroke dash offset, slight rotation, partial masking.
- Example classes: `.stamp-worn { opacity: 0.6; stroke-dasharray: 2 4; }` and `.stamp-unstable { transform: rotate(-1.5deg) translate(1px,-1px); }`

VR-safe rules:
- Stamp is part of the page; no floating, no hover glow, no parallax. Clarity increases with proximity; never snaps to focus. Use material opacity, not animation.

Path-based appearance (same SVG):
- City: cleaner, lighter ink.
- Wild: smudged, partial.
- Mystic: ink bleed + organic warp.

Drop-in SVGs (96 viewBox, stroke-width tuned per region):
- Mynz:
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
    <circle cx="48" cy="48" r="32" stroke-dasharray="6 4" />
    <circle cx="48" cy="48" r="18" stroke-dasharray="2 6" />
    <path d="M48 16v8M48 72v8M16 48h8M72 48h8" opacity="0.5"/>
  </g>
</svg>
```
- Borok Deep:
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="3" fill="none">
    <rect x="14" y="14" width="68" height="68" rx="10"/>
    <circle cx="48" cy="48" r="18" opacity="0.3"/>
  </g>
</svg>
```
- Watcher Flats:
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <circle cx="48" cy="48" r="30"/>
    <path d="M48 18v60M18 48h60" opacity="0.4"/>
    <path d="M32 32l32 32M64 32L32 64" opacity="0.2"/>
  </g>
</svg>
```
- Cambria:
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <path d="M20 48h20M56 48h20"/>
    <path d="M48 20v20M48 56v20"/>
    <rect x="28" y="28" width="40" height="40" rx="4" opacity="0.4"/>
  </g>
</svg>
```

Final lock: A stamp does not mean the place is known. It means it refused to stay unknown.

World of Tethys || D.C. Barletta
