'use client';

export default function MapViewport({
  atlasUrl,
  reliefUrl,
  mistUrl,
  emberUrl,
  ashUrl,
  transform,
  children,
  fogPoints = [],
  bleedPoints = [], // NEW: [{x,y,r}] faint “false reveal”
  mode = "wild",
  truthProfile,
  watcherIntensity,                         // NEW: optional ash texture (or reuse mist)
  envPressure = 0,
  fogBoost = 0,
}) {

  const { tx, ty, scale } = transform;
  const hasAtlas = Boolean(atlasUrl);
  const hasRelief = Boolean(reliefUrl);
  const hasMist = Boolean(mistUrl);
  const hasEmber = Boolean(emberUrl);
  const hasAsh = Boolean(ashUrl || mistUrl);

  function buildFogMask(points = []) {
  if (!points.length) {
    return 'radial-gradient(circle at 50% 50%, black 0%, black 100%)';
  }

  const gradients = points.map(p => {
    const x = `${p.x * 100}%`;
    const y = `${p.y * 100}%`;
    const r = `${p.r * 100}%`;

    return `radial-gradient(circle at ${x} ${y},
      transparent 0%,
      transparent ${r},
      black ${r + 8}%
    )`;
  });

  return gradients.join(',');
}


return (
  <>
  <div className="absolute inset-0 pointer-events-none">
    {/* STATIC BACKGROUND */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#0d0f12] to-[#161a1f]" />

  {/* Base atlas */}
  {hasAtlas && (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${atlasUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.95
      }}
    />
  )}

  {/* Relief ghost (Mystic sees more, City sees less) */}
  {hasRelief && (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${reliefUrl})`,
        opacity:
          (truthProfile?.relief ?? 0.08) *
          (mode === "mystic" ? 1.25 : mode === "city" ? 0.5 : 1.0) +
          envPressure * 0.08,
        filter: `blur(${envPressure * 1.2 + (mode === "mystic" ? 1 : 0.5)}px)`
      }}
    />
  )}

  {/* Mist (weather veil) */}
  {hasMist && (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${mistUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity:
          (truthProfile?.mist ?? 0.22) *
          (mode === "mystic" ? 1.15 : mode === "city" ? 0.6 : 1.0) -
          envPressure * 0.25 +
          fogBoost,
        WebkitMaskImage: buildFogMask(fogPoints),
        maskImage: buildFogMask(fogPoints),
        maskComposite: "intersect",
        WebkitMaskComposite: "destination-in"
      }}
    />
  )}



{/* Mystic fungal bleed-through (visual only, never unlocks) */}
{mode === "mystic" && bleedPoints.length > 0 && (
  <div
    className="absolute inset-0"
    style={{
      // paint faint bioluminescent blooms where the world is "trying to show you"
      backgroundImage: bleedPoints
        .map((p) => {
          const x = `${p.x * 100}%`;
          const y = `${p.y * 100}%`;
          const r = `${p.r * 100}%`;
          return `radial-gradient(circle at ${x} ${y},
            rgba(120, 220, 170, 0.18) 0%,
            rgba(120, 220, 170, 0.12) ${r},
            rgba(0, 0, 0, 0) ${r + 18}%
          )`;
        })
        .join(","),
      opacity: (truthProfile?.mist ?? 0.22) * 0.9,
      filter: "blur(6px)",
      mixBlendMode: "screen",
      pointerEvents: "none",
    }}
  />
)}







  {/* ✅ NEW: Ashfall layer (Watcher-driven) */}
  {hasAsh && (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${ashUrl || mistUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity:
          (truthProfile?.ash ?? 0.18) *
          (watcherIntensity === "near" ? 1.0 : watcherIntensity === "mid" ? 0.55 : 0.25) *
          (mode === "mystic" ? 1.15 : mode === "city" ? 0.55 : 1.0),
        filter: mode === "mystic" ? "blur(0.5px)" : "blur(0.8px)",
        mixBlendMode: mode === "city" ? "soft-light" : "screen",
        // tiny shift so it doesn't perfectly match mist
        transform: "translate3d(0, 0, 0) scale(1.02)"
      }}
    />
  )}

  {/* Ember scar (Watcher proximity) */}
  {hasEmber && (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${emberUrl})`,
        opacity:
          (truthProfile?.ember ?? 0.06) *
          (watcherIntensity === "near" ? 1.0 : watcherIntensity === "mid" ? 0.6 : 0.35) *
          (mode === "city" ? 0.7 : 1.0) +
          envPressure * 0.04,
        mixBlendMode: "lighten"
      }}
    />
  )}
  </div>
  <div className="absolute inset-0">
    {children}
  </div>
  </>
);
}
// World of Tethys || D.C. Barletta
