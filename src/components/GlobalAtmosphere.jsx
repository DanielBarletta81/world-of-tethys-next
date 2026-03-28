// src/components/GlobalAtmosphere.jsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTethys } from '@/context/TethysContext';
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

const OVERLAY_PLATES = [
  {
    id: 'obsidian',
    src: cdn('/img/bg/obsidian-coast-4k.jpg'),
    label: 'Obsidian Coast',
    meta: 'Archive Plate • Tethys Rim'
  },
  {
    id: 'magma',
    src: cdn('/img/bg/magma-forge-hero.jpg'),
    label: 'Magma Forge',
    meta: 'Watcher Proximity • Volcanic Shelf'
  },
  {
    id: 'parchment',
    src: cdn('/img/bg/parchment-map-table.png'),
    label: 'Survey Plates',
    meta: 'Cartographic Index • Field Memory'
  },
  {
    id: 'laboratory',
    src: cdn('/img/bg/laboratory-6515519.jpg'),
    label: 'Sky Vault',
    meta: 'Specimen Storage • Glass Tiers'
  }
];

const OVERLAY_INTERVAL_MS = 20 * 60 * 1000; // 20 minutes
const OVERLAY_FADE_SECONDS = 1200; // 20 minutes
const OVERLAY_INFO_FADE_SECONDS = 240; // 4 minutes

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'dawn';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
};

export default function GlobalAtmosphere({ siteVariant = 'world' }) {
  const pathname = usePathname();
  const isMystic = pathname?.startsWith('/mystics');
  const isAuthorVariant = siteVariant === 'author';
  const { worldState, atmosphereTelemetry, oracleLive } = useTethys();

  const theme = (() => {
    if (!pathname) return 'coast';
    if (pathname.startsWith('/mystics')) return 'mystic';
    if (pathname.startsWith('/portal') || pathname.startsWith('/peek') || pathname.startsWith('/login') || pathname.startsWith('/study') || pathname.startsWith('/home')) return 'sky';
    if (pathname.startsWith('/map') || pathname.startsWith('/locations') || pathname.startsWith('/signals') || pathname.startsWith('/stories')) return 'wild';
    if (pathname.startsWith('/science') || pathname.startsWith('/archive') || pathname.startsWith('/timeline')) return 'archive';
    return 'coast';
  })();

  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay);
  const [overlayIndex, setOverlayIndex] = useState(() =>
    Math.floor(Date.now() / OVERLAY_INTERVAL_MS) % OVERLAY_PLATES.length
  );

  useEffect(() => {
    const tick = () => setTimeOfDay(getTimeOfDay());
    const id = setInterval(tick, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setOverlayIndex((prev) => (prev + 1) % OVERLAY_PLATES.length);
    }, OVERLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const condition = useMemo(() => {
    const raw = worldState?.condition || atmosphereTelemetry?.condition || '';
    return String(raw || '').toLowerCase();
  }, [worldState?.condition, atmosphereTelemetry?.condition]);

  const threatLevel = useMemo(() => {
    const raw = oracleLive?.threat_level ?? worldState?.threat_level ?? atmosphereTelemetry?.threat_level;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? Math.max(1, Math.min(5, parsed)) : 1;
  }, [oracleLive?.threat_level, worldState?.threat_level, atmosphereTelemetry?.threat_level]);

  const veil = useMemo(() => {
    const timeFactor = {
      dawn: 0.05,
      day: 0.03,
      dusk: 0.06,
      night: 0.08
    }[timeOfDay] ?? 0.04;

    const weatherFactor = condition === 'storm'
      ? 0.14
      : condition === 'rain'
        ? 0.11
        : condition === 'fog'
          ? 0.12
          : 0.08;

    const watcherFactor = (threatLevel - 1) / 4;

    const noiseOpacity = Math.min(0.2, 0.05 + timeFactor + watcherFactor * 0.05);
    const fogOpacity = Math.min(0.32, 0.08 + weatherFactor + watcherFactor * 0.12);
    const veilOpacity = Math.min(0.55, 0.26 + timeFactor + watcherFactor * 0.16);

    return { noiseOpacity, fogOpacity, veilOpacity };
  }, [timeOfDay, condition, threatLevel]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isAuthorVariant) {
      document.body.classList.remove('mystic-path');
      document.body.dataset.tethysTheme = 'author';
      document.documentElement.style.setProperty('--tethys-noise-opacity', '0.04');
      document.documentElement.style.setProperty('--tethys-fog-opacity', '0.06');
      document.documentElement.style.setProperty('--tethys-veil-opacity', '0.1');
      return () => {
        delete document.body.dataset.tethysTheme;
      };
    }
    document.body.classList.toggle('mystic-path', Boolean(isMystic));
    document.body.dataset.tethysTheme = theme;
    document.documentElement.style.setProperty('--tethys-noise-opacity', String(veil.noiseOpacity));
    document.documentElement.style.setProperty('--tethys-fog-opacity', String(veil.fogOpacity));
    document.documentElement.style.setProperty('--tethys-veil-opacity', String(veil.veilOpacity));
    return () => {
      document.body.classList.remove('mystic-path');
      delete document.body.dataset.tethysTheme;
    };
  }, [isAuthorVariant, isMystic, theme, veil.noiseOpacity, veil.fogOpacity, veil.veilOpacity]);
  
  const activeBg = SCENES[pathname] || SCENES['/'];
  const overlay = OVERLAY_PLATES[overlayIndex % OVERLAY_PLATES.length];

  if (isAuthorVariant) {
    return (
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#f4efe6]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.22]"
          style={{ backgroundImage: `url(${cdn('/img/bg/parchment-map-table.png')})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,247,230,0.88),rgba(244,239,230,0.94)_45%,rgba(226,214,196,0.98))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#e6d8c3]/90" />
        <div
          className="absolute inset-0 mix-blend-multiply opacity-[0.08]"
          style={{
            backgroundImage: `url(${cdn('/noise.svg')})`,
            backgroundSize: '420px 420px',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[28vh] bg-[radial-gradient(120%_120%_at_50%_120%,rgba(78,137,154,0.26),rgba(78,137,154,0)_64%)] mix-blend-screen opacity-60" />
        <div
          className="absolute inset-x-0 bottom-0 h-[24vh] opacity-[0.2] mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(100deg, rgba(255,255,255,0.26) 0 2px, transparent 2px 16px)',
            animation: 'author-sea-sheen 18s linear infinite',
          }}
        />
        <div className="absolute -bottom-24 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,65,30,0.16),rgba(120,65,30,0)_68%)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.35, scale: 1 }} // Low opacity to blend with your dark UI
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat tethys-parallax tethys-parallax--slow"
          style={{ backgroundImage: `url(${activeBg})` }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`overlay-${overlay?.id}`}
          initial={{ opacity: 0, filter: 'blur(10px) saturate(1.1)' }}
          animate={{ opacity: 0.14, filter: 'blur(0px) saturate(1.05)' }}
          exit={{ opacity: 0, filter: 'blur(10px) saturate(1.1)' }}
          transition={{ duration: OVERLAY_FADE_SECONDS, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat tethys-parallax tethys-parallax--fast"
          style={{ backgroundImage: `url(${overlay?.src})` }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`overlay-info-${overlay?.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.45, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: OVERLAY_INFO_FADE_SECONDS, ease: 'easeInOut' }}
          className="absolute bottom-6 left-6 z-[2] pointer-events-none text-[10px] uppercase tracking-[0.35em] text-stone-300/80 font-mono"
        >
          <div>{overlay?.label}</div>
          <div className="text-[9px] tracking-[0.3em] text-stone-400/70">{overlay?.meta}</div>
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: 'var(--tethys-veil-opacity, 0.35)' }}
      />

      {/* THE "111 MYA" FILTER STACK */}
      
      {/* 1. Vignette: Darkens corners to focus eyes on center content */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0c0a09_90%)]" />
      {/* Corner mask: deeper edge falloff for archival feel */}
      <div className="absolute inset-0 tethys-corner-mask" />

      {/* 2. Ash/Grain: Makes it feel like an old film or dusty air */}
      <div
        className="absolute inset-0 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url(${cdn('/noise.svg')})`,
          opacity: 'var(--tethys-noise-opacity, 0.1)'
        }}
      />

      {/* 3. Color Grade: Unifies disparate images into your "Magma" palette */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-cyan-900/20 mix-blend-color" />
      
      {/* 4. The "Weep" Mist (Optional: Subtle moving fog at bottom) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent"
        style={{ opacity: 'var(--tethys-fog-opacity, 0.14)' }}
      />

      {/* 5. Tethys ambient layers (theme-driven, CSS-controlled) */}
      <div className="tethys-layer tethys-layer--sea-reflection" />
      <div className="tethys-layer tethys-layer--sea-sheen" />
      <div className="tethys-layer tethys-layer--torch" />
      <div className="tethys-layer tethys-layer--scrolls" />
      <div className="tethys-layer tethys-layer--mushrooms" />
      <div className="tethys-layer tethys-layer--vines" />
      <div className="tethys-layer tethys-layer--glowtide" />
    </div>
  );
}
// World of Tethys || D.C. Barletta
