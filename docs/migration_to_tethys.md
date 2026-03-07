# Migration: Basic-PacMan → world-of-tethys-next

This project is now treated as a staging/source repository. The canonical destination is:

- `world-of-tethys-next` (GitHub)

## What to migrate

All content currently tracked in `Basic-PacMan` should be pushed to `world-of-tethys-next`, including:

- `data/lore_map_features.geojson`
- `docs/metadata_standard.md`
- `README.md`
- Any future lore map assets and metadata updates

## One-command push workflow

From the root of this repository:

```bash
scripts/push_to_tethys.sh git@github.com:<ORG>/world-of-tethys-next.git main
```

Or using HTTPS:

```bash
scripts/push_to_tethys.sh https://github.com/<ORG>/world-of-tethys-next.git main
```

## Notes

- The script enforces a clean working tree before pushing.
- It pushes the current checked-out branch to the destination branch you provide.
- If the temporary remote `tethys-next` already exists, it updates its URL.
