import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';
const files = [];
function walk(p) {
  for (const name of readdirSync(p)) {
    const f = join(p, name);
    if (statSync(f).isDirectory()) walk(f);
    else files.push(f);
  }
}
walk('dist');
const ip = ['10', '20', '25', '109'].join('.');
let links = 0,
  htmlCount = 0;
for (const file of files.filter((p) => /\.(html|js|json|map|xml|txt|css)$/.test(p))) {
  const body = readFileSync(file, 'utf8');
  for (const word of [
    ip,
    'rawAffiliation',
    'reviewFlags',
    'MATOMO_DB_PASSWORD',
    'MATOMO_DB_HOST',
    'root-password',
  ])
    assert.ok(!body.includes(word), `Forbidden field in ${file}: ${word}`);
  if (file.endsWith('.html')) {
    htmlCount++;
    assert.equal(
      (body.match(/<h1(?:\s|>)/g) ?? []).length,
      1,
      `Heading missing or duplicated: ${file}`,
    );
    assert.ok(body.includes('rel="canonical"'), file);
    assert.ok(body.includes('hreflang='), file);
    for (const match of body.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
      const path = match[1];
      if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/matomo/')) continue;
      const local = join('dist', decodeURIComponent(path));
      assert.ok(
        existsSync(local) || existsSync(join(local, 'index.html')),
        `Broken local target ${path} in ${file}`,
      );
      links++;
    }
  }
}
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
for (const file of files.filter((p) => p.endsWith('/index.html'))) {
  const url = file.replace(/^dist/, '').replace(/index.html$/, '');
  if (url === '/en/' || url === '/ricerca/') continue;
  assert.ok(
    sitemap.includes(`https://federico-cerutti.unibs.it${url}</loc>`),
    `Missing sitemap: ${url}`,
  );
}
assert.ok(
  !readFileSync('dist/index.html', 'utf8').includes('network.'),
  'Network code loaded on homepage',
);
console.log(
  `Verified ${htmlCount} HTML pages, ${links} internal links, sitemap coverage and no private fields in public output.`,
);
