'use client';

import { useEffect, useState } from 'react';

export default function WordPressDebug({ endpoint = process.env.WORDPRESS_API_URL }) {
  const [status, setStatus] = useState({
    loading: true,
    ok: false,
    post: null,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function checkEndpoint() {
      if (!endpoint) {
        if (!cancelled) {
          setStatus({
            loading: false,
            ok: false,
            post: null,
            error: 'WORDPRESS_API_URL is not defined.'
          });
        }
        return;
      }

      try {
        const res = await fetch(`${endpoint}/posts?per_page=1`, { cache: 'no-store' });
        const posts = await res.json();
        if (!cancelled) {
          setStatus({
            loading: false,
            ok: res.ok,
            post: posts?.[0] || null,
            error: res.ok ? null : `Request failed with status ${res.status}`
          });
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({
            loading: false,
            ok: false,
            post: null,
            error: error.message
          });
        }
      }
    }

    checkEndpoint();

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  if (!endpoint) {
    return (
      <div className="p-4 m-4 border-2 border-dashed border-red-500 bg-red-950/30 text-red-200 font-mono text-xs rounded-2xl">
        <p className="font-bold">❌ EXPEDITION FAILED: Missing WORDPRESS_API_URL</p>
      </div>
    );
  }

  if (status.loading) {
    return (
      <div className="p-4 m-4 border-2 border-dashed border-amber-900 bg-stone-100 text-stone-900 font-mono text-xs rounded-2xl">
        <p className="font-bold animate-pulse">⏳ SCANNING FOR ARTEFACT SIGNALS...</p>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="p-4 m-4 border-2 border-dashed border-red-800 bg-red-100 text-red-900 font-mono text-xs rounded-2xl">
        <p className="font-bold">❌ EXPEDITION FAILED: {status.error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 m-4 border-2 border-dashed border-amber-900 bg-stone-100 text-stone-900 font-mono text-xs rounded-2xl">
      <p className="font-bold">
        🏺 ARCHAEOLOGICAL API LINK: {status.ok ? 'ACTIVE' : 'FAILED'}
      </p>
      {status.post && (
        <div className="mt-2">
          <p>
            Latest Artifact:{' '}
            <span className="italic">{status.post?.title?.rendered ?? 'Unknown'}</span>
          </p>
          <p className="opacity-50">Slug: {status.post?.slug ?? 'n/a'}</p>
        </div>
      )}
    </div>
  );
}
