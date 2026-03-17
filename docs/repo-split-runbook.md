# Repo Split Runbook: `dcbarletta.com` and `worldoftethys.com`

## Current State

Right now this local checkout is on `main`, and its `origin` remote points to:

- `https://github.com/DanielBarletta81/world-of-tethys-next.git`

That is backwards if this checkout is meant to remain the source repo for `dcbarletta.com`.

## Recommended Structure

Keep two separate repos and two separate deployments:

### `dcbarletta.com`

Owns:

- author homepage
- about / press / contact
- book sales pages
- short excerpts and promotional pages
- links out to the World of Tethys site

Should not own:

- heavy atlas/map interactions
- player progression systems
- world simulation routes
- most immersive exploration features

### `worldoftethys.com`

Owns:

- interactive world map
- lore archive
- natural history and deep writing
- player login / progression
- Earth-linked environmental overlays
- future VR metadata / identity bridge

## Best Split Strategy

Do **not** dual-push one repo forever.

The cleanest setup is:

1. Repoint this repo to the real `dcbarletta.com` GitHub repo.
2. Create a brand new GitHub repo for World of Tethys.
3. Copy this codebase into a new local folder for the World of Tethys repo.
4. Prune each repo so each one owns only its responsibility.
5. Deploy them as separate Vercel projects with separate domains.

This is simpler and safer than trying to maintain one repo with two identities.

## Exact Workflow

### 1. Fix the current repo remote

From this repo:

```bash
git remote set-url origin https://github.com/<YOU>/<DCBARLETTA-REPO>.git
git remote -v
```

After this, `origin` should be the author-site repo.

### 2. Make a new local repo for World of Tethys

From the parent directory:

```bash
rsync -a --exclude=.git /path/to/dcbarletta-repo/ /path/to/world-of-tethys-web/
cd /path/to/world-of-tethys-web
git init
git branch -M main
git add .
git commit -m "Initial split from dcbarletta.com"
```

This gives you a clean repo without dragging the wrong git history and remotes with it.

### 3. Create the new GitHub repo

Example:

```bash
gh repo create world-of-tethys-web --private --source=. --remote=origin --push
```

Or create it on GitHub first, then:

```bash
git remote add origin https://github.com/<YOU>/world-of-tethys-web.git
git push -u origin main
```

## Vercel Setup

Create two separate Vercel projects.

### Project A: `dcbarletta.com`

- connect to the `dcbarletta` repo
- keep domain: `dcbarletta.com`
- remove heavy Tethys-specific env vars unless they are still needed

### Project B: `worldoftethys.com`

- connect to the `world-of-tethys-web` repo
- add domains:
  - `worldoftethys.com`
  - `www.worldoftethys.com`
- add env vars for:
  - WordPress / WPGraphQL
  - Firebase Auth
  - Firestore
  - any Earth-data API providers

## Content Boundary Recommendation

If writing is the priority, then ship `worldoftethys.com` as a writing-first world archive before investing more in audio-heavy surfaces.

### Keep on `dcbarletta.com`

- author bio
- media kit
- contact
- Amazon / Goodreads / author links
- a lean book landing page

### Move to `worldoftethys.com`

- world hub
- map
- locations
- creatures
- natural history essays
- archive / timeline
- sign-in and progression

### De-emphasize for now

- audio-first homepage blocks
- heavy ambient media
- nonessential sound features

That keeps hosting lighter and aligns with your stated priority: publish more writing.

## SEO / Linking Strategy

Use the two sites to reinforce each other without duplicating intent.

### `dcbarletta.com`

- rank for author terms
- rank for book / creator / press intent
- link clearly to `worldoftethys.com`

### `worldoftethys.com`

- rank for world, lore, natural history, archive, atlas, and region terms
- use strong canonicals only on the world domain
- avoid mirroring full world pages on the author site

## Suggested First Release for `worldoftethys.com`

Prioritize:

1. homepage
2. world hub
3. map
4. lore / archive
5. natural history writing
6. login / profile bootstrap

Leave advanced audio and VR polish for later.

## Immediate Next Actions

1. Point this repo’s `origin` at the real `dcbarletta.com` GitHub repo.
2. Create a new local folder and initialize `world-of-tethys-web`.
3. Create the new GitHub repo.
4. Create the new Vercel project and attach `worldoftethys.com`.
5. Then prune each repo so they stop carrying each other’s weight.

## Notes for This Codebase

- The existing auth direction is already compatible with a standalone World of Tethys site.
- WordPress + WPGraphQL should remain the source for stable lore and history.
- Firestore should own user progression and future VR metadata.
- The old `scripts/push_to_tethys.sh` can be used for one-off pushes, but it should not become the permanent architecture.
