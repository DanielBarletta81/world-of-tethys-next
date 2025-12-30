import ParchmentShader from './ParchmentShader';

export default function StaffPreview({ profile }) {
  if (!profile) return null;

  const { segments, dna, perks, summary, environmentStamp } = profile;

  return (
    <ParchmentShader className="artifact-card relative layer-ui-satchel">
      <div className="flex flex-col gap-4">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ancient-accent">
            Staff Genome
          </p>
          <h3 className="font-display text-2xl mt-1">Field Sequencer Output</h3>
          <p className="text-[11px] text-ancient-ink/70 font-mono mt-1 break-words">{dna}</p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(segments).map(([key, segment]) => (
            <div key={key} className="border border-ancient-ink/20 p-3 bg-white/40">
              <p className="text-[9px] uppercase tracking-[0.25em] text-ancient-accent">
                {key}
              </p>
              <p className="font-display text-lg">{segment.label}</p>
              <p className="text-xs text-ancient-ink/80">{segment.description}</p>
            </div>
          ))}
        </div>

        <div className="border border-dashed border-ancient-ink/40 p-3 bg-white/30">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ancient-accent">
            Field Notes
          </p>
          <p className="text-sm font-serif">{summary}</p>
          <p className="text-[10px] font-mono mt-1 text-ancient-ink/70">Biome imprint: {environmentStamp}</p>
        </div>

        {perks.length > 0 && (
          <div className="border border-ancient-ink/20 p-3 bg-white/40">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ancient-accent mb-2">
              Resonance Perks
            </p>
            <ul className="text-sm list-disc list-inside space-y-1">
              {perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ParchmentShader>
  );
}
