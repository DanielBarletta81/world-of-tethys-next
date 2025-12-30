// components/InkReveal.jsx
export default function InkReveal({ isDiscovered, children }) {
  return (
    <div className={`reveal-container ${isDiscovered ? 'active' : ''}`}>
      <svg width="0" height="0">
        <filter id="inkDistort">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" />
          <feDisplacementMap in="SourceGraphic" scale="20" />
        </filter>
      </svg>
      
      <div className="ink-content">
        {children}
      </div>

      <style jsx>{`
        .reveal-container {
          position: relative;
          filter: url(#inkDistort);
          opacity: 0;
          transition: opacity 1.5s ease-in;
        }
        .reveal-container.active {
          opacity: 1;
          animation: inkSpread 3s forwards;
        }
        @keyframes inkSpread {
          0% { clip-path: circle(0% at 50% 50%); filter: blur(10px); }
          50% { filter: blur(2px); }
          100% { clip-path: circle(100% at 50% 50%); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}