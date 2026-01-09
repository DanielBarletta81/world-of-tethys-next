# TETHYS STAMP PACK + UNITY XR JOURNAL WIRING

Two parts: (1) full SVG stamp pack (drop-in) and (2) Unity XR Journal prefab wiring. Functional, not decorative.

## Global Stamp Rules
- `viewBox="0 0 96 96"`, stroke-only, `stroke="currentColor"`, `fill="none"`, no text, imperfect symmetry.
- Recolor via CSS/material tint. Never animate continuously.

## SVG Stamp Pack
### Mynz — Dwarf Island
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none">
    <circle cx="48" cy="48" r="30" stroke-dasharray="5 6"/>
    <circle cx="48" cy="48" r="16" stroke-dasharray="2 8"/>
    <path d="M48 14v10M48 72v10M14 48h10M72 48h10" opacity="0.4"/>
  </g>
</svg>
```
Reads: scale compression, speed, loss of margin.

### Borok Deep — Giant Isle
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="3" fill="none">
    <rect x="12" y="12" width="72" height="72" rx="12"/>
    <circle cx="48" cy="48" r="18" opacity="0.25"/>
  </g>
</svg>
```
Reads: mass acknowledged, center unreachable.

### Bronthel — Fire Pine Isles
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <path d="M48 10v76"/>
    <path d="M32 20v56M64 20v56" opacity="0.4"/>
    <path d="M20 30l56 36" opacity="0.2"/>
  </g>
</svg>
```
Reads: vertical time, burn layers, survival through heat.

### Dier Lake — Salt Basin
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <circle cx="48" cy="48" r="28"/>
    <circle cx="48" cy="48" r="20" opacity="0.5"/>
    <circle cx="48" cy="48" r="12" opacity="0.25"/>
  </g>
</svg>
```
Reads: evaporation, abundance without depth.

### Watcher Flats / Sulfur Crown
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <circle cx="48" cy="48" r="30"/>
    <path d="M48 16v64M16 48h64" opacity="0.4"/>
    <path d="M30 30l36 36M66 30L30 66" opacity="0.2"/>
  </g>
</svg>
```
Reads: pressure vectors, crossed stress, no release.

### Cambria — Ruins / Old Tethysia
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <rect x="26" y="26" width="44" height="44" rx="4"/>
    <path d="M26 48h16M54 48h16"/>
    <path d="M48 26v16M48 54v16"/>
  </g>
</svg>
```
Reads: interrupted record, missing continuity.

### Gargantuan Fracture (Macro)
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <path d="M10 48h76"/>
    <path d="M48 10v76" opacity="0.4"/>
    <circle cx="48" cy="48" r="30" opacity="0.2"/>
  </g>
</svg>
```
Reads: rupture, division, recursive isolation.

### Lorn Scatter (Micro Isles)
```svg
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <circle cx="24" cy="24" r="6"/>
    <circle cx="72" cy="30" r="5"/>
    <circle cx="40" cy="68" r="7"/>
    <circle cx="66" cy="66" r="4"/>
  </g>
</svg>
```
Reads: chance, dispersion, non-order.

## Unity XR Journal Wiring
Prefab structure: JournalPrefab with Cover, Page_L/StampAnchor, Page_R/StampAnchor, XRGrabInteractable.

### Stamp Data Model (`RegionStamp.cs`)
```csharp
[System.Serializable]
public class RegionStamp
{
    public string regionId;
    public Sprite stampSprite;
    public float wear;      // 0–1
    public float rotation;  // degrees
    public Vector2 offset;  // anchored position on page
}
```

### Renderer (`JournalStampRenderer.cs`)
```csharp
using UnityEngine;
using UnityEngine.UI;

public class JournalStampRenderer : MonoBehaviour
{
    public Image stampImage;

    public void ApplyStamp(RegionStamp stamp)
    {
        stampImage.sprite = stamp.stampSprite;
        stampImage.color = new Color(1, 1, 1, 1f - stamp.wear * 0.4f);
        stampImage.rectTransform.localRotation = Quaternion.Euler(0, 0, stamp.rotation);
        stampImage.rectTransform.anchoredPosition = stamp.offset;
    }
}
```

### Wear / Degradation
```csharp
stamp.wear += envPressure * 0.15f;
stamp.rotation += Random.Range(-2f, 2f);
stamp.offset += Random.insideUnitCircle * 3f;
```
Stamps degrade because the world pressures memory; not time-based polish.

### When to Stamp
- After first safe stillness in region or post-survival.
- After dream resolution.
- Never on immediate arrival.

### Comfort Rules
- No stamp animations. Clarity increases only when the player brings the journal closer.
- No parallax/hover. Dropping the journal leaves stamps unchanged.

## Final Rule
> A stamp is not a badge. It is residue.

World of Tethys || D.C. Barletta
