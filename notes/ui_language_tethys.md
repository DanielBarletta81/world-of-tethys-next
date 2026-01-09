Tethys UI Language — Silent Cues
================================

Core Principle
--------------
The world never speaks directly; the interface listens on the player’s behalf. No alerts, no warnings, no tutorials—only misalignment and withdrawal. When the UI feels comfortable, the world is lying.

Silent Cues
-----------
- Cursor/Torch Drift: torch leans; cursor hesitates/lag (tie to stillness + hazard). City: lag. Mystic: resistance. Wild: ground refusal.
- Map Texture Refusal: relief loses contrast, micro-blur, mist thins in one region (regional stress). Not fog-of-war; clarity withdrawal.
- UI Silence: Oracle offers fewer responses; journal auto-entry delays; tooltips suppressed. Silence rises before danger.
- Icon Micro-Misalignment: region/stamp icons off by fractions, one-frame drift to show record divergence.
- Audio Unresolved: loops don’t resolve; sub-bass hum; endings off-timing. Mystic hears depth; City hears noise; Wild hears timing.
- Delayed Input Confirmation: clicks/hover confirm late; thoughtful UI. Tie to Mynz/hazard zones (80–140 ms random).

Component Mapping
-----------------
- TethysNexus.jsx: drives stillnessLevel; broadcasts environmental pressure.
- useMapPhysics: micro-resistance; drag doesn’t fully follow under hazard.
- MapViewport: relief blur/mist thinning; ember layer faint pulse (no glow).
- OraclePool.jsx: silence/echo-only/withheld states.
- SurvivorIdentityPanel: status text truncates early; scar entries fade instead of disappear.

Stillness Escalation
--------------------
- >0.4 cues begin; >0.7 intensify; >0.9 cues stop (worst moment).

Accessibility
-------------
- Reduced motion: swap movement for opacity shifts; lag for tone shift.
- Color blind: use luminance/blur over hue.
- Audio off: haptics or cursor stiffness for micro-vibration.

Implementation Snippets
-----------------------
- Torch/cursor: torchLean = lerp(0, hazardLevel * 6deg, 0.2); cursorLag = hazardLevel * 20ms.
- Suppress narrative when stillnessLevel < 0.3.
- Icon drift: transform: translate(0.5px, -0.5px).
- Hazard confirm delay: confirmDelay = hazardZone ? random(80,140) : 0.

World of Tethys || D.C. Barletta
