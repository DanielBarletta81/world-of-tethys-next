import { getPageBySlug } from '@/lib/graphql';

export default async function CharactersIndexPage() {
  const page = await getPageBySlug('/characters');

  return (
    <section className="section-shell">
      <p className="eyebrow">Archive</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>Characters</h1>
      <p className="lede">Autonomous figures recorded within Tethys. No sales layer.</p>
      {page ? (
        <article className="content-block">
          {page.title && <h2 style={{ marginTop: '0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{page.title}</h2>}
          <div dangerouslySetInnerHTML={{ __html: page.content || page.excerpt || '' }} />
        </article>
      ) : (
        <p className="placeholder">No character index exists yet.</p>
      )}
    </section>
  );
}
