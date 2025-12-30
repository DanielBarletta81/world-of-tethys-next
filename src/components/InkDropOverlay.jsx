'use client';

import { useEffect, useState } from 'react';

export default function InkDropOverlay() {
  const [envelope, setEnvelope] = useState(null);

  useEffect(() => {
    let timeoutId;

    const handler = (event) => {
      setEnvelope(event.detail);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setEnvelope(null), 4500);
    };

    window.addEventListener('tethys:inkdrop', handler);
    return () => {
      window.removeEventListener('tethys:inkdrop', handler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!envelope) return null;

  const style = {
    '--ink-x': `${(envelope.center?.x || 0.5) * 100}%`,
    '--ink-y': `${(envelope.center?.y || 0.5) * 100}%`,
    '--ink-radius': `${(envelope.radius || 0.2) * 100}%`,
    '--ink-color': envelope.color || 'rgba(226, 215, 197, 0.35)',
    '--ink-glow': envelope.glowIntensity || 0.3,
    filter: envelope.shaderStack?.length ? envelope.shaderStack.join(' ') : undefined
  };

  return (
    <div className="inkdrop-overlay" style={style}>
      <div className="inkdrop-core" />
      {envelope.hudMessage && <p className="inkdrop-hud">{envelope.hudMessage}</p>}
    </div>
  );
}
