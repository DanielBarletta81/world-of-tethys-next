import { redirect } from 'next/navigation';
import { getConfiguredSiteUrls } from '@/lib/site-variant';

export default function LegacyMapRoutePage() {
  const { worldSiteUrl } = getConfiguredSiteUrls();
  redirect(`${worldSiteUrl}/map`);
}
