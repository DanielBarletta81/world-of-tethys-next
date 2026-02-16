# Tethys Data

This folder holds local, versioned data used by the UI. As content moves to
WordPress/GraphQL, keep local data as a reliable fallback.

## Conventions
- **Region IDs**: kebab-case only (`sky-city`, `mystic-woods`, `tethys-sea`).
- **Item IDs**: stable, slug-style (`item_consumable_mushroom_azure`).
- **Faction IDs**: keep existing canonical names (`sky-city`, `ironwood`).
- **No underscores** for region IDs (avoid `tethys_sea`, `mystic_woods`).

## Migration Flags
- `WP_CATALOG_ENABLED=true` enables WP catalog fetch.
- `WP_PTEROS_MEDIA_ENABLED=true` enables WP Pteros media fetch.
- `WP_PTEROS_SIGNAL_ENABLED=true` enables WP Pteros signal fetch.

## Fallback Rule
If WP data is unavailable or empty, local arrays are used.
