#!/usr/bin/env python3
"""Map coverage audit for regions and assets.

Checks atlas map_index vs MAP_FRAGMENTS and verifies icon/asset paths exist.
No external dependencies.
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import re
from pathlib import Path
from typing import Any, Dict, List

DEFAULT_ATLAS = "docs/tethys-atlas.yaml"
DEFAULT_MAP = "src/components/features/map/TethysNexus.jsx"
DEFAULT_ICON_DIR = "public/img/icons"
DEFAULT_OUT_HTML = "devtools/output/map_audit.html"

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
    .path {{ color:#93c5fd; }}
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


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def strip_parens(value: str) -> str:
    return re.sub(r"\s*\([^)]*\)", "", value).strip()


def parse_map_index(path: Path) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    if not path.exists():
        return items
    lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
    in_section = False
    current: Dict[str, Any] | None = None
    for line in lines:
        if not in_section:
            if line.strip() == "map_index:":
                in_section = True
            continue
        if in_section and line.strip() and not line.startswith(" ") and not line.startswith("-"):
            break
        if not line.strip():
            continue
        if re.match(r"^\s*-\s+", line):
            if current:
                items.append(current)
            current = {}
            content = line.split("-", 1)[1].strip()
            if ":" in content:
                key, val = content.split(":", 1)
                current[key.strip()] = val.strip().strip('"').strip("'")
        else:
            if current is None:
                continue
            match = re.match(r"^\s+([^:]+):\s*(.*)$", line)
            if match:
                key = match.group(1).strip()
                val = match.group(2).strip().strip('"').strip("'")
                current[key] = val
    if current:
        items.append(current)
    return items


def extract_map_fragments(text: str) -> Dict[str, Any]:
    fragments_block = re.search(r"export const MAP_FRAGMENTS = \[(.*?)\];", text, re.S)
    regions: List[str] = []
    icons: List[str] = []
    if fragments_block:
        block = fragments_block.group(1)
        regions = re.findall(r"region:\s*'([^']+)'", block)
        icons = re.findall(r"icon:\s*'([^']+)'", block)
    fallback_block = re.search(r"const MAP_FALLBACK = \{(.*?)\};", text, re.S)
    fallback_paths: List[str] = []
    if fallback_block:
        fallback_paths = re.findall(r":\s*'([^']+)'", fallback_block.group(1))
    return {"regions": regions, "icons": icons, "fallback": fallback_paths}


def render_table(headers: List[str], rows: List[List[str]]) -> str:
    if not rows:
        return "<div class=\"small\">None detected.</div>"
    head = "".join(f"<th>{html.escape(h)}</th>" for h in headers)
    body = "".join(
        "<tr>" + "".join(f"<td>{html.escape(c)}</td>" for c in row) + "</tr>" for row in rows
    )
    return f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>"


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit map coverage and assets")
    parser.add_argument("--atlas", default=DEFAULT_ATLAS)
    parser.add_argument("--map", dest="map_file", default=DEFAULT_MAP)
    parser.add_argument("--icons-dir", default=DEFAULT_ICON_DIR)
    parser.add_argument("--out-html", dest="out_html", default=DEFAULT_OUT_HTML)
    args = parser.parse_args()

    atlas_path = Path(args.atlas)
    map_path = Path(args.map_file)
    icon_root = Path(args.icons_dir)

    if not atlas_path.exists():
        print(f"Missing atlas file: {atlas_path}")
        return 1
    if not map_path.exists():
        print(f"Missing map file: {map_path}")
        return 1

    atlas_items = parse_map_index(atlas_path)
    map_text = map_path.read_text(encoding="utf-8", errors="ignore")
    fragments = extract_map_fragments(map_text)

    region_set = set(fragments["regions"])
    atlas_slugs: Dict[str, Dict[str, Any]] = {}
    missing_regions: List[List[str]] = []

    for item in atlas_items:
        node = item.get("node") or ""
        if not node:
            continue
        slug = slugify(node)
        alt_slug = slugify(strip_parens(node))
        atlas_slugs[slug] = item
        atlas_slugs[alt_slug] = item
        if slug not in region_set and alt_slug not in region_set:
            missing_regions.append([node, slug, alt_slug])

    extra_fragments = [r for r in sorted(region_set) if r not in atlas_slugs]

    missing_icons: List[List[str]] = []
    for item in atlas_items:
        icon = item.get("icon") or ""
        node = item.get("node") or ""
        if not icon:
            continue
        if icon.startswith("/"):
            icon_path = Path("public") / icon.lstrip("/")
        else:
            icon_path = icon_root / icon
        if not icon_path.exists():
            missing_icons.append([node, icon])

    missing_fragment_icons: List[List[str]] = []
    for icon in sorted(set(fragments["icons"])):
        if icon.startswith("/"):
            icon_path = Path("public") / icon.lstrip("/")
        else:
            icon_path = icon_root / icon
        if not icon_path.exists():
            missing_fragment_icons.append([icon])

    missing_fallback: List[List[str]] = []
    for asset in fragments["fallback"]:
        asset_path = Path("public") / asset.lstrip("/")
        if not asset_path.exists():
            missing_fallback.append([asset])

    body_blocks = []
    body_blocks.append(
        "<div class=\"card\">"
        f"<h2>Atlas nodes missing in MAP_FRAGMENTS ({len(missing_regions)})</h2>"
        + render_table(["Node", "Slug", "Alt Slug"], missing_regions)
        + "</div>"
    )
    body_blocks.append(
        "<div class=\"card\">"
        f"<h2>MAP_FRAGMENTS not found in atlas ({len(extra_fragments)})</h2>"
        + render_table(["Region"], [[r] for r in extra_fragments])
        + "</div>"
    )
    body_blocks.append(
        "<div class=\"card\">"
        f"<h2>Atlas icons missing on disk ({len(missing_icons)})</h2>"
        + render_table(["Node", "Icon"], missing_icons)
        + "</div>"
    )
    body_blocks.append(
        "<div class=\"card\">"
        f"<h2>MAP_FRAGMENTS icons missing on disk ({len(missing_fragment_icons)})</h2>"
        + render_table(["Icon"], missing_fragment_icons)
        + "</div>"
    )
    body_blocks.append(
        "<div class=\"card\">"
        f"<h2>MAP_FALLBACK assets missing on disk ({len(missing_fallback)})</h2>"
        + render_table(["Asset"], missing_fallback)
        + "</div>"
    )

    out_html = Path(args.out_html)
    out_html.parent.mkdir(parents=True, exist_ok=True)
    out_html.write_text(
        HTML_TEMPLATE.format(
            title="Tethys Map Audit",
            ts=dt.datetime.now().isoformat(timespec="seconds"),
            body="\n".join(body_blocks),
        ),
        encoding="utf-8",
    )

    print(f"Atlas nodes missing in MAP_FRAGMENTS: {len(missing_regions)}")
    print(f"MAP_FRAGMENTS not found in atlas: {len(extra_fragments)}")
    print(f"Atlas icons missing on disk: {len(missing_icons)}")
    print(f"MAP_FRAGMENTS icons missing on disk: {len(missing_fragment_icons)}")
    print(f"MAP_FALLBACK assets missing on disk: {len(missing_fallback)}")
    print(f"HTML report written to {out_html}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
