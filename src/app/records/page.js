import { getPageBySlug } from '@/lib/graphql';

export default async function RecordsPage() {
  const page = await getPageBySlug('/records');

  return (
    <section className="section-shell">
      <p className="eyebrow">Archive</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>Records</h1>
      <p className="lede">Fragments, plates, and recovered artifacts.</p>
      {page ? (
        <article className="content-block">
          {page.title && <h2 style={{ marginTop: '0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{page.title}</h2>}
          <div dangerouslySetInnerHTML={{ __html: page.content || page.excerpt || '' }} />
        </article>
      ) : (
        <p className="placeholder">No records have been recovered here yet.</p>
      )}
    </section>
  );
}
