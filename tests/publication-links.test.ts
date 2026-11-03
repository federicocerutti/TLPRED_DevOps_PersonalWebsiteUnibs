import test from 'node:test';
import assert from 'node:assert/strict';
import links from '../data/research-network/publication-links.json' with { type: 'json' };
import { research, sourceUrl } from '../src/lib/research.ts';

test('paper destinations preserve identity and never fall back to Scopus', () => {
  const works = new Map(research.works.map(w => [w.id, w]));
  for (const [id, link] of Object.entries(links)) {
    assert.ok(works.has(id), `Unknown work ${id}`);
    assert.match(link.url, /^https?:\/\//);
    assert.match(link.reference, /^https?:\/\//);
    assert.ok(!new URL(link.url).hostname.endsWith('scopus.com'));
  }
  for (const w of research.works) {
    const destination = sourceUrl(w);
    if (destination) assert.ok(!new URL(destination).hostname.endsWith('scopus.com'), w.title);
    if (w.doi) assert.equal(destination, `https://doi.org/${w.doi}`);
  }
  assert.equal(sourceUrl(works.get('scopus:2-s2.0-105052372080')!), 'https://openreview.net/forum?id=UJwnFHlqEf');
  assert.equal(sourceUrl(works.get('scopus:2-s2.0-105017691020')!), 'https://ceur-ws.org/Vol-4025/paper3.pdf');
  // Generic Preface titles must not pick up the unrelated 2019 journal preface.
  assert.equal(sourceUrl(works.get('scopus:2-s2.0-85052829699')!), '');
  assert.equal(sourceUrl(works.get('scopus:2-s2.0-85072669612')!), '');
});
