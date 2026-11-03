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
