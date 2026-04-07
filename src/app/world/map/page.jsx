import { redirect } from 'next/navigation';
import { getConfiguredSiteUrls } from '@/lib/site-variant';

export default function WorldMapAliasPage() {
  const { worldSiteUrl } = getConfiguredSiteUrls();
  redirect(`${worldSiteUrl}/map`);
}
