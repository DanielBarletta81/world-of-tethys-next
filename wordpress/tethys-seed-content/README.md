# Tethys Seed Content Plugin

`tethys-seed-content` imports lore records into Tethys Core post types from JSON or CSV.

## Features

- Admin importer UI in Tools → Tethys Seed Content
- Input from JSON payload or uploaded `.json` / `.csv` file
- Upsert by `post_type + slug`
- Taxonomy mapping (`era`, `region`, `canon_tier`, `theme`, `spoiler_level`)
- Meta mapping (`excerpt_short`, timeline/map fields, `source_story`, `hero_image`, `related_entries`)
- Dry-run mode for safe validation before writing

## Install

1. Ensure `tethys-core` is installed and active.
2. Zip this plugin folder:
   - `cd wordpress`
   - `zip -r tethys-seed-content.zip tethys-seed-content`
3. In WordPress Admin, go to Plugins → Add New → Upload Plugin.
4. Upload `tethys-seed-content.zip` and activate.

## Expected Fields

Supported fields/columns:

`post_type,title,slug,content,excerpt,status,era,region,canon_tier,theme,spoiler_level,timeline_start,timeline_end,map_enabled,lat,lng,map_zoom,source_story,hero_image,related_entries`

- `post_type` required unless a default post type is selected in UI.
- `title` required.
- `slug` optional (auto-generated from title if omitted).
- Taxonomy fields accept comma-separated values and also the UI delimiter (default `|`).
- `source_story` accepts a story ID or story slug.
- `related_entries` accepts post IDs or slugs.

## JSON Example

```json
[
  {
    "post_type": "character",
    "title": "Kael Therin",
    "slug": "kael-therin",
    "content": "Navigator of the Shatterbelt.",
    "status": "publish",
    "era": "First Age",
    "region": "Shatterbelt",
    "canon_tier": "core",
    "theme": "exploration|destiny",
    "spoiler_level": "safe",
    "timeline_start": "First Age 184",
    "map_enabled": true,
    "lat": 12.129,
    "lng": -61.228,
    "map_zoom": 6,
    "source_story": "dawn-of-the-corridor",
    "related_entries": "the-shatterbelt,watchers-guild"
  }
]
```

## CSV Example

```csv
post_type,title,slug,content,status,era,region,canon_tier,theme,spoiler_level,timeline_start,map_enabled,lat,lng,map_zoom,source_story,related_entries
location,The Shatterbelt,the-shatterbelt,"A jagged corridor of reefs and ruins.",publish,First Age,Central Tethys,core,exploration,safe,First Age 180,1,11.8,-60.9,5,dawn-of-the-corridor,"kael-therin,watchers-guild"
```

## Suggested Import Flow

1. Run a dry import with Update Existing enabled.
2. Review row-by-row results.
3. Disable Dry Run and execute real import.
4. Re-run safely as your content evolves.

## Included Sample Files

- `examples/seed-sample.csv`
- `examples/seed-sample.json`

These records include linked entities (story, location, faction, character, artifact, event) and demonstrate:

- taxonomy lists via `|` and `,`
- cross-reference resolution by slug in `source_story` and `related_entries`
- map and timeline metadata

For best relationship mapping, keep **Update Existing** enabled and import the full sample set in one run.
