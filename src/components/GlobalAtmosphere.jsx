// src/components/GlobalAtmosphere.jsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cdn from '@/lib/cdn';

// Map your routes to high-quality scenic backgrounds
// Use Getty/Stock images here. 
// TIP: Use images with "Fog", "Volcanic Ash", or "Underwater" themes.
const SCENES = {
  '/': cdn('/img/bg/obsidian-coast-4k.jpg'),       // Dark, volcanic shore
  '/study': cdn('/img/bg/laboratory-6515519.jpg'), // Ancient stone shelves, dust motes
  '/mystics': cdn('/forest-2107470.jpg'),          // Dark jungle, glowing spores
  '/science': cdn('/img/bg/laboratory-6515519.jpg'), // Clean, cold light, bones
  '/map': cdn('/img/bg/parchment-map-table.png'),  // Top-down wooden table feel
};

export default function GlobalAtmosphere() {
  const pathname = usePathname();
  const isMystic = pathname?.startsWith('/mystics');

  const theme = (() => {
    if (!pathname) return 'coast';
    if (pathname.startsWith('/mystics')) return 'mystic';
    if (pathname.startsWith('/portal') || pathname.startsWith('/peek') || pathname.startsWith('/login') || pathname.startsWith('/study') || pathname.startsWith('/home')) return 'sky';
    if (pathname.startsWith('/map') || pathname.startsWith('/locations') || pathname.startsWith('/signals') || pathname.startsWith('/stories')) return 'wild';
    if (pathname.startsWith('/science') || pathname.startsWith('/archive') || pathname.startsWith('/timeline')) return 'archive';
    return 'coast';
  })();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('mystic-path', Boolean(isMystic));
    document.body.dataset.tethysTheme = theme;
    return () => {
      document.body.classList.remove('mystic-path');
      delete document.body.dataset.tethysTheme;
    };
  }, [isMystic, theme]);
  
  // Default to the main coast if route not found
  const activeBg = SCENES[pathname] || SCENES['/'];

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }} // Low opacity to blend with your dark UI
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${activeBg})` }}
        />
      </AnimatePresence>

      {/* THE "111 MYA" FILTER STACK */}
      
      {/* 1. Vignette: Darkens corners to focus eyes on center content */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0c0a09_90%)]" />

      {/* 2. Ash/Grain: Makes it feel like an old film or dusty air */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url(${cdn('/noise.svg')})` }}
      />

      {/* 3. Color Grade: Unifies disparate images into your "Magma" palette */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-cyan-900/20 mix-blend-color" />
      
      {/* 4. The "Weep" Mist (Optional: Subtle moving fog at bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

      {/* 5. Tethys ambient layers (theme-driven, CSS-controlled) */}
      <div className="tethys-layer tethys-layer--torch" />
      <div className="tethys-layer tethys-layer--scrolls" />
      <div className="tethys-layer tethys-layer--mushrooms" />
      <div className="tethys-layer tethys-layer--vines" />
      <div className="tethys-layer tethys-layer--glowtide" />
    </div>
  );
}
// World of Tethys || D.C. Barletta
