'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Float,
  ContactShadows,
  OrbitControls,
  Html,
  useGLTF
} from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTethys } from '@/context/TethysContext';
import { deriveStaffPhenotype } from '@/lib/staff-phenotype';

function StaffModel({ phenotype }) {
  const meshRef = useRef();
  const { nodes } = useGLTF('/models/staff_base.glb', true);

  const glowColor = useMemo(
    () => new THREE.Color(phenotype.auraColor || '#00ffff'),
    [phenotype.auraColor]
  );
  const woodColor = useMemo(
    () => new THREE.Color(phenotype.woodDark || '#5c4033'),
    [phenotype.woodDark]
  );
  const fallbackCoreGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.06, 0.14, 2.6, 18, 24, true);
    const position = geometry.attributes.position;
    const temp = new THREE.Vector3();
    const twistAmount = 0.35;
    const noiseScale = 0.08;

    for (let i = 0; i < position.count; i += 1) {
      temp.fromBufferAttribute(position, i);
      const t = (temp.y + 1.3) / 2.6;
      const angle = t * Math.PI * 2 * twistAmount;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      const x = temp.x * cos - temp.z * sin;
      const z = temp.x * sin + temp.z * cos;
      const wobble = (Math.sin(t * 12.0 + temp.x * 4.0) * noiseScale);
      temp.x = x + wobble;
      temp.z = z + wobble * 0.6;
      position.setXYZ(i, temp.x, temp.y, temp.z);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      const warpIntensity = phenotype.warp || 0;
      const pulse = 1 + Math.sin(t * 2) * (warpIntensity * 0.02);
      meshRef.current.scale.setScalar(pulse);
    }
  });

  const hasCore = Boolean(nodes?.Staff_Core?.geometry);
  const hasApex = Boolean(nodes?.Staff_Apex?.geometry);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group dispose={null} ref={meshRef}>
        {hasCore ? (
          <mesh castShadow receiveShadow geometry={nodes.Staff_Core.geometry}>
            <meshStandardMaterial
              color={woodColor}
              roughness={1 - (phenotype.wetness ?? 0.5)}
              metalness={0.2}
              envMapIntensity={1.5}
            />
          </mesh>
        ) : (
          <mesh castShadow receiveShadow geometry={fallbackCoreGeometry}>
            <meshStandardMaterial
              color={woodColor}
              roughness={1 - (phenotype.wetness ?? 0.5)}
              metalness={0.15}
              envMapIntensity={1.2}
            />
          </mesh>
        )}
        {hasApex ? (
          <mesh geometry={nodes.Staff_Apex.geometry}>
            <meshPhysicalMaterial
              color={glowColor}
              emissive={glowColor}
              emissiveIntensity={(phenotype.glowBoost || 0) * 5 + 0.5}
              transmission={0.6}
              thickness={2}
              roughness={0.1}
            />
          </mesh>
        ) : (
          <mesh position={[0, 1.2, 0]} geometry={new THREE.IcosahedronGeometry(0.18, 0)}>
            <meshPhysicalMaterial
              color={glowColor}
              emissive={glowColor}
              emissiveIntensity={(phenotype.glowBoost || 0) * 5 + 0.5}
              transmission={0.6}
              thickness={1.4}
              roughness={0.15}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

export default function ArtifactViewer() {
  const { playerProfile } = useTethys();

  const phenotype = useMemo(
    () =>
      deriveStaffPhenotype({
        dna: playerProfile?.dna || {},
        pathMode: playerProfile?.path?.primary || 'wild',
        progress: playerProfile?.progress || {},
        epigenetics: playerProfile?.dna?.epigenetics || null
      }),
    [playerProfile]
  );

  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-[#0f0b09] to-[#050403] rounded-xl overflow-hidden border border-stone-800 shadow-2xl relative group">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="font-mono text-[10px] text-cyan-500 uppercase tracking-widest bg-black/60 px-2 py-1 rounded border border-cyan-900/30 backdrop-blur-md">
          VR Link: Active
        </div>
        <div className="mt-2 text-[10px] text-stone-500 font-mono">
          Phenotype ID: {phenotype.signature || '000'}
        </div>
      </div>
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense
          fallback={
            <Html center>
              <span className="text-cyan-500 font-mono text-xs animate-pulse">
                LOADING ASSET...
              </span>
            </Html>
          }
        >
          <ambientLight intensity={0.4} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Environment preset={phenotype.variant === 'etched' ? 'city' : 'forest'} />
          <StaffModel phenotype={phenotype} />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={2}
            maxDistance={6}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-sm border-t border-stone-800 flex justify-between items-end text-xs font-mono text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div>
          <div className="uppercase tracking-widest text-stone-600 mb-1">Material Analysis</div>
          <div className="flex gap-4">
            <span>Wetness: {Math.round((phenotype.wetness || 0) * 100)}%</span>
            <span style={{ color: phenotype.auraColor }}>
              Aura: {phenotype.glowBoost > 0 ? 'High' : 'Standard'}
            </span>
            <span>Warp: {Number(phenotype.warp || 0).toFixed(2)}</span>
          </div>
        </div>
        <div className="text-[10px] text-stone-600">LMB: Rotate • Scroll: Zoom</div>
      </div>
    </div>
  );
}

useGLTF.preload('/models/staff_base.glb');
