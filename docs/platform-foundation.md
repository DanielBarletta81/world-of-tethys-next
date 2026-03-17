# World of Tethys Platform Foundation

## Product Goal

Build `worldoftethys.com` as a living exploration platform where fictional regions, lore, and player identity are grounded in real environmental signal inputs from Earth.

## Domain Strategy

- Primary site: `worldoftethys.com`
- CMS: `cms.worldoftethys.com`
- The repo should no longer inherit `dcbarletta.com` as its default public identity.

## Content Model

Use WordPress + WPGraphQL for stable canon:

- locations
- characters
- creatures
- timeline entries
- field notes
- archive records
- natural history articles

Use Firestore for mutable player data:

- account profile
- onboarding path
- earned discoveries
- time-on-site rewards
- signup cohort rewards
- inventory / artifacts
- VR export metadata

## Auth Model

Current direction is sound:

- Firebase Auth for email/password and Google sign-in
- server-issued session cookie for the web app
- Firestore player profile created on first successful authentication

Recommended rule:

- WordPress owns publishable world content.
- Firebase owns users, progression, reward state, and player-bound metadata.

## Reward System Direction

Track and award:

- first-visit date
- account creation date
- cumulative engaged minutes
- discoveries triggered
- completed onboarding rituals
- return streaks

Store derived unlocks separately from raw telemetry so reward rules can evolve without rewriting event history.

## SEO Direction

- Root homepage should describe the atlas platform, not only the book.
- Canonicals, sitemap, robots, and OG defaults must resolve to `worldoftethys.com`.
- Each major region and archive surface should have distinct metadata and descriptive copy.
- Lore/history from WordPress should be statically renderable where possible for search.

## Near-Term Build Order

1. Keep this repo branded and deployed as `worldoftethys.com`.
2. Finalize WordPress content types and WPGraphQL schema.
3. Stabilize Firebase auth and first-login profile bootstrap.
4. Define reward events and progression tables in Firestore.
5. Expose signed VR metadata payloads for player import.
6. Add Earth-data ingestion routes for climate and environmental overlays.
