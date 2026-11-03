import { test, expect, type Page } from '@playwright/test';

async function enableFixture(page: Page) {
  await page.route('**/en/advisory/**', async route => {
    const response = await route.fetch();
    const config = JSON.stringify({ enabled: true, url: 'https://analytics.example.test/matomo/', siteId: '7' }).replace(/"/g, '&quot;');
    await route.fulfill({ response, body: (await response.text()).replace(/data-analytics-config="[^"]*"/, `data-analytics-config="${config}"`) });
  });
  await page.route('https://analytics.example.test/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* intercepted tracker */' }));
}

test('minimal analytics uses a fresh page identity, sanitised URLs and heartbeat without cookies', async ({ page }) => {
  await enableFixture(page);
  await page.goto('/en/advisory/?email=private@example.com#private');
  const commands = () => page.evaluate(() => window._paq ?? []);
  const queue = await commands();
  expect(queue.slice(0, 2)).toEqual([['disableCookies'], ['disableBrowserFeatureDetection']]);
  expect(queue).toContainEqual(['enableHeartBeatTimer', 30]);
  expect(queue).toContainEqual(['setReferrerUrl', '']);
  expect(queue).toContainEqual(['setRequestMethod', 'POST']);
  expect(queue.filter(c => c[0] === 'trackPageView')).toHaveLength(1);
  expect(JSON.stringify(queue)).not.toMatch(/private@example|#private/);
  const identity = queue.find(c => c[0] === 'setVisitorId')?.[1];
  expect(identity).toMatch(/^[a-f0-9]{16}$/);
  await page.evaluate(() => {
    document.dispatchEvent(new Event('astro:page-load'));
    document.dispatchEvent(new CustomEvent('research:interaction', { detail: 'network-filter' }));
  });
  expect((await commands()).filter(c => c[0] === 'trackPageView')).toHaveLength(1);
  expect((await commands()).some(c => c[0] === 'trackEvent')).toBe(false);
  expect(await page.context().cookies()).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('cerutti-analytics-consent-v1'))).toBeNull();
  await page.reload();
  expect((await commands()).find(c => c[0] === 'setVisitorId')?.[1]).not.toBe(identity);
  await expect(page.locator('#analytics-settings')).toHaveCount(0);
});

test('disabled deployment, privacy signals and prior refusals prevent analytics requests', async ({ browser }) => {
  for (const signal of ['disabled', 'dnt', 'gpc', 'refusal']) {
    const context = await browser.newContext();
    const page = await context.newPage();
    if (signal !== 'disabled') await enableFixture(page);
    if (signal === 'dnt') await page.addInitScript(() => Object.defineProperty(navigator, 'doNotTrack', { value: '1' }));
    if (signal === 'gpc') await page.addInitScript(() => Object.defineProperty(navigator, 'globalPrivacyControl', { value: true }));
    if (signal === 'refusal') await page.addInitScript(() => localStorage.setItem('cerutti-analytics-consent-v1', JSON.stringify({ allowed: false })));
    let requests = 0;
    page.on('request', r => { if (/matomo\.(php|js)/.test(r.url())) requests++; });
    await page.goto('/en/advisory/');
    expect(requests).toBe(0);
    expect(await page.evaluate(() => window._paq ?? [])).toEqual([]);
    await context.close();
  }
});
