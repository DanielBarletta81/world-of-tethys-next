import { notFound } from 'next/navigation';
import { fetchAPI } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';

export default async function CharacterPage({ params }) {
  const { slug } = params;

  const data = await fetchAPI(
    `
    query GetCharacter($id: ID!) {
      character(id: $id, idType: SLUG) {
        title
        content
        characterDetails {
          faction
          age
          homeworld
        }
      }
    }
  `,
    { id: slug }
  );

  const char = data?.character;
  if (!char) {
    notFound();
  }

  return (
    <section className="section-shell">
      <p className="eyebrow">Record</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>{char.title}</h1>
      {char.characterDetails?.faction && <div className="stats-badge">{char.characterDetails.faction}</div>}
      {char.characterDetails?.homeworld && (
        <p className="lede" style={{ marginTop: '0.35rem' }}>
          {char.characterDetails.homeworld}
        </p>
      )}
      <article className="content-block" dangerouslySetInnerHTML={{ __html: char.content || '' }} />
    </section>
  );
}
