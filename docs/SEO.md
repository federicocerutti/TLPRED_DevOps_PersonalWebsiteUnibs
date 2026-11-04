# Search and AI crawler readiness

Audit date: 3 November 2026. The owner authorised deployment later that day; the validated website is now live (implementation commit `931877c`).

## Implemented

- Content and links are generated as static HTML, including the bilingual collaboration, project, teaching and event pages. Reading them does not require JavaScript.
- Each content page has a title, description, HTTPS canonical URL, language declaration, reciprocal English/Italian alternates and an English `x-default` alternate.
- JSON-LD connects each page with the website and Federico Cerutti’s public identity. The name, role, affiliation and profile links come from existing public site content.
- Social metadata includes titles, descriptions and existing local images with descriptive alternative text.
- The sitemap contains canonical content pages. The duplicate English homepage route and external bibliography redirects are excluded.
- `robots.txt` permits crawling and advertises the sitemap. The existing policy was preserved, including its treatment of training crawlers.

No invented publication dates, event-organiser claims, course ratings, reviews or course offerings were added to structured data.

## Repeatable verification

After building:

```bash
npm run check
npm test
npm run build
npm run verify:dist
npm run test:browser
```

`verify:dist` now also runs `scripts/verify-seo.mjs`. It checks every generated content page for metadata consistency, canonical destinations, reciprocal language links, valid JSON-LD, existing social images, canonical sitemap URLs and the robots policy. It can also be run separately with `npm run verify:seo`.

Current result: 292 HTML files, including three external bibliography redirects; 289 content pages pass the SEO checks. Browser tests cover desktop/mobile layouts, both languages, keyboard navigation, themes and content without JavaScript.

## Live checks and practical limits

Read-only requests to the production homepage, robots file and sitemap returned HTTP 200. A test request using the `OAI-SearchBot` user-agent also received HTTP 200 with readable HTML. This tests the response to that user-agent from this machine; it does not verify traffic from the provider’s actual crawler IP ranges.

The live sitemap contains 31 URLs and still represents the older deployed version. The local build’s metadata and expanded sitemap will become public after an authorised deployment.

Crawlability does not guarantee indexing, rankings or inclusion in an AI answer. Google Search Console and provider indexing reports are separate evidence; they were not accessed in this audit. No search-console submissions, deployment, crawler-policy changes or analytics activation were performed.

Ordinary SEO and readable public content are the basis for AI search discovery. An `llms.txt` file is not required by Google’s AI search guidance and has not been added as a supposed ranking requirement.

## Primary guidance

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [OpenAI crawler policies](https://developers.openai.com/api/docs/bots)
- [Schema.org WebPage](https://schema.org/WebPage)


Deployment verification, 3 November 2026: live homepages, main listings, robots and sitemap returned HTTP 200 and matched the validated local build. The live sitemap now contains 288 canonical URLs, replacing the older 31-URL deployment described above. No analytics requests are enabled; Matomo installation is blocked by missing account PHP-FPM support (see `MATOMO.md`). Indexing/ranking and Search Console remain unverified.

## LinkedIn sharing preview — 4 November 2026

The default Open Graph image is now `/images/federico-cerutti-ai-cybersecurity.jpg`: a 1200 × 630 JPEG with the existing portrait, the homepage's “Adopt AI. Protect what your organisation knows.” message, and AI, cybersecurity, consultancy and training context. The homepages have substantive bilingual descriptions; default-image metadata declares JPEG dimensions. Schema.org Person keeps the original portrait rather than using the promotional card.

Regenerate with `node scripts/generate-social-card.mjs` using the installed Astro/Sharp dependency. The new image URL separates this asset from previously cached portrait previews. Check the homepage with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to request a fresh fetch before re-adding the website to Featured. Website metadata cannot force LinkedIn to refresh an already saved card. Primary guidance: [LinkedIn website sharing](https://www.linkedin.com/help/linkedin/answer/a521928).

Validation: no type diagnostics, 13 unit tests, 292 generated HTML pages, 5,249 internal links and social metadata checks across 289 content pages. Matomo remains enabled through the production deploy settings.

Revision, 4 November 2026: owner requested a quieter design and specifically **Inter Light**. The current card is `/images/federico-cerutti-ai-cybersecurity-dark.jpg`, charcoal (#202326), actual embedded Inter 300, name, AI/cybersecurity and factual research/consultancy/training context. The portrait drawing's pixels are preserved; a deterministic silhouette mask and lower fade replace the white backdrop. Original image retained. New dark portrait is used by both localized profiles and Person structured data; removed the extra night-mode dimming. Both website themes were visually checked in Chrome. Generator now uses installed Sharp and Playwright with local Chrome for actual font rendering. This supersedes the earlier slogan card.

Further owner revision, 4 November 2026: discarded the silhouette/fade treatment. Current sharing image is `federico-cerutti-ai-cybersecurity-beige.jpg`; intact original drawing receives a gentle warm paper tint (#efe8db), with Inter Light throughout. Restored “Adopt AI. Protect what your organisation knows.” and added the existing site's exact UK appointments: Honorary Senior Lecturer (Cardiff), Visiting Fellow (Southampton), Visiting Professor (Imperial). Both website portraits use `federico-cerutti-beige.png`. This is deterministic image processing, not an AI-regenerated face; image generation was unavailable in this session. Earlier image versions remain in source/history.
