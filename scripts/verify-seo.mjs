import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const origin = 'https://federico-cerutti.unibs.it';
const decode = (text) => text
  .replace(/&#(x[\da-f]+|\d+);/gi, (_, value) =>
    String.fromCodePoint(value.startsWith('x') ? parseInt(value.slice(1), 16) : Number(value)))
  .replace(/&(amp|quot|apos|lt|gt);/g, (_, name) =>
    ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' })[name]);
const attributes = (text) => Object.fromEntries(
  [...text.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])]),
);
const pages = new Map();
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === 'index.html') {
      const html = readFileSync(file, 'utf8');
      if (/http-equiv="refresh"/i.test(html)) continue;
      const path = file.replace(/^dist/, '').replace(/index\.html$/, '');
      const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1];
      assert.ok(head, `Missing head: ${file}`);
      const links = [...head.matchAll(/<link\b([^>]*)>/g)].map((match) => attributes(match[1]));
      const meta = Object.fromEntries([...head.matchAll(/<meta\b([^>]*)>/g)].map((match) => {
        const attrs = attributes(match[1]);
        return [attrs.name ?? attrs.property, attrs.content];
      }));
      const canonical = links.filter((link) => link.rel === 'canonical');
      assert.equal(canonical.length, 1, `Canonical count: ${path}`);
      const title = decode(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
      const locale = attributes(html.match(/<html\b([^>]*)>/)?.[1] ?? '').lang;
      const scripts = [...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter((match) => attributes(match[1]).type === 'application/ld+json');
      assert.equal(scripts.length, 1, `Structured data count: ${path}`);
      pages.set(path, {
        html, title, locale, meta, links,
        canonical: canonical[0].href,
        schema: JSON.parse(scripts[0][2]),
      });
    }
  }
}
walk('dist');
for (const [path, page] of pages) {
  const { locale, title, meta, links, canonical, schema } = page;
  assert.ok(['en', 'it'].includes(locale), `Language: ${path}`);
  assert.ok(title.trim(), `Title: ${path}`);
  assert.ok(meta.description?.trim(), `Description: ${path}`);
  assert.equal(canonical, `${origin}${path === '/en/' ? '/' : path}`, `Canonical: ${path}`);
  assert.ok(!/\bnoindex\b/i.test(meta.robots ?? ''), `Unexpected noindex: ${path}`);
  assert.equal(meta['og:url'], canonical, `Open Graph URL: ${path}`);
  assert.equal(meta['og:title'], title, `Open Graph title: ${path}`);
  assert.equal(meta['og:description'], meta.description, `Open Graph description: ${path}`);
  const image = new URL(meta['og:image']);
  assert.equal(image.origin, origin, `Social image origin: ${path}`);
  assert.ok(existsSync(join('dist', image.pathname)), `Missing social image: ${path}`);
  assert.ok(meta['og:image:alt']?.trim(), `Social image description: ${path}`);
  assert.equal(schema['@context'], 'https://schema.org', `Schema context: ${path}`);
  const graph = schema['@graph'];
  const webPage = graph.find((entry) => entry['@type'] === 'WebPage');
  assert.equal(webPage?.url, canonical, `Schema canonical: ${path}`);
  assert.equal(webPage?.inLanguage, locale, `Schema language: ${path}`);
  assert.equal(webPage?.name, title, `Schema title: ${path}`);
  assert.equal(webPage?.description, meta.description, `Schema description: ${path}`);
  const person = graph.find((entry) => entry['@type'] === 'Person');
  assert.equal(person?.name, 'Federico Cerutti', `Schema identity: ${path}`);
  assert.equal(webPage?.author?.['@id'], person['@id'], `Schema author: ${path}`);
  const alternates = links.filter((link) => link.rel === 'alternate' && link.hreflang);
  assert.ok(alternates.some((link) => link.hreflang === locale && link.href === canonical),
    `Missing self language alternate: ${path}`);
  const english = alternates.find((link) => link.hreflang === 'en');
  assert.ok(english, `Missing English alternate: ${path}`);
  assert.equal(alternates.find((link) => link.hreflang === 'x-default')?.href, english.href,
    `Default-language alternate: ${path}`);
  for (const link of alternates.filter((link) => link.hreflang !== 'x-default')) {
    const url = new URL(link.href);
    assert.equal(url.origin, origin, `Alternate origin: ${path}`);
    const target = pages.get(url.pathname);
    assert.ok(target, `Missing alternate ${link.href} from ${path}`);
    assert.equal(target.locale, link.hreflang, `Alternate language: ${path}`);
    assert.ok(target.links.some((back) =>
      back.rel === 'alternate' && back.hreflang === locale && back.href === canonical),
    `Nonreciprocal language alternate: ${path}`);
  }
}
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
for (const url of urls) {
  assert.equal(new URL(url).origin, origin, `Sitemap origin: ${url}`);
  assert.equal(pages.get(new URL(url).pathname)?.canonical, url, `Noncanonical sitemap URL: ${url}`);
}
const robots = readFileSync('dist/robots.txt', 'utf8');
assert.match(robots, /User-agent:\s*\*/i);
assert.match(robots, /^Allow:\s*\/\s*$/m);
assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots), 'Crawlers blocked at site root');
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Robots sitemap discovery');
console.log(`Verified SEO on ${pages.size} static pages: canonical URLs, reciprocal languages, default language, social metadata, JSON-LD, sitemap and crawler access.`);
