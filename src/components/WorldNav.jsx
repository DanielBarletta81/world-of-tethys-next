"use client";

import React, { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

const TONE = {
  emerald: {
    text: "text-emerald-300",
    hoverBg: "hover:bg-emerald-900/10",
    border: "border-emerald-900/40",
    ring: "focus-visible:ring-emerald-400/30",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.10)]",
  },
  rose: {
    text: "text-rose-300",
    hoverBg: "hover:bg-rose-900/10",
    border: "border-rose-900/40",
    ring: "focus-visible:ring-rose-400/30",
    glow: "shadow-[0_0_40px_rgba(244,63,94,0.10)]",
  },
  amber: {
    text: "text-amber-300",
    hoverBg: "hover:bg-amber-900/10",
    border: "border-amber-900/40",
    ring: "focus-visible:ring-amber-400/30",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.10)]",
  },
  stone: {
    text: "text-stone-200",
    hoverBg: "hover:bg-stone-800/30",
    border: "border-stone-700/40",
    ring: "focus-visible:ring-stone-300/20",
    glow: "shadow-[0_0_40px_rgba(231,229,228,0.06)]",
  },
};

const DEFAULT_ITEMS = [
  { id: "map", label: "Atlas", tone: "emerald", hint: "Terrain, gates, fragments" },
  { id: "atmosphere", label: "Atmosphere", tone: "emerald", hint: "Mist, ash, stillness" },
  { id: "cycle", label: "Cycle", tone: "emerald", hint: "Day / tide / drift" },
];

export default function WorldNav({
  activeId,
  onSelect,
  items = DEFAULT_ITEMS,
  expanded, // controlled (optional)
  defaultExpanded = false, // uncontrolled default
  onExpandedChange,
  className = "",
}) {
  const [openLocal, setOpenLocal] = useState(defaultExpanded);
  const isOpen = expanded ?? openLocal;

  const setOpen = (v) => {
    if (expanded === undefined) setOpenLocal(v);
    onExpandedChange?.(v);
  };

  const railBorder = useMemo(() => TONE.emerald.border, []);

  return (
    <nav
      className={cx(
        "absolute left-0 top-0 bottom-0 z-40",
        "bg-[#0c0a09]/90 backdrop-blur-sm",
        "border-r",
        railBorder,
        "transition-all duration-300",
        isOpen ? "w-60" : "w-16",
        className
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      aria-label="World navigation"
    >
      {/* align with your existing pt-24 rails */}
      <div className="flex flex-col pt-24 gap-2 px-2">
        {items.map((it) => (
          <WorldNavButton
            key={it.id}
            item={it}
            active={it.id === activeId}
            expanded={isOpen}
            onSelect={(id) => (it.onSelect ?? onSelect)?.(id)}
          />
        ))}
      </div>
    </nav>
  );
}

function WorldNavButton({ item, active, expanded, onSelect }) {
  const tone = TONE[item.tone ?? "stone"];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item.id)}
      className={cx(
        "group w-full rounded-lg border border-transparent",
        "px-3 py-3 flex items-center justify-between",
        "transition-colors",
        tone.hoverBg,
        "focus-visible:outline-none focus-visible:ring-2",
        tone.ring,
        active && cx("bg-white/5 border-white/15", tone.glow)
      )}
      aria-current={active ? "page" : undefined}
      title={!expanded ? item.label : undefined}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Icon slot (optional: coin relief component) */}
        <div className={cx("shrink-0 grid place-items-center", tone.text)}>
          {item.icon ? (
            <span className="w-8 h-8 block">{item.icon}</span>
          ) : (
            <span className={cx("w-2.5 h-2.5 rounded-full", active ? "bg-current" : "bg-current/60")} />
          )}
        </div>

        {/* Label */}
        <div className={cx("min-w-0 transition-all", expanded ? "opacity-100" : "opacity-0 w-0")} aria-hidden={!expanded}>
          <div className={cx("uppercase tracking-[0.3em] text-[10px] font-mono", tone.text, "truncate")}>
            {item.label}
          </div>
          {item.hint && <div className="text-[11px] text-stone-400 truncate mt-1">{item.hint}</div>}
        </div>
      </div>

      <ChevronRight className={cx("w-3 h-3 transition opacity-0 group-hover:opacity-100", tone.text)} />
    </button>
  );
}
