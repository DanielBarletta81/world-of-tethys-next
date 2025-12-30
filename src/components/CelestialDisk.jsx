'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CYCLE_LABEL = 'Cycle: Albian Awakening';

export default function CelestialDisk() {
  const [degrees, setDegrees] = useState(0);

  useEffect(() => {
    const updateRotation = () => {
      const now = new Date();
      const nextYear = new Date(now.getFullYear() + 1, 0, 1);
      const elapsed = nextYear - now;
      const progress = 1 - elapsed / (365 * 24 * 60 * 60 * 1000);
      setDegrees(progress * 360);
    };
    updateRotation();
    const timer = setInterval(updateRotation, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="celestial-disk-wrapper">
      <motion.div
        animate={{ rotate: degrees }}
        transition={{ type: 'spring', stiffness: 20, damping: 8 }}
        className="celestial-disk"
      >
        <img src="/logo-disk.png" alt="Tethys Celestial Disk" className="celestial-disk__image" />
      </motion.div>
      <p className="celestial-disk__label">{CYCLE_LABEL}</p>
    </div>
  );
}
