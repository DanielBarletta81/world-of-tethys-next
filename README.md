World of Tethys || D.C. Barletta

# World of Tethys
The 111-MYA Archive

Volcanic high-fantasy immersive web experience built with Next.js, Tailwind CSS, and Firebase.

## Concept
This is not just a website. It is an archaeological interface for a world set 111 million years ago. It bridges a reference wiki, a role-playing game, and a book series.

## Key Features
- Immersive UI: obsidian + magma aesthetic with distinct biomes.
- Game economy: daily resin harvesting and randomized loot.
- Role-playing: Kith (wisdom) and Igzier (survival) stats.
- Audio layer: persistent, context-aware audio player (Echo Stone).
- Real-world proxies: fantasy locations tied to geological data.

## Tech Stack
- Frontend: Next.js (App Router)
- Styling: Tailwind CSS + CSS Modules
- Auth: Firebase Admin (server sessions via BFF routes)
- Firestore: server-only (client access blocked in rules)
- State: React Context (TethysContext, AuthContext, AudioContext)
- Charts: Chart.js (Pteros dashboard)
- CMS: Headless WordPress + WPGraphQL

## Getting Started
Clone the repository:

```bash
git clone https://github.com/your-username/world-of-tethys.git
cd world-of-tethys
```

Install dependencies:

```bash
npm install
```

### Environment Setup
Create `.env.local` in the repo root:

```bash
FIREBASE_API_KEY=your_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Point `cdn()` at your CloudFront distribution:

```bash
NEXT_PUBLIC_CDN_DIST=https://your-distribution.cloudfront.net
```

Add WPGraphQL credentials for server-to-server lore fetches:

```bash
WP_GRAPHQL_ENDPOINT=https://your-wordpress.com/graphql
WP_USER=your_wp_app_user
WP_APP_PASS=your_wp_app_password
```

### Oracle Seeder (Firestore)
The Ravel oracle content is seeded into Firestore via `seedOracleRavel.js`. Source data lives in `oracle_pool/ravel_seeder.json`.

Requirements:
- Node.js 18+ (ESM JSON imports)
- Firebase Admin credentials (application default)

Run:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-key.json node seedOracleRavel.js
```

Writes:
- `oracle/seeders/ravel_v1` (meta/config)
- `oracle/responses/*` (response docs)

Note: server-only. Do not run in the browser.

### Run Development Server

```bash
npm run dev
```

## Project Architecture
```
src/
├── app/
│   ├── archive/       # Dynamic routing for lore
│   ├── codex/         # Translation tool
│   ├── creatures/     # Marine survivors
│   ├── mystics/       # Vernal oracle
│   ├── pteros/        # Estuary dashboard
│   ├── profile/       # User dossier
│   ├── layout.jsx     # Master wrapper (auth + audio providers)
│   └── page.jsx       # Landing hub (the map)
├── components/
│   ├── GlobalAudioPlayer.jsx # Persistent audio
│   ├── LoginWidget.jsx       # Auth UI
│   ├── StarterLoadout.jsx    # Daily harvest game
│   ├── TethysNexus.jsx       # Interactive map
│   └── ...
├── context/
│   ├── AuthContext.jsx       # Firebase logic
│   ├── AudioContext.jsx      # Music logic
│   └── TethysContext.jsx     # Game state
└── lib/
    ├── audio-manifest.js     # Playlist data
    └── mycology-engine.js    # Fungi logic
```

## Deployment (Vercel)
1. Import this repository to Vercel.
2. Add environment variables from `.env.local`.
3. Deploy.

Important: ensure your Vercel domain is added to Authorized Domains in Firebase Auth.

© 2026 Cambria Historical Preservation Society - World of Tethys - D.C. Barletta
