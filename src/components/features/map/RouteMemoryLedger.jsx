function formatRegionLabel(regionId = '') {
  return regionId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export default function RouteMemoryLedger({ memory = {}, limit = 6 }) {
  const rows = Object.entries(memory)
    .map(([regionId, data]) => {
      const good = Number(data?.good || 0);
      const bad = Number(data?.bad || 0);
      const neutral = Number(data?.neutral || 0);
      return {
        regionId,
        label: formatRegionLabel(regionId),
        good,
        bad,
        neutral,
        total: good + bad + neutral,
        dangerIndex: Math.max(0, bad - good)
      };
    })
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total || b.dangerIndex - a.dangerIndex)
    .slice(0, limit);

  if (!rows.length) {
    return (
      <div className="bg-[#11100f] p-6 border border-stone-800 rounded-lg">
        <h3 className="text-stone-400 text-xs uppercase tracking-widest mb-3">Route Memory</h3>
        <p className="text-xs text-stone-500">
          No route memories yet. Travel and survive to map good and bad corridors.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#11100f] p-6 border border-stone-800 rounded-lg">
      <h3 className="text-stone-400 text-xs uppercase tracking-widest mb-3">Route Memory</h3>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.regionId} className="rounded border border-stone-800 bg-black/20 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-stone-200">{row.label}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                {row.total} runs
              </p>
            </div>
            <p className="mt-1 text-[11px] text-stone-400">
              Good {row.good} / Bad {row.bad} / Neutral {row.neutral}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
