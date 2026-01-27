'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import * as THREE from 'three';
import { useTethys } from '@/context/TethysContext';
import { TETHYS_CRUCIBLE_MAPPINGS } from '@/data/tethys-crucible';
import BiomeScatter from './BiomeScatter';
import ExplorerRig from './ExplorerRig';
import StoryScatter from './StoryScatter';
import LaminarSurgeController from './LaminarSurgeController';
import TideglassSystem from './TideglassSystem';
import PredatorAI from './PredatorAI';
import KarstDrainSubMap from './KarstDrainSubMap';
import WeepCinematic from './WeepCinematic';

const TERRAIN_SHADER = {
  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#2e2a26') },
    uColorB: { value: new THREE.Color('#4a4036') },
    uRoughness: { value: 0.5 },
    uHeightFactor: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying float vElev;
    uniform float uTime;
    uniform float uHeightFactor;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float n = noise(pos.xy * 2.0 + uTime * 0.05);
      float h = n * uHeightFactor;
      pos.z += h;
      vElev = h;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vElev;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    void main() {
      vec3 color = mix(uColorA, uColorB, vElev + 0.5);
      float scan = sin(vUv.y * 100.0) * 0.05;
      gl_FragColor = vec4(color + scan, 1.0);
    }
  `
};

function resolveBiomeColors(biome) {
  const map = {
    'chalk-ivory': ['#e3dac9', '#ffffff'],
    'ink-black': ['#050505', '#1a0f1f'],
    'ember basalt': ['#1c1917', '#ef4444'],
    'green-grey': ['#2f3e30', '#5c7a60']
  };
  const key = biome?.terrain?.color?.split(',')[0]?.trim();
  return map[key] || ['#1c1917', '#44403c'];
}

const TerrainMesh = forwardRef(function TerrainMesh({ biome }, ref) {
  const mesh = useRef(null);
  const [colorA, colorB] = useMemo(() => resolveBiomeColors(biome), [biome]);
  const heightFactor = biome?.type === 'volcanic sequence' ? 2.5 : 0.8;

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={(node) => {
      mesh.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <shaderMaterial
        args={[TERRAIN_SHADER]}
        uniforms-uColorA-value={new THREE.Color(colorA)}
        uniforms-uColorB-value={new THREE.Color(colorB)}
        uniforms-uHeightFactor-value={heightFactor}
      />
    </mesh>
  );
});

function LootFeed() {
  const [log, setLog] = useState([]);

  useEffect(() => {
    const handleLoot = (event) => {
      const name = event?.detail?.name;
      if (!name) return;
      const id = Date.now();
      setLog((prev) => [...prev, { id, text: `+1 ${name}` }]);
      setTimeout(() => {
        setLog((prev) => prev.filter((entry) => entry.id !== id));
      }, 2000);
    };
    window.addEventListener('tethys:loot', handleLoot);
    return () => window.removeEventListener('tethys:loot', handleLoot);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      <div className="flex flex-col items-center gap-2">
        {log.map((entry) => (
          <div
            key={entry.id}
            className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest animate-out fade-out slide-out-to-top-4 duration-1000 fill-mode-forwards"
          >
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function RainParticles({ intensity = 0.4 }) {
  const pointsRef = useRef(null);
  const count = Math.round(400 + intensity * 900);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 12;
      data[i * 3 + 1] = Math.random() * 6 + 1;
      data[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return data;
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i += 1) {
      const idx = i * 3 + 1;
      array[idx] -= 0.08 + intensity * 0.12;
      if (array[idx] < -0.2) {
        array[idx] = Math.random() * 6 + 1;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8fb3b5" size={0.04} transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}

function PlayerTracker({ onMove }) {
  const { camera } = useThree();
  useFrame(() => {
    onMove(camera.position);
  });
  return null;
}

function ExposureTracker({ playerRef, isNight, isTideglass, onChange }) {
  const lastPos = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(() => {
    if (!playerRef?.current) return;
    const current = playerRef.current;
    const delta = current.distanceTo(lastPos.current);
    lastPos.current.copy(current);

    let exposure = isTideglass ? 0.8 : isNight ? 0.25 : 0.5;
    exposure += Math.min(0.35, delta * 0.6);
    exposure = Math.max(0, Math.min(1, exposure));
    onChange?.(exposure);
  });
  return null;
}

function getTelemetryCacheKey(regionId) {
  return `tethys_atmosphere:${regionId || 'unknown'}`;
}

export default function HoloTerrain({ regionId = null }) {
  const { currentLocation, atmosphereTelemetry, equippedStaff } = useTethys();
  const [scatterCount, setScatterCount] = useState(200);
  const [localTelemetry, setLocalTelemetry] = useState(atmosphereTelemetry);
  const [controlMode, setControlMode] = useState('orbit');
  const terrainRef = useRef(null);
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const [exposureLevel, setExposureLevel] = useState(0.3);

  const biome = useMemo(() => {
    const activeId = regionId || currentLocation;
    if (!activeId) return TETHYS_CRUCIBLE_MAPPINGS[0];
    const direct = TETHYS_CRUCIBLE_MAPPINGS.find((entry) => entry.id === activeId);
    if (direct) return direct;
    const alias = TETHYS_CRUCIBLE_MAPPINGS.find((entry) =>
      entry.aliases?.includes(activeId)
    );
    return alias || TETHYS_CRUCIBLE_MAPPINGS[0];
  }, [currentLocation, regionId]);

  const heightFactor = biome?.type === 'volcanic sequence' ? 2.5 : 0.8;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const lowCores = (navigator.hardwareConcurrency || 8) <= 4;
    const base = biome?.type === 'volcanic sequence' ? 140 : 200;
    const capped = isCoarse ? 80 : lowCores ? 120 : base;
    setScatterCount(Math.min(base, capped));
  }, [biome?.type]);

  useEffect(() => {
    if (atmosphereTelemetry) {
      setLocalTelemetry(atmosphereTelemetry);
      return;
    }
    if (typeof window === 'undefined') return;
    const activeId = regionId || currentLocation;
    const stored = window.sessionStorage.getItem(getTelemetryCacheKey(activeId));
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (!parsed?.telemetry) return;
      const age = Date.now() - (parsed.at || 0);
      if (age > 15 * 60 * 1000) return;
      setLocalTelemetry(parsed.telemetry);
    } catch {
      return;
    }
  }, [atmosphereTelemetry, currentLocation, regionId]);

  const activeRegion = regionId || currentLocation;
  const visibility = localTelemetry?.weather?.visibility ?? 0;
  const isNocturnal = localTelemetry?.time?.isNocturnal;
  const fallbackNight = Math.floor(Date.now() / 120000) % 2 === 1;
  const now = Number(localTelemetry?.weather?.dt || 0);
  const sunrise = Number(localTelemetry?.weather?.sys?.sunrise || 0);
  const sunset = Number(localTelemetry?.weather?.sys?.sunset || 0);
  const sunNight = Boolean(now && sunrise && sunset && (now < sunrise || now > sunset));
  const isNight = typeof isNocturnal === 'boolean' ? isNocturnal : sunNight || fallbackNight;
  const isTideglass = !isNight && visibility > 8000;
  const visibilityTier = isTideglass ? 'HIGH' : 'LOW';
  const exposureRisk = isNight ? 'LOW' : isTideglass ? 'HIGH' : 'MED';

  const weatherMain = localTelemetry?.weather?.weather?.[0]?.main?.toLowerCase() || '';
  const isRaining = Boolean(
    activeRegion &&
      (weatherMain.includes('rain') ||
        weatherMain.includes('storm') ||
        weatherMain.includes('thunder') ||
        weatherMain.includes('drizzle'))
  );
  const rainAmount = Number(localTelemetry?.weather?.rain?.['1h'] || 0);
  const rainIntensity = Math.min(1, Math.max(0.2, rainAmount / 3));
  const veilPressure = Number(localTelemetry?.tethys?.metrics?.veilPressure || 0);
  const isWeep = activeRegion === 'the-weep';
  const fogDensity = activeRegion
    ? Math.min(0.06, Math.max(0.008, 0.008 + ((veilPressure - 980) / 120) * 0.03 + (isWeep ? 0.018 : 0)))
    : 0.01;
  const fogColor = isWeep ? '#0b1b1f' : isNight ? '#070605' : '#2a1f1a';

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-stone-800 relative group bg-black/60">
      <LootFeed />
      <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-emerald-400 uppercase tracking-widest bg-black/60 px-2 py-1 rounded border border-emerald-900/40">
        Terrain Scan: {biome?.lore || 'Unknown Shelf'}
      </div>
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-[10px] uppercase tracking-widest">
        <button
          type="button"
          onClick={() => setControlMode('orbit')}
          className={`px-3 py-1 border ${
            controlMode === 'orbit'
              ? 'border-amber-600/60 text-amber-300 bg-amber-900/20'
              : 'border-stone-700 text-stone-500'
          }`}
        >
          Drone
        </button>
        <button
          type="button"
          onClick={() => setControlMode('walk')}
          className={`px-3 py-1 border ${
            controlMode === 'walk'
              ? 'border-emerald-600/60 text-emerald-300 bg-emerald-900/20'
              : 'border-stone-700 text-stone-500'
          }`}
        >
          Walk
        </button>
      </div>
      <div className="absolute top-16 right-4 z-10 flex flex-col items-end gap-2 text-[10px] uppercase tracking-widest">
        <div className="px-3 py-1 border border-emerald-900/40 bg-black/60 text-emerald-300">
          {isNight ? 'Seedfire Night' : isTideglass ? 'Tideglass Day' : 'Shifted Tide'}
        </div>
        <div className="px-3 py-1 border border-stone-700/60 bg-black/60 text-stone-300">
          Exposure: {exposureRisk}
        </div>
      </div>
      {controlMode === 'walk' && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="bg-black/60 border border-stone-700 px-3 py-2 text-[10px] uppercase tracking-widest text-stone-300">
            Click to Enter · WASD to Move
          </div>
        </div>
      )}
      <Canvas camera={{ position: [0, 5, 5], fov: 50 }}>
        <fogExp2 attach="fog" args={[fogColor, fogDensity]} />
        <TideglassSystem telemetry={localTelemetry} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <PlayerTracker onMove={(pos) => playerPosRef.current.copy(pos)} />
        <ExposureTracker
          playerRef={playerPosRef}
          isNight={isNight}
          isTideglass={isTideglass}
          onChange={setExposureLevel}
        />
        <TerrainMesh biome={biome} ref={terrainRef} />
        <BiomeScatter
          regionId={regionId || currentLocation}
          count={scatterCount}
          heightFactor={heightFactor}
          visibilityTier={visibilityTier}
          isNight={isNight}
        />
        <StoryScatter
          regionId={regionId || currentLocation}
          playerRef={playerPosRef}
          enabled={controlMode === 'walk'}
        />
        <PredatorAI
          type="Aerial"
          startPos={[12, 10, -12]}
          telemetry={localTelemetry}
          playerPos={playerPosRef.current}
          exposureLevel={exposureLevel}
        />
        <PredatorAI
          type="Aerial"
          startPos={[-14, 12, 8]}
          telemetry={localTelemetry}
          playerPos={playerPosRef.current}
          exposureLevel={exposureLevel}
        />
        <PredatorAI
          type="Marine"
          startPos={[0, -4, 14]}
          telemetry={localTelemetry}
          playerPos={playerPosRef.current}
          exposureLevel={exposureLevel}
          frenzy={weatherMain.includes('calm')}
        />
        {(regionId || currentLocation) === 'karst-drains' && <KarstDrainSubMap />}
        {isWeep && (
          <WeepCinematic
            intensity={isNight ? 0.9 : 0.6}
            sprayActive={controlMode === 'walk'}
          />
        )}
        {isRaining && <RainParticles intensity={rainIntensity} />}
        {controlMode === 'orbit' && (
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
          />
        )}
        <ExplorerRig
          enabled={controlMode === 'walk'}
          startPosition={[0, 2, 4]}
          terrainRef={terrainRef}
          shake={isWeep && controlMode === 'walk'}
          shakeIntensity={isNight ? 0.35 : 0.22}
          enableSurgeShake={isWeep && controlMode === 'walk'}
        />
        <LaminarSurgeController enabled={controlMode === 'walk'} staffData={equippedStaff} />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 z-10 text-[9px] font-mono text-stone-400 flex justify-between uppercase tracking-widest">
        <span>Substrate: {biome?.terrain?.substrate || 'Unknown'}</span>
        <span>Hazards: {(biome?.terrain?.hazards || []).join(' / ') || 'None'}</span>
      </div>
    </div>
  );
}
