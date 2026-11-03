import { test, expect } from '@playwright/test';
test('advisory journey, bilingual navigation and disabled tracking', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (r) => {
    if (/matomo\.(php|js)/.test(r.url())) requests.push(r.url());
  });
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('AI, security');
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Advisory', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/advisory\//);
  await expect(
    page.getByRole('link', { name: 'Discuss an advisory engagement' }).first(),
  ).toHaveAttribute('href', 'mailto:federico.cerutti@unibs.it');
  await page.getByRole('link', { name: 'Passa a Italiano' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  await expect(page.locator('h1')).toContainText('decisioni tecniche');
  await page.locator('#analytics-settings summary').click();
  await expect(page.locator('[data-consent-accept]')).toBeDisabled();
  expect(requests).toEqual([]);
});
test('publication search, year/source filters, empty/reset and history', async ({ page }) => {
  await page.goto('/en/research/');
  await expect(page.locator('[data-pub-row]:visible')).toHaveCount(162);
  await page.locator('[data-pub-q]').fill('extortion');
  await expect(page.locator('[data-pub-count]')).toContainText('2 / 162');
  await page.locator('[data-pub-year]').selectOption('2026');
  await expect(page.locator('[data-pub-row]:visible')).toHaveCount(2);
  await page.locator('[data-pub-status]').selectOption('DBLP');
  await expect(page.locator('[data-pub-empty]')).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.locator('[data-pub-row]:visible')).toHaveCount(162);
  await page.goBack();
  await expect(page.locator('[data-pub-empty]')).toBeVisible();
  await page.goto('/it/ricerca/?q=uncertainty');
  await expect(page.locator('[data-pub-q]')).toHaveValue('uncertainty');
  await expect(page.locator('h1')).toHaveText('Pubblicazioni.');
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
});
test('institution evidence, people, filters, deep links and overview tables', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/en/research-network/?selected=org:nec-laboratories-europe-verified-current');
  await expect(page.locator('[data-network-count]')).toContainText('66 organisations');
  const panel = page.locator('[data-network-panel]');
  await expect(panel.locator('h2')).toContainText('NEC Laboratories');
  await expect(panel).toContainText('0 works in period');
  await expect(panel).toContainText('Lorenzo Nodari');
  await expect(panel).toContainText('Current organisation profile');
  await page.getByRole('button', { name: 'Industry connections' }).click();
  await expect(page).toHaveURL(/sector=Industry/);
  expect(await page.locator('[data-network-results] tr').count()).toBeGreaterThan(5);
  await page.getByLabel('Search organisation or researcher').fill('Hursley');
  await expect(page.locator('[data-network-results] tr')).toHaveCount(1);
  await page.locator('[data-network-results] button').click();
  await expect(panel.locator('h2')).toContainText('Hursley');
  await expect(panel).toContainText('4 works in period');
  await page.getByLabel('From year').fill('2020');
  await page.getByLabel('To year').fill('2020');
  await expect(panel).toContainText('1 works in period');
  await page.getByRole('button', { name: 'People', exact: true }).click();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.getByRole('button', { name: 'People', exact: true }).click();
  await expect(page.locator('[data-network-count]')).toContainText('177 people');
  await page.getByLabel('Search organisation or researcher').fill('Morzenti');
  await expect(page.locator('[data-network-results] tr')).toHaveCount(1);
  await page.locator('[data-network-results] button').click();
  await expect(panel).toContainText('Beretta');
  await expect(panel).toContainText('2026');
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.getByRole('button', { name: 'People', exact: true }).click();
  await page.getByRole('button', { name: 'Show full overview' }).click();
  await expect(page.locator('[data-overview] svg')).toBeVisible();
  await page.locator('[data-overview] > details > summary').click();
  await expect(page.locator('[data-edge-table] caption')).toContainText('720');
  expect(errors).toEqual([]);
});
test('network state survives reload and browser back; keyboard selection works', async ({
  page,
}) => {
  await page.goto('/it/rete-di-ricerca/?sector=Industry&q=Airbus');
  await expect(page.locator('[data-network-results] tr')).toHaveCount(1);
  const button = page.locator('[data-network-results] button');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-network-panel] h2')).toContainText('Airbus');
  await expect(page.locator('[data-network-panel]')).toContainText('DAIS demo participant');
  await page.reload();
  await expect(page.locator('[data-network-panel] h2')).toContainText('Airbus');
  await page.goBack();
  await expect(page.getByLabel('Cerca organizzazione o ricercatore')).toHaveValue('Airbus');
});
test('mobile layouts, dark theme, reduced motion and screenshots', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.screenshot({
      path: `../../outputs/after-${width === 390 ? 'mobile' : 'desktop'}.png`,
      fullPage: true,
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.screenshot({
      path: `../../outputs/after-${width === 390 ? 'mobile' : 'desktop'}-dark.png`,
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.goto('/en/research-network/?selected=org:ibm-research-hursley-uk');
    await expect(page.locator('[data-network-panel] h2')).toHaveText('IBM Research Hursley (UK)');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    await page.screenshot({
      path: `../../outputs/network-${width === 390 ? 'mobile' : 'desktop'}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/advisory/');
  await page.screenshot({ path: '../../outputs/advisory-desktop.png', fullPage: true });
});
test('essential network evidence works with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/en/research-network/');
  const fallback = page.locator('[data-network-fallback]');
  await expect(fallback).toBeVisible();
  await fallback.locator('summary').filter({ hasText: 'IBM Research Hursley' }).click();
  await expect(fallback.locator('details[open]')).toContainText('Historical');
  await expect(fallback.locator('details[open] a').first()).toHaveAttribute('href', /^https:\/\//);
  await context.close();
});
