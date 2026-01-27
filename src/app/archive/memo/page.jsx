'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ArtifactPlate from '@/components/ArtifactPlate';
import { ARCHIVE_DOCUMENTS } from '@/data/archive-documents';

export default function ArchiveMemoPage() {
  const [selectedId, setSelectedId] = useState(
    'betrayal_001_missing_measurement'
  );
  const [redacted, setRedacted] = useState(false);

  const memo = useMemo(() => {
    if (
      selectedId === 'betrayal_001_missing_measurement' ||
      selectedId === 'betrayal_001_missing_measurement_redacted'
    ) {
      const targetId = redacted
        ? 'betrayal_001_missing_measurement_redacted'
        : 'betrayal_001_missing_measurement';
      return ARCHIVE_DOCUMENTS.find((doc) => doc.id === targetId);
    }

    return ARCHIVE_DOCUMENTS.find((doc) => doc.id === selectedId);
  }, [redacted, selectedId]);

  const artifact = memo
    ? {
        id: memo.id,
        slug: memo.slug,
        title: memo.render.titleHtml,
        content: memo.render.bodyHtml,
        image: null
      }
    : null;

  const metadata = memo?.db ?? null;

  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif p-8 bg-stone-grain">
      <div className="max-w-5xl mx-auto">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/archive"
            className="text-xs uppercase tracking-widest text-[#57534e] hover:text-amber-600"
          >
            Back to Archive
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
              Document
            </label>
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="bg-[#0f0b09] border border-amber-700/40 text-stone-200 text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full"
            >
              {ARCHIVE_DOCUMENTS.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                  {doc.subtitle ? ` — ${doc.subtitle}` : ''}
                </option>
              ))}
            </select>
            {selectedId === 'betrayal_001_missing_measurement' ||
            selectedId === 'betrayal_001_missing_measurement_redacted' ? (
              <button
                type="button"
                onClick={() => setRedacted((value) => !value)}
                className="text-[10px] uppercase tracking-[0.2em] text-amber-300 border border-amber-700/60 px-3 py-1 rounded-full hover:border-amber-400 hover:text-amber-200 transition-colors"
              >
                {redacted ? 'Show Full Memo' : 'Show Redacted Memo'}
              </button>
            ) : null}
          </div>
        </nav>

        {metadata && (
          <div className="mb-6 flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <span>Classification: {metadata.classification}</span>
            <span>Seal: {metadata.sealId}</span>
            <span>Parchment: {metadata.parchmentId}</span>
            <span>Witness: {metadata.witness}</span>
          </div>
        )}

        {artifact ? (
          <ArtifactPlate artifact={artifact} />
        ) : (
          <div className="text-sm text-stone-400">Memo not found.</div>
        )}
      </div>
    </main>
  );
}
// World of Tethys || D.C. Barletta
