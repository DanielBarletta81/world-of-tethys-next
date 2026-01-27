'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import OracleModal from "@/components/OracleModal";
import { pickRavelWeeklyResponse } from '@/lib/oraclePicker';
import { useTethys } from "@/context/TethysContext";
import baseSeeder from '@/oracle_pool/ravel_seeder.json';
import { TETHYS_MEDICINAL_SYSTEM } from '@/data/tethys-medicinals';
import { getDefaultLoreContext, getLoreSeedSources, selectLoreSeeds } from '@/lib/lore-seed-runtime';

const makeDayBucket = () => new Date().toISOString().slice(0, 10);
const stillnessToBand = (v = 0) => {
  if (v < 0.3) return "low";
  if (v < 0.7) return "medium";
  return "high";
};
const depthFromIndex = (i = 0) => {
  if (i <= 1) return "first";
  if (i <= 4) return "repeat";
  return "deep";
};
const regionToBand = (regionId) => {
  if (!regionId) return "far";
  if (["watcher-volcano", "watcher-flats", "purgess", "the-ledge"].includes(regionId)) return "near";
  if (["mystic-woods", "sky-city", "cambria-ruins"].includes(regionId)) return "mid";
  return "far";
};

const LOCATION_ENTRIES = {};

// Static mushroom nodes for the oracle surface
const MUSHROOMS = [
  { id: "m1", x: 18, y: 24, type: "amber", desc: "Resin-sweet caps cling to the rim. The spores smell like iron." },
  { id: "m2", x: 46, y: 38, type: "violet", desc: "A faint glow. The Oracle marks fresh answers with this hue." },
  { id: "m3", x: 72, y: 26, type: "ghost", desc: "Thin as paper. It dries fast, but the echo stays." },
  { id: "m4", x: 30, y: 60, type: "spore", desc: "Warm to the touch. The surface reacts as if it knows you." },
  { id: "m5", x: 60, y: 72, type: "root", desc: "Dark-stained threads. Ravel says it binds memory to stone." },
  { id: "m6", x: 10, y: 62, type: "rim", desc: "Wet driftwood rings with a soft knock. The rim is alive." },
  { id: "m7", x: 86, y: 58, type: "rim", desc: "A cluster of pale shelves. Pulling one feels like breaking a promise." },
];

const loadJournal = () => {
  try {
    return JSON.parse(localStorage.getItem("tethys_journal_v1")) ?? [];
  } catch {
    return [];
  }
};

const saveJournalEntry = (entry) => {
  const journal = loadJournal();
  journal.unshift(entry);
  localStorage.setItem("tethys_journal_v1", JSON.stringify(journal.slice(0, 100)));
};

const journalFromOracle = (text, uiState) => {
  if (!text) return null;
  return {
    id: crypto.randomUUID?.() ?? `j-${Date.now()}-${Math.random()}`,
    createdAt: Date.now(),
    type: "oracle",
    text: text.length > 80 ? `${text.slice(0, 60)}…` : text,
    tags: [],
    withheld: uiState === "withheld",
  };
};

const journalWithheld = () => ({
  id: crypto.randomUUID?.() ?? `j-${Date.now()}-${Math.random()}`,
  createdAt: Date.now(),
  type: "oracle",
  text: "Nothing answered.",
  withheld: true,
});



const OraclePool = () => {
  const { playerProfile, currentLocation, setPlayerProfile, isGuest, applyStatus } = useTethys();
  const [ripples, setRipples] = useState([]);
  const [activeWhisper, setActiveWhisper] = useState(null);
  const [harvested, setHarvested] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntry, setModalEntry] = useState(null);
  const [selectedMushroom, setSelectedMushroom] = useState(null);
  const [medicinalOpen, setMedicinalOpen] = useState(false);
  const [prepStage, setPrepStage] = useState(null);
  const [prepWarning, setPrepWarning] = useState(null);
  const [prepInference, setPrepInference] = useState(null);
  const [oracleSeed, setOracleSeed] = useState(null);
  const containerRef = useRef(null);
  const oracleWeatherRef = useRef({});
  const interactionIndexRef = useRef(0);
  const loggedWhispersRef = useRef(new Set());
  const recentWhispersRef = useRef([]);

  const uiState = activeWhisper ? (activeWhisper.reveal ? "text" : "withheld") : "silence";
  const stillness = playerProfile?.perception?.stillness ?? 0;
  const oracleSpeed = 1 + stillness * 0.8;
  const oracleOpacity = 1 + stillness * 0.15;
  const growthIntensity = Math.min(1, 0.35 + stillness * 0.65);
  const watcherState = playerProfile?.watcherState ?? "quiet";
  const path = playerProfile?.path?.primary ?? "mystic";
  const oracleSource = oracleSeed?.responses?.length ? oracleSeed : baseSeeder;
  const medicinalItems = TETHYS_MEDICINAL_SYSTEM.items;
  const loreContext = useMemo(
    () =>
      getDefaultLoreContext({
        stillness,
        timeOfDay: stillness > 0.6 ? 'night' : undefined
      }),
    [stillness]
  );
  const medicineSeeds = useMemo(
    () =>
      selectLoreSeeds({
        regionId: currentLocation,
        ui: 'mystics',
        context: loreContext,
        cluster: 'tethys-medicine',
        limit: 4
      }),
    [currentLocation, loreContext]
  );
  const sourceIndex = useMemo(() => {
    const sources = getLoreSeedSources();
    return new Map(sources.map((source) => [source.id, source.path || source.id]));
  }, []);
  const formatSourceLabel = useCallback((raw) => {
    if (!raw) return '';
    const trimmed = String(raw).trim();
    const lastSegment = trimmed.split('/').filter(Boolean).pop() || trimmed;
    return lastSegment.replace(/\\s+/g, ' ');
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadOracle = async () => {
      try {
        const res = await fetch('/api/oracle/pool');
        if (!res.ok) throw new Error('Oracle pool offline');
        const data = await res.json();
        if (!cancelled) setOracleSeed(data);
      } catch (error) {
        console.warn('Oracle pool fetch failed', error);
      }
    };
    loadOracle();
    return () => {
      cancelled = true;
    };
  }, []);

  const observeOracle = useCallback(
    ({ state, token }) => {
      if (!token) return;
      const dayBucket = makeDayBucket();
      const key = [
        dayBucket,
        path,
        state,
        stillnessToBand(stillness),
        watcherState,
        regionToBand(currentLocation),
        depthFromIndex(interactionIndexRef.current),
      ].join("|");
      oracleWeatherRef.current[key] = (oracleWeatherRef.current[key] ?? 0) + 1;
    },
    [currentLocation, path, stillness, watcherState]
  );

  useEffect(() => {
    const flush = async () => {
      const entries = Object.entries(oracleWeatherRef.current);
      if (!entries.length) return;
      if (isGuest) {
        oracleWeatherRef.current = {};
        return;
      }
      const payload = entries.map(([key, count]) => {
        const [
          dayBucket,
          bucketPath,
          oracleState,
          stillnessBand,
          bucketWatcher,
          regionBand,
          interactionDepth,
        ] = key.split("|");
        return {
          dayBucket,
          path: bucketPath,
          oracleState,
          stillnessBand,
          watcherState: bucketWatcher,
          regionBand,
          interactionDepth,
          count,
        };
      });
      try {
        await fetch("/api/oracle/observations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ entries: payload }),
        });
      } catch (error) {
        console.warn("Oracle observation sync failed", error);
      } finally {
        oracleWeatherRef.current = {};
      }
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("visibilitychange", onHide);
    window.addEventListener("beforeunload", flush);

    return () => {
      window.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("beforeunload", flush);
    };
  }, [isGuest]);

  useEffect(() => {
    if (!activeWhisper || !activeWhisper.token) return;
    if (!activeWhisper.reveal) return;
    if (loggedWhispersRef.current.has(activeWhisper.token)) return;
    loggedWhispersRef.current.add(activeWhisper.token);

    observeOracle({ state: "text", token: activeWhisper.token });
    const entry = journalFromOracle(activeWhisper.translation, "text");
    if (entry) saveJournalEntry(entry);
  }, [activeWhisper, observeOracle]);

  // Handle Water Ripples
const createRipple = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter(r => r.id !== newRipple.id));
    }, 1000);

    if (!playerProfile?.progression?.weatherUnlocked) {
      setPlayerProfile((prev) => ({
        ...prev,
        progression: {
          ...prev.progression,
          weatherUnlocked: true,
          oracleConsultedAt: prev.progression?.oracleConsultedAt || new Date().toISOString()
        }
      }));
      const token = `w-${Date.now()}-attune`;
      setActiveWhisper({
        gibberish: "still...listening...open",
        translation: "The air remembers your name.",
        reveal: true,
        token
      });
    }

    if (Math.random() > 0.7) {
      triggerWhisper();
    }
  };


const triggerWhisper = () => {
  interactionIndexRef.current += 1;
  const token = `w-${Date.now()}-${Math.random()}`;
  const stillnessBand = stillnessToBand(stillness);
  const visitBand = depthFromIndex(interactionIndexRef.current);
  const selection = pickRavelWeeklyResponse(
    {
      path,
      stillness: stillnessBand,
      visit: visitBand,
      watcherState,
      query: currentLocation || path,
    },
    {
      seeder: oracleSource,
      recentIds: recentWhispersRef.current,
      maxRecent: 6,
    }
  );

  const gibberish = selection.gibberish || selection.title || selection.text || '...';
  const translation = selection.translation || selection.text || '';
  const locationKey = selection.locationKey || null;

  setActiveWhisper({
    gibberish,
    translation,
    locationKey,
    echo: selection.echo,
    reveal: false,
    token,
  });

  recentWhispersRef.current = [
    selection.id,
    ...recentWhispersRef.current,
  ].filter(Boolean).slice(0, 8);

  setTimeout(() => {
    setActiveWhisper((prev) => (prev ? { ...prev, reveal: true } : null));

    if (locationKey && LOCATION_ENTRIES[locationKey]) {
      setModalEntry({
        title: LOCATION_ENTRIES[locationKey].title,
        locationLabel: LOCATION_ENTRIES[locationKey].locationLabel,
        body: LOCATION_ENTRIES[locationKey].body,
        hint: LOCATION_ENTRIES[locationKey].hint,
        gibberish,
      });
      setModalOpen(true);
    }
  }, 1500);
};

  const harvestMushroom = (e, m) => {
    e.stopPropagation();
    if (harvested.includes(m.id)) return;
    setSelectedMushroom(m.id);
    setHarvested([...harvested, m.id]);

    setModalEntry({
      title: `Harvested — ${m.type}`,
      locationLabel: "Oracle Pool Rim",
      gibberish: "spore...wind...flesh...change",
      body: m.desc,
      hint: "Keep it. Use it when the map goes quiet.",
    });
    setModalOpen(true);
  };

  const openMedicinal = (item) => {
    setModalEntry({
      title: item.tethysName,
      locationLabel: "Ravel’s Toolkit",
      gibberish: "ash...soak...heat...stillness",
      body: item.oracleNotes,
      hint: `Prep: ${item.preparation.method.join(' → ')}`
    });
    setMedicinalOpen(true);
    setPrepStage(item.preparation.method[0]);
    setPrepWarning(null);
    setPrepInference(null);
  };

  const confirmPreparation = (item) => {
    if (!prepStage || !item?.preparation?.method?.length) return;
    const required = item.preparation.method;
    const isCorrect = prepStage === required[required.length - 1];
    const pathId = playerProfile?.path?.primary || 'wild';
    const useKey = `medicinal_${item.id}`;
    const priorUses = playerProfile?.history?.[useKey] || 0;
    setPlayerProfile((prev) => ({
      ...prev,
      history: {
        ...(prev.history || {}),
        [useKey]: priorUses + 1
      }
    }));
    if (isCorrect) {
      setPrepInference({
        type: 'success',
        text: 'Sequence holds. The remedy will bind without backlash.'
      });
      setPrepWarning(null);
      if (priorUses >= 2) {
        applyStatus?.(`overconfidence_${item.id}`, {
          type: 'overconfidence',
          note: 'Your body learned faster than you did.'
        });
      }
      if (pathId === 'sky-city') {
        applyStatus?.(`ledger_corruption_${item.id}`, {
          type: 'ledger_corruption',
          note: 'The page was accurate. The body was not.'
        });
      }
      return;
    }
    const risk = item.preparation.riskIfIncorrect?.[0] || 'unstable reaction';
    setPrepWarning(`Risk: ${risk}.`);
    setPrepInference({
      type: 'failure',
      text: 'Sequence broken. The body rejects the memory.'
    });
    applyStatus?.(`sequence_violation_${item.id}`, {
      type: 'sequence_violation',
      note: `It helped. Then it stayed. (${risk})`
    });
  };



 

  return (
    <div
      className={`oracle-shell oracle-pool gpu-layer relative w-full h-[600px] rounded-2xl overflow-hidden border border-emerald-900/50 shadow-[0_0_100px_rgba(45,212,191,0.1)] bg-[#0f172a] group cursor-none ${uiState ? `oracle--${uiState}` : ""} ${activeWhisper?.echo ? `oracle-echo--${activeWhisper.echo}` : ""}`}
      style={{
        "--oracle-speed": oracleSpeed,
        "--oracle-opacity-mult": oracleOpacity,
        "--oracle-growth": growthIntensity,
      }}
    >
      <OracleModal
        open={modalOpen || medicinalOpen}
        onClose={() => {
          setModalOpen(false);
          setMedicinalOpen(false);
          setPrepStage(null);
          setPrepWarning(null);
          setPrepInference(null);
        }}
        entry={modalEntry}
      />

      <div className="oracle-rim pointer-events-none" aria-hidden="true" />
      <div className="oracle-growth pointer-events-none" aria-hidden="true" />

      {/* 1. THE POOL SURFACE */}
      <div 
        ref={containerRef}
        onClick={createRipple}
        className="oracle-surface gpu-layer absolute inset-0 z-10 opacity-80"
        style={{
          background: 'radial-gradient(circle at center, #1e293b 0%, #020617 80%)',
        }}
      >
        {/* Ripples */}
        {ripples.map(r => (
          <div 
            key={r.id}
            className="absolute rounded-full border-2 border-teal-500/30 animate-ping"
            style={{
              left: r.x, top: r.y, width: '20px', height: '20px',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* 2. THE ROOTS (SVG Overlay) */}
      <svg className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay">
        <path d="M0,0 Q100,200 200,0 T400,0" stroke="#451a03" strokeWidth="20" fill="none" />
        <path d="M-50,600 Q150,400 300,600 T600,600" stroke="#451a03" strokeWidth="35" fill="none" />
        <path d="M800,100 Q700,300 900,500" stroke="#2e1065" strokeWidth="15" fill="none" />
      </svg>

      {/* 3. THE MUSHROOMS */}
      {MUSHROOMS.map(m => (
        !harvested.includes(m.id) && (
          <button
            key={m.id}
            onClick={(e) => harvestMushroom(e, m)}
            className={`oracle-mushroom gpu-layer absolute z-20 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center hover:shadow-[0_0_15px_#a855f7] ${selectedMushroom === m.id ? "oracle-mushroom--selected" : ""} ${selectedMushroom && selectedMushroom !== m.id ? "oracle-mushroom--background" : ""}`}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <Sparkles size={12} className="text-purple-300 animate-pulse" />
          </button>
        )
      ))}

      {/* 4. THE WHISPER UI (Ravel's Translation) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 text-center w-full max-w-lg pointer-events-none">
        {activeWhisper ? (
          <div className="bg-black/60 backdrop-blur-md p-6 rounded-lg border-t border-teal-500/30 animate-in slide-in-from-bottom-4">
            <p className="text-sm mb-2 text-emerald-200 font-mono tracking-[0.15em] uppercase">
              {activeWhisper.reveal ? "..." : activeWhisper.gibberish}
            </p>
            {activeWhisper.reveal && (
              <div className="oracle-text animate-in fade-in duration-500">
                <p className="text-xl text-amber-200 font-serif italic">
                  "{activeWhisper.translation}"
                </p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-500 mt-2 flex items-center justify-center gap-2">
                  <Eye size={12} /> Ravel Translates
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-teal-900/50 text-xs uppercase tracking-[0.3em] animate-pulse">
            The roots are listening...
          </div>
        )}
      </div>

      <div className="absolute top-4 left-4 z-30 pointer-events-auto">
        <div className="bg-black/70 border border-emerald-900/40 rounded-lg p-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-2">Ravel’s Toolkit</p>
          <div className="space-y-2">
            {medicinalItems.slice(0, 3).map((item) => (
              <div key={item.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => openMedicinal(item)}
                  className="w-full text-left text-[11px] text-emerald-200 hover:text-emerald-100"
                >
                  {item.tethysName}
                </button>
                {medicinalOpen && modalEntry?.title === item.tethysName && (
                  <div className="text-[10px] text-stone-400">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.preparation.method.map((step) => (
                        <button
                          key={step}
                          type="button"
                          onClick={() => setPrepStage(step)}
                          className={`px-2 py-0.5 border rounded ${
                            prepStage === step
                              ? 'border-emerald-400 text-emerald-200'
                              : 'border-stone-700 text-stone-400'
                          }`}
                        >
                          {step.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => confirmPreparation(item)}
                      className="mt-2 px-2 py-1 text-[9px] uppercase tracking-[0.25em] border border-emerald-500/50 text-emerald-200"
                    >
                      Confirm Sequence
                    </button>
                    {prepWarning && (
                      <div className="mt-2 text-[10px] text-rose-400">{prepWarning}</div>
                    )}
                    {prepInference && (
                      <div
                        className={`mt-2 text-[10px] ${
                          prepInference.type === 'success' ? 'text-emerald-300' : 'text-amber-300'
                        }`}
                      >
                        {prepInference.text}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {medicineSeeds.length > 0 && (
          <div className="mt-3 bg-black/70 border border-emerald-900/40 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-2">Field Medicine</p>
            <div className="space-y-2 text-[10px] text-stone-400">
              {medicineSeeds.map((seed) => (
                <div key={seed.id} className="border-l border-emerald-900/40 pl-2">
                  {seed.text}
                  {seed.source ? (
                    <div className="mt-1 text-[9px] uppercase tracking-[0.25em] text-emerald-600">
                      Source: {formatSourceLabel(sourceIndex.get(seed.source) || seed.source)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default OraclePool;
// World of Tethys || D.C. Barletta
