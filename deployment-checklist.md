# World of Tethys: Deployment Checklist (v1.0)

## 1. Environment Variables (.env.local & Vercel)
Ensure these are set in your local `.env` file and added to your Vercel Project Settings.

- [ ] `NEXT_PUBLIC_WP_URL`: `https://cms.dcbarletta.com` (NO trailing slash!)
- [ ] `WP_USER`: Your WordPress Username
- [ ] `WP_APP_PASS`: Your Application Password (without spaces)
- [ ] `GEMINI_API_KEY`: API Key for the Bio-Chimera Lab (Google AI Studio)
- [ ] `AMAZON_BOOK_URL`: Link to your book listing (for the Footer/Modal)
- [ ] `WORDPRESS_API_URL`: (Optional) Fallback for server-side actions, usually same as NEXT_PUBLIC_WP_URL.

---

## 2. WordPress Configuration (CPT UI & ACF)
The frontend will crash (500 Error) if these endpoints don't exist in the CMS.

### Custom Post Types (CPT UI)
- [ ] **Archives** (`archival_post`)
    - REST API Base Slug: `archival_post`
    - Show in REST API: `True`
- [ ] **World Events** (`tethys_event`)
    - REST API Base Slug: `tethys_event`
    - Show in REST API: `True`
- [ ] **Guest Signatures** (`guest_signature`)
    - REST API Base Slug: `guest_signature`
    - Show in REST API: `True`
    - Supports: `Title`, `Editor`

### Custom Fields (ACF)
- [ ] **Group: Archive Logic** (Location: `archival_post`)
    - `map_coords` (Group) -> `map_x`, `map_y`
    - `proxy_city` (Text) -> For weather (e.g., "Kathmandu")
- [ ] **Group: Event Logic** (Location: `tethys_event`)
    - `event_timing` (Group) -> `start_time`, `end_time`
    - `effect_payload` (Text Area/JSON)

---

## 3. New Files & Routes
Verify these files are created and contain the latest code we wrote.

### API Routes (The "Backstage")
- [ ] `src/app/api/tethys/sign_slate/route.js` (The Guestbook Proxy)
- [ ] `src/app/api/tethys/weather/route.js` (Open-Meteo Proxy)
- [ ] `src/app/api/tethys/[...slug]/route.js` (General WP Proxy)

### Pages (The "Stage")
- [ ] `src/app/page.js` (The Overseer Map + Landing Sequence)
- [ ] `src/app/science/page.js` (The Annex + Factory)

### Components (The "Actors")
- [ ] `src/components/LandingSequence.jsx` (The "Weep" Animation)
- [ ] `src/components/CelestialDisk.jsx` (New Year's Countdown)
- [ ] `src/components/BioChimeraLab.jsx` (The Genetic Inventory)
- [ ] `src/components/PunnettScrambler.jsx` (Student Guide)
- [ ] `src/components/TheBlankSlate.jsx` (Guestbook UI)
- [ ] `src/components/CharacterCarousel.jsx` (The Cambrian Nine)

---

## 4. Asset Manifest (/public)
Ensure these images and SVGs are present to avoid "broken image" icons.

### SVGs (The "Inked" Icons)
- [ ] `public/logo-disk.svg` (For CelestialDisk)
- [ ] `public/globe.svg` (For Map Background)
- [ ] `public/window.svg` (For Geode Icons)
- [ ] `public/file.svg` (For Biodiversity Icons)
- [ ] `public/vercel.svg` (The Wild Hybrid Icon)

### Images (The "Atmosphere")
- [ ] `public/watcher-ashfall.jpg` (Landing Sequence background)
- [ ] `public/extinction-sketch.jpg` (Science Page header background)
- [ ] `public/chimera-tank.jpg` (Factory empty state)
- [ ] `public/textures/edge-burn.png` (For CSS masking/vignette)

---

## 5. Final "Willy Wonka" Polish
- [ ] **Footer Check:** Does it say "Author D.C. Barletta - Architect of the Dinosaur Factory"?
- [ ] **Amazon Link:** Does the "Acquire Full Record" button work?
- [ ] **CSS Blending:** Check `globals.css` for the `img[src$=".svg"] { mix-blend-mode: multiply; }` rule.
- [ ] **Permalinks:** Go to WordPress Settings > Permalinks and click **Save Changes** one last time to flush the API rules.

---

### Ready for Launch?
Run `npm run build` locally first. If it passes without linting errors, push to Vercel and watch the deployments tab.