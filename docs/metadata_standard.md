# Lore Map Metadata Standard

Use the following metadata fields on every polygon or point feature to keep links and rendering behavior consistent across map layers.

## Required fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Globally unique feature ID (e.g., `kingdom-aurora`). |
| `layer_type` | enum | One of: `kingdom`, `habitat`, `ruin`, `trade_route`, `event_zone`. |
| `title` | string | Human-readable feature name used in map popups, legends, and search. |
| `description` | string | Short lore summary displayed in map popups/tooltips. |
| `external_url` | URL string | Canonical page for deep-linking to the feature's full lore entry. |
| `media_references` | string[] | One or more image/audio/video links for galleries and previews. |
| `timeline` | string | Key chronology summary (founding dates, major events, transitions). |
| `resource_links` | string[] | Related lore pages (characters, factions, events, codex entries). |

## Optional fields

| Field | Type | Description |
| --- | --- | --- |
| `era_start` | string/date | Start of feature relevance period (supports sorting/filtering). |
| `era_end` | string/date | End of relevance period where applicable. |
| `faction_alignment` | string | Institutional or political affiliation for thematic filtering. |

## Authoring notes

- Store geometries in GeoJSON using `EPSG:4326` for compatibility with common web mapping libraries.
- Keep `title`, `description`, and `external_url` populated even for draft features so UI components can link reliably.
- Prefer stable URLs in `resource_links` and `media_references`; avoid temporary assets.
