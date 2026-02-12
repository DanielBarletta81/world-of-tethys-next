#!/usr/bin/env python3
"""Preflight check: env vars, API route files, optional HTTP checks.

Usage:
  python devtools/preflight_check.py --base-url http://localhost:3000 --out-html devtools/output/preflight.html
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
from typing import Any, Dict, List, Optional

DEFAULT_CONFIG = "devtools/config/preflight.json"
DEFAULT_OUT_HTML = "devtools/output/preflight.html"

HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{title}</title>
  <style>
    :root {{ color-scheme: dark; }}
    body {{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; background:#0c0a09; color:#e7e5e4; margin:0; padding:24px; }}
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
  <div class="meta">Generated: {ts}</div>
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


def load_config(path: str) -> Dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def resolve_route_file(path: str) -> Optional[Path]:
    if not path.startswith("/api/"):
        return None
    segments = [seg for seg in path.strip("/").split("/") if seg]
    if not segments or segments[0] != "api":
        return None
    base = Path("src/app/api").joinpath(*segments[1:])
    for ext in ("ts", "js", "tsx", "jsx"):
        candidate = base / f"route.{ext}"
        if candidate.exists():
            return candidate
    return None


def env_status(name: str) -> bool:
    value = os.environ.get(name)
    return bool(value and str(value).strip())


def group_status(group: Dict[str, Any]) -> bool:
    any_of = group.get("any_of") or []
    for option in any_of:
        if "," in option:
            parts = [p.strip() for p in option.split(",") if p.strip()]
            if all(env_status(p) for p in parts):
                return True
        else:
            if env_status(option):
                return True
    all_of = group.get("all_of") or []
    if all_of:
        return all(env_status(p) for p in all_of)
    return False


def http_check(base_url: str, route: Dict[str, Any]) -> Dict[str, Any]:
    method = (route.get("method") or "GET").upper()
    expect = route.get("expect") or [200]
    query = route.get("query") or {}
    body = route.get("body")

    url = base_url.rstrip("/") + route["path"]
    if query:
        url += "?" + urllib.parse.urlencode(query, doseq=True)

    data = None
    headers = {}
    if method not in ("GET", "HEAD"):
        payload = json.dumps(body or {}).encode("utf-8")
        data = payload
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, method=method, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=8) as res:
            status = res.getcode()
            ok = status in expect
            return {"status": status, "ok": ok, "error": None}
    except urllib.error.HTTPError as err:
        status = err.code
        ok = status in expect
        return {"status": status, "ok": ok, "error": f"HTTP {status}"}
    except Exception as err:  # noqa: BLE001
        return {"status": 0, "ok": False, "error": str(err)}


def main() -> int:
    parser = argparse.ArgumentParser(description="Preflight: env + routes + optional HTTP")
    parser.add_argument("--config", default=DEFAULT_CONFIG)
    parser.add_argument("--base-url", default=None)
    parser.add_argument("--out-html", default=None)
    parser.add_argument("--skip-http", action="store_true")
    args = parser.parse_args()

    config = load_config(args.config)
    title = config.get("name") or "Preflight Check"
    ts = dt.datetime.utcnow().isoformat() + "Z"

    env_required = config.get("env_required") or []
    env_optional = config.get("env_optional") or []
    env_groups = config.get("env_groups") or []
    routes = config.get("routes") or []

    env_rows = []
    missing_required = 0
    for name in env_required:
        ok = env_status(name)
        env_rows.append([name, "ok" if ok else "missing"])
        if not ok:
            missing_required += 1

    optional_rows = []
    for name in env_optional:
        ok = env_status(name)
        optional_rows.append([name, "ok" if ok else "missing"])

    group_rows = []
    for group in env_groups:
        label = group.get("label") or "Group"
        ok = group_status(group)
        group_rows.append([label, "ok" if ok else "missing"])

    route_rows = []
    for route in routes:
        path = route.get("path")
        if not path:
            continue
        file_path = route.get("file")
        resolved = Path(file_path) if file_path else resolve_route_file(path)
        file_ok = resolved.exists() if resolved else False

        http_result = None
        http_state = "skipped"
        if args.base_url and not args.skip_http and not route.get("requires_auth", False):
            http_result = http_check(args.base_url, route)
            http_state = "ok" if http_result["ok"] else "fail"

        route_rows.append([
            path,
            (resolved.as_posix() if resolved else "missing"),
            "ok" if file_ok else "missing",
            http_state if args.base_url else "skipped",
            str(http_result["status"]) if http_result else "-"
        ])

    body = []
    body.append(
        "<div class=\"card\">"
        f"<h2>Required Env Vars ({len(env_required)})</h2>"
        + render_table(["Var", "Status"], env_rows)
        + "</div>"
    )
    body.append(
        "<div class=\"card\">"
        f"<h2>Optional Env Vars ({len(env_optional)})</h2>"
        + render_table(["Var", "Status"], optional_rows)
        + "</div>"
    )
    if env_groups:
        body.append(
            "<div class=\"card\">"
            f"<h2>Env Groups ({len(env_groups)})</h2>"
            + render_table(["Group", "Status"], group_rows)
            + "</div>"
        )
    body.append(
        "<div class=\"card\">"
        f"<h2>Routes ({len(route_rows)})</h2>"
        + render_table(["Route", "File", "File OK", "HTTP", "Status"], route_rows)
        + "</div>"
    )

    html_out = HTML_TEMPLATE.format(title=html.escape(title), ts=ts, body="".join(body))
    if args.out_html:
        Path(args.out_html).write_text(html_out, encoding="utf-8")
        print(f"[devtools] wrote {args.out_html}")
    else:
        print(f"{title} @ {ts}")
        print(f"Required env missing: {missing_required}")
        for row in env_rows:
            if row[1] != "ok":
                print(f"  - missing: {row[0]}")
        print("")
        for row in route_rows:
            print(f"{row[0]} | file: {row[2]} | http: {row[3]} {row[4]}")

    return 0 if missing_required == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
