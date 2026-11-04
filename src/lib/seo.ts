import { site, type Locale } from './site.ts';

export function pageStructuredData({
  locale,
  title,
  description,
  canonicalUrl,
}: {
  locale: Locale;
  title: string;
  description: string;
  canonicalUrl: string;
}) {
  const base = `${site.baseUrl}/`;
  const personId = `${base}#person`;
  const websiteId = `${base}#website`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Federico Cerutti',
        honorificPrefix: 'Prof.',
        url: base,
        image: new URL('/images/people/federico-cerutti-beige.png', base).toString(),
        jobTitle: site.contactRole[locale],
        affiliation: {
          '@type': 'CollegeOrUniversity',
          name: 'Università degli Studi di Brescia',
          url: 'https://www.unibs.it/',
        },
        sameAs: [
          site.dblpUrl,
          'https://scholar.google.com/citations?user=v0mFZhoAAAAJ',
          'https://www.linkedin.com/in/federicocerutti/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: base,
        name: site.name,
        inLanguage: ['en', 'it'],
        publisher: { '@id': personId },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { '@id': websiteId },
        author: { '@id': personId },
      },
    ],
  };
}

// Keep titles and descriptions from closing the inline JSON-LD script element.
export function serializeStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
