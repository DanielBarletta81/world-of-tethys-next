"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

const TONE = {
  emerald: {
    text: "text-emerald-300",
    hoverBg: "hover:bg-emerald-900/10",
    border: "border-emerald-900/40",
    ring: "focus-visible:ring-emerald-400/30",
  },
  rose: {
    text: "text-rose-300",
    hoverBg: "hover:bg-rose-900/10",
    border: "border-rose-900/40",
    ring: "focus-visible:ring-rose-400/30",
  },
  amber: {
    text: "text-amber-300",
    hoverBg: "hover:bg-amber-900/10",
    border: "border-amber-900/40",
    ring: "focus-visible:ring-amber-400/30",
  },
  stone: {
    text: "text-stone-200",
    hoverBg: "hover:bg-stone-800/30",
    border: "border-stone-700/40",
    ring: "focus-visible:ring-stone-300/20",
  },
};

const DEFAULT_SECTIONS = [
  {
    id: "bond",
    title: "Bond",
    tone: "rose",
    items: [
      { id: "characters", label: "Figures", hint: "Faces you remember" },
      { id: "forge", label: "Forge", hint: "Staff + attachments" },
      { id: "profile", label: "Operative", hint: "Stats / loadout / scars" },
    ],
  },
  {
    id: "lore",
    title: "Lore",
    tone: "amber",
    items: [
      { id: "cambria", label: "Cambria", hint: "Fracture / distortion" },
      { id: "books", label: "Chronicle", hint: "Chapters / plates" },
      { id: "oracle", label: "Oracle Pool", hint: "Listen. Don’t click fast." },
      { id: "paths", label: "Paths", hint: "Missions, but honest" },
    ],
  },
];

export default function InnerNav({
  activeId,
  onSelect,
  sections = DEFAULT_SECTIONS,
  expanded, // controlled (optional)
  defaultExpanded = false,
  onExpandedChange,
  className = "",
}) {
  const [openLocal, setOpenLocal] = useState(defaultExpanded);
  const isOpen = expanded ?? openLocal;

  const setOpen = (v) => {
    if (expanded === undefined) setOpenLocal(v);
    onExpandedChange?.(v);
  };

  return (
    <nav
      className={cx(
        "absolute right-0 top-0 bottom-0 z-40",
        "bg-[#0c0a09]/90 backdrop-blur-sm",
        "border-l",
        TONE.rose.border,
        "transition-all duration-300",
        isOpen ? "w-64" : "w-16",
        className
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      aria-label="Inner navigation"
    >
      <div className="flex flex-col pt-24 gap-4 px-2">
        {sections.map((sec) => (
          <NavSection
            key={sec.id}
            section={sec}
            expanded={isOpen}
            activeId={activeId}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className={cx("absolute top-6 right-2", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-stone-500 font-mono">
          <ChevronLeft className="w-3 h-3" /> inward
        </div>
      </div>
    </nav>
  );
}

function NavSection({ section, expanded, activeId, onSelect }) {
  const tone = TONE[section.tone ?? "stone"];

  return (
    <div>
      <div
        className={cx(
          "px-3 py-2 uppercase tracking-[0.3em] text-[10px] font-mono",
          tone.text,
          expanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        )}
        aria-hidden={!expanded}
      >
        {section.title}
      </div>

      <div className={cx("flex flex-col gap-1", expanded ? "pl-2" : "pl-0")}>
        {section.items.map((it) => (
          <NavItemRow
            key={it.id}
            item={it}
            tone={tone}
            expanded={expanded}
            active={it.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function NavItemRow({ item, tone, expanded, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(item.id)}
      className={cx(
        "group w-full rounded-lg px-3 py-2 text-left border border-transparent transition-colors",
        tone.hoverBg,
        "focus-visible:outline-none focus-visible:ring-2",
        tone.ring,
        active && "bg-white/5 border-white/15"
      )}
      title={!expanded ? item.label : undefined}
      aria-current={active ? "page" : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Icon slot optional */}
        <div className={cx("shrink-0 mt-[2px]", tone.text)}>
          {item.icon ? <span className="w-7 h-7 block">{item.icon}</span> : <span className="w-2 h-2 rounded-full bg-current/70 block mt-1.5" />}
        </div>

        <div className={cx("min-w-0 transition-all", expanded ? "opacity-100" : "opacity-0 w-0")} aria-hidden={!expanded}>
          <div className="text-xs text-stone-200 group-hover:text-white transition truncate">{item.label}</div>
          {item.hint && <div className="text-[11px] text-stone-500 truncate mt-1">{item.hint}</div>}
        </div>
      </div>
    </button>
  );
}
