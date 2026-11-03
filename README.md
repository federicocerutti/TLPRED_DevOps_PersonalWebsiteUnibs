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

## Academic leadership and collaboration curation

The owner requested prominence for the Brescia professorship, Imperial Visiting Professor, Southampton Visiting Fellow, Cardiff Honorary Senior Lecturer, and directorship of the Brescia node of the CINI National Cybersecurity Lab. A shared role section appears on home, advisory and About; the homepage opening also names the network. The footer Cardiff title is aligned with the biography. These are individual appointments, not institutional endorsements of consultancy.

Owner correction: unspecified UK IBM records are presented under Hursley, unspecified US records under T. J. Watson, with work-ID deduplication. The original imported classifications remain as historical source data. Intelpoint, Aneurin Bevan and the Cardiff/Brescia/Southampton/Imperial collaboration cards are hidden; the TwITter paper is excluded from collaboration output. The four universities appear as appointments instead.

Collaboration cards use bilingual View related work / Close related work text and a rotating chevron. Night-mode portraits use reduced brightness/contrast to soften their white background without changing the original image.

## Navigation and collaboration copy refinement

Teaching and Events are primary navigation items in both languages. The academic-leadership section is removed from home only; the opening still mentions appointments/CINI, and the detailed roles remain on advisory/About. Home proceeds directly to collaborations and students. Shared bilingual organisation introductions and longer publication-grounded collaboration descriptions are maintained in `src/lib/portfolio.ts`, reused for the homepage ARL/AFRL/Beretta features. Organisation introductions are distinct from descriptions of joint work; no client outcomes are claimed. Public organisation sources checked include beretta.com/en-us/company, airbus.com/en, honeywell.com/us/en, blueprism.com, aboutamazon.com/what-we-do/devices-services, research.ibm.com and army.mil/arl.

## Dedicated collaboration pages

Each collaboration now has a bilingual static detail page below the existing research-network routes. Index cards are normal links with descriptions; papers/reports appear on the detail page, with back navigation and language alternates. No expandable card UI. The sitemap includes all detail pages. University cards/details omit the organisation one-liner. Homepage text has larger paragraph/list gaps and more line spacing.

Owner corrections: remove Texas A&M University-Commerce, University of Texas at Dallas, Fordham and Alpen-Adria Klagenfurt. Consolidate historical Koblenz-Landau work under University of Koblenz with ID deduplication. The owner confirms Bakdash was at ARL for the Subjective Bayesian Networks paper (scopus:2-s2.0-85045180992); include it under ARL. Imported source history is retained; portfolio presentation applies these owner corrections.

## Spacious collaboration list and current teaching — 3 November 2026

Local continuation from `5e206e2` on `codex/research-advisory-redesign`: the collaboration index is now a single-column list without borders or backgrounds, grouped as companies, institutions/research centres and universities. Each entry has a linked heading and an explicit detail-page link, a readable text width and generous paragraph spacing. University organisation one-liners remain omitted. Dedicated bilingual pages and owner-corrected attribution are preserved.

Current teaching in both languages now lists Cyber and AI Risk Management (catalogue link `8822_139266_29548`) and Enterprise Intelligent Systems (`8811_139203_29554`, with its query parameters). The owner confirmed both titles and this mapping in the continuation chat. Earlier Digital Transformation and Computer Security entries are replaced; tutorials and PhD courses remain intact.

Verification: type check without diagnostics, 10 unit tests, all seven browser scenarios passing (six on the full run, corrected back-link selector passing on a targeted rerun), 202 built HTML pages and 3,655 internal links with sitemap coverage verified. Desktop/mobile light/night screenshots reviewed. Homepage spacing preserved. Preview remains at http://127.0.0.1:4321/. Changes are local and uncommitted; no deployment or analytics activation.

## Original paper references — 3 November 2026

Owner requested paper links to actual references rather than Scopus. `data/research-network/publication-links.json` now holds 37 verified publication destinations with public source references; exact DBLP-key matches against the existing publication manifest were supplemented with primary publisher/proceedings checks. The homepage and bilingual collaboration detail pages use DOI first, then curated original destinations, then existing non-Scopus URLs. Scopus is never a paper-link fallback. Imported snapshot records remain unchanged.

Four prefaces and the 2014 BNAIC input/output abstract lack a verified original destination and are shown as unlinked titles. The similarly titled journal version was deliberately not substituted for the conference abstract. About/contact retains the owner's Scopus author-profile link, which is separate from paper links.

Checks: zero type diagnostics, 11 unit tests and eight browser tests pass; 202 built pages, 3,655 internal links and sitemap verified. No Scopus paper-record hyperlinks in the build. Preview-only; local changes remain uncommitted.

## Collaboration cards aligned with Projects — latest owner correction

On 3 November the owner replaced the single-column direction: collaborations must use cards like Projects, without overlines or extra labels. The index now reuses `ContentCard` in its plain variant and the existing `portfolio-list` grid (three desktop columns, one mobile column). Entries contain only a linked institution name and the collaboration description. Organisation introductions remain on non-university detail pages. Group headings, dedicated pages, institution corrections and original paper destinations are preserved. This supersedes the spacious-list layout below.

Preview-only; changes remain local and uncommitted.

## Homepage current collaborations and network reach — latest revision

Owner requested a marketing-oriented homepage refinement on 3 November 2026. The featured section is now “Current collaborations” / “Collaborazioni in corso”, retaining ARL, AFRL and Beretta with shorter research-focus descriptions and two simple links: the dedicated collaboration page and one recent paper at its original destination. Long publication lists are moved out of the homepage presentation; all works remain available on detail pages.

“The wider research network” distinguishes current and past research relationships and displays derived totals: **8 companies, 7 institutions/research centres, 37 universities**. Counts derive from the curated collaboration presentation; the two IBM research sites count as one company. Figures describe research relationships, not active clients, contracts or endorsements. No country or publication-count claims were added.

Verified: zero type diagnostics, 11 unit tests, nine browser tests, 202 HTML pages and 3,558 internal links/sitemap coverage. English/Italian desktop/mobile light/night screenshots reviewed. Preview at http://127.0.0.1:4321/. Local changes remain uncommitted; no deployment or analytics activation.

## SEO and crawler verification

See [SEO audit and checks](docs/SEO.md). After building, `npm run verify:dist` now also verifies per-page SEO metadata, JSON-LD, multilingual alternates and crawler discovery. The audit covers the local version; deployment remains a separate owner-authorised step.
