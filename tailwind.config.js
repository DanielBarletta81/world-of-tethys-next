/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. FONTS (Connected to layout.js)
      fontFamily: {
        header: ['var(--font-header)', 'serif'], // Cinzel
        body: ['var(--font-body)', 'serif'],     // Newsreader
        mono: ['var(--font-mono)', 'monospace'], // JetBrains Mono
      },
      
      // 2. COLORS (Aligned with your "Stone/Ash" aesthetic)
      // I swapped your 'slate' hexes for 'stone' hexes to keep the "Ancient" warmth.
      colors: {
        'tethys-bg': '#0c0a09',     // Stone 950 (The Deep Dark)
        'tethys-card': '#1c1917',   // Stone 900 (The UI Cards)
        'tethys-muted': '#44403c',  // Stone 700 (Borders)
        
        // Faction Colors
        'amber-glow': '#f59e0b',    // Sky City / Oil
        'cyan-glow': '#22d3ee',     // Science / Echoes
        'emerald-glow': '#10b981',  // Ironwood / Nature
        'rose-glow': '#f43f5e',     // Danger / Magma
        
        // Paper/Study Mode
        'ancient-bg': '#e7e5e4',    // Stone 200
        'ancient-ink': '#292524',   // Stone 800
        'ancient-accent': '#78350f' // Amber 900
      },

      // 3. ANIMATIONS (The Magic)
      // These support the Weather, Login, and Whispers components
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'scan': 'scan 4s ease-in-out infinite',
        'fall': 'fall 10s linear infinite',
        'rain': 'rain 0.5s linear infinite',
        'flash': 'flash 4s infinite',
      },
      
      // 4. KEYFRAMES (The Math behind the Magic)
      keyframes: {
        scan: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '0% 100%' },
        },
        fall: {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        rain: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        flash: {
          '0%, 95%': { opacity: '0' },
          '96%': { opacity: '0.8' },
          '98%': { opacity: '0' },
          '99%': { opacity: '0.3' },
          '100%': { opacity: '0' },
        }
      },

      // 5. BACKGROUND IMAGES (Shortcuts)
      backgroundImage: {
        'noise': "url('/noise.svg')",
        'grid': "url('/grid-pattern.svg')",
      }
    },
  },
  plugins: [],
};