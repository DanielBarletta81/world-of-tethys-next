/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";

const TORCH_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <path fill="#f6f0e6" d="M30 30h4v22h-4z"/>
  <path fill="#f6f0e6" d="M26 52h12v6H26z"/>
  <path fill="#ffb35a" d="M32 6c6 6 8 10 6 16-2 6-6 8-6 12 0-4-4-6-6-12-2-6 0-10 6-16z"/>
  <path fill="#8cd2c6" opacity=".35" d="M32 10c3 4 4 7 3 10-1 3-3 4-3 6 0-2-2-3-3-6-1-3 0-6 3-10z"/>
</svg>
`)}`;

export function useTorchCursor(enabled=true){
  const lightRef = useRef(null);
  const glyphRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      if (lightRef.current) {
        lightRef.current.style.left = `${x}px`;
        lightRef.current.style.top = `${y}px`;
      }
      if (glyphRef.current) {
        glyphRef.current.style.left = `${x}px`;
        glyphRef.current.style.top = `${y}px`;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  const TorchLayer = enabled ? (
    <div className="torch-layer">
      <div ref={lightRef} className="torch-light" />
      <img ref={glyphRef} className="torch-glyph" src={TORCH_SVG} alt="" />
    </div>
  ) : null;

  return { TorchLayer };
}
