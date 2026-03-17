# Vercel and Domain Cutover

This is the clean launch sequence for separating `dcbarletta.com` and `worldoftethys.com`.

## Target End State

### Project 1

- repo: `dcbarletta`
- Vercel project: `dcbarletta`
- domains:
  - `dcbarletta.com`
  - `www.dcbarletta.com`

### Project 2

- repo: `world-of-tethys-web`
- Vercel project: `world-of-tethys-web`
- domains:
  - `worldoftethys.com`
  - `www.worldoftethys.com`

## GitHub Setup

### Author repo

Point the current checkout to your actual author-site repo:

```bash
git remote set-url origin https://github.com/<YOU>/<DCBARLETTA-REPO>.git
git remote -v
```

### World repo

Create a clean new local folder:

```bash
rsync -a --exclude=.git /Users/dbarletta_mb_pro/Desktop/world-of-tethys-next-clean/ /Users/dbarletta_mb_pro/Desktop/world-of-tethys-web/
cd /Users/dbarletta_mb_pro/Desktop/world-of-tethys-web
git init
git branch -M main
git add .
git commit -m "Initial split from dcbarletta.com"
```

Create the repo:

```bash
gh repo create world-of-tethys-web --private --source=. --remote=origin --push
```

If you prefer creating it manually first:

```bash
git remote add origin https://github.com/<YOU>/world-of-tethys-web.git
git push -u origin main
```

## Vercel Project Setup

### `dcbarletta.com`

1. Import the `dcbarletta` repo.
2. Confirm framework is Next.js.
3. Remove env vars that only support the immersive Tethys world unless still needed.
4. Keep only the author domain attached.

### `worldoftethys.com`

1. Import `world-of-tethys-web`.
2. Confirm framework is Next.js.
3. Add production domains:
   - `worldoftethys.com`
   - `www.worldoftethys.com`
4. Add preview domain defaults if desired.

## Recommended Env Vars for `worldoftethys.com`

From `.env.example`, set at minimum:

- `NEXT_PUBLIC_SITE_URL=https://worldoftethys.com`
- `NEXT_PUBLIC_WORLD_SITE_URL=https://worldoftethys.com`
- `NEXT_PUBLIC_WP_URL=https://cms.worldoftethys.com`
- `NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.worldoftethys.com/wp-json/wp/v2`
- `WP_GRAPHQL_ENDPOINT=https://cms.worldoftethys.com/graphql`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_API_KEY`
- one Firebase Admin credential method

Optional:

- `VR_METADATA_TOKEN`
- `ADMIN_SECRET_KEY`
- `CRON_SECRET`

## DNS Cutover Order

1. Create the new Vercel project for `worldoftethys.com`.
2. Attach `worldoftethys.com` inside Vercel.
3. Update DNS at your registrar to point the apex and `www` to Vercel.
4. Wait for Vercel certificate issuance.
5. Verify production build is serving the correct domain metadata and sitemap.

## Post-Cutover Checks

### On `worldoftethys.com`

- `/robots.txt`
- `/sitemap.xml`
- homepage metadata
- WordPress content fetches
- login flow
- Firebase session flow
- key writing pages render correctly

### On `dcbarletta.com`

- homepage still loads
- author page still loads
- book page still loads
- contact / press still load
- outbound links to `worldoftethys.com` work

## Writing-First Launch Guidance

If your real priority is writing, do this before audio polish:

1. launch archive and natural-history pages
2. polish lore/world writing
3. stabilize WordPress editorial flow
4. add player progression quietly
5. push audio later only where it clearly improves the page

## Clean Separation Rule

After split:

- `dcbarletta.com` should sell and contextualize the work
- `worldoftethys.com` should contain the world
