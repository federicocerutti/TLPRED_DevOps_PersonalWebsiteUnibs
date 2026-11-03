export type AnalyticsConfig = { enabled: boolean; url: string; siteId: string };
export function publicTrackerUrl(input: string): string {
  try {
    const u = new URL(input);
    if (
      u.protocol !== 'https:' ||
      u.username ||
      u.password ||
      u.search ||
      u.hash ||
      u.hostname === 'localhost' ||
      /^\d+\.\d+\.\d+\.\d+$/.test(u.hostname) ||
      u.hostname.includes(':')
    )
      return '';
    return u.href.replace(/\/?$/, '/');
  } catch {
    return '';
  }
}
export function cleanUrl(input: string, base?: string): string {
  try {
    const u = new URL(input, base);
    return /^https?:$/.test(u.protocol) ? u.origin + u.pathname : '';
  } catch {
    return '';
  }
}
export const allowedEvents = new Set([
  'advisory-contact',
  'publication-link',
  'project-link',
  'research-outbound',
  'network-view',
  'network-filter',
  'cv-download',
]);
