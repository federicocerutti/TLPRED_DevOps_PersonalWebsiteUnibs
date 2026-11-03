import { test, expect } from '@playwright/test';

test('company journey and bilingual university agreements', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.home-profile')).toContainText('Full Professor');
  await expect(page.locator('.featured-collaborations h3')).toHaveText(['ARL', 'AFRL', 'Beretta']);
  await expect(page.getByRole('link', { name: 'TRUE', exact: true })).toHaveAttribute(
    'href',
    '/en/projects/true/',
  );
  await expect(page.getByRole('link', { name: 'NS-CEP', exact: true })).toHaveAttribute(
    'href',
    '/en/projects/ns-cep/',
  );
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Advisory', exact: true })
    .click();
  await expect(page.locator('main')).toContainText('contratti conto terzi');
  await expect(
    page.getByRole('link', { name: 'Commissioned research', exact: true }),
  ).toHaveAttribute('href', 'https://www.unibs.it/en/enti-aziende/ricerca-commissionata');
  await expect(
    page.getByRole('link', { name: 'Research regulations (in Italian)', exact: true }),
  ).toHaveAttribute('href', /regolamenti-ricerca$/);
  await expect(
    page.getByRole('link', {
      name: 'Regulation for commissioned activities (in Italian)',
      exact: true,
    }),
  ).toHaveAttribute('href', 'https://www.unibs.it/it/node/1536');
  await expect(page.locator('main a[href="mailto:federico.cerutti@unibs.it"]')).toBeVisible();
  await page.getByRole('link', { name: 'Passa a Italiano' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  await expect(page.locator('main')).toContainText('contratti conto terzi');
  await expect(
    page.getByRole('link', { name: 'Ricerca commissionata', exact: true }),
  ).toHaveAttribute('href', 'https://www.unibs.it/it/enti-aziende/ricerca-commissionata');
});

test('static portfolio listings, legacy queries and attribution', async ({ page }) => {
  for (const path of [
    '/en/research-network/?q=private&selected=anything',
    '/it/rete-di-ricerca/',
    '/en/research/',
    '/it/ricerca/',
    '/en/projects/',
    '/progetti/',
    '/en/events/',
    '/eventi/',
  ]) {
    await page.goto(path);
    await expect(
      page.locator('main input, main select, main form, main svg, [data-network-panel]'),
    ).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
  }
  await page.goto('/en/research-network/');
  const entries = page.locator('.collaboration');
  await expect(entries.nth(0)).toContainText('Army Research Laboratory');
  await expect(entries.nth(1)).toContainText('Air Force Research Laboratory');
  await expect(entries.nth(2)).toContainText('Stefano Morzenti');
  const nec = page.locator('[id="org:nec-laboratories-europe-verified-current"]');
  await expect(nec).toContainText('Lorenzo Nodari');
  await expect(nec.locator('li')).toHaveCount(0);
  await expect(page.locator('[id="org:airbus-dais-joint-demonstration"]')).toContainText(
    'Alistair Nottle',
  );
  await page.goto('/en/projects/');
  await expect(page.getByRole('heading', { name: 'Current projects', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Completed projects', exact: true }),
  ).toBeVisible();
});

test('white Inter Light layouts, keyboard focus and screenshots', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const [path, name] of [
      ['/', 'home'],
      ['/en/advisory/', 'advisory'],
      ['/it/', 'home-it'],
      ['/en/research-network/', 'collaborations'],
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      ).toBeTruthy();
      expect(
        await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe('rgb(255, 255, 255)');
      const weights = await page
        .locator('main h1, main h2, main h3, main p, .primary-nav a')
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).fontWeight));
      expect(weights.every((w) => w === '300')).toBeTruthy();
      await expect(page.locator('[data-theme-toggle]')).toHaveCount(0);
      const grid = page.locator('.three-col').first();
      if (await grid.count()) {
        const columns = await grid.evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
        );
        expect(columns).toBe(width === 390 ? 1 : 3);
      }
      if (name !== 'collaborations')
        await page.screenshot({
          path: `/private/tmp/portfolio-preview/${name}-${width}.png`,
          fullPage: true,
        });
    }
  }
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
});

test('portfolio content remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of [
    '/',
    '/en/research-network/',
    '/en/research/',
    '/en/projects/',
    '/it/consulenza/',
  ]) {
    await page.goto(`http://127.0.0.1:4321${path}`);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('main a').count()).toBeGreaterThan(2);
  }
  await expect(page.locator('main')).toContainText('attività a pagamento');
  await context.close();
});
