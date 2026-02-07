#!/usr/bin/env python3
"""Progressive delivery checklist generator (canary/soak/rollback).
No external dependencies; reads JSON plan and emits a runbook.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

DEFAULT_PLAN = "devtools/config/release_plan.json"


def load_plan(path: str) -> dict:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    return data


def render(plan: dict) -> str:
    lines = []
    lines.append(f"Release: {plan.get('name', 'Unnamed')}")
    lines.append(f"Owner: {plan.get('owner', 'Unknown')}")
    lines.append("")
    for i, step in enumerate(plan.get("steps", []), 1):
        lines.append(f"[{i}] {step['name']}")
        lines.append(f"  Goal: {step.get('goal', '-')}")
        if step.get("checks"):
            for check in step["checks"]:
                lines.append(f"  - Check: {check}")
        if step.get("rollback"):
            lines.append(f"  - Rollback: {step['rollback']}")
        lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Progressive delivery runbook")
    parser.add_argument("--plan", default=DEFAULT_PLAN)
    parser.add_argument("--out", default=None)
    args = parser.parse_args()

    plan = load_plan(args.plan)
    output = render(plan)

    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
        print(f"[devtools] wrote {args.out}")
    else:
        print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
