'use client';

import dynamic from 'next/dynamic';

const KithOracle = dynamic(() => import('@/components/KithOracle'), { ssr: false });
const OraclePool = dynamic(() => import('@/components/OraclePool'), { ssr: false });
const FungalProxyPanel = dynamic(() => import('@/components/FungalProxyPanel'), { ssr: false });
const MythicCard = dynamic(() => import('@/components/MythicCard'), { ssr: false });

const MYTHICS = [
  { name: 'Prime Signal', symbol: 'PSI', trait: 'Ignited the Cambrian wave; a harmonic that still rings.' },
  { name: 'Luminous Chorus', symbol: 'STAR', trait: 'Crown of lights over the Weep; gifted crest code.' },
  { name: 'Verdant Pulse', symbol: 'BLOOM', trait: 'Mycelial intelligence whispering crop patterns.' }
];

export default function MysticsClient() {
  return (
    <>
      <div style={{ marginTop: '2rem' }}>
        <OraclePool />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <KithOracle />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <FungalProxyPanel />
      </div>
      <div style={{ marginTop: '2rem' }} className="mythic-grid">
        {MYTHICS.map((m) => (
          <MythicCard key={m.name} entity={m} />
        ))}
      </div>
    </>
  );
}
