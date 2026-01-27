'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Eye, Microscope, Radar } from 'lucide-react';
import cdn from '@/lib/cdn';
import DeepTimeScene from '@/components/DeepTimeScene';

export default function Home() {
  const [toolMenuOpen, setToolMenuOpen] = useState(false);
  const [toolPreview, setToolPreview] = useState(null);
  const scienceTools = useMemo(
    () => [
      {
        id: 'pteros-outpost',
        label: 'Pteros Survival Outpost',
        href: '/pteros',
        mode: 'In‑World',
        icon: Radar,
        desc: 'Survival logic from live conditions. Wind, tide, and crossing windows.',
        preview: cdn('/img/bg/obsidian-coast-4k.jpg')
      },
      {
        id: 'pteros-dash',
        label: 'Pteros Dashboard',
        href: '/science#telemetry',
        mode: 'Field Science',
        icon: Microscope,
        desc: 'Instrumented telemetry and field station dashboards for real‑world analogs.',
        preview: cdn('/img/locations/pteros-island-sun.png')
      },
      {
        id: 'paleogis',
        label: 'PaleoGIS',
        href: '/science#geo',
        mode: 'Field Science',
        icon: Eye,
        desc: 'Plate context and analog overlays. Navigate the map through geologic truth.',
        preview: cdn('/img/map/tethys-atlas-canon.png')
      }
    ],
    []
  );
  return (
    <div id="timeline" className="relative min-h-screen bg-[#050403] text-stone-100 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-70 pointer-events-none">
          <DeepTimeScene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#050403]" />
        <div
          className="absolute inset-0 opacity-25 mix-blend-screen"
          style={{ backgroundImage: `url(${cdn('/noise.svg')})` }}
        />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-6">
        <div className="text-xs uppercase tracking-[0.4em] text-stone-400 font-mono">
          World Status: Active
        </div>
        <Link
          href="/portal"
          className="text-[10px] uppercase tracking-[0.3em] text-stone-400 hover:text-stone-200 transition-colors"
        >
          Portal
        </Link>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center min-h-[70vh]">
        <p className="text-[11px] uppercase tracking-[0.6em] text-stone-500 font-mono">
          World of Tethys
        </p>
        <h1 className="text-4xl md:text-6xl font-tethys-volcanic uppercase tracking-widest text-stone-100 mt-4">
          A living world
          <span className="block text-amber-400">under pressure</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm md:text-base text-stone-300/90 font-field">
          A city was built to control water, light, and people. Beyond it, the world
          still remembers how to breathe.
        </p>
        <p className="mt-2 text-sm text-stone-400">
          Some regions are stable. Some are not.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/map"
            className="tethys-cta px-6 py-3 rounded-full border border-amber-500/40 bg-amber-500/10 text-xs text-amber-200 hover:bg-amber-500/20 transition-colors"
          >
            Enter
          </Link>
          <Link
            href="/science"
            className="tethys-cta px-6 py-3 rounded-full border border-stone-700 text-xs text-stone-300 hover:text-stone-100 hover:border-stone-500 transition-colors"
          >
            Field Notes
          </Link>
        </div>
      </main>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-10">
        <div className="border border-stone-800 bg-black/50 rounded-2xl p-6 md:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500 font-mono">
                Field Station Access
              </p>
              <h2 className="text-2xl font-semibold text-stone-100">
                Tethys ↔ Real History
              </h2>
              <p className="mt-2 text-sm text-stone-400 max-w-2xl">
                Every system maps to real ancient Earth. Analog names shift, but biology and survival
                remain unchanged. The Permian extinction and re‑colonization frame the rules that
                govern every corridor.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToolMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-stone-700 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-stone-300 hover:text-stone-100 hover:border-stone-500 transition-colors"
            >
              Science Tools <ChevronDown size={14} className={`transition-transform ${toolMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {toolMenuOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scienceTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    className="group border border-stone-800 bg-black/40 rounded-xl p-4 hover:border-amber-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-stone-500">
                        <Icon size={14} className="text-amber-300" />
                        {tool.mode}
                      </div>
                      <button
                        type="button"
                        onClick={() => setToolPreview(tool)}
                        className="text-[9px] uppercase tracking-[0.25em] text-stone-400 hover:text-stone-200"
                      >
                        Preview
                      </button>
                    </div>
                    <p className="mt-3 text-stone-100 font-semibold">{tool.label}</p>
                    <p className="mt-2 text-sm text-stone-400">{tool.desc}</p>
                    <Link
                      href={tool.href}
                      className="mt-4 inline-flex text-[10px] uppercase tracking-[0.3em] text-amber-300 hover:text-amber-200"
                    >
                      Open
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/map"
          className="group rounded-2xl border border-stone-800 bg-black/40 p-6 text-left hover:border-amber-400/40 transition-colors"
        >
          <p className="tethys-section-title text-[10px] text-stone-500">The Map</p>
          <p className="mt-3 text-stone-200 font-semibold">Land, water, and fracture.</p>
          <p className="mt-2 text-sm text-stone-400">
            Not all paths are readable.
          </p>
        </Link>
        <Link
          href="/science"
          className="group rounded-2xl border border-stone-800 bg-black/40 p-6 text-left hover:border-emerald-400/40 transition-colors"
        >
          <p className="tethys-section-title text-[10px] text-stone-500">The Systems</p>
          <p className="mt-3 text-stone-200 font-semibold">Water circulation. Memory persistence.</p>
          <p className="mt-2 text-sm text-stone-400">
            Environmental thresholds.
          </p>
        </Link>
        <Link
          href="/mystics"
          className="group rounded-2xl border border-stone-800 bg-black/40 p-6 text-left hover:border-purple-400/40 transition-colors"
        >
          <p className="tethys-section-title text-[10px] text-stone-500">The Fracture</p>
          <p className="mt-3 text-stone-200 font-semibold">History is not past here.</p>
          <p className="mt-2 text-sm text-stone-400">It leaks.</p>
        </Link>
      </section>

      <footer className="relative z-10 border-t border-stone-900/60 px-6 py-6 text-center text-[10px] uppercase tracking-[0.4em] text-stone-500 font-mono">
        <span className="block">Access Level: Partial</span>
        <Link
          href="https://dcbarletta.com"
          className="mt-3 inline-flex items-center justify-center text-[9px] uppercase tracking-[0.35em] text-amber-400 hover:text-amber-200 transition-colors"
        >
          This world is introduced in Sky City
        </Link>
      </footer>

      <div aria-hidden className="relative z-0 h-[400vh]" />

      {toolPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setToolPreview(null)}
          />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-stone-800 bg-black/80 overflow-hidden">
            <div className="h-56 md:h-64 bg-cover bg-center" style={{ backgroundImage: `url(${toolPreview.preview})` }} />
            <div className="p-6 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">{toolPreview.mode}</p>
              <h3 className="text-2xl font-semibold text-stone-100">{toolPreview.label}</h3>
              <p className="text-sm text-stone-400">{toolPreview.desc}</p>
              <div className="flex gap-3">
                <Link
                  href={toolPreview.href}
                  className="inline-flex px-4 py-2 border border-amber-500/40 text-[10px] uppercase tracking-[0.3em] text-amber-200 hover:border-amber-400 hover:text-amber-100"
                >
                  Open Tool
                </Link>
                <button
                  type="button"
                  onClick={() => setToolPreview(null)}
                  className="inline-flex px-4 py-2 border border-stone-700 text-[10px] uppercase tracking-[0.3em] text-stone-400 hover:text-stone-200 hover:border-stone-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// World of Tethys || D.C. Barletta
