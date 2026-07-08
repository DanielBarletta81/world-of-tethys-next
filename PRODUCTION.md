# Production Deployment Guide

## Site Architecture

This repository powers **both** `worldoftethys.com` and `dcbarletta.com` through a single Next.js application with domain-based routing.

### Domains

#### worldoftethys.com
- **Purpose**: Immersive world platform — atlas, lore, natural history, archive systems
- **Site Variant**: `world`
- **Primary Routes**:
  - `/world` — World hub
  - `/map` — Interactive atlas
  - `/world-of-tethys/[region]` — Region pages
  - `/natural-history` — Essays and research
  - `/archive/[location]` — Deep lore
  - `/signals` — Environmental data
  - `/creatures` — Bestiary

#### dcbarletta.com
- **Purpose**: Author portfolio — book sales, writing, resume, product focus
- **Site Variant**: `author`  
- **Primary Routes**:
  - `/author` — Author hub
  - `/world-of-tethys-book-1` — Book sales page
  - `/about-dc-barletta` — Bio and resume
  - `/blog` — Essays (WordPress)
  - `/press-kit` — Media resources
  - `/contact` — Contact form

### Site Variant Detection

The app detects which domain it's running on and adjusts UI/UX automatically:

- `NEXT_PUBLIC_SITE_URL` environment variable determines the primary domain
- `middleware.js` handles redirects based on domain
- Layout applies different styling and navigation based on `siteVariant`

## Environment Variables

### Required for Both Sites
```bash
# Site URLs
NEXT_PUBLIC_SITE_URL=https://worldoftethys.com  # or https://dcbarletta.com
NEXT_PUBLIC_WORLD_SITE_URL=https://worldoftethys.com
NEXT_PUBLIC_AUTHOR_SITE_URL=https://dcbarletta.com

# CDN
NEXT_PUBLIC_CDN_DIST=https://doukn8q38poc4.cloudfront.net
CLOUDFRONT_URL=https://doukn8q38poc4.cloudfront.net

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Server-side Firebase Admin
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# WordPress (for blog posts)
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.worldoftethys.com
WP_GRAPHQL_ENDPOINT=https://cms.worldoftethys.com/graphql

# External Links
NEXT_PUBLIC_AMAZON_BOOK_URL=https://www.amazon.com/dp/B0GRHBR1HJ
NEXT_PUBLIC_AMAZON_AUTHOR_URL=https://www.amazon.com/stores/D.C.-Barletta/author/B0G5LM24FM
NEXT_PUBLIC_YOUTUBE_CHANNEL_URL=https://www.youtube.com/@WorldofTethys
NEXT_PUBLIC_GOODREADS_BOOK_URL=https://www.goodreads.com/book/isbn/9798250935180
NEXT_PUBLIC_GOODREADS_PROFILE_URL=https://www.goodreads.com/author/show/63851248.D_C_Barletta
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/worldoftethys/
NEXT_PUBLIC_TIKTOK_URL=https://www.tiktok.com/@worldoftethys/
```

## Deployment

### Vercel (Current Platform)

The app is deployed to Vercel with two projects:

1. **worldoftethys-production**
   - Domain: `worldoftethys.com`
   - Environment: `NEXT_PUBLIC_SITE_URL=https://worldoftethys.com`
   - Branch: `main`

2. **dcbarletta-production**  
   - Domain: `dcbarletta.com`
   - Environment: `NEXT_PUBLIC_SITE_URL=https://dcbarletta.com`
   - Branch: `main` (same codebase)

### Build Command
```bash
npm run build
```

### Development
```bash
npm run dev
# Test author variant locally:
# Set NEXT_PUBLIC_SITE_URL=https://dcbarletta.com in .env.local
```

## RSS Feed for Pinterest

RSS feed is available at `/feed.xml` and includes:
- Blog posts from WordPress
- Natural history essays
- Proper autodiscovery link in `<head>` for Pinterest

Pinterest can read the feed at:
- `https://dcbarletta.com/feed.xml`
- `https://worldoftethys.com/feed.xml`

## Key Integrations

### WordPress CMS
- Headless WordPress at `cms.worldoftethys.com`
- WPGraphQL API for blog posts
- Custom REST endpoints for specific content types

### Firebase
- Authentication (email/password, Google)
- Firestore for player progression
- Server-side validation via Firebase Admin SDK

### CDN (CloudFront)
- Static assets (images, maps, fonts)
- Cached at edge locations
- Path: `https://doukn8q38poc4.cloudfront.net/`

### Analytics
- Google Analytics: `G-TJN1NEHV58`
- Google Ads: `AW-17612201186`

## Branding Guidelines

### Always Use "World of Tethys"
❌ Wrong: "Tethys" alone  
✅ Correct: "World of Tethys"

The full brand name should appear in:
- Page titles and metadata
- Social media posts
- Marketing materials
- Product descriptions

Exception: Technical variable names (e.g., `TethysContext`, `useTethys`) are acceptable.

## Product Focus (Author Site)

The author site should emphasize:

1. **Amazon Book Sales**
   - Direct Amazon links above the fold
   - "Buy on Amazon" CTAs prominently displayed
   - ASIN: B0GRHBR1HJ

2. **Author Credentials**
   - Writer, builder, researcher
   - Product management background (Pinterest)
   - Technical + creative hybrid

3. **Portfolio Items**
   - Book One
   - Natural history essays
   - YouTube channel
   - GitHub projects

4. **External Profiles**
   - Amazon Author Page
   - Goodreads
   - YouTube
   - LinkedIn
   - GitHub

## Troubleshooting

### Site not detecting correct variant
- Check `NEXT_PUBLIC_SITE_URL` environment variable
- Clear `.next` build cache and rebuild
- Verify `middleware.js` routing logic

### RSS feed not working
- Confirm WordPress is accessible at `cms.worldoftethys.com`
- Check WPGraphQL endpoint: `https://cms.worldoftethys.com/graphql`
- Verify posts are published (not draft)

### Firebase auth issues
- Confirm all Firebase env vars are set
- Check Firebase console for API restrictions
- Verify service account has proper permissions

## Contact & Support

- **Author**: D.C. Barletta
- **Email**: Available via `/contact` form
- **Repository**: `DanielBarletta81/world-of-tethys-next`

---

Last updated: 2026-07-08
