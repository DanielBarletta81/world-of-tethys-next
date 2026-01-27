'use client';

import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function resolveCycle(telemetry, cycleMs) {
  const visibility = telemetry?.weather?.visibility ?? 0;
  const isNocturnal = telemetry?.time?.isNocturnal;
  const clockNight = Math.floor(Date.now() / cycleMs) % 2 === 1;
  const isNight = typeof isNocturnal === 'boolean' ? isNocturnal : clockNight;
  const isTideglass = !isNight && visibility > 8000;
  return { isNight, isTideglass };
}

export default function TideglassSystem({ telemetry, cycleMs = 120000 }) {
  const { scene } = useThree();
  const cycle = useMemo(() => resolveCycle(telemetry, cycleMs), [telemetry, cycleMs]);

  useFrame((state, delta) => {
    const targetBg = cycle.isNight ? new THREE.Color('#020617') : new THREE.Color('#0f172a');
    if (scene.background) {
      scene.background.lerp(targetBg, delta * 0.5);
    } else {
      scene.background = targetBg;
    }

    if (scene.fog) {
      const targetFog = cycle.isTideglass ? 0.002 : cycle.isNight ? 0.015 : 0.008;
      scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, targetFog, delta);
    }
  });

  return (
    <>
      <ambientLight intensity={cycle.isNight ? 0.05 : 0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={cycle.isTideglass ? 1.5 : cycle.isNight ? 0.1 : 0.8}
        color={cycle.isNight ? '#1e293b' : '#fffbeb'}
      />
      {cycle.isNight && <SeedfireParticles count={2000} />}
    </>
  );
}

function SeedfireParticles({ count }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      p.set(
        [(Math.random() - 0.5) * 50, Math.random() * 5, (Math.random() - 0.5) * 50],
        i * 3
      );
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#22d3ee"
        size={0.08}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
// World of Tethys || D.C. Barletta
