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
export const collaborations = research.organizations
  .filter((o) => !/intelpoint/i.test(o.name))
  .sort((a, b) => {
    const ai = featuredCollaborations.findIndex((x) => x.organizationId === a.id);
    const bi = featuredCollaborations.findIndex((x) => x.organizationId === b.id);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.name.localeCompare(b.name);
  });
export { organizationsById, worksById, peopleById };
