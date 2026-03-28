# World of Tethys

`worldoftethys.com` is a standalone Next.js platform for immersive world exploration, lore delivery, live Earth-linked environmental signals, and player progression.

This repo is the clean split from `dcbarletta.com`. It should behave like its own product, domain, SEO surface, and deployment target.

## Product Direction

- Public site: immersive atlas, regional exploration, natural history, archive, signals, and onboarding.
- Lore CMS: WordPress + WPGraphQL for stable history, canon, characters, locations, and long-form writing.
- Player systems: Firebase Auth + Firestore for identity, progression, rewards, and session-backed player state.
- Future VR bridge: signed player metadata payloads that can seed inventory, phenotype, and earned artifacts on world entry.
- Rewarding early visitors: time-on-site, signup date, and discovery milestones should feed progression and unlock tables.

## Core Stack

- `Next.js` + `React`
- `WordPress` + `WPGraphQL`
- `Firebase Auth`
- `Firestore`
- optional Earth/environment feeds via server routes

## Separation Rules

- Default site/domain metadata must point to `https://worldoftethys.com`.
- Default CMS host must point to `https://cms.worldoftethys.com`.
- No public SEO canonical, sitemap, or robots output should default to `dcbarletta.com`.
- Author/creator content can exist, but the repo should present itself as the World of Tethys platform first.

## Dual-Domain Behavior

- `worldoftethys.com` should render the immersive world-first portal and atlas experience.
- `dcbarletta.com` should render the lighter author-first home while still routing readers into World of Tethys content.
- Set `NEXT_PUBLIC_AUTHOR_SITE_URL=https://dcbarletta.com` in production projects that need author-route redirects and cross-links.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env config from `.env.example`.

3. Start development:

```bash
npm run dev
```

4. Validate before shipping:

```bash
npm run ci
```

## Important Env Vars

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WORLD_SITE_URL`
- `NEXT_PUBLIC_AUTHOR_SITE_URL`
- `NEXT_PUBLIC_WP_URL`
- `NEXT_PUBLIC_WORDPRESS_API_URL`
- `WP_GRAPHQL_ENDPOINT`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT_JSON` or server-only Firebase credential trio

## Platform Notes

- Firebase email/password and Google sign-in are already wired through server session cookies.
- `/api/auth/*` handles auth exchange and session cookie issuance.
- WordPress should hold canonical lore/history data.
- Firestore should hold player identity, progression, rewards, and VR-facing metadata.

## Planning Docs

- [Platform Foundation](/Users/dbarletta_mb_pro/Desktop/world-of-tethys-next-clean/docs/platform-foundation.md)
- [Deployment Checklist](/Users/dbarletta_mb_pro/Desktop/world-of-tethys-next-clean/deployment-checklist.md)
- [WordPress Handbook](/Users/dbarletta_mb_pro/Desktop/world-of-tethys-next-clean/wordpress-handbook.md)
