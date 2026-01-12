'use client';

function buildFallbackName(speaker) {
  return speaker?.name ?? speaker?.id ?? 'Unknown';
}

export default function NPCDialogue({
  speaker,
  line,
  fallbackLine = '...',
  className = ''
}) {
  const resolvedLine = line || fallbackLine;

  return (
    <div className={`npc-dialogue flex flex-col gap-2 ${className}`.trim()}>
      <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
        {buildFallbackName(speaker)}
      </div>
      <p className="text-sm text-stone-200 italic leading-relaxed">
        {resolvedLine}
      </p>
    </div>
  );
}
// World of Tethys || D.C. Barletta
