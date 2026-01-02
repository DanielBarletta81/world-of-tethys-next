'use client';

import React, { useState } from 'react';
import { Scale, Fingerprint, BookOpen, CheckCircle, Search } from 'lucide-react';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export default function PaleoRealityCheck() {
  const [fantasyConcept, setFantasyConcept] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeCreature = async () => {
    if (!fantasyConcept) return;
    if (!apiKey) {
      setError('Missing NEXT_PUBLIC_GEMINI_API_KEY. Add it to your env before validating.');
      return;
    }
    setLoading(true);
    setAnalysis(null);
    setError('');

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
      if (!text) throw new Error('No candidate text returned');
      const result = JSON.parse(text);
      setAnalysis(result);
    } catch (err) {
      console.error('Paleo-uplink failed:', err);
      setError('Paleo-uplink failed. Check API key and quota.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1c1917] p-8 rounded-lg shadow-2xl border border-[#44403c] text-[#e7e5e4] font-serif max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-[#44403c] pb-4">
        <div className="bg-amber-900/20 p-3 rounded-full border border-amber-900/50">
          <Scale className="text-amber-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-wide text-[#e7e5e4]">The Fossil Validator</h2>
          <p className="text-xs text-[#a8a29e] uppercase tracking-widest font-sans">
            Compare Fantasy vs. The Fossil Record (111 MYA)
          </p>
          <p className="text-[11px] text-[#a8a29e] font-sans mt-1">
            Caveat: the fossil record is incomplete and authors may disagree with the auto-generated verdicts.
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-4 mb-8">
        <label className="block text-sm font-sans uppercase tracking-widest text-[#78716c]">Describe your creature idea</label>
        <textarea
          value={fantasyConcept}
          onChange={(e) => setFantasyConcept(e.target.value)}
          placeholder="e.g., A giant aquatic lizard that uses sonar to hunt in the dark..."
          className="w-full bg-[#0c0a09] border border-[#292524] p-4 text-[#d6d3d1] focus:border-amber-700 focus:outline-none min-h-[120px] rounded-sm font-sans"
        />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button
          onClick={analyzeCreature}
          disabled={loading || !fantasyConcept}
          className="px-6 py-3 bg-amber-800 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-amber-100 font-sans uppercase tracking-widest text-xs rounded-sm transition-colors flex items-center gap-2"
        >
          {loading ? <span className="animate-spin">⏳</span> : <Search size={16} />}
          {loading ? 'Consulting Archives...' : 'Validate Against Record'}
        </button>
      </div>

      {/* Results Area */}
      {analysis && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Closest Match Card */}
            <div className="bg-[#292524] p-5 rounded-sm border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-2 text-amber-600">
                <Fingerprint size={18} />
                <span className="text-xs font-sans uppercase tracking-widest">Closest Real Analog</span>
              </div>
              <p className="text-xl font-bold italic">{analysis.closestRealFossil}</p>
              <div
                className={`text-xs mt-2 inline-block px-2 py-1 rounded border ${
                  analysis.timePeriodCheck?.includes('Valid')
                    ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400'
                    : 'bg-rose-900/20 border-rose-800 text-rose-400'
                }`}
              >
                {analysis.timePeriodCheck}
              </div>
            </div>

            {/* Plausibility Score */}
            <div className="bg-[#292524] p-5 rounded-sm border-l-4 border-amber-600 flex flex-col justify-center items-center">
              <span className="text-xs font-sans uppercase tracking-widest text-amber-600 mb-2">Scientific Plausibility</span>
              <div className="text-4xl font-bold text-[#e7e5e4]">{analysis.plausibilityScore}%</div>
              <div className="w-full bg-[#0c0a09] h-2 mt-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-1000"
                  style={{ width: `${analysis.plausibilityScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Critique & Suggestion */}
          <div className="space-y-4">
            <div className="bg-[#0c0a09] border border-[#292524] p-5 rounded-sm">
              <h4 className="flex items-center gap-2 text-[#a8a29e] text-xs font-sans uppercase tracking-widest mb-3">
                <BookOpen size={16} /> Curator's Critique
              </h4>
              <p className="text-[#d6d3d1] italic leading-relaxed">"{analysis.scientificCritique}"</p>
            </div>

            <div className="bg-amber-950/10 border border-amber-900/30 p-5 rounded-sm">
              <h4 className="flex items-center gap-2 text-amber-600 text-xs font-sans uppercase tracking-widest mb-3">
                <CheckCircle size={16} /> Suggested Adjustment
              </h4>
              <p className="text-amber-100/80">{analysis.suggestedFix}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
