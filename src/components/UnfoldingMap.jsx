import { motion } from 'framer-motion';

const defaultPoints = [
  { id: 'spires', label: 'The Arid Spires', top: '25%', left: '32%' },
  { id: 'vault', label: 'Vault of Resonance', top: '55%', left: '58%' },
  { id: 'fen', label: 'Fen of Lanterns', top: '42%', left: '18%' }
];

export default function UnfoldingMap({ mapImageUrl = '/globe.svg', points = defaultPoints, onPointClick = () => {} }) {
  return (
    <div className="perspective-1000 flex justify-center items-center py-10">
      <motion.div
        initial={{ rotateX: 45, rotateY: -10, scale: 0.8, opacity: 0 }}
        whileInView={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="relative ancient-border w-full max-w-4xl shadow-[16px_16px_0_rgba(43,38,33,0.35)] overflow-hidden bg-[#e2d7c5]"
      >
        <img src={mapImageUrl} alt="Ancient Map" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
        {points.map((point) => (
          <button
            key={point.id}
            type="button"
            className="absolute group cursor-pointer"
            style={{ top: point.top, left: point.left }}
            onClick={() => onPointClick(point)}
            aria-label={`Open ${point.label}`}
          >
            <div className="w-3 h-3 bg-ancient-accent rounded-full animate-pulse shadow-[0_0_12px_rgba(122,58,35,0.8)]" />
            <span className="ink-bleed hidden group-hover:block absolute top-4 left-0 bg-[#f5efe4] p-2 text-xs font-display border border-ancient-ink min-w-[140px] text-left">
              Region: {point.label}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
