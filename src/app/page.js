import PortalPage from './portal/page';
import AuthorLanding from '@/components/author/AuthorLanding';
import { getConfiguredSiteUrls, getSiteVariantFromConfig } from '@/lib/site-variant';

export function generateMetadata() {
  const siteVariant = getSiteVariantFromConfig();
  const { worldSiteUrl, authorSiteUrl } = getConfiguredSiteUrls();

  if (siteVariant === 'author') {
    return {
      title: 'D.C. Barletta | Author of World of Tethys',
      description:
        'Author-first home for D.C. Barletta with Book One in front, essays and media on hand, and direct routes into Cambria and the wider World of Tethys.',
      alternates: {
        canonical: authorSiteUrl,
      },
      openGraph: {
        title: 'D.C. Barletta | Author of World of Tethys',
        description:
          'Prehistoric science-fantasy by D.C. Barletta with Book One in front and the wider World of Tethys, including Cambria, one step deeper.',
        url: authorSiteUrl,
      },
    };
  }

  return {
    title: 'World of Tethys | Portal',
    description:
      'Enter the World of Tethys portal to explore the map, archive, natural history, and live world systems.',
    alternates: {
      canonical: worldSiteUrl,
    },
  };
}

export default function HomePage() {
  const siteVariant = getSiteVariantFromConfig();

  if (siteVariant === 'author') {
    return <AuthorLanding />;
  }

  return <PortalPage />;
}
