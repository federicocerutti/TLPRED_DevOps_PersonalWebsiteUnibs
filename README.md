# Federico Cerutti Website Starter

This package is a standalone Astro starter for rebuilding `https://federico-cerutti.unibs.it/` with the same visual language used in the Cybersecurity Lab website, but adapted to a bilingual personal site.

## Included

- bilingual routing: Italian and English
- homepage with profile, affiliations, and highlighted sections
- selected research pages with detail views
- selected project pages with detail views
- teaching page with current teaching, tutorials, PhD courses, and thesis topics
- contact page
- richer homepage with research lines, appointments, and direct contact CTA
- Open Graph and Twitter card metadata
- Apache-friendly static output with `.htaccess`
- deployment helper for `federico-cerutti@web.unibs.it`, assuming `website/` is the remote symlink target

## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static site will be generated in `dist/`.

## Deploy

If the remote account exposes the `website` symlink in the login directory:

```bash
./scripts/deploy.sh
```

By default, that script performs these steps in order:

1. creates a timestamped tarball backup of the current remote site before any overwrite
2. copies that same backup into this repo under `backups/website/`
3. builds the Astro site locally
4. deploys `dist/` with `rsync --delete`

Use `--dry-run` to preview the deploy rsync, or `--backup-only` to stop after the backup step.

The final deploy step is still:

```bash
rsync -avz --delete dist/ federico-cerutti@web.unibs.it:website/
```

To override the destination temporarily:

```bash
REMOTE_TARGET='federico-cerutti@web.unibs.it:website/' ./scripts/deploy.sh
```

To preview the deploy without writing remote files:

```bash
./scripts/deploy.sh --dry-run
```

To create only the backup and stop before build/deploy:

```bash
./scripts/deploy.sh --backup-only
```

Optional overrides:

```bash
REMOTE_BACKUP_DIR='.website-backups' LOCAL_BACKUP_DIR='./backups/website' ./scripts/deploy.sh
```

## Content notes

- Federico’s portrait and several research/project assets come from the current lab-site repo.
- Bio, projects, tutorials, courses, and thesis topics were derived from the existing personal site plus the curated content already assembled in this repo.
- The second pass broadens the publication selection and improves the homepage narrative so the site reads as a personal academic homepage rather than a trimmed lab-site clone.
- The content is intentionally structured in `src/lib/content-data.ts` so it can be extended without changing page templates.


## Research-led advisory redesign (November 2026)

The site now includes bilingual advisory/about pages, an internal publications archive and an evidence-first research network. The original detail routes and content model remain in place. The derived data is public with owner-authorised reuse; raw imports and review notes stay in ignored `.private/` storage.

```sh
npm ci
npm run check
npm test
npm run build
npm run verify:dist
npm run preview -- --host 127.0.0.1
# In another terminal (Chrome installed):
npm run test:browser
```

Node 22.12+ is required. Astro was updated to 7.4.5 to resolve advisories in the old dependency tree; output remains static. All added interaction code is vanilla TypeScript. Browser tests use the installed Google Chrome channel. The source includes optional development tools for typing, browser tests and formatting, without a client framework or graph dependency.

Main additions: `/en/advisory/`, `/it/consulenza/`, `/en/about/`, `/it/profilo/`, `/en/research-network/`, `/it/rete-di-ricerca/`, `/it/ricerca/`, bilingual privacy pages. Publication summaries remain at their previous detail URLs. `/ricerca/` and `/en/` remain served, with canonical targets pointing to the primary routes.

Network state uses `view=institutions|people`, `q`, `sector`, `country`, `from`, `to`, `selected`. Publication state uses `q`, `year`, `status`. Counts are identifier-based and period-specific. A derived historical affiliation never becomes evidence of present employment. DAIS and verified employer evidence do not add indexed publications. See `data/research-network/README.md` and `docs/CONTENT-REVIEW.md`.

Matomo is prepared but disabled, with no production changes. See `docs/MATOMO.md` for the actual verified/blocked status. Both enablement and privacy approval flags, a real HTTPS tracker endpoint and a real Site ID are required. `scripts/deploy.sh --dry-run` now leaves the server unchanged, and website rsync protects directory or symlink `/matomo` mounts. New website backups exclude Matomo and environment files and are ignored by Git. Never run a production deployment before reviewing the preview and rollback backup.
