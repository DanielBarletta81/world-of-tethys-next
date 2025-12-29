'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AnaphaseWrapper({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scaleY: 1.1, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scaleY: 0.9, filter: 'blur(20px)' }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
