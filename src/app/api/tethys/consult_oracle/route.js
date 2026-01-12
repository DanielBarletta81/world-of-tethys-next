import { NextResponse } from 'next/server';

const ORACLE_LINES = [
  { speaker: 'Ravel', text: 'The roots do not answer first questions. They answer the second you forgot to ask.' },
  { speaker: 'Ravel', text: 'If you want proof, look at your hands. If you want meaning, look at your steps.' },
  { speaker: 'Ravel', text: 'The pool remembers you, but it will not carry you.' },
  { speaker: 'Ravel', text: 'What you call a warning is often a map.' },
  { speaker: 'Ravel', text: 'Speak softer. The world does not like to be cornered.' },
  { speaker: 'Ravel', text: 'There are truths that keep you alive and truths that keep you still. Choose.' },
  { speaker: 'Ravel', text: 'If the answer comes quickly, it is not the right one.' },
  { speaker: 'Ravel', text: 'A bond is not a prize. It is a weight that walks with you.' },
  { speaker: 'Ravel', text: 'The roots say nothing. The silence is the answer.' },
  { speaker: 'Ravel', text: 'You already know the cost. Ask instead if you can carry it.' },
  { speaker: 'Kith', text: 'The spores do not like straight questions. They like echoes.' },
  { speaker: 'Kith', text: 'Ask the pool what you fear to hear. It will answer the part you try to hide.' },
  { speaker: 'Kith', text: 'If you keep walking, the map keeps changing. That is the bargain.' },
  { speaker: 'Kith', text: 'The oracle is a mirror with its eyes closed.' },
  { speaker: 'Kith', text: 'You are not late. You are early to a story that resists you.' },
  { speaker: 'Kith', text: 'There are four winds here. Only one tells the truth, and it never shouts.' },
  { speaker: 'Kith', text: 'The City calls it noise. The woods call it instruction.' },
  { speaker: 'Kith', text: 'What is missing is often the strongest signal.' },
  { speaker: 'Kith', text: 'The pool does not judge you. It remembers you.' },
  { speaker: 'Kith', text: 'You can keep the question. The answer will keep you.' },
  { speaker: 'Ravel', text: 'Whisper-Nettle steals cadence first. Count your breaths before it counts them for you.' },
  { speaker: 'Kith', text: 'Throatlace listens for exhale. If you are lost, breathe through your teeth.' },
  { speaker: 'Ravel', text: 'Veilfruit shifts when touched. If the color changes, you are already late.' },
  { speaker: 'Kith', text: 'Glassvine teaches surrender. Its barbs ask you to sit. Do not answer.' },
  { speaker: 'Ravel', text: 'Pitcher of Dier keeps false lamps. If the light looks kind, it is a trap.' },
  { speaker: 'Kith', text: 'Latchwood Creeper taps for help. If you hear it, do not become the help.' },
  { speaker: 'Ravel', text: 'Blood Orchid keeps the small hunters back. Too much and it turns on you.' }
];

function pickOracleLine(seed = '') {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % ORACLE_LINES.length;
  }
  const line = ORACLE_LINES[hash] || ORACLE_LINES[0];
  return line.text;
}

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

  const reply = pickOracleLine(query);
  return NextResponse.json({ reply }, { status: 200 });
}
