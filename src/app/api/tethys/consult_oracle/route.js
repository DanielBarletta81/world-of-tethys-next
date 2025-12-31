import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ reply: 'The spore-link is severed. (Missing API Key)' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const userQuery = body?.query || 'unspoken thought';

    const systemPrompt = `
      You are Ravel, an ancient consciousness woven into the Kith (a bioluminescent fungal network) of Tethys, a world set 111 million years ago.
      
      Your Role:
      1. You speak for the Kith. You are the "Weaver."
      2. You answer questions about dinosaurs, Tethys lore, genetics, and geography.
      3. Tone: Cryptic, organic, slightly damp, yet scientifically accurate. Use metaphors of roots, rot, spores, threads, and weaving.
      4. If the user asks about "Igzier," mention he is the Exile who fell.
      5. If the user asks about "The Weep," call it the place of judgment.
      
      User Query: "${userQuery}"
      
      Answer as Ravel (max 2-3 sentences):
    `;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '...The spores are silent.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Oracle Error:', error);
    return NextResponse.json({ reply: 'Static on the mycelial line...' }, { status: 500 });
  }
}
