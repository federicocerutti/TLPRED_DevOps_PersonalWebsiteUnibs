# Website continuation handoff

## Tracking live — 4 November 2026

This section supersedes the PHP blocker and disabled tracking state below.
The owner requested installing Matomo on the university's local database, then
explicitly instructed starting tracking.

- Deployed frontend implementation: **`35e2146`**, saved on GitHub branch
  **`codex/matomo-tracking`**. GitHub returned internal server errors when updating
  the older redesign branch; pushing the new task branch succeeded. Resume from
  the tracking branch, preserving the original checkout.
- Matomo 5.14.2 is live at `https://federico-cerutti.unibs.it/matomo/`, site ID **1**.
  Private configuration and administrator credentials remain on the application
  host, outside the document root. The private knowledge base contains the access
  and recovery record.
- The deployed site automatically collects pageviews and approximate page
  duration, without analytics cookies, referrers, browser-feature or performance
  collection. It suppresses all analytics requests for Do Not Track, Global
  Privacy Control and prior refusals.
- The document's random memory-only identity changes on reload and is sent as
  `cid`. The separately installed `PageHeartbeat` extension permits only
  heartbeats to reuse that page identity while retaining native cookieless
  enforcement, random config IDs and IP masking. Native Matomo's random-ID
  branch otherwise prevents heartbeat correlation. No upstream core files were
  patched. Retest the extension before each Matomo upgrade.
- Actual public English/Italian pageviews, native focus-change heartbeat and
  reload identity were verified. A heartbeat increased duration to **34 seconds
  with one pageview**, masked IP and empty device/referrer/precise-location fields.
  The specifically identified synthetic production visits were deleted through
  Matomo's native privacy API.
- Type checks, 13 unit tests, all 17 browser tests, 292 generated HTML files,
  5,249 internal links and 289 content-page SEO checks passed. The final added
  performance-suppression command also passed the two focused analytics browser
  tests and production request checks.
- Hourly archiving/deletion and daily encrypted seven-day backups are installed.
  Backups include the extension, and isolated database restore passed. Recovery
  backups and their key are currently on the same host; no off-host disaster
  recovery is claimed. Country reporting from the default provider is not
  verified IP geolocation.
- Rollback website archive:
  `web.unibs.it:/home/federico-cerutti/.website-backups/website-20261104-112605.tar.gz`.
  The protected deploy helper excludes Matomo from website deletion and backups.
  It loads approved public flags from `ops/matomo/production.env`; normal
  builds/previews remain disabled unless explicitly given those flags.

See `docs/MATOMO.md` and `ops/matomo/PageHeartbeat/README.md` for current operation
and shutdown. Super Productivity became available before completion; the existing
website strategy task was updated and read back, preserving its broader status and
schedule.

## Read first — current handoff, 3 November 2026

This section supersedes older preview-only instructions and intermediate counts below. The owner authorised commit, sync and production deployment, then requested a final handoff and complete repository sync.

### Completed and deployed

- Website repository: `/Users/geryo/github/TLPRED_DevOps_PersonalWebsiteUnibs`; GitHub `federicocerutti/TLPRED_DevOps_PersonalWebsiteUnibs`; branch `codex/research-advisory-redesign`. Implementation release `931877c` is deployed. Documentation release `ba4fa1c` and this handoff are descendants; resume from the fetched branch tip, not an older hash mentioned below.
- Public website: https://federico-cerutti.unibs.it/ . English and Italian homepages, collaboration/project/teaching/event listings, robots, sitemap and vCard matched the validated build over HTTPS after deployment. Sitemap: 288 canonical URLs.
- Final content: 16 projects, 49 events and 27 teaching entries; project/event/teaching cards share three desktop columns and one mobile column. Collaboration statistics: eight companies, seven institutions/research centres and 36 universities. Institution removals, ARL attribution and original paper-reference links are preserved; raw historical evidence remains intact.
- Homepage has LinkedIn, clickable university email and work phone `+39 030 371 5453`, plus `/federico-cerutti.vcf`. Removed the optional analytics footer panel; kept the university privacy-policy link.
- Validation passed: no type diagnostics, 13 unit tests, 17 browser tests, 292 generated HTML files, 5,251 internal links and SEO checks for all 289 content pages. No further code change was made by the handoff-only sync.
- Rollback backup: `web.unibs.it:/home/federico-cerutti/.website-backups/website-20261103-231020.tar.gz`; local copy `/private/tmp/website-release-backups/website-20261103-231020.tar.gz`. The temporary local copy is not a durable backup. Backup archives are deliberately excluded from Git.

### Matomo: staged privately, installation and activation unfinished

HTTP PHP returned source instead of executing. The harmless random-name probe was immediately removed. Apache has `proxy_fcgi` and PHP-FPM pools for other accounts, but no dedicated pool/socket for this account was found. The real HTTP PHP identity is therefore unverified. Do not use another account's pool or expose the staged application/config while PHP source is downloadable.

Verified upstream Matomo 5.14.2 is staged at `/home/federico-cerutti/.local/share/matomo/releases/5.14.2` with a private `current` symlink. TLS database configuration is at `/home/federico-cerutti/.config/matomo/config.ini.php`, linked from the private release, mode 0600. The existing private credential environment/CA remains on that host. The authenticated, certificate-verified database diagnostic passed. Never print or commit credentials or read private configuration into frontend tooling.

There is **no public Matomo mount, completed database installation, administrator account, real site ID, archive cron, analytics backup job or live tracking**. Production analytics configuration is `enabled:false`. Database tables were not created by this session. Prepared settings are not evidence of operating retention or country-only reporting.

The prepared frontend collects page views and approximate focused-page duration only, with a 30-second heartbeat, cookies and browser-feature detection disabled, no referrers or custom events, and a fresh memory-only identifier for each document. It respects Do Not Track, Global Privacy Control and previous refusals. Native server settings must force cookieless tracking, randomise config IDs, mask three IP bytes before geolocation (104 bits for IPv6 in this release), disable visitor logs/profiles and device/referrer collection, and suppress all location detail beyond country. Verify real heartbeat correlation before activation; do not claim exact visitors/sessions or fully anonymous processing. Prepared retention is seven raw-log days and six aggregate-report months, with bounded encrypted backup retention still to implement. Apache logs belong exclusively to university sysadmins and are outside this work.

### Resume the remaining work

1. Read website `docs/MATOMO.md` and `ops/matomo/config.ini.php.example`; the former includes exact verified release/signature and administrator requirements.
2. University sysadmins must provision the dedicated PHP-FPM handler and protected `/matomo/` alias/mount, identify the HTTP PHP user, grant narrowly scoped application/config/CA access, and verify upstream hardening. Do not publish an unauthenticated installer or writable private paths. No message to sysadmins was sent; messaging requires explicit owner instruction.
3. After support is available, complete restricted installation against the existing TLS database without recreating it, obtain the real site ID and secure admin access, then apply/read back native privacy settings. Verify country-only raw records, absent cookies/browser details/referrers, per-page identifier lifetime and actual heartbeat updates.
4. Install and verify hourly archiving with overlap protection, raw/report deletion, bounded encrypted backups, isolated restore and monitoring before activation. Keep credentials and command logs private. The owner has authorised installation/deployment; earlier preview-only restrictions are historical.
5. Rebuild with the verified HTTPS endpoint and numeric site ID only after runtime/privacy/recovery checks pass, deploy through `scripts/deploy.sh`, and check actual production requests and reporting. The helper protects `/matomo/` and excludes it from website backups; Matomo recovery remains separate.

Live work is tracked in Super Productivity **Definire una strategia per il sito personale e LinkedIn**, ID `xCOj9P1GqKHCsZUzdS2Es`; deployment and blocker notes were saved and read back. Keep that task open for the unfinished Matomo work. The credential connection for the local task API and private Matomo server configuration do not transfer through Git. Knowledge-base evidence and the portable handoff are in `management/2026-11-03-personal-website-redesign-handoff.md` and `attachments/projects/personal-website-redesign/2026-11-03/` in the private personal-knowledge repository (production handoff commit `ce9f9db` before this final sync).

## Historical implementation record

## Added completed events — Fusion, TIG and Federmanager

Owner reported attendance/speaking at these past events on 3 November 2026. Added bilingual records and dedicated pages, sorted into the homepage’s three newest activities:

- **Fusion 2026, Trondheim, 23–26 June 2026:** official conference dates and logo from https://www.ntnu.edu/fusion2026. Two papers grounded in the personal-knowledge Fusion 2026 publicity package: CHARL-TRE (arXiv `2604.22979`) and Chronos frequency probing (`2605.06361`). Conference publication is owner-confirmed; publicly linked arXiv versions are labelled preprints. Existing local paper pages remain linked.
- **TIG CISO Panel Milano, 15 September 2026:** official programme https://www.theinnovationgroup.it/events/ciso-leaders-panel-milano-2026/ confirms Centro Congressi Fondazione Cariplo. Recording https://www.youtube.com/watch?v=OfLQq6fZh8w titled “Intervento di Federico Cerutti su AI RED TEAMING”, verified through YouTube oEmbed; its supplied thumbnail is used. Also links https://www.youtube.com/watch?v=gAcp7xjDS28, verified as the Open Innovation Lombardia interview “Federico Cerutti (UniBS): Cybersecurity, il ruolo critico dell’AI e le PMI italiane”, clearly labelled an earlier related interview without inventing a date.
- **Federmanager Mantova / Federmanager Academy, 24 September 2026:** owner supplied the event poster, preserved as an image. Event title “Cybersecurity e impresa: innovare senza perdere il controllo”, Sala Rossa at Confindustria Mantova. Owner’s talk: “Dall’AI che risponde all’AI che agisce: conoscenza, delega e controllo”, programme slot 17:10–18:00. These details come from the supplied poster, not an inferred event summary.

Logos/posters use contain sizing on cards and uncropped detail images. New sources have their own link labels instead of the inherited CyberSecLab label. No video embeds/autoplay added. Seventeen activity records now have loaded images in both languages. All 12 browser tests pass; build produces 208 HTML pages and verifies 3,821 internal links/sitemap coverage. Preview only; changes are local and uncommitted.

## Homepage current collaborations and network reach — latest revision

Owner requested a marketing-oriented homepage refinement on 3 November 2026. The featured section is now “Current collaborations” / “Collaborazioni in corso”, retaining ARL, AFRL and Beretta with shorter research-focus descriptions and two simple links: the dedicated collaboration page and one recent paper at its original destination. Long publication lists are moved out of the homepage presentation; all works remain available on detail pages.

“The wider research network” distinguishes current and past research relationships and displays derived totals: **8 companies, 7 institutions/research centres, 37 universities**. Counts derive from the curated collaboration presentation; the two IBM research sites count as one company. Figures describe research relationships, not active clients, contracts or endorsements. No country or publication-count claims were added.

Verified: zero type diagnostics, 11 unit tests, nine browser tests, 202 HTML pages and 3,558 internal links/sitemap coverage. English/Italian desktop/mobile light/night screenshots reviewed. Preview at http://127.0.0.1:4321/. Local changes remain uncommitted; no deployment or analytics activation.

## Collaboration cards aligned with Projects — latest owner correction

On 3 November the owner replaced the single-column direction: collaborations must use cards like Projects, without overlines or extra labels. The index now reuses `ContentCard` in its plain variant and the existing `portfolio-list` grid (three desktop columns, one mobile column). Entries contain only a linked institution name and the collaboration description. Organisation introductions remain on non-university detail pages. Group headings, dedicated pages, institution corrections and original paper destinations are preserved. This supersedes the spacious-list layout below.

Preview-only; changes remain local and uncommitted.

## Original paper references — 3 November 2026

Owner requested paper links to actual references rather than Scopus. `data/research-network/publication-links.json` now holds 37 verified publication destinations with public source references; exact DBLP-key matches against the existing publication manifest were supplemented with primary publisher/proceedings checks. The homepage and bilingual collaboration detail pages use DOI first, then curated original destinations, then existing non-Scopus URLs. Scopus is never a paper-link fallback. Imported snapshot records remain unchanged.

Four prefaces and the 2014 BNAIC input/output abstract lack a verified original destination and are shown as unlinked titles. The similarly titled journal version was deliberately not substituted for the conference abstract. About/contact retains the owner's Scopus author-profile link, which is separate from paper links.

Checks: zero type diagnostics, 11 unit tests and eight browser tests pass; 202 built pages, 3,655 internal links and sitemap verified. No Scopus paper-record hyperlinks in the build. Preview-only; local changes remain uncommitted.

## Spacious collaboration list and current teaching — 3 November 2026

Local continuation from `5e206e2` on `codex/research-advisory-redesign`: the collaboration index is now a single-column list without borders or backgrounds, grouped as companies, institutions/research centres and universities. Each entry has a linked heading and an explicit detail-page link, a readable text width and generous paragraph spacing. University organisation one-liners remain omitted. Dedicated bilingual pages and owner-corrected attribution are preserved.

Current teaching in both languages now lists Cyber and AI Risk Management (catalogue link `8822_139266_29548`) and Enterprise Intelligent Systems (`8811_139203_29554`, with its query parameters). The owner confirmed both titles and this mapping in the continuation chat. Earlier Digital Transformation and Computer Security entries are replaced; tutorials and PhD courses remain intact.

Verification: type check without diagnostics, 10 unit tests, all seven browser scenarios passing (six on the full run, corrected back-link selector passing on a targeted rerun), 202 built HTML pages and 3,655 internal links with sitemap coverage verified. Desktop/mobile light/night screenshots reviewed. Homepage spacing preserved. Preview remains at http://127.0.0.1:4321/. Changes are local and uncommitted; no deployment or analytics activation.

# Company-first portfolio revision

This supersedes the earlier visual/content direction below. Night mode restored. Homepage leads with adopting AI and protecting organisational knowledge; student invitation stays secondary. Advisory gives concrete offers for knowledge protection, AI/cyber risk review, decision traceability and training, plus a plain explanation of commissioning UniBS.

The papers index is removed and old index URLs redirect to DBLP. Collaboration cards are grouped companies → institutions/research centres → universities; names and Intelpoint are omitted. Cards reveal papers/reports on opening and support native no-JavaScript use. Existing public source data and affiliation boundaries remain intact.

Preview first remains in force. No production deployment or analytics activation.

# Minimal portfolio handoff — 3 November 2026

## Current direction

The owner approved the minimal portfolio revision on `codex/research-advisory-redesign`, following the first pass at `c9e0518`. This supersedes the former evidence explorer and marketing-style layout. The site has a white background, self-hosted Inter Light throughout, original portrait and sentence-case headings.

Homepage: biography and company invitation; ARL, AFRL, Beretta; prospective students with TRUE/NS-CEP/teaching/email links; recent events. The advisory pages explain paid research, technical consultancy and training through UniBS contracts (conto terzi) in both languages, linking to university guidance and regulations. No development/prototype offer.

The former network URLs now serve static collaborations: organisations, collaborators and papers/reports. No graphs, search, filters, counters or evidence panels. Publications are grouped by year, projects by current/completed status, events by date. All existing detail URLs and bilingual alternates remain.

## Implementation and boundaries

- `src/lib/portfolio.ts`: curated featured organisation/publication IDs and ordering.
- `src/components/PortfolioList.astro`: static listing shared by projects and events.
- `src/components/CompanyIntroduction.astro`: shared bilingual university-contract explanation.
- Approved allowlisted data remains in `data/research-network/public.json`. Raw exports remain private; preserve historical affiliations, separate IBM sites and NEC/Airbus/Beretta attribution distinctions.
- Explorer browser code has been removed. Original data integrity tests remain; browser tests now cover the portfolio and consent gates.
- Matomo remains disabled and no production changes have been made. Keep the owner-approved preview-first boundary.

## Preview and verification

See README for check/build/test commands. Preview URL: http://127.0.0.1:4321/. Browser screenshots are generated under `/private/tmp/portfolio-preview/`; durable copies and the continuation record are in personal-knowledge at `management/2026-11-03-personal-website-redesign-handoff.md`.

Review appointment titles before eventual publication: the inherited Cardiff biography/footer titles differ. No new appointment claims were introduced by this revision.

## Academic leadership and collaboration curation

The owner requested prominence for the Brescia professorship, Imperial Visiting Professor, Southampton Visiting Fellow, Cardiff Honorary Senior Lecturer, and directorship of the Brescia node of the CINI National Cybersecurity Lab. A shared role section appears on home, advisory and About; the homepage opening also names the network. The footer Cardiff title is aligned with the biography. These are individual appointments, not institutional endorsements of consultancy.

Owner correction: unspecified UK IBM records are presented under Hursley, unspecified US records under T. J. Watson, with work-ID deduplication. The original imported classifications remain as historical source data. Intelpoint, Aneurin Bevan and the Cardiff/Brescia/Southampton/Imperial collaboration cards are hidden; the TwITter paper is excluded from collaboration output. The four universities appear as appointments instead.

Collaboration cards use bilingual View related work / Close related work text and a rotating chevron. Night-mode portraits use reduced brightness/contrast to soften their white background without changing the original image.

## Navigation and collaboration copy refinement

Teaching and Events are primary navigation items in both languages. The academic-leadership section is removed from home only; the opening still mentions appointments/CINI, and the detailed roles remain on advisory/About. Home proceeds directly to collaborations and students. Shared bilingual organisation introductions and longer publication-grounded collaboration descriptions are maintained in `src/lib/portfolio.ts`, reused for the homepage ARL/AFRL/Beretta features. Organisation introductions are distinct from descriptions of joint work; no client outcomes are claimed. Public organisation sources checked include beretta.com/en-us/company, airbus.com/en, honeywell.com/us/en, blueprism.com, aboutamazon.com/what-we-do/devices-services, research.ibm.com and army.mil/arl.

## Dedicated collaboration pages

Each collaboration now has a bilingual static detail page below the existing research-network routes. Index cards are normal links with descriptions; papers/reports appear on the detail page, with back navigation and language alternates. No expandable card UI. The sitemap includes all detail pages. University cards/details omit the organisation one-liner. Homepage text has larger paragraph/list gaps and more line spacing.

Owner corrections: remove Texas A&M University-Commerce, University of Texas at Dallas, Fordham and Alpen-Adria Klagenfurt. Consolidate historical Koblenz-Landau work under University of Koblenz with ID deduplication. The owner confirms Bakdash was at ARL for the Subjective Bayesian Networks paper (scopus:2-s2.0-85045180992); include it under ARL. Imported source history is retained; portfolio presentation applies these owner corrections.

Latest owner correction, 3 November 2026: removed the Research and academic leadership section from Advisory/Consulenza in both languages. About retains the academic-role section. Type check and build/internal-link verification passed; both local preview routes checked.

Latest homepage order, 3 November 2026: generic “Collaborations” heading and introduction, then current/past network statistics (8 companies, 7 institutions/research centres, 37 universities) and the full-network link, followed by “Recent collaborations” / “Collaborazioni recenti” featuring ARL, AFRL and Beretta. This replaces the preceding current-first ordering and wording.

Activity images restored, 3 November 2026: all 14 bilingual event records already referenced existing image files matching origin/main. AttributedImage was suppressing any image with an Unsplash attribution. Removed that source-based rendering filter so all supplied images render, retaining source badges. Because this is the shared component, other supplied Unsplash images also render consistently. Verified 14 loaded activity images in each event listing and three homepage activity thumbnails per language; ten browser tests, type check, build and 3,672 internal links/sitemap checks pass. Preview-only, local uncommitted changes.

Teaching cards expanded, 3 November 2026: both routes now share TeachingPage with visible section headings, introductory text, two desktop columns/one mobile column, larger full titles, generous paragraph spacing and explicit catalogue/material links. Current-course summaries use broad themes supported by the CARM goal and EIS course context; no assessment, schedule, credit or unconfirmed delivery details are published. Historical titles/summaries derive from the existing bilingual teaching detail records, preserving dates and URLs. Type check without diagnostics, build and 3,686 internal links verified; all eleven browser tests pass; desktop/mobile light/night screenshots reviewed. Preview-only, uncommitted.

## Expanded Projects page — 3 November 2026

Owner requested POSBI as current participation (not PI), AIDECC and older funded projects from the supplied CV. The bilingual Projects index now has 20 entries, larger two-column layouts (one on mobile), role/funding/year metadata and dedicated bilingual detail pages. Source facts live in `src/lib/additional-projects.json`; shared rendering in `ProjectsPage.astro`. AIDECC is under Previous projects, with the award year but no invented completion date. Public UNIBS/FAIR announcement links are on the respective detail pages. Older CV submitted proposals were excluded. Source details and email/OneDrive provenance remain in the private knowledge-base continuation note.

Verified: no type diagnostics, 11 unit tests, 238 HTML pages, 4,361 internal links/sitemap/private-field checks, 13 browser tests, both languages at desktop/mobile widths and no JavaScript. Local preview: http://127.0.0.1:4321/en/projects/ . Uncommitted, no deployment or analytics activation. Existing strategy task xCOj9P1GqKHCsZUzdS2Es updated and read back.

## Event editorial correction — 3 November 2026

Owner corrected the Open Innovation interview placement: it is now a separate bilingual event dated **6 February 2025**, with slug `open-innovation-cybersecurity-ai-pmi-2025`, its own attributed video thumbnail and article/video links. Removed the earlier-interview section from TIG CISO Panel. Source article confirms the publication date: https://www.openinnovation.regione.lombardia.it/it/news/news/8414/cerutti-unibs-cybersecurity-il-ruolo-critico-dell-ai-e-le-pmi-italiane . The date records publication, not a claimed recording date. Mantova narrative shortened to the event and talk topic; time-slot and extra programme commentary removed. The original poster remains available. Activities now total 18. This supersedes the earlier description of a related interview on TIG. Prefer relevant topics and outcomes over programme minutiae or editorial explanations in public copy. Local preview only.

Owner refinement: removed the two internal “Paper overview” links and Italian equivalents from the Fusion 2026 event page; retained direct preprint links. Preview rebuilt, no deployment.

Owner refinement: company-sponsored PhD scholarships now appear alongside conto terzi on Collaborations, and in the shared company introduction on Advisory, in both languages. Wording focuses on research themes of shared interest; no invented procedural or financial details. Local preview only.

Owner refinement: removed the homepage current/past research relationships sentence and its Italian equivalent; collaboration statistics retained. Local preview rebuilt.

Owner editorial preference: collaboration snippets use past tense in both languages, including homepage featured descriptions and shared curated/generated descriptions on index and detail pages. Organisation identity descriptions retained. Preview only.

## Project removals and unique images — 3 November 2026

Owner removed Sidneo and MedRAD2; MedRAD remains. The website now contains **18 projects**, each with a new, distinct Unsplash image selected for its research subject. Shared mapping `src/lib/project-images.json` applies the same attributed image to each project’s bilingual index/detail presentations. These are illustrative stock images, not photographs of the project, its team or facilities. All source pages confirmed free access under the Unsplash licence. No generation was needed. Prior raw assets and historical CV records remain intact.

The source manifest records original photo URLs, authors, source image URLs and content hashes. New source IDs were checked against other site content; all 18 downloaded images had distinct hashes, absent from existing images. Visually reviewed the full contact sheet and final desktop preview. Images load on all 18 entries in both languages at desktop/mobile sizes. Removed detail pages are absent from the build.

Checks: zero type diagnostics, 11 unit tests, 236 HTML pages, 4,377 internal links/sitemap/private-field checks and 13 passing browser tests. Local preview rebuilt; edits remain uncommitted and unpublished. Super Productivity strategy task `xCOj9P1GqKHCsZUzdS2Es` updated and verified.

Owner layout correction: Projects now use the same `ContentCard` and `portfolio-list` grid as Events: three desktop columns, one mobile column, 220px images and matching heading sizes/spacing. This supersedes the larger two-column project layout. All 18 images and factual project metadata remain. Local preview only.

## CV event archive expansion — 3 November 2026

Owner requested more conference participation, paper-related talks and roundtables from the CV. Added **31 selected bilingual entries**, bringing the archive to **49 events**. Coverage: 19 conference/doctoral-consortium entries, four IJCAI tutorials, three roundtables, three invited workshops and two invited keynotes, spanning 2009–2023. Academic visits and programme committee service were excluded. Existing recent events and their artwork remain.

Participation roles come from the CV; associated papers come from the publication manifest and link directly to original publisher/proceedings/DOI records. Conference speaker participation and paper coauthorship are kept distinct in the text. The IJCAI doctoral-consortium entry is correctly 2011, confirmed against the official proceedings; the CV’s “2021” in its 2011 section is a typo. Tutorial pages supply the exact IJCAI 2019 title/date and existing bilingual materials links. Verified programme dates for Dagstuhl 2016, Lorentz 2018 and Bochum 2018; other unsupported day/month dates remain year-only. Generic host links are labelled as host links, not as recovered programmes.

Four newly sourced Unsplash photographs illustrate the historical archive; source badges explicitly label them illustrative. No stock photograph is presented as a photograph of the actual event. English/Italian index descriptions now include conferences, tutorials and keynotes. Public output does not contain private CV paths or biographical family context.

Local preview only; edits remain uncommitted and unpublished. Existing Super Productivity strategy task: `xCOj9P1GqKHCsZUzdS2Es`.

Verified: zero type diagnostics; 11 unit tests; 298 HTML pages; 5,657 internal links, bilingual alternates/sitemap and private-field checks; 15 browser tests, plus a focused repeat of the updated theme/static-navigation check. Visually reviewed desktop and mobile archive layouts, loaded images and actual light/night rendering. All 49 event cards have images; recent homepage events remain unchanged. Super Productivity strategy task updated and read back successfully.

## Past teaching from the CV — 3 November 2026

Added 18 teaching records from the owner-supplied CV: 14 university courses at Brescia, Cardiff and Aberdeen, three doctoral courses (Humans-in-the-loop, 2024; Human-Computer Interaction for AI, 2023; Introduction to UNIX/Linux, 2017), and the Intelligenza Artificiale, Mente, Impresa second-level university master’s programme (2021–2022). Teaching now has five bilingual sections and 27 entries: two current courses, four research tutorials, six doctoral courses, 14 earlier university courses and one postgraduate professional programme.

Original course titles, recorded years, degree levels and lecturer/shared-teaching/teaching-assistant/tutorial-teaching roles are preserved. Credits describe the course, not a claimed personal teaching load. The older CV’s ongoing Brescia courses show their starting years only; no end dates or current status were inferred. No new syllabus or materials URL was invented. Student names and dated supervision totals were excluded. Existing current catalogue links and tutorial/doctoral detail pages remain.

Data: `src/lib/past-teaching.json`; shared teaching sections merge and order doctoral courses. Teaching presentation now uses section keys for introductions and link labels, and stable section anchors, so adding historical sections does not mislabel them. Current-course regression checks target the current section, allowing legitimate historical courses to appear elsewhere. Local preview only; uncommitted and unpublished. Strategy task: `xCOj9P1GqKHCsZUzdS2Es`.

Verified: no type diagnostics; 11 unit tests; build of 298 HTML pages; 5,657 internal links, sitemap and private-field checks; 16 browser tests. Bilingual history and doctoral sections visually reviewed at desktop/mobile sizes; existing theme and keyboard checks pass. Super Productivity strategy task updated and read back.

Owner layout correction — Teaching now reuses the same plain `ContentCard` component and `portfolio-list` grid as Projects and Events: three columns on desktop, one on mobile, matching card width, 1.25rem headings and card/row spacing. Supersedes the earlier two-column teaching layout and larger heading/spacing rules. Shared cards support headings without a link for historical courses with no published materials. All 27 bilingual teaching entries and their existing links remain. Local preview only.

Teaching layout verified: no type diagnostics, build, 5,657 internal links/sitemap checks and 16 browser tests. Reviewed both languages at desktop/mobile sizes, light/night themes, keyboard focus and static navigation. Strategy task updated and verified.

2026-11-03 — Removed the Teaching page subtitle and all section introduction descriptions in both languages. Section headings, all 27 course entries and the shared three-column layout remain. Local preview rebuilt; build and internal-link checks passed. Unpublished.

2026-11-03 — Removed both introductory paragraphs from the Collaborations page in English and Italian, including the commissioned-research/PhD-sponsorship paragraph. Kept the heading, organisation groups and all organisation cards/detail links. The separate Advisory company introduction retains its collaboration options. Local preview rebuilt; build and internal-link checks passed. Unpublished.

2026-11-03 — Homepage featured collaboration renamed from Beretta to Fabbrica d'Armi Pietro Beretta in both languages. Existing organisation/detail and paper links preserved. Preview rebuilt; both generated homepages verified. Unpublished.

2026-11-03 — Removed University of Southern California from curated collaborations in both languages. Generated detail pages and sitemap entry omitted by the shared curation filter; raw historical research records preserved. Homepage university statistics update automatically. Preview rebuilt; both collaboration lists and absence of the detail page verified; internal-link/sitemap checks passed. Unpublished.

2026-11-03 — Removed MedRAD and the 2022 Digital Twins and Cyber Physical Systems / Beretta project from both project lists and generated detail pages. Projects now total 16. Historical CV/source records and prior image assets retained. Preview rebuilt; removal and internal-link/sitemap checks verified. Unpublished.

## SEO and AI crawler audit — 3 November 2026

Audited local generated pages and read-only production responses. Existing static HTML, metadata, HTTPS canonicals, reciprocal English/Italian links, sitemap and permissive robots policy were sound. Added shared JSON-LD Person/WebSite/WebPage identity/page relationships and English `x-default` alternates. Identity fields use existing visible public facts and profile links; no dates, event organiser claims or course ratings were invented. JSON-LD serialization escapes script delimiters. No crawler policy change or llms.txt requirement introduced.

Added `scripts/verify-seo.mjs` to `verify:dist`, plus standalone `verify:seo`. Checks every content page for metadata/schema consistency, languages, reciprocal alternates, canonical sitemap entries, existing social images and robots discovery. Two meaningful schema/serialization unit tests added. Verified: no type diagnostics, 13 unit tests, 292 built HTML files (289 content pages and three bibliography redirects), 5,537 internal links/private-field/sitemap checks, all 289 SEO page checks and 16 browser tests including static content.

Production homepage, robots and sitemap returned HTTP 200. A request labelled OAI-SearchBot received identical HTML to the browser-labelled request; this is a user-agent response test from this Mac, not verification of real crawler IP access. Live sitemap still contains 31 URLs from the older deployment. SEO improvements and the expanded local sitemap remain unpublished. Actual indexing/ranking and Search Console status were not verified. See website `docs/SEO.md` for primary guidance and repeatable checks. Existing strategy task `xCOj9P1GqKHCsZUzdS2Es` updated and read back.


2026-11-03 — Added a downloadable UTF-8 vCard 3.0 (`public/federico-cerutti.vcf`) with name, university, role, university email, owner-supplied work phone +39 030 371 5453, website and LinkedIn. Both homepages have a wrapping contact-link row with email, phone, LinkedIn and bilingual Save contact links. Verified type checks, build, internal links/SEO and all 17 browser tests, including actual vCard downloads on both mobile homepages without JavaScript. Strategy task `xCOj9P1GqKHCsZUzdS2Es` updated and read back. Local preview only; uncommitted and unpublished.

## Owner-authorised production release and Matomo staging — 3 November 2026

Owner authorised commit/sync/deploy and the minimal cookieless analytics profile. Removed the optional analytics footer panel; kept the university policy link and revised historical privacy pages to link to it. Prepared page-view-only tracking with cookie/browser-feature detection disabled, 30-second heartbeat, fresh memory-only per-document identity, no referrers or events, and Do Not Track/GPC/prior-refusal suppression. Backend session/config ID randomisation and country-only reporting must be verified before activation. Retention template corrected to native Deletelogs section and shortened to seven raw-log days/six report months. See docs/MATOMO.md for exact status.

Matomo 5.14.2 signature verified and staged privately on web.unibs.it with a private TLS database config. Authenticated encrypted DB check passes. HTTP PHP probe returned source text, then was removed; no dedicated account PHP-FPM pool exists. No public mount/database installation/administrator/site ID/cron/backups or analytics activation was attempted after this blocker. University sysadmins must provision the account's PHP-FPM handler and protected mount, then runtime, privacy and recovery checks must pass. Website can deploy safely with tracking disabled. No Apache logs accessed.


## Production release — 3 November 2026

Owner authorised commit/sync/deploy. Website implementation commit `931877c` pushed to GitHub `codex/research-advisory-redesign` and deployed to the existing university host using the protected deployment helper. Pre-deployment rollback archive saved privately on the host and under `/private/tmp/website-release-backups/` locally; not added to Git. Type checks, 13 unit tests, all 17 browser tests, 292 generated HTML pages, 5,251 internal links and 289 content-page SEO checks passed. Live homepages, listing pages, robots, sitemap and vCard returned HTTP 200 and matched the validated build byte-for-byte. Live sitemap now contains 288 canonical URLs. The optional analytics panel was removed; the university privacy-policy link remains.

Matomo activation remains blocked: HTTP PHP requests are served as source; no dedicated account PHP-FPM pool exists. Probe removed immediately. Verified Matomo 5.14.2 release and private TLS config staged outside the public directory; authenticated encrypted DB check passed. No public mount, database installation, site ID, admin account, scheduled archive, backup job or tracking activation. Prepared minimal frontend includes no cookies/browser-feature detection, memory-only per-page identity, 30-second heartbeat, no referrer/custom events and privacy-signal/prior-refusal suppression. Prepared retention shortened to seven raw-log days/six aggregate-report months. Actual backend minimisation/heartbeat, country-only enrichment, retention, archiving and backup/restore still need installation and verification after university sysadmins enable the account PHP-FPM handler and protected Matomo mount. No Apache logs accessed.

Live operational follow-up remains in Super Productivity strategy task **Definire una strategia per il sito personale e LinkedIn**, ID `xCOj9P1GqKHCsZUzdS2Es`; no completion of Matomo installation is claimed. See website `docs/MATOMO.md` for the concrete administrator handoff and activation checks.
