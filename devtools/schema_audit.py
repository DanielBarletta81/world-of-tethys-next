#!/usr/bin/env python3
"""Schema audit for WPGraphQL queries used by the app.

Reads actual query strings from lib files, runs against WP_GRAPHQL_ENDPOINT,
checks required fields, and outputs terminal + optional HTML report.
No external dependencies.
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List
import urllib.request
import urllib.error

DEFAULT_QUERY_FILES = [
    "src/lib/tethys-api.js",
    "src/lib/graphql.js",
]
DEFAULT_RULES_PATH = "devtools/config/schema_rules.json"
DEFAULT_OUT_HTML = "devtools/output/schema_audit.html"

HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{title}</title>
  <style>
    :root {{ color-scheme: dark; }}
    body {{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; background:#0c0a09; color:#e7e5e4; margin:0; padding:24px; }}
    h1,h2,h3 {{ margin: 0 0 12px 0; }}
    .meta {{ color:#a8a29e; font-size:12px; margin-bottom:16px; }}
    .card {{ background:#141210; border:1px solid #272320; border-radius:8px; padding:12px; margin-bottom:12px; }}
    .ok {{ color:#86efac; }}
    .bad {{ color:#fca5a5; }}
    table {{ border-collapse: collapse; width: 100%; margin-top: 8px; }}
    th, td {{ border: 1px solid #272320; padding: 6px 8px; font-size: 12px; text-align: left; }}
    th {{ background:#1c1917; color:#f8fafc; }}
    .path {{ color:#93c5fd; }}
    .small {{ font-size: 11px; color:#a8a29e; }}
    code {{ color:#fbbf24; }}
  </style>
</head>
<body>
  <h1>{title}</h1>
  <div class="meta">Generated: {ts}</div>
  {body}
</body>
</html>
"""

MISSING = object()


def load_env_files(paths: List[str]) -> None:
    for p in paths:
        path = Path(p)
        if not path.exists() or not path.is_file():
            continue
        try:
            for line in path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                os.environ.setdefault(key, value)
        except Exception:
            continue


def _extract_template_literals(text: str) -> List[str]:
    literals: List[str] = []
    i = 0
    n = len(text)
    while i < n:
        if text[i] != "`":
            i += 1
            continue
        i += 1
        buf: List[str] = []
        brace_depth = 0
        while i < n:
            ch = text[i]
            if ch == "\\" and i + 1 < n:
                buf.append(ch)
                buf.append(text[i + 1])
                i += 2
                continue
            if ch == "`" and brace_depth == 0:
                i += 1
                break
            if ch == "$" and i + 1 < n and text[i + 1] == "{":
                brace_depth = max(brace_depth, 0) + 1
                buf.append("${")
                i += 2
                continue
            if brace_depth > 0:
                if ch == "{":
                    brace_depth += 1
                elif ch == "}":
                    brace_depth -= 1
                buf.append(ch)
                i += 1
                continue
            buf.append(ch)
            i += 1
        literals.append("".join(buf))
    return literals


def extract_queries_from_text(text: str, source: str) -> List[Dict[str, Any]]:
    queries: List[Dict[str, Any]] = []
    for raw in _extract_template_literals(text):
        if "query" not in raw:
            continue
        cleaned = re.sub(r"\$\{[^}]+\}", "[]", raw)
        cleaned = "\n".join(line.rstrip() for line in cleaned.splitlines()).strip()
        if not cleaned:
            continue
        name_match = re.search(r"\bquery\s+([A-Za-z0-9_]+)", cleaned)
        name = name_match.group(1) if name_match else f"Query{len(queries) + 1}"
        queries.append({"name": name, "query": cleaned, "source": source})
    return queries


def extract_queries(files: List[str]) -> List[Dict[str, Any]]:
    found: List[Dict[str, Any]] = []
    for path in files:
        file_path = Path(path)
        if not file_path.exists():
            continue
        text = file_path.read_text(encoding="utf-8", errors="ignore")
        found.extend(extract_queries_from_text(text, str(file_path)))
    return found


def load_rules(path: str) -> Dict[str, Any]:
    rules_path = Path(path)
    if not rules_path.exists():
        return {"queries": []}
    try:
        return json.loads(rules_path.read_text(encoding="utf-8"))
    except Exception:
        return {"queries": []}


def graphql_request(endpoint: str, query: str, variables: Dict[str, Any], auth: str | None) -> Dict[str, Any]:
    payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if auth:
        headers["Authorization"] = f"Basic {auth}"
    req = urllib.request.Request(endpoint, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read().decode("utf-8")
            return json.loads(data)
    except urllib.error.HTTPError as err:
        try:
            body = err.read().decode("utf-8")
        except Exception:
            body = ""
        return {"errors": [{"message": f"HTTP {err.code} {err.reason}", "details": body}], "data": None}
    except Exception as err:
        return {"errors": [{"message": str(err)}], "data": None}


def collect_values(obj: Any, parts: List[str]) -> List[Any]:
    if not parts:
        return [obj]
    key = parts[0]
    if isinstance(obj, list):
        values: List[Any] = []
        for item in obj:
            values.extend(collect_values(item, parts))
        return values
    if isinstance(obj, dict):
        if key in obj:
            return collect_values(obj[key], parts[1:])
        return [MISSING]
    return [MISSING]


def summarize_path(data: Any, path: str) -> Dict[str, Any]:
    parts = path.split(".")
    values = collect_values(data, parts)
    total = len(values)
    missing = sum(1 for v in values if v is MISSING)
    nulls = sum(1 for v in values if v is None)
    sample = None
    for v in values:
        if v is MISSING or v is None:
            continue
        if isinstance(v, (dict, list)):
            sample = json.dumps(v)[:120]
        else:
            sample = str(v)[:120]
        break
    return {"path": path, "total": total, "missing": missing, "nulls": nulls, "sample": sample}


def render_html(title: str, results: List[Dict[str, Any]]) -> str:
    blocks = []
    for res in results:
        status = "OK" if not res.get("errors") else "ERROR"
        status_class = "ok" if status == "OK" else "bad"
        summary_rows = []
        for item in res.get("required", []):
            summary_rows.append(
                "<tr>"
                f"<td><code>{html.escape(item['path'])}</code></td>"
                f"<td>{item['total']}</td>"
                f"<td>{item['missing']}</td>"
                f"<td>{item['nulls']}</td>"
                f"<td>{html.escape(item['sample'] or '')}</td>"
                "</tr>"
            )
        summary_table = (
            "<table><thead><tr><th>Path</th><th>Total</th><th>Missing</th><th>Null</th><th>Sample</th></tr></thead>"
            f"<tbody>{''.join(summary_rows) or '<tr><td colspan=5>No required fields configured.</td></tr>'}</tbody></table>"
        )
        error_block = ""
        if res.get("errors"):
            err_lines = "".join(
                f"<div class=\"small\">{html.escape(err.get('message',''))}</div>" for err in res["errors"]
            )
            error_block = f"<div class=\"small\">Errors:{err_lines}</div>"
        blocks.append(
            f"<div class=\"card\">"
            f"<h2>{html.escape(res['name'])} <span class=\"{status_class}\">{status}</span></h2>"
            f"<div class=\"small\">Source: <span class=\"path\">{html.escape(res['source'])}</span></div>"
            f"{error_block}"
            f"{summary_table}"
            "</div>"
        )

    return HTML_TEMPLATE.format(
        title=html.escape(title),
        ts=dt.datetime.now().isoformat(timespec="seconds"),
        body="\n".join(blocks),
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit WPGraphQL data shapes used by the app")
    parser.add_argument("--query-files", nargs="*", default=DEFAULT_QUERY_FILES)
    parser.add_argument("--rules", default=DEFAULT_RULES_PATH)
    parser.add_argument("--out-html", dest="out_html", default=DEFAULT_OUT_HTML)
    args = parser.parse_args()

    load_env_files([".env", ".env.local"])
    endpoint = os.environ.get("WP_GRAPHQL_ENDPOINT")
    wp_user = os.environ.get("WP_USER")
    wp_pass = os.environ.get("WP_APP_PASS")

    if not endpoint:
        print("Missing WP_GRAPHQL_ENDPOINT. Set env or add to .env.local.")
        return 1

    auth = None
    if wp_user and wp_pass:
        auth = (f"{wp_user}:{wp_pass}").encode("utf-8")
        auth = __import__("base64").b64encode(auth).decode("utf-8")

    queries = extract_queries(args.query_files)
    if not queries:
        print("No queries found.")
        return 1

    rules = load_rules(args.rules)
    rule_map = {q.get("name"): q for q in rules.get("queries", []) if q.get("name")}

    results = []
    for q in queries:
        rule = rule_map.get(q["name"], {})
        variables = rule.get("variables", {})
        resp = graphql_request(endpoint, q["query"], variables, auth)
        data = resp.get("data") or {}
        errors = resp.get("errors") or []

        required_paths = rule.get("required", [])
        required_stats = [summarize_path(data, p) for p in required_paths]
        results.append(
            {
                "name": q["name"],
                "source": q["source"],
                "errors": errors,
                "required": required_stats,
            }
        )

    for res in results:
        status = "OK" if not res.get("errors") else "ERROR"
        print(f"{res['name']}: {status}")
        for item in res.get("required", []):
            if item["missing"] or item["nulls"]:
                print(
                    f"  - {item['path']}: total={item['total']} missing={item['missing']} null={item['nulls']}"
                )

    out_html = Path(args.out_html)
    try:
        out_html.parent.mkdir(parents=True, exist_ok=True)
        out_html.write_text(render_html("Tethys Schema Audit", results), encoding="utf-8")
        print(f"HTML report written to {out_html}")
    except Exception as err:
        print(f"Failed to write HTML report: {err}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
