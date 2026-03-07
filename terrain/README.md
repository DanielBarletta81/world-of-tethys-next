# Terrain Data

The `mythic_terrain_generator.py` script fabricates a narrative-friendly
digital elevation model (DEM) alongside supporting bathymetry data.

## Outputs

Running the module writes two JSON files:

- `dem_data.json` – Smoothed land elevations with exaggerated mountain and
  trench features suited to the floating archipelago of Aurithal.
- `bathymetry_contours.json` – Gradient magnitudes and coarse contour segments
  detailing underwater hazards such as a deep trench and the mirrored reef shelf.

## Usage

```bash
python terrain/mythic_terrain_generator.py
```

The generator is deterministic and requires only the Python standard library.
