const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function Head() {
  const title = 'Pteros Signal Window | World of Tethys';
  const description = 'Open broadcasts and relay echoes from the Pteros station.';
  const image = `${siteUrl}/img/plates/footer/footer-home-watcher.webp`;
  const url = `${siteUrl}/pteros`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
