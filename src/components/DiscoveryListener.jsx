import { useEffect, useRef } from 'react';

/**
 * Triggers a discovery claim when the marker element is fully in view.
 * Expects a WP endpoint wired at /api/tethys/discover (proxied server-side).
 */
export default function DiscoveryListener({ postId, weight }) {
  const endRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(async (entries) => {
      const [entry] = entries;
      if (!entry?.isIntersecting) return;
      if (!postId) return;

      console.log(`Discovery Triggered: ${postId}`);

      try {
        const res = await fetch('/api/tethys/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post_id: postId, weight })
        });

        if (res.ok) {
          window.dispatchEvent(new CustomEvent('tethys:evolved', { detail: { weight } }));
          if (endRef.current) observer.unobserve(endRef.current);
        }
      } catch (error) {
        console.warn('Discovery claim failed', error);
      }
    }, { threshold: 1.0 });

    if (endRef.current) observer.observe(endRef.current);
    return () => observer.disconnect();
  }, [postId, weight]);

  return (
    <div ref={endRef} className="h-10 w-full flex items-center justify-center opacity-30">
      <span className="font-mono text-xs italic">--- End of Record ---</span>
    </div>
  );
}
