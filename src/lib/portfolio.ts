import { research, organizationsById, worksById, peopleById } from './research';
export const featuredCollaborations = [
  {
    organizationId: 'org:us-army-research-laboratory-devcom',
    label: 'ARL',
    workIds: ['scopus:2-s2.0-105052372080', 'scopus:2-s2.0-105015801646'],
  },
  {
    organizationId: 'org:us-air-force-research-laboratory',
    label: 'AFRL',
    workIds: ['scopus:2-s2.0-105015801646', 'scopus:2-s2.0-85207697009'],
  },
  {
    organizationId: 'org:fabbrica-d-armi-pietro-beretta',
    label: 'Beretta',
    workIds: ['scopus:2-s2.0-105037632387'],
  },
];
// Owner curation, 3 November 2026: consolidate UK/US IBM sites and omit
// selected organisations/work from presentation while retaining source history.
export const excludedWorkIds = new Set(['scopus:2-s2.0-85061303311']);
const hiddenOrganizations = new Set([
  'org:aneurin-bevan-continuous-improvement',
  'org:cardiff-university',
  'org:university-of-brescia',
  'org:university-of-southampton',
  'org:imperial-college-london',
  'org:ibm-research-uk-site-unspecified',
  'org:ibm-research-us-site-unspecified',
]);
const ibmAliases: Record<string, string> = {
  'org:ibm-research-hursley-uk': 'org:ibm-research-uk-site-unspecified',
  'org:ibm-t-j-watson-research-center': 'org:ibm-research-us-site-unspecified',
};
export const collaborations = research.organizations
  .filter((o) => !/intelpoint/i.test(o.name) && !hiddenOrganizations.has(o.id))
  .map((o) => ({
    ...o,
    workIds: [
      ...new Set([...o.workIds, ...(organizationsById.get(ibmAliases[o.id])?.workIds ?? [])]),
    ].filter((id) => !excludedWorkIds.has(id)),
  }))
  .sort((a, b) => {
    const ai = featuredCollaborations.findIndex((x) => x.organizationId === a.id);
    const bi = featuredCollaborations.findIndex((x) => x.organizationId === b.id);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.name.localeCompare(b.name);
  });
export { organizationsById, worksById, peopleById };
