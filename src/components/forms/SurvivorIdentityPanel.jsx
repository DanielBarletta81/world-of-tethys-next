
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Flame, MapPin, Link2, Package, Wand2 } from "lucide-react";
import useIdleTime from "@/app/hooks/useIdleTime";
import useDeviceTier from "@/app/hooks/useDeviceTier";
import { useTethys } from "@/context/TethysContext";

const cx = (...p) => p.filter(Boolean).join(" ");

const DEVICE_TUNING = {
  mobile: {
    idleDivisor: 40,
    stillnessWeight: 0.45,
    maxOpacity: 0.55,
    rampSeconds: 120,
  },
  tablet: {
    idleDivisor: 30,
    stillnessWeight: 0.55,
    maxOpacity: 0.65,
    rampSeconds: 90,
  },
  desktop: {
    idleDivisor: 20,
    stillnessWeight: 0.65,
    maxOpacity: 0.8,
    rampSeconds: 60,
  },
};

function fmtAgo(ts) {
  if (!ts) return "unknown";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  if (Number.isNaN(d.getTime())) return "unknown";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

function pickPrimaryStaff(equippedStaff, inventory) {
  if (equippedStaff) return equippedStaff;
  const inv = Array.isArray(inventory) ? inventory : [];
  return inv.find((i) => i?.type === "staff" || i?.slot === "staff") || null;
}

function pickEssentials(inventory, max = 6) {
  const inv = Array.isArray(inventory) ? inventory : [];
  // prefer equipped/essentials; otherwise first items
  const essentials = inv.filter((i) => i?.category === "essential" || i?.type === "essential" || i?.isEssential);
  const src = essentials.length ? essentials : inv;
  return src.slice(0, max);
}

export default function SurvivorIdentityPanel({ className = "" }) {
  const {
    user,
    playerProfile,
    inventory,
    equippedStaff,
    creatures,
    events,
  } = useTethys();

  const identity = playerProfile?.identity || {};
  const survivorship = playerProfile?.survivorship || {};
  const perception = playerProfile?.perception || {};
  const path = playerProfile?.path || {};

  const callsign = identity?.handle || user?.displayName || "Unmarked Survivor";
  const title = identity?.title || "";
  const pathName = path?.primary || playerProfile?.path || "unpathed";
  const { idleMinutes } = useIdleTime({ throttleMs: 1200 });
  const device = useDeviceTier();

  const primaryStaff = useMemo(
    () => pickPrimaryStaff(equippedStaff, inventory),
    [equippedStaff, inventory]
  );

  const staffName =
    primaryStaff?.name ||
    playerProfile?.staff?.name ||
    playerProfile?.staff?.title ||
    "Unforged";

  const staffDesc =
    primaryStaff?.desc ||
    primaryStaff?.description ||
    playerProfile?.staff?.desc ||
    "";

  const staffPower =
    primaryStaff?.power ??
    playerProfile?.staff?.power ??
    null;

  const essentials = useMemo(() => pickEssentials(inventory, 6), [inventory]);

  const bondFocus =
    survivorship?.bond?.focusType ||
    survivorship?.bond?.type ||
    (creatures?.[0]?.archetype ? creatures[0].archetype : "none");

  const bondStrength =
    survivorship?.bond?.strength ??
    creatures?.[0]?.bondLevel ??
    0;

  const lastFound = survivorship?.lastFound || null;

  const scars = useMemo(() => {
    const direct = Array.isArray(survivorship?.scars) ? survivorship.scars : [];
    if (direct.length) return direct.slice(0, 6);

    // optional: derive from events if you’re not storing scars directly
    const ev = Array.isArray(events) ? events : [];
    const scarEvents = ev
      .filter((e) => e?.type === "SCAR" || e?.type === "SURVIVAL_SCAR")
      .slice(0, 6)
      .map((e) => ({ id: e.id || e.eventId || `${e.type}-${e.at}`, text: e?.text || e?.note || "Marked.", at: e?.at }));
    return scarEvents;
  }, [survivorship?.scars, events]);

  const stillness = typeof perception?.stillness === "number" ? perception.stillness : null;
  const isMystic = path?.primary === "mystic";
  const tuning = DEVICE_TUNING[device] || DEVICE_TUNING.desktop;
  const idleFactor = Math.min(1, (idleMinutes || 0) / tuning.idleDivisor);
  const stillnessFactor = Math.min(1, (stillness || 0) * tuning.stillnessWeight);
  const rawCreep = isMystic ? stillnessFactor + idleFactor * 0.5 : idleFactor * 0.7;
  const fungalTarget = Math.min(tuning.maxOpacity, rawCreep);
  const [fungalOpacity, setFungalOpacity] = useState(0);

  useEffect(() => {
    const delta = fungalTarget - fungalOpacity;
    if (Math.abs(delta) < 0.01) return;
    const id = setTimeout(() => {
      setFungalOpacity((prev) => {
        const nextDelta = fungalTarget - prev;
        const step = nextDelta * 0.02;
        if (Math.abs(nextDelta) < 0.01) return fungalTarget;
        return prev + step;
      });
    }, 100);
    return () => clearTimeout(id);
  }, [fungalTarget, fungalOpacity]);


  return (
    <section
      className={cx(
        "bg-[#0f0b09] border border-stone-800 rounded-2xl p-5 shadow-inner",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-mono">
            Survivor Identity
          </div>

          <div
      className="status-bar relative"
      style={{ "--fungal-opacity": fungalOpacity }}
    >
            <div className="text-xl text-white leading-none truncate">{callsign}</div>
            {title ? (
              <div className="mt-1 text-[11px] text-stone-400 truncate">{title}</div>
            ) : null}
            <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-stone-500 font-mono truncate">
              path: {String(pathName).replaceAll("_", " ")}
              {stillness !== null ? ` • stillness: ${Math.round(stillness * 100)}%` : ""}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="px-2 py-1 rounded border border-stone-800 bg-black/30 text-[10px] font-mono uppercase tracking-widest text-stone-400">
            {playerProfile?.progression?.level ? `lvl ${playerProfile.progression.level}` : "alive"}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {/* Scars */}
        <Panel title="Scars">
          {scars.length ? (
            <ul className="space-y-2">
              {scars.map((s, idx) => (
                <li
                  key={s.id || idx}
                  className="rounded-lg border border-stone-800/80 bg-black/20 px-3 py-2"
                >
                  <div className="text-xs text-stone-200 leading-snug">{s.text || "Marked."}</div>
                  {s.at ? (
                    <div className="mt-1 text-[10px] text-stone-600 font-mono uppercase tracking-widest">
                      {fmtAgo(s.at)}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <Empty>no scars recorded</Empty>
          )}
        </Panel>

        {/* Loadout */}
        <Panel
          title="Loadout"
          right={
            <span className="inline-flex items-center gap-2 text-stone-500">
              <Package className="w-4 h-4" />
              <span className="text-[10px] font-mono">{Array.isArray(inventory) ? inventory.length : 0}</span>
            </span>
          }
        >
          <div className="rounded-lg border border-stone-800 bg-[#0c0a09]/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-mono">
                  Primary Staff
                </div>
                <div className="mt-1 text-sm text-stone-200 truncate">{staffName}</div>
                {staffDesc ? <div className="mt-1 text-[11px] text-stone-500 line-clamp-2">{staffDesc}</div> : null}
              </div>
              <div className="shrink-0 text-right">
                <div className="inline-flex items-center gap-2 text-stone-500">
                  <Wand2 className="w-4 h-4" />
                  <span className="text-xs text-stone-200">
                    {staffPower !== null && staffPower !== undefined ? staffPower : "—"}
                  </span>
                </div>
                <div className="text-[10px] text-stone-600 font-mono uppercase tracking-widest mt-1">power</div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-mono">
              Essentials
            </div>

            {essentials.length ? (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {essentials.map((it, idx) => (
                  <div
                    key={it.id || it.itemId || it.name || idx}
                    className="rounded-lg border border-stone-800/80 bg-black/20 px-3 py-2"
                    title={it.desc || it.description || ""}
                  >
                    <div className="text-xs text-stone-200 truncate">
                      {it.name || it.itemId || "item"}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-stone-600 font-mono truncate">
                      {(it.rarity || it.type || it.category || "essential").toString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2">
                <Empty>no essentials logged</Empty>
              </div>
            )}
          </div>
        </Panel>

        {/* Bond + Last Found */}
        <div className="space-y-4">
          <Panel
            title="Bond"
            right={
              <span className="inline-flex items-center gap-2 text-stone-500">
                <Link2 className="w-4 h-4" />
              </span>
            }
          >
            <div className="rounded-lg border border-stone-800 bg-[#0c0a09]/60 p-3">
              <div className="text-xs text-stone-200">
                <span className="text-stone-500">focus:</span>{" "}
                {String(bondFocus).replaceAll("_", " ")}
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-stone-600">
                  <span>strength</span>
                  <span className="text-stone-300">{bondStrength}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-black/40 border border-stone-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400/40"
                    style={{ width: `${Math.min(100, Math.max(0, bondStrength * 10))}%` }}
                  />
                </div>
              </div>

              {survivorship?.bond?.notes ? (
                <div className="mt-2 text-[11px] text-stone-500">
                  {survivorship.bond.notes}
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel
            title="Last Found"
            right={
              <span className="inline-flex items-center gap-2 text-stone-500">
                <MapPin className="w-4 h-4" />
                <Flame className="w-4 h-4" />
              </span>
            }
          >
            {lastFound ? (
              <div className="rounded-lg border border-stone-800 bg-[#0c0a09]/60 p-3">
                <div className="text-xs text-stone-200">
                  {lastFound.label || lastFound.kind || "Recovered"}
                </div>
                <div className="mt-1 text-[11px] text-stone-500">
                  {lastFound.regionId || lastFound.where || "unknown region"} • {fmtAgo(lastFound.at)}
                </div>
                {lastFound.refId ? (
                  <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-stone-600">
                    {lastFound.refId}
                  </div>
                ) : null}
              </div>
            ) : (
              <Empty>nothing logged</Empty>
            )}
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, right, children }) {
  return (
    <div className="bg-black/20 border border-stone-800 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-mono">
          {title}
        </div>
        {right || null}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Empty({ children }) {
  return <div className="text-xs text-stone-600 italic">{children}</div>;
};
// World of Tethys || D.C. Barletta
