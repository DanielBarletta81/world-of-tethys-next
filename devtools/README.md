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

## 5) Schema Audit (WPGraphQL)
Validate fields used by live queries (dev-only, no runtime cost).

```
python devtools/schema_audit.py --out-html devtools/output/schema_audit.html
```

## 6) Map Audit (coverage + assets)
Compare atlas map_index to MAP_FRAGMENTS and verify icon/asset paths.

```
python devtools/map_audit.py --out-html devtools/output/map_audit.html
```

## 7) Telemetry Simulator (Danian River)
Generate deterministic telemetry signals for evals and demos.

```
python devtools/telemetry_sim.py --days 60 --out-json data/danian_sim.json --out-csv data/danian_sim.csv
python devtools/telemetry_report.py --in-json data/danian_sim.json --out-html devtools/output/telemetry_report.html
```

## 8) Telemetry Sync (live analog cache)
Fetch USGS + delta analog data and cache for offline use or API fallback.

```
python devtools/telemetry_sync.py --out-json data/danian_real.json
```

## Notes
- Outputs are static; no external deps.
- HTML output is stored under `devtools/output/`.
- All tools are safe to run locally.
