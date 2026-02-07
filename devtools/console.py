#!/usr/bin/env python3
"""Keyword-searchable developer console with optional HTML output.

Focused on API + content delivery stacks (maps, data, UI).
No external dependencies.
"""

from __future__ import annotations

import argparse
import datetime as dt
import fnmatch
import html
import json
import os
import re
import sys
from pathlib import Path
from typing import Iterable, List, Dict, Any, Tuple

DEFAULT_PATHS = [
    "src/app/api",
    "src/lib",
    "src/components",
    "src/context",
]

DEFAULT_GLOBS = [
    "**/*.js",
    "**/*.jsx",
    "**/*.ts",
    "**/*.tsx",
    "**/*.json",
    "**/*.md",
    "**/*.log",
]

TAG_PATTERNS = {
    "error": [r"\berror\b", r"\bexception\b", r"\bfailed\b", r"\btraceback\b"],
    "warn": [r"\bwarn\b", r"\bwarning\b", r"\bdeprecate\b"],
    "api": [r"/api/", r"NextResponse", r"route\.[jt]s"],
    "db": [r"firestore", r"firebase", r"supabase", r"postgres", r"mongo"],
    "map": [r"map", r"atlas", r"tethys", r"viewport", r"fragments"],
}

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
    .summary {{ display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:8px; margin-bottom:16px; }}
    .card {{ background:#141210; border:1px solid #272320; border-radius:8px; padding:10px; }}
    .match {{ border-left:3px solid #f59e0b; padding-left:10px; margin:8px 0; }}
    .path {{ color:#93c5fd; }}
    .line {{ color:#fef3c7; }}
    .tag {{ display:inline-block; padding:2px 6px; border-radius:999px; background:#1f1b16; color:#fbbf24; font-size:11px; margin-right:6px; }}
    .code {{ white-space:pre-wrap; }}
  </style>
</head>
<body>
  <h1>{title}</h1>
  <div class="meta">Generated: {ts} · Matches: {count}</div>
  <div class="summary">{summary}</div>
  {body}
</body>
</html>
"""


def _iter_files(paths: List[str], globs: List[str]) -> Iterable[Path]:
    for root in paths:
        p = Path(root)
        if p.is_file():
            yield p
            continue
        if not p.exists():
            continue
        for file in p.rglob("*"):
            if not file.is_file():
                continue
            rel = str(file)
            if any(fnmatch.fnmatch(rel, g) or fnmatch.fnmatch(file.name, g) for g in globs):
                yield file


def _match_tags(text: str) -> List[str]:
    tags = []
    for tag, pats in TAG_PATTERNS.items():
        for pat in pats:
            if re.search(pat, text, re.IGNORECASE):
                tags.append(tag)
                break
    return tags


def _parse_json_line(line: str) -> Tuple[bool, Dict[str, Any]]:
    try:
        obj = json.loads(line)
        if isinstance(obj, dict):
            return True, obj
    except Exception:
        return False, {}
    return False, {}


def scan_files(
    paths: List[str],
    globs: List[str],
    query: str | None,
    regex: str | None,
    tags: List[str],
    max_matches: int,
) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    rx = re.compile(regex, re.IGNORECASE) if regex else None
    q = query.lower() if query else None

    for file in _iter_files(paths, globs):
        try:
            with file.open("r", encoding="utf-8", errors="ignore") as f:
                for i, line in enumerate(f, 1):
                    line_stripped = line.rstrip("\n")
                    if q and q not in line_stripped.lower():
                        if not rx:
                            continue
                    if rx and not rx.search(line_stripped):
                        continue

                    line_tags = _match_tags(line_stripped)
                    if tags and not any(t in line_tags for t in tags):
                        continue

                    is_json, obj = _parse_json_line(line_stripped)
                    results.append({
                        "path": str(file),
                        "line": i,
                        "text": line_stripped,
                        "tags": line_tags,
                        "json": obj if is_json else None,
                    })
                    if len(results) >= max_matches:
                        return results
        except Exception:
            continue

    return results


def render_html(title: str, matches: List[Dict[str, Any]]) -> str:
    tag_counts: Dict[str, int] = {}
    for m in matches:
        for t in m.get("tags", []):
            tag_counts[t] = tag_counts.get(t, 0) + 1

    summary_cards = "".join(
        f"<div class=\"card\"><strong>{html.escape(k)}</strong><div>{v}</div></div>"
        for k, v in sorted(tag_counts.items())
    )

    body = []
    for m in matches:
        tags = "".join(f"<span class=\"tag\">{html.escape(t)}</span>" for t in m.get("tags", []))
        body.append(
            f"<div class=\"match\">"
            f"<div>{tags}</div>"
            f"<div class=\"path\">{html.escape(m['path'])}</div>"
            f"<div class=\"line\">Line {m['line']}</div>"
            f"<div class=\"code\">{html.escape(m['text'])}</div>"
            f"</div>"
        )

    return HTML_TEMPLATE.format(
        title=html.escape(title),
        ts=dt.datetime.now().isoformat(timespec="seconds"),
        count=len(matches),
        summary=summary_cards or "<div class=\"card\">No tags detected</div>",
        body="\n".join(body),
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="World of Tethys developer console")
    parser.add_argument("--paths", nargs="*", default=DEFAULT_PATHS)
    parser.add_argument("--glob", dest="globs", nargs="*", default=DEFAULT_GLOBS)
    parser.add_argument("--q", dest="query", help="substring query")
    parser.add_argument("--regex", dest="regex", help="regex query")
    parser.add_argument("--tag", dest="tags", nargs="*", default=[])
    parser.add_argument("--max", dest="max_matches", type=int, default=200)
    parser.add_argument("--out-html", dest="out_html", default=None)

    args = parser.parse_args()

    matches = scan_files(
        paths=args.paths,
        globs=args.globs,
        query=args.query,
        regex=args.regex,
        tags=args.tags,
        max_matches=args.max_matches,
    )

    for m in matches:
        print(f"{m['path']}:{m['line']}: {m['text']}")

    if args.out_html:
        html_out = render_html("Tethys Dev Console", matches)
        Path(args.out_html).write_text(html_out, encoding="utf-8")
        print(f"\n[devtools] wrote {args.out_html}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
