'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTethys } from '@/context/TethysContext';

export default function LaminarSurgeController({ staffData, enabled = false }) {
  const { camera } = useThree();
  const { syncFrequency } = useTethys();
  const surgeRef = useRef(null);
  const [isCharging, setIsCharging] = useState(false);
  const chargeRef = useRef(0);

  const surgeStats = useMemo(() => {
    const basePower = staffData?.stats?.power || 10;
    const frequency = Number(syncFrequency) || 528;
    const isLaminar = frequency >= 500;
    return {
      range: basePower * 0.5,
      force: isLaminar ? basePower * 2 : basePower * 0.6,
      color: isLaminar ? '#22d3ee' : '#ef4444',
      isLaminar
    };
  }, [staffData?.stats?.power, syncFrequency]);

  const triggerSurge = useCallback(() => {
    if (!enabled) return;
    const frequency = Number(syncFrequency) || 528;
    if (frequency < 417) return;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    try {
      window.dispatchEvent(
        new CustomEvent('tethys:surge', {
          detail: {
            power: surgeStats.force,
            origin: camera.position.clone(),
            dir: direction.clone()
          }
        })
      );
    } catch (error) {
      console.error('[vr] Failed to dispatch tethys:surge event:', error);
    }
  }, [enabled, syncFrequency, camera, surgeStats.force]);

  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = () => setIsCharging(true);
    const onPointerUp = () => {
      if (!isCharging) return;
      setIsCharging(false);
      triggerSurge();
    };
    const onKeyDown = (event) => {
      if (event.code === 'KeyE') {
        setIsCharging(true);
      }
    };
    const onKeyUp = (event) => {
      if (event.code === 'KeyE') {
        setIsCharging(false);
        triggerSurge();
      }
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled, isCharging, triggerSurge]);

  useFrame((state, delta) => {
    if (!surgeRef.current) return;
    const targetCharge = isCharging ? 1 : 0;
    chargeRef.current += (targetCharge - chargeRef.current) * Math.min(1, delta * 6);
    const charge = chargeRef.current;

    const offset = new THREE.Vector3(0.5, -0.4, -1.6).applyQuaternion(camera.quaternion);
    surgeRef.current.position.copy(camera.position).add(offset);
    surgeRef.current.quaternion.copy(camera.quaternion);
    surgeRef.current.scale.setScalar(0.05 + charge * 0.95);
    surgeRef.current.rotation.z += delta * (isCharging ? 2.5 : 0.5);
  });

  if (!enabled) return null;

  return (
    <mesh ref={surgeRef}>
      <coneGeometry args={[0.5, 2, 24, 1, true]} />
      <meshStandardMaterial
        color={surgeStats.color}
        transparent
        opacity={0.25}
        wireframe
      />
    </mesh>
  );
}
// World of Tethys || D.C. Barletta
