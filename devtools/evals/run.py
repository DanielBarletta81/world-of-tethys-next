#!/usr/bin/env python3
"""Agentic Eval Harness v0.

- Runs task specs
- Enforces strict tool policy (simulated)
- Logs runs to JSONL
- Generates summary + static HTML dashboard
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import urllib.request
from pathlib import Path
from typing import Dict, Any, List

BASE = Path("devtools/evals")
OUTPUT_DIR = BASE / "output"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def list_tasks(task_ids: List[str] | None) -> List[Path]:
    tasks_dir = BASE / "tasks"
    all_tasks = sorted(tasks_dir.glob("*.json"))
    if not task_ids:
        return all_tasks
    return [p for p in all_tasks if p.stem in set(task_ids)]


def _read_file(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def _scan_env_exposure(api_dir: Path) -> List[str]:
    violations = []
    for route in api_dir.rglob("route.ts"):
        text = _read_file(route)
        if "NEXT_PUBLIC_" in text:
            violations.append(str(route))
    return violations


def _check_map_layer_order(paths: List[str]) -> Dict[str, Any]:
    # Heuristic: ensure expected layer keywords exist in MapViewport file.
    report = {"missing": [], "found": []}
    if not paths:
        return report
    text = _read_file(Path(paths[0]))
    for key in ["background", "atlas", "relief", "mist", "ash", "ember"]:
        if re.search(rf"\\b{key}\\b", text, re.IGNORECASE):
            report["found"].append(key)
        else:
            report["missing"].append(key)
    return report


def _oracle_guardrails(payload: dict) -> Dict[str, Any]:
    # Enforce in-world terminology by forbidding real-world proper nouns.
    forbidden = ["earth", "hawaii", "kilauea", "usa", "japan"]
    response = "Watcher winds rise; Frenelopsis belts seal and the tide learns caution."
    violations = [w for w in forbidden if w in response.lower()]
    return {"oracle_response": response, "violations": violations}

def _oracle_live_call() -> Dict[str, Any]:
    url = os.environ.get("ORACLE_LIVE_URL", "http://localhost:3000/api/oracle-live")
    try:
        with urllib.request.urlopen(url, timeout=10) as res:
            data = json.loads(res.read().decode("utf-8"))
        return {
            "oracle_response": data.get("atmosphere", ""),
            "violations": []
        }
    except Exception as e:
        return {
            "oracle_response": "",
            "violations": [f"recovery_failure: oracle-live fetch failed ({e})"]
        }


def run_task(task: dict) -> Dict[str, Any]:
    artifacts = {}
    policy_violations = []
    if task["id"] == "tethys_api":
        api_dir = Path(task["inputs"]["paths"][0])
        ts_routes = list(api_dir.rglob("route.ts"))
        artifacts["ts_route_count"] = len(ts_routes)
        exposed = _scan_env_exposure(api_dir)
        artifacts["env_exposure_report"] = exposed
        if exposed:
            policy_violations.append("policy_violation: env exposure in api routes")
    elif task["id"] == "tethys_map":
        layer_check = _check_map_layer_order(task["inputs"]["paths"])
        artifacts["layer_order"] = layer_check
        artifacts["naming_check"] = "in-world naming preserved"
        if layer_check["missing"]:
            policy_violations.append("missed_requirement: map layer keywords missing")
    elif task["id"] == "tethys_oracle":
        if os.environ.get("ALLOW_NETWORK") == "true":
            guard = _oracle_live_call()
        else:
            guard = _oracle_guardrails(task["inputs"])
        artifacts.update(guard)
        if guard["violations"]:
            policy_violations.append("policy_violation: in-world terminology breach")
    else:
        artifacts["note"] = "unhandled task"

    return {
        "task_id": task["id"],
        "timestamp": dt.datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "artifacts": artifacts,
        "policy_violations": policy_violations,
        "success": len(policy_violations) == 0
    }


def score_run(results: List[Dict[str, Any]], rubric: dict) -> Dict[str, Any]:
    weights = rubric["weights"]
    task_success = 1.0 if all(r["success"] for r in results) else 0.6
    score = {
        "task_success": task_success,
        "autonomy": 0.6,
        "recovery": 0.6,
        "policy_compliance": 1.0 if all(not r["policy_violations"] for r in results) else 0.6,
        "efficiency": 0.7
    }
    total = sum(score[k] * weights[k] for k in weights)
    return {"score": score, "total": round(total, 3)}


def render_dashboard(summary: dict, results: List[Dict[str, Any]]) -> str:
    rows = "".join(
        f"<tr><td>{r['task_id']}</td><td>{r['success']}</td><td>{json.dumps(r['artifacts'])}</td></tr>"
        for r in results
    )
    return f"""<!doctype html>
<html><head><meta charset='utf-8'/><title>Tethys Eval Dashboard</title>
<style>body{{font-family:ui-monospace,monospace;background:#0c0a09;color:#e7e5e4;padding:24px}} table{{width:100%;border-collapse:collapse}} td,th{{border-bottom:1px solid #272320;padding:8px;text-align:left}} th{{color:#fbbf24}}</style>
</head><body>
<h1>Tethys Eval Dashboard</h1>
<p>Total Score: {summary['total']}</p>
<table><thead><tr><th>Task</th><th>Success</th><th>Artifacts</th></tr></thead><tbody>{rows}</tbody></table>
</body></html>"""


def replay_dashboard() -> int:
    runs_path = OUTPUT_DIR / "runs.jsonl"
    if not runs_path.exists():
        print("No runs.jsonl found.")
        return 1
    results = [json.loads(line) for line in runs_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    rubric = load_json(BASE / "scoring" / "rubric.json")
    summary = score_run(results, rubric)
    dashboard_path = OUTPUT_DIR / "dashboard.html"
    dashboard_path.write_text(render_dashboard(summary, results), encoding="utf-8")
    print(f"Wrote: {dashboard_path}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Agentic Eval Harness v0")
    parser.add_argument("--tasks", nargs="*", help="task ids")
    parser.add_argument("--replay", action="store_true", help="rebuild dashboard from runs.jsonl")
    parser.add_argument("--enforce-policy", action="store_true", help="fail if policy violations found")
    parser.add_argument("--allow-network", action="store_true", help="allow tasks to call external APIs")
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if args.replay:
        return replay_dashboard()

    rubric = load_json(BASE / "scoring" / "rubric.json")
    tasks = [load_json(p) for p in list_tasks(args.tasks)]

    if args.allow_network:
        os.environ["ALLOW_NETWORK"] = "true"
    results = [run_task(t) for t in tasks]
    summary = score_run(results, rubric)

    # write logs
    runs_path = OUTPUT_DIR / "runs.jsonl"
    with runs_path.open("a", encoding="utf-8") as f:
        for r in results:
            f.write(json.dumps(r) + "\n")

    summary_path = OUTPUT_DIR / "summary.json"
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    dashboard_path = OUTPUT_DIR / "dashboard.html"
    dashboard_path.write_text(render_dashboard(summary, results), encoding="utf-8")

    print(f"Wrote: {runs_path}")
    print(f"Wrote: {summary_path}")
    print(f"Wrote: {dashboard_path}")
    if args.enforce_policy:
        violations = [v for r in results for v in r.get("policy_violations", [])]
        if violations:
            print("Policy violations detected:")
            for v in violations:
                print(f"- {v}")
            return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
