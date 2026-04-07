export default function LoreArtifactShelf({
  nodes = [],
  activeRegionId,
  onSelectRegion
}) {
  if (!nodes.length) return null;

  const activeNode =
    nodes.find((node) => node.regionId === activeRegionId) || nodes[0];

  return (
    <div className="bg-[#11100f] p-6 border border-stone-800 rounded-lg">
      <h3 className="text-stone-400 text-xs uppercase tracking-widest mb-4">
        Explorable Lore Index
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {nodes.map((node) => {
          const active = node.regionId === activeNode.regionId;
          return (
            <button
              key={node.regionId}
              type="button"
              onClick={() => onSelectRegion?.(node.regionId)}
              className={`px-2.5 py-1 rounded border text-[10px] uppercase tracking-[0.2em] transition-colors ${
                active
                  ? 'border-cyan-500/70 bg-cyan-950/30 text-cyan-200'
                  : 'border-stone-700 bg-stone-900 text-stone-300 hover:border-stone-500'
              }`}
            >
              {node.label}
            </button>
          );
        })}
      </div>

      <div className="rounded border border-stone-800/80 bg-black/20 p-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400">
          {activeNode.era}
        </p>
        <h4 className="mt-1 text-base font-serif text-stone-100">
          {activeNode.label}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-stone-300">
          {activeNode.history}
        </p>
        {Array.isArray(activeNode.subLocations) && activeNode.subLocations.length > 0 && (
          <div className="mt-3 rounded border border-stone-800/80 bg-stone-950/40 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">
              Sub Locations
            </p>
            <p className="mt-1 text-xs text-stone-300">
              {activeNode.subLocations.join(' · ')}
            </p>
          </div>
        )}

        <div className="mt-4 border border-stone-800 rounded p-3 bg-stone-950/40">
          <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400">
            Artifact
          </p>
          <p className="mt-1 text-sm text-stone-100">{activeNode.artifact.name}</p>
          <p className="text-[11px] text-stone-400">{activeNode.artifact.class}</p>
          <p className="mt-2 text-xs text-stone-300">{activeNode.artifact.note}</p>
        </div>
      </div>
    </div>
  );
}
