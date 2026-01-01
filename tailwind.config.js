const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tethys-bg': '#020617',
        'tethys-card': '#0f172a',
        'tethys-muted': '#334155',
        'tethys-gold': '#fbbf24',
        'tethys-dark': '#0f172a',
        'sync-violet': '#8b5cf6',
        'oil-gold': '#f59e0b',
        'oil-dark': '#78350f',
        'nute-green': '#10b981',
        'sync-glow': '#22d3ee',
        'nute-emerald': '#10b981',
        'dissonant-red': '#ef4444',
        'ancient-bg': '#e2d7c5',
        'ancient-ink': '#2b2621',
        'ancient-accent': '#7a3a23'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"EB Garamond"', 'serif'],
        mono: ['"Courier Prime"', 'monospace'],
        serif: ['"Crimson Pro"', 'serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 60px rgba(34, 211, 238, 0.4)',
        'glow-red': '0 0 40px rgba(239, 68, 68, 0.6)'
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.clip-path-pyramid': {
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }
      });
    })
  ]
};
