# Search and AI crawler readiness

Audit date: 3 November 2026. Changes are local and have not been deployed.

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
