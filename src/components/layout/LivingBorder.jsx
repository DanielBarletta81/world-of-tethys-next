'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LivingBorder() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Generate page-specific variation seed
  const seed = pathname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variation = seed % 5; // 5 different variations
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Top Border - Ferns and Cycads */}
      <div className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-[100] overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1920 128"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fernGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2d5016" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1a3a0e" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="cycadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3a5c1f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#243612" stopOpacity="0.8" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4"/>
            </filter>
          </defs>

          {/* Cycad fronds - left corner */}
          <g className="cycad-group-left" style={{ transformOrigin: '100px 20px' }}>
            <path
              d="M 80 15 Q 70 25, 85 35 Q 95 45, 75 55 Q 60 65, 70 75 Q 80 85, 60 95"
              stroke="url(#cycadGradient)"
              strokeWidth="3"
              fill="none"
              className="cycad-frond"
              style={{ animationDelay: `${variation * 0.3}s` }}
            />
            <path
              d="M 100 10 Q 85 22, 95 38 Q 105 50, 90 62 Q 75 74, 85 86"
              stroke="url(#cycadGradient)"
              strokeWidth="2.5"
              fill="none"
              className="cycad-frond"
              style={{ animationDelay: `${variation * 0.3 + 0.5}s` }}
            />
            <path
              d="M 120 8 Q 110 24, 118 40 Q 125 55, 112 68"
              stroke="url(#cycadGradient)"
              strokeWidth="2"
              fill="none"
              className="cycad-frond"
              style={{ animationDelay: `${variation * 0.3 + 0.8}s` }}
            />
          </g>

          {/* Fern fronds - cascading across top */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const x = 200 + i * 180 + (variation * 30);
            const offset = (i + variation) % 3;
            return (
              <g key={i} className="fern-group" style={{ transformOrigin: `${x}px 0px` }}>
                <path
                  d={`M ${x} 0 Q ${x - 15} 15, ${x - 8} 30 Q ${x} 45, ${x - 12} 60 Q ${x - 5} 75, ${x - 15} 90`}
                  stroke="url(#fernGradient)"
                  strokeWidth="2"
                  fill="none"
                  className="fern-stem"
                  filter="url(#shadow)"
                  style={{ animationDelay: `${i * 0.2 + variation * 0.15}s` }}
                />
                {/* Fern leaves */}
                {[0, 1, 2, 3, 4].map((j) => (
                  <ellipse
                    key={j}
                    cx={x - 8 - (j % 2) * 8}
                    cy={20 + j * 15}
                    rx="8"
                    ry="3"
                    fill="#2d5016"
                    opacity="0.8"
                    className="fern-leaf"
                    style={{ animationDelay: `${i * 0.2 + j * 0.1 + variation * 0.15}s` }}
                  />
                ))}
              </g>
            );
          })}

          {/* Cycad cluster - right corner */}
          <g className="cycad-group-right" style={{ transformOrigin: '1820px 20px' }}>
            <path
              d="M 1840 15 Q 1850 25, 1835 35 Q 1825 45, 1845 55 Q 1860 65, 1850 75 Q 1840 85, 1860 95"
              stroke="url(#cycadGradient)"
              strokeWidth="3"
              fill="none"
              className="cycad-frond"
              style={{ animationDelay: `${variation * 0.4}s` }}
            />
            <path
              d="M 1820 10 Q 1835 22, 1825 38 Q 1815 50, 1830 62 Q 1845 74, 1835 86"
              stroke="url(#cycadGradient)"
              strokeWidth="2.5"
              fill="none"
              className="cycad-frond"
              style={{ animationDelay: `${variation * 0.4 + 0.6}s` }}
            />
          </g>
        </svg>
      </div>

      {/* Right Border - Climbing Vines */}
      <div className="fixed top-28 right-0 bottom-0 w-24 pointer-events-none z-[100] overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 96 1080"
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="vineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3d5c28" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2a4019" stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id="flowerGradient">
              <stop offset="0%" stopColor="#e8b86d" />
              <stop offset="50%" stopColor="#d4964f" />
              <stop offset="100%" stopColor="#b87333" />
            </radialGradient>
          </defs>

          {/* Main vine */}
          <path
            d={`M 48 0 Q 35 100, 45 200 Q 55 300, 42 400 Q 30 500, 48 600 Q 60 700, 45 800 Q 35 900, 48 1000 Q 55 1080, 48 1080`}
            stroke="url(#vineGradient)"
            strokeWidth="3"
            fill="none"
            className="vine-main"
            filter="url(#shadow)"
          />

          {/* Vine leaves */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const y = 80 + i * 90 + (variation * 15);
            const x = 45 + ((i + variation) % 2) * 10;
            const size = 8 + ((i + variation) % 3) * 2;
            return (
              <g key={i} style={{ transformOrigin: `${x}px ${y}px` }}>
                <ellipse
                  cx={x}
                  cy={y}
                  rx={size}
                  ry={size * 0.6}
                  fill="#3d5c28"
                  opacity="0.85"
                  className="vine-leaf"
                  style={{ animationDelay: `${i * 0.3 + variation * 0.2}s` }}
                />
                {/* Occasional flowers */}
                {i % 3 === variation % 3 && (
                  <circle
                    cx={x - 2}
                    cy={y - 8}
                    r="4"
                    fill="url(#flowerGradient)"
                    className="flower"
                    style={{ animationDelay: `${i * 0.3 + 2}s` }}
                  />
                )}
              </g>
            );
          })}

          {/* Secondary vine tendrils */}
          <path
            d="M 45 200 Q 30 220, 35 240"
            stroke="#3d5c28"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
            className="vine-tendril"
            style={{ animationDelay: `${variation * 0.5}s` }}
          />
          <path
            d="M 48 450 Q 25 465, 30 485"
            stroke="#3d5c28"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
            className="vine-tendril"
            style={{ animationDelay: `${variation * 0.5 + 1}s` }}
          />
          <path
            d="M 45 750 Q 28 768, 32 790"
            stroke="#3d5c28"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
            className="vine-tendril"
            style={{ animationDelay: `${variation * 0.5 + 1.5}s` }}
          />
        </svg>
      </div>

      {/* Left Border - Bromeliads and Ground Ferns */}
      <div className="fixed top-28 left-0 bottom-0 w-20 pointer-events-none z-[100] overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 80 1080"
          preserveAspectRatio="xMinYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground ferns climbing up */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const y = 100 + i * 130 + (variation * 20);
            const x = 40 - ((i + variation) % 2) * 5;
            return (
              <g key={i} className="ground-fern" style={{ transformOrigin: `${x}px ${y}px` }}>
                <path
                  d={`M ${x} ${y + 30} Q ${x + 8} ${y + 15}, ${x + 5} ${y} Q ${x + 2} ${y - 10}, ${x + 8} ${y - 20}`}
                  stroke="#2d5016"
                  strokeWidth="2"
                  fill="none"
                  className="fern-stem-small"
                  style={{ animationDelay: `${i * 0.4 + variation * 0.25}s` }}
                />
                {[0, 1, 2, 3].map((j) => (
                  <ellipse
                    key={j}
                    cx={x + 6}
                    cy={y + 25 - j * 10}
                    rx="6"
                    ry="2.5"
                    fill="#2d5016"
                    opacity="0.75"
                    className="fern-leaf-small"
                    style={{ animationDelay: `${i * 0.4 + j * 0.15 + variation * 0.25}s` }}
                  />
                ))}
              </g>
            );
          })}

          {/* Bromeliad clusters */}
          {[0, 1, 2, 3].map((i) => {
            const y = 250 + i * 220 + (variation * 35);
            const x = 25;
            return (
              <g key={i} className="bromeliad" style={{ transformOrigin: `${x}px ${y}px` }}>
                {/* Bromeliad rosette */}
                {[0, 1, 2, 3, 4, 5].map((j) => {
                  const angle = (j * 60 + variation * 10) * (Math.PI / 180);
                  const leafX = x + Math.cos(angle) * 12;
                  const leafY = y + Math.sin(angle) * 12;
                  return (
                    <ellipse
                      key={j}
                      cx={leafX}
                      cy={leafY}
                      rx="10"
                      ry="3"
                      fill="#3a5c1f"
                      opacity="0.8"
                      transform={`rotate(${j * 60 + variation * 10} ${leafX} ${leafY})`}
                      className="bromeliad-leaf"
                      style={{ animationDelay: `${i * 0.6 + j * 0.1 + variation * 0.3}s` }}
                    />
                  );
                })}
                {/* Center spike */}
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#d4964f"
                  className="bromeliad-center"
                  style={{ animationDelay: `${i * 0.6 + 1.5 + variation * 0.3}s` }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Border - Mosses and Small Plants */}
      <div className="fixed bottom-0 left-0 right-0 h-16 pointer-events-none z-[100] overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1920 64"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground moss texture */}
          {[...Array(40)].map((_, i) => {
            const x = i * 48 + (variation * 10);
            const height = 8 + ((i + variation) % 3) * 4;
            return (
              <rect
                key={i}
                x={x}
                y={64 - height}
                width="3"
                height={height}
                fill="#2a4019"
                opacity="0.6"
                className="moss-strand"
                style={{ animationDelay: `${i * 0.05 + variation * 0.1}s` }}
              />
            );
          })}

          {/* Small sprouting plants */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
            const x = 150 + i * 150 + (variation * 20);
            return (
              <g key={i} className="sprout" style={{ transformOrigin: `${x}px 60px` }}>
                <circle
                  cx={x}
                  cy="60"
                  r="2"
                  fill="#3d5c28"
                  className="sprout-base"
                  style={{ animationDelay: `${i * 0.3 + variation * 0.2}s` }}
                />
                <line
                  x1={x}
                  y1="60"
                  x2={x}
                  y2="50"
                  stroke="#3d5c28"
                  strokeWidth="1.5"
                  className="sprout-stem"
                  style={{ animationDelay: `${i * 0.3 + 0.3 + variation * 0.2}s` }}
                />
                <circle
                  cx={x}
                  cy="48"
                  r="1.5"
                  fill="#e8b86d"
                  className="sprout-flower"
                  style={{ animationDelay: `${i * 0.3 + 1 + variation * 0.2}s` }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <style jsx>{`
        /* Growth animations */
        .cycad-frond, .fern-stem, .vine-main {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: grow 3s ease-out forwards;
        }

        .cycad-group-left, .cycad-group-right {
          animation: sway 8s ease-in-out infinite;
        }

        .fern-group {
          animation: fernSway 6s ease-in-out infinite;
        }

        .fern-leaf, .fern-leaf-small {
          opacity: 0;
          animation: leafAppear 0.8s ease-out forwards;
        }

        .vine-leaf {
          opacity: 0;
          transform: scale(0);
          animation: leafGrow 1s ease-out forwards;
        }

        .flower {
          opacity: 0;
          transform: scale(0);
          animation: bloom 1.2s ease-out forwards;
        }

        .vine-tendril {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: grow 2s ease-out forwards;
        }

        .ground-fern {
          animation: gentleSway 7s ease-in-out infinite;
        }

        .bromeliad-leaf {
          opacity: 0;
          transform: scale(0);
          animation: leafGrow 1s ease-out forwards;
        }

        .bromeliad-center {
          opacity: 0;
          transform: scale(0);
          animation: bloom 0.8s ease-out forwards;
        }

        .moss-strand, .sprout-base {
          transform: scaleY(0);
          transform-origin: bottom;
          animation: mossGrow 1.5s ease-out forwards;
        }

        .sprout-stem {
          stroke-dasharray: 10;
          stroke-dashoffset: 10;
          animation: grow 1s ease-out forwards;
        }

        .sprout-flower {
          opacity: 0;
          transform: scale(0);
          animation: bloom 0.6s ease-out forwards;
        }

        @keyframes grow {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes leafAppear {
          to {
            opacity: 0.8;
          }
        }

        @keyframes leafGrow {
          to {
            opacity: 0.85;
            transform: scale(1);
          }
        }

        @keyframes bloom {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          60% {
            opacity: 1;
            transform: scale(1.1) rotate(10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-2deg);
          }
        }

        @keyframes fernSway {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(2px) rotate(1deg);
          }
        }

        @keyframes gentleSway {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(-1px) rotate(-1deg);
          }
        }

        @keyframes mossGrow {
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </>
  );
}
// World of Tethys || D.C. Barletta
