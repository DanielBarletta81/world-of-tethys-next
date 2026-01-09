"use client";

import { useEffect, useState } from "react";

/**
 * Coarse/small detection without UA sniffing.
 * Returns: 'mobile' | 'tablet' | 'desktop'
 */
export default function useDeviceTier() {
  const [tier, setTier] = useState("desktop");

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;

    if (coarse && small) setTier("mobile");
    else if (coarse) setTier("tablet");
    else setTier("desktop");
  }, []);

  return tier;
}
// World of Tethys || D.C. Barletta
