import { getLocalizedCollection } from '../lib/content-data';
import { getLocalizedEvents } from '../lib/events-data';
const staticPages = Object.keys(import.meta.glob('./**/*.astro'))
  .filter((p) => !p.includes('['))
  .map((p) =>
    p
      .replace(/^\.\//, '/')
      .replace(/index\.astro$/, '')
      .replace(/\.astro$/, '/'),
  );
const details = ['en', 'it'].flatMap((locale) => [
  ...getLocalizedCollection('papers', locale as 'en' | 'it').map(
    (p) => `${locale === 'en' ? '/en/research/' : '/ricerca/'}${p.pathSlug}/`,
  ),
  ...getLocalizedCollection('projects', locale as 'en' | 'it').map(
    (p) => `${locale === 'en' ? '/en/projects/' : '/progetti/'}${p.pathSlug}/`,
  ),
  ...getLocalizedCollection('teachingPages', locale as 'en' | 'it').map(
    (p) => `${locale === 'en' ? '/en/teaching/' : '/teaching/'}${p.pathSlug}/`,
  ),
  ...getLocalizedEvents(locale as 'en' | 'it').map(
    (p) => `${locale === 'en' ? '/en/events/' : '/eventi/'}${p.pathSlug}/`,
  ),
]);
export function GET() {
  const urls = [...new Set([...staticPages, ...details])].filter(
    (p) => !['/en/', '/ricerca/', '/en/research/', '/it/ricerca/'].includes(p),
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((p) => `<url><loc>https://federico-cerutti.unibs.it${p}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
