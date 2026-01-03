import React from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { fetchArchive } from '../../../lib/tethys-api'; // Adjust path as needed

// Mock Data for Alpha (Remove when WP is connected)
const MOCK_DATA = [
  {
    title: "Ignis-Theropod",
    slug: "ignis-theropod",
    excerpt: "A predator adapted to the ash-fall. Scales mimic cooling magma.",
    tethysData: { threatLevel: "Lethal", kithRequirement: 20 },
    archiveCategories: { nodes: [{ name: "Creature" }] }
  },
  {
    title: "Iron-Binder",
    slug: "iron-binder",
    excerpt: "A faction that rejects biology for scavenged metal.",
    tethysData: { threatLevel: "Caution", kithRequirement: 10 },
    archiveCategories: { nodes: [{ name: "Faction" }] }
  }
];

export default async function CategoryPage({ params }) {
  const { category } = params;
  // const entries = await fetchArchive(category); // Use this when WP is ready
  const entries = MOCK_DATA; // Alpha Fallback

  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif p-8 bg-stone-grain">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 border-b border-[#292524] pb-6 flex justify-between items-end">
          <div>
            <Link href="/" className="text-xs uppercase tracking-widest text-[#57534e] hover:text-amber-600 flex items-center gap-2 mb-4">
              <ArrowLeft size={12} /> Database Root
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#78716c] uppercase tracking-tighter">
              {category}
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] uppercase tracking-widest text-[#57534e]">Entries Found</div>
            <div className="text-2xl font-mono text-amber-600">{entries.length}</div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <Link 
              key={entry.slug} 
              href={`/archive/${category}/${entry.slug}`}
              className="group bg-[#1c1917] border border-[#292524] p-6 hover:border-amber-800 hover:bg-[#292524] transition-all duration-300 relative overflow-hidden"
            >
              {/* Threat Indicator */}
              <div className="absolute top-0 right-0 p-2">
                {entry.tethysData.threatLevel === 'Lethal' && <AlertTriangle size={16} className="text-red-600" />}
                {entry.tethysData.threatLevel === 'Caution' && <Shield size={16} className="text-amber-600" />}
              </div>

              <div className="text-[10px] text-[#57534e] uppercase tracking-widest mb-2">
                {entry.archiveCategories.nodes[0]?.name}
              </div>
              
              <h2 className="text-2xl font-bold text-[#e7e5e4] mb-3 font-serif group-hover:text-amber-100">
                {entry.title}
              </h2>
              
              <p className="text-sm text-[#a8a29e] line-clamp-3 leading-relaxed">
                {entry.excerpt}
              </p>

              <div className="mt-6 pt-4 border-t border-[#292524] flex justify-between items-center text-[10px] uppercase tracking-widest text-[#57534e] group-hover:text-amber-600 transition-colors">
                <span>Access Dossier</span>
                <span>ID: {entry.tethysData.kithRequirement}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}