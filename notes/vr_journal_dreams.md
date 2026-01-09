# VR JOURNAL & DREAM STATES — FIELD LOGIC

Author intent: journals and dreams feel like naturalist practice (Darwin/Wallace), not UI. Never interrupt locomotion or force perspective. Behave correctly; never explain themselves.

## Design Doctrine (Lock)
- Journal/dreams never interrupt locomotion; they replace activity when the world allows it.
- No forced camera fades, no disembodied narration while moving, no cutscenes, no symbolic overlays.
- Only hands, paper, light, silence, absence. Journal is consulted, not opened. Dreams are entered, not shown.

## Journal in VR (Equippable, Expandable, Safe)
- Physical object: bound, worn, never glowing; only physics-driven.
- Never a HUD/menu/pop-up. Held in one hand with world fully present; no blur/dimming.
- Appears when player draws it, after long stillness, or near safe ground (camp/ledge/mammoth rest).
- Cues: slight paper sound; torch light reflects unevenly; wind muffles text audibility.

### Study Mode (Expanded)
- Trigger: stationary, head movement slows, envPressure below threshold or world withholding action.
- Journal fills more view because player brings it closer; slight audio drop only. Player controls distance; never auto-animates.

### Content (Darwinian)
- Only observations: marginal notes, incomplete sketches, crossed-out measurements, altered handwriting after danger.
- Visual cues: faded ink, smudges, pressed plant fragments, salt stains, ash traces. Some entries never fully resolve.
- Recurring but unexplained marks: small margin notch; repeated symbol; measurements missing units; scratched dates replaced with conditions (e.g., “Windward. Still. Animals moved first.”).

## Dream States in VR (Presence Without Theater)
- Trigger: long stillness, after trauma, after Oracle silence, near geological memory (Watcher Flats, Cambria, Bronthel). Player must already be sitting/resting/motionless.
- World remains; contrast drops; sound becomes directionless; interaction disabled; hands remain visible. No floating imagery or forced perspective.
- Ravel: seen only as shadow intersecting roots; voice bone-conducted (internal), no lip movement, no direct address.
- Kith: wing silhouette crossing light; feather sound only; appears once per dream max; disappears if looked at.
- Dreams contain reframed journal entries, misordered memories, animal movement patterns, geological pressure sensations, things the player missed. They do not predict; they re-contextualize.

## Path-Based Tone (City / Wild / Mystic)
- City: records — formal/procedural/ceremonial. Dreams: oath room, echoing stone, no animals, no Ravel. Failure damages trust/records.
- Wild: field notes — practical/fragmented/sensory/unfinished. Dreams: animal movement, terrain shifts, no voices, motion memory only.
- Mystic: living journal — ink bleeds, margins grow, entries change subtly. Dreams: Ravel + Kith present; root/stone overlap; dreams unlock traits, not answers.

## Unity XR Implementation Patterns (Safe)
- Journal: XR Grab Interactable; physics only; no snapping; pages turn by hand gesture. Example:
  - `journal.trackRotation = false;`
  - `journal.throwOnDetach = false;`
- Dream controller: when stillness > 0.9 and envPressure < 0.4, enter dream; set `inDream`, disable interaction, soften audio, lock locomotion. No camera manipulation.
- Audio: no positional voices near head; use ambisonic bed; fade directionality, not volume.

## Why It Feels Darwinian (Not Gamey)
- Knowledge accumulates slowly; meaning emerges through repetition; observation precedes theory; silence is information; not everything is explained.
- Journal is evidence, not reward. Dreams are pattern recognition under rest.

## Final Tethys Axiom
> The world tells its story whether you record it or not. The journal only proves you were paying attention.

World of Tethys || D.C. Barletta
