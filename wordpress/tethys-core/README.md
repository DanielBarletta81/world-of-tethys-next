# Tethys Core Plugin

`tethys-core` registers the core World of Tethys content model in WordPress.

## What it creates

- Post types: `character`, `location`, `faction`, `artifact`, `event`, `story`
- Taxonomies: `era`, `region`, `canon_tier`, `theme`, `spoiler_level`
- URL structure:
  - `/lore/characters/{slug}/`
  - `/lore/locations/{slug}/`
  - `/lore/factions/{slug}/`
  - `/lore/artifacts/{slug}/`
  - `/lore/events/{slug}/`
  - `/lore/stories/{slug}/`
  - `/timeline/{era-slug}/`
- REST-enabled meta fields:
  - `excerpt_short`
  - `timeline_start`
  - `timeline_end`
  - `map_enabled`
  - `lat`
  - `lng`
  - `map_zoom`
  - `source_story`
  - `hero_image`
  - `related_entries`

On activation it also seeds taxonomy terms for:

- `canon_tier`: `core`, `expanded`, `legend`
- `spoiler_level`: `safe`, `moderate`, `major`

## Install

1. Zip the folder:
   - `cd wordpress`
   - `zip -r tethys-core.zip tethys-core`
2. In WordPress Admin, go to Plugins → Add New → Upload Plugin.
3. Upload `tethys-core.zip`, install, then activate.
4. Visit Settings → Permalinks and click Save once.

## Example REST usage

Get characters:

```bash
curl "https://worldoftethys.com/wp-json/wp/v2/character?per_page=20"
```

Get locations in a region term:

```bash
curl "https://worldoftethys.com/wp-json/wp/v2/location?region=12"
```

Create a character (application password auth) with map/timeline meta:

```bash
curl -X POST "https://worldoftethys.com/wp-json/wp/v2/character" \
  -u "username:app_password" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kael Therin",
    "status": "publish",
    "meta": {
      "excerpt_short": "Navigator of the Shatterbelt",
      "timeline_start": "First Age 184",
      "map_enabled": true,
      "lat": 12.129,
      "lng": -61.228,
      "map_zoom": 6
    }
  }'
```
