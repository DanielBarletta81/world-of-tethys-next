# Firestore Archive Schema (Canonical)

This document locks the authoritative Firestore schema for the long-term archive system.
It is intentionally narrow: no engagement metrics, no gamified artifacts, no sprawl.

Legacy `players` data remains functional during migration but is not part of this schema.

## Collections

```
worldState
  └── current

userArchiveRecords
  └── {uid}
      └── mapInteractions
          └── {eventId}

inviteCodes
  └── {codeId}

auditLog
  └── {autoId}
```

## 1) worldState (Singleton)

Collection:

```
worldState
  └── current
```

Document ID: `current`

```ts
{
  worldYear: 111000000,
  cyclePhase: "elevated", // stable | elevated | active
  season: "migration",    // migration | ashfall | tide
  migrationIntensity: "moderate", // low | moderate | high
  particulateLevel: "moderate",   // low | moderate | severe
  seismicActivity: "escalating",  // minimal | elevated | escalating
  minorShiftIndex: 3,
  majorEventFlag: null,   // e.g. "ash-major"
  updatedAt: Timestamp
}
```

Notes:
- No history inside this document.
- Only the current state.

## 2) userArchiveRecords (Per User)

Collection:

```
userArchiveRecords
  └── {uid}
```

Document ID = Firebase UID

```ts
{
  firstAccessWorldYear: 111000000,
  firstAccessCyclePhase: "elevated",
  lastAccessWorldYear: 111000003,
  lastSeenCyclePhase: "elevated",
  continuityTier: "maintained", // maintained | pre-active | lapsed
  clearance: "level1",          // level1 | level2 | admin
  witnessedMajorEvent: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

Notes:
- Continuity recalculated server-side on login.
- `clearance` mirrored here for quick access, but must match auth claims.

### mapInteractions (Subcollection)

Path:

```
userArchiveRecords/{uid}/mapInteractions/{eventId}
```

```ts
{
  action: "node_focus",
  locationId: "tideplain-01",
  worldYear: 111000003,
  cyclePhase: "elevated", // stable | elevated | active
  recordedAt: Timestamp
}
```

Notes:
- Minimal, archival interaction record.
- No engagement metrics.
- Server-only writes (client submits via API).

## 3) inviteCodes (Controlled Issuance)

Collection:

```
inviteCodes
  └── {codeId}
```

```ts
{
  code: "LITHIC-DELTA-09",
  clearanceGranted: "level2",
  maxUses: 25,
  currentUses: 4,
  expiresAt: Timestamp,
  createdBy: "adminUid",
  active: true,
  createdAt: Timestamp
}
```

## 4) auditLog (Recommended)

Collection:

```
auditLog
  └── {autoId}
```

```ts
{
  action: "worldStateUpdate",
  performedBy: "adminUid",
  previousCyclePhase: "elevated",
  newCyclePhase: "active",
  timestamp: Timestamp
}
```

Notes:
- Never expose this collection publicly.

## Security Rules Summary

- `worldState` read: authenticated users
- `worldState` write: admin only
- `userArchiveRecords` read: owner (and admin)
- `userArchiveRecords` write: admin only
- `mapInteractions` create: admin only (server-side)
- `inviteCodes` read/write: admin only
- `auditLog` read/write: admin only

## Seeding worldState

Use the seed script to initialize `worldState/current`:

```bash
node scripts/seed-world-state.mjs --commit
```

Optional overrides (CLI or environment):

- `--worldYear`
- `--cyclePhase`
- `--season`
- `--migrationIntensity`
- `--particulateLevel`
- `--seismicActivity`
- `--minorShiftIndex`
- `--majorEventFlag`
