import { redirect } from 'next/navigation';
import { getConfiguredSiteUrls, getSiteVariantFromConfig } from '@/lib/site-variant';

export default function WorldMapAliasPage() {
  // On the world site (or local dev) use the canonical local /map route.
  // On the author site, cross-link to the world site map.
  const variant = getSiteVariantFromConfig();
  if (variant === 'author') {
    const { worldSiteUrl } = getConfiguredSiteUrls();
    redirect(`${worldSiteUrl}/map`);
  }
  redirect('/map');
}
