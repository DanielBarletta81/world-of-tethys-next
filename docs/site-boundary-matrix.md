# Site Boundary Matrix

This matrix maps the current codebase into two products:

- `dcbarletta.com`
- `worldoftethys.com`

The goal is to reduce load on the author site while keeping author, book, and press intent on `dcbarletta.com`.

## Keep on `dcbarletta.com`

These are author-facing, promotional, or conversion-oriented:

### Pages

- `/`
- `/home`
- `/author`
- `/about-dc-barletta`
- `/contact`
- `/press-kit`
- `/privacy`
- `/terms`
- `/world-of-tethys-book-1`
- optionally `/bookstore` if it stays sales-oriented

### What these pages should become

- lighter layouts
- fewer heavy visuals
- minimal interactive media
- clear links out to `worldoftethys.com`

### API routes that may stay if needed

- none required for a lean author site by default

If a simple contact or newsletter flow is added later, keep that isolated and separate from Tethys world systems.

## Move to `worldoftethys.com`

These are the main world product:

### Core world routes

- `/world`
- `/world/map`
- `/world-of-tethys`
- `/world-of-tethys/sky-city`
- `/world-of-tethys/stryker`
- `/world-of-tethys/the-watcher-volcano`
- `/world-of-tethys/ironwood-forest`
- `/world-of-tethys/pterosaurs`
- `/world-of-tethys/danian-delta`
- `/locations/[slug]`
- `/creatures`
- `/timeline`
- `/archive`
- `/archive/[category]`
- `/archive/aftermath`
- `/archive/memo`

### Writing-first world/archive routes

- `/blog`
- `/blog/could-humans-survive-age-of-dinosaurs`
- `/blog/ecology-of-volcanic-forests`
- `/blog/life-after-the-permian-extinction`
- `/blog/why-pterosaurs-ruled-the-ancient-sky`
- `/natural-history`
- `/natural-history/pterosaurs`
- `/natural-history/life-after-the-permian-extinction`
- `/natural-history/could-humans-survive-dinosaur-era`
- `/study`
- `/stories/the-weep`

### Interactive / immersive routes

- `/signals`
- `/science`
- `/mystics`
- `/pteros`
- `/peek`
- `/cambria`
- `/portal`
- `/listen`
- `/login`

### Archive-experimental routes

- `/(archive)/map`
- `/(archive)/fauna`
- `/(archive)/flora`
- `/(archive)/fractures`
- `/(archive)/survey`

## API Boundaries

### Keep only on `worldoftethys.com`

These are world systems and should not stay on the author site:

- `/api/auth/*`
- `/api/profile/ensure`
- `/api/player/*`
- `/api/vr-metadata`
- `/api/tethys/*`
- `/api/tethys-intel`
- `/api/weather`
- `/api/telemetry/danian/*`
- `/api/science/discoveries`
- `/api/archive/map-interaction`
- `/api/catalog`
- `/api/pteros/*`
- `/api/oracle/*`
- `/api/oracle-live`
- `/api/mycology/entries`
- `/api/paleo/validate`
- `/api/templates/starter`
- `/api/admin/*`

### Keep off `dcbarletta.com`

All of the above unless you intentionally maintain a shared backend, which I do not recommend for the split.

## Component Ownership

### Mostly `dcbarletta.com`

- `src/components/content/BookBanner.jsx`
- `src/components/content/BookCarousel.jsx`
- `src/components/content/BookCoverImage.jsx`
- `src/components/content/HomeBookBanner.jsx`
- `src/components/layout/Footer.jsx`
- `src/components/layout/Header.jsx`

### Mostly `worldoftethys.com`

- `src/components/features/map/*`
- `src/components/features/vr/*`
- `src/components/weather/*`
- `src/components/journal/*`
- `src/components/npc/*`
- `src/components/page-specific/*`
- `src/components/stories/*`
- `src/components/forms/IdentityAirLock.jsx`
- `src/components/forms/SurvivorIdentityPanel.jsx`
- `src/components/content/FieldNotebook.jsx`
- `src/components/content/HerbariumArchive.jsx`
- `src/components/content/LocalJournal.jsx`
- `src/components/content/LoreCard.js`
- `src/components/content/MycologyAtlas.jsx`
- `src/components/content/RavelToolkit.jsx`
- `src/components/content/ScientificJournal.jsx`

## Recommended Author-Site Slim Build

If you want to lighten `dcbarletta.com`, its first trimmed build should be:

- homepage
- author page
- about page
- contact page
- press kit
- privacy / terms
- one clean book page

Optional:

- a short blog or excerpt section
- a simple outbound link block to `worldoftethys.com`

## Recommended World-Site First Release

Since writing is the priority, launch `worldoftethys.com` with:

1. homepage
2. world hub
3. world map
4. archive
5. natural history pages
6. blog / essays
7. login and player bootstrap

Ship audio as secondary, not primary.

## Migration Sequence

### Phase 1

- duplicate repo into a new World of Tethys repo
- connect new Vercel project
- attach `worldoftethys.com`
- keep `dcbarletta.com` stable

### Phase 2

- remove world APIs and immersive pages from the author repo
- replace them with outbound links to the world site

### Phase 3

- tune canonicals, sitemap, and metadata so each site owns its own search intent
