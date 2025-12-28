import { getPageBySlug } from '@/lib/graphql';

export default async function Home() {
  const page = await getPageBySlug('/');

  return (
    <section className="section-shell">
      <p className="eyebrow">Recovered Archive</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>World of Tethys</h1>
      <p className="lede">
        A living world shaped by water, survival pressure, and adaptation — recorded through creatures, mystics, humans, and recovered artifacts.
      </p>
      {page ? (
        <article className="content-block">
          {page.title && <h2 style={{ marginTop: '0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{page.title}</h2>}
          <div dangerouslySetInnerHTML={{ __html: page.content || page.excerpt || '' }} />
        </article>
      ) : (
        <p className="placeholder">No content found for root page.</p>
      )}
    </section>
  );
}
