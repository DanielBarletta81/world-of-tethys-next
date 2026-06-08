'use client';

/**
 * PaleoGIS — 111 Ma paleogeographic map of the Tethyan Archipelago.
 * SVG-based, geologically grounded, faction-colored Tethysia overlays.
 * Each location carries modern GPS, 111 Ma paleo coords, and VR world_space.
 */

import { useState, useRef } from 'react';

const FACTION_RING = {
  triumvirate: '#7c3aed',
  mystic:      '#10b981',
  silurian:    '#0891b2',
  thal:        '#d97706',
  neutral:     '#64748b',
  archive:     '#6366f1',
};

const PALEO_LOCATIONS = [
  { id: 'sky-city',            tethysName: 'Sky City',             realAnalog: 'Kohistan-Ladakh Volcanic Arc',       type: 'civilization', paleo_x: 490, paleo_y: 235, modern_lat: -7.0,  modern_lng: 107.5,  world_space: { x: -45, y: 0,   z: 12  }, faction: 'triumvirate', desc: 'Vertical hierarchy on the active intra-oceanic arc. At 111 Ma, calc-alkaline eruptions drove hypercane generation above.' },
  { id: 'watcher-volcano',     tethysName: 'Watcher Volcano',      realAnalog: 'Kohistan-Ladakh Arc (Merapi analog)', type: 'volcanic',     paleo_x: 510, paleo_y: 225, modern_lat: -7.54, modern_lng: 110.44, world_space: { x: 0,   y: 180, z: 8   }, faction: 'neutral',     desc: 'The central stratovolcano. At 111 Ma, this arc injected SO₂ into the stratosphere. Mount Merapi is its modern analog.' },
  { id: 'pteros',              tethysName: 'Pteros Island',         realAnalog: 'Crato Formation / Gondwana Margin',  type: 'hub',          paleo_x: 335, paleo_y: 270, modern_lat: -8.3,  modern_lng: 114.6,  world_space: { x: 0,   y: 0,   z: 0   }, faction: 'neutral',     desc: 'VR world origin. Shallow carbonate platform at the Gondwana-Tethys margin. Biological mixing zone between hemispheres.' },
  { id: 'ironwoods',           tethysName: 'The Ironwoods',         realAnalog: 'Axel Heiberg Fossil Forest',         type: 'biome',        paleo_x: 440, paleo_y: 128, modern_lat: 1.0,   modern_lng: 113.5,  world_space: { x: -180,y: 0,   z: -165}, faction: 'neutral',     desc: 'Araucarian megaforest on the high Laurasian margin. Fossil evidence shows this type extended to 79°N at 111 Ma.' },
  { id: 'mystic-woods',        tethysName: 'Mystic Woods',          realAnalog: 'Wealden Fern Swamps / Tethyan fringe',type: 'biome',       paleo_x: 465, paleo_y: 248, modern_lat: -7.2,  modern_lng: 112.5,  world_space: { x: -20, y: 0,   z: -25 }, faction: 'mystic',      desc: 'Early angiosperm highland belt. The Kith network at 43.7 Hz routes through root systems predating the flowering plant radiation.' },
  { id: 'silurian-riverlands', tethysName: 'Silurian Riverlands',   realAnalog: 'Nubian / Paleo-Nile Delta',          type: 'wetland',      paleo_x: 505, paleo_y: 255, modern_lat: -6.5,  modern_lng: 111.8,  world_space: { x: 25,  y: 0,   z: -18 }, faction: 'silurian',    desc: 'Deltaic estuary complex at the Tethys southern margin. African plate rivers drained northwest into proto-Atlantic.' },
  { id: 'danian-delta',        tethysName: 'Danian Delta',          realAnalog: 'North Java Coastal Delta',           type: 'wetland',      paleo_x: 515, paleo_y: 262, modern_lat: -6.8,  modern_lng: 112.0,  world_space: { x: 30,  y: 0,   z: -10 }, faction: 'silurian',    desc: 'River mouth delta at Glow Tide. The ash began to fall here. Every political lie in Sky City came due at this delta.' },
  { id: 'amber-plains',        tethysName: 'Amber Plains',          realAnalog: 'Serengeti / Central Gondwana',       type: 'plains',       paleo_x: 530, paleo_y: 295, modern_lat: -4.0,  modern_lng: 120.5,  world_space: { x: 85,  y: 0,   z: 30  }, faction: 'thal',        desc: 'Open Gondwana interior plain. Titan-Walker migration routes cross here. Igzier lineage revealed at the plains rim.' },
  { id: 'mammoth',             tethysName: 'Mammoth Island',         realAnalog: 'Kerguelen LIP (above sea level)',    type: 'volcanic',     paleo_x: 580, paleo_y: 210, modern_lat: 0.5,   modern_lng: 124.5,  world_space: { x: 130, y: 0,   z: -55 }, faction: 'thal',        desc: 'Isolated island on the eastern arc. At 111 Ma the Kerguelen LIP was actively erupting — one of Earth\'s largest igneous provinces.' },
  { id: 'permian-desert',      tethysName: 'Permian Desert',         realAnalog: 'Khorat Basin / Indosinian Block',    type: 'desert',       paleo_x: 555, paleo_y: 195, modern_lat: 15.5,  modern_lng: 103.0,  world_space: { x: 95,  y: 0,   z: -100}, faction: 'neutral',     desc: 'Ancient evaporite basin persisting into the Cretaceous. Red beds and massive salt deposits from episodic desert cycles.' },
  { id: 'cambria',             tethysName: 'Cambria (Ruins)',         realAnalog: 'Adria / Apulia Carbonate Platform',  type: 'ruin',         paleo_x: 480, paleo_y: 222, modern_lat: -8.8,  modern_lng: 107.2,  world_space: { x: -12, y: -40, z: 5   }, faction: 'archive',     isSubmerged: true, desc: 'Submerged prequel setting. At 111 Ma the Adria microplate was a shallow Tethys platform. Drowned by geoidal eustasy during OAE 1b.' },
  { id: 'arnn-ridge',          tethysName: 'Arnn Ridge',             realAnalog: 'Crocker Range / Borneo',             type: 'ridge',        paleo_x: 555, paleo_y: 182, modern_lat: 5.8,   modern_lng: 116.5,  world_space: { x: 100, y: 60,  z: -80 }, faction: 'neutral',     desc: 'The ridge pact site. Northern Borneo highlands formed part of the Sundaland block at 111 Ma, already elevated above the Tethys.' },
];

const OCEAN_ZONES = [
  { id: 'pacific',      d: 'M0,0 L80,0 L70,70 L120,95 L200,115 L200,280 L150,400 L100,490 L0,490 Z',                                                                                           fill: 'rgba(4,26,42,0.7)',  label: 'Panthalassa',      lx: 55,  ly: 290 },
  { id: 'pacific-e',    d: 'M900,90 L1000,80 L1000,490 L840,490 L830,380 L840,330 L800,295 L850,55 Z',                                                                                         fill: 'rgba(4,26,42,0.7)',  label: '',                 lx: 0,   ly: 0   },
  { id: 'tethys',       d: 'M380,118 L650,140 L700,310 L640,260 L590,270 L560,285 L460,295 L360,280 L345,310 L300,265 L360,118 Z',                                                             fill: 'rgba(8,47,73,0.6)',  label: 'Neo-Tethys Ocean', lx: 490, ly: 215 },
  { id: 'proto-atl',    d: 'M200,280 L300,265 L345,310 L360,380 L300,490 L200,490 L150,400 L155,330 Z',                                                                                        fill: 'rgba(8,47,73,0.5)',  label: 'Proto-Atlantic',   lx: 260, ly: 380 },
  { id: 'indian',       d: 'M560,285 L640,260 L700,310 L700,380 L650,420 L600,410 L570,360 L550,310 Z',                                                                                        fill: 'rgba(6,36,55,0.55)', label: 'Proto-Indian',     lx: 625, ly: 340 },
];

const PLATES = [
  { id: 'laurasia',    d: 'M80,40 L380,30 L520,80 L640,60 L750,40 L870,55 L900,90 L870,130 L780,150 L720,120 L650,140 L580,110 L500,130 L440,105 L360,118 L280,100 L200,115 L120,95 L70,70 Z', fill: '#111d14', stroke: '#1a3320', label: 'Laurasia',       lx: 200, ly: 82  },
  { id: 'africa',      d: 'M460,295 L560,285 L620,310 L650,380 L630,440 L590,480 L540,490 L490,470 L460,420 L445,360 L450,320 Z',                                                              fill: '#1a1208', stroke: '#2e200f', label: 'Africa',         lx: 540, ly: 390 },
  { id: 's-america',   d: 'M200,280 L300,265 L345,310 L360,380 L340,450 L300,490 L250,500 L215,470 L195,410 L185,345 L190,300 Z',                                                             fill: '#1a1208', stroke: '#2e200f', label: 'S. America',     lx: 270, ly: 390 },
  { id: 'india',       d: 'M590,270 L640,260 L660,300 L645,340 L615,350 L590,325 L585,290 Z',                                                                                                  fill: '#1a1208', stroke: '#2e200f', label: 'India (rifting)', lx: 622, ly: 305 },
  { id: 'australia',   d: 'M700,310 L800,295 L840,330 L830,380 L790,400 L740,395 L700,365 L695,335 Z',                                                                                        fill: '#1a1208', stroke: '#2e200f', label: 'Australia',      lx: 768, ly: 350 },
  { id: 'antarctica',  d: 'M300,490 L450,505 L600,510 L750,500 L820,490 L840,520 L750,545 L500,555 L280,540 L260,515 Z',                                                                      fill: '#0f1820', stroke: '#1a2d3d', label: '',               lx: 0,   ly: 0   },
];

export default function PaleoGIS() {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const svgRef = useRef(null);

  const activeData = active ? PALEO_LOCATIONS.find((p) => p.id === active) : null;

  return (
    <section className="relative rounded-2xl overflow-hidden border border-stone-800 bg-[#040810] shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-stone-800/80 bg-[#06090f]/90">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-cyan-700/80 font-mono">Paleo-GIS System · TMP-v1</p>
          <h3 className="text-sm font-tethys-volcanic text-stone-200 mt-0.5">Early Cretaceous Reconstruction · 111 Ma</h3>
        </div>
        <div className="hidden md:flex items-center gap-5 text-[9px] font-mono text-stone-600 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />Arc Active</span>
          <span>OAE 1b Window</span>
          <span>Gondwana Fragmenting</span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row">

        {/* SVG map */}
        <div className="relative flex-1 overflow-hidden" style={{ minHeight: 520 }}>
          {/* Scanline */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.025]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.5) 2px,rgba(255,255,255,0.5) 3px)' }} />
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.07]"
            style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px),linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)', backgroundSize: '100px 93.3px' }} />

          <svg ref={svgRef} viewBox="0 0 1000 560" className="w-full" style={{ minHeight: 520 }} preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="terrain-noise" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
                <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
                <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend"/>
                <feComponentTransfer in="blend">
                  <feFuncA type="linear" slope="1"/>
                </feComponentTransfer>
              </filter>
              <filter id="glow-red">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="tethys-depth" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(14,165,233,0.12)"/>
                <stop offset="100%" stopColor="rgba(4,26,42,0)"/>
              </radialGradient>
              <marker id="cec-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L0,5 L5,2.5 Z" fill="rgba(14,165,233,0.4)"/>
              </marker>
            </defs>

            {/* Deep ocean */}
            <rect width="1000" height="560" fill="#030810"/>

            {/* Ocean zones */}
            {OCEAN_ZONES.map((z) => (
              <g key={z.id}>
                <path d={z.d} fill={z.fill} stroke="none"/>
                {z.label && <text x={z.lx} y={z.ly} fill="rgba(56,189,248,0.2)" fontSize="9" fontFamily="serif" fontStyle="italic" textAnchor="middle">{z.label}</text>}
              </g>
            ))}

            {/* Tethys depth radial */}
            <ellipse cx="490" cy="245" rx="180" ry="65" fill="url(#tethys-depth)"/>

            {/* Plates with terrain filter */}
            {PLATES.map((p) => (
              <g key={p.id}>
                <path d={p.d} fill={p.fill} stroke={p.stroke} strokeWidth="0.8" filter="url(#terrain-noise)" opacity="0.95"/>
                {p.label && <text x={p.lx} y={p.ly} fill="rgba(148,163,184,0.22)" fontSize="9" fontFamily="serif" fontStyle="italic" textAnchor="middle">{p.label}</text>}
              </g>
            ))}

            {/* Tethys spreading ridge */}
            <path d="M390,200 Q500,245 625,205" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5"/>
            <text x="505" y="198" fill="rgba(239,68,68,0.35)" fontSize="7" fontFamily="monospace" textAnchor="middle">— Tethys spreading —</text>

            {/* Kohistan-Ladakh Arc highlight */}
            <path d="M468,218 Q505,210 545,222" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" filter="url(#glow-red)" opacity="0.7"/>

            {/* CEC current arrow */}
            <path d="M630,242 Q500,252 355,240" fill="none" stroke="rgba(14,165,233,0.35)" strokeWidth="1.5" markerEnd="url(#cec-arrow)"/>
            <text x="490" y="262" fill="rgba(14,165,233,0.25)" fontSize="7" fontFamily="monospace" textAnchor="middle">← CEC (Circumglobal Tethys Current)</text>

            {/* S. Atlantic rift */}
            <path d="M340,310 Q355,345 358,380" fill="none" stroke="rgba(59,130,246,0.4)" strokeWidth="1" strokeDasharray="3 3"/>

            {/* PZE zone */}
            <ellipse cx="508" cy="248" rx="75" ry="22" fill="rgba(109,40,217,0.07)" stroke="rgba(139,92,246,0.25)" strokeWidth="0.7" strokeDasharray="4 3"/>
            <text x="508" y="246" fill="rgba(139,92,246,0.35)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">PZE zone (OAE 1b)</text>

            {/* Equator */}
            <line x1="0" y1="280" x2="1000" y2="280" stroke="rgba(251,191,36,0.18)" strokeWidth="0.6" strokeDasharray="12 6"/>
            <text x="10" y="278" fill="rgba(251,191,36,0.35)" fontSize="7" fontFamily="monospace">EQ</text>

            {/* Tropics */}
            <line x1="0" y1="215" x2="1000" y2="215" stroke="rgba(148,163,184,0.06)" strokeWidth="0.5"/>
            <line x1="0" y1="345" x2="1000" y2="345" stroke="rgba(148,163,184,0.06)" strokeWidth="0.5"/>

            {/* Location dots */}
            {PALEO_LOCATIONS.map((loc) => {
              const isActive  = active === loc.id;
              const isHovered = hovered === loc.id;
              const ring = FACTION_RING[loc.faction] || '#64748b';
              return (
                <g key={loc.id}
                  onClick={() => setActive(isActive ? null : loc.id)}
                  onMouseEnter={() => setHovered(loc.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}>
                  {isActive && (
                    <circle cx={loc.paleo_x} cy={loc.paleo_y} r="14" fill="none" stroke={ring} strokeWidth="0.8">
                      <animate attributeName="r" values="10;20;10" dur="2.4s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.4s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  {loc.isSubmerged && (
                    <circle cx={loc.paleo_x} cy={loc.paleo_y} r="10" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.3)" strokeWidth="0.5" strokeDasharray="3 2"/>
                  )}
                  <circle cx={loc.paleo_x} cy={loc.paleo_y} r={isActive ? 5.5 : isHovered ? 4.5 : 3}
                    fill={isActive || isHovered ? ring : 'rgba(226,232,240,0.75)'}
                    stroke={ring} strokeWidth={isActive ? 1.5 : 0.8}
                    style={{ transition: 'all 0.15s' }}/>
                  {(isActive || isHovered) && (
                    <text x={loc.paleo_x + 8} y={loc.paleo_y - 5} fill={ring} fontSize="8" fontFamily="monospace" style={{ pointerEvents: 'none' }}>
                      {loc.tethysName}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
            {Object.entries({ triumvirate: 'Triumvirate', mystic: 'Mystic', silurian: 'Silurian', thal: 'Thal', archive: 'Submerged' }).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: FACTION_RING[k] }}/>
                <span className="text-[8px] text-stone-400 uppercase tracking-wider font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data panel */}
        <div className="xl:w-72 border-t xl:border-t-0 xl:border-l border-stone-800 bg-[#040810]/98 p-5 space-y-4" style={{ minHeight: 520 }}>
          {activeData ? (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] uppercase tracking-[0.3em] font-mono" style={{ color: FACTION_RING[activeData.faction] }}>
                    {activeData.faction} · {activeData.type}
                  </p>
                  <button onClick={() => setActive(null)} className="text-stone-700 hover:text-stone-400 text-xs">✕</button>
                </div>
                <h4 className="text-lg font-tethys-volcanic text-stone-100 mt-0.5">{activeData.tethysName}</h4>
                <p className="text-[10px] text-stone-500 italic">{activeData.realAnalog}</p>
              </div>

              {activeData.isSubmerged && (
                <div className="rounded-lg border border-indigo-800/40 bg-indigo-950/20 px-3 py-2">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-indigo-400/80">Submerged at 111 Ma</p>
                  <p className="text-[10px] text-indigo-300/70 mt-0.5">Below Tethys surface. Dive routes required.</p>
                </div>
              )}

              <p className="text-[11px] text-stone-400 leading-relaxed">{activeData.desc}</p>

              <div className="rounded-lg border border-stone-800 bg-black/40 p-3 space-y-2 text-[10px] font-mono">
                <p className="text-[9px] uppercase tracking-[0.25em] text-stone-600">Coordinate Record</p>
                <div className="flex justify-between"><span className="text-stone-600">111 Ma (SVG)</span><span className="text-stone-300">{activeData.paleo_x}, {activeData.paleo_y}</span></div>
                <div className="flex justify-between"><span className="text-stone-600">Modern GPS</span><span className="text-stone-300">{activeData.modern_lat}°, {activeData.modern_lng}°</span></div>
                <div className="flex justify-between"><span className="text-stone-600">VR Vector3</span><span className="text-stone-300">({activeData.world_space.x}, {activeData.world_space.y}, {activeData.world_space.z})</span></div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-[9px] uppercase tracking-[0.35em] text-stone-600 font-mono">Select a location</p>
              <p className="text-[11px] text-stone-500 leading-relaxed">The Tethys region at 111 Ma — Aptian-Albian transition. Gondwana is fragmenting. The Kohistan-Ladakh Arc is erupting. Each marker carries 111 Ma paleocoordinates, modern GPS, and Unreal world_space.</p>
              <div className="space-y-2 pt-3 border-t border-stone-900">
                <p className="text-[9px] uppercase tracking-[0.25em] text-stone-600 font-mono">Active Events · 111 Ma</p>
                {[['#ef4444','OAE 1b (Paquier)','Photic zone euxinia · purple water'],['#ef4444','Kohistan-Ladakh Arc','Calc-alkaline eruptions · hypercane'],['#3b82f6','S. Atlantic Opening','Gondwana fragmentation begins'],['#0ea5e9','CEC Active','W→E circumglobal Tethys current'],['#a855f7','PZE Zone','H₂S in photic zone · toxic purple water']].map(([c,l,n]) => (
                  <div key={l} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: c }}/>
                    <div><p className="text-[10px] text-stone-400">{l}</p><p className="text-[9px] text-stone-600">{n}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-2 border-t border-stone-800/60 bg-[#040810]/90 flex items-center justify-between">
        <p className="text-[8px] font-mono text-stone-700 uppercase tracking-widest">Scotese PALEOMAP · GPlates · Blakey Deep Time Maps</p>
        <p className="text-[8px] font-mono text-stone-700">TMP-v1 · VR Bridge Active</p>
      </div>
    </section>
  );
}
// World of Tethys || D.C. Barletta
