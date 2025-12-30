'use client';

import { useEffect, useState } from 'react';

function formatWeight(weight) {
  if (!weight) return 'Evolution';
  const normalized = String(weight);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export default function DiscoveryToast() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let timeoutId = null;

    const handler = (event) => {
      const weight = event?.detail?.weight;
      const label = formatWeight(weight);
      setMessage(`Record consumed: +10 ${label}`);

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setMessage(null), 4500);
    };

    window.addEventListener('tethys:evolved', handler);
    return () => {
      window.removeEventListener('tethys:evolved', handler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!message) return null;

  return <div className="discovery-toast">{message}</div>;
}

