'use client';

import { useEffect, useRef, useState } from 'react';

const SNAP_DISTANCE = 0.035;

export default function MapFragments({
  fragmentsConfig,
  stillnessReady,
  cambriaActive= false,
  onUnlock,
  onFracture
}) {
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const [fragments, setFragments] = useState(
   fragmentsConfig.map(f => ({
    ...f,
    pos: { x: Math.random(), y: Math.random() },
    snapped: false,
    fractured: false,
    drift: {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02
    }
  }))
);


  useEffect(() => {
  if (!stillnessReady) return;

  setFragments(fs =>
    fs.map(f => {
      if (f.snapped) return f;

      const target = cambriaActive
        ? {
            x: f.anchor.x + f.drift.x,
            y: f.anchor.y + f.drift.y
          }
        : f.anchor;

      const dx = f.pos.x - target.x;
      const dy = f.pos.y - target.y;

      if (dx * dx + dy * dy < SNAP_DISTANCE * SNAP_DISTANCE) {
        if (cambriaActive) {
          onFracture?.(f.region);
          return {
            ...f,
            pos: target,
            snapped: true,
            fractured: true
          };
        } else {
          onUnlock?.(f.region);
          return {
            ...f,
            pos: f.anchor,
            snapped: true
          };
        }
      }

      return f;
    })
  );
}, [stillnessReady, cambriaActive, onUnlock, onFracture]);


  const move = (e) => {
    if (!dragging || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    setFragments(fs =>
      fs.map(f =>
        f.id === dragging ? { ...f, pos: { x, y } } : f
      )
    );
  };

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0"
      viewBox="0 0 100 100"
      onMouseMove={move}
      onMouseUp={() => setDragging(null)}
      onMouseLeave={() => setDragging(null)}
    >
      {fragments.map(f => (
        <g
          key={f.id}
          transform={`translate(${f.pos.x * 100} ${f.pos.y * 100})`}
          onMouseDown={() => setDragging(f.id)}
        >
          <rect
            x="-6"
            y="-6"
            width="12"
            height="12"
            rx="2"
            fill={
                f.fractured
                     ? '#7c2d12'   // burnt umber
                     : f.snapped
                     ? '#d97706'
                     : '#64748b'
  }
  opacity={f.fractured ? 0.75 : 0.85}
/>

        </g>
      ))}
    </svg>
  );
}
