# new-tethys-map

## Project Brief: Cretaceous Map Narrative

### Setting Snapshot
This project is set in a fictional Late Cretaceous world where broad inland seas, young mountain belts, and dense fern lowlands shape migration corridors for dinosaur clades. The map should feel scientifically inspired but narratively flexible, blending believable paleo-environments with regional identities ("The Amber Delta," "Ashback Ridge," and "The Inland Shallows").

### Intended Lore Elements
- **Factions and species cultures:** herbivore caravans, apex predator territories, and pterosaur courier routes.
- **Environmental pressure:** volcanic winters, seasonal flooding, and shifting coastlines that alter travel safety.
- **Artifacts and mysteries:** fossil sites, meteor-glass landmarks, and archival histories tied to extinction signals.
- **Conflict hooks:** contested nesting grounds, resource chokepoints, and diplomacy across migratory boundaries.

### Storytelling Goals
1. Build a map that supports both **exploration** and **political tension**.
2. Let geography visibly drive story beats (migration, scarcity, alliances, and conflict).
3. Keep room for episodic narrative additions by separating stable base geography from mutable event overlays.
4. Maintain a clear visual hierarchy so readers can quickly distinguish terrain, routes, hazards, and lore markers.

## Primary Map Platform Decision
Use **QGIS** as the primary authoring platform.

**Why this platform:**
- Strong desktop GIS tooling for layered worldbuilding and cartographic styling.
- Easy export into web-friendly formats later if interactive delivery is needed.
- Supports repeatable editing workflows with project files and symbology presets.

## Layer File Format Plan

| Layer Type | Primary Format | Purpose | Interactions |
|---|---|---|---|
| Base terrain/elevation | GeoTIFF (`.tif`) | Height and relief context for the continent and seafloor shelves | Used for hillshade generation and to guide biome/rivers placement |
| Paleo-coastline and hydrography | GeoPackage (`.gpkg`) vector layers | Shorelines, rivers, marsh edges, inland sea extents | Snapped to terrain logic; clipped against scenario time-slices |
| Biomes/vegetation regions | GeoJSON (`.geojson`) polygons | Fern forests, arid basins, conifer uplands, floodplains | Styled by category; intersected with species ranges for story triggers |
| Migration/trade/flight routes | GeoJSON (`.geojson`) lines | Dinosaur corridors, pterosaur lanes, caravan tracks | Network analysis and route styling; toggled for chapter/event views |
| Settlements, hazards, points of interest | GeoJSON (`.geojson`) points | Narrative POIs and dynamic markers | Linked to metadata table for chapter notes and encounter seeds |
| Cartographic symbols & labels | SVG (`.svg`) assets | Reusable iconography (nests, ruins, hazard glyphs) | Referenced by QGIS styles and export-ready for web map symbol sets |
| Final print/export compositions | PDF/PNG | Static atlas pages and narrative handouts | Generated from QGIS layouts using the same source layers |

### Interoperability Rules
- Keep editable master data in **GeoPackage + GeoTIFF** within QGIS.
- Publish narrative-ready exchange layers as **GeoJSON** for downstream web or toolchain use.
- Store icon system in **SVG** so symbols remain resolution-independent across print and web outputs.
- Version time-specific story states as separate overlay files (e.g., `hazards_ch03.geojson`) rather than rewriting baseline geography.
