#!/usr/bin/env python3
"""Telemetry simulator for Tethys river signals (dev-only).

Generates time-series data for river flow, turbidity, temperature,
nutrients, salinity, anoxic index, and glow-tide index.
No external dependencies.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import math
import random
from pathlib import Path
from typing import Dict, List, Tuple


def clamp(value: float, min_v: float, max_v: float) -> float:
    return max(min_v, min(max_v, value))


def isoformat(ts: dt.datetime) -> str:
    return ts.replace(microsecond=0).isoformat()


def build_storm_profile(length: int, peak: float) -> List[float]:
    profile: List[float] = []
    for i in range(length):
        # bell curve-ish pulse centered in the middle
        x = (i - (length - 1) / 2) / (length / 6)
        profile.append(peak * math.exp(-0.5 * x * x))
    return profile


def generate_series(days: int, interval_minutes: int, seed: int) -> Tuple[List[Dict], Dict]:
    random.seed(seed)
    start = dt.datetime.utcnow().replace(minute=0, second=0)
    steps = int(days * 24 * 60 / interval_minutes)
    step_minutes = interval_minutes

    storm_prob_per_day = 0.08
    storm_events: List[Tuple[int, int, float]] = []
    storm_signal = [0.0 for _ in range(steps)]

    for day in range(days):
        if random.random() < storm_prob_per_day:
            start_idx = int(day * 24 * 60 / interval_minutes + random.randint(0, max(0, int(6 * 60 / interval_minutes) - 1)))
            duration_hours = random.randint(6, 18)
            duration_steps = int(duration_hours * 60 / interval_minutes)
            peak = random.uniform(0.6, 1.0)
            profile = build_storm_profile(duration_steps, peak)
            for i, val in enumerate(profile):
                idx = start_idx + i
                if 0 <= idx < steps:
                    storm_signal[idx] = max(storm_signal[idx], val)
            storm_events.append((start_idx, duration_steps, peak))

    series: List[Dict] = []
    for i in range(steps):
        ts = start + dt.timedelta(minutes=i * step_minutes)
        day_of_year = ts.timetuple().tm_yday
        seasonal = (math.sin((day_of_year / 365.0) * 2 * math.pi) + 1) / 2
        daily = (math.sin((ts.hour / 24.0) * 2 * math.pi) + 1) / 2
        tide = (math.sin(((ts.hour + ts.minute / 60) / 12.4) * 2 * math.pi) + 1) / 2

        storm = storm_signal[i]

        flow_base = 200 + seasonal * 6000
        flow_spike = storm * 12000
        flow_noise = random.uniform(-120, 120)
        flow = clamp(flow_base + flow_spike + flow_noise, 200, 18000)

        turbidity = clamp(5 + flow * 0.02 + storm * 300 + random.uniform(-8, 8), 5, 800)
        temp = clamp(22 + seasonal * 6 + (daily - 0.5) * 6 - storm * 2, 18, 34)
        nutrients = clamp(0.4 + storm * 1.5 + (flow / 18000) * 1.2 + random.uniform(-0.05, 0.05), 0.1, 5)
        salinity = clamp(6 - (flow / 18000) * 5 + (tide - 0.5) * 4 - storm * 1.5, 0.1, 12)

        flow_norm = (flow - 200) / (18000 - 200)
        calmness = 1 - storm
        anoxic = clamp(0.15 + (nutrients / 5) * 0.5 + calmness * 0.25 + (1 - flow_norm) * 0.2, 0, 1)
        glow = clamp((nutrients / 5) * 0.6 + calmness * 0.3 + (1 - daily) * 0.2, 0, 1)

        hazard = 1
        if storm > 0.8 or flow > 14000:
            hazard = 5
        elif storm > 0.6 or flow > 10000:
            hazard = 4
        elif storm > 0.4 or flow > 8000:
            hazard = 3
        elif storm > 0.2 or flow > 5000:
            hazard = 2

        series.append({
            "timestamp": isoformat(ts),
            "flow_m3s": round(flow, 2),
            "turbidity_ntu": round(turbidity, 2),
            "temp_c": round(temp, 2),
            "nutrients_mgL": round(nutrients, 3),
            "salinity_psu": round(salinity, 2),
            "anoxic_index": round(anoxic, 3),
            "glow_tide_index": round(glow, 3),
            "storm_index": round(storm, 3),
            "hazard_level": hazard,
        })

    metadata = {
        "generated_at": isoformat(dt.datetime.utcnow()),
        "seed": seed,
        "days": days,
        "interval_minutes": interval_minutes,
        "storm_events": len(storm_events),
    }
    return series, metadata


def write_json(path: Path, metadata: Dict, series: List[Dict]) -> None:
    payload = {"metadata": metadata, "series": series}
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def write_csv(path: Path, series: List[Dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not series:
        path.write_text("", encoding="utf-8")
        return
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(series[0].keys()))
        writer.writeheader()
        writer.writerows(series)


def main() -> int:
    parser = argparse.ArgumentParser(description="Simulate Danian River telemetry")
    parser.add_argument("--days", type=int, default=30)
    parser.add_argument("--interval-minutes", type=int, default=60)
    parser.add_argument("--seed", type=int, default=111)
    parser.add_argument("--out-json", default="data/danian_sim.json")
    parser.add_argument("--out-csv", default="data/danian_sim.csv")

    args = parser.parse_args()

    series, metadata = generate_series(args.days, args.interval_minutes, args.seed)
    write_json(Path(args.out_json), metadata, series)
    write_csv(Path(args.out_csv), series)

    print(f"Generated {len(series)} points")
    print(f"JSON: {args.out_json}")
    print(f"CSV: {args.out_csv}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
