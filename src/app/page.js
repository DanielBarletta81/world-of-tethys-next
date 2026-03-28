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
        'Book One. A name above the waterline. An older world below.',
      alternates: {
        canonical: authorSiteUrl,
      },
      openGraph: {
        title: 'D.C. Barletta | Author of World of Tethys',
        description:
          'A name above the waterline. Tethys below.',
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
