import { NextResponse } from 'next/server';
import { pickRavelWeeklyResponse } from '@/lib/oraclePicker';

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const query = (payload?.query || '').toString().trim();
  if (!query) {
    return NextResponse.json({ error: 'Missing query.' }, { status: 400 });
  }

  const selection = pickRavelWeeklyResponse(
    {
      query,
      path: payload?.dnaLean || payload?.path || 'any',
      stillness: payload?.stillness || 'any',
      visit: payload?.visit || 'any',
      watcherState: payload?.watcherState || 'any'
    },
    {
      seed: payload?.dnaSeed || '',
      recentIds: payload?.recentIds || [],
      maxRecent: payload?.maxRecent || 4
    }
  );

  return NextResponse.json(
    {
      id: selection.id,
      speaker: selection.speaker || 'Ravel',
      text: selection.text || '',
      reply: selection.text || '',
      weekKey: selection.weekKey
    },
    { status: 200 }
  );
}
