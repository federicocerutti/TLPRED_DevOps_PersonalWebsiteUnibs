import assert from 'node:assert/strict';
import test from 'node:test';
import { pageStructuredData, serializeStructuredData } from '../src/lib/seo.ts';

test('page schema ties the visible identity to the canonical page and language', () => {
  const schema = pageStructuredData({
    locale: 'it',
    title: 'Didattica | Federico Cerutti',
    description: 'Insegnamenti e tutorial.',
    canonicalUrl: 'https://federico-cerutti.unibs.it/teaching/',
  });
  const [person, website, page] = schema['@graph'];
  assert.equal(person['@type'], 'Person');
  assert.equal(person.name, 'Federico Cerutti');
  assert.equal(page.url, 'https://federico-cerutti.unibs.it/teaching/');
  assert.equal(page.inLanguage, 'it');
  assert.deepEqual(page.author, { '@id': person['@id'] });
  assert.deepEqual(page.isPartOf, { '@id': website['@id'] });
});

test('inline structured data safely round-trips text containing a closing script tag', () => {
  const input = { name: '</script><script>alert("x")</script> & research' };
  const output = serializeStructuredData(input);
  assert.ok(!output.includes('<'));
  assert.deepEqual(JSON.parse(output), input);
});
