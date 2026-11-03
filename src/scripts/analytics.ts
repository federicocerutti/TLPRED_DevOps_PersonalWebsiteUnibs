import { allowedEvents, cleanUrl, type AnalyticsConfig } from '../lib/analytics';
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
  const key = 'cerutti-analytics-consent-v1';
  let consent = false,
    loaded = false,
    lastPage = '';
  let previousPage = cleanUrl(document.referrer);
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
    consent = saved?.allowed === true && saved.expires > Date.now();
  } catch {}
  const queue = (...values: unknown[]) => {
    (window._paq ??= []).push(values);
  };
  const status = () =>
    document.querySelectorAll<HTMLElement>('[data-consent-status]').forEach((el) => {
      const it = document.documentElement.lang === 'it';
      el.textContent =
        config.enabled && consent
          ? it
            ? 'Statistiche attive con il tuo consenso.'
            : 'Analytics is on with your consent.'
          : it
            ? 'Statistiche disattivate.'
            : 'Analytics is off.';
    });
  const pageview = () => {
    if (!config.enabled || !consent) return;
    const current = cleanUrl(window.location.href);
    if (lastPage === current) return;
    queue('setReferrerUrl', previousPage);
    queue('setCustomUrl', current);
    queue('setDocumentTitle', document.title);
    queue('trackPageView');
    if (/\/(research-network|rete-di-ricerca)\//.test(new URL(current).pathname))
      queue('trackEvent', 'Website', 'network-view');
    previousPage = current;
    lastPage = current;
  };
  const start = () => {
    if (!config.enabled || !consent) return;
    if (!loaded) {
      queue('requireConsent');
      queue('disableCookies');
      queue('setTrackerUrl', config.url + 'matomo.php');
      queue('setSiteId', config.siteId);
      loaded = true;
      const script = document.createElement('script');
      script.async = true;
      script.referrerPolicy = 'no-referrer';
      script.src = config.url + 'matomo.js';
      document.head.append(script);
    }
    queue('setConsentGiven');
    pageview();
  };
  const decide = (allowed: boolean) => {
    consent = allowed;
    try {
      localStorage.setItem(key, JSON.stringify({ allowed, expires: Date.now() + 180 * 86400000 }));
    } catch {}
    if (allowed) start();
    else {
      if (loaded) {
        queue('forgetConsentGiven');
        queue('deleteCookies');
      }
      lastPage = '';
    }
    status();
  };
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('[data-consent-accept]')) decide(true);
    if (target?.closest('[data-consent-reject]')) decide(false);
    const action = target?.closest<HTMLElement>('[data-analytics-event]')?.dataset.analyticsEvent;
    if (config.enabled && consent && action && allowedEvents.has(action))
      queue('trackEvent', 'Website', action);
  });
  document.addEventListener('research:interaction', (event) => {
    const action = (event as CustomEvent<string>).detail;
    if (config.enabled && consent && allowedEvents.has(action))
      queue('trackEvent', 'Website', action);
  });
  document.addEventListener('astro:page-load', () => {
    status();
    pageview();
  });
  status();
  start();
}
