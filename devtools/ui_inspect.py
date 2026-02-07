#!/usr/bin/env python3
"""UI inspector: scans components for props, hooks, state density.
Outputs terminal + optional HTML.
"""

from __future__ import annotations

import argparse
import datetime as dt
import fnmatch
import html
import re
from pathlib import Path
from typing import Dict, List, Tuple

DEFAULT_PATHS = ["src/components", "src/app"]
DEFAULT_GLOBS = ["**/*.jsx", "**/*.tsx", "**/*.js", "**/*.ts"]

HOOKS = [
    "useState",
    "useEffect",
    "useMemo",
    "useCallback",
    "useReducer",
    "useRef",
    "useContext",
    "useLayoutEffect",
]

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
    table {{ width:100%; border-collapse: collapse; }}
    th, td {{ padding:8px; border-bottom:1px solid #272320; text-align:left; }}
    th {{ color:#fbbf24; }}
  </style>
</head>
<body>
  <h1>{title}</h1>
  <div class="meta">Generated: {ts} · Files: {count}</div>
  <table>
    <thead>
      <tr>
        <th>File</th>
        <th>Props</th>
        <th>Hooks</th>
        <th>State</th>
      </tr>
    </thead>
    <tbody>
      {rows}
    </tbody>
  </table>
</body>
</html>
"""


def _iter_files(paths: List[str], globs: List[str]) -> List[Path]:
    files: List[Path] = []
    for root in paths:
        p = Path(root)
        if p.is_file():
            files.append(p)
            continue
        if not p.exists():
            continue
        for file in p.rglob("*"):
            if not file.is_file():
                continue
            rel = str(file)
            if any(fnmatch.fnmatch(rel, g) or fnmatch.fnmatch(file.name, g) for g in globs):
                files.append(file)
    return files


def _count_hooks(text: str) -> Dict[str, int]:
    counts = {}
    for hook in HOOKS:
        counts[hook] = len(re.findall(rf"\b{hook}\b", text))
    return counts


def _count_state(text: str) -> int:
    return len(re.findall(r"\buseState\s*\(", text)) + len(re.findall(r"\buseReducer\s*\(", text))


def _props_count(text: str) -> int:
    # Heuristic: count destructured props in function signature.
    m = re.search(r"function\s+\w+\s*\(\s*\{([^}]*)\}\s*\)", text)
    if not m:
        return 0
    inner = m.group(1)
    props = [p.strip() for p in inner.split(",") if p.strip()]
    return len(props)


def inspect(paths: List[str], globs: List[str]) -> List[Dict[str, object]]:
    items = []
    for file in _iter_files(paths, globs):
        text = file.read_text(errors="ignore")
        hooks = _count_hooks(text)
        props = _props_count(text)
        state = _count_state(text)
        items.append({
            "file": str(file),
            "props": props,
            "hooks": hooks,
            "state": state,
        })
    return items


def render_html(items: List[Dict[str, object]]) -> str:
    rows = []
    for item in items:
        hooks_used = {k: v for k, v in item["hooks"].items() if v}
        hook_str = ", ".join(f"{k}:{v}" for k, v in hooks_used.items()) or "-"
        rows.append(
            f"<tr><td>{html.escape(item['file'])}</td>"
            f"<td>{item['props']}</td><td>{html.escape(hook_str)}</td><td>{item['state']}</td></tr>"
        )
    return HTML_TEMPLATE.format(
        title="Tethys UI Inspector",
        ts=dt.datetime.now().isoformat(timespec="seconds"),
        count=len(items),
        rows="\n".join(rows),
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="UI inspector")
    parser.add_argument("--paths", nargs="*", default=DEFAULT_PATHS)
    parser.add_argument("--glob", dest="globs", nargs="*", default=DEFAULT_GLOBS)
    parser.add_argument("--out-html", dest="out_html", default=None)
    parser.add_argument("--min-props", type=int, default=0)
    parser.add_argument("--min-state", type=int, default=0)

    args = parser.parse_args()
    items = inspect(args.paths, args.globs)

    items = [i for i in items if i["props"] >= args.min_props and i["state"] >= args.min_state]
    items.sort(key=lambda x: (x["state"], x["props"]), reverse=True)

    for item in items:
        hooks_used = {k: v for k, v in item["hooks"].items() if v}
        hook_str = ", ".join(f"{k}:{v}" for k, v in hooks_used.items()) or "-"
        print(f"{item['file']} | props={item['props']} | state={item['state']} | hooks={hook_str}")

    if args.out_html:
        html_out = render_html(items)
        Path(args.out_html).write_text(html_out, encoding="utf-8")
        print(f"\n[devtools] wrote {args.out_html}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
