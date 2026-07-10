# CDN Hero Images - Wired Up (July 9, 2026)

## ✅ SUCCESSFULLY WIRED FROM JULY 8 UPLOAD

These images are now actively used in your codebase:

### Hero & Background Images
```javascript
// site-assets.js
HERO_IMAGE_URLS = {
  homepage: cdn('/img/bg/parchment-map-table.png'),          ✅ Uploaded July 8
  worldHub: cdn('/img/bg/sky-city-hero5.png'),               ✅ Uploaded July 8
  naturalHistory: cdn('/img/bg/obsidian-coast-4k.jpg'),      ✅ Uploaded (old)
  marineLife: cdn('/img/bg/glass-rays-shelf.jpg'),           ⚠️  NEEDS UPLOAD
  foodWeb: cdn('/img/bg/permian-survivors.jpg'),             ⚠️  NEEDS UPLOAD
  
  // Fallbacks until specialized images uploaded:
  floraFauna: cdn('/img/bg/obsidian-coast-4k.jpg'),          ✅ Using fallback
  fungi: cdn('/img/bg/obsidian-coast-4k.jpg'),               ✅ Using fallback
}

BACKGROUND_IMAGE_URLS = {
  homepage: cdn('/img/bg/parchment-map-table.png'),          ✅ Uploaded July 8
  bookPage: cdn('/img/bg/magma-forge-hero.jpg'),             ✅ Uploaded (old)
  lorePage: cdn('/img/bg/watcher-ptero-hero.png'),           ✅ Uploaded July 8 (NEW)
  authorHub: cdn('/img/bg/magma-forge-hero.jpg'),            ✅ Uploaded (old)
  worldAtlas: cdn('/img/bg/sky-city-hero5.png'),             ✅ Uploaded July 8
}
```

### Replaced Missing Images
- **mystic-ironwoods.jpg** → **mystical-view.png** ✅
  - Used in: world/page.jsx, world-of-tethys/page.jsx
  
- **forest-2107470.jpg** → **mystical-view.png** ✅
  - Used in: CharacterCarousel.jsx (Karys & Ravel), HerbariumArchive.jsx, GlobalAtmosphere.jsx
  
- **pteros_island_hero.png** → **watcher-ptero-hero.png** ✅
  - Used in: pteros/page.jsx, site-assets.js (lorePage)

- **magma-forge-hero.png** → **magma-forge-hero.jpg** ✅
  - Fixed file extension in CharacterCarousel.jsx

### Active Prestige Images
- **scribe-maros-hero.png** ✅ - AuthorLanding D.C. Barletta card
- **mystical-view.png** ✅ - AuthorLanding Field Notes card, author/page Essays
- **tablet-desk.png** ✅ - author/page primary routes
- **obsidian-coast-4k.jpg** ✅ - Natural history hero (multiple sections)
- **sky-city-hero5.png** ✅ - World hub, atlas background
- **watcher-ptero-hero.png** ✅ - Pteros page, lore page background

## ⚠️ STILL MISSING - HIGH PRIORITY

### Natural History Specialized Images
These would replace the obsidian-coast-4k.jpg fallback:
- `glass-rays-shelf.jpg` - For marine life section
- `permian-survivors.jpg` - For food web section
- `ironwood-grove-hero.jpg` - For flora/fauna section (optional)
- `veil-spore-grove.jpg` - For fungi section (optional)

### Books (CRITICAL)
```
❌ /img/books/book1-cover.png           🔴 Used 10+ times
❌ /img/books/ravel-kindle.png          🔴 BookCarousel
❌ /img/books/ravel-paperback.png       🔴 BookCarousel
❌ /img/books/roots-remember.png        🔴 BookCarousel
```

### Seals & Icons (HIGH)
```
❌ /img/icons/tethys-seal-coin.svg      🟠 Footer, AuthorLanding, Navigation
❌ /symbols/tethys-seal.png             🟠 Multiple pages
❌ /noise.svg                           🟠 Texture overlay (10+ uses)
❌ /img/watcher-ashfall.svg             🟠 Catalog (5+ uses)
```

### Character Images (MEDIUM)
Most character hero images are still missing:
- karys_hero.png, ravel_hero.PNG, jairo_hero.png, Igzier variants

### Location Images (MEDIUM)
Many location heroes still missing:
- sky_city_terrace_hero.PNG, watcher_mountain_hero.png, the-weep4k.jpg

## 📝 RECOMMENDATIONS

### Immediate Actions:
1. **Upload book covers** - Most critical gap, used in BookCarousel
2. **Upload seals** - tethys-seal-coin.svg is in navigation now
3. **Upload noise.svg** - Texture overlay used everywhere

### Secondary Actions:
4. Upload specialized natural history images (glass-rays, permian-survivors)
5. Upload character portrait images
6. Upload location hero images

### Nice to Have:
7. Replace obsidian-coast fallbacks with specialized flora/fungi images
8. Add more location-specific hero images

## 🎨 CURRENT WORKING IMAGES

Your July 8 upload batch is working great for these areas:
- ✅ Homepage hero
- ✅ World hub
- ✅ Author site heroes (scribe, tablet, mystical view)
- ✅ Sky City imagery
- ✅ Watcher/Pteros imagery
- ✅ Natural history (using obsidian coast as universal fallback)

The site will render correctly with these, but the missing book covers and seals are critical for complete branding.
