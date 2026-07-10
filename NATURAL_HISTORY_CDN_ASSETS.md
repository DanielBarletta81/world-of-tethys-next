# Natural History CDN Image Assets

## 📦 S3 Upload Checklist - New Natural History Sections

Upload these 4 images to your S3 bucket at path: `/img/bg/`

### 1. **🌿 Flora & Fauna Section**
```
S3 Path: /img/bg/ironwood-grove-hero.jpg
Route:   /natural-history/flora-and-fauna
Theme:   Ancient Ironwood groves, mysterious forest, silent canopy
```

**Image suggestions:**
- Dense, ancient forest with massive dark trunks
- Misty, atmospheric, slightly unsettling
- Minimal wildlife (emphasize the "silence")
- Deep greens and browns with dappled light

---

### 2. **🍄 Fungi Section**
```
S3 Path: /img/bg/veil-spore-grove.jpg
Route:   /natural-history/fungi
Theme:   Translucent fungal caps, mycorrhizal networks, decomposition
```

**Image suggestions:**
- Mushrooms/fungi on forest floor or deadwood
- Bioluminescent/translucent quality
- Macro photography or artistic interpretation
- Earthy tones with subtle glow effects

---

### 3. **🐟 Marine Life Section**
```
S3 Path: /img/bg/glass-rays-shelf.jpg
Route:   /natural-history/marine-life
Theme:   Continental shelf, translucent rays, deep blue ocean
```

**Image suggestions:**
- Underwater scene, rays or manta rays (translucent effect)
- Continental shelf drop-off or reef edge
- Deep blues, teals, filtered sunlight
- Mysterious, peaceful, slightly alien

---

### 4. **🌐 Food Web / Ecosystem Section**
```
S3 Path: /img/bg/permian-survivors.jpg
Route:   /natural-history/food-web
Theme:   Interconnected ecosystem, temporal anomaly, ancient lineages
```

**Image suggestions:**
- Complex ecosystem vista (forest + ocean + sky)
- Layered landscape showing multiple habitats
- Slightly otherworldly/timeless quality
- Could combine elements from other sections

---

## 🔧 Technical Details

All images are loaded via the `HERO_IMAGE_URLS` object in `/src/lib/site-assets.js`:

```javascript
floraFauna: cdn('/img/bg/ironwood-grove-hero.jpg'),
fungi:      cdn('/img/bg/veil-spore-grove.jpg'),
marineLife: cdn('/img/bg/glass-rays-shelf.jpg'),
foodWeb:    cdn('/img/bg/permian-survivors.jpg'),
```

**Background styling:**
- Linear gradient overlay: `rgba(5,4,3,0.88)` to `rgba(5,4,3,0.92)`
- Background size: cover
- Background position: center
- Background attachment: fixed (parallax effect)

---

## 📐 Recommended Specifications

- **Format:** JPG (better compression for photos)
- **Dimensions:** 2560x1440 or higher (4K safe)
- **File size:** 500KB - 1.5MB (balance quality vs load time)
- **Color space:** sRGB
- **Compression:** 80-85% quality

---

## 🎨 Visual Direction

**Overall Mood:** Mysterious, scientific, ancient, slightly unsettling

**Color Palette:**
- Deep greens and browns (flora/fauna)
- Earthy with subtle glow (fungi)  
- Deep blues and teals (marine life)
- Mixed/layered (food web)

**Avoid:**
- Bright, cheerful imagery
- Obviously modern or edited elements
- Cartoon/illustrated style (unless very sophisticated)
- Overly saturated colors

---

## ✅ Upload Command (AWS CLI)

```bash
# Upload all 4 images at once
aws s3 cp ironwood-grove-hero.jpg s3://your-bucket/img/bg/ --acl public-read
aws s3 cp veil-spore-grove.jpg s3://your-bucket/img/bg/ --acl public-read
aws s3 cp glass-rays-shelf.jpg s3://your-bucket/img/bg/ --acl public-read
aws s3 cp permian-survivors.jpg s3://your-bucket/img/bg/ --acl public-read
```

Or upload via AWS Console → S3 → your bucket → `img/bg/` folder.

---

## 🧪 Testing After Upload

Once uploaded, verify each route loads correctly:

1. https://worldoftethys.com/natural-history/flora-and-fauna
2. https://worldoftethys.com/natural-history/fungi
3. https://worldoftethys.com/natural-history/marine-life
4. https://worldoftethys.com/natural-history/food-web

Check browser console for any 404 errors on image loads.

---

## 🔄 Quick Fallback

If images aren't ready yet, the pages will still render with solid dark backgrounds (no broken image errors). The gradient overlay ensures text remains readable.

You can also temporarily use existing CDN images by updating `site-assets.js`:

```javascript
floraFauna: cdn('/img/bg/mystic-ironwoods.jpg'),  // existing forest image
fungi:      cdn('/img/bg/obsidian-coast-4k.jpg'), // existing dark atmospheric
marineLife: cdn('/img/bg/obsidian-coast-4k.jpg'), // existing ocean-themed
foodWeb:    cdn('/img/bg/parchment-map-table.png'), // existing composite
```
