import { test, expect } from '@playwright/test';
// Exercise the real built tracker through a local-only configuration fixture.
// No settings are changed on disk and all tracker endpoints are intercepted.
test('consent gates network requests; navigation and events are sanitised and deduplicated', async ({
  page,
}) => {
  await page.route('**/en/advisory/**', async (route) => {
    const response = await route.fetch();
    let html = await response.text();
    const config = JSON.stringify({
      enabled: true,
      url: 'https://analytics.example.test/matomo/',
      siteId: '7',
    }).replace(/"/g, '&quot;');
    html = html
      .replace(/data-analytics-config="[^"]*"/, `data-analytics-config="${config}"`)
      .replace(/(data-consent-accept)(\s+disabled(?:="[^"]*")?)/, '$1');
    await route.fulfill({ response, body: html });
  });
  const requests: string[] = [];
  await page.route('https://analytics.example.test/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      contentType: 'application/javascript',
      body: '/* intercepted Matomo endpoint */',
    });
  });
  await page.goto('/en/advisory/?email=private@example.com#private');
  await expect(page.locator('[data-consent-accept]')).toBeEnabled();
  expect(requests).toEqual([]);
  await page.locator('#analytics-settings summary').click();
  await page.locator('[data-consent-accept]').click();
  await expect.poll(() => requests.length).toBe(1);
  const commands = () => page.evaluate(() => window._paq ?? []);
  let queue = await commands();
  expect(queue[0]).toEqual(['requireConsent']);
  expect(queue.filter((c) => c[0] === 'trackPageView')).toHaveLength(1);
  expect(JSON.stringify(queue)).not.toContain('private@example');
  expect(JSON.stringify(queue)).not.toContain('#private');
  await page.evaluate(() => {
    document.dispatchEvent(new Event('astro:page-load'));
    document.dispatchEvent(new Event('astro:page-load'));
  });
  expect((await commands()).filter((c) => c[0] === 'trackPageView')).toHaveLength(1);
  await page.evaluate(() => {
    history.pushState(null, '', '/en/research/?q=secret#name');
    document.title = 'Publications';
    document.dispatchEvent(new Event('astro:page-load'));
    document.dispatchEvent(new Event('astro:page-load'));
    document.dispatchEvent(new CustomEvent('research:interaction', { detail: 'network-filter' }));
    document.dispatchEvent(new CustomEvent('research:interaction', { detail: 'secret query' }));
  });
  queue = await commands();
  expect(queue.filter((c) => c[0] === 'trackPageView')).toHaveLength(2);
  expect(queue).toContainEqual(['setCustomUrl', 'http://127.0.0.1:4321/en/research/']);
  expect(queue).toContainEqual(['setDocumentTitle', 'Publications']);
  expect(queue).toContainEqual(['trackEvent', 'Website', 'network-filter']);
  expect(JSON.stringify(queue)).not.toContain('secret');
  await page.locator('[data-consent-reject]').click();
  const before = (await commands()).length;
  await page.evaluate(() => {
    history.pushState(null, '', '/it/');
    document.dispatchEvent(new Event('astro:page-load'));
    document.dispatchEvent(new CustomEvent('research:interaction', { detail: 'network-filter' }));
  });
  expect((await commands()).length).toBe(before);
  await expect(page.locator('[data-consent-status]')).toContainText('off');
});

test('expired preferences never start tracking and disabled mode overrides saved consent', async ({
  page,
}) => {
  let requested = false;
  page.on('request', (r) => {
    if (/matomo\.(php|js)/.test(r.url())) requested = true;
  });
  await page.route('**/en/advisory/', async (route) => {
    const response = await route.fetch();
    let html = await response.text();
    const config = JSON.stringify({
      enabled: true,
      url: 'https://analytics.example.test/matomo/',
      siteId: '7',
    }).replace(/"/g, '&quot;');
    html = html
      .replace(/data-analytics-config="[^"]*"/, `data-analytics-config="${config}"`)
      .replace(/(data-consent-accept)(\s+disabled(?:="[^"]*")?)/, '$1');
    await route.fulfill({ response, body: html });
  });
  await page.route('https://analytics.example.test/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: '/* intercepted */' }),
  );
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('fixture-seeded')) {
      localStorage.setItem(
        'cerutti-analytics-consent-v1',
        JSON.stringify({ allowed: true, expires: Date.now() - 1000 }),
      );
      sessionStorage.setItem('fixture-seeded', 'true');
    }
  });
  await page.goto('/en/advisory/');
  await expect(page.locator('[data-consent-accept]')).toBeEnabled();
  expect(requested).toBe(false);
  expect(await page.evaluate(() => window._paq ?? [])).toEqual([]);
  await page.evaluate(() =>
    localStorage.setItem(
      'cerutti-analytics-consent-v1',
      JSON.stringify({ allowed: true, expires: Date.now() + 86400000 }),
    ),
  );
  await page.goto('/en/research-network/?q=private');
  expect(requested).toBe(false);
  expect(await page.evaluate(() => window._paq ?? [])).toEqual([]);
  await expect(page.locator('meta[name="referrer"]')).toHaveAttribute('content', 'strict-origin');
});
