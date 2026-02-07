#!/usr/bin/env python3
"""Resource-constrained scheduler simulator with hardware affinity.
Reads jobs/nodes JSON and performs greedy bin-packing with affinity rules.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, List

DEFAULT_NODES = "devtools/config/nodes.json"
DEFAULT_JOBS = "devtools/config/jobs.json"


def load_json(path: str) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def can_run(job: dict, node: dict) -> bool:
    if job.get("accelerator") and job["accelerator"] != node.get("accelerator"):
        return False
    if job.get("arch") and job["arch"] != node.get("arch"):
        return False
    return True


def fits(job: dict, node: dict) -> bool:
    return (
        job["cpu"] <= node["cpu"]
        and job["mem_gb"] <= node["mem_gb"]
        and job["gpu"] <= node.get("gpu", 0)
    )


def schedule(jobs: List[dict], nodes: List[dict]) -> Dict[str, List[str]]:
    placements: Dict[str, List[str]] = {n["id"]: [] for n in nodes}
    for job in sorted(jobs, key=lambda j: (j.get("gpu", 0), j["mem_gb"], j["cpu"]), reverse=True):
        placed = False
        for node in nodes:
            if not can_run(job, node):
                continue
            if fits(job, node):
                placements[node["id"]].append(job["id"])
                node["cpu"] -= job["cpu"]
                node["mem_gb"] -= job["mem_gb"]
                node["gpu"] -= job.get("gpu", 0)
                placed = True
                break
        if not placed:
            placements.setdefault("unplaced", []).append(job["id"])
    return placements


def main() -> int:
    parser = argparse.ArgumentParser(description="Scheduler simulator")
    parser.add_argument("--nodes", default=DEFAULT_NODES)
    parser.add_argument("--jobs", default=DEFAULT_JOBS)
    args = parser.parse_args()

    nodes = load_json(args.nodes)["nodes"]
    jobs = load_json(args.jobs)["jobs"]

    placements = schedule(jobs, nodes)
    print(json.dumps(placements, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
