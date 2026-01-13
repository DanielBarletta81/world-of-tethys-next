# Firestore DNA Rules & Docs

This document outlines the canonical Firestore structure for the `DNA` analytics system and the security/operational rules you should enforce before wiring the Cloud Function.

## Collections

```
players/{userId}/dnaEvents/{eventId}
playerProfiles/{userId}
```

- `dnaEvents`: Each event document records a single map action (map traversal, fragment unlock, egg hatch) plus the normalized metadata required for hashing (coordinates, pathMode, envPressure). Player clients write these docs locally whenever they trigger a DNA-relevant moment.
- `playerProfiles`: The Cloud Function owns this collection. It stores the latest derived DNA traits, glyph history, and chronicle entries. Each document should look like:
  ```json
  {
    "latestDna": {
      "seed": "...",
      "traits": { affinity, scar, aura, chronicle },
      "glyph": { glyphId, color }
    },
    "glyphHistory": [ { region, color, timestamp } ],
    "lastUpdated": <timestamp>
  }
  ```

## Suggested Firestore Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{userId}/dnaEvents/{eventId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if false; // only Cloud Function should mutate derived fields
    }

    match /playerProfiles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth.token.firebase.sign_in_provider == 'custom' ||
                  request.auth.uid == 'admin-uid-marker';
      // In practice the service account uses Admin SDK, so it bypasses rules completely.
    }
  }
}
```

- Keep `dnaEvents` writes limited to authenticated users so untrusted players cannot spoof other IDs.
- The trigger runs with the Admin SDK, so it does not obey rules, but the profiles collection is off-limits to clients.

## Operational Notes

1. Client-side writes to `dnaEvents` should include the fields needed by `derivePlayerDna`:
   - `coordinates`: `{ x, y }`
   - `region`: slug
   - `pathMode`: `wild | city | mystic`
   - `envPressure`: float (0-1)
   - Optional `metadata`: `fogBoost`, `watcherIntensity`, `staffId`

2. The Cloud Function should recompute DNA inside a batched write so both `dnaSnapshot` and the target `playerProfiles/{userId}` doc update atomically.

3. If you plan to store analytics in a sub-collection or third root-level doc (``playerAnalytics``), follow the same ownership rules.
