import { NextResponse } from 'next/server';
import { MAP_LORE_ARTIFACT_NODES } from '@/data/map-lore-artifacts';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    ok: true,
    source: 'json',
    contentPath: 'src/content/map-lore-artifacts.json',
    count: MAP_LORE_ARTIFACT_NODES.length,
    items: MAP_LORE_ARTIFACT_NODES
  });
}
