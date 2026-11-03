import test from 'node:test';
import assert from 'node:assert/strict';
import {
  research as d,
  readState,
  filterEntities,
  filteredWorks,
  edgesFor,
  organizationsById,
  worksById,
  peopleById,
  publicationFilter,
} from '../src/lib/research.ts';
import { cleanUrl, publicTrackerUrl, allowedEvents } from '../src/lib/analytics.ts';
const state = (query = '') => readState(new URLSearchParams(query));
test('public snapshot has stable distinct records and valid references', () => {
  assert.equal(d.works.length, 162);
  assert.equal(d.people.length, 177);
  assert.equal(d.organizations.length, 66);
  assert.equal(d.daisReports.length, 11);
  for (const list of [d.works, d.people, d.organizations])
    assert.equal(new Set(list.map((x) => x.id)).size, list.length);
  for (const w of d.works) {
    for (const id of w.coauthorIds) assert.ok(peopleById.has(id));
    for (const id of w.observedInstitutionIds) assert.ok(organizationsById.has(id));
  }
  for (const p of d.people) {
    for (const id of p.workIds) assert.ok(worksById.has(id));
    for (const a of p.observedAffiliations) {
      assert.ok(organizationsById.has(a.institutionId));
      for (const id of a.workIds) assert.ok(p.workIds.includes(id));
    }
  }
  for (const a of d.verifiedAffiliations) {
    assert.ok(organizationsById.has(a.institutionId));
    assert.ok(
      peopleById.has(a.personId) || d.daisOnlyParticipants.some((p) => p.id === a.personId),
    );
  }
});
test('every co-author edge has two distinct authors on every source work', () => {
  assert.equal(d.personEdges.length, 720);
  for (const edge of d.personEdges) {
    assert.notEqual(edge.sourceId, edge.targetId);
    for (const id of edge.jointWorkIds) {
      const w = worksById.get(id)!;
      assert.ok(w.coauthorIds.includes(edge.sourceId));
      assert.ok(w.coauthorIds.includes(edge.targetId));
    }
  }
});
test('institutional edges require different people with evidenced historical affiliations', () => {
  assert.equal(d.organizationEdges.length, 190);
  for (const edge of d.organizationEdges) {
    assert.notEqual(edge.sourceId, edge.targetId);
    for (const id of edge.jointWorkIds) {
      assert.ok(id.startsWith('scopus:'));
      const source = d.observations.filter(
        (o) => o.workId === id && o.institutionId === edge.sourceId,
      );
      const target = d.observations.filter(
        (o) => o.workId === id && o.institutionId === edge.targetId,
      );
      assert.ok(
        source.some((a) => target.some((b) => a.personId !== b.personId)),
        `${edge.sourceId} ${edge.targetId} ${id}`,
      );
    }
  }
});
test('historical dates derive from the supporting works, not current employer evidence', () => {
  for (const a of d.observations) {
    assert.equal(a.year, worksById.get(a.workId)?.year);
    assert.ok(
      peopleById
        .get(a.personId)
        ?.observedAffiliations.some(
          (o) => o.institutionId === a.institutionId && o.workIds.includes(a.workId),
        ),
    );
  }
  const nec = organizationsById.get('org:nec-laboratories-europe-verified-current')!;
  assert.equal(nec.workIds.length, 0);
  assert.equal(d.observations.filter((a) => a.institutionId === nec.id).length, 0);
  const nodari = d.people.find((p) => p.name === 'Lorenzo Nodari')!;
  assert.ok(nodari.workIds.length);
  assert.ok(
    filterEntities(state('view=people&sector=Industry&from=2026')).some((p) => p.id === nodari.id),
  );
  assert.equal(filteredWorks(nodari, state('sector=Industry')).length, 0);
});
test('IBM sites, defence organisations, Beretta and Airbus retain their evidence classes', () => {
  for (const [id, count] of [
    ['org:ibm-t-j-watson-research-center', 8],
    ['org:ibm-research-hursley-uk', 4],
    ['org:ibm-research-uk-site-unspecified', 4],
    ['org:ibm-research-us-site-unspecified', 2],
  ] as const)
    assert.equal(organizationsById.get(id)?.workIds.length, count);
  for (const o of d.organizations.filter((o) =>
    /nato-cmre|defence-science|air-force|army-research/.test(o.id),
  ))
    assert.equal(o.sector, 'Government / defence');
  const b = organizationsById.get('org:fabbrica-d-armi-pietro-beretta')!;
  assert.equal(b.workIds.length, 1);
  assert.ok(
    d.verifiedAffiliations.some(
      (a) => a.institutionId === b.id && a.researcherName === 'Stefano Morzenti',
    ),
  );
  const airbus = organizationsById.get('org:airbus-dais-joint-demonstration')!;
  assert.equal(airbus.workIds.length, 0);
  assert.equal(d.verifiedAffiliations.filter((a) => a.institutionId === airbus.id).length, 2);
});
test('DAIS and reconciled versions cannot inflate indexed work counts', () => {
  assert.equal(d.works.filter((w) => w.recordStatus === 'Scopus-indexed').length, 143);
  assert.equal(d.reconciledVersions.length, 7);
  for (const report of d.daisReports) {
    assert.equal(report.includedInIndexedPublicationCounts, false);
    assert.ok(!worksById.has(report.id));
  }
  for (const v of d.reconciledVersions) {
    assert.ok(worksById.has(v.canonicalWorkId));
    assert.ok(!d.works.some((w) => w.id === 'dblp:' + v.bibtexKey));
  }
});
test('filters are inclusive and preserve unknowns without guessing', () => {
  assert.equal(filterEntities(state()).length, 66);
  assert.equal(filterEntities(state('view=people')).length, 177);
  assert.equal(filterEntities(state('from=2026&to=2025')).length, 0);
  for (const entity of filterEntities(state('from=2020&to=2020')))
    for (const w of filteredWorks(entity, state('from=2020&to=2020'))) assert.equal(w.year, 2020);
  for (const edge of edgesFor(state('from=2020&to=2020')))
    for (const id of edge.jointWorkIds) assert.equal(worksById.get(id)!.year, 2020);
  assert.equal(filterEntities(state('q=Hursley')).length, 1);
  assert.ok(publicationFilter('extortion', '2026', 'Scopus').length >= 1);
});
test('public fields exclude raw exports and internal review commentary', () => {
  const json = JSON.stringify(d);
  for (const forbidden of [
    'rawAffiliation',
    'reviewFlags',
    'reviewFlagCount',
    'jointScopusWorksCountClaimedInWorkbook',
    'relatedWork',
    'sourceFile',
  ])
    assert.ok(!json.includes('"' + forbidden + '"'));
  for (const w of d.works) assert.ok(['https:', 'http:'].includes(new URL(w.url).protocol));
});
test('analytics URLs and event vocabulary reject private configuration and personal inputs', () => {
  assert.equal(publicTrackerUrl('http://analytics.example/'), '');
  assert.equal(publicTrackerUrl('https://127.0.0.1/'), '');
  assert.equal(publicTrackerUrl('https://name:secret@example.org/'), '');
  assert.equal(
    publicTrackerUrl('https://analytics.example/matomo/'),
    'https://analytics.example/matomo/',
  );
  assert.equal(cleanUrl('https://example.org/path?email=private#name'), 'https://example.org/path');
  assert.equal(cleanUrl('mailto:private@example.org'), '');
  assert.ok(!allowedEvents.has('search text'));
  assert.ok(allowedEvents.has('advisory-contact'));
});

test('deployment deletion protects both directory and symlink Matomo mounts', async () => {
  const { mkdtemp, mkdir, writeFile, readFile, symlink, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const base = await mkdtemp(join(tmpdir(), 'cerutti-deploy-'));
  try {
    for (const mount of ['directory', 'symlink']) {
      const src = join(base, mount, 'src');
      const dest = join(base, mount, 'dest');
      const app = mount === 'directory' ? join(dest, 'matomo') : join(base, mount, 'private-app');
      await mkdir(src, { recursive: true });
      await mkdir(dest, { recursive: true });
      await mkdir(app, { recursive: true });
      await writeFile(join(app, 'keep.txt'), 'protected');
      await writeFile(join(dest, 'obsolete.txt'), 'remove');
      await writeFile(join(src, 'index.html'), 'new build');
      if (mount === 'symlink') await symlink(app, join(dest, 'matomo'));
      execFileSync('rsync', [
        '-a',
        '--delete',
        '--exclude=/matomo',
        '--filter=P /matomo',
        '--filter=P /matomo/***',
        src + '/',
        dest + '/',
      ]);
      assert.equal(await readFile(join(dest, 'matomo', 'keep.txt'), 'utf8'), 'protected');
      assert.equal(await readFile(join(dest, 'index.html'), 'utf8'), 'new build');
      await assert.rejects(readFile(join(dest, 'obsolete.txt')));
    }
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
