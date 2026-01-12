'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import ArtifactPlate from '@/components/ArtifactPlate';
import { ARCHIVE_DOCUMENTS } from '@/data/archive-documents';

export default function ArchiveAftermathPage() {
  const document = useMemo(
    () =>
      ARCHIVE_DOCUMENTS.find((doc) => doc.id === 'betrayal_001_aftermath_absence'),
    []
  );

  const artifact = document
    ? {
        id: document.id,
        slug: document.slug,
        title: document.render.titleHtml,
        content: document.render.bodyHtml,
        image: null
      }
    : null;

  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif p-8 bg-stone-grain">
      <div className="max-w-5xl mx-auto">
        <nav className="mb-8">
          <Link
            href="/archive"
            className="text-xs uppercase tracking-widest text-[#57534e] hover:text-amber-600"
          >
            Back to Archive
          </Link>
        </nav>

        {artifact ? (
          <ArtifactPlate artifact={artifact} />
        ) : (
          <div className="text-sm text-stone-400">Document not found.</div>
        )}
      </div>
    </main>
  );
}
// World of Tethys || D.C. Barletta
