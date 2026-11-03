import data from '../../data/research-network/public.json' with { type: 'json' };
import publicationLinks from '../../data/research-network/publication-links.json' with { type: 'json' };
export const research = data;
export type Work = (typeof data.works)[number];
export type Person = (typeof data.people)[number];
export type Organization = (typeof data.organizations)[number];
export type Entity = Person | Organization;
export type View = 'institutions' | 'people';
export type NetworkState = {
  view: View;
  q: string;
  sector: string;
  country: string;
  from: string;
  to: string;
  selected: string;
};
export const peopleById = new Map(data.people.map((p) => [p.id, p]));
export const organizationsById = new Map(data.organizations.map((o) => [o.id, o]));
export const worksById = new Map(data.works.map((w) => [w.id, w]));
export const years = [...new Set(data.works.map((w) => w.year))].sort((a, b) => b - a);
export const normalize = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
const curatedLinks: Record<string, { url: string; reference: string }> = publicationLinks;
const isScopus = (url: string) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === 'scopus.com' || host.endsWith('.scopus.com');
  } catch {
    return true;
  }
};
// Keep imported records unchanged; presentation never falls back to Scopus.
export const sourceUrl = (w: Work) => {
  if (w.doi) return `https://doi.org/${w.doi}`;
  const curated = curatedLinks[w.id]?.url;
  if (curated && !isScopus(curated)) return curated;
  return w.url && !isScopus(w.url) ? w.url : '';
};
export const scopusUrl = (w: Work) =>
  w.scopusEid ? `https://www.scopus.com/record/display.uri?eid=${w.scopusEid}` : '';
export const dblpUrls = (w: Work) =>
  w.bibtexKeys.map((k) => `https://dblp.org/rec/${k.replace(/^DBLP:/, '')}`);
export const workNames = (w: Work) => w.coauthorIds.map((id) => peopleById.get(id)?.name ?? id);
export const isOrganization = (e: Entity): e is Organization => 'sector' in e;
export const periodWorks = (ids: string[], state: Pick<NetworkState, 'from' | 'to'>) =>
  ids
    .map((id) => worksById.get(id)!)
    .filter(
      (w) => w && (!state.from || w.year >= +state.from) && (!state.to || w.year <= +state.to),
    );
export function readState(params: URLSearchParams): NetworkState {
  const year = (key: string) => (/^\d{4}$/.test(params.get(key) ?? '') ? params.get(key)! : '');
  return {
    view: params.get('view') === 'people' ? 'people' : 'institutions',
    q: params.get('q') ?? '',
    sector: params.get('sector') ?? '',
    country: params.get('country') ?? '',
    from: year('from'),
    to: year('to'),
    selected: params.get('selected') ?? '',
  };
}
export function evidenceFor(id: string, state: Pick<NetworkState, 'from' | 'to'>) {
  return data.verifiedAffiliations.filter(
    (a) =>
      (a.institutionId === id || a.personId === id) &&
      (!state.from || a.year >= +state.from) &&
      (!state.to || a.year <= +state.to),
  );
}
export function filteredWorks(entity: Entity, state: NetworkState): Work[] {
  return periodWorks(entity.workIds, state).filter((w) => {
    if (isOrganization(entity)) return true;
    if (!state.sector && !state.country) return true;
    return entity.observedAffiliations.some(
      (a) => a.workIds.includes(w.id) && orgMatches(organizationsById.get(a.institutionId), state),
    );
  });
}
function orgMatches(o: Organization | undefined, s: NetworkState) {
  return Boolean(
    o && (!s.sector || o.sector === s.sector) && (!s.country || o.country === s.country),
  );
}
export function filterEntities(state: NetworkState): Entity[] {
  if (state.from && state.to && +state.from > +state.to) return [];
  const entities: Entity[] = state.view === 'people' ? data.people : data.organizations;
  return entities
    .filter((e) => {
      const works = filteredWorks(e, state);
      const external = evidenceFor(e.id, state).filter((a) =>
        orgMatches(organizationsById.get(a.institutionId), state),
      );
      if (isOrganization(e) && !orgMatches(e, state)) return false;
      if (
        (state.from || state.to || (!isOrganization(e) && (state.country || state.sector))) &&
        !works.length &&
        !external.length
      )
        return false;
      const names = isOrganization(e)
        ? e.collaboratorIds.map((id) => peopleById.get(id)?.name ?? '').join(' ')
        : e.observedAffiliations
            .map((a) => organizationsById.get(a.institutionId)?.name ?? '')
            .join(' ');
      const text = `${e.name} ${names} ${data.verifiedAffiliations
        .filter((a) => a.personId === e.id || a.institutionId === e.id)
        .map((a) => a.institutionName + ' ' + a.researcherName)
        .join(' ')}`;
      return !state.q || normalize(text).includes(normalize(state.q));
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
export function edgesFor(state: NetworkState) {
  const allowed = new Set(filterEntities(state).map((e) => e.id));
  return (state.view === 'people' ? data.personEdges : data.organizationEdges).flatMap((e) => {
    if (!allowed.has(e.sourceId) || !allowed.has(e.targetId)) return [];
    const entities = state.view === 'people' ? peopleById : organizationsById;
    const a = new Set(filteredWorks(entities.get(e.sourceId)!, state).map((w) => w.id));
    const b = new Set(filteredWorks(entities.get(e.targetId)!, state).map((w) => w.id));
    const jointWorkIds = periodWorks(e.jointWorkIds, state)
      .filter((w) => a.has(w.id) && b.has(w.id))
      .map((w) => w.id);
    return jointWorkIds.length ? [{ ...e, jointWorkIds }] : [];
  });
}
export function publicationFilter(q: string, year: string, status: string) {
  return data.works.filter(
    (w) =>
      (!year || String(w.year) === year) &&
      (!status || w.recordStatus.startsWith(status)) &&
      (!q || normalize(`${w.title} ${w.venue} ${workNames(w).join(' ')}`).includes(normalize(q))),
  );
}
