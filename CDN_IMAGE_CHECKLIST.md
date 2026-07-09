# CDN/S3 Image Asset Checklist for World of Tethys

Complete list of image paths needed in your CloudFront CDN / S3 bucket: `doukn8q38poc4.cloudfront.net`

## 🎯 Priority: Author Site (dcbarletta.com) - Prestige, Epic, Mysterious

### **Book Covers** (Critical - Product Forward)
```
/img/books/book1-cover.png          ✅ MAIN PRODUCT - World of Tethys Book One
/img/books/ravel-kindle.png         📚 Unraveling Ravel (Kindle)
/img/books/ravel-paperback.png      📚 Unraveling Ravel (Paperback)
/img/books/roots-remember.png       📚 What the Roots Remember
/img/books/book1-hero.png           📸 Hero version for banners
```

### **Author Site Backgrounds** (Replace old map images)
```
⚠️ DEPRECATED (Removed from code):
/img/bg/parchment-map-table.png     ❌ OLD - Keep for world site only
/img/bg/magma-forge-hero.jpg        ❌ OLD - Too dark/intense for author site
/img/watcher-eruption1.png          ❌ REMOVED - Replaced with mystical-view.png
/img/watcher_mountain3.png          ❌ REMOVED - Replaced with mystical-view.png
/ray_smile.jpg                       ❌ REMOVED - Replaced with prestige images

✅ NEW JULY 8, 2026 UPLOADS (Now Active):
/img/bg/author-hero-prestige.png    ✅ NEW - Main author page hero (epic, mysterious)
/img/bg/Brand-hero.png              ✅ NEW - Brand/marketing hero image
/img/bg/scribe-maros-hero.png       ✅ ACTIVE - Author bio card (replaces ray_smile)
/img/bg/tablet-desk.png             ✅ ACTIVE - Professional workspace vibe
/img/bg/mystical-view.png           ✅ ACTIVE - Essays/Field Notes (replaces watcher)
/img/bg/sky-city-column-varek.png   ✅ NEW - Architectural prestige shot
/img/bg/skycity-dark-hall.png       ✅ NEW - Atmospheric interior
/img/bg/lower-tiers-hero.png        ✅ NEW - Sky City lower levels
/img/bg/the-shelf-hero.png          ✅ NEW - Epic continental shelf vista
/img/bg/Triumvirate-Hero.png        ✅ NEW - Character ensemble
/img/bg/watcher-ptero-hero.png      ✅ NEW - Pterosaur + volcano composition
/img/bg/maros-writing.png           ✅ NEW - Scribe at work scene

✅ NEW CHARACTER PORTRAITS:
/img/characters/commander-varek-hero.png  ✅ NEW - Military commander
/img/characters/jairo-return-hero.png     ✅ NEW - Jairo character portrait
```

### **Icons & Seals**
```
/img/icons/tethys-seal-coin.svg     🏛️ Brand seal (used in footer, headers)
```

### **Plate Images** (Large format headers)
```
/img/plates/footer/footer-home-watcher.webp         🌋 Homepage footer
/img/plates/footer/footer-map-ghostrelief.webp      🗺️ Map page footer
/img/plates/footer/footer-creatures-rookery.webp    🦕 Creatures page footer
/img/plates/footer/footer-mystics-moonwater.webp    ✨ Mystics page footer
```

---

## 🌍 World Site (worldoftethys.com) - Immersive, Lore-Heavy

### **Backgrounds**
```
/img/bg/obsidian-coast-4k.jpg       🌊 MOST USED - Coast/ocean scenes
/img/bg/sky-city-hero5.png          🏙️ Sky City hero shot
/img/bg/forest-2107470.jpg          🌲 Forest/Ironwood scenes
/img/bg/pteros_island_hero.png      🏝️ Pterosaur island
/img/bg/fossil-lab.jpg              🔬 Science page (optional)
```

### **Maps** (Critical for world site)
```
/img/map/tethys-atlas-canon.png     🗺️ MAIN MAP - Canon version
/img/map/tethys-atlas-clean.png     🗺️ Clean version without labels
/img/map/epic_map_hero.PNG          🗺️ Epic version for headers
/img/map/tethys-ember-scar.png      🔥 Ember Scar region
/img/map/tethys-mist-noise.png      🌫️ Atmospheric overlay
/img/map/tethys-relief-ghost.png    👻 Ghost relief overlay
```

---

## 📚 Rolling Book Banner Component

The `BookCarousel.jsx` component creates the rolling book banner you mentioned. Currently uses:

```jsx
<BookCarousel compact={false} />
```

**Books shown in carousel:**
1. Sky City of Tethys → `/img/books/book1-cover.png`
2. Unraveling Ravel → `/img/books/ravel-kindle.png`
3. What the Roots Remember → `/img/books/roots-remember.png`

**To add to author site:** Import and place in `AuthorLanding.jsx` or `page.jsx` for prominent product showcase.

---

## 🧍 Characters

```
/img/characters/Igzier_Sky_City.png         🧔 Igzier (Sky City version)
/img/characters/Igzier_Stryker_hero2.png    🧔 Igzier with Stryker
/img/characters/jairo_hero.png              👤 Jairo (main)
/img/characters/jairo_hero2.PNG             👤 Jairo (alt)
/img/characters/jairo-return-hero.png       👤 NEW - Jairo return scene (July 8)
/img/characters/karys_hero.png              👤 Karys
/img/characters/stryker_hero_alt1.PNG       👤 Stryker
/img/characters/melden-hero.png             👤 Melden
/img/characters/marros_hero.PNG             👤 Marros
/img/characters/marros_hero2.PNG            👤 Marros (alt)
/img/characters/commander-varek-hero.png    👤 NEW - Commander Varek (July 8)
/img/characters/igzier-youth.png            🧒 Young Igzier
/img/characters/Jairos_Dad.png              👨 Jairo's father
/img/characters/dark_arches.png             🏛️ Architectural element
```

---

## 🦕 Creatures (Bestiary)

### **Dinosaurs**
```
/img/creatures/carcharodontosaurus.png      🦖 Apex predator
/img/creatures/suchomimus.png               🐊 Delta predator
/img/creatures/sauroposeidon.png            🦕 Titanosaur
/img/creatures/nigersaurus.png              🦕 Herbivore
/img/creatures/spinosaurid_tide_hunter.png  🐊 Coastal hunter
```

### **Pterosaurs**
```
/img/creatures/tapejara.png                 🦅 Aerial scout
/img/creatures/tropeognathus.png            🦅 Large pterosaur
/img/creatures/volcanic_bird_hero.png       🔥 Ash rider
```

### **Marine Life**
```
/img/creatures/kronosaurus.png              🐋 Marine apex predator
/img/creatures/protostegid.png              🐢 Ancient turtle
/img/creatures/GlassRay_hero.png            🦈 Glass ray (shelf drifter)
/img/creatures/ptychodus.png                🦈 Shark
/img/creatures/ironback_sturgeon.png        🐟 Sturgeon
```

### **Invertebrates & Others**
```
/img/creatures/kuphus_tube.png              🪱 Tube worm
/img/creatures/necrocarcinid_crab.png       🦀 Crab
/img/creatures/void_shell.png               🐚 Deep arthropod
/img/creatures/mud_wing.png                 🦋 Flying creature
/img/creatures/silt_hunter.png              🦐 Benthic predator
```

---

## 🏛️ Locations

```
/img/locations/sky_city_terrace_hero.PNG    🏙️ Sky City main view
/img/locations/mid-terrace.png              🏙️ Mid tier
/img/locations/lower_tier_hero.png          🏙️ Lower tier
/img/locations/archive_hero.PNG             📚 Archive entrance
/img/locations/the-weep4k.jpg               💧 The Weep waterfall
/img/locations/the_ledge_hero.png           🪨 The Ledge
/img/locations/mystic-ironwoods.jpg         🌲 Ironwood Forest
/img/locations/pteros-island-sun.png        🏝️ Pterosaur Island
/img/locations/sector-4-hero.png            🏗️ Sector 4

⚠️ WATCHER VOLCANO (Currently overused - consider alternatives):
/img/locations/watcher_mountain_hero.png    🌋 Main watcher
/img/locations/watcher_mountain_hero2.png   🌋 Alt 1
/img/locations/watcher_mountain_alt2.png    🌋 Alt 2  
/img/locations/watcher_hero4.png            🌋 Alt 3
/img/locations/Mount_Shastea_hero.png       🌋 Mt. Shasta version

💡 RECOMMENDATION: Create 2-3 NEW epic location images that aren't volcano-focused
   - Ancient ruins (Cambria)
   - Ocean depths
   - Sky City at golden hour
   - Mysterious forest clearing
```

### **Cambria/Archive Symbols**
```
/img/locations/A_Cambria_Symb1.png          📜 Ancient symbol
```

---

## 🎭 Factions

```
/img/factions/Silurians_hero.png            🌊 Silurians main
/img/factions/Thals_hero.png                ⚔️ Thals main
/img/factions/Assemb_Thals.png              ⚔️ Thals assembly
/img/factions/Thal_Creature_Chaos.png       ⚔️ Thals in battle
```

---

## 🔧 Utility Assets

```
/noise.svg                                  📊 Texture overlay
/symbols/tethys-seal.png                    🏛️ Seal (PNG version)
/window.svg                                 🪟 UI element
/Tethys_Card1.png                           🃏 Card design
/kith-portrait.jpg                          👤 Portrait
/light parchment.png                        📜 Light texture
```

---

## 📊 Current Usage Stats

**Most Used Backgrounds:**
1. `obsidian-coast-4k.jpg` - Used 15+ times (bestiary, herbarium, portal)
2. ✅ `mystical-view.png` - NEW - Now used for author site essays (July 8)
3. `parchment-map-table.png` - Used 6+ times (world site only)

**Author Site Active Images (July 8, 2026):**
- ✅ `scribe-maros-hero.png` - Author bio card (replaced ray_smile.jpg)
- ✅ `tablet-desk.png` - Author card in author hub page
- ✅ `mystical-view.png` - Field Notes/Essays cards (replaced watcher images)
- ✅ `author-hero-prestige.png` - Available for hero sections
- ✅ `sky-city-column-varek.png` - Available for architectural sections

**Removed/Deprecated:**
- ❌ `ray_smile.jpg` - Removed (replaced with prestige images)
- ❌ `watcher-eruption1.png` - Removed from author site
- ❌ `watcher_mountain3.png` - Removed from author site

**Underutilized Quality Assets:**
- `/img/locations/mystic-ironwoods.jpg` (only 3 uses - very atmospheric!)
- `/img/locations/the-weep4k.jpg` (only 2 uses - high quality)
- `/img/locations/pteros-island-sun.png` (5 uses - good variation)
- ⭐ `/img/bg/the-shelf-hero.png` (NEW - not yet used, epic vista!)
- ⭐ `/img/bg/Triumvirate-Hero.png` (NEW - not yet used, character ensemble!)
- ⭐ `/img/bg/watcher-ptero-hero.png` (NEW - not yet used, pterosaur composition!)

---

## ✅ CHANGES APPLIED (July 9, 2026)

### **Images Removed from Codebase:**
1. ❌ `ray_smile.jpg` - Replaced with professional prestige images
   - **AuthorLanding.jsx**: Now uses `scribe-maros-hero.png`
   - **author/page.jsx**: Now uses `tablet-desk.png`

2. ❌ `watcher-eruption1.png` - Replaced with mystical imagery
   - **author/page.jsx**: Now uses `mystical-view.png`

3. ❌ `watcher_mountain3.png` - Replaced with mystical imagery
   - **AuthorLanding.jsx**: Now uses `mystical-view.png`

### **New Images Actively Used:**
- ✅ `/img/bg/scribe-maros-hero.png` → Author bio card in AuthorLanding
- ✅ `/img/bg/tablet-desk.png` → Author card in author hub page
- ✅ `/img/bg/mystical-view.png` → Field Notes/Essays cards (both pages)

### **New Images Ready to Use:**
- 🎨 `/img/bg/author-hero-prestige.png` - Epic hero sections
- 🎨 `/img/bg/Brand-hero.png` - Brand marketing
- 🎨 `/img/bg/sky-city-column-varek.png` - Architectural shots
- 🎨 `/img/bg/skycity-dark-hall.png` - Atmospheric interiors
- 🎨 `/img/bg/lower-tiers-hero.png` - Sky City scenes
- 🎨 `/img/bg/the-shelf-hero.png` - Epic continental vista
- 🎨 `/img/bg/Triumvirate-Hero.png` - Character ensemble
- 🎨 `/img/bg/watcher-ptero-hero.png` - Pterosaur + volcano
- 🎨 `/img/bg/maros-writing.png` - Scribe at work
- 🎨 `/img/characters/commander-varek-hero.png` - Military commander
- 🎨 `/img/characters/jairo-return-hero.png` - Jairo portrait

### **Build Status:**
✅ Build successful - all image paths verified

---

## 📦 Upload Priority Order

### 1. **✅ COMPLETED - Removed Map-Heavy Backgrounds**
Removed from author site:
- ✅ `/img/watcher-eruption1.png` (replaced with mystical-view.png)
- ✅ `/img/watcher_mountain3.png` (replaced with mystical-view.png)
- ✅ `/ray_smile.jpg` (replaced with scribe-maros-hero.png and tablet-desk.png)

### 2. **Add Book Carousel to Author Landing**
```jsx
import BookCarousel from '@/components/content/BookCarousel';

// Add to AuthorLanding.jsx after hero section:
<BookCarousel compact={false} className="mt-8" />
```

### 3. **Create "Prestige Product" Hero Image**
New file: `/img/bg/author-hero-book-product.jpg`
- Book One cover artfully arranged
- Moody, mysterious lighting
- Professional product photography vibe
- Use for top of author page

### 4. **Add Author Portrait Assets**
```
/img/author/dcbarletta-professional.jpg     📸 Professional headshot
/img/author/dcbarletta-writing.jpg          ✍️ At desk/working
/img/author/dcbarletta-pinterest-style.jpg  📌 Pinterest aesthetic
```

---

## 🎨 Visual Direction: "Prestige Epic Mysterious Author"

**Color Palette:**
- Deep browns and ambers (parchment, old books)
- Charcoal and warm blacks
- Cream and aged paper tones
- Gold accents (Amazon button already uses this!)

**Avoid:**
- Bright lava/volcano reds
- Busy map overlays on author pages
- "World-first" immersive imagery

**Embrace:**
- Clean book product shots
- Mysterious atmospheric gradients
- Vintage naturalist journal aesthetics
- Professional author branding
- "Artifact" feel - old, important, collectible

---

## 📦 Upload Priority Order

1. **Critical (Do First):**
   - Book covers (all 4)
   - New author hero background
   - Author portraits
   - Book carousel thumbnail optimizations

2. **High Priority (Author Site Polish):**
   - Replacement backgrounds for Field Notes
   - New Press Kit imagery
   - Footer plates with book/author focus

3. **Medium Priority (World Site):**
   - Character portraits (for character pages)
   - Location heroes (for region pages)
   - Creature images (for bestiary)

4. **Lower Priority:**
   - Map variations
   - Faction images
   - Utility/overlay textures

---

**Your CloudFront Distribution:**
`https://doukn8q38poc4.cloudfront.net/`

All paths above should be prefixed with your CDN domain. Images are referenced via the `cdn()` helper function in `/src/lib/cdn.js`.

---

**Next Steps:**
1. ✅ Create new "prestige epic mysterious" author-focused images
2. ✅ Replace watcher_mountain backgrounds on author site
3. ✅ Add BookCarousel component to author landing
4. ✅ Upload all book covers in high resolution
5. ✅ Add professional author portraits
