'use client';

const DEFAULT_BOOK_URL = 'https://www.goodreads.com/book/show/249368560-world-of-tethys';
const DEFAULT_HEADER_TEXT = 'Goodreads reviews for World of Tethys';
const DEFAULT_ISBN = '9798250935180';

function buildWidgetUrl({ developerId, headerText, isbn }) {
  const params = new URLSearchParams({
    format: 'html',
    header_text: headerText,
    isbn,
    links: '660',
    min_rating: '',
    num_reviews: '',
    review_back: 'ffffff',
    stars: '000000',
    stylesheet: '',
    text: '444',
  });

  if (developerId) {
    params.set('did', developerId);
  }

  return `https://www.goodreads.com/api/reviews_widget_iframe?${params.toString()}`;
}

export default function GoodreadsWidget({
  className = '',
  headerText = DEFAULT_HEADER_TEXT,
  bookUrl = DEFAULT_BOOK_URL,
  isbn = DEFAULT_ISBN,
  width = 575,
  height = 400,
  theme = 'dark',
}) {
  const developerId = process.env.NEXT_PUBLIC_GOODREADS_DEVELOPER_ID || '';
  const iframeSrc = buildWidgetUrl({ developerId, headerText, isbn });
  const isLight = theme === 'light';

  return (
    <section
      className={`gr-widget ${isLight ? 'gr-widget--light' : 'gr-widget--dark'} ${className}`.trim()}
      aria-label="Goodreads reviews"
    >
      <div className="gr-header">
        <h2>
          <a href={bookUrl} target="_blank" rel="nofollow noopener noreferrer">
            {headerText}
          </a>
        </h2>
      </div>

      <iframe
        id="goodreads-reviews-widget"
        title="Goodreads reviews for World of Tethys"
        src={iframeSrc}
        width={width}
        height={height}
        className="gr-iframe"
        sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
      />

      <div className="gr-footer">
        <a
          className="gr-branding"
          target="_blank"
          rel="nofollow noopener noreferrer"
          href="https://www.goodreads.com/book/show/249368560-world-of-tethys?utm_medium=api&utm_source=reviews_widget"
        >
          Reviews from Goodreads.com
        </a>
      </div>

      <style jsx>{`
        .gr-widget {
          font-family: georgia, serif;
          padding: 18px 0;
          width: min(100%, 575px);
        }

        .gr-header h2 {
          font-weight: normal;
          font-size: 16px;
          margin: 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #bbb596;
        }

        .gr-widget a {
          text-decoration: none;
          color: #665500;
        }

        .gr-widget a:hover {
          text-decoration: underline;
        }

        .gr-widget a:active {
          color: #665500;
        }

        .gr-iframe {
          background-color: #ffffff;
          border: 0;
          width: 100%;
          margin-top: 10px;
        }

        .gr-footer {
          width: 100%;
          border-top: 1px solid #bbb596;
          margin-top: 10px;
          padding-top: 8px;
          text-align: right;
        }

        .gr-branding {
          color: #382110;
          font-size: 11px;
          text-decoration: none;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        .gr-widget--dark .gr-header h2 {
          border-bottom-color: rgba(255, 255, 255, 0.24);
        }

        .gr-widget--dark .gr-footer {
          border-top-color: rgba(255, 255, 255, 0.24);
        }

        .gr-widget--dark .gr-header a {
          color: #f5d8a2;
        }

        .gr-widget--dark .gr-branding {
          color: #e7d4b2;
        }

        .gr-widget--light .gr-header a {
          color: #5c451f;
        }

        .gr-widget--light .gr-branding {
          color: #48331b;
        }
      `}</style>
    </section>
  );
}
