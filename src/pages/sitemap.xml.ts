import { getLocalizedCollection } from '../lib/content-data';

const staticUrls = [
  '/',
  '/en/',
  '/it/',
  '/progetti/',
  '/en/projects/',
  '/teaching/',
  '/en/teaching/',
];

const projectUrls = [
  ...getLocalizedCollection('projects', 'it').map((entry) => `/progetti/${entry.pathSlug}/`),
  ...getLocalizedCollection('projects', 'en').map((entry) => `/en/projects/${entry.pathSlug}/`),
];

const teachingUrls = [
  ...getLocalizedCollection('teachingPages', 'it').map((entry) => `/teaching/${entry.pathSlug}/`),
  ...getLocalizedCollection('teachingPages', 'en').map((entry) => `/en/teaching/${entry.pathSlug}/`),
];

const urls = [...staticUrls, ...projectUrls, ...teachingUrls];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>https://federico-cerutti.unibs.it${url}</loc></url>`)
    .join('\n')}\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
