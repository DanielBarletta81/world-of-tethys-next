'use client';

import { useMemo } from 'react';
import { useTethys } from '@/context/TethysContext';

const WATCHER_NEAR = new Set([
  'watcher-volcano',
  'watcher-flats',
  'purgess',
  'the-ledge'
]);

function resolvePathMode(pathId) {
  if (pathId === 'mystics' || pathId === 'mystic') return 'mystic';
  if (pathId === 'sky-city') return 'city';
  return 'wild';
}

export default function StatusBar() {
  const { playerProfile, currentLocation } = useTethys();
  const pathMode = useMemo(
    () => resolvePathMode(playerProfile?.path?.primary),
    [playerProfile?.path?.primary]
  );
  const watcherNear = WATCHER_NEAR.has(currentLocation);
  const pathLabel =
    playerProfile?.path?.primary?.replace('-', ' ') || 'wild';

  return (
    <div className={`tethys-status-bar mode-${pathMode}`}>
      <div className="status-veil" aria-hidden="true" />
      {pathMode === 'mystic' && <div className="status-spores" aria-hidden="true" />}
      {pathMode === 'city' && <div className="status-cracks" aria-hidden="true" />}
      {pathMode === 'wild' && watcherNear && (
        <div className="status-pulse" aria-hidden="true" />
      )}
      <div className="status-content">
        <span className="status-title">Tethys</span>
        <span className="status-divider" aria-hidden="true" />
        <span className="status-path">{pathLabel}</span>
        {currentLocation && (
          <>
            <span className="status-divider" aria-hidden="true" />
            <span className="status-location">{currentLocation}</span>
          </>
        )}
      </div>
      <style jsx>{`
        .tethys-status-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 44px;
          z-index: 40;
          border-bottom: 1px solid rgba(41, 37, 36, 0.8);
          background: rgba(12, 10, 9, 0.88);
          backdrop-filter: blur(6px);
          overflow: hidden;
        }

        .status-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(23, 19, 17, 0.6), rgba(12, 10, 9, 0.3));
          opacity: 0.6;
        }

        .status-content {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 18px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: rgba(231, 229, 228, 0.8);
        }

        .status-title {
          font-family: var(--font-serif);
          font-size: 12px;
          color: rgba(245, 158, 11, 0.75);
          letter-spacing: 0.28em;
        }

        .status-divider {
          width: 14px;
          height: 1px;
          background: rgba(120, 113, 108, 0.5);
        }

        .status-path,
        .status-location {
          font-family: var(--font-sans);
          font-size: 10px;
          color: rgba(214, 211, 209, 0.75);
        }

        .status-spores {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(rgba(132, 204, 22, 0.18) 1px, transparent 1.5px),
            radial-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1.5px);
          background-size: 26px 26px, 34px 34px;
          background-position: 0 0, 18px 12px;
          opacity: 0.35;
          animation: spores-drift 14s linear infinite;
        }

        .mode-mystic .status-content {
          color: rgba(190, 242, 100, 0.75);
        }

        .mode-mystic .status-title {
          color: rgba(132, 204, 22, 0.75);
        }

        .status-cracks {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(120deg, transparent 45%, rgba(148, 163, 184, 0.15) 46%, transparent 47%),
            linear-gradient(300deg, transparent 60%, rgba(148, 163, 184, 0.12) 61%, transparent 62%),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
          opacity: 0.4;
          animation: crack-flicker 8s ease-in-out infinite;
        }

        .mode-city .status-title {
          color: rgba(203, 213, 225, 0.8);
        }

        .mode-city .status-content {
          color: rgba(226, 232, 240, 0.7);
        }

        .status-pulse {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(30, 41, 59, 0.2), rgba(148, 163, 184, 0.05));
          opacity: 0.15;
          animation: pulse-desaturate 6s ease-in-out infinite;
        }

        .mode-wild .status-title {
          color: rgba(248, 113, 113, 0.55);
        }

        @keyframes spores-drift {
          0% {
            background-position: 0 0, 18px 12px;
          }
          100% {
            background-position: 120px 20px, 160px -10px;
          }
        }

        @keyframes crack-flicker {
          0%, 100% {
            opacity: 0.32;
          }
          50% {
            opacity: 0.48;
          }
        }

        @keyframes pulse-desaturate {
          0%, 100% {
            opacity: 0.08;
          }
          50% {
            opacity: 0.22;
          }
        }
      `}</style>
    </div>
  );
}
