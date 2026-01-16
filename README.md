World of Tethys || D.C. Barletta

World of Tethys | 

The 111-MYA Archive

A "Volcanic High-Fantasy" immersive web experience built with Next.js, Tailwind CSS, and Firebase.

🌋 The ConceptThis is not just a website; it is an Archaeological Interface for a world set 111 million years ago. 

It bridges the gap between a reference wiki, a role-playing game, and a book series.

Key Features:

Immersive UI: "Obsidian & Magma" aesthetic with distinct "Vernal" biomes.

Game Economy: Daily "Resin" harvesting and randomized loot drops.

Role-Playing: Users gain "Kith" (Wisdom) and "Igzier" (Survival) stats.

Audio Layer: Persistent, context-aware audio player (The Echo Stone).

Real-World Proxies: 

Interactive maps connecting fantasy locations to real geological data.


🛠️ Tech StackFrontend: Next.js 14 (App Router)Styling: Tailwind CSS + CSS Modules (for biome themes)
Auth: Firebase Admin (server sessions via BFF routes)
Firestore: Server-only (client access blocked in rules)
State: React Context API (TethysContext, AuthContext, AudioContext)

Charts: Chart.js (Pteros Dashboard)

CMS: Headless WordPress + WPGraphQL (Prepared for integration)



🚀 Getting StartedClone the repository:git clone [https://github.com/your-username/world-of-tethys.git](https://github.com/your-username/world-of-tethys.git)

cd world-of-tethys
Install Dependencies: 

npm install

Environment Setup:

1. Create a `.env.local` file in the root directory and add your Firebase + Firebase Admin credentials:

```
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

2. Point `cdn()` at your CloudFront distribution so every asset resolves from that edge URL:

```
NEXT_PUBLIC_CDN_DIST=https://your-distribution.cloudfront.net
```

3. Add WPGraphQL credentials for server-to-server lore fetches:

```
WP_GRAPHQL_ENDPOINT=https://your-wordpress.com/graphql
WP_USER=your_wp_app_user
WP_APP_PASS=your_wp_app_password
```


Run Development Server:        npm run dev


📂 Project Architecture

src/
├── app/
│   ├── archive/       # Dynamic Routing for Lore (Creatures, Factions)
│   ├── codex/         # Translation Tool
│   ├── creatures/     # Marine Survivors (Abyssal Theme)
│   ├── mystics/       # The Vernal Oracle (Root Theme)
│   ├── pteros/        # Estuary Dashboard
│   ├── profile/       # User Dossier
│   ├── layout.jsx     # Master Wrapper (Auth + Audio Providers)
│   └── page.jsx       # Landing Hub (The Map)
├── components/
│   ├── GlobalAudioPlayer.jsx # Persistent Audio
│   ├── LoginWidget.jsx       # Auth UI
│   ├── StarterLoadout.jsx    # Daily Harvest Game
│   ├── TethysNexus.jsx       # Interactive Map
│   └── ...
├── context/
│   ├── AuthContext.jsx       # Firebase Logic
│   ├── AudioContext.jsx      # Music Logic
│   └── TethysContext.jsx     # Game State (Inventory/Stats)
└── lib/
    ├── audio-manifest.js     # Playlist Data
    └── mycology-engine.js    # Fungi Logic


⚔️ Deployment => Vercel:

Import this repository to Vercel.

Add the Environment Variables from your .env.local.

Deploy.

****Important: Ensure your Vercel domain is added to Authorized Domains in the Firebase Console Authentication settings.****

© 2026 Cambria Historical Preservation Society - World of Tethys - D.C. Barletta
