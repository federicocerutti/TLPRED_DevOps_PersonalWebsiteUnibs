import { cleanUrl, type AnalyticsConfig } from '../lib/analytics';
declare global {
  interface Window {
    _paq?: unknown[][];
    __ceruttiAnalytics?: boolean;
  }
}
if (!window.__ceruttiAnalytics) {
  window.__ceruttiAnalytics = true;
  const root = document.querySelector<HTMLElement>('[data-analytics-config]');
  const config: AnalyticsConfig = JSON.parse(root?.dataset.analyticsConfig ?? '{"enabled":false}');
  const privacySignal = navigator.doNotTrack === '1' ||
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  // A prior refusal remains respected; no new analytics preference is stored.
  let priorRefusal = false;
  try {
    priorRefusal = JSON.parse(localStorage.getItem('cerutti-analytics-consent-v1') ?? 'null')?.allowed === false;
  } catch {}
  if (config.enabled && !privacySignal && !priorRefusal) {
    const queue = (...values: unknown[]) => (window._paq ??= []).push(values);
    // Fresh, memory-only page identifier lets heartbeats update this page's duration.
    // It is never stored or reused across page loads, tabs or websites.
    const pageId = Array.from(crypto.getRandomValues(new Uint8Array(8)),
      byte => byte.toString(16).padStart(2, '0')).join('');
    queue('disableCookies');
    queue('disableBrowserFeatureDetection');
    queue('disablePerformanceTracking');
    queue('setDoNotTrack', true);
    queue('setVisitorId', pageId);
    // Native forced-cookieless mode ignores _id; cid correlates only this page's
    // heartbeats while the server continues randomising browser fingerprints.
    queue('appendToTrackingUrl', 'cid=' + pageId);
    queue('setReferrerUrl', '');
    queue('setRequestMethod', 'POST');
    queue('setTrackerUrl', config.url + 'matomo.php');
    queue('setSiteId', config.siteId);
    queue('enableHeartBeatTimer', 30);
    let lastPage = '';
    const pageview = () => {
      const current = cleanUrl(window.location.href);
      if (lastPage === current) return;
      queue('setCustomUrl', current);
      queue('setDocumentTitle', document.title);
      queue('trackPageView');
      lastPage = current;
    };
    pageview();
    const script = document.createElement('script');
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = config.url + 'matomo.js';
    document.head.append(script);
    document.addEventListener('astro:page-load', pageview);
  }
}
