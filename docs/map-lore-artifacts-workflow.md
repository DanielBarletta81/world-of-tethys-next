# Map Lore/Artifact JSON Workflow

Use this flow to add or edit explorable map lore without changing component code.

## Source of truth

- File: `src/content/map-lore-artifacts.json`
- Runtime loader: `src/data/map-lore-artifacts.js`
- Admin read endpoint: `/api/admin/lore-artifacts`

## Required JSON shape

Each entry must include:

```json
{
  "regionId": "pteros",
  "label": "Pteros Island",
  "era": "Eyrie Charter Standardization",
  "history": "Short historical context.",
  "artifact": {
    "name": "Artifact name",
    "class": "Artifact class",
    "note": "Field note for the artifact."
  }
}
```

## Add a new node

1. Open `src/content/map-lore-artifacts.json`.
2. Add a new object to the array with a unique `regionId`.
3. Keep copy short and specific (1-2 sentences each for `history` and `artifact.note`).
4. Save and run `npm run build:fast`.

## Discovery behavior

- First time a user opens a sub-map for a configured `regionId`, the profile is updated:
  - `history.loreDiscoveries[regionId].firstDiscoveredAt`
  - `history.loreDiscoveries[regionId].lastOpenedAt`
  - `history.loreDiscoveries[regionId].openCount`
  - `progression.loreDiscoveredRegions`
  - `progression.loreDiscoveryCount`

## Newsletter consent behavior

- The post-login newsletter prompt is independent from auth.
- User decision is saved at:
  - `marketing.newsletter.promptedAt`
  - `marketing.newsletter.decisionAt`
  - `marketing.newsletter.optedIn`
  - `marketing.newsletter.source`
