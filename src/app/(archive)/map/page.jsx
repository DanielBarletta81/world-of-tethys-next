import { redirect } from 'next/navigation';

// (archive)/map → canonical /map (local-first)
export default function LegacyMapRoutePage() {
  redirect('/map');
}
