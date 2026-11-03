import {
  research,
  readState,
  filterEntities,
  filteredWorks,
  evidenceFor,
  edgesFor,
  isOrganization,
  periodWorks,
  sourceUrl,
  scopusUrl,
  peopleById,
  organizationsById,
  worksById,
  type Entity,
  type NetworkState,
  type Work,
} from '../lib/research';
const root = document.querySelector<HTMLElement>('[data-network]');
if (root) {
  const it = root.dataset.locale === 'it';
  const t = (en: string, italian: string) => (it ? italian : en);
  const e = (s: unknown) =>
    String(s ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
    );
  const link = (url: string, label: string, action = 'research-outbound') =>
    `<a href="${e(url)}" data-analytics-event="${action}">${e(label)} ↗</a>`;
  const form = root.querySelector<HTMLFormElement>('form')!;
  const input = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  let state = readState(new URLSearchParams(location.search));
  let overview = false;
  const results = root.querySelector<HTMLElement>('[data-network-results]')!;
  const panel = root.querySelector<HTMLElement>('[data-network-panel]')!;
  const titleFor = (id: string) =>
    peopleById.get(id)?.name ??
    organizationsById.get(id)?.name ??
    research.daisOnlyParticipants.find((p) => p.id === id)?.name ??
    id;
  const entityButton = (id: string) =>
    `<button type="button" data-select="${e(id)}" data-next-view="${id.startsWith('org:') ? 'institutions' : 'people'}">${e(titleFor(id))}</button>`;
  const papers = (works: Work[]) =>
    `<ol class="publications">${works
      .slice()
      .sort((a, b) => b.year - a.year)
      .map(
        (w) =>
          `<li class="publication"><span class="meta">${w.year} · ${e(w.venue)}</span><h3>${link(sourceUrl(w), w.title, 'publication-link')}</h3><span class="badge">${w.recordStatus.startsWith('Scopus') ? 'Scopus' : 'DBLP'}</span>${scopusUrl(w) ? ` · ${link(scopusUrl(w), t('Affiliation source', 'Fonte affiliazione'))}` : ''}</li>`,
      )
      .join('')}</ol>`;
  const externalHTML = (id: string) =>
    evidenceFor(id, state)
      .map(
        (a) =>
          `<li>${e(a.researcherName)} — ${e(a.institutionName)}<br/><strong>${e(a.evidenceClass)}</strong> · ${a.year}<br/>${link(a.sourceUrl, t('Independent source', 'Fonte indipendente'))}</li>`,
      )
      .join('');
  function diagram(center: Entity, neighbors: { id: string; name: string; external?: boolean }[]) {
    const height = Math.max(160, neighbors.length * 48 + 20);
    const middle = height / 2;
    return `<svg class="network-diagram" viewBox="0 0 440 ${height}" role="img" aria-label="${e(t('Focused relationships; named sources below', 'Relazioni selezionate; fonti elencate sotto'))}"><title>${e(center.name)}</title><circle cx="28" cy="${middle}" r="10"/><text x="10" y="${middle - 20}" font-size="10">${e(t('Selection', 'Selezione'))}</text>${neighbors
      .map((n, i) => {
        const y = 30 + i * 48;
        return `<line class="${n.external ? 'external' : ''}" x1="38" y1="${middle}" x2="125" y2="${y}"/><a href="${n.id.startsWith('person:dais:') ? e(research.daisOnlyParticipants.find((p) => p.id === n.id)!.sourceUrl) : '?view=' + (n.id.startsWith('org:') ? 'institutions' : 'people') + '&amp;selected=' + encodeURIComponent(n.id)}" ${n.id.startsWith('person:dais:') ? '' : 'data-select="' + e(n.id) + '"'} data-next-view="${n.id.startsWith('org:') ? 'institutions' : 'people'}"><title>${e(n.name)}</title><circle cx="125" cy="${y}" r="5"/><text x="140" y="${y + 4}" font-size="11">${e(n.name.length > 41 ? n.name.slice(0, 39) + '…' : n.name)}</text></a>`;
      })
      .join('')}</svg>`;
  }
  function renderPanel(entity: Entity | undefined) {
    if (!entity) {
      panel.innerHTML = `<h2 tabindex="-1">${t('Choose a connection', 'Scegli una connessione')}</h2><p class="notice">${t('Select a name to inspect publications and evidence.', 'Seleziona un nome per esaminare pubblicazioni ed evidenze.')}</p>`;
      return;
    }
    const works = filteredWorks(entity, state);
    const ids = new Set(works.map((w) => w.id));
    const external = evidenceFor(entity.id, state);
    const years = works.map((w) => w.year).sort();
    const neighbors: { id: string; name: string; external?: boolean }[] = [];
    let details = '';
    if (isOrganization(entity)) {
      const observations = research.observations.filter(
        (a) => a.institutionId === entity.id && ids.has(a.workId),
      );
      const personIds = [...new Set(observations.map((a) => a.personId))];
      const extra = external.filter((a) => !personIds.includes(a.personId));
      neighbors.push(
        ...personIds.map((id) => ({ id, name: titleFor(id) })),
        ...extra.map((a) => ({ id: a.personId, name: a.researcherName, external: true })),
      );
      details = `<p class="notice">${e(entity.sector)} · ${e(entity.country)}</p><h3>${t('Publication-time affiliations', 'Affiliazioni al momento della pubblicazione')}</h3>${
        personIds.length
          ? `<ul>${personIds
              .map((id) => {
                const obs = observations.filter((a) => a.personId === id);
                return `<li>${entityButton(id)} · ${[...new Set(obs.map((a) => a.year))].sort().join(', ')}<br/>${link(obs[0].sourceUrl, t('Source record', 'Record fonte'))}</li>`;
              })
              .join('')}</ul>`
          : `<p>${t('No historical indexed affiliation in this period.', 'Nessuna affiliazione indicizzata storica nel periodo.')}</p>`
      }`;
    } else {
      const obs = entity.observedAffiliations.filter((a) => a.workIds.some((id) => ids.has(id)));
      details = `<p class="notice">${e(entity.identitySource)}</p>${entity.scopusProfileUrl ? link(entity.scopusProfileUrl, 'Scopus profile') : ''}<h3>${t('Historical affiliations on joint works', 'Affiliazioni storiche nelle opere comuni')}</h3>${
        obs.length
          ? `<ul>${obs
              .map(
                (a) =>
                  `<li>${entityButton(a.institutionId)} · ${periodWorks(a.workIds, state)
                    .filter((w) => ids.has(w.id))
                    .map((w) => w.year)
                    .filter((y, i, a) => a.indexOf(y) === i)
                    .sort()
                    .join(', ')}</li>`,
              )
              .join('')}</ul>`
          : `<p>${t('No resolved historical affiliation; none inferred.', 'Affiliazione storica non risolta; nessuna inferenza.')}</p>`
      }`;
      const related = research.personEdges
        .filter((edge) => edge.sourceId === entity.id || edge.targetId === entity.id)
        .filter((edge) => edge.jointWorkIds.some((id) => ids.has(id)))
        .sort(
          (a, b) =>
            b.jointWorkIds.filter((id) => ids.has(id)).length -
            a.jointWorkIds.filter((id) => ids.has(id)).length,
        );
      neighbors.push(
        ...related.slice(0, 8).map((edge) => {
          const id = edge.sourceId === entity.id ? edge.targetId : edge.sourceId;
          return { id, name: titleFor(id) };
        }),
      );
      details += `<h3>${t('Co-authors on these works with Federico', 'Coautori di queste opere con Federico')}</h3><ul>${related
        .map((edge) => {
          const id = edge.sourceId === entity.id ? edge.targetId : edge.sourceId;
          return `<li>${entityButton(id)}<details><summary>${edge.jointWorkIds.filter((id) => ids.has(id)).length} ${t('shared works', 'opere comuni')}</summary>${papers(edge.jointWorkIds.filter((id) => ids.has(id)).map((id) => worksById.get(id)!))}</details></li>`;
        })
        .join('')}</ul>`;
    }
    const connecting = isOrganization(entity)
      ? research.organizationEdges
          .filter((edge) => edge.sourceId === entity.id || edge.targetId === entity.id)
          .filter((edge) => edge.jointWorkIds.some((id) => ids.has(id)))
      : [];
    panel.innerHTML = `<h2 tabindex="-1">${e(entity.name)}</h2><p class="notice">${works.length} ${t('works in period', 'opere nel periodo')}${years.length ? ' · ' + years[0] + '–' + years.at(-1) : ''}</p>${diagram(entity, neighbors.slice(0, 8))}${neighbors.length > 8 ? `<p class="small muted">${t('Diagram shows eight connections; complete evidence below.', 'Il diagramma mostra otto connessioni; evidenze complete sotto.')}</p>` : ''}${details}${external.length ? `<h3>${t('Separate professional / external evidence', 'Evidenze professionali / esterne distinte')}</h3><ul>${externalHTML(entity.id)}</ul><p class="notice">${t('Evidence dates do not establish employment today or affiliation on earlier papers.', 'Le date delle fonti non attestano l’impiego odierno o l’affiliazione in pubblicazioni precedenti.')}</p>` : ''}${
      connecting.length
        ? `<h3>${t('Inter-institutional publication connections', 'Connessioni tra organizzazioni nelle pubblicazioni')}</h3><ul>${connecting
            .map((edge) => {
              const id = edge.sourceId === entity.id ? edge.targetId : edge.sourceId;
              return `<li>${entityButton(id)}<details><summary>${edge.jointWorkIds.filter((id) => ids.has(id)).length} ${t('source works', 'opere fonte')}</summary>${papers(edge.jointWorkIds.filter((id) => ids.has(id)).map((id) => worksById.get(id)!))}</details></li>`;
            })
            .join('')}</ul>`
        : ''
    }<h3>${t('Joint publications', 'Pubblicazioni comuni')}</h3>${works.length ? papers(works) : `<p>${t('No indexed joint works attributed to this organisation in the selected period. External evidence is not added to publication totals.', 'Nessuna opera indicizzata comune attribuita a questa organizzazione nel periodo. Le fonti esterne non aumentano i conteggi delle pubblicazioni.')}</p>`}`;
  }
  function renderOverview(entities: Entity[]) {
    const edges = edgesFor(state);
    const position = new Map(
      entities.map((n, i) => [
        n.id,
        {
          x: 360 + 300 * Math.cos((i / entities.length) * Math.PI * 2),
          y: 340 + 285 * Math.sin((i / entities.length) * Math.PI * 2),
        },
      ]),
    );
    root!.querySelector('[data-overview-svg]')!.innerHTML =
      `<svg class="network-diagram" viewBox="0 0 720 680" role="img" aria-label="${e(t('Full filtered network; equivalent connection table follows', 'Rete completa filtrata; segue tabella equivalente'))}"><title>${t('Filtered publication network', 'Rete delle pubblicazioni filtrata')}</title>${edges
        .map((edge) => {
          const a = position.get(edge.sourceId)!;
          const b = position.get(edge.targetId)!;
          return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
        })
        .join('')}${entities
        .map((n) => {
          const p = position.get(n.id)!;
          const works = filteredWorks(n, state);
          return `<a href="?view=${state.view}&amp;selected=${encodeURIComponent(n.id)}" data-select="${e(n.id)}" data-next-view="${state.view}"><title>${e(n.name)} · ${works.length}</title><circle cx="${p.x}" cy="${p.y}" r="${4 + Math.min(works.length, 25) / 5}" class="${!n.workIds.length ? 'external' : ''}"/>${n.id === state.selected ? `<text x="${p.x}" y="${p.y - 15}" text-anchor="middle" font-size="12">${e(n.name)}</text>` : ''}</a>`;
        })
        .join('')}</svg>`;
    root!.querySelector('[data-edge-table]')!.innerHTML =
      `<table><caption>${t('Every line with its supporting publications', 'Ogni linea con le pubblicazioni fonte')} (${edges.length})</caption><thead><tr><th>${t('From', 'Da')}</th><th>${t('To', 'A')}</th><th>${t('Evidence', 'Evidenze')}</th></tr></thead><tbody>${edges.map((edge) => `<tr><td>${entityButton(edge.sourceId)}</td><td>${entityButton(edge.targetId)}</td><td><details><summary>${edge.jointWorkIds.length} ${t('works', 'opere')}</summary>${papers(edge.jointWorkIds.map((id) => worksById.get(id)!))}</details></td></tr>`).join('')}</tbody></table>`;
  }
  function render() {
    const entities = filterEntities(state);
    root!.dataset.hasSelection = String(entities.some((n) => n.id === state.selected));
    for (const name of ['q', 'sector', 'country', 'from', 'to'] as const)
      input(name).value = state[name];
    root!
      .querySelectorAll<HTMLButtonElement>('[data-view]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
    const count = ['q', 'sector', 'country', 'from', 'to'].filter(
      (k) => state[k as keyof NetworkState],
    ).length;
    root!.querySelector('[data-network-count]')!.textContent =
      `${entities.length} ${state.view === 'people' ? t('people', 'persone') : t('organisations', 'organizzazioni')} · ${count} ${t('active filters', 'filtri attivi')}`;
    results.innerHTML = entities
      .map(
        (n) =>
          `<tr class="${n.id === state.selected ? 'selected-row' : ''}"><th scope="row">${entityButton(n.id)}</th><td>${isOrganization(n) ? e(n.sector) + '<br/>' + e(n.country) : e(n.identitySource)}</td><td>${filteredWorks(n, state).length}${!n.workIds.length ? `<br/><span class="badge">${t('External evidence', 'Evidenza esterna')}</span>` : ''}</td></tr>`,
      )
      .join('');
    root!.querySelector<HTMLElement>('[data-network-empty]')!.hidden = entities.length > 0;
    renderPanel(entities.find((n) => n.id === state.selected));
    root!.querySelector<HTMLElement>('[data-overview]')!.hidden = !overview;
    root!.querySelector('[data-overview-toggle]')!.setAttribute('aria-expanded', String(overview));
    if (overview) renderOverview(entities);
  }
  function write() {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(state))
      if (v && (k !== 'view' || v !== 'institutions')) p.set(k, v);
    history.pushState(null, '', location.pathname + (p.size ? '?' + p : ''));
    render();
  }
  let timer: ReturnType<typeof setTimeout>;
  form.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const name of ['q', 'sector', 'country', 'from', 'to'] as const)
        state[name] = input(name).value;
      write();
      document.dispatchEvent(new CustomEvent('research:interaction', { detail: 'network-filter' }));
    }, 160);
  });
  form.addEventListener('reset', () => {
    clearTimeout(timer);
    state = readState(new URLSearchParams());
    write();
  });
  root.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const selected = target?.closest<HTMLElement>('[data-select]');
    if (selected) {
      event.preventDefault();
      if (selected.dataset.select!.startsWith('person:dais:')) return;
      state.selected = selected.dataset.select!;
      state.view = selected.dataset.nextView === 'people' ? 'people' : 'institutions';
      if (!filterEntities(state).some((n) => n.id === state.selected)) {
        state.q = '';
        if (!filterEntities(state).some((n) => n.id === state.selected)) {
          state.sector = '';
          state.country = '';
        }
      }
      write();
      panel.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
      if (matchMedia('(max-width:1100px)').matches) panel.scrollIntoView({ block: 'start' });
    }
    const view = target?.closest<HTMLElement>('[data-view]');
    if (view) {
      state.view = view.dataset.view === 'people' ? 'people' : 'institutions';
      state.selected = '';
      write();
    }
    if (target?.closest('[data-industry]')) {
      state = { ...readState(new URLSearchParams()), sector: 'Industry' };
      write();
    }
    if (target?.closest('[data-overview-toggle]')) {
      overview = !overview;
      render();
    }
  });
  window.addEventListener('popstate', () => {
    clearTimeout(timer);
    state = readState(new URLSearchParams(location.search));
    render();
  });
  render();
  root.querySelector<HTMLElement>('[data-network-live]')!.hidden = false;
  root.querySelector<HTMLElement>('[data-network-fallback]')!.hidden = true;
}
