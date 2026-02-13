#!/usr/bin/env python3
"""Live data check: USGS + OpenWeather + optional internal routes.

Usage:
  python devtools/live_data_check.py --out-html devtools/output/live_data.html
  python devtools/live_data_check.py --base-url http://localhost:3000
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

DEFAULT_USGS_PARAMS = "00060,00010,63680,00095"
DEFAULT_USGS_SITES = "09380000"
DEFAULT_WEEP_SITE = "04216000"
DEFAULT_PTEROS_CITY = "Fortaleza,BR"
DEFAULT_LEDGE_LAT = -34.35
DEFAULT_LEDGE_LON = 18.47
DEFAULT_OUT_HTML = "devtools/output/live_data.html"

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
    .card {{ background:#141210; border:1px solid #272320; border-radius:8px; padding:12px; margin-bottom:12px; }}
    table {{ border-collapse: collapse; width: 100%; margin-top: 8px; }}
    th, td {{ border: 1px solid #272320; padding: 6px 8px; font-size: 12px; text-align: left; }}
    th {{ background:#1c1917; color:#f8fafc; }}
    .ok {{ color:#34d399; }}
    .warn {{ color:#fbbf24; }}
    .bad {{ color:#f87171; }}
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


def render_table(headers: List[str], rows: List[List[str]]) -> str:
  if not rows:
    return '<div class="small">None detected.</div>'
  head = "".join(f"<th>{html.escape(h)}</th>" for h in headers)
  body = "".join(
    "<tr>" + "".join(f"<td>{html.escape(c)}</td>" for c in row) + "</tr>" for row in rows
  )
  return f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>"


def load_env_files(paths: List[str]) -> None:
  for path in paths:
    p = Path(path)
    if not p.exists():
      continue
    for line in p.read_text(encoding="utf-8").splitlines():
      line = line.strip()
      if not line or line.startswith("#") or "=" not in line:
        continue
      key, value = line.split("=", 1)
      key = key.strip()
      value = value.strip().strip("\"")
      if key and key not in os.environ:
        os.environ[key] = value


def parse_list(value: str, fallback: str) -> List[str]:
  raw = value or fallback
  return [chunk.strip() for chunk in raw.split(",") if chunk.strip()]


def http_get_json(url: str, timeout: int = 8) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
  req = urllib.request.Request(url, method="GET")
  try:
    with urllib.request.urlopen(req, timeout=timeout) as res:
      payload = res.read().decode("utf-8")
      return json.loads(payload), None
  except Exception as err:  # noqa: BLE001
    return None, str(err)


def fetch_usgs(sites: List[str], params: List[str]) -> Dict[str, Any]:
  base = "https://waterservices.usgs.gov/nwis/iv/"
  url = (
    f"{base}?format=json&sites={urllib.parse.quote(','.join(sites))}"
    f"&parameterCd={urllib.parse.quote(','.join(params))}&siteStatus=all"
  )
  data, error = http_get_json(url)
  if error:
    return {"ok": False, "error": error, "sites": sites}
  series = data.get("value", {}).get("timeSeries", []) if data else []
  by_site: Dict[str, Dict[str, Dict[str, Any]]] = {}
  site_names: Dict[str, str] = {}

  for item in series:
    site_code = item.get("sourceInfo", {}).get("siteCode", [{}])[0].get("value")
    site_name = item.get("sourceInfo", {}).get("siteName")
    if site_code:
      site_names[site_code] = site_name or site_code
    var_code = item.get("variable", {}).get("variableCode", [{}])[0].get("value")
    values = item.get("values", [{}])[0].get("value", [])
    latest = values[-1] if values else None
    if not (site_code and var_code and latest):
      continue
    value = latest.get("value")
    dt_str = latest.get("dateTime")
    unit = item.get("variable", {}).get("unit", {}).get("unitCode")
    by_site.setdefault(site_code, {})[var_code] = {
      "value": value,
      "time": dt_str,
      "unit": unit,
    }

  # Build summaries
  summaries = []
  avg_flow = None
  flow_values = []
  for site in sites:
    data_for_site = by_site.get(site, {})
    flow = data_for_site.get("00060", {}).get("value")
    try:
      if flow is not None:
        flow_values.append(float(flow))
    except (TypeError, ValueError):
      pass
    summaries.append({
      "site": site,
      "name": site_names.get(site, site),
      "flow_cfs": flow,
      "temp_c": data_for_site.get("00010", {}).get("value"),
      "turbidity": data_for_site.get("63680", {}).get("value"),
      "conductance": data_for_site.get("00095", {}).get("value"),
      "time": data_for_site.get("00060", {}).get("time"),
    })
  if flow_values:
    avg_flow = sum(flow_values) / len(flow_values)

  return {
    "ok": True if summaries else False,
    "error": None,
    "sites": summaries,
    "avg_flow_cfs": avg_flow,
  }


def fetch_openweather_city(api_key: str, city: str) -> Dict[str, Any]:
  if not api_key:
    return {"ok": False, "error": "Missing OPENWEATHER_API_KEY"}
  url = (
    "https://api.openweathermap.org/data/2.5/weather?"
    + urllib.parse.urlencode({"q": city, "units": "metric", "appid": api_key})
  )
  data, error = http_get_json(url)
  if error:
    return {"ok": False, "error": error}
  desc = (data.get("weather") or [{}])[0].get("description")
  temp = data.get("main", {}).get("temp")
  wind = data.get("wind", {}).get("speed")
  return {"ok": True, "description": desc, "temp": temp, "wind": wind}


def fetch_openweather_coords(api_key: str, lat: float, lon: float) -> Dict[str, Any]:
  if not api_key:
    return {"ok": False, "error": "Missing OPENWEATHER_API_KEY"}
  url = (
    "https://api.openweathermap.org/data/2.5/weather?"
    + urllib.parse.urlencode({"lat": lat, "lon": lon, "units": "metric", "appid": api_key})
  )
  data, error = http_get_json(url)
  if error:
    return {"ok": False, "error": error}
  desc = (data.get("weather") or [{}])[0].get("description")
  temp = data.get("main", {}).get("temp")
  wind = data.get("wind", {}).get("speed")
  return {"ok": True, "description": desc, "temp": temp, "wind": wind}


def ping_internal(base_url: str, path: str) -> Dict[str, Any]:
  url = base_url.rstrip("/") + path
  data, error = http_get_json(url)
  return {"ok": error is None, "error": error, "url": url, "payload": data}


def main() -> int:
  parser = argparse.ArgumentParser(description="Live data check (USGS + OpenWeather)")
  parser.add_argument("--out-html", default=None)
  parser.add_argument("--out-json", default=None)
  parser.add_argument("--base-url", default=None)
  parser.add_argument("--usgs-sites", default=None)
  parser.add_argument("--usgs-params", default=None)
  parser.add_argument("--weep-site", default=None)
  parser.add_argument("--pteros-city", default=None)
  parser.add_argument("--ledge-lat", type=float, default=None)
  parser.add_argument("--ledge-lon", type=float, default=None)
  parser.add_argument("--strict", action="store_true")
  args = parser.parse_args()

  load_env_files([".env.local", ".env"])

  usgs_sites = parse_list(args.usgs_sites or os.environ.get("DANIAN_USGS_SITE", ""), DEFAULT_USGS_SITES)
  usgs_params = parse_list(args.usgs_params or os.environ.get("DANIAN_USGS_PARAMS", ""), DEFAULT_USGS_PARAMS)
  weep_site = (args.weep_site or os.environ.get("WEEP_USGS_SITE") or DEFAULT_WEEP_SITE).strip()
  pteros_city = args.pteros_city or os.environ.get("PTEROS_CITY", DEFAULT_PTEROS_CITY)
  ledge_lat = args.ledge_lat or float(os.environ.get("LEDGE_LAT", DEFAULT_LEDGE_LAT))
  ledge_lon = args.ledge_lon or float(os.environ.get("LEDGE_LON", DEFAULT_LEDGE_LON))

  api_key = os.environ.get("OPENWEATHER_API_KEY")

  ts = dt.datetime.utcnow().isoformat() + "Z"
  title = "Live Data Check"

  usgs_report = fetch_usgs(usgs_sites, usgs_params)
  weep_report = fetch_usgs([weep_site], ["00060"])
  pteros_report = fetch_openweather_city(api_key or "", pteros_city)
  ledge_report = fetch_openweather_coords(api_key or "", ledge_lat, ledge_lon)

  internal_checks = []
  if args.base_url:
    internal_checks.append({"name": "telemetry/danian", **ping_internal(args.base_url, "/api/telemetry/danian?mode=usgs")})
    internal_checks.append({"name": "oracle-live", **ping_internal(args.base_url, "/api/oracle-live")})

  # Build HTML
  usgs_rows = [
    [
      s.get("site") or "-",
      s.get("name") or "-",
      str(s.get("flow_cfs") or "-"),
      str(s.get("temp_c") or "-"),
      str(s.get("turbidity") or "-"),
      str(s.get("conductance") or "-"),
      s.get("time") or "-",
    ]
    for s in usgs_report.get("sites") or []
  ]

  weep_rows = [
    [
      s.get("site") or "-",
      s.get("name") or "-",
      str(s.get("flow_cfs") or "-"),
      s.get("time") or "-",
    ]
    for s in weep_report.get("sites") or []
  ]

  weather_rows = [
    [
      "Pteros",
      pteros_city,
      "ok" if pteros_report.get("ok") else "fail",
      pteros_report.get("description") or pteros_report.get("error") or "-",
      str(pteros_report.get("temp") or "-"),
      str(pteros_report.get("wind") or "-"),
    ],
    [
      "Ledge",
      f"{ledge_lat},{ledge_lon}",
      "ok" if ledge_report.get("ok") else "fail",
      ledge_report.get("description") or ledge_report.get("error") or "-",
      str(ledge_report.get("temp") or "-"),
      str(ledge_report.get("wind") or "-"),
    ],
  ]

  internal_rows = [
    [
      item.get("name") or "-",
      item.get("url") or "-",
      "ok" if item.get("ok") else "fail",
      item.get("error") or "-",
    ]
    for item in internal_checks
  ]

  body = []
  body.append(
    "<div class=\"card\">"
    "<h2>Danian USGS (Average)</h2>"
    f"<div class=\"small\">Sites: {', '.join(usgs_sites)} | Params: {', '.join(usgs_params)}</div>"
    + render_table(["Site", "Name", "Flow (cfs)", "Temp", "Turbidity", "Conductance", "Time"], usgs_rows)
    + f"<div class=\"small\">Avg Flow (cfs): {usgs_report.get('avg_flow_cfs') or 'n/a'}</div>"
    + "</div>"
  )
  body.append(
    "<div class=\"card\">"
    "<h2>Weep USGS</h2>"
    f"<div class=\"small\">Site: {weep_site}</div>"
    + render_table(["Site", "Name", "Flow (cfs)", "Time"], weep_rows)
    + "</div>"
  )
  body.append(
    "<div class=\"card\">"
    "<h2>OpenWeather</h2>"
    + render_table(["Location", "Query", "Status", "Description", "Temp", "Wind"], weather_rows)
    + "</div>"
  )
  if internal_rows:
    body.append(
      "<div class=\"card\">"
      "<h2>Internal API</h2>"
      + render_table(["Route", "URL", "Status", "Error"], internal_rows)
      + "</div>"
    )

  html_out = HTML_TEMPLATE.format(title=html.escape(title), ts=ts, body="".join(body))

  if args.out_html:
    Path(args.out_html).write_text(html_out, encoding="utf-8")
    print(f"[devtools] wrote {args.out_html}")
  else:
    print(f"{title} @ {ts}")
    print(f"USGS sites: {', '.join(usgs_sites)}")
    if usgs_report.get("avg_flow_cfs") is not None:
      print(f"Avg flow (cfs): {usgs_report['avg_flow_cfs']:.1f}")
    print(f"OpenWeather key: {'ok' if api_key else 'missing'}")
    if args.base_url:
      for item in internal_checks:
        status = "ok" if item.get("ok") else "fail"
        print(f"{item.get('name')}: {status}")

  if args.out_json:
    payload = {
      "generatedAt": ts,
      "usgs": usgs_report,
      "weep": weep_report,
      "openweather": {"pteros": pteros_report, "ledge": ledge_report},
      "internal": internal_checks,
    }
    Path(args.out_json).write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"[devtools] wrote {args.out_json}")

  required_ok = bool(usgs_report.get("ok")) and bool(weep_report.get("ok")) and bool(pteros_report.get("ok"))
  if args.strict and not required_ok:
    return 1
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
