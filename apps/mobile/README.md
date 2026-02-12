# World of Tethys Mobile (Expo)

Read-only mobile companion app for the World of Tethys archive.

## Quick Start

```bash
npm --prefix apps/mobile install
npm --prefix apps/mobile run start
```

## Environment
Create `apps/mobile/.env` with your CDN base:

```bash
EXPO_PUBLIC_CDN_BASE=https://your-cdn-domain.com
```

The app streams audio and loads map imagery from this base path.

## Routes
- Tabs: `apps/mobile/app/(tabs)`
- Lore detail: `apps/mobile/app/lore/[id].tsx`

## Notes
- This MVP is read-only and uses stub lore data in `apps/mobile/src/data/loreEntries.ts`.
- Audio playback is managed by `apps/mobile/src/providers/AudioProvider.tsx`.
