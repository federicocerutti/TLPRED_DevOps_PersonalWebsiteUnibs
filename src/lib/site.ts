export type Locale = 'it' | 'en';

export const site = {
  name: 'Prof. Federico Cerutti',
  baseUrl: 'https://federico-cerutti.unibs.it',
  socialImage: '/images/people/federico-cerutti.png',
  contactEmail: 'federico.cerutti@unibs.it',
  contactPerson: 'Prof. Federico Cerutti',
  contactRole: {
    it: 'Professore Ordinario, Università degli Studi di Brescia',
    en: 'Full Professor, University of Brescia',
  },
  address: 'Dipartimento di Ingegneria dell’Informazione, via Branze 38, 25123 Brescia, Italy',
  addressUrl: 'https://www.unibs.it/it/ateneo/organizzazione/dipartimenti/ingegneria-dellinformazione-dii',
  dblpUrl: 'https://dblp.org/pid/97/18.html',
};

export const localeLabels: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
};

export const sectionLabels = {
  it: {
    home: 'Home',
    research: 'Ricerca',
    projects: 'Progetti',
    events: 'Eventi',
    teaching: 'Didattica',
    contactPage: 'Contatti',
    contact: 'Contatti',
    filterSearch: 'Cerca per titolo o sommario',
    filterKind: 'Tipo',
    filterStatus: 'Stato',
    filterTag: 'Tag',
    filterPerson: 'Persone',
    filterYear: 'Anno',
    all: 'Tutti',
    noResults: 'Nessun risultato con i filtri correnti.',
    readMore: 'Apri la pagina',
  },
  en: {
    home: 'Home',
    research: 'Research',
    projects: 'Projects',
    events: 'Events',
    teaching: 'Teaching',
    contactPage: 'Contact',
    contact: 'Contact',
    filterSearch: 'Search by title or summary',
    filterKind: 'Type',
    filterStatus: 'Status',
    filterTag: 'Tag',
    filterPerson: 'People',
    filterYear: 'Year',
    all: 'All',
    noResults: 'No results match the current filters.',
    readMore: 'Open page',
  },
};

export const navByLocale: Record<Locale, { label: string; href: string }[]> = {
  it: [
    { label: 'Articoli scientifici', href: site.dblpUrl },
    { label: 'Progetti', href: '/progetti/' },
    { label: 'Didattica', href: '/teaching/' },
    { label: 'Eventi', href: '/eventi/' },
  ],
  en: [
    { label: 'Papers', href: site.dblpUrl },
    { label: 'Projects', href: '/en/projects/' },
    { label: 'Teaching', href: '/en/teaching/' },
    { label: 'Events', href: '/en/events/' },
  ],
};

export function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatYear(date: Date) {
  return String(date.getFullYear());
}

export function getProjectActiveYears(startDate: string, endDate?: string) {
  const currentYear = new Date().getFullYear();
  const startYear = new Date(startDate).getFullYear();
  const endYear = endDate ? new Date(endDate).getFullYear() : currentYear;
  const years: string[] = [];

  for (let year = startYear; year <= Math.min(endYear, currentYear); year += 1) {
    years.push(String(year));
  }

  return years;
}
