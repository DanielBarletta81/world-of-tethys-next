'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3, Raycaster } from 'three';
import { useTethys } from '@/context/TethysContext';

const WALK_SPEED = 4.0;
const SPRINT_MULTIPLIER = 1.6;
const GRAVITY = 15.0;
const JUMP_FORCE = 6.0;
const MAX_SLOPE_DEG = 35;
const STEP_HEIGHT = 0.6;

export default function ExplorerRig({
  startPosition = [0, 2, 0],
  enabled = false,
  terrainRef = null,
  shake = false,
  shakeIntensity = 0.15,
  enableSurgeShake = false
}) {
  const { camera } = useThree();
  const { stats } = useTethys();
  const controlsRef = useRef();
  const velocity = useRef(new Vector3(0, 0, 0));
  const isGrounded = useRef(true);
  const raycasterRef = useRef(new Raycaster());
  const groundRef = useRef({ y: 1.7, normal: new Vector3(0, 1, 0) });
  const shakeOffsetRef = useRef(new Vector3(0, 0, 0));
  const surgePulseRef = useRef({ until: 0, intensity: 0 });
  const input = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false
  });

  useEffect(() => {
    if (!enabled) return;
    camera.position.set(startPosition[0], startPosition[1], startPosition[2]);
  }, [enabled, camera, startPosition]);

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
          input.current.forward = true;
          break;
        case 'KeyS':
          input.current.backward = true;
          break;
        case 'KeyA':
          input.current.left = true;
          break;
        case 'KeyD':
          input.current.right = true;
          break;
        case 'Space':
          input.current.jump = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          input.current.sprint = true;
          break;
        default:
          break;
      }
    };
    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
          input.current.forward = false;
          break;
        case 'KeyS':
          input.current.backward = false;
          break;
        case 'KeyA':
          input.current.left = false;
          break;
        case 'KeyD':
          input.current.right = false;
          break;
        case 'Space':
          input.current.jump = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          input.current.sprint = false;
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled]);

  useFrame((state, delta) => {
    if (!enabled) return;
    if (!controlsRef.current?.isLocked) return;

    const igzier = Number(stats?.igzier || stats?.survival || 0);
    const baseSpeed = WALK_SPEED + igzier * 0.05;
    const speed = input.current.sprint ? baseSpeed * SPRINT_MULTIPLIER : baseSpeed;

    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    const moveVector = new Vector3(0, 0, 0);
    if (input.current.forward) moveVector.add(forward);
    if (input.current.backward) moveVector.sub(forward);
    if (input.current.right) moveVector.add(right);
    if (input.current.left) moveVector.sub(right);
    let allowMove = true;
    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(speed * delta);

      if (terrainRef?.current) {
        const testPos = camera.position.clone().add(new Vector3(moveVector.x, 0, moveVector.z));
        const rayOrigin = testPos.clone();
        rayOrigin.y += 2.0;
        const rayDirection = new Vector3(0, -1, 0);
        raycasterRef.current.set(rayOrigin, rayDirection);
        const hits = raycasterRef.current.intersectObject(terrainRef.current, true);
        if (hits.length > 0) {
          const hit = hits[0];
          const groundY = hit.point.y + floorHeight;
          const slopeCos = hit.face?.normal?.dot(new Vector3(0, 1, 0)) ?? 1;
          const maxSlopeCos = Math.cos((MAX_SLOPE_DEG * Math.PI) / 180);
          const heightDelta = groundY - groundRef.current.y;

          if (slopeCos < maxSlopeCos) {
            allowMove = false;
          } else if (heightDelta > STEP_HEIGHT) {
            allowMove = false;
          } else {
            groundRef.current = {
              y: groundY,
              normal: hit.face?.normal?.clone?.() || new Vector3(0, 1, 0)
            };
          }
        }
      }

      if (allowMove) {
        camera.position.x += moveVector.x;
        camera.position.z += moveVector.z;
      }
    }

    if (isGrounded.current) {
      velocity.current.y = 0;
      if (input.current.jump) {
        velocity.current.y = JUMP_FORCE;
        isGrounded.current = false;
      }
    } else {
      velocity.current.y -= GRAVITY * delta;
    }

    camera.position.y += velocity.current.y * delta;

    const floorHeight = 1.7;
    if (terrainRef?.current) {
      const rayOrigin = camera.position.clone();
      rayOrigin.y += 2.0;
      const rayDirection = new Vector3(0, -1, 0);
      raycasterRef.current.set(rayOrigin, rayDirection);
      const hits = raycasterRef.current.intersectObject(terrainRef.current, true);
      if (hits.length > 0) {
        const groundY = hits[0].point.y + floorHeight;
        if (camera.position.y < groundY) {
          camera.position.y = groundY;
          isGrounded.current = true;
        }
        groundRef.current = {
          y: groundY,
          normal: hits[0].face?.normal?.clone?.() || new Vector3(0, 1, 0)
        };
        return;
      }
    }

    if (camera.position.y < floorHeight) {
      camera.position.y = floorHeight;
      isGrounded.current = true;
    }

    const now = performance.now();
    const surgeActive = enableSurgeShake && now < surgePulseRef.current.until;
    const surgeFalloff = surgeActive
      ? 1 - (surgePulseRef.current.until - now) / 400
      : 0;
    const pulseBoost = surgeActive ? surgePulseRef.current.intensity * (1 - surgeFalloff) : 0;
    const totalShake = shake || surgeActive;

    if (totalShake) {
      camera.position.sub(shakeOffsetRef.current);
      const t = state.clock.getElapsedTime();
      const wobble = (shakeIntensity + pulseBoost) * 0.02;
      const next = new Vector3(
        Math.sin(t * 9.0) * wobble,
        Math.sin(t * 14.0) * wobble * 0.6,
        Math.cos(t * 11.0) * wobble
      );
      shakeOffsetRef.current.copy(next);
      camera.position.add(next);
    } else if (shakeOffsetRef.current.lengthSq() > 0) {
      camera.position.sub(shakeOffsetRef.current);
      shakeOffsetRef.current.set(0, 0, 0);
    }
  });

  useEffect(() => {
    if (!enableSurgeShake) return;
    const handleSurge = (event) => {
      const power = Number(event?.detail?.power || 0);
      const intensity = Math.min(0.6, Math.max(0.15, power / 60));
      surgePulseRef.current = {
        until: performance.now() + 400,
        intensity
      };
    };
    window.addEventListener('tethys:surge', handleSurge);
    return () => window.removeEventListener('tethys:surge', handleSurge);
  }, [enableSurgeShake]);

  if (!enabled) return null;

  return <PointerLockControls ref={controlsRef} />;
}
