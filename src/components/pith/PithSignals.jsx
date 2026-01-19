'use client';

const SIGNALS = [
  [1, 1, 0, 1, 0, 0, 1],
  [0, 1, 0, 0, 1, 1],
  [1, 0, 0, 1, 0, 1, 1],
  [0, 0, 1, 0, 1]
];

export default function PithSignals() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400/60">
      {SIGNALS.map((signal, idx) => (
        <div
          key={`pith-signal-${idx}`}
          aria-hidden="true"
          className="flex items-center gap-1 pith-signal"
        >
          {signal.map((pulse, i) => (
            <span
              key={`pith-pulse-${idx}-${i}`}
              className={`block ${pulse ? 'pith-dot' : 'pith-dash'}`}
            />
          ))}
        </div>
      ))}
      <style jsx>{`
        .pith-signal {
          filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.08));
        }
        .pith-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.6);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.12);
          animation: pithPulse 6s ease-in-out infinite;
        }
        .pith-dash {
          width: 14px;
          height: 4px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.5);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
          animation: pithPulse 7s ease-in-out infinite;
        }
        @keyframes pithPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pith-dot, .pith-dash { animation: none; opacity: 0.65; }
        }
      `}</style>
    </div>
  );
}
