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


## Minimal personal portfolio (3 November 2026)

The review branch `codex/research-advisory-redesign` now follows the original personal site's white background, portrait and quiet typography. All text uses self-hosted Inter Light. English and Italian routes and existing detail URLs are preserved.

The homepage introduces Federico, then ARL/AFRL/Beretta collaborations, prospective-student topics and recent activity. The bilingual advisory pages explain paid commissioned research, technical consultancy and training through UniBS (contratti conto terzi), with links to the university's commissioned-research guidance, research regulations and specific conto terzi regulation. No software implementation or prototype service is offered.

Collaborations use the former research-network routes but render ordinary organisation, collaborator and publication sections. Papers are grouped by year; projects by current/completed status; events are ordered by date. There are no listing searches, filters, graphs or explorer scripts. Legacy explorer query strings are ignored. `src/lib/portfolio.ts` contains curated organisation/publication IDs for homepage ordering and selections; the approved public data and integrity checks remain authoritative for attribution. Do not attribute earlier publications to a collaborator's current employer.

```sh
npm ci --include=dev
npm run check
npm test
npm run build
npm run verify:dist
npm run preview -- --host 127.0.0.1
# With preview running and Chrome installed:
npm run test:browser
```

Node 22.12+ is required. Browser tests cover company enquiries and institutional links, both languages, static content without JavaScript, legacy query URLs, white/Inter Light presentation, keyboard access and desktop/mobile layout. Screenshots are generated in `/private/tmp/portfolio-preview/`.

This is a preview revision, not a deployment. Matomo remains disabled; its consent gates and deployment protections remain in place. See `docs/MATOMO.md`. Do not deploy or activate analytics without the owner's subsequent instruction.

### Company-first revision

The opening now leads with AI adoption, critical organisational knowledge and risk. Advisory covers knowledge protection, AI/cyber risk reviews, traceable decisions and tailored training, informed by the owner's knowledge-governance and teaching notes. The page explains that the organisation commissions UniBS, with activities, outputs, timing and fee defined before work begins.

The neutral night theme and saved preference are restored. Collaborations are expandable cards grouped as companies, institutions/research centres and universities. Opening a card reveals related papers/reports; personal names are omitted, Intelpoint is excluded, and no unsupported NEC publication attribution is added. Native details remain operable without JavaScript. Homepage organisation links open the relevant card.

The local papers archive is removed; its three former landing routes redirect to DBLP and are excluded from the sitemap. Existing research detail URLs remain available. There is no local publication listing to maintain.
