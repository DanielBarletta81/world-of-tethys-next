import { getPageBySlug } from '@/lib/graphql';

export default async function HumansPage() {
  const page = await getPageBySlug('/humans');

  return (
    <section className="section-shell">
      <p className="eyebrow">Engineers</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>Humans</h1>
      <p className="lede">Systems builders, political actors, survivors under pressure.</p>
      {page ? (
        <article className="content-block">
          {page.title && <h2 style={{ marginTop: '0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{page.title}</h2>}
          <div dangerouslySetInnerHTML={{ __html: page.content || page.excerpt || '' }} />
        </article>
      ) : (
        <p className="placeholder">No human records have been added yet.</p>
      )}
    </section>
  );
}
