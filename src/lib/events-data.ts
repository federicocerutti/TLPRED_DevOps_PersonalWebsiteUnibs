import rawEvents from './events.generated.json';
import type { ImageAttribution } from './content-data';
import type { Locale } from './site';

type RawEventLocale = {
  title: string;
  summary: string;
  seoDescription: string;
  meta: string[];
  body: string;
  sidebarTitle: string;
  sidebarItems: string[];
  image: string;
  imageAttribution: ImageAttribution;
  originalPageUrl: string;
  pathSlug: string;
  typeLabel: string;
};

type RawEvent = {
  key: string;
  en: RawEventLocale;
  it: RawEventLocale;
};

export type EventEntry = {
  translationKey: string;
  locale: Locale;
  title: string;
  summary: string;
  seo: {
    title: string;
    description: string;
  };
  meta: string[];
  body: string;
  sidebarTitle: string;
  sidebarItems: string[];
  image: string;
  imageAttribution: ImageAttribution;
  originalPageUrl: string;
  pathSlug: string;
  typeLabel: string;
  year: string;
};

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&#39;/g, "'")
    .replace(/&#38;/g, '&')
    .replace(/&amp;/g, '&');

const normalizedEvents = (rawEvents as RawEvent[]).flatMap((entry) =>
  (['en', 'it'] as const).map((locale) => {
    const localized = entry[locale];
    const year = localized.meta[0]?.match(/20\d{2}/)?.[0] ?? '';
    const baseSlug = /^\d{4}$/.test(localized.pathSlug) ? `cyberchallenge-${localized.pathSlug}` : localized.pathSlug;

    return {
      translationKey: entry.key,
      locale,
      title: decodeHtmlEntities(localized.title),
      summary: decodeHtmlEntities(localized.summary),
      seo: {
        title: `${decodeHtmlEntities(localized.title)} | ${locale === 'it' ? 'Eventi' : 'Events'}`,
        description: decodeHtmlEntities(localized.seoDescription),
      },
      meta: localized.meta,
      body: decodeHtmlEntities(localized.body),
      sidebarTitle: localized.sidebarTitle,
      sidebarItems: localized.sidebarItems,
      image: localized.image,
      imageAttribution: localized.imageAttribution,
      originalPageUrl: localized.originalPageUrl,
      pathSlug: baseSlug,
      typeLabel: localized.typeLabel,
      year,
    } satisfies EventEntry;
  })
);

export function getLocalizedEvents(locale: Locale) {
  return normalizedEvents.filter((entry) => entry.locale === locale);
}

export function getFeaturedEvents(locale: Locale, limit = 3) {
  return getLocalizedEvents(locale).slice(0, limit);
}

export function getEventTranslation(translationKey: string, locale: Locale) {
  return normalizedEvents.find((entry) => entry.translationKey === translationKey && entry.locale === locale);
}
