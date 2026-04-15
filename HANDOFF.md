# Handoff For New Codex Session

## Purpose

This repository is a standalone Astro starter for rebuilding the personal website of Federico Cerutti at:

- `https://federico-cerutti.unibs.it/`

It is intentionally derived from the visual language of the Cybersecurity Lab website in the parent repo, but re-scoped into a bilingual personal academic site.

## Current status

The starter is buildable and already passes:

```bash
npm run build
```

It includes:

- bilingual homepage (`/` and `/en/`)
- selected research index and detail pages
- selected projects index and detail pages
- teaching page
- contact page
- Open Graph/Twitter metadata
- sitemap and robots routes
- Apache-friendly `.htaccess`
- SSH/rsync deployment helper

## Where the important things are

- Site config: `src/lib/site.ts`
- Main content model: `src/lib/content-data.ts`
- Layout shell and SEO tags: `src/layouts/BaseLayout.astro`
- Homepage:
  - `src/pages/index.astro`
  - `src/pages/en/index.astro`
- Deploy helper: `scripts/deploy.sh`
- Setup notes: `README.md`

## Key decisions already taken

1. This is a personal academic site, not a lab site.
   The navigation and homepage were rewritten around Federico’s profile, research, projects, teaching, and contact.

2. The site keeps the same general look and feel as the lab website.
   I reused the same layout logic, typography, card system, spacing logic, and filtering patterns where they still made sense.

3. Content is centralized rather than spread across markdown files.
   The current implementation uses structured TypeScript objects in `src/lib/content-data.ts` for speed and portability.

4. The publication list is curated, not exhaustive.
   It currently contains a selected set of representative works, with bilingual summaries and detail pages.

5. Deployment is assumed to happen through:

```bash
rsync -avz --delete dist/ federico-cerutti@web.unibs.it:website/
```

`website/` is assumed to be the remote symlink target exposed after SSH login.

## Content provenance

The current content was assembled from:

- the existing personal site at `federico-cerutti.unibs.it`
- Federico-specific content already curated in the parent repo
- Federico’s portrait and selected project/research assets already present in the parent repo

## What is intentionally incomplete

These are not bugs. They are the obvious next-step items for a new Codex session:

1. Expand the publications section.
   The current set is representative, but not a full bibliography.

2. Review the Italian and English copy line by line.
   The structure is solid, but some copy can still be tightened for tone and consistency.

3. Decide whether to keep the current route naming.
   Right now the Italian routes use `/ricerca/`, `/progetti/`, `/contatti/` and the English routes use `/en/research/`, `/en/projects/`, `/en/contact/`. This is coherent, but could be changed if a simpler URL scheme is preferred.

4. Optionally add:
   - a downloadable CV
   - talks/events/news
   - a fuller projects archive
   - a fuller tutorial/course archive
   - person-specific publication grouping by topic/year/type

5. Verify production deployment assumptions on the UniBS host.
   The deploy script assumes direct `rsync` into `website/`. That should be checked once against the real remote environment.

## Recommended next tasks for a new Codex

If starting a fresh session, the best sequence is:

1. Read `README.md`
2. Read `HANDOFF.md`
3. Read `src/lib/content-data.ts`
4. Run:

```bash
npm install --cache .npm-cache
npm run build
```

5. Then choose one of these workstreams:

- `content pass`: expand publications/projects and tighten copy
- `design pass`: refine homepage hierarchy and card layouts
- `deployment pass`: verify SSH/rsync deployment on `web.unibs.it`

## Suggested prompt for the next Codex

Use something close to this:

> This repo is the starter for the new personal site of Federico Cerutti. Read `README.md` and `HANDOFF.md`, inspect `src/lib/content-data.ts`, then continue by [expand publications / improve copy / verify deployment / refine homepage].

## Final note

The current state is meant to be a strong starting point that is safe to move into a new repository immediately. It is not yet the final production website.
