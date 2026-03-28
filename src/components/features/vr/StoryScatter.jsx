'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTethys } from '@/context/TethysContext';
import { ARCHIVE_DOCUMENTS } from '@/data/archive-documents.js';
import cdn from '@/lib/cdn';

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

function getRegionDocs(regionId) {
  if (!regionId) return [];
  return ARCHIVE_DOCUMENTS.filter((doc) => doc.db?.regionIds?.includes(regionId)).slice(0, 5);
}

export default function StoryScatter({ regionId, playerRef, enabled = true }) {
  const { playerProfile, applyPlayerAction, consumeMedia } = useTethys();
  const [activeEcho, setActiveEcho] = useState(null);
  const whisperRef = useRef(null);
  const lastWhisperRef = useRef({ id: null, at: 0 });

  const echoes = useMemo(() => {
    const docs = getRegionDocs(regionId);
    return docs.map((doc) => {
      const rand = mulberry32(hashSeed(doc.id));
      return {
        ...doc,
        position: [
          (rand() - 0.5) * 16,
          1.4 + rand() * 0.6,
          (rand() - 0.5) * 16
        ]
      };
    });
  }, [regionId]);

  useFrame(() => {
    if (!enabled) return;
    if (!playerRef?.current) return;
    const playerPos = playerRef.current;
    let closest = null;
    let minDist = Infinity;
    echoes.forEach((echo) => {
      const isUnlocked = playerProfile?.history?.mediaConsumed?.includes(echo.id);
      if (isUnlocked) return;
      const dx = playerPos.x - echo.position[0];
      const dz = playerPos.z - echo.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        closest = echo;
      }
    });
    if (minDist < 3) {
      setActiveEcho(closest);
    } else {
      if (activeEcho) setActiveEcho(null);
    }
  });

  useEffect(() => {
    if (!enabled) return;
    if (!activeEcho?.id) return;
    const now = Date.now();
    if (lastWhisperRef.current.id === activeEcho.id && now - lastWhisperRef.current.at < 4000) {
      return;
    }
    if (!whisperRef.current) {
      const audio = new Audio(cdn('/audio/bush-rustle.mp3'));
      audio.volume = 0.25;
      whisperRef.current = audio;
    }
    whisperRef.current.currentTime = 0;
    whisperRef.current.play().catch(() => null);
    lastWhisperRef.current = { id: activeEcho.id, at: now };
  }, [activeEcho, enabled]);

  const handleCollect = async (echo) => {
    await consumeMedia?.(echo.id, 'lore', {});
    applyPlayerAction({
      id: `discover_${echo.id}`,
      type: 'lore_read',
      intensity: 1,
      xp: 25,
      toast: `Echo Decoded: ${echo.title}`
    });
  };

  if (!enabled) return null;

  return (
    <group>
      {echoes.map((echo) => {
        const isTarget = activeEcho?.id === echo.id;
        const isUnlocked = playerProfile?.history?.mediaConsumed?.includes(echo.id);
        if (isUnlocked) return null;
        return (
          <Float key={echo.id} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={echo.position}>
              <mesh
                onClick={(event) => {
                  event.stopPropagation();
                  handleCollect(echo);
                }}
              >
                <octahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial
                  color={isTarget ? '#a5f3fc' : '#78716c'}
                  emissive={isTarget ? '#22d3ee' : '#000000'}
                  emissiveIntensity={isTarget ? 2 : 0}
                  wireframe
                />
              </mesh>

              {isTarget && (
                <Text
                  position={[0, 0.55, 0]}
                  fontSize={0.2}
                  color="#a5f3fc"
                  anchorX="center"
                  anchorY="middle"
                >
                  {echo.subtitle || 'Unknown Signal'}
                  {'\n'}(Click to Decode)
                </Text>
              )}
            </group>
          </Float>
        );
      })}
    </group>
  );
}
