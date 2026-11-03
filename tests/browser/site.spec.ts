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
  await expect(page.locator('.featured-collaborations h3')).toHaveText(['ARL', 'AFRL', "Fabbrica d'Armi Pietro Beretta"]);
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
  await page.locator('[id="org:ibm-research-hursley-uk"] h3 a').click();
  await expect(page).toHaveURL(/research-network\/ibm-research-hursley-uk\//);
  await expect(page.locator('.publication')).toHaveCount(8);
  await page.getByRole('link', { name: '← All collaborations', exact: true }).click();
  await page.locator('[id="org:ibm-t-j-watson-research-center"] h3 a').click();
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
    page.getByRole('heading', { name: 'Previous projects', exact: true }),
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
      ['/it/rete-di-ricerca/', 'collaborations-it'],
      ['/en/teaching/', 'teaching'],
      ['/teaching/', 'teaching-it'],
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

test('featured and collaboration paper links use original references', async ({ page }) => {
  for (const path of ['/', '/it/', '/en/research-network/us-army-research-laboratory-devcom/', '/it/rete-di-ricerca/us-army-research-laboratory-devcom/']) {
    await page.goto(path);
    await expect(page.locator('main a[href*="scopus.com"]')).toHaveCount(0);
  }
  await page.goto('/');
  await expect(page.locator('.featured-collaborations a[title="Scaling Online Complex Event Detection with Synthetic Supervision and Mamba-Based Neural Algorithmic Reasoning"]'))
    .toHaveAttribute('href', 'https://openreview.net/forum?id=UJwnFHlqEf');
});

test('every activity displays its supplied image and source attribution', async ({ page }) => {
  test.setTimeout(60000);
  for (const path of ['/', '/it/']) {
    await page.goto(path);
    const recent = page.locator('.three-col').last();
    await expect(recent.locator('article')).toHaveCount(3);
    await expect(recent.locator('article img')).toHaveCount(3);
  }
  for (const path of ['/en/events/', '/eventi/']) {
    await page.goto(path);
    const activities = page.locator('.portfolio-list .content-card');
    await expect(activities).toHaveCount(49);
    for (const activity of await activities.all()) {
      const image = activity.locator('img');
      await expect(image).toHaveCount(1);
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBeTruthy();
      await expect(activity.locator('.attribution-badge')).toHaveCount(1);
    }
  }
});

test('CV archive keeps conference research, tutorials and roundtables distinct', async ({ page }) => {
  for (const base of ['/en/events/', '/eventi/']) {
    await page.goto(`${base}techdefense-2023/`);
    await expect(page.locator('h1')).toContainText('Artificial Intelligence for Intelligence Analysis');
    await expect(page.locator('.prose')).toContainText('TechDefense 2023');
    await page.goto(`${base}turing-data-science-directors-2018/`);
    await expect(page.locator('.detail-facts')).toContainText('2018');
    await expect(page.locator('.prose')).toContainText('Directors of Data Science Institutes');
    await page.goto(`${base}ijcai-2011-doctoral-consortium/`);
    await expect(page.locator('.detail-facts')).toContainText('2011');
    await expect(page.locator('a[href="https://www.ijcai.org/proceedings/2011/465"]')).toBeVisible();
    await page.goto(`${base}ijcai-2019-tutorial/`);
    const tutorialPath = base.startsWith('/en/')
      ? '/en/teaching/argumentation-machine-learning/'
      : '/teaching/argomentazione-e-machine-learning/';
    await page.locator(`.prose a[href="${tutorialPath}"]`).click();
    await expect(page.locator('h1')).toContainText('Argumentation and Machine Learning');
    await page.goto(`${base}aaai-2020/`);
    await expect(page.locator('.prose a')).toHaveAttribute('href', 'https://doi.org/10.1609/aaai.v34i04.6015');
  }
});

test('CV event archive supports both themes and static navigation', async ({ browser }) => {
  for (const width of [1440, 390]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      const context = await browser.newContext({
        colorScheme,
        viewport: { width, height: 1000 },
      });
      await context.addInitScript((theme) => localStorage.setItem('theme', theme), colorScheme);
      const page = await context.newPage();
      for (const base of ['/en/events/', '/eventi/']) {
        await page.goto(base);
        await expect(page.locator('html')).toHaveAttribute('data-theme', colorScheme);
        await expect(page.locator('.portfolio-list .content-card')).toHaveCount(49);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
        await page.locator(`a[href="${base}techdefense-2023/"]`).first().scrollIntoViewIfNeeded();
        await expect.poll(() => page.locator('.portfolio-list img').evaluateAll((images) =>
          images.filter((image) => {
            const rect = image.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < innerHeight;
          }).every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0),
        )).toBeTruthy();
        await page.screenshot({ path: `/private/tmp/portfolio-preview/cv-archive-${base.startsWith('/en/') ? 'en' : 'it'}-${width}-${colorScheme}.png` });
        await page.locator(`a[href="${base}techdefense-2023/"]`).first().click();
        await expect(page.locator('h1')).toContainText('TechDefense 2023');
        await expect(page.locator('.prose')).toContainText('Artificial Intelligence for Intelligence Analysis');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      }
      await context.close();
    }
    const staticContext = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 1000 },
    });
    const staticPage = await staticContext.newPage();
    for (const base of ['/en/events/', '/eventi/']) {
      await staticPage.goto(base);
      await expect(staticPage.locator('.portfolio-list .content-card')).toHaveCount(49);
      await staticPage.locator(`a[href="${base}techdefense-2023/"]`).first().click();
      await expect(staticPage.locator('.prose')).toContainText('Artificial Intelligence for Intelligence Analysis');
    }
    await staticContext.close();
  }
});

test('new events preserve dates, papers, recordings and original artwork', async ({ page }) => {
  for (const base of ['/en/events/', '/eventi/']) {
    await page.goto(base);
    const cards = page.locator('.portfolio-list .content-card');
    await expect(cards.nth(0)).toContainText('24');
    await expect(cards.nth(1)).toContainText('15');
    await expect(cards.nth(2)).toContainText('Fusion 2026');
    await page.goto(base + 'fusion-2026-trondheim/');
    await expect(page.locator('main a[href="https://arxiv.org/abs/2604.22979"]')).toHaveCount(1);
    await expect(page.locator('main a[href="https://arxiv.org/abs/2605.06361"]')).toHaveCount(1);
    await expect(page.locator('main img')).toHaveAttribute('src', '/images/sourced/events/fusion-2026-logo.png');
    await page.goto(base + 'tig-ciso-panel-milano-2026/');
    await expect(page.locator('.prose a[href="https://www.youtube.com/watch?v=OfLQq6fZh8w"]')).toHaveCount(1);
    await expect(page.locator('.prose a[href="https://www.youtube.com/watch?v=gAcp7xjDS28"]')).toHaveCount(0);
    await page.goto(base + 'open-innovation-cybersecurity-ai-pmi-2025/');
    await expect(page.locator('.prose a[href="https://www.youtube.com/watch?v=gAcp7xjDS28"]')).toHaveCount(1);
    await expect(page.locator('main')).toContainText(base.startsWith('/en/') ? '6 February 2025' : '6 febbraio 2025');
    await page.goto(base + 'federmanager-mantova-ai-conoscenza-delega-controllo-2026/');
    await expect(page.locator('.prose')).not.toContainText('17:10');
    await expect(page.locator('main img')).toHaveAttribute('src', '/images/sourced/events/federmanager-mantova-2026.png');
    await expect(page.locator('main')).not.toContainText('original CyberSecLab');
  }
});

test('homepage introduces the network before recent collaborations', async ({ page }) => {
  for (const [path, heading] of [['/', 'Recent collaborations'], ['/it/', 'Collaborazioni recenti']]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await expect(page.locator('.network-statistics dd')).toHaveText(['8', '7', '36']);
    expect(await page.locator('.network-statistics').evaluate(el =>
      Boolean(el.compareDocumentPosition(document.querySelector('.recent-collaborations-heading')!) & Node.DOCUMENT_POSITION_FOLLOWING),
    )).toBeTruthy();
    await expect(page.locator('.featured-collaborations h3')).toHaveText(['ARL', 'AFRL', "Fabbrica d'Armi Pietro Beretta"]);
    await expect(page.locator('.featured-collaboration-links a')).toHaveCount(6);
    await expect(page.locator('.research-network-summary a')).toHaveAttribute('href', path === '/' ? '/en/research-network/' : '/it/rete-di-ricerca/');
  }
});

test('project-style collaboration cards and current teaching links in both languages', async ({ page }) => {
  for (const path of ['/en/research-network/', '/it/rete-di-ricerca/']) {
    await page.goto(path);
    const entries = page.locator('.collaboration-group .content-card--plain');
    expect(await entries.count()).toBeGreaterThan(0);
    await expect(page.locator('.collaboration-group .meta, .collaboration-group .organisation-introduction')).toHaveCount(0);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const columns = await page.locator('.portfolio-list').first().evaluate(
        el => getComputedStyle(el).gridTemplateColumns.split(' ').length,
      );
      expect(columns).toBe(width === 390 ? 1 : 3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
  }
  for (const path of ['/en/teaching/', '/teaching/']) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: 'Cyber and AI Risk Management', exact: true }))
      .toHaveAttribute('href', 'https://unibs.coursecatalogue.cineca.it/corsi/2026/1479/insegnamenti/2026/8822_139266_29548/2025/1479');
    await expect(page.getByRole('link', { name: 'Enterprise Intelligent Systems', exact: true }))
      .toHaveAttribute('href', 'https://unibs.coursecatalogue.cineca.it/corsi/2025/1477/insegnamenti/2026/8811_139203_29554/2025/8811?coorte=2025&schemaid=3626');
    await expect(page.locator('#current-teaching')).not.toContainText('Digital Transformation');
    await expect(page.locator('#current-teaching')).not.toContainText('Computer Security');
  }
});

test('teaching cards have readable descriptions and visible section headings', async ({ page }) => {
  for (const [path, headings] of [
    ['/en/teaching/', ['Current teaching', 'Research tutorials', 'PhD courses', 'Earlier university teaching', 'Postgraduate professional teaching']],
    ['/teaching/', ['Insegnamenti correnti', 'Tutorial di ricerca', 'Corsi di dottorato', 'Insegnamenti universitari precedenti', 'Didattica nei master universitari']],
  ] as const) {
    await page.goto(path);
    await expect(page.locator('.teaching-section h2')).toHaveText([...headings]);
    await expect(page.locator('.teaching-card')).toHaveCount(27);
    await expect(page.getByRole('link', { name: 'Evidential Reasoning and Learning', exact: true })).toBeVisible();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.locator('.teaching-grid').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(width === 390 ? 1 : 3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
  }
});

test('CV teaching history preserves dates, roles and existing materials', async ({ browser }) => {
  for (const locale of ['en', 'it']) {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(locale === 'en' ? '/en/teaching/' : '/teaching/');
    const history = page.locator('#earlier-university-teaching');
    await expect(history.locator('.teaching-card')).toHaveCount(14);
    const secureApplications = history.locator('.teaching-card').filter({ hasText: 'Secure Applications, Identity and Trust' });
    await expect(secureApplications).toContainText('2015–2019');
    await expect(secureApplications).toContainText(locale === 'en' ? 'sole lecturer' : 'unico docente');
    const researchMethods = history.locator('.teaching-card').filter({ hasText: 'Research Methods' });
    await expect(researchMethods).toContainText('teaching assistant');
    await expect(history.locator('.teaching-card').filter({ hasText: 'Innovazione Digitale' }))
      .toContainText(locale === 'en' ? 'Started 2022' : 'Avvio nel 2022');
    await expect(page.locator('#phd-courses .teaching-card')).toHaveCount(6);
    await expect(page.locator('#phd-courses')).toContainText('Humans-in-the-loop');
    await expect(page.locator('#phd-courses')).toContainText('Human-Computer Interaction for AI');
    await expect(page.locator('#phd-courses')).toContainText('Introduction to UNIX/Linux');
    await expect(page.locator('#professional-postgraduate-teaching')).toContainText('2021–2022');
    await expect(page.locator('#professional-postgraduate-teaching')).toContainText('Intelligenza Artificiale, Mente, Impresa');
    await expect(page.locator('#tutorials .teaching-card a')).toHaveCount(8);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => document.fonts.ready);
      await history.locator('h2').scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      await page.screenshot({ path: `/private/tmp/portfolio-preview/past-teaching-${locale}-${width}.png` });
      await page.locator('#phd-courses h2').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `/private/tmp/portfolio-preview/doctoral-teaching-${locale}-${width}.png` });
    }
    await context.close();
  }
});

test('portfolio content remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of ['/', '/en/research-network/', '/it/rete-di-ricerca/', '/en/teaching/', '/teaching/', '/en/projects/', '/it/consulenza/']) {
    await page.goto(`http://127.0.0.1:4321${path}`);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('main a').count()).toBeGreaterThan(2);
  }
  await expect(page.locator('main')).toContainText('attività a pagamento');
  await context.close();
});

test('expanded projects retain roles, bilingual details and readable layouts', async ({ browser }) => {
  for (const width of [1440, 390]) {
    for (const locale of ['en', 'it']) {
      for (const theme of ['light', 'dark'] as const) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, javaScriptEnabled: false });
        const page = await context.newPage();
        await page.goto(locale === 'en' ? '/en/projects/' : '/progetti/');
        await expect(page.locator('.project-card')).toHaveCount(16);
        await expect(page.locator('main')).not.toContainText('MedRAD');
        await expect(page.locator('main')).not.toContainText('Sidneo');
        const projectImages = page.locator('.project-card img');
        await expect(projectImages).toHaveCount(16);
        const sources = await projectImages.evaluateAll(images => images.map(image => image.getAttribute('src')));
        expect(new Set(sources).size).toBe(16);
        for (const image of await projectImages.all()) {
          await image.scrollIntoViewIfNeeded();
          await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBeTruthy();
        }
        const posbi = page.locator('.project-card').filter({ has: page.getByRole('heading', { name: /POSBI/ }) });
        await expect(posbi).toContainText(locale === 'en' ? 'Project participant' : 'Partecipante al progetto');
        await expect(posbi).not.toContainText('Principal investigator');
        const aidecc = page.locator('.project-card').filter({ has: page.getByRole('heading', { name: /AIDECC/ }) });
        await expect(aidecc).toContainText('Principal investigator');
        expect(await page.locator('.project-grid').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(width === 390 ? 1 : 3);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({ path: `/private/tmp/portfolio-preview/projects-${locale}-${width}-${theme}.png`, fullPage: true });
        await posbi.getByRole('link', { name: /Approfondisci|Explore/ }).click();
        await expect(page.locator('main')).toContainText(locale === 'en' ? 'Project participant' : 'Partecipante al progetto');
        await expect(page.locator('link[rel="alternate"][hreflang="'+(locale === 'en' ? 'it' : 'en')+'"]')).toHaveAttribute('href', /posbi\//);
        await context.close();
      }
    }
  }
});

test('bilingual homepage contact card works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const [path, label] of [['/', 'Save contact (vCard)'], ['/it/', 'Salva contatto (vCard)']]) {
    await page.goto(path);
    const contacts = page.locator('.home-contact-links');
    await expect(contacts.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://www.linkedin.com/in/federicocerutti/');
    await expect(contacts.getByRole('link', { name: '+39 030 371 5453', exact: true })).toHaveAttribute('href', 'tel:+390303715453');
    const link = contacts.getByRole('link', { name: label, exact: true });
    await expect(link).toHaveAttribute('download', 'federico-cerutti.vcf');
    const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
    expect(download.suggestedFilename()).toBe('federico-cerutti.vcf');
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream!) chunks.push(chunk);
    const card = Buffer.concat(chunks).toString('utf8');
    expect(card).toContain('N:Cerutti;Federico;;Prof.;\r\n');
    expect(card).toContain('EMAIL;TYPE=INTERNET,WORK:federico.cerutti@unibs.it\r\n');
    expect(card).toContain('TEL;TYPE=WORK,VOICE:+390303715453\r\n');
    expect(card).toMatch(/^BEGIN:VCARD\r\nVERSION:3.0\r\n/);
    expect(card).toMatch(/END:VCARD\r\n$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await context.close();
});
