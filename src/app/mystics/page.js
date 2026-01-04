import { getPageBySlug } from '@/lib/graphql';
import React from 'react';
import dynamic from 'next/dynamic';
import './modules.mystics.css';

const KithOracle = dynamic(() => import('@/components/KithOracle'), { ssr: false });
const OraclePool = dynamic(() => import('@/components/OraclePool'), { ssr: false });
const FungalProxyPanel = dynamic(() => import('@/components/FungalProxyPanel'), { ssr: false });
const MythicCard = dynamic(() => import('@/components/MythicCard'), { ssr: false });

const MYTHICS = [
  { name: 'Prime Signal', symbol: 'Ψ', trait: 'Ignited the Cambrian wave; a harmonic that still rings.' },
  { name: 'Luminous Chorus', symbol: '✶', trait: 'Crown of lights over the Weep; gifted crest code.' },
  { name: 'Verdant Pulse', symbol: '✿', trait: 'Mycelial intelligence whispering crop patterns.' }
];

export default async function MysticsPage() {
  const page = await getPageBySlug('/mystics');

  return (
    <section className="section-shell">
      <p className="eyebrow">Witnesses</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>Mystics</h1>
      <p className="lede">Listeners and interpreters who adapted to the environment.</p>
      {page ? (
        <article className="content-block">
          {page.title && <h2 style={{ marginTop: '0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{page.title}</h2>}
          <div dangerouslySetInnerHTML={{ __html: page.content || page.excerpt || '' }} />
        </article>
      ) : (
        <p className="placeholder">No content found for mystics yet.</p>
      )}

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
    </section>
  );
}
