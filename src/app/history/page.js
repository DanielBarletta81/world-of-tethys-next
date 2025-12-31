import { fetchAPI } from '@/lib/wordpress';

const query = `
  query TimelineEvents {
    tethysEvents(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        title
        content
        eventDetails {
          timelineDate
        }
      }
    }
  }
`;

const TimelineEvent = ({ event }) => (
  <div className="relative pl-8 pb-12 border-l border-tethys-gold/30 last:border-0">
    <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-tethys-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]" />
    <div className="flex flex-col gap-2">
      {event?.eventDetails?.timelineDate && (
        <span className="text-tethys-gold font-sans text-xs uppercase tracking-widest">{event.eventDetails.timelineDate}</span>
      )}
      <h2 className="text-2xl font-serif text-tethys-parchment italic">{event.title}</h2>
      <div className="text-gray-400 text-sm max-w-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: event.content || '' }} />
    </div>
  </div>
);

export default async function HistoryPage() {
  const data = await fetchAPI(query);
  const events = data?.tethysEvents?.nodes || [];

  // Sort by timelineDate if present, falling back to original order.
  const sorted = [...events].sort((a, b) => {
    const aDate = a?.eventDetails?.timelineDate || '';
    const bDate = b?.eventDetails?.timelineDate || '';
    return aDate.localeCompare(bDate);
  });

  return (
    <section className="section-shell">
      <p className="eyebrow">Major Events</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>Timeline</h1>
      <p className="lede">A vertical ledger of Tethys history. Observational, restrained.</p>

      <div className="timeline">
        {sorted.length ? (
          sorted.map((event) => <TimelineEvent key={event.slug} event={event} />)
        ) : (
          <p className="placeholder">No events recorded yet.</p>
        )}
      </div>
    </section>
  );
}
