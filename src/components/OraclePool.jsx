'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Eye } from 'lucide-react';
// Use global styles; whisper text now just uses inline classes
import OracleModal from "@/components/OracleModal";
import TorchCursor from "@/components/ui/torchCursor";
import { useTethys } from "@/context/TethysContext";
import { writeBatch, collection, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import "../../styles/oracle-pool.css";

const WHISPERS_POOL = [
  {
    gibberish: "drip...drop...time...rot",
    translation: "Cambria did not fall. It sank on purpose.",
    locationKey: "cambria",
  },
  {
    gibberish: "0101...kzzt...root...break",
    translation: "The Magma rises from the south. The roots are burning.",
    locationKey: "watcher",
  },
];

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
  if (["watcher_volcano", "watcher_flats", "purgess", "the_ledge"].includes(regionId)) return "near";
  if (["mystic_woods", "sky_city", "cambria_ruins"].includes(regionId)) return "mid";
  return "far";
};

// Static mushroom nodes for the oracle surface
const MUSHROOMS = [
  { id: "m1", x: 22, y: 30, type: "amber" },
  { id: "m2", x: 48, y: 42, type: "violet" },
  { id: "m3", x: 68, y: 28, type: "ghost" },
  { id: "m4", x: 32, y: 62, type: "spore" },
  { id: "m5", x: 58, y: 70, type: "root" },
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
  const { playerProfile, currentLocation, setPlayerProfile } = useTethys();
  const [ripples, setRipples] = useState([]);
  const [activeWhisper, setActiveWhisper] = useState(null);
  const [harvested, setHarvested] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntry, setModalEntry] = useState(null);
  const [selectedMushroom, setSelectedMushroom] = useState(null);
  const containerRef = useRef(null);
  const oracleWeatherRef = useRef({});
  const interactionIndexRef = useRef(0);
  const loggedWhispersRef = useRef(new Set());

  const uiState = activeWhisper ? (activeWhisper.reveal ? "text" : "withheld") : "silence";
  const stillness = playerProfile?.perception?.stillness ?? 0;
  const oracleSpeed = 1 + stillness * 0.8;
  const oracleOpacity = 1 + stillness * 0.15;
  const watcherState = playerProfile?.watcherState ?? "quiet";
  const path = playerProfile?.path?.primary ?? "mystic";

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
      const batch = writeBatch(db);
      entries.forEach(([key, count]) => {
        const [
          dayBucket,
          bucketPath,
          oracleState,
          stillnessBand,
          bucketWatcher,
          regionBand,
          interactionDepth,
        ] = key.split("|");
        const ref = doc(collection(db, "oracle_observations"));
        batch.set(ref, {
          dayBucket,
          path: bucketPath,
          oracleState,
          stillnessBand,
          watcherState: bucketWatcher,
          regionBand,
          interactionDepth,
          count,
        });
      });
      await batch.commit();
      oracleWeatherRef.current = {};
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
  }, []);

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
  const randomMsg = WHISPERS_POOL[Math.floor(Math.random() * WHISPERS_POOL.length)];
  interactionIndexRef.current += 1;
  const token = `w-${Date.now()}-${Math.random()}`;
  setActiveWhisper({ ...randomMsg, reveal: false, token });

  setTimeout(() => {
    setActiveWhisper(prev => prev ? { ...prev, reveal: true } : null);

    // open a modal for location-based whispers
    if (randomMsg.locationKey && LOCATION_ENTRIES[randomMsg.locationKey]) {
      setModalEntry({
        title: LOCATION_ENTRIES[randomMsg.locationKey].title,
        locationLabel: LOCATION_ENTRIES[randomMsg.locationKey].locationLabel,
        body: LOCATION_ENTRIES[randomMsg.locationKey].body,
        hint: LOCATION_ENTRIES[randomMsg.locationKey].hint,
        gibberish: randomMsg.gibberish,
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



 

  return (
    <div
      className={`oracle-shell oracle-pool gpu-layer relative w-full h-[600px] rounded-2xl overflow-hidden border border-emerald-900/50 shadow-[0_0_100px_rgba(45,212,191,0.1)] bg-[#0f172a] group cursor-none ${uiState ? `oracle--${uiState}` : ""}`}
      style={{
        "--oracle-speed": oracleSpeed,
        "--oracle-opacity-mult": oracleOpacity,
      }}
    >
    <TorchCursor enabled={true} />
      <OracleModal open={modalOpen} onClose={() => setModalOpen(false)} entry={modalEntry} />

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

    </div>
  );
};

export default OraclePool;
// World of Tethys || D.C. Barletta
