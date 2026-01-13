"use client";

import { useState } from "react";
import Link from "next/link";
import { Feather, FlaskConical, Anchor } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import cdn from "@/lib/cdn";

const STRATA = [
  {
    id: "surface",
    label: "Surface World",
    Icon: Anchor,
    color: "bg-[#3d342b]",
    accentText: "text-amber-500",
    border: "border-amber-900",
    links: [
      { label: "The Map", href: "/map" },
      { label: "Weather", href: "/weather" },
    ],
  },
  {
    id: "deep",
    label: "Deep Tethys",
    Icon: Feather,
    color: "bg-[#2a2420]",
    accentText: "text-cyan-500",
    border: "border-cyan-900",
    links: [
      { label: "Creatures", href: "/creatures" },
      { label: "Factions", href: "/factions" },
    ],
  },
  {
    id: "magma",
    label: "The Core",
    Icon: FlaskConical,
    color: "bg-[#1a120e]",
    accentText: "text-rose-500",
    border: "border-rose-900",
    links: [
      { label: "Mystics", href: "/mystics" },
      { label: "Science Lab", href: "/science" },
    ],
  },
];

export default function StrataNav() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop rail */}
      <nav
        className="fixed left-0 top-1/4 z-50 hidden md:flex flex-col gap-2"
        role="navigation"
        aria-label="Strata navigation"
      >
        {STRATA.map((layer) => {
          const Icon = layer.Icon;
          const isActive = activeLayer === layer.id;

          return (
            <motion.div
              key={layer.id}
              onMouseEnter={() => setActiveLayer(layer.id)}
              onMouseLeave={() => setActiveLayer(null)}
              onFocus={() => setActiveLayer(layer.id)}
              onBlur={() => setActiveLayer(null)}
              animate={{ x: isActive ? 0 : -180, opacity: isActive ? 1 : 0.92 }}
              initial={{ x: -180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`relative w-64 ${layer.color} border-r-4 ${layer.border} rounded-r-lg shadow-xl cursor-pointer overflow-hidden`}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-2 min-w-[160px]">
                  {layer.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-xs uppercase tracking-widest ${layer.accentText} hover:text-white transition-colors`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-2 pl-4 border-l border-white/5">
                  <span className={layer.accentText}>
                    <Icon size={18} />
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-[0.35em] rotate-90 whitespace-nowrap mt-4">
                    {layer.label}
                  </span>
                </div>
              </div>

              <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url(${cdn("/noise.svg")})` }}
              />
            </motion.div>
          );
        })}
      </nav>

      {/* Mobile drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden px-4 pb-4">
        <div className="bg-[#1c1917]/90 backdrop-blur-xl border border-[#292524] rounded-2xl shadow-2xl">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold tracking-wide text-stone-200 uppercase"
            aria-expanded={mobileOpen}
            aria-controls="strata-mobile-panel"
          >
            <span className="flex items-center gap-2">
              <Anchor className="h-4 w-4 text-amber-400" />
              Strata Navigation
            </span>
            <span className="text-[11px] text-stone-400">{mobileOpen ? "Close" : "Open"}</span>
          </button>

          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="px-4 pb-4 pt-1 space-y-3"
                id="strata-mobile-panel"
              >
                {STRATA.map((layer) => {
                  const Icon = layer.Icon;
                  return (
                    <div
                      key={layer.id}
                      className={`rounded-xl ${layer.color} bg-opacity-90 border ${layer.border} px-3 py-3 shadow-lg`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`rounded-full bg-black/20 p-2 ${layer.accentText}`}>
                          <Icon size={16} />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-stone-100 uppercase tracking-wide">
                            {layer.label}
                          </div>
                          <div className="text-[11px] text-stone-400">Choose a route</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {layer.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-full bg-black/30 px-3 py-1 text-xs uppercase tracking-widest text-stone-100 border border-white/10"
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// World of Tethys || D.C. Barletta
