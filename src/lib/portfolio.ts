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
  companies: new Set(
    collaborations.filter((o) => o.sector === 'Industry').map((o) => companyGroups[o.id] ?? o.id),
  ).size,
  institutions: collaborations.filter((o) =>
    ['Government / defence', 'Public research', 'Public organisation'].includes(o.sector),
  ).length,
  universities: collaborations.filter((o) => o.sector === 'Academic').length,
};
export const currentCollaborationFocus: Record<string, { en: string; it: string }> = {
  'org:us-army-research-laboratory-devcom': {
    en: 'To interpret streams of data, we combined learning and reasoning to recognise complex events and their causes, making uncertainty explicit.',
    it: 'Per interpretare flussi di dati, abbiamo combinato apprendimento e ragionamento per riconoscere eventi complessi e cause, esplicitando l’incertezza.',
  },
  'org:us-air-force-research-laboratory': {
    en: 'We studied how AI can interpret sensor data with limited computing resources, through research on Wi-Fi sensing and causal event detection.',
    it: 'Abbiamo studiato come l’AI possa interpretare dati da sensori con risorse di calcolo limitate, attraverso ricerche sul sensing Wi-Fi e sul riconoscimento causale di eventi.',
  },
  'org:fabbrica-d-armi-pietro-beretta': {
    en: 'We reviewed research on human digital twins: digital representations of people used to study movement and physical activity in sport and rehabilitation.',
    it: 'Abbiamo esaminato la ricerca sui digital twin umani: rappresentazioni digitali delle persone per studiare movimento e attività fisica nello sport e nella riabilitazione.',
  },
};
export { organizationsById, worksById, peopleById };

// Organisation introductions use public descriptions; collaboration text is
// grounded in the approved publication titles, not claimed client outcomes.
const organisationIdentities: Record<string, [string, string]> = {
  'org:us-army-research-laboratory-devcom': [
    'The US Army’s fundamental research laboratory.',
    'Il laboratorio di ricerca fondamentale dello US Army.',
  ],
  'org:us-air-force-research-laboratory': [
    'A US Air Force research laboratory.',
    'Laboratorio di ricerca della US Air Force.',
  ],
  'org:fabbrica-d-armi-pietro-beretta': [
    'An Italian manufacturer of firearms.',
    'Azienda italiana produttrice di armi.',
  ],
  'org:airbus-dais-joint-demonstration': [
    'A European aerospace company producing aircraft and space and defence systems.',
    'Gruppo aerospaziale europeo che produce aeromobili e sistemi spaziali e per la difesa.',
  ],
  'org:amazon-alexa-ai': [
    'Amazon’s AI research activity associated with its Alexa assistant.',
    'Attività di ricerca AI di Amazon legata all’assistente Alexa.',
  ],
  'org:bae-systems-ai-labs': [
    'AI research within the aerospace, defence and security group BAE Systems.',
    'Ricerca AI nel gruppo aerospaziale, difesa e sicurezza BAE Systems.',
  ],
  'org:blue-prism-ai-labs': [
    'AI research associated with Blue Prism’s business-process automation software.',
    'Ricerca AI legata al software Blue Prism per l’automazione dei processi aziendali.',
  ],
  'org:honeywell': [
    'An industrial technology company active in automation and aerospace.',
    'Azienda di tecnologie industriali attiva nell’automazione e nell’aerospazio.',
  ],
  'org:ibm-research-hursley-uk': [
    'An IBM technology and research site in Hursley, United Kingdom.',
    'Sede tecnologica e di ricerca IBM a Hursley, nel Regno Unito.',
  ],
  'org:ibm-t-j-watson-research-center': [
    'An IBM Research centre in the United States.',
    'Centro IBM Research negli Stati Uniti.',
  ],
  'org:nec-laboratories-europe-verified-current': [
    'NEC’s European research organisation for information and communication technologies.',
    'Organizzazione europea di ricerca NEC nelle tecnologie dell’informazione e della comunicazione.',
  ],
};

// Individual summaries follow each organisation’s linked publications or recorded activity.
const collaborationDescriptions: Record<string, { en: string; it: string }> = {
  'org:us-army-research-laboratory-devcom': {
    en: 'We studied how AI can make sense of changing, uncertain information. The work combined learning and reasoning to recognise events in sensor data, examine cyber threats and help people judge how much confidence to place in an answer.',
    it: 'Abbiamo studiato come l’AI possa interpretare informazioni che cambiano e restano incerte. Il lavoro ha combinato apprendimento e ragionamento per riconoscere eventi nei dati dei sensori, esaminare minacce cyber e aiutare le persone a valutare quanto fidarsi di una risposta.',
  },
  'org:us-air-force-research-laboratory': {
    en: 'We studied how to interpret sensor data when computing resources are limited. The work combined AI methods to recognise events and explored how Wi-Fi signals can be used for passive radar.',
    it: 'Abbiamo studiato come interpretare i dati dei sensori quando le risorse di calcolo sono limitate. Il lavoro ha combinato metodi di AI per riconoscere eventi ed esplorato l’uso dei segnali Wi-Fi per radar passivi.',
  },
  'org:fabbrica-d-armi-pietro-beretta': {
    en: 'We reviewed how digital representations of people can help researchers study movement and physical activity. The review brought together research on human digital twins in sport and rehabilitation.',
    it: 'Abbiamo esaminato come le rappresentazioni digitali delle persone possano aiutare a studiare movimento e attività fisica. La revisione ha raccolto la ricerca sui digital twin umani nello sport e nella riabilitazione.',
  },
  'org:airbus-dais-joint-demonstration': {
    en: 'We took part in a joint demonstration with Airbus in the DAIS programme in 2017. The linked technical report records the work presented together.',
    it: 'Abbiamo partecipato a una dimostrazione congiunta con Airbus nel programma DAIS nel 2017. Il rapporto tecnico collegato documenta il lavoro presentato insieme.',
  },
  'org:amazon-alexa-ai': {
    en: 'We studied how AI can account for uncertainty when assigning a case to a category, including identifying stages of a cyber attack. Other work examined how to reason about probabilities when the evidence itself is uncertain.',
    it: 'Abbiamo studiato come l’AI possa tenere conto dell’incertezza quando assegna un caso a una categoria, anche per identificare le fasi di un attacco cyber. Altri lavori hanno esaminato come ragionare sulle probabilità quando le evidenze stesse sono incerte.',
  },
  'org:bae-systems-ai-labs': {
    en: 'We reviewed methods for understanding why deep learning systems produce particular predictions. The survey brought together research on explaining model behaviour, rather than treating an AI answer as a result that cannot be examined.',
    it: 'Abbiamo esaminato i metodi per capire perché i sistemi di deep learning producono determinate previsioni. La rassegna ha raccolto la ricerca su come spiegare il comportamento dei modelli e rendere esaminabili le risposte dell’AI.',
  },
  'org:blue-prism-ai-labs': {
    en: 'We studied how AI can distinguish gaps in its knowledge from variation in the data. The work examined ways to learn from incomplete information and represent uncertainty in predictions.',
    it: 'Abbiamo studiato come l’AI possa distinguere le lacune nelle proprie conoscenze dalla variabilità dei dati. Il lavoro ha esaminato modi per apprendere da informazioni incomplete e rappresentare l’incertezza delle previsioni.',
  },
  'org:honeywell': {
    en: 'We studied how people and software can work together to analyse intelligence information. The work examined how to reason with different kinds of evidence and included an evaluation by experts.',
    it: 'Abbiamo studiato come persone e software possano collaborare nell’analisi di intelligence. Il lavoro ha esaminato come ragionare su diversi tipi di evidenze e ha incluso una valutazione da parte di esperti.',
  },
  'org:ibm-research-hursley-uk': {
    en: 'We studied how people can understand AI recommendations and judge when to trust them. The work connected explanations and uncertainty with making sense of complex situations, and also examined privacy rules and social media moderation.',
    it: 'Abbiamo studiato come le persone possano comprendere le raccomandazioni dell’AI e valutare quando fidarsene. Il lavoro ha collegato spiegazioni e incertezza alla comprensione di situazioni complesse, esaminando anche regole di privacy e moderazione dei social media.',
  },
  'org:ibm-t-j-watson-research-center': {
    en: 'We studied how people and AI can reason with complex information and judge the reliability of an answer. Shared work also examined the risks of sharing information, ways to limit the spread of sensitive data and the application of privacy rules.',
    it: 'Abbiamo studiato come persone e AI possano ragionare su informazioni complesse e valutare l’affidabilità di una risposta. I lavori condivisi hanno esaminato anche i rischi della condivisione di informazioni, come limitare la diffusione di dati sensibili e come applicare regole di privacy.',
  },
  'org:nec-laboratories-europe-verified-current': {
    en: 'This research connection links academic interests in AI with NEC’s European industrial research community.',
    it: 'Questo rapporto di ricerca mette in contatto interessi accademici nell’AI con la comunità di ricerca industriale europea di NEC.',
  },
  'org:bar-ilan-university': {
    en: 'We explored how software can help people follow an online debate by representing the arguments and how they support or challenge one another. The work took the form of a pilot study.',
    it: 'Abbiamo esplorato come il software possa aiutare a seguire un dibattito online, rappresentando gli argomenti e i rapporti di sostegno o contrasto tra loro. Il lavoro ha assunto la forma di uno studio pilota.',
  },
  'org:bi-norwegian-business-school': {
    en: 'We studied how to draw conclusions from a network of related information when the probabilities are themselves uncertain. The work developed a method for carrying that uncertainty through the calculation.',
    it: 'Abbiamo studiato come trarre conclusioni da una rete di informazioni collegate quando le probabilità stesse sono incerte. Il lavoro ha sviluppato un metodo per tenere conto di questa incertezza nel calcolo.',
  },
  'org:carnegie-mellon-university': {
    en: 'We studied how to assess the risks of sharing information and how trust can inform that assessment. Other work examined how to reason with structured knowledge when some of it is uncertain.',
    it: 'Abbiamo studiato come valutare i rischi della condivisione di informazioni e come usare la fiducia in questa valutazione. Altri lavori hanno esaminato come ragionare su conoscenze strutturate quando alcune sono incerte.',
  },
  'org:cnrs': {
    en: 'We helped compare software that reasons about arguments supporting or challenging one another. The shared report describes the first international competition assessing these systems on common problems.',
    it: 'Abbiamo contribuito al confronto tra software che ragionano su argomenti che si sostengono o si contrastano. Il rapporto condiviso descrive la prima competizione internazionale che ha valutato questi sistemi su problemi comuni.',
  },
  'org:delft-university-of-technology': {
    en: 'We studied how to protect privacy against systems that use Wi-Fi signals to sense people or activity. The work analysed, implemented and evaluated a method that changes how wireless signals are transmitted.',
    it: 'Abbiamo studiato come proteggere la privacy dai sistemi che usano segnali Wi-Fi per rilevare persone o attività. Il lavoro ha analizzato, realizzato e valutato un metodo che modifica il modo in cui vengono trasmessi i segnali wireless.',
  },
  'org:heidelberg-university': {
    en: 'We explored how to make online debates easier to follow by representing which arguments support or challenge others. A pilot study examined the use of this approach in online discussion.',
    it: 'Abbiamo esplorato come rendere più comprensibili i dibattiti online, rappresentando quali argomenti sostengono o contrastano gli altri. Uno studio pilota ha esaminato l’uso di questo approccio nelle discussioni online.',
  },
  'org:holon-institute-of-technology': {
    en: 'We examined how reasoning about causes relates to reasoning through arguments. The shared work explored the connection between explaining why something happens and assessing reasons for a conclusion.',
    it: 'Abbiamo esaminato il rapporto tra il ragionamento sulle cause e quello basato sugli argomenti. Il lavoro condiviso ha esplorato il legame tra spiegare perché accade qualcosa e valutare le ragioni a sostegno di una conclusione.',
  },
  'org:hong-kong-university-of-science-and-technology': {
    en: 'We studied how AI can recognise complex events as data arrives from connected sensors and devices. The work explored models that combine learning with reasoning, including ways to train them using generated examples.',
    it: 'Abbiamo studiato come l’AI possa riconoscere eventi complessi mentre arrivano dati da sensori e dispositivi connessi. Il lavoro ha esplorato modelli che combinano apprendimento e ragionamento, anche usando esempi generati per addestrarli.',
  },
  'org:inria': {
    en: 'We studied how a system of arguments changes its conclusions when it receives different inputs. The work developed formal models for describing what goes into the reasoning process and what comes out.',
    it: 'Abbiamo studiato come un sistema di argomenti cambi le proprie conclusioni quando riceve informazioni diverse. Il lavoro ha sviluppato modelli formali per descrivere gli ingressi e le uscite del processo di ragionamento.',
  },
  'org:king-s-college-london': {
    en: 'We worked on a special journal issue about how software agents can exchange and assess arguments. This editorial collaboration brought together research on reasoning through disagreement in systems with multiple agents.',
    it: 'Abbiamo lavorato a un numero speciale di una rivista su come gli agenti software possano scambiarsi e valutare argomenti. Questa collaborazione editoriale ha raccolto ricerche sul ragionamento in presenza di disaccordo nei sistemi con più agenti.',
  },
  'org:ku-leuven': {
    en: 'We studied how AI can recognise events when data may be manipulated, and how it can distinguish missing knowledge from variation in the data. Shared work also examined how software agents negotiate with limited resources at the edge of a network.',
    it: 'Abbiamo studiato come l’AI possa riconoscere eventi quando i dati possono essere manipolati e distinguere le lacune di conoscenza dalla variabilità dei dati. Altri lavori condivisi hanno esaminato come gli agenti software negoziano con risorse limitate ai margini di una rete.',
  },
  'org:leipzig-university': {
    en: 'We helped develop common tests for software that evaluates competing arguments. The work included a framework for comparing systems and a report on the first international competition in this area.',
    it: 'Abbiamo contribuito a sviluppare prove comuni per i software che valutano argomenti in contrasto. Il lavoro ha incluso un quadro per confrontare i sistemi e un rapporto sulla prima competizione internazionale in questo ambito.',
  },
  'org:maastricht-university': {
    en: 'We examined how explanations based on causes connect with arguments for or against a conclusion. The shared work explored how these two forms of reasoning relate to one another.',
    it: 'Abbiamo esaminato come le spiegazioni basate sulle cause si colleghino agli argomenti a favore o contro una conclusione. Il lavoro condiviso ha esplorato il rapporto tra queste due forme di ragionamento.',
  },
  'org:massachusetts-institute-of-technology': {
    en: 'We worked on a shared way to represent arguments so software can describe and exchange them consistently. The collaboration also included a special journal issue on argument-based reasoning among software agents.',
    it: 'Abbiamo lavorato a un modo condiviso di rappresentare gli argomenti, così che i software possano descriverli e scambiarli in modo coerente. La collaborazione ha incluso anche un numero speciale di una rivista sul ragionamento basato su argomenti tra agenti software.',
  },
  'org:mimar-sinan-fine-arts-university': {
    en: 'We studied how knowledge held by local communities finds its way into plans for managing World Heritage sites. The work developed a method drawing on several disciplines to examine that transfer of knowledge.',
    it: 'Abbiamo studiato come le conoscenze delle comunità locali entrino nei piani di gestione dei siti del patrimonio mondiale. Il lavoro ha sviluppato un metodo che attinge a più discipline per esaminare questo trasferimento di conoscenze.',
  },
  'org:nato-cmre': {
    en: 'We studied how to make AI interpretation of passive radar data easier to understand. The work examined a learning method for interpreting these signals, with a focus on making the model’s behaviour more explainable.',
    it: 'Abbiamo studiato come rendere più comprensibile l’interpretazione dei dati di radar passivi da parte dell’AI. Il lavoro ha esaminato un metodo di apprendimento per interpretare questi segnali, concentrandosi sulla spiegabilità del comportamento del modello.',
  },
  'org:ohio-state-university': {
    en: 'We studied a way to make it harder to infer private information from Wi-Fi signals. The work analysed and tested changes to wireless transmission intended to counter unwanted sensing.',
    it: 'Abbiamo studiato un modo per rendere più difficile ricavare informazioni private dai segnali Wi-Fi. Il lavoro ha analizzato e sperimentato modifiche alla trasmissione wireless per contrastare il rilevamento indesiderato.',
  },
  'org:ozyegin-university': {
    en: 'We studied how AI can represent uncertainty and help people interpret complex situations. The work covered learning from uncertain data, explaining predictions and reasoning with people, as well as applying privacy rules.',
    it: 'Abbiamo studiato come l’AI possa rappresentare l’incertezza e aiutare le persone a interpretare situazioni complesse. Il lavoro ha riguardato apprendimento da dati incerti, spiegazione delle previsioni e ragionamento con le persone, oltre all’applicazione di regole di privacy.',
  },
  'org:politecnico-di-milano': {
    en: 'We studied how AI can interpret sensor data, recognise events with limited computing resources and represent uncertainty when data is missing. Shared work also addressed Wi-Fi privacy, tropical cyclone formation and how to model urban planning around people’s needs.',
    it: 'Abbiamo studiato come l’AI possa interpretare dati da sensori, riconoscere eventi con risorse di calcolo limitate e rappresentare l’incertezza quando mancano dati. Altri lavori condivisi hanno riguardato privacy del Wi-Fi, formazione dei cicloni tropicali e modelli di pianificazione urbana centrati sulle persone.',
  },
  'org:politecnico-di-torino': {
    en: 'We studied how attackers can exploit similar-sounding names across languages to deceive people online, and how AI can generate or help detect deceptive names. Shared work also examined resilience against persistent cyber attacks.',
    it: 'Abbiamo studiato come gli attaccanti possano sfruttare nomi dal suono simile in lingue diverse per ingannare le persone online e come l’AI possa generarli o aiutare a rilevarli. Altri lavori condivisi hanno esaminato la resilienza agli attacchi cyber persistenti.',
  },
  'org:sapienza-university-of-rome': {
    en: 'We studied how AI can learn models for planning actions from visual data and connect what it sees with the concepts used in a plan. Shared work also examined recognising events and their causes with limited computing resources.',
    it: 'Abbiamo studiato come l’AI possa apprendere modelli per pianificare azioni a partire da dati visivi e collegare ciò che vede ai concetti usati nel piano. Altri lavori condivisi hanno esaminato il riconoscimento di eventi e cause con risorse di calcolo limitate.',
  },
  'org:swansea-university': {
    en: 'We examined how to make legal reasoning explicit by representing evidence and arguments about a conclusion. The shared studies analysed reasoning in the Karadžić trial judgment, including the question of intent.',
    it: 'Abbiamo esaminato come rendere esplicito il ragionamento giuridico rappresentando evidenze e argomenti su una conclusione. Gli studi condivisi hanno analizzato il ragionamento nella sentenza del processo Karadžić, anche rispetto alla questione dell’intento.',
  },
  'org:the-alan-turing-institute': {
    en: 'We studied how AI agents can develop ways to communicate about space and time that people can interpret. Other work examined how to guide an agent’s learning by combining rewards that reflect different values.',
    it: 'Abbiamo studiato come gli agenti AI possano sviluppare modi di comunicare su spazio e tempo comprensibili alle persone. Altri lavori hanno esaminato come orientarne l’apprendimento combinando ricompense che riflettono valori diversi.',
  },
  'org:tu-darmstadt': {
    en: 'We studied how to protect people from unwanted sensing through Wi-Fi signals. The work analysed, implemented and evaluated a method that varies wireless transmission to make such sensing more difficult.',
    it: 'Abbiamo studiato come proteggere le persone dal rilevamento indesiderato attraverso segnali Wi-Fi. Il lavoro ha analizzato, realizzato e valutato un metodo che varia la trasmissione wireless per rendere più difficile questo rilevamento.',
  },
  'org:uk-defence-science-and-technology-laboratory': {
    en: 'We studied how people can judge when to trust AI by seeing explanations and uncertainty alongside its answers. Shared work also examined how to support scientific enquiry when sources are uncertain.',
    it: 'Abbiamo studiato come le persone possano valutare quando fidarsi dell’AI vedendo spiegazioni e incertezza insieme alle risposte. Altri lavori condivisi hanno esaminato come sostenere l’indagine scientifica quando le fonti sono incerte.',
  },
  'org:university-college-london': {
    en: 'We studied how to account for risk and uncertainty when AI assigns a case to a category. The collaboration also reviewed methods for understanding and explaining the predictions of deep learning models.',
    it: 'Abbiamo studiato come tenere conto di rischio e incertezza quando l’AI assegna un caso a una categoria. La collaborazione ha anche esaminato i metodi per comprendere e spiegare le previsioni dei modelli di deep learning.',
  },
  'org:university-of-aberdeen': {
    en: 'We studied how people and software can assess evidence, trust and the risks of sharing information. Shared work also examined software agents negotiating contracts and methods for comparing systems that reason about competing arguments.',
    it: 'Abbiamo studiato come persone e software possano valutare evidenze, fiducia e rischi della condivisione di informazioni. Altri lavori condivisi hanno esaminato agenti software che negoziano contratti e metodi per confrontare sistemi che ragionano su argomenti in contrasto.',
  },
  'org:university-of-california-los-angeles-ucla': {
    en: 'We studied how AI can turn streams of sensor data into an understanding of events. The collaboration combined learning and reasoning, examined how to explain results and uncertainty, and included expert evaluation of people working with software in intelligence analysis.',
    it: 'Abbiamo studiato come l’AI possa trasformare flussi di dati da sensori in una comprensione degli eventi. La collaborazione ha combinato apprendimento e ragionamento, esaminato come spiegare risultati e incertezza e incluso una valutazione esperta della collaborazione tra persone e software nell’analisi di intelligence.',
  },
  'org:university-of-dundee': {
    en: 'We worked on a common format for describing arguments and the relationships between them. The aim was to let software represent and exchange argument structures using shared concepts.',
    it: 'Abbiamo lavorato a un formato comune per descrivere gli argomenti e i rapporti tra loro. L’obiettivo era permettere ai software di rappresentare e scambiare strutture argomentative usando concetti condivisi.',
  },
  'org:university-of-hagen': {
    en: 'We studied algorithms for deciding which arguments can be accepted when arguments challenge one another. The work addressed how software can calculate defensible conclusions from these relationships.',
    it: 'Abbiamo studiato algoritmi per stabilire quali argomenti possano essere accettati quando si contrastano tra loro. Il lavoro ha esaminato come il software possa calcolare conclusioni sostenibili a partire da queste relazioni.',
  },
  'org:university-of-huddersfield': {
    en: 'We developed and compared algorithms that determine which conclusions can be defended when arguments conflict. The work included software tools, common test problems and ways to choose or combine algorithms for difficult cases.',
    it: 'Abbiamo sviluppato e confrontato algoritmi che stabiliscono quali conclusioni siano sostenibili quando gli argomenti sono in conflitto. Il lavoro ha incluso strumenti software, problemi di prova comuni e modi per scegliere o combinare algoritmi nei casi difficili.',
  },
  'org:university-of-koblenz': {
    en: 'We helped assess software that reasons about competing arguments through a common international competition. The shared report describes the systems and results of that comparison.',
    it: 'Abbiamo contribuito alla valutazione di software che ragionano su argomenti in contrasto attraverso una competizione internazionale comune. Il rapporto condiviso descrive i sistemi e i risultati del confronto.',
  },
  'org:university-of-liverpool': {
    en: 'We studied how software can reason about arguments that support or challenge conclusions, including structures that can continue indefinitely. The collaboration also included editorial work on argument-based reasoning among software agents.',
    it: 'Abbiamo studiato come il software possa ragionare su argomenti che sostengono o contrastano conclusioni, anche in strutture che possono proseguire all’infinito. La collaborazione ha incluso anche attività editoriali sul ragionamento basato su argomenti tra agenti software.',
  },
  'org:university-of-luxembourg': {
    en: 'We studied how new information affects the conclusions produced by a system of arguments. The work developed formal descriptions of the relationship between the system’s inputs and outputs.',
    it: 'Abbiamo studiato come nuove informazioni influenzino le conclusioni prodotte da un sistema di argomenti. Il lavoro ha sviluppato descrizioni formali del rapporto tra gli ingressi e le uscite del sistema.',
  },
  'org:university-of-michigan': {
    en: 'We studied how AI can learn from incomplete data and reason when probabilities are uncertain. The work developed methods to keep track of that uncertainty as information is combined.',
    it: 'Abbiamo studiato come l’AI possa apprendere da dati incompleti e ragionare quando le probabilità sono incerte. Il lavoro ha sviluppato metodi per tenere traccia di questa incertezza mentre si combinano le informazioni.',
  },
  'org:university-of-oslo': {
    en: 'We studied how people can remain involved when AI combines uncertain information to understand a situation. The work used networks of related information that represent both beliefs and uncertainty.',
    it: 'Abbiamo studiato come mantenere il coinvolgimento delle persone quando l’AI combina informazioni incerte per comprendere una situazione. Il lavoro ha usato reti di informazioni collegate che rappresentano sia le convinzioni sia l’incertezza.',
  },
  'org:university-of-st-andrews': {
    en: 'We studied tools that help analysts connect facts, examine arguments and prepare reports. The work included CISpaces, a system for highlighting weaknesses in a case, and an expert evaluation of collaboration between people and software.',
    it: 'Abbiamo studiato strumenti che aiutano gli analisti a collegare fatti, esaminare argomenti e preparare rapporti. Il lavoro ha incluso CISpaces, un sistema per evidenziare i punti deboli di una ricostruzione, e una valutazione esperta della collaborazione tra persone e software.',
  },
  'org:university-of-tokyo': {
    en: 'We studied how a dialogue can help participants work towards reconciliation. The work developed formal models for changing the direction of deliberation when searching for a way to resolve disagreement.',
    it: 'Abbiamo studiato come il dialogo possa aiutare i partecipanti a cercare una riconciliazione. Il lavoro ha sviluppato modelli formali per cambiare la direzione della deliberazione nella ricerca di un modo per superare il disaccordo.',
  },
  'org:university-of-turin': {
    en: 'We studied how to extract structured knowledge from cybersecurity logs using language models, and how attackers exploit similar-sounding names across languages. Other shared work examined cyber resilience and how systems of arguments respond to new information.',
    it: 'Abbiamo studiato come estrarre conoscenze strutturate dai log di cybersecurity usando modelli linguistici e come gli attaccanti sfruttino nomi dal suono simile in lingue diverse. Altri lavori condivisi hanno esaminato la resilienza cyber e come i sistemi di argomenti rispondano a nuove informazioni.',
  },
  'org:university-of-utrecht': {
    en: 'We worked on shared concepts for representing arguments in software. The resulting format describes arguments and their relationships in a way that different systems can use consistently.',
    it: 'Abbiamo lavorato a concetti condivisi per rappresentare gli argomenti nel software. Il formato risultante descrive gli argomenti e i rapporti tra loro in un modo utilizzabile coerentemente da sistemi diversi.',
  },
  'org:university-of-zagreb': {
    en: 'We explored how software can represent the structure of an online debate so people can see which arguments support or challenge others. A pilot study examined this approach in online discussion.',
    it: 'Abbiamo esplorato come il software possa rappresentare la struttura di un dibattito online, così che le persone vedano quali argomenti sostengono o contrastano gli altri. Uno studio pilota ha esaminato questo approccio nelle discussioni online.',
  },
};

export function collaborationCopy(o: (typeof collaborations)[number], locale: 'en' | 'it') {
  const it = locale === 'it';
  const customIdentity = organisationIdentities[o.id];
  const description = collaborationDescriptions[o.id];
  if (!description) throw new Error(`Missing collaboration description: ${o.id}`);
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
  return {
    identity: customIdentity ? customIdentity[it ? 1 : 0] : identity,
    description: description[locale],
  };
}

export const collaborationPath = (id: string, locale: 'en' | 'it') =>
  `${locale === 'it' ? '/it/rete-di-ricerca/' : '/en/research-network/'}${id.replace(/^org:/, '')}/`;
export const organisationName = (name: string) =>
  name.replace(' (verified current)', '').replace(' (DAIS joint demonstration)', '');
