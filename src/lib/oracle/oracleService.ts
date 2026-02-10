import { GoogleGenAI } from '@google/genai';

type EchoKind = 'spores' | 'rumble' | 'deep_rumble' | 'crack' | 'heartbeat' | 'silence';

export type OracleTerm = {
  id: string;
  label: string;
  kind?: string;
};

export type OracleFacts = {
  weather?: {
    tempC: number;
    windKph: number;
    condition: string;
  };
  // Future signals can be added without breaking callers.
  [key: string]: any;
};

export type OracleResponse = {
  id: string;
  translation: string;
  gibberish: string;
  omens: string[];
  echo: EchoKind;
  terms: OracleTerm[];
  facts: OracleFacts;
  meta: {
    aiEnabled: boolean;
    model?: string;
  };
};

const MODEL = 'gemini-2.5-flash';

const DEFAULT_WEATHER = {
  tempC: 0,
  windKph: 0,
  condition: 'Unknown',
};

const pickEcho = (condition = '', windKph = 0): EchoKind => {
  const normalized = condition.toLowerCase();
  if (windKph >= 50 || normalized.includes('storm')) return 'deep_rumble';
  if (normalized.includes('thunder') || normalized.includes('squall')) return 'rumble';
  if (normalized.includes('snow') || normalized.includes('ice')) return 'crack';
  if (normalized.includes('rain') || normalized.includes('drizzle')) return 'spores';
  if (normalized.includes('clear') || normalized.includes('sun')) return 'heartbeat';
  if (windKph >= 30) return 'rumble';
  return 'heartbeat';
};

const sanitizeJsonBlock = (text: string) => text.replace(/```json|```/gi, '').trim();

const buildPrompt = (terms: OracleTerm[], facts: OracleFacts) => {
  const weather = facts.weather || DEFAULT_WEATHER;
  const termList = terms.length
    ? terms.map((t) => `${t.label}${t.kind ? ` (${t.kind})` : ''}`).join(', ')
    : 'no tagged signals';

  return `You are the fungal Oracle of Tethys (Aptian/Albian age). Weave a short reading.
Signals:
- Weather: ${weather.condition}, ${Math.round(weather.tempC)}°C, wind ${Math.round(weather.windKph)} kph.
- Terms: ${termList}.

Respond ONLY with JSON:
{
  "translation": "1-2 sentences in-world and cryptic",
  "gibberish": "invented sporesong",
  "omens": ["3 terse omens keyed to the terms and weather"],
  "echo": "spores|rumble|deep_rumble|crack|heartbeat"
}

Ban all real-world place names.`;
};

const buildFallbackResponse = (terms: OracleTerm[], facts: OracleFacts): OracleResponse => {
  const weather = facts.weather || DEFAULT_WEATHER;
  const echo = pickEcho(weather.condition, weather.windKph);
  const highlighted = terms.slice(0, 3).map((t) => t.label).join(', ') || 'the silent net';
  const translation = `Sky reports ${weather.condition} at ${Math.round(
    weather.tempC
  )}°C; spores cluster around ${highlighted}.`;
  const omens = [
    weather.windKph >= 40 ? 'Air drums against the ridge.' : 'Air barely stirs.',
    terms[0] ? `${terms[0].label} vibrates with old tension.` : 'No tagged relic answers.',
    `Echo set to ${echo}.`,
  ];

  return {
    id: `oracle_${Date.now()}`,
    translation,
    gibberish: `${echo.toUpperCase()}... ${highlighted}.`,
    omens,
    echo,
    terms,
    facts,
    meta: { aiEnabled: false },
  };
};

export async function buildOracleResponse({
  terms = [],
  facts = {},
}: {
  terms?: OracleTerm[];
  facts?: OracleFacts;
}): Promise<OracleResponse> {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    return buildFallbackResponse(terms, facts);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(terms, facts);
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    const raw = result?.text ?? '';
    const parsed = JSON.parse(sanitizeJsonBlock(raw));

    const weather = facts.weather || DEFAULT_WEATHER;
    const echo = (parsed.echo as EchoKind) || pickEcho(weather.condition, weather.windKph);

    return {
      id: parsed.id || `oracle_${Date.now()}`,
      translation: parsed.translation || parsed.message || '',
      gibberish: parsed.gibberish || '',
      omens: Array.isArray(parsed.omens) ? parsed.omens : [],
      echo,
      terms,
      facts,
      meta: { aiEnabled: true, model: MODEL },
    };
  } catch (error) {
    console.error('Oracle service fell back to offline mode:', error);
    return buildFallbackResponse(terms, facts);
  }
}
