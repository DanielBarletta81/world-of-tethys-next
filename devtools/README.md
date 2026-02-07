# Tethys Devtools

Lightweight, dependency-free Python tools for debugging and delivery.

## 1) Console (keyword-searchable)
Search across API, lib, and component files. Outputs terminal and optional HTML.

```
python devtools/console.py --q "error" --out-html devtools/output/console.html
python devtools/console.py --regex "NextResponse" --tag api
```

## 2) UI Inspector
Find components with heavy props/state usage.

```
python devtools/ui_inspect.py --min-props 6 --min-state 2 --out-html devtools/output/ui.html
```

## 3) Release Guard (progressive delivery runbook)
Create a canary/soak checklist from JSON.

```
python devtools/release_guard.py --plan devtools/config/release_plan.json
```

## 4) Scheduler Sim (hardware affinity bin-packing)
Simulate placement using CPU/GPU/memory and accelerator affinity.

```
python devtools/scheduler_sim.py --nodes devtools/config/nodes.json --jobs devtools/config/jobs.json
```

## Notes
- Outputs are static; no external deps.
- HTML output is stored under `devtools/output/`.
- All tools are safe to run locally.
