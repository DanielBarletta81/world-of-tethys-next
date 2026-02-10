#!/usr/bin/env python3
"""Fetch live analog telemetry (USGS + Open-Meteo) and cache to JSON.

No external dependencies. Intended for dev/prototyping and offline cache.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import math
from pathlib import Path
from typing import Any, Dict, Optional
import urllib.request

USGS_ENDPOINT = "https://waterservices.usgs.gov/nwis/iv/"
OPEN_METEO_ENDPOINT = "https://api.open-meteo.com/v1/forecast"


def clamp(value: float, min_v: float, max_v: float) -> float:
    return max(min_v, min(max_v, value))


def fetch_json(url: str) -> Dict[str, Any]:
    with urllib.request.urlopen(url, timeout=20) as resp:
        payload = resp.read().decode("utf-8")
    return json.loads(payload)


def fetch_usgs(site: str, params: str) -> Dict[str, Any]:
    url = (
        f"{USGS_ENDPOINT}?format=json"
        f"&sites={site}"
        f"&parameterCd={params}"
        f"&siteStatus=all"
    )
    data = fetch_json(url)
    series = data.get("value", {}).get("timeSeries", [])
    readings: Dict[str, Dict[str, Any]] = {}
    for item in series:
        code = None
        if item.get("variable", {}).get("variableCode"):
            code = item["variable"]["variableCode"][0].get("value")
        if not code:
            continue
        values = item.get("values", [{}])[0].get("value", [])
        if not values:
            continue
        latest = values[-1]
        try:
            val = float(latest.get("value"))
        except Exception:
            continue
        readings[code] = {
            "value": val,
            "unit": item.get("variable", {}).get("unit", {}).get("unitCode"),
            "time": latest.get("dateTime"),
        }

    return {
        "siteName": series[0].get("sourceInfo", {}).get("siteName") if series else None,
        "siteCode": series[0].get("sourceInfo", {}).get("siteCode", [{}])[0].get("value") if series else site,
        "readings": readings,
    }


def fetch_open_meteo(lat: float, lon: float) -> Optional[Dict[str, Any]]:
    url = (
        f"{OPEN_METEO_ENDPOINT}?latitude={lat}&longitude={lon}"
        "&current=temperature_2m,relative_humidity_2m,precipitation,pressure_msl,wind_speed_10m"
        "&timezone=UTC"
    )
    data = fetch_json(url)
    current = data.get("current")
    if not current:
        return None
    return {
        "tempC": float(current.get("temperature_2m", 0)),
        "humidity": float(current.get("relative_humidity_2m", 0)),
        "precipMm": float(current.get("precipitation", 0)),
        "pressure": float(current.get("pressure_msl", 1013)),
        "windKph": float(current.get("wind_speed_10m", 0)),
    }


def build_telemetry(usgs: Dict[str, Any], delta: Dict[str, Any], flow_scale: float) -> Dict[str, Any]:
    flow_cfs = usgs.get("readings", {}).get("00060", {}).get("value")
    temp_c = usgs.get("readings", {}).get("00010", {}).get("value")
    turbidity = usgs.get("readings", {}).get("63680", {}).get("value")
    conductance = usgs.get("readings", {}).get("00095", {}).get("value")

    flow_m3s = flow_cfs * 0.0283168 if flow_cfs is not None else None
    scaled_flow = round(flow_m3s * flow_scale) if flow_m3s is not None else None

    humidity = delta.get("humidity", 65)
    precip = delta.get("precipMm", 0.4)
    delta_index = clamp((humidity / 100) * 0.6 + (precip / 10) * 0.4, 0, 1)

    silt_breath = (
        clamp((turbidity / 50) + delta_index * 6, 2, 14)
        if turbidity is not None
        else clamp(4 + delta_index * 6, 2, 14)
    )
    salt_wake = (
        clamp((conductance / 1000) * 1.6, 0.5, 40)
        if conductance is not None
        else clamp(28 - delta_index * 6, 18, 38)
    )

    burn_rate = (
        clamp(abs(temp_c - 24) * 0.6, 0, 18)
        if temp_c is not None
        else clamp(delta.get("tempC", 26) * 0.4, 0, 18)
    )
    heat_grade = temp_c if temp_c is not None else delta.get("tempC", 26)

    veil_pressure = delta.get("pressure", 1013)
    brim_vein = clamp((humidity / 12) + delta_index * 4, 1, 12)

    hazard = (
        5 if scaled_flow and scaled_flow > 14000
        else 4 if scaled_flow and scaled_flow > 10000
        else 3 if scaled_flow and scaled_flow > 8000
        else 2 if scaled_flow and scaled_flow > 5000
        else 1
    )
    condition = "storm" if hazard >= 5 else "rain" if hazard >= 3 else "clear"

    integrity_parts = [flow_cfs, temp_c, turbidity, conductance, humidity]
    filled = len([v for v in integrity_parts if v is not None])
    integrity = clamp(0.4 + (filled / len(integrity_parts)) * 0.6, 0, 1)

    return {
        "weather": {
            "dt": int(dt.datetime.utcnow().timestamp()),
            "visibility": int((0.4 if condition == "storm" else 0.8) * 10000),
            "weather": [{"main": condition, "description": condition}],
            "wind": {"speed": (delta.get("windKph", 10) / 3.6)},
            "main": {"temp": heat_grade, "pressure": veil_pressure, "humidity": humidity},
        },
        "tethys": {
            "metrics": {
                "heatGrade": round(heat_grade * 10) / 10,
                "burnRate": round(burn_rate * 10) / 10,
                "spineFlow": scaled_flow or 7200,
                "saltWake": round(salt_wake * 10) / 10,
                "siltBreath": round(silt_breath * 10) / 10,
                "veilPressure": round(veil_pressure * 10) / 10,
                "brimVein": round(brim_vein * 10) / 10,
            },
            "raw": {
                "flow_cfs": flow_cfs,
                "flow_m3s": flow_m3s,
                "turbidity_ntu": turbidity,
                "conductance_uScm": conductance,
                "delta_index": round(delta_index * 100) / 100,
            },
        },
        "integrity": integrity,
        "aiBrief": f"Danian flow {flow_m3s:.1f} m3/s. Delta pulse {round(delta_index * 100)}%." if flow_m3s else "Danian flow unknown.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch live analog telemetry and cache to JSON")
    parser.add_argument("--site", default="09380000")
    parser.add_argument("--params", default="00060,00010,63680,00095")
    parser.add_argument("--delta-a", default="-0.03,-51.05")
    parser.add_argument("--delta-b", default="10.05,105.75")
    parser.add_argument("--blend", type=float, default=0.5)
    parser.add_argument("--flow-scale", type=float, default=8)
    parser.add_argument("--out-json", default="data/danian_real.json")

    args = parser.parse_args()

    lat_a, lon_a = [float(x) for x in args.delta_a.split(",")]
    lat_b, lon_b = [float(x) for x in args.delta_b.split(",")]

    usgs = fetch_usgs(args.site, args.params)
    delta_a = fetch_open_meteo(lat_a, lon_a) or {}
    delta_b = fetch_open_meteo(lat_b, lon_b) or {}

    blend = {
        "tempC": delta_a.get("tempC", 0) * (1 - args.blend) + delta_b.get("tempC", 0) * args.blend,
        "humidity": delta_a.get("humidity", 0) * (1 - args.blend) + delta_b.get("humidity", 0) * args.blend,
        "precipMm": delta_a.get("precipMm", 0) * (1 - args.blend) + delta_b.get("precipMm", 0) * args.blend,
        "pressure": delta_a.get("pressure", 1013) * (1 - args.blend) + delta_b.get("pressure", 1013) * args.blend,
        "windKph": delta_a.get("windKph", 0) * (1 - args.blend) + delta_b.get("windKph", 0) * args.blend,
    }

    telemetry = build_telemetry(usgs, blend, args.flow_scale)

    payload = {
        "generated_at": dt.datetime.utcnow().isoformat(timespec="seconds"),
        "sources": {
            "usgs": {"site": usgs.get("siteCode"), "name": usgs.get("siteName")},
            "delta": {"a": delta_a, "b": delta_b, "blend": blend},
        },
        "telemetry": telemetry,
    }

    out = Path(args.out_json)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Cached telemetry to {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
