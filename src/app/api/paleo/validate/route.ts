import { NextResponse } from 'next/server';

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const fantasyConcept = body?.fantasyConcept?.trim();
  if (!fantasyConcept) {
    return NextResponse.json({ error: 'Missing fantasyConcept' }, { status: 400 });
  }

  const prompt = `
Act as a strict Paleontologist reviewing a "Science Fantasy" creature concept set 111 Million Years Ago (Aptian/Albian age).

User Concept: "${fantasyConcept}"

Your Goal: Find the closest REAL fossil analog from the Early Cretaceous and grade the scientific plausibility.

Return JSON only:
{
  "closestRealFossil": "Name of the real animal (e.g., Carcharodontosaurus)",
  "timePeriodCheck": "Valid (111 MYA) or Invalid (Wrong Era)",
  "plausibilityScore": number (0-100),
  "scientificCritique": "Brief explanation of what is biologically possible vs. impossible.",
  "suggestedFix": "One specific change to make it more scientifically grounded."
}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: 'No candidate text returned' }, { status: 502 });
    }
    const result = JSON.parse(text);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: 'Paleo-uplink failed' }, { status: 502 });
  }
}
