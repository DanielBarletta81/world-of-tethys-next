import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const runtime = 'nodejs';

const USGS_ENDPOINT = 'https://waterservices.usgs.gov/nwis/iv/';
const DEFAULT_USGS_SITE = process.env.DANIAN_USGS_SITE || '09380000';
const DEFAULT_USGS_PARAMS = process.env.DANIAN_USGS_PARAMS || '00060,00010,63680,00095';
const DEFAULT_MODE = process.env.DANIAN_MODE || 'auto'; // auto | usgs | cache | sim
const SIM_PATH = fileURLToPath(new URL('../../../../../data/danian_sim.json', import.meta.url));
const CACHE_PATH = (() => {
  const override = process.env.DANIAN_CACHE_PATH;
  if (!override) return '/tmp/danian_real.json';
  return path.isAbsolute(override) ? override : path.join('/tmp', override);
})();
const FLOW_SCALE = Number(process.env.DANIAN_FLOW_SCALE || 8);

const DELTA_LAT_A = Number(process.env.DANIAN_DELTA_LAT_A || -0.03);
const DELTA_LON_A = Number(process.env.DANIAN_DELTA_LON_A || -51.05);
const DELTA_LAT_B = Number(process.env.DANIAN_DELTA_LAT_B || 10.05);
const DELTA_LON_B = Number(process.env.DANIAN_DELTA_LON_B || 105.75);
const DELTA_BLEND = Number(process.env.DANIAN_DELTA_BLEND || 0.5);
const DELTA_LABEL_A = process.env.DANIAN_DELTA_LABEL_A || 'Amazon';
const DELTA_LABEL_B = process.env.DANIAN_DELTA_LABEL_B || 'Thailand';

type UsgsReading = {
  value: number;
  unit?: string;
  time?: string;
};

type UsgsSnapshot = {
  siteName: string | null;
  siteCode: string | null;
  readings: Record<string, UsgsReading>;
};

type DeltaSignal = {
  tempC: number;
  humidity: number;
  precipMm: number;
  pressure: number;
  windKph: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toNumber(value: any) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchUsgs(site: string, params: string) {
  const url = `${USGS_ENDPOINT}?format=json&sites=${encodeURIComponent(site)}&parameterCd=${encodeURIComponent(params)}&siteStatus=all`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`USGS upstream error ${res.status}`);
  }
  const json = await res.json();
  const series = json?.value?.timeSeries ?? [];
  const readings: Record<string, UsgsReading> = {};

  for (const item of series) {
    const code = item?.variable?.variableCode?.[0]?.value;
    if (!code) continue;
    const values = item?.values?.[0]?.value ?? [];
    const latest = values[values.length - 1];
    if (!latest) continue;
    readings[code] = {
      value: Number(latest.value),
      unit: item?.variable?.unit?.unitCode,
      time: latest.dateTime
    };
  }

  return {
    siteName: series[0]?.sourceInfo?.siteName ?? null,
    siteCode: series[0]?.sourceInfo?.siteCode?.[0]?.value ?? site,
    readings
  } as UsgsSnapshot;
}

async function fetchOpenMeteo(lat: number, lon: number): Promise<DeltaSignal | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,pressure_msl,wind_speed_10m&timezone=UTC`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const json = await res.json();
  const current = json?.current;
  if (!current) return null;

  return {
    tempC: Number(current.temperature_2m ?? 0),
    humidity: Number(current.relative_humidity_2m ?? 0),
    precipMm: Number(current.precipitation ?? 0),
    pressure: Number(current.pressure_msl ?? 1013),
    windKph: Number(current.wind_speed_10m ?? 0)
  };
}

async function readJsonFile(absPath: string) {
  const raw = await fs.readFile(absPath, 'utf-8');
  return JSON.parse(raw);
}

function pickSimPoint(series: any[]) {
  if (!Array.isArray(series) || series.length === 0) return null;
  return series[series.length - 1];
}

function buildTelemetry({
  usgs,
  delta,
  mode
}: {
  usgs: UsgsSnapshot | null;
  delta: { blend: DeltaSignal | null; a: DeltaSignal | null; b: DeltaSignal | null };
  mode: string;
}) {
  const flowCfs = toNumber(usgs?.readings?.['00060']?.value ?? null);
  const tempC = toNumber(usgs?.readings?.['00010']?.value ?? null);
  const turbidity = toNumber(usgs?.readings?.['63680']?.value ?? null);
  const conductance = toNumber(usgs?.readings?.['00095']?.value ?? null);

  const flowM3s = flowCfs != null ? flowCfs * 0.0283168 : null;
  const scaledFlow = flowM3s != null ? Math.round(flowM3s * FLOW_SCALE) : null;

  const deltaSignal = delta.blend;
  const humidity = deltaSignal?.humidity ?? 65;
  const precip = deltaSignal?.precipMm ?? 0.4;
  const deltaIndex = clamp((humidity / 100) * 0.6 + (precip / 10) * 0.4, 0, 1);

  const siltBreath = turbidity != null
    ? clamp((turbidity / 50) + deltaIndex * 6, 2, 14)
    : clamp(4 + deltaIndex * 6, 2, 14);

  const saltWake = conductance != null
    ? clamp((conductance / 1000) * 1.6, 0.5, 40)
    : clamp(28 - deltaIndex * 6, 18, 38);

  const burnRate = tempC != null
    ? clamp(Math.abs(tempC - 24) * 0.6, 0, 18)
    : clamp((deltaSignal?.tempC ?? 26) * 0.4, 0, 18);

  const heatGrade = tempC != null ? tempC : deltaSignal?.tempC ?? 26;
  const veilPressure = deltaSignal?.pressure ?? 1013;
  const brimVein = clamp((humidity / 12) + deltaIndex * 4, 1, 12);

  const hazard = scaledFlow != null
    ? scaledFlow > 14000
      ? 5
      : scaledFlow > 10000
        ? 4
        : scaledFlow > 8000
          ? 3
          : scaledFlow > 5000
            ? 2
            : 1
    : Math.round(deltaIndex * 4 + 1);

  const condition = hazard >= 5 ? 'storm' : hazard >= 3 ? 'rain' : 'clear';

  const integrityParts = [flowCfs, tempC, turbidity, conductance, deltaSignal?.humidity];
  const filled = integrityParts.filter((v) => v != null).length;
  const integrity = clamp(0.4 + filled / integrityParts.length * 0.6, 0, 1);

  const telemetry = {
    weather: {
      dt: Math.floor(Date.now() / 1000),
      visibility: Math.round((condition === 'storm' ? 0.4 : 0.8) * 10000),
      weather: [{ main: condition, description: condition }],
      wind: { speed: (deltaSignal?.windKph ?? 10) / 3.6 },
      main: { temp: heatGrade, pressure: veilPressure, humidity }
    },
    tethys: {
      metrics: {
        heatGrade: Math.round(heatGrade * 10) / 10,
        burnRate: Math.round(burnRate * 10) / 10,
        spineFlow: scaledFlow ?? 7200,
        saltWake: Math.round(saltWake * 10) / 10,
        siltBreath: Math.round(siltBreath * 10) / 10,
        veilPressure: Math.round(veilPressure * 10) / 10,
        brimVein: Math.round(brimVein * 10) / 10
      },
      raw: {
        flow_cfs: flowCfs,
        flow_m3s: flowM3s,
        turbidity_ntu: turbidity,
        conductance_uScm: conductance,
        delta_index: Math.round(deltaIndex * 100) / 100
      }
    },
    integrity,
    aiBrief: `Danian flow ${flowM3s ? flowM3s.toFixed(1) : 'unknown'} m3/s. Delta pulse ${Math.round(
      deltaIndex * 100
    )}%.`
  };

  return {
    ok: true,
    mode,
    source: {
      usgs: usgs ? { site: usgs.siteCode, name: usgs.siteName } : null,
      delta: {
        blend: deltaSignal,
        a: delta.a,
        b: delta.b,
        weight: DELTA_BLEND,
        labels: { a: DELTA_LABEL_A, b: DELTA_LABEL_B }
      }
    },
    telemetry
  };
}

async function loadSimTelemetry(mode: string) {
  try {
    const data = await readJsonFile(SIM_PATH);
    const point = pickSimPoint(data?.series ?? []);
    if (!point) return null;

    const telemetry = {
      weather: {
        dt: Math.floor(Date.now() / 1000),
        visibility: Math.round((point.hazard_level >= 4 ? 0.4 : 0.8) * 10000),
        weather: [{ main: point.hazard_level >= 4 ? 'storm' : point.hazard_level >= 3 ? 'rain' : 'clear' }],
        wind: { speed: (point.hazard_level ?? 1) * 2 },
        main: { temp: point.temp_c, pressure: 1013, humidity: 65 }
      },
      tethys: {
        metrics: {
          heatGrade: point.temp_c,
          burnRate: Math.abs(point.temp_c - 24) * 0.6,
          spineFlow: Math.round(point.flow_m3s * FLOW_SCALE),
          saltWake: 28,
          siltBreath: Math.round((point.turbidity_ntu / 50) * 10) / 10,
          veilPressure: 1013,
          brimVein: 5
        },
        raw: point
      },
      integrity: 0.6,
      aiBrief: `Simulated Danian flow ${point.flow_m3s} m3/s.`
    };

    return { ok: true, mode, source: { sim: DEFAULT_SIM_PATH }, telemetry };
  } catch {
    return null;
  }
}

async function loadCacheTelemetry(mode: string) {
  try {
    const data = await readJsonFile(CACHE_PATH);
    if (!data?.telemetry) return null;
    return { ok: true, mode, source: { cache: DEFAULT_CACHE_PATH }, telemetry: data.telemetry };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || DEFAULT_MODE;

  if (mode === 'sim') {
    const sim = await loadSimTelemetry('sim');
    if (sim) return NextResponse.json(sim);
  }

  if (mode === 'cache') {
    const cache = await loadCacheTelemetry('cache');
    if (cache) return NextResponse.json(cache);
  }

  if (mode === 'usgs' || mode === 'auto') {
    try {
      const usgs = await fetchUsgs(DEFAULT_USGS_SITE, DEFAULT_USGS_PARAMS);
      const [deltaA, deltaB] = await Promise.all([
        fetchOpenMeteo(DELTA_LAT_A, DELTA_LON_A),
        fetchOpenMeteo(DELTA_LAT_B, DELTA_LON_B)
      ]);
      const blend = deltaA && deltaB
        ? {
            tempC: deltaA.tempC * (1 - DELTA_BLEND) + deltaB.tempC * DELTA_BLEND,
            humidity: deltaA.humidity * (1 - DELTA_BLEND) + deltaB.humidity * DELTA_BLEND,
            precipMm: deltaA.precipMm * (1 - DELTA_BLEND) + deltaB.precipMm * DELTA_BLEND,
            pressure: deltaA.pressure * (1 - DELTA_BLEND) + deltaB.pressure * DELTA_BLEND,
            windKph: deltaA.windKph * (1 - DELTA_BLEND) + deltaB.windKph * DELTA_BLEND
          }
        : deltaA || deltaB;

      return NextResponse.json(buildTelemetry({ usgs, delta: { blend, a: deltaA, b: deltaB }, mode }));
    } catch (err) {
      console.warn('Danian telemetry fallback:', err);
    }
  }

  const simFallback = await loadSimTelemetry('fallback');
  if (simFallback) return NextResponse.json(simFallback);

  return NextResponse.json({ ok: false, error: 'Telemetry unavailable' }, { status: 502 });
}
