import React from 'react';
// import Link from 'next/link'; // Switched to <a> for preview compatibility
import { ArrowLeft, Database, Activity, MapPin } from 'lucide-react';

// MOCK DATA (Alpha)
const MOCK_ENTRY = {
  title: "Ignis-Theropod",
  content: "<p>A predator adapted to the ash-fall. Its scales mimic cooling magma, allowing it to ambush prey near the vents. It does not roar; it hisses like steam escaping a fissure.</p>",
  tethysData: {
    threatLevel: "Lethal",
    realWorldAnalog: "Komodo Dragon / Monitor Lizard",
    biologicalTraits: [
      { trait: "Heat Resistance", value: "900°C" },
      { trait: "Diet", value: "Sulfur-based life" }
    ]
  }
};

export default function DetailPage({ params }) {
  const { category, slug } = params;
  const entry = MOCK_ENTRY; // Would be fetchArchive(category, slug)

  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif bg-stone-grain p-8">
      
      <nav className="max-w-4xl mx-auto mb-12">
        <a href={`/archive/${category}`} className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716c] hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to {category} Index
        </a>
      </nav>

      <article className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left: Data Column */}
        <div className="md:col-span-1 space-y-8">
          <div className="p-6 bg-[#1c1917] border border-[#292524]">
            <h3 className="text-xs font-sans uppercase tracking-widest text-[#57534e] mb-4 border-b border-[#292524] pb-2">
              Vital Statistics
            </h3>
            <ul className="space-y-4">
              <li className="flex justify-between text-sm">
                <span className="text-[#78716c]">Threat</span>
                <span className="text-red-500 font-bold uppercase">{entry.tethysData.threatLevel}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-[#78716c]">Analog</span>
                <span className="text-[#e7e5e4] text-right text-xs">{entry.tethysData.realWorldAnalog}</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#1c1917] border border-[#292524]">
             <h3 className="text-xs font-sans uppercase tracking-widest text-[#57534e] mb-4 border-b border-[#292524] pb-2">
              Biometrics
            </h3>
            <ul className="space-y-3">
              {entry.tethysData.biologicalTraits.map((t, i) => (
                <li key={i} className="text-sm">
                  <span className="block text-[#78716c] text-[10px] uppercase">{t.trait}</span>
                  <span className="block text-[#e7e5e4] font-mono">{t.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Content */}
        <div className="md:col-span-2">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-700 mb-8 uppercase tracking-tighter">
            {entry.title}
          </h1>
          
          <div className="prose prose-invert prose-amber max-w-none font-serif text-lg leading-relaxed text-[#a8a29e]"
               dangerouslySetInnerHTML={{ __html: entry.content }} 
          />
        </div>

      </article>
    </main>
  );
}