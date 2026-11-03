import { test, expect } from '@playwright/test';

test('company journey and bilingual university agreements', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.home-profile')).toContainText('I help companies');
  await expect(page.locator('.academic-roles')).toHaveCount(0);
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(navigation.getByRole('link', { name: 'Teaching', exact: true })).toHaveAttribute(
    'href',
    '/en/teaching/',
  );
  await expect(navigation.getByRole('link', { name: 'Events', exact: true })).toHaveAttribute(
    'href',
    '/en/events/',
  );
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
    '/en/projects/',
    '/progetti/',
    '/en/events/',
    '/eventi/',
  ]) {
    await page.goto(path);
    await expect(
      page.locator('main input, main select, main form, svg.network-diagram, [data-network-panel]'),
    ).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
  }
  await page.goto('/en/research-network/');
  await expect(page.locator('.collaboration-group > h2')).toHaveText([
    'Companies',
    'Institutions and research centres',
    'Universities',
  ]);
  await expect(page.locator('main')).not.toContainText('Intelpoint');
  await expect(page.locator('main')).not.toContainText('Aneurin Bevan');
  await expect(page.locator('main')).not.toContainText('TwITter');
  await expect(page.locator('main')).not.toContainText('site unspecified');
  for (const id of [
    'org:cardiff-university',
    'org:university-of-brescia',
    'org:university-of-southampton',
    'org:imperial-college-london',
  ])
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(0);
  await expect(page.locator('main details')).toHaveCount(0);
  for (const name of ['Texas A&M', 'Texas at Dallas', 'Fordham', 'Klagenfurt', 'Koblenz-Landau'])
    await expect(page.locator('main')).not.toContainText(name);
  const universities = page.locator('.collaboration-group').last();
  await expect(universities.locator('.organisation-introduction')).toHaveCount(0);
  await page.locator('[id="org:ibm-research-hursley-uk"]').click();
  await expect(page).toHaveURL(/research-network\/ibm-research-hursley-uk\//);
  await expect(page.locator('.publication')).toHaveCount(8);
  await page.getByRole('link', { name: 'All collaborations', exact: true }).click();
  await page.locator('[id="org:ibm-t-j-watson-research-center"]').click();
  await expect(page.locator('.publication')).toHaveCount(10);
  await page.goto('/en/research-network/university-of-koblenz/');
  await expect(page.locator('.publication')).toHaveCount(8);
  await expect(page.locator('.organisation-introduction')).toHaveCount(0);
  await page.goto('/en/research-network/us-army-research-laboratory-devcom/');
  await expect(page.locator('main')).toContainText(
    'Subjective bayesian networks and human-in-the-loop situational understanding',
  );
  await page.getByRole('link', { name: 'Passa a Italiano' }).click();
  await expect(page).toHaveURL(/it\/rete-di-ricerca\/us-army-research-laboratory-devcom\//);
  await page.goto('/en/projects/');
  await expect(page.getByRole('heading', { name: 'Current projects', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Completed projects', exact: true }),
  ).toBeVisible();
});

test('light and night Inter Light layouts, keyboard focus and screenshots', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'light');
  });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const [path, name] of [
      ['/', 'home'],
      ['/en/advisory/', 'advisory'],
      ['/it/', 'home-it'],
      ['/en/research-network/', 'collaborations'],
      ['/en/research-network/fabbrica-d-armi-pietro-beretta/', 'collaboration-detail'],
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
      await page.locator('[data-theme-toggle]').click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      expect(
        await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe('rgb(23, 23, 23)');
      await page.screenshot({
        path: `/private/tmp/portfolio-preview/${name}-${width}-dark.png`,
        fullPage: true,
      });
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await page.locator('[data-theme-toggle]').click();
      const grid = page.locator('.three-col').first();
      if (await grid.count()) {
        const columns = await grid.evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
        );
        expect(columns).toBe(width === 390 ? 1 : 3);
      }

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
  for (const path of ['/', '/en/research-network/', '/en/projects/', '/it/consulenza/']) {
    await page.goto(`http://127.0.0.1:4321${path}`);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('main a').count()).toBeGreaterThan(2);
  }
  await expect(page.locator('main')).toContainText('attività a pagamento');
  await context.close();
});
