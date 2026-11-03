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
    label: "Fabbrica d'Armi Pietro Beretta",
    workIds: ['scopus:2-s2.0-105037632387'],
  },
];
// Owner curation, 3 November 2026: consolidate UK/US IBM sites and omit
// selected organisations/work from presentation while retaining source history.
export const excludedWorkIds = new Set(['scopus:2-s2.0-85061303311']);
const hiddenOrganizations = new Set([
  'org:texas-a-m-university-commerce',
  'org:university-of-texas-at-dallas',
  'org:fordham-university',
  'org:alpen-adria-universitaet-klagenfurt',
  'org:university-of-koblenz-landau-historical',
  'org:aneurin-bevan-continuous-improvement',
  'org:cardiff-university',
  'org:university-of-brescia',
  'org:university-of-southampton',
  'org:imperial-college-london',
  'org:university-of-southern-california',
  'org:ibm-research-uk-site-unspecified',
  'org:ibm-research-us-site-unspecified',
]);
const organisationAliases: Record<string, string> = {
  'org:university-of-koblenz': 'org:university-of-koblenz-landau-historical',
  'org:ibm-research-hursley-uk': 'org:ibm-research-uk-site-unspecified',
  'org:ibm-t-j-watson-research-center': 'org:ibm-research-us-site-unspecified',
};
export const collaborations = research.organizations
  .filter((o) => !/intelpoint/i.test(o.name) && !hiddenOrganizations.has(o.id))
  .map((o) => ({
    ...o,
    workIds: [
      ...new Set([
        ...o.workIds,
        ...(o.id === 'org:us-army-research-laboratory-devcom' ? ['scopus:2-s2.0-85045180992'] : []),
        ...(organizationsById.get(organisationAliases[o.id])?.workIds ?? []),
      ]),
    ].filter((id) => !excludedWorkIds.has(id)),
  }))
  .sort((a, b) => {
    const ai = featuredCollaborations.findIndex((x) => x.organizationId === a.id);
    const bi = featuredCollaborations.findIndex((x) => x.organizationId === b.id);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.name.localeCompare(b.name);
  });
// Count the curated presentation, consolidating IBM's two sites as one company.
const companyGroups: Record<string, string> = {
  'org:ibm-research-hursley-uk': 'ibm',
  'org:ibm-t-j-watson-research-center': 'ibm',
};
export const collaborationStatistics = {
  companies: new Set(collaborations.filter(o => o.sector === 'Industry').map(o => companyGroups[o.id] ?? o.id)).size,
  institutions: collaborations.filter(o => ['Government / defence', 'Public research', 'Public organisation'].includes(o.sector)).length,
  universities: collaborations.filter(o => o.sector === 'Academic').length,
};
export const currentCollaborationFocus: Record<string, { en: string; it: string }> = {
  'org:us-army-research-laboratory-devcom': {
    en: 'We combined learning and reasoning to recognise complex events and understand their causes, with uncertainty made explicit.',
    it: 'Abbiamo combinato apprendimento e ragionamento per riconoscere eventi complessi e comprenderne le cause, rendendo esplicita l’incertezza.',
  },
  'org:us-air-force-research-laboratory': {
    en: 'We investigated AI for interpreting sensor data: from Wi-Fi sensing to causal event detection under computational constraints.',
    it: 'Abbiamo studiato l’AI per interpretare dati sensoriali: dal sensing Wi-Fi al riconoscimento causale di eventi con risorse di calcolo limitate.',
  },
  'org:fabbrica-d-armi-pietro-beretta': {
    en: 'We explored human digital twins for sport and rehabilitation, connecting digital representations with movement and physical activity.',
    it: 'Abbiamo esplorato i digital twin umani per sport e riabilitazione, collegando rappresentazioni digitali, movimento e attività fisica.',
  },
};
export { organizationsById, worksById, peopleById };

// Organisation introductions use public descriptions; collaboration text is
// grounded in the approved publication titles, not claimed client outcomes.
const organisationCopy: Record<string, [string, string, string, string]> = {
  'org:us-army-research-laboratory-devcom': [
    'The US Army’s fundamental research laboratory.',
    'Il laboratorio di ricerca fondamentale dello US Army.',
    'Our joint research spanned reasoning under uncertainty, cyber threat analysis and complex event detection. Recent work combined learning and symbolic reasoning to recognise events and their causes from streams of data.',
    'La ricerca condivisa ha riguardato ragionamento sotto incertezza, analisi delle minacce cyber e rilevamento di eventi complessi. I lavori recenti hanno combinato apprendimento e ragionamento simbolico per riconoscere eventi e cause nei flussi di dati.',
  ],
  'org:us-air-force-research-laboratory': [
    'A US Air Force research laboratory working on aerospace and defence technologies.',
    'Laboratorio di ricerca della US Air Force per tecnologie aerospaziali e della difesa.',
    'The collaboration explored how learning and symbolic reasoning can interpret sensor data. Joint work included Wi-Fi sensing for passive radar and causal event processing with limited computing resources.',
    'La collaborazione ha esplorato come apprendimento e ragionamento simbolico possano interpretare dati da sensori. I lavori hanno incluso sensing Wi-Fi per radar passivi ed elaborazione causale di eventi con risorse di calcolo limitate.',
  ],
  'org:fabbrica-d-armi-pietro-beretta': [
    'An Italian manufacturer of firearms for sport, hunting and defence.',
    'Azienda italiana produttrice di armi per sport, caccia e difesa.',
    'Our shared work examined human digital twins in sport and rehabilitation. A systematic review brought together research on digital representations of people and their use in understanding movement and physical activity.',
    'Il lavoro condiviso ha esaminato i digital twin umani nello sport e nella riabilitazione. Una revisione sistematica ha raccolto la ricerca sulle rappresentazioni digitali delle persone e sul loro impiego per comprendere movimento e attività fisica.',
  ],
  'org:airbus-dais-joint-demonstration': [
    'A European aerospace company producing aircraft and space and defence systems.',
    'Gruppo aerospaziale europeo che produce aeromobili e sistemi spaziali e per la difesa.',
    'The connection included a joint demonstration in the DAIS programme in 2017. The linked technical contribution documented that shared activity.',
    'Il collegamento ha compreso una dimostrazione congiunta nel programma DAIS nel 2017. Il contributo tecnico collegato ha documentato questa attività condivisa.',
  ],
  'org:amazon-alexa-ai': [
    'Amazon’s AI research activity associated with its Alexa assistant.',
    'Attività di ricerca AI di Amazon legata all’assistente Alexa.',
    'Joint publications examined risk-aware classification and reasoning about uncertain probabilities. They included work on recognising stages of cyber attacks while accounting for uncertainty in the classification.',
    'Le pubblicazioni congiunte hanno esaminato classificazione consapevole del rischio e ragionamento su probabilità incerte. Hanno incluso il riconoscimento delle fasi di attacchi cyber tenendo conto dell’incertezza della classificazione.',
  ],
  'org:bae-systems-ai-labs': [
    'AI research within the aerospace, defence and security group BAE Systems.',
    'Ricerca AI nel gruppo aerospaziale, difesa e sicurezza BAE Systems.',
    'The shared publication surveyed methods for interpreting deep learning models. It examined research on making model behaviour and predictions more understandable.',
    'La pubblicazione condivisa ha passato in rassegna i metodi per interpretare modelli di deep learning. Ha esaminato la ricerca su come rendere più comprensibili comportamento e previsioni dei modelli.',
  ],
  'org:blue-prism-ai-labs': [
    'AI research associated with Blue Prism’s business-process automation software.',
    'Ricerca AI legata al software Blue Prism per l’automazione dei processi aziendali.',
    'Joint research distinguished uncertainty due to incomplete knowledge from variability in data. Publications studied probabilistic circuits, Bayesian networks and uncertainty-aware classifiers.',
    'La ricerca congiunta ha distinto l’incertezza dovuta a conoscenze incomplete dalla variabilità dei dati. Le pubblicazioni hanno studiato circuiti probabilistici, reti bayesiane e classificatori che rappresentano l’incertezza.',
  ],
  'org:honeywell': [
    'An industrial technology company active in automation and aerospace.',
    'Azienda di tecnologie industriali attiva nell’automazione e nell’aerospazio.',
    'Our shared work examined human–machine collaboration in intelligence analysis. It included an expert evaluation and research on supporting reasoning with different kinds of information.',
    'Il lavoro condiviso ha esaminato la collaborazione uomo–macchina nell’analisi di intelligence. Ha compreso una valutazione da parte di esperti e ricerca sul supporto al ragionamento con diversi tipi di informazioni.',
  ],
  'org:ibm-research-hursley-uk': [
    'An IBM technology and research site in Hursley, United Kingdom.',
    'Sede tecnologica e di ricerca IBM a Hursley, nel Regno Unito.',
    'Joint research connected interpretable AI, uncertainty and human judgement. Publications examined trust calibration, situational understanding and explanations for decisions, including social media moderation.',
    'La ricerca congiunta ha collegato AI interpretabile, incertezza e giudizio umano. Le pubblicazioni hanno esaminato calibrazione della fiducia, comprensione delle situazioni e spiegazioni delle decisioni, anche nella moderazione dei social media.',
  ],
  'org:ibm-t-j-watson-research-center': [
    'An IBM Research centre in the United States.',
    'Centro IBM Research negli Stati Uniti.',
    'The collaboration spanned interpretable AI, learning and reasoning in complex information environments. Shared publications addressed trust, situational understanding and the enforcement of privacy policies.',
    'La collaborazione ha riguardato AI interpretabile, apprendimento e ragionamento in ambienti informativi complessi. Le pubblicazioni condivise hanno affrontato fiducia, comprensione delle situazioni e applicazione di politiche di privacy.',
  ],
  'org:nec-laboratories-europe-verified-current': [
    'NEC’s European research organisation for information and communication technologies.',
    'Organizzazione europea di ricerca NEC nelle tecnologie dell’informazione e della comunicazione.',
    'The collaboration connected academic research interests with the laboratory’s industrial AI research community.',
    'La collaborazione ha messo in relazione interessi di ricerca accademici con la comunità di ricerca AI industriale del laboratorio.',
  ],
};

export function collaborationCopy(o: (typeof collaborations)[number], locale: 'en' | 'it') {
  const it = locale === 'it';
  const copy = organisationCopy[o.id];
  if (copy) return { identity: copy[it ? 1 : 0], description: copy[it ? 3 : 2] };
  const titles = o.workIds
    .map((id) => worksById.get(id)?.title ?? '')
    .join(' ')
    .toLowerCase();
  const countries: Record<string, string> = {
    Belgium: 'Belgio',
    Croatia: 'Croazia',
    France: 'Francia',
    Germany: 'Germania',
    Israel: 'Israele',
    Italy: 'Italia',
    Japan: 'Giappone',
    Luxembourg: 'Lussemburgo',
    Netherlands: 'Paesi Bassi',
    Norway: 'Norvegia',
    Turkey: 'Turchia',
    'United Kingdom': 'Regno Unito',
    'United States': 'Stati Uniti',
  };
  const country = it ? (countries[o.country] ?? o.country) : o.country;
  const identity =
    o.sector === 'Academic'
      ? it
        ? `Università con sede in ${country}.`
        : `A university based in ${country}.`
      : it
        ? `Organizzazione di ricerca in ${country}.`
        : `A research organisation in ${country}.`;
  const topics: [RegExp, string, string][] = [
    [
      /argument/,
      'computational argumentation and how to compare competing conclusions',
      'argomentazione computazionale e confronto tra conclusioni alternative',
    ],
    [
      /uncertain|bayesian|probabili/,
      'reasoning and learning when information is incomplete or uncertain',
      'ragionamento e apprendimento con informazioni incomplete o incerte',
    ],
    [
      /cyber|threat|attack|security/,
      'cybersecurity and the interpretation of information about threats',
      'cybersecurity e interpretazione delle informazioni sulle minacce',
    ],
    [
      /event|signal|sensor|fusion|radar/,
      'interpreting signals, sensor data and complex events',
      'interpretazione di segnali, dati da sensori ed eventi complessi',
    ],
    [
      /interpret|explain|trust/,
      'interpretable AI and how people assess its recommendations',
      'AI interpretabile e valutazione delle sue raccomandazioni da parte delle persone',
    ],
    [
      /communicat|language|reinforcement/,
      'communication and learning in artificial intelligence',
      'comunicazione e apprendimento nell’intelligenza artificiale',
    ],
  ];
  const selected = topics.filter(([pattern]) => pattern.test(titles)).slice(0, 2);
  const description = selected.length
    ? it
      ? `Il lavoro condiviso ha riguardato ${selected.map((t) => t[2]).join('; ')}. Le pubblicazioni collegate hanno approfondito questi temi attraverso modelli, metodi e valutazioni di ricerca.`
      : `Our shared work concerned ${selected.map((t) => t[1]).join('; ')}. The linked publications developed these topics through research models, methods and evaluations.`
    : it
      ? 'La collaborazione ha riguardato metodi di intelligenza artificiale e ragionamento. Le pubblicazioni collegate hanno descritto le domande affrontate e i risultati dei singoli studi.'
      : 'The collaboration concerned methods for artificial intelligence and reasoning. The linked publications described the questions investigated and the findings of individual studies.';
  return { identity, description };
}

export const collaborationPath = (id: string, locale: 'en' | 'it') =>
  `${locale === 'it' ? '/it/rete-di-ricerca/' : '/en/research-network/'}${id.replace(/^org:/, '')}/`;
export const organisationName = (name: string) =>
  name.replace(' (verified current)', '').replace(' (DAIS joint demonstration)', '');
