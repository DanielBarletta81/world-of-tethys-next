import { getPageBySlug } from '@/lib/graphql';
import './modules.mystics.css';
import MysticsClient from '@/components/MysticsClient';

export default async function MysticsPage() {
  const page = await getPageBySlug('/mystics');

  return (
    <section className="section-shell">
      <p className="eyebrow">Witnesses</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>Mystics</h1>
      <p className="lede">Listeners and interpreters who adapted to the environment.</p>
      {page ? (
        <article className="content-block">
          {page.title && (
            <h2 style={{ marginTop: '0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {page.title}
            </h2>
          )}
          <div dangerouslySetInnerHTML={{ __html: page.content || page.excerpt || '' }} />
        </article>
      ) : (
        <p className="placeholder">No content found for mystics yet.</p>
      )}

      <MysticsClient />
    </section>
  );
}
