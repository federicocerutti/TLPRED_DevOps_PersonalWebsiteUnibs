"""Produce an explicit allowlist; never serialize raw imports to public assets."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
source = root / '.private/research-network'
full = json.loads((source / 'cerutti_collaboration_full.json').read_text())
web = json.loads((source / 'cerutti_collaboration_web.json').read_text())
def pick(obj, keys):
    return {key: obj[key] for key in keys.split() if key in obj}
people = []
for p in web['people']:
    q = pick(p, 'id name identitySource scopusProfileUrl workIds')
    q['observedAffiliations'] = [pick(a, 'institutionId workIds yearsObserved') for a in p['observedAffiliations']]
    people.append(q)
public = {
    'updatedAt': web['updatedAt'],
    'people': people,
    'daisOnlyParticipants': [pick(p, 'id name sourceUrl') for p in web['daisOnlyParticipants']],
    'organizations': [pick(o, 'id name sector country evidenceClass workIds collaboratorIds firstYear lastYear sourceUrl') for o in web['organizations']],
    'works': [pick(w, 'id title year venue doi url scopusEid bibtexKeys sourceSystems kind recordStatus coauthorIds observedInstitutionIds') for w in web['works']],
    'personEdges': [pick(e, 'sourceId targetId jointWorkIds') for e in web['personEdges']],
    'organizationEdges': [pick(e, 'sourceId targetId jointWorkIds') for e in web['organizationEdges']],
    'verifiedAffiliations': [pick(a, 'researcherName personId institutionName institutionId evidenceClass year sourceUrl') for a in web['verifiedAffiliations']],
    'daisReports': [pick(d, 'id title year type url authorNames reconciliationNote includedInIndexedPublicationCounts') for d in web['daisReports']],
    'reconciledVersions': [pick(v, 'preprintTitle publishedTitle bibtexKey canonicalWorkId') for v in full['reconciledVersions']],
    'observations': [pick(a, 'personId institutionId workId year sourceUrl') for a in full['affiliationEvidence']],
}
(root / 'data/research-network/public.json').write_text(json.dumps(public,ensure_ascii=False,separators=(',',':'))+'\n')
print('Generated allowlisted public projection:',len(public['works']),'works,',len(people),'people')
