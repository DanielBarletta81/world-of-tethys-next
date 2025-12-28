import { getPageBySlug } from '@/lib/graphql';

export default async function CreaturesPage() {
  const page = await getPageBySlug('/creatures');

  return (
    <section className="section-shell">
      <p className="eyebrow">Observed Life</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>Creatures</h1>
      <p className="lede">Observed life forms adapting under pressure.</p>
      {page ? (
        <article className="content-block">
          {page.title && <h2 style={{ marginTop: '0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{page.title}</h2>}
          <div dangerouslySetInnerHTML={{ __html: page.content || page.excerpt || '' }} />
        </article>
      ) : (
        <p className="placeholder">No content found for creatures yet.</p>
      )}
    </section>
  );
}
