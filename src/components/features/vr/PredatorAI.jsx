'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const STATE = {
  PATROL: 'PATROL',
  ALERT: 'ALERT',
  HUNT: 'HUNT',
  RETREAT: 'RETREAT',
  FRENZY: 'FRENZY'
};

function getRules(type, isNight, isStorming) {
  const isAerial = type === 'Aerial';
  const isMarine = type === 'Marine';
  const isAmbush = type === 'Ambush';
  const huntWindow = isAerial ? !isNight && !isStorming : isMarine ? isNight : !isStorming;
  const baseDetect = isAerial ? 150 : isMarine ? 60 : 35;
  return { isAerial, isMarine, isAmbush, huntWindow, baseDetect };
}

export default function PredatorAI({
  type = 'Aerial',
  startPos = [0, 10, 0],
  telemetry,
  playerPos,
  exposureLevel = 0,
  frenzy = false
}) {
  const meshRef = useRef(null);
  const [state, setState] = useState(STATE.PATROL);
  const { clock } = useThree();
  const isNight = telemetry?.time?.isNocturnal ?? true;
  const isStorming = telemetry?.weather?.main?.toLowerCase?.() === 'storm';
  const rules = useMemo(() => getRules(type, isNight, isStorming), [type, isNight, isStorming]);

  useFrame((_, delta) => {
    if (!meshRef.current || !playerPos) return;

    const pos = meshRef.current.position;
    const distToPlayer = pos.distanceTo(playerPos);

    if (frenzy && !rules.isAerial) {
      if (state !== STATE.FRENZY) setState(STATE.FRENZY);
    } else if (!rules.huntWindow && state !== STATE.RETREAT) {
      setState(STATE.RETREAT);
    } else if (rules.huntWindow && state === STATE.RETREAT) {
      setState(STATE.PATROL);
    }

    switch (state) {
      case STATE.PATROL: {
        const t = clock.elapsedTime * 0.35;
        pos.x = startPos[0] + Math.sin(t) * 8;
        pos.z = startPos[2] + Math.cos(t) * 8;
        if (rules.isAerial) pos.y = startPos[1] + Math.sin(t * 0.4) * 2.5;
        if (distToPlayer < rules.baseDetect && exposureLevel > 0.45 && rules.huntWindow) {
          setState(STATE.ALERT);
        }
        break;
      }
      case STATE.ALERT: {
        meshRef.current.lookAt(playerPos);
        if (exposureLevel > 0.7 && rules.huntWindow) setState(STATE.HUNT);
        if (exposureLevel < 0.2) setState(STATE.PATROL);
        break;
      }
      case STATE.HUNT: {
        const moveVec = new THREE.Vector3().subVectors(playerPos, pos).normalize();
        const speed = rules.isAerial ? 6.5 : rules.isMarine ? 8 : 4.5;
        pos.addScaledVector(moveVec, speed * delta);
        if (!rules.huntWindow || isStorming) setState(STATE.RETREAT);
        break;
      }
      case STATE.RETREAT: {
        pos.y += (rules.isAerial ? 4 : -3) * delta;
        if (distToPlayer > 200 && rules.huntWindow) setState(STATE.PATROL);
        break;
      }
      case STATE.FRENZY: {
        const moveVec = new THREE.Vector3().subVectors(playerPos, pos).normalize();
        const speed = rules.isMarine ? 9 : 6;
        pos.addScaledVector(moveVec, speed * delta);
        if (!frenzy) setState(STATE.PATROL);
        break;
      }
      default:
        break;
    }
  });

  const color = state === STATE.HUNT || state === STATE.FRENZY ? '#ef4444' : '#334155';
  const emissive = state === STATE.HUNT || state === STATE.FRENZY ? '#ef4444' : '#000000';

  return (
    <group ref={meshRef} position={startPos}>
      <mesh>
        {rules.isAerial ? (
          <coneGeometry args={[1, 4, 3]} />
        ) : (
          <sphereGeometry args={[2, 8, 8]} />
        )}
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}
// World of Tethys || D.C. Barletta
