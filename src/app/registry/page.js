import { getPageBySlug } from '@/lib/graphql';

export default async function RegistryPage() {
  const page = await getPageBySlug('/registry');

  return (
    <section className="section-shell">
      <p className="eyebrow">Registry</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>World Registry</h1>
      <p className="lede">Status, formats, and canonical entries. No sales language.</p>
      {page ? (
        <article className="content-block">
          {page.title && <h2 style={{ marginTop: '0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{page.title}</h2>}
          <div dangerouslySetInnerHTML={{ __html: page.content || page.excerpt || '' }} />
        </article>
      ) : (
        <p className="placeholder">No registry entry is available yet.</p>
      )}
    </section>
  );
}
