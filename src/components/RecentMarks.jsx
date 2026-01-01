'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function RecentMarks() {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    fetch('/api/tethys/sign_slate')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setMarks(data))
      .catch(() => {});
  }, []);

  if (!marks.length) return null;

  return (
    <div className="mt-6 border-t-2 border-[#3d2b1f]/10 pt-4">
      <p className="text-[9px] font-bold uppercase tracking-widest text-[#5c4f43] mb-3">Recent Traces</p>
      <div className="space-y-3">
        {marks.map((mark, i) => (
          <motion.div
            key={`${mark.handle}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            className="text-xs font-mono text-[#5c4f43]"
          >
            <span className="text-[#8a3c23] font-bold">{mark.handle}</span>
            <span className="mx-1 opacity-50">::</span>
            <span className="italic opacity-80">"{mark.message}"</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
