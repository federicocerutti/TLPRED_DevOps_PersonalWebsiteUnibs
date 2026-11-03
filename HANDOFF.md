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
