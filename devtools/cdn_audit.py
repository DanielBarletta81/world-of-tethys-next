#!/usr/bin/env python3
"""CDN audit: scan codebase for cdn('...') paths and verify they resolve.

Usage:
  python devtools/cdn_audit.py --out-html devtools/output/cdn_audit.html
  python devtools/cdn_audit.py --base https://your.cdn.net
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Dict, List, Optional, Tuple

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


def render_table(headers: List[str], rows: List[List[str]]) -> str:
  if not rows:
    return '<div class="small">None detected.</div>'
  head = "".join(f"<th>{html.escape(h)}</th>" for h in headers)
  body = "".join(
    "<tr>" + "".join(f"<td>{html.escape(c)}</td>" for c in row) + "</tr>" for row in rows
  )
  return f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>"


def find_paths(root: Path) -> List[Tuple[str, str]]:
  cdn_regex = re.compile(r"cdn\((['\"])([^'\"]+)\1\)")
  results: List[Tuple[str, str]] = []
  for path in root.rglob("*"):
    if path.is_dir():
      continue
    if "node_modules" in path.parts or ".next" in path.parts:
      continue
    if path.suffix not in {".js", ".jsx", ".ts", ".tsx"}:
      continue
    text = path.read_text(encoding="utf-8", errors="ignore")
    for match in cdn_regex.finditer(text):
      asset = match.group(2)
      if "${" in asset:
        continue
      results.append((asset, str(path)))
    # direct URLs from the known bucket
    for match in re.finditer(r"https?://[^'\"\s]+", text):
      url = match.group(0)
      if "world-of-tethys-site" in url:
        results.append((url, str(path)))
  return results


def build_url(asset: str, base: str) -> Optional[str]:
  if asset.startswith("http://") or asset.startswith("https://"):
    return asset
  if not base:
    return None
  trimmed_base = base.rstrip("/")
  trimmed_asset = asset[1:] if asset.startswith("/") else asset
  return f"{trimmed_base}/{trimmed_asset}"


def probe(url: str) -> Tuple[str, str]:
  req = urllib.request.Request(url, method="HEAD")
  try:
    with urllib.request.urlopen(req, timeout=8) as res:
      return "ok", str(res.getcode())
  except urllib.error.HTTPError as err:
    if err.code in (401, 403):
      return "warn", f"HTTP {err.code}"
    if err.code in (405,):
      # retry GET
      req = urllib.request.Request(url, method="GET")
      try:
        with urllib.request.urlopen(req, timeout=8) as res:
          return "ok", str(res.getcode())
      except Exception as inner:
        return "bad", str(inner)
    return "bad", f"HTTP {err.code}"
  except Exception as err:  # noqa: BLE001
    return "bad", str(err)


def main() -> int:
  parser = argparse.ArgumentParser(description="CDN audit")
  parser.add_argument("--root", default="src")
  parser.add_argument("--base", default=None)
  parser.add_argument("--out-html", default=None)
  parser.add_argument("--out-json", default=None)
  parser.add_argument("--style", default="plain", choices=["plain", "tethys"])
  args = parser.parse_args()

  load_env_files([".env.local", ".env"])

  base = args.base or os.environ.get("NEXT_PUBLIC_CDN_DIST") or os.environ.get("NEXT_PUBLIC_CDN_BASE") or ""
  assets = find_paths(Path(args.root))

  seen = {}
  for asset, source in assets:
    seen.setdefault(asset, set()).add(source)

  rows = []
  results = []

  for asset, sources in sorted(seen.items()):
    url = build_url(asset, base)
    if not url:
      status = "warn"
      detail = "missing base"
    else:
      status, detail = probe(url)
    label = status
    if args.style == "tethys":
      label = {
        "ok": "signal steady",
        "warn": "signal dim",
        "bad": "signal lost",
      }.get(status, status)
    rows.append([asset, url or "-", label, detail, ", ".join(sorted(sources))])
    results.append({"asset": asset, "url": url, "status": status, "detail": detail, "sources": sorted(sources)})

  body = (
    "<div class=\"card\">"
    "<h2>CDN Asset Check</h2>"
    + f"<div class=\"small\">Base: {html.escape(base or 'missing')}</div>"
    + render_table(["Asset", "URL", "Status", "Detail", "Sources"], rows)
    + "</div>"
  )

  html_out = HTML_TEMPLATE.format(title="CDN Audit", ts=dt.datetime.utcnow().isoformat() + "Z", body=body)

  if args.out_html:
    Path(args.out_html).write_text(html_out, encoding="utf-8")
    print(f"[devtools] wrote {args.out_html}")
  else:
    print(f"CDN Audit @ {dt.datetime.utcnow().isoformat()}Z")
    bad = [r for r in results if r["status"] == "bad"]
    warn = [r for r in results if r["status"] == "warn"]
    print(f"Missing base: {1 if not base else 0}")
    print(f"Bad: {len(bad)} | Warn: {len(warn)} | Total: {len(results)}")

  if args.out_json:
    Path(args.out_json).write_text(json.dumps({"base": base, "results": results}, indent=2), encoding="utf-8")
    print(f"[devtools] wrote {args.out_json}")

  return 0


if __name__ == "__main__":
  raise SystemExit(main())
