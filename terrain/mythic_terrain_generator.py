"""Generate a fictional digital elevation model and bathymetry contours.

This module builds a deterministic heightmap intended for narrative use. It
creates a smoothed DEM for terrestrial regions and enhanced bathymetry data for
underwater analysis. Output files are stored in ``terrain/`` relative to the
repository root.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from math import cos, exp, pi, sin, sqrt
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

Grid = List[List[float]]
Coordinate = Tuple[int, int]


@dataclass
class TerrainFeature:
    """Narrative feature embedded within the generated world."""

    name: str
    kind: str
    description: str
    bounds: Tuple[int, int, int, int]  # row_min, row_max, col_min, col_max

    def contains(self, row: int, col: int) -> bool:
        r0, r1, c0, c1 = self.bounds
        return r0 <= row <= r1 and c0 <= col <= c1


OUTPUT_DIR = Path(__file__).resolve().parent
DEM_FILE = OUTPUT_DIR / "dem_data.json"
BATHYMETRY_FILE = OUTPUT_DIR / "bathymetry_contours.json"
GRID_ROWS = 60
GRID_COLS = 60
SEA_LEVEL = 0.0


def build_base_heightmap(rows: int, cols: int) -> Grid:
    """Create a deterministic base terrain using trigonometric ridges."""

    center_row = rows * 0.35
    center_col = cols * 0.6

    grid: Grid = []
    for r in range(rows):
        row_values: List[float] = []
        for c in range(cols):
            # Radial falloff for an island chain, plus harmonic ridges.
            dr = (r - center_row) / rows
            dc = (c - center_col) / cols
            radial = exp(-(dr * dr + dc * dc) * 8) * 900
            ridges = sin((r / rows) * pi * 2) * 120
            ridges += cos((c / cols) * pi * 3) * 150
            volcanic_spine = exp(-((c - cols * 0.45) ** 2) / (cols * 0.9)) * 320
            coastal_shelf = -250 * exp(-((r - rows * 0.8) ** 2) / (rows * 0.7))
            elevation = radial + ridges + volcanic_spine + coastal_shelf
            elevation -= 180  # ensure some underwater areas
            row_values.append(elevation)
        grid.append(row_values)
    return grid


def smooth_heightmap(grid: Grid, passes: int = 2) -> Grid:
    """Apply neighborhood averaging to soften abrupt transitions."""

    rows = len(grid)
    cols = len(grid[0]) if rows else 0
    working = [row[:] for row in grid]

    for _ in range(passes):
        updated = [[0.0 for _ in range(cols)] for _ in range(rows)]
        for r in range(rows):
            for c in range(cols):
                values: List[float] = []
                for rr in range(max(0, r - 1), min(rows, r + 2)):
                    for cc in range(max(0, c - 1), min(cols, c + 2)):
                        values.append(working[rr][cc])
                updated[r][c] = sum(values) / len(values)
        working = updated
    return working


def exaggerate_heights(grid: Grid, high_multiplier: float = 1.25) -> Grid:
    """Boost notable features to match the narrative framing."""

    exaggerated: Grid = []
    for row in grid:
        exaggerated_row: List[float] = []
        for value in row:
            if value > 450:
                exaggerated_row.append(value * high_multiplier)
            elif value < -300:
                exaggerated_row.append(value * 1.15)
            else:
                exaggerated_row.append(value)
        exaggerated.append(exaggerated_row)
    return exaggerated


def derive_bathymetry(grid: Grid) -> Grid:
    """Extract underwater depths from the DEM."""

    bathymetry: Grid = []
    for row in grid:
        bathymetry_row: List[float] = []
        for value in row:
            depth = min(0.0, value)  # sea level clamp
            bathymetry_row.append(depth)
        bathymetry.append(bathymetry_row)
    return bathymetry


def gradient_magnitude(grid: Grid) -> Grid:
    rows = len(grid)
    cols = len(grid[0]) if rows else 0
    gradients = [[0.0 for _ in range(cols)] for _ in range(rows)]

    for r in range(rows):
        for c in range(cols):
            left = grid[r][c - 1] if c > 0 else grid[r][c]
            right = grid[r][c + 1] if c + 1 < cols else grid[r][c]
            up = grid[r - 1][c] if r > 0 else grid[r][c]
            down = grid[r + 1][c] if r + 1 < rows else grid[r][c]
            dx = (right - left) / 2.0
            dy = (down - up) / 2.0
            gradients[r][c] = sqrt(dx * dx + dy * dy)
    return gradients


def contour_segments(
    grid: Grid,
    levels: Sequence[float],
    tolerance: float = 20.0,
) -> List[Dict[str, object]]:
    """Construct coarse contour segments describing the bathymetry."""

    rows = len(grid)
    cols = len(grid[0]) if rows else 0
    contours: List[Dict[str, object]] = []

    for level in levels:
        segments: List[Dict[str, object]] = []
        for r in range(rows):
            c = 0
            while c < cols:
                if abs(grid[r][c] - level) <= tolerance:
                    start = c
                    max_dev = abs(grid[r][c] - level)
                    while c + 1 < cols and abs(grid[r + 0][c + 1] - level) <= tolerance:
                        c += 1
                        max_dev = max(max_dev, abs(grid[r][c] - level))
                    segment = {
                        "row": r,
                        "start_col": start,
                        "end_col": c,
                        "max_deviation": round(max_dev, 2),
                    }
                    segments.append(segment)
                c += 1
        contours.append({"level": level, "segments": segments})
    return contours


def map_features(features: Sequence[TerrainFeature], grid: Grid) -> List[Dict[str, object]]:
    mapped: List[Dict[str, object]] = []
    for feature in features:
        cells: List[Dict[str, object]] = []
        for r in range(len(grid)):
            for c in range(len(grid[0])):
                if feature.contains(r, c):
                    cells.append({"row": r, "col": c, "elevation": round(grid[r][c], 2)})
        mapped.append(
            {
                "name": feature.name,
                "kind": feature.kind,
                "description": feature.description,
                "cells": cells,
            }
        )
    return mapped


FEATURES: Sequence[TerrainFeature] = [
    TerrainFeature(
        name="Highland Citadel",
        kind="mountain",
        description="A remote research outpost strung across razor-sharp peaks.",
        bounds=(10, 22, 28, 40),
    ),
    TerrainFeature(
        name="Abyssal Trench",
        kind="trench",
        description="A spiraling chasm marked by complex acoustic anomalies.",
        bounds=(40, 55, 10, 26),
    ),
    TerrainFeature(
        name="Mirror Reef",
        kind="reef",
        description="Bioluminescent coral fields reflecting surface light beneath the waves.",
        bounds=(32, 45, 33, 52),
    ),
]


def write_json(path: Path, payload: object) -> None:
    path.write_text(json.dumps(payload, indent=2))


def main() -> None:
    base = build_base_heightmap(GRID_ROWS, GRID_COLS)
    smoothed = smooth_heightmap(base, passes=3)
    exaggerated = exaggerate_heights(smoothed)

    bathymetry = derive_bathymetry(exaggerated)
    gradients = gradient_magnitude(bathymetry)
    contours = contour_segments(bathymetry, levels=[-800, -600, -450, -300, -120])

    feature_cells = map_features(FEATURES, exaggerated)

    dem_payload = {
        "metadata": {
            "rows": GRID_ROWS,
            "cols": GRID_COLS,
            "sea_level": SEA_LEVEL,
            "description": "Smoothed DEM for the floating archipelago of Aurithal.",
        },
        "elevations": [[round(value, 2) for value in row] for row in exaggerated],
        "features": feature_cells,
    }

    bathymetry_payload = {
        "metadata": {
            "description": "Bathymetry gradients and contour segments highlighting navigation hazards.",
        },
        "gradients": [[round(value, 3) for value in row] for row in gradients],
        "contours": contours,
    }

    write_json(DEM_FILE, dem_payload)
    write_json(BATHYMETRY_FILE, bathymetry_payload)


if __name__ == "__main__":
    main()
