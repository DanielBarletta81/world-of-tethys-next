import { motion } from 'framer-motion';

export function MigrationPath({ points }) {
  if (!points) return null;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <motion.polyline
        points={points}
        fill="none"
        stroke="#7a3a23"
        strokeWidth="0.6"
        strokeDasharray="3,3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 10, ease: 'linear' }}
      />
    </svg>
  );
}

export function BattleRevelation({ x, y, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6 }}
      className="absolute pointer-events-auto"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <img src="/assets/icons/ink-swords.png" alt="Battle marker" className="w-8 h-8 mix-blend-multiply" />
      {description && <div className="text-[10px] font-mono bg-white/70 px-2 py-1 mt-1 border border-ancient-ink/30">{description}</div>}
    </motion.div>
  );
}
