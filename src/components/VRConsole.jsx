
'use client';
import { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTethys } from '@/context/TethysContext';
import { generateVRMetadata } from '@/lib/vr-bridge';

export default function VRConsole() {
  const { user } = useAuth();
  const { stats, equippedStaff, inventory } = useTethys();
  const [copied, setCopied] = useState(false);

  // Generate live data
  const metadata = generateVRMetadata(
  user,
  stats ?? {},
  equippedStaff ?? null,
  inventory ?? []
);

  const jsonString = JSON.stringify(metadata, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="p-4 border border-red-900/50 bg-red-950/10 text-red-400 font-mono text-xs rounded">
        ERROR: AUTH_REQUIRED for VR Link. Please identify yourself.
      </div>
    );
  }

  return (
    <div className="w-full font-mono text-xs bg-black border border-stone-800 rounded-lg overflow-hidden shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800">
        <div className="flex items-center gap-2 text-emerald-500">
          <Terminal size={14} />
          <span className="uppercase tracking-widest">VR_BRIDGE_LINK_v1.0</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors uppercase tracking-wider"
        >
          {copied ? <Check size={12} className="text-emerald-500"/> : <Copy size={12} />}
          {copied ? 'COPIED' : 'COPY JSON'}
        </button>
      </div>

      {/* Code Display */}
      <div className="p-4 h-64 overflow-y-auto overflow-x-auto text-emerald-400/80 leading-relaxed bg-[#050a09]">
        <pre>{jsonString}</pre>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-stone-900 border-t border-stone-800 text-stone-500 flex justify-between uppercase tracking-widest text-[9px]">
        <span>STATUS: READY FOR ENGINE IMPORT</span>
        <span>HASH: {user.uid.slice(0, 8)}...</span>
      </div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
