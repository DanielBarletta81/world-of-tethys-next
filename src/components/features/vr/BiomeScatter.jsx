'use client';

import { useMemo, useRef, useLayoutEffect, useState } from 'react';
import * as THREE from 'three';
import { useTethys } from '@/context/TethysContext';
import { TETHYS_CRUCIBLE_MAPPINGS } from '@/data/tethys-crucible';

const TEMP_OBJ = new THREE.Object3D();
const TRANSFORM_CACHE = new Map();

function resolveBiome(regionId) {
  if (!regionId) return TETHYS_CRUCIBLE_MAPPINGS[0];
  const direct = TETHYS_CRUCIBLE_MAPPINGS.find((entry) => entry.id === regionId);
  if (direct) return direct;
  const alias = TETHYS_CRUCIBLE_MAPPINGS.find((entry) =>
    entry.aliases?.includes(regionId)
  );
  return alias || TETHYS_CRUCIBLE_MAPPINGS[0];
}

function buildScatterProfile(biome) {
  const substrate = biome?.terrain?.substrate?.toLowerCase() || '';

  if (substrate.includes('rookery') || substrate.includes('nest')) {
    return {
      geometry: new THREE.ConeGeometry(0.22, 3.2, 5),
      material: new THREE.MeshStandardMaterial({ color: '#6b4f3a', roughness: 0.7 }),
      scaleBase: [0.7, 1.2, 0.7],
    };
  }

  if (
    substrate.includes('root') ||
    substrate.includes('spore') ||
    substrate.includes('silt') ||
    substrate.includes('rookery') ||
    substrate.includes('nest')
  ) {
    return {
      geometry: new THREE.CylinderGeometry(0.08, 0.18, 2.4, 6),
      material: new THREE.MeshStandardMaterial({ color: '#3f6212', roughness: 0.85 }),
      scaleBase: [1, 1, 1],
    };
  }

  if (
    substrate.includes('ash') ||
    substrate.includes('igneous') ||
    substrate.includes('basalt') ||
    substrate.includes('cinder')
  ) {
    return {
      geometry: new THREE.ConeGeometry(0.45, 2.1, 4),
      material: new THREE.MeshPhysicalMaterial({
        color: '#111111',
        metalness: 0.7,
        roughness: 0.2,
      }),
      scaleBase: [1, 1.4, 1],
    };
  }

  if (substrate.includes('lime') || substrate.includes('calcite')) {
    return {
      geometry: new THREE.SphereGeometry(0.6, 10, 10),
      material: new THREE.MeshStandardMaterial({ color: '#e3dac9', roughness: 0.6 }),
      scaleBase: [1.4, 0.6, 1.4],
    };
  }

  return {
    geometry: new THREE.DodecahedronGeometry(0.7, 0),
    material: new THREE.MeshStandardMaterial({ color: '#44403c', roughness: 0.9 }),
    scaleBase: [1, 0.8, 1],
  };
}

function hash2d(x, z) {
  return Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
}

function noise2d(x, z) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const u = fx * fx * (3 - 2 * fx);
  const v = fz * fz * (3 - 2 * fz);

  const a = hash2d(ix, iz);
  const b = hash2d(ix + 1, iz);
  const c = hash2d(ix, iz + 1);
  const d = hash2d(ix + 1, iz + 1);

  const mix1 = a + (b - a) * u;
  const mix2 = c + (d - c) * u;
  return (mix1 + (mix2 - mix1) * v) % 1;
}

function hashSeed(input = '') {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function resolveLoot(sub) {
  if (sub.includes('rookery') || sub.includes('nest')) {
    return { name: 'Rookery Spur', rarity: 'uncommon' };
  }
  if (sub.includes('root') || sub.includes('spore') || sub.includes('silt')) {
    return { name: 'Frenel Branch', rarity: 'common' };
  }
  if (sub.includes('ash') || sub.includes('igneous') || sub.includes('basalt') || sub.includes('cinder')) {
    return { name: 'Rift Obsidian', rarity: 'rare' };
  }
  if (sub.includes('lime') || sub.includes('calcite')) {
    return { name: 'Calcite Shard', rarity: 'common' };
  }
  return { name: 'Watcher Basalt', rarity: 'common' };
}

export default function BiomeScatter({
  regionId,
  count = 180,
  heightFactor = 1,
  visibilityTier = 'LOW',
  isNight = false
}) {
  const meshRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const { addInventoryItem, worldState, markNodeHarvested } = useTethys();
  const biome = useMemo(() => resolveBiome(regionId), [regionId]);
  const profile = useMemo(() => buildScatterProfile(biome), [biome]);
  const loot = useMemo(
    () => resolveLoot((biome?.terrain?.substrate || '').toLowerCase()),
    [biome]
  );
  const substrate = (biome?.terrain?.substrate || '').toLowerCase();
  const material = useMemo(() => {
    const base = profile.material.clone();
    if (isNight && (substrate.includes('root') || substrate.includes('spore') || substrate.includes('silt'))) {
      base.emissive = new THREE.Color('#22d3ee');
      base.emissiveIntensity = 0.45;
      base.color = new THREE.Color('#1f2937');
    } else if (visibilityTier === 'HIGH') {
      base.emissiveIntensity = 0.1;
    }
    return base;
  }, [profile.material, isNight, substrate, visibilityTier]);
  const activeRegion = regionId || biome?.id || 'unknown';
  const [harvestedIds, setHarvestedIds] = useState(
    () => new Set(worldState?.[activeRegion] || [])
  );

  const transforms = useMemo(() => {
    const cacheKey = `${activeRegion}:${count}:${heightFactor}`;
    const cached = TRANSFORM_CACHE.get(cacheKey);
    if (cached) return cached;
    const seed = hashSeed(activeRegion || 'tethys');
    const rand = mulberry32(seed);
    const next = Array.from({ length: count }, () => {
      const x = (rand() - 0.5) * 18;
      const z = (rand() - 0.5) * 18;
      const n = noise2d(x * 2.0, z * 2.0);
      return {
        x,
        z,
        y: n * heightFactor + rand() * 0.08,
        rot: [(rand() - 0.5) * 0.2, rand() * Math.PI * 2, (rand() - 0.5) * 0.2],
        scale: rand() * 0.5 + 0.5
      };
    });
    TRANSFORM_CACHE.set(cacheKey, next);
    return next;
  }, [activeRegion, count, heightFactor]);

  useLayoutEffect(() => {
    setHarvestedIds(new Set(worldState?.[activeRegion] || []));
  }, [activeRegion, worldState]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    transforms.forEach((entry, i) => {
      if (harvestedIds.has(i)) {
        TEMP_OBJ.scale.set(0, 0, 0);
      } else {
        const s = entry.scale * (hoveredId === i ? 1.2 : 1.0);
        TEMP_OBJ.scale.set(
          s * profile.scaleBase[0],
          s * profile.scaleBase[1],
          s * profile.scaleBase[2]
        );
      }
      TEMP_OBJ.position.set(entry.x, entry.y, entry.z);
      TEMP_OBJ.rotation.set(entry.rot[0], entry.rot[1], entry.rot[2]);
      TEMP_OBJ.updateMatrix();
      meshRef.current.setMatrixAt(i, TEMP_OBJ.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [harvestedIds, hoveredId, profile.scaleBase, transforms]);

  const handleHarvest = (event) => {
    event.stopPropagation();
    if (event.instanceId == null) return;
    if (harvestedIds.has(event.instanceId)) return;

    const item = addInventoryItem({
      id: `${loot.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      name: loot.name,
      type: 'material',
      rarity: loot.rarity,
      region: activeRegion,
      acquiredAt: new Date().toISOString()
    });
    markNodeHarvested(activeRegion, event.instanceId);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tethys:loot', { detail: { name: item.name } }));
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[profile.geometry, material, count]}
      castShadow
      receiveShadow
      onPointerMove={(event) => {
        event.stopPropagation();
        if (event.instanceId == null) return;
        setHoveredId(event.instanceId);
      }}
      onPointerOut={() => setHoveredId(null)}
      onClick={handleHarvest}
    />
  );
}
