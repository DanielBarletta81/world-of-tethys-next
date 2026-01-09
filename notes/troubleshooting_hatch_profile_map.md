# TROUBLESHOOTING: HATCH → PROFILE → PATH → MAP

Golden rule: nothing on the map renders unless the player has a resolved identity. Order: Auth → Profile → Hatch → Path → Map. Any bypass multiplies bugs.

## Expected Flow
1) Auth resolves. 2) PlayerProfile exists. 3) If no hatch → StarterLoadout. 4) Hatch egg. 5) Profile + Staff + Path written. 6) Map renders. 7) Fragments unlock based on path.

## Auth → Profile
- AuthContext must resolve before TethysContext. If broken: hatch repeats; map flashes then resets; PathSelector blinks. `AuthContext.jsx`: if (loading) return null; `TethysContext`: if (!user) return defaultEmptyState.

## Profile State (after hatch)
Required fields: `{ uid, createdAt, path, staff:{name,power,bond}, starterCreature, lastInputAt, lastHarvestAt }`. Any undefined → rerenders/restarts. Log once after hatch; if double logs, hatch not guarded.

## Hatch Double-Fire Guard
Use a ref: `if (hasHatchedRef.current) return; hasHatchedRef.current = true;` Disable hatch button immediately; unmount hatch UI when `profile?.path` exists.

## Path → Map (gate)
Map cares only about `profile.path`. If not set: render `<StarterLoadout />`. Only render `<MapViewport ...>` when `profile?.path` truthy. Early render corrupts fog/unlocks.

## Map Render Checks
- Assets: confirm `/maps/tethys-atlas-clean.webp`, `/maps/tethys-relief-ghost.webp`, `/maps/tethys-mist-noise.webp`, `/maps/tethys-ember-scar.webp` load. A 404 = invisible layer.
- Transform defaults: ensure `scale` not 0/NaN. Initialize `useMapPhysics` with `useState(1)`. Log once: `[MAP TRANSFORM] tx ty scale`.

## Path Variants Leak
Mystic overlays should use unlock, not path alone: `showMystic = profile.path === 'mystic' && profile.mysticDepth > 0;`

## Stillness / lastInputAt
Update `lastInputAt` on every input event (e.g., in useMapPhysics or TethysContext). Compute stillness from state, not render: `idleMs = Date.now() - lastInputAt; stillness = clamp(idleMs / STILL_FULL, 0, 1);` If stale → flicker/oracle misfires.

## Temporary Debug Overlay (remove after)
```
path: {profile?.path}
hatched: {Boolean(profile?.staff)}
stillness: {physics.stillnessLevel.toFixed(2)}
```
Helps spot double hatches, missing path, resetting stillness.

## Likely Root Causes
1) Hatch firing twice. 2) Map rendering before `profile.path`. 3) Stillness from stale `lastInputAt`.

World of Tethys || D.C. Barletta
