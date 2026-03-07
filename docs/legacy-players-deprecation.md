# Legacy `players` Deprecation Plan

This codebase previously stored player state in `players/{uid}` with multiple subcollections.
That structure is now deprecated in favor of the archive schema described in
`docs/firestore-archive-schema.md`.

## Status

- Legacy endpoints under `/api/player/*` remain available during migration.
- The archive schema is authoritative for future work.

## Migration Script

Use `scripts/migrate-players-to-archive.mjs` to backfill `userArchiveRecords`:

```bash
node scripts/migrate-players-to-archive.mjs --limit 50
node scripts/migrate-players-to-archive.mjs --commit
```

Optional environment variables:

- `ARCHIVE_WORLD_YEAR`
- `ARCHIVE_CYCLE_PHASE`

## Retirement Criteria

Deprecate the legacy `players` collection once:

1. `userArchiveRecords` exists for all active users.
2. Any required legacy reads have equivalent archive data.
3. Clients are fully migrated to `/api/archive/*`.
