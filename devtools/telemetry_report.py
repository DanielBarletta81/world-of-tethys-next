#!/usr/bin/env python3
"""Generate a static HTML report from telemetry_sim JSON.

No external dependencies.
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
from pathlib import Path
from typing import Dict, List

HTML_TEMPLATE = """<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />
  <title>{title}</title>
  <style>
    :root {{ color-scheme: dark; }}
    body {{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, \"Liberation Mono\", monospace; background:#0c0a09; color:#e7e5e4; margin:0; padding:24px; }}
    h1,h2 {{ margin: 0 0 12px 0; }}
    .meta {{ color:#a8a29e; font-size:12px; margin-bottom:16px; }}
    .grid {{ display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px; }}
    .card {{ background:#141210; border:1px solid #272320; border-radius:8px; padding:12px; }}
    table {{ border-collapse: collapse; width: 100%; margin-top: 8px; }}
    th, td {{ border: 1px solid #272320; padding: 6px 8px; font-size: 12px; text-align: left; }}
    th {{ background:#1c1917; color:#f8fafc; }}
    .spark {{ width: 100%; height: 48px; }}
    .small {{ font-size: 11px; color:#a8a29e; }}
  </style>
</head>
<body>
  <h1>{title}</h1>
  <div class=\"meta\">Generated: {ts}</div>
  {body}
</body>
</html>
"""


def load_series(path: Path) -> Dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    return data


def stats(values: List[float]) -> Dict[str, float]:
    if not values:
        return {"min": 0, "max": 0, "avg": 0}
    return {
        "min": min(values),
        "max": max(values),
        "avg": sum(values) / len(values),
    }


def sparkline(values: List[float]) -> str:
    if not values:
        return ""
    min_v = min(values)
    max_v = max(values)
    span = max_v - min_v or 1
    points = []
    for i, v in enumerate(values):
        x = i / (len(values) - 1 or 1) * 100
        y = 100 - ((v - min_v) / span * 100)
        points.append(f"{x:.2f},{y:.2f}")
    return (
        f"<svg class='spark' viewBox='0 0 100 100' preserveAspectRatio='none'>"
        f"<polyline fill='none' stroke='#f59e0b' stroke-width='2' points='{ ' '.join(points) }' />"
        f"</svg>"
    )


def render_metric(title: str, values: List[float]) -> str:
    s = stats(values)
    return (
        "<div class='card'>"
        f"<h2>{html.escape(title)}</h2>"
        f"<div class='small'>min {s['min']:.2f} · max {s['max']:.2f} · avg {s['avg']:.2f}</div>"
        f"{sparkline(values)}"
        "</div>"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate telemetry HTML report")
    parser.add_argument("--in-json", dest="in_json", default="data/danian_sim.json")
    parser.add_argument("--out-html", dest="out_html", default="devtools/output/telemetry_report.html")
    args = parser.parse_args()

    data = load_series(Path(args.in_json))
    series = data.get("series", [])

    metrics = {
        "Flow (m3/s)": [p["flow_m3s"] for p in series],
        "Turbidity (NTU)": [p["turbidity_ntu"] for p in series],
        "Temperature (C)": [p["temp_c"] for p in series],
        "Nutrients (mg/L)": [p["nutrients_mgL"] for p in series],
        "Salinity (PSU)": [p["salinity_psu"] for p in series],
        "Anoxic Index": [p["anoxic_index"] for p in series],
        "Glow Tide": [p["glow_tide_index"] for p in series],
    }

    cards = "<div class='grid'>" + "".join(render_metric(k, v) for k, v in metrics.items()) + "</div>"

    out = Path(args.out_html)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        HTML_TEMPLATE.format(
            title="Danian River Telemetry Report",
            ts=dt.datetime.utcnow().isoformat(timespec="seconds"),
            body=cards,
        ),
        encoding="utf-8",
    )

    print(f"Report written to {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
