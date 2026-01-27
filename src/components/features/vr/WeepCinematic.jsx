'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WATER_SHADER = {
  uniforms: {
    uTime: { value: 0 },
    uGlow: { value: 0.6 }
  },
  vertexShader: `
    varying vec2 vUv;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin((uv.y * 10.0) + uTime * 1.5) * 0.05;
      pos.x += sin((uv.y * 6.0) + uTime * 1.1) * 0.02;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uGlow;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      float flow = sin((vUv.y * 12.0) - uTime * 2.4);
      float streak = smoothstep(0.2, 0.8, vUv.y + flow * 0.1);
      float noise = hash(vUv * 60.0 + uTime * 0.2) * 0.12;
      float alpha = (0.3 + streak * 0.5 + noise) * uGlow;
      vec3 color = mix(vec3(0.05, 0.1, 0.12), vec3(0.12, 0.55, 0.75), streak);
      gl_FragColor = vec4(color, alpha);
    }
  `
};

function buildMistParticles(count = 1200) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = Math.random() * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  return positions;
}

function buildSprayParticles(count = 800) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 4;
    positions[i * 3 + 2] = -Math.random() * 6;
  }
  return positions;
}

export default function WeepCinematic({ intensity = 0.7, sprayActive = false }) {
  const waterRef = useRef(null);
  const mistRef = useRef(null);
  const sprayRef = useRef(null);
  const mistPositions = useMemo(() => buildMistParticles(), []);
  const sprayPositions = useMemo(() => buildSprayParticles(800), []);

  useFrame((state, delta) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      waterRef.current.material.uniforms.uGlow.value = intensity;
    }
    if (mistRef.current) {
      mistRef.current.rotation.y += delta * 0.05;
    }
    if (sprayRef.current) {
      sprayRef.current.rotation.y -= delta * 0.08;
    }
  });

  return (
    <group position={[0, 1.5, -6]}>
      <mesh ref={waterRef}>
        <planeGeometry args={[12, 7, 32, 32]} />
        <shaderMaterial
          args={[WATER_SHADER]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, -2.5, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#0b1b1f" transparent opacity={0.4} />
      </mesh>
      <points ref={mistRef} position={[0, -1.5, -2]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[mistPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8fe3f5" size={0.08} transparent opacity={0.3} />
      </points>
      {sprayActive && (
        <points ref={sprayRef} position={[0, -0.5, -2.5]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[sprayPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#d1f5ff" size={0.06} transparent opacity={0.45} />
        </points>
      )}
    </group>
  );
}
// World of Tethys || D.C. Barletta
