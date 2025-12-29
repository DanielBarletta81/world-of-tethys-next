## World of Tethys — Vercel Frontend

Next.js (App Router) UI that reads content from the headless WordPress (WPGraphQL + OAuth) and renders the “Map Bridge” control room plus archive routes.

### Feature Map

- `/` – Map Bridge dashboard with Tesla Node, Nute Pulse, Sluice puzzle. Backed by `useTethys` global context and animated with Framer Motion.
- `/records`, `/creatures`, `/mystics`, `/humans`, `/registry`, `/history`, `/listen`, `/characters`, `/characters/[slug]` – CMS-driven sections (WordPress slugs/GraphQL).
- Tailwind CSS with the Sync palette (see `tailwind.config.js`) + glassmorphic utilities and clip-path helpers.
- `TeslaNode`, `NutePulse`, `SluiceGatePuzzle`, and `AnaphaseWrapper` components live in `src/components/`.
- Project lore + technical canon is locked in `tethys-bible.md`.

### Environment Variables

```
WP_GRAPHQL_ENDPOINT=
OAUTH_TOKEN_URL=
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_AUDIENCE=
OAUTH_SCOPE=
OAUTH_GRANT_TYPE=client_credentials
AMAZON_BOOK_URL=
MEDIA_BASE_URL=
MEDIA_PREVIEW_PATH=
MEDIA_FULL_PATH=
```

Add them locally in `.env` and in the Vercel dashboard (Project Settings → Environment Variables).

### Development

```bash
npm install
npm run dev
```

Tailwind classes compile automatically via `postcss.config.js`; `globals.css` already imports the base/components/utilities layers.

### Deploying to Vercel

1. Link the repo to Vercel (`vercel link` or import from dashboard).
2. Set the env vars above in Vercel → Project Settings → Environment Variables (add to Preview & Production).
3. Configure the production domain’s DNS (already pointing to Vercel per notes).
4. Trigger `vercel --prod` or allow the Git integration to build on the main branch.
5. WordPress → GraphQL endpoint must be reachable from Vercel (allow the Vercel IP range or keep it public with OAuth protection).

### WordPress / GraphQL Checklist

- Enable WPGraphQL on the headless WordPress and expose CPTs (characters, events, creatures, geodes, etc.).
- Configure Auth0 (or your OAuth server) and set the token URL/client credentials so `src/lib/token.js` can fetch access tokens.
- Slugs required by the Next routes:
  - `/`, `/records`, `/creatures`, `/mystics`, `/humans`, `/registry`
  - Characters (custom post type) provide `/characters/[slug]`
  - Events feed `/history` (timeline query can be extended to enrich the new UI later)

### Useful Scripts

- `npm run dev` – local development server
- `npm run build` – production build (run locally before deploying)
- `npm start` – run production build locally

### Adding More Sync UI

- Wire new prestige components into `useTethys` so the Tesla Node + Nute Pulse stay the source of truth for Sync/Oil/Pressure.
- Use `AnaphaseWrapper` for any new route transitions.
- Add lore/data entries in `tethys-bible.md` before creating new React components so design + narrative stay aligned.
