'use client';

import { useMemo } from 'react';
import { Float, Text, MeshDistortMaterial } from '@react-three/drei';
import { useTethys } from '@/context/TethysContext';

export default function KarstDrainSubMap() {
  const { syncFrequency, addInventoryItem } = useTethys();
  const effectiveFreq = Number(syncFrequency) || 528;
  const isLaminar = effectiveFreq > 417;

  const handleHarvest = (item) => {
    const added = addInventoryItem?.({
      id: `${item.id}_${Date.now()}`,
      name: item.name,
      type: 'spore',
      rarity: item.rarity,
      lore: item.lore,
      acquiredAt: new Date().toISOString()
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tethys:loot', { detail: { name: added?.name || item.name } }));
    }
  };

  return (
    <group>
      <fog attach="fog" args={['#050505', 1, 15]} />
      <ambientLight intensity={0.02} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#10b981" />

      <KithNeuralNetwork active={!isLaminar} />

      <group position={[0, -2, -5]}>
        <FloatingBotanical
          name="Suture Moss"
          color="#10b981"
          lore="Used for pulse-wraps and basalt-shatter fractures."
          onHarvest={() =>
            handleHarvest({
              id: 'suture_moss',
              name: 'Suture Moss',
              rarity: 'uncommon',
              lore: 'Used for pulse-wraps and basalt-shatter fractures.'
            })
          }
        />
        <FloatingBotanical
          name="Lyco-Spore"
          position={[3, 1, -2]}
          color="#a5f3fc"
          lore="Biological coagulant for internal hemorrhage."
          onHarvest={() =>
            handleHarvest({
              id: 'lyco_spore',
              name: 'Lyco-Spore',
              rarity: 'rare',
              lore: 'Biological coagulant for internal hemorrhage.'
            })
          }
        />
      </group>

      <mesh position={[0, 0, -15]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.1} />
        <Text position={[0, 0, 0.1]} fontSize={0.5} color="#fbbf24">
          LANTERN NOTCH BREACH
        </Text>
      </mesh>

      <group position={[-3.2, 1.8, -6]}>
        <Text fontSize={0.24} color="#a7f3d0">
          Pulse-wrap protocol
        </Text>
        <Text position={[0, -0.4, 0]} fontSize={0.18} color="#86efac">
          Lyco-Spore binds basalt-shatter
        </Text>
        <Text position={[0, -0.8, 0]} fontSize={0.16} color="#5eead4">
          The survivor returns tuned
        </Text>
      </group>
    </group>
  );
}

function KithNeuralNetwork({ active }) {
  const lines = useMemo(
    () =>
      Array.from({ length: 15 }, () => ({
        pos: [Math.random() * 20 - 10, Math.random() * 10 - 5, Math.random() * 20 - 10],
        scale: Math.random() * 0.5 + 0.5
      })),
    []
  );

  return (
    <group opacity={active ? 0.8 : 0.2}>
      {lines.map((l, i) => (
        <Float key={i} position={l.pos} speed={2}>
          <mesh scale={l.scale}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <MeshDistortMaterial
              color="#10b981"
              speed={5}
              distort={0.6}
              emissive="#10b981"
              emissiveIntensity={active ? 2 : 0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function FloatingBotanical({ name, color, position = [0, 0, 0], lore, onHarvest }) {
  return (
    <Float position={position} rotationIntensity={0.5}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onHarvest?.();
          if (lore && typeof window !== 'undefined') {
            window.alert(lore);
          }
        }}
      >
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        <Text position={[0, 0.5, 0]} fontSize={0.2} color={color}>
          {name}
        </Text>
      </mesh>
    </Float>
  );
}
// World of Tethys || D.C. Barletta
