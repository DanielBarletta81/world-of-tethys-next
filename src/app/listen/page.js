import { getMediaUrl } from '@/lib/links';

const PREVIEW_PATH = process.env.MEDIA_PREVIEW_PATH || 'audio/preview.mp3';
const FULL_PATH = process.env.MEDIA_FULL_PATH || 'audio/full.mp3';

export default function ListenPage() {
  const previewUrl = getMediaUrl(PREVIEW_PATH);
  const fullUrl = getMediaUrl(FULL_PATH);
  const hasMedia = Boolean(previewUrl || fullUrl);

  return (
    <section className="section-shell">
      <p className="eyebrow">Audio Archive</p>
      <h1 style={{ margin: '0 0 0.5rem' }}>Listen</h1>
      <p className="lede">Stream direct from the archive. No pop-ups, no sales language.</p>

      {hasMedia ? (
        <div className="content-block" style={{ display: 'grid', gap: '1.25rem' }}>
          {previewUrl && (
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.25rem' }}>
                Preview
              </p>
              <audio controls preload="none" style={{ width: '100%' }}>
                <source src={previewUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {fullUrl && (
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.25rem' }}>
                Full
              </p>
              <audio controls preload="none" style={{ width: '100%' }}>
                <source src={fullUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      ) : (
        <p className="placeholder">Add MEDIA_BASE_URL plus MEDIA_PREVIEW_PATH / MEDIA_FULL_PATH env vars to stream directly from S3.</p>
      )}
    </section>
  );
}
