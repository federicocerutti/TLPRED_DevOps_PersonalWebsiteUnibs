import type { Locale } from './site';

type Seo = { title: string; description: string };
export type ImageAttribution = {
  assetPath: string;
  sourceUrl: string;
  sourceLabel: string;
};

type BaseEntry = {
  translationKey: string;
  locale: Locale;
  pathSlug: string;
  title: string;
  summary: string;
  image?: string;
  imageAttribution?: ImageAttribution;
  seo: Seo;
  featured?: boolean;
  body: string;
};

type ResearchItem = BaseEntry & {
  itemType: 'paper' | 'technical-report';
  typeLabel: string;
  publishedAt: string;
  authors: string[];
  tags: string[];
  officialUrl: string;
};

type Project = BaseEntry & {
  startDate: string;
  endDate?: string;
  status: string;
  funder: string;
  tags: string[];
  people: string[];
};

type TeachingPage = BaseEntry & {
  itemType: 'tutorial' | 'phd-course';
  typeLabel: string;
  dateLabel: string;
  people: string[];
  location: string;
  tags: string[];
  sourceUrl: string;
};

type TeachingItem = {
  title: string;
  summary: string;
  when?: string;
  href?: string;
};

type TeachingSection = {
  translationKey: string;
  title: string;
  intro: string;
  items: TeachingItem[];
};

type Profile = {
  locale: Locale;
  seo: Seo;
  heroTitle: string;
  heroSummary: string;
  strapline: string;
  roles: string[];
  focusAreas: { title: string; summary: string }[];
  service: string[];
  portrait: string;
  portraitAlt: string;
  socialLinks: { label: string; href: string }[];
  stats: string[];
  aboutHtml: string;
  highlights: { title: string; summary: string; href: string }[];
};

type ContactSection = {
  locale: Locale;
  seo: Seo;
  title: string;
  intro: string;
  items: { label: string; value: string; href?: string }[];
};

type EntryMap = {
  papers: ResearchItem;
  projects: Project;
  teachingPages: TeachingPage;
};

const prose = (...paragraphs: string[]) => paragraphs.map((item) => `<p>${item}</p>`).join('');

const profileByLocale: Record<Locale, Profile> = {
  it: {
    locale: 'it',
    seo: {
      title: 'Prof. Federico Cerutti | AI, cybersecurity e ragionamento con incertezza',
      description: 'Sito personale bilingue di Federico Cerutti: profilo, pubblicazioni selezionate, progetti di ricerca e didattica.',
    },
    heroTitle: 'AI affidabile per cybersecurity, intelligence e decisioni sotto incertezza.',
    heroSummary:
      'Professore Ordinario all’Università degli Studi di Brescia. Lavoro su intelligenza artificiale, ragionamento causale, argumentation e cyber threat intelligence.',
    strapline: 'Profilo accademico e scientifico',
    roles: [
      'Professore Ordinario, Università degli Studi di Brescia',
      'Chair del nodo bresciano del CINI National Cybersecurity Lab',
      'Honorary Senior Lecturer, Cardiff University',
      'Visiting Fellow, University of Southampton',
    ],
    focusAreas: [
      {
        title: 'Trustworthy AI',
        summary: 'Metodi che combinano interpretabilità, uncertainty quantification e strutture argomentative per sostenere decisioni verificabili.',
      },
      {
        title: 'Cyber Threat Intelligence',
        summary: 'Strumenti per leggere evidenze eterogenee, costruire spiegazioni causali e supportare analisti in scenari ad alta complessità.',
      },
      {
        title: 'Neuro-symbolic reasoning',
        summary: 'Integrazione di modelli che apprendono dai dati con rappresentazioni esplicite di regole, cause e vincoli.',
      },
    ],
    service: [
      'Inaugural Director of the Data Science Academy at Cardiff University until 2019',
      'Recipient of the Rita Levi-Montalcini programme for attracting Italian researchers abroad',
      'Member of the Expert Evaluation Group for the 2015-2019 VQR exercise',
    ],
    portrait: '/images/people/federico-cerutti.png',
    portraitAlt: 'Ritratto di Federico Cerutti',
    socialLinks: [
      { label: 'Email', href: 'mailto:federico.cerutti@unibs.it' },
      { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=v0mFZhoAAAAJ&hl=en' },
      { label: 'DBLP', href: 'https://dblp.org/pid/97/18.html' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/federicocerutti/' },
      { label: 'Scopus', href: 'https://www.scopus.com/authid/detail.uri?authorId=34867748700' },
    ],
    stats: ['100+ peer-reviewed papers', '2 co-edited books', 'AI safety and cyber intelligence'],
    aboutHtml: prose(
      'Federico Cerutti è Professore Ordinario presso il Dipartimento di Ingegneria dell’Informazione dell’Università degli Studi di Brescia. Guida il nodo di Brescia del CINI National Cybersecurity Lab e mantiene collaborazioni internazionali con Cardiff University e University of Southampton.',
      'La sua ricerca si concentra sulla sicurezza dell’intelligenza artificiale, in particolare su come apprendere e ragionare quando i dati sono incerti, rumorosi o incompleti. Il filo conduttore è costruire sistemi che non si limitino a produrre una risposta, ma che aiutino anche a capire quanto sia affidabile e su quali evidenze si basi.',
      'Negli ultimi anni il suo lavoro ha toccato cyber threat intelligence, complex event processing neuro-simbolico, sound-squatting, human-AI teaming e causal reasoning per sistemi cyber-fisici.'
    ),
    highlights: [
      { title: 'Ricerca selezionata', summary: 'Pubblicazioni recenti su AI affidabile, argomentazione, uncertainty quantification e cyber intelligence.', href: '/ricerca/' },
      { title: 'Progetti', summary: 'Una selezione di progetti recenti, in corso o conclusi, con focus su cybersecurity e decision support.', href: '/progetti/' },
      { title: 'Didattica', summary: 'Insegnamenti correnti, tutorial di ricerca, corsi di dottorato e proposte di tesi magistrale.', href: '/teaching/' },
    ],
  },
  en: {
    locale: 'en',
    seo: {
      title: 'Prof. Federico Cerutti | AI, cybersecurity, and reasoning under uncertainty',
      description: 'Bilingual personal site of Federico Cerutti: profile, selected publications, research projects, and teaching.',
    },
    heroTitle: 'Trustworthy AI for cybersecurity, intelligence, and decisions under uncertainty.',
    heroSummary:
      'Full Professor at the University of Brescia. I work on artificial intelligence, causal reasoning, argumentation, and cyber threat intelligence.',
    strapline: 'Academic and research profile',
    roles: [
      'Full Professor, University of Brescia',
      'Chair of the Brescia branch of the CINI National Cybersecurity Lab',
      'Honorary Senior Lecturer, Cardiff University',
      'Visiting Fellow, University of Southampton',
    ],
    focusAreas: [
      {
        title: 'Trustworthy AI',
        summary: 'Methods that combine interpretability, uncertainty quantification, and argumentative structures to support inspectable decisions.',
      },
      {
        title: 'Cyber Threat Intelligence',
        summary: 'Tools for reading heterogeneous evidence, building causal explanations, and supporting analysts in high-complexity settings.',
      },
      {
        title: 'Neuro-symbolic reasoning',
        summary: 'Integration of data-driven models with explicit representations of rules, causes, and constraints.',
      },
    ],
    service: [
      'Inaugural Director of the Data Science Academy at Cardiff University until 2019',
      'Recipient of the Rita Levi-Montalcini programme for attracting Italian researchers abroad',
      'Member of the Expert Evaluation Group for the 2015-2019 VQR exercise',
    ],
    portrait: '/images/people/federico-cerutti.png',
    portraitAlt: 'Portrait of Federico Cerutti',
    socialLinks: [
      { label: 'Email', href: 'mailto:federico.cerutti@unibs.it' },
      { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=v0mFZhoAAAAJ&hl=en' },
      { label: 'DBLP', href: 'https://dblp.org/pid/97/18.html' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/federicocerutti/' },
      { label: 'Scopus', href: 'https://www.scopus.com/authid/detail.uri?authorId=34867748700' },
    ],
    stats: ['100+ peer-reviewed papers', '2 co-edited books', 'AI safety and cyber intelligence'],
    aboutHtml: prose(
      'Federico Cerutti is Full Professor at the Department of Information Engineering of the University of Brescia. He leads the Brescia branch of the CINI National Cybersecurity Lab and keeps active international links with Cardiff University and the University of Southampton.',
      'His research focuses on the security of artificial intelligence, especially on how to learn and reason when data is uncertain, noisy, or incomplete. The common thread is building systems that do not merely output a recommendation, but also help users understand how reliable it is and which evidence supports it.',
      'In recent years his work has covered cyber threat intelligence, neuro-symbolic complex event processing, sound-squatting, human-AI teaming, and causal reasoning for cyber-physical systems.'
    ),
    highlights: [
      { title: 'Selected research', summary: 'Recent publications on trustworthy AI, argumentation, uncertainty quantification, and cyber intelligence.', href: '/en/research/' },
      { title: 'Projects', summary: 'A selection of recent and ongoing projects focused on cybersecurity and decision support.', href: '/en/projects/' },
      { title: 'Teaching', summary: 'Current teaching, research tutorials, PhD courses, and MSc thesis topics.', href: '/en/teaching/' },
    ],
  },
};

const papers: Record<Locale, ResearchItem[]> = {
  it: [
    {
      translationKey: 'rapid-trust-calibration',
      locale: 'it',
      pathSlug: 'rapid-trust-calibration-ai-interpretabile',
      title: 'Rapid Trust Calibration through Interpretable and Uncertainty-Aware AI',
      summary: 'Come costruire sistemi di AI che aiutino a decidere senza nascondere i propri limiti operativi.',
      image: '/images/research/ai-brain-collage.jpg',
      seo: { title: 'Rapid Trust Calibration | Ricerca', description: 'Paper su interpretabilità, incertezza e fiducia operativa nei sistemi di AI.' },
      featured: true,
      itemType: 'paper',
      typeLabel: 'Articolo accademico',
      publishedAt: '2020-07-10',
      authors: ['Richard Tomsett', 'Alun Preece', 'Dave Braines', 'Federico Cerutti', 'Supriyo Chakraborty', 'Mani B. Srivastava', 'Gavin Pearson', 'Lance M. Kaplan'],
      tags: ['Explainable AI', 'Uncertainty', 'Decision support', 'Cybersecurity'],
      officialUrl: 'https://doi.org/10.1016/j.patter.2020.100049',
      body: prose(
        'Il paper parte da un problema pratico: in scenari ad alto rischio non basta che un sistema di AI fornisca una previsione, serve capire anche quanto quella previsione sia affidabile.',
        'Gli autori propongono il concetto di rapid trust calibration: dare agli operatori elementi sufficienti per decidere rapidamente se fidarsi, quanto fidarsi e dove il sistema sta mostrando incertezza.'
      ),
    },
    {
      translationKey: 'uncertainty-aware-deep-classifiers',
      locale: 'it',
      pathSlug: 'classificatori-deep-uncertainty-aware',
      title: 'Uncertainty-Aware Deep Classifiers Using Generative Models',
      summary: 'Classificatori deep capaci di distinguere meglio tra casi noti, casi ambigui e input fuori distribuzione.',
      image: '/images/research/neural-network-dark.png',
      seo: { title: 'Uncertainty-Aware Deep Classifiers | Ricerca', description: 'Paper su classificazione profonda, incertezza e robustezza contro input anomali.' },
      itemType: 'paper',
      typeLabel: 'Articolo accademico',
      publishedAt: '2020-04-03',
      authors: ['Murat Sensoy', 'Lance M. Kaplan', 'Federico Cerutti', 'Maryam Saleki'],
      tags: ['Machine learning', 'Out-of-distribution', 'Uncertainty', 'Adversarial robustness'],
      officialUrl: 'https://doi.org/10.1609/aaai.v34i04.6015',
      body: prose(
        'Il lavoro affronta un problema tipico dei modelli deep: fornire risposte molto sicure anche quando l’input non assomiglia davvero ai dati visti in addestramento.',
        'Combinando classificazione e modelli generativi, il paper propone un modo per distinguere meglio casi noti, casi dubbi e input fuori distribuzione.'
      ),
    },
    {
      translationKey: 'supporting-trustworthy-ai-bayesian-argumentation',
      locale: 'it',
      pathSlug: 'supporting-trustworthy-ai-bayesian-argumentation',
      title: 'Supporting Trustworthy Artificial Intelligence via Bayesian Argumentation',
      summary: 'Un ponte tra argomentazione computazionale e AI affidabile per spiegare meglio decisioni e assunzioni.',
      image: '/images/research/neural-network-dark.png',
      seo: { title: 'Supporting Trustworthy AI | Ricerca', description: 'Paper su AI affidabile e argomentazione bayesiana.' },
      itemType: 'paper',
      typeLabel: 'Articolo accademico',
      publishedAt: '2021-11-29',
      authors: ['Federico Cerutti'],
      tags: ['Argumentation', 'Bayesian reasoning', 'Trustworthy AI'],
      officialUrl: 'https://dblp.org/rec/conf/aiia/Cerutti21',
      body: prose(
        'Il contributo mostra come l’argomentazione bayesiana possa aiutare a strutturare spiegazioni più leggibili e verificabili per sistemi di AI.',
        'Il punto non è solo difendere una conclusione, ma rendere esplicite anche le assunzioni e la qualità delle evidenze che sostengono una decisione.'
      ),
    },
    {
      translationKey: 'human-machine-collaboration-intelligence-analysis',
      locale: 'it',
      pathSlug: 'human-machine-collaboration-intelligence-analysis',
      title: 'Human-machine collaboration in intelligence analysis: An expert evaluation',
      summary: 'Valutazione esperta di come strumenti intelligenti e analisti umani possano collaborare nell’intelligence analysis.',
      image: '/images/research/audio-waveform.jpg',
      seo: { title: 'Human-machine Collaboration | Ricerca', description: 'Paper su collaborazione uomo-macchina nell intelligence analysis.' },
      itemType: 'paper',
      typeLabel: 'Articolo accademico',
      publishedAt: '2022-12-20',
      authors: ['Alice Toniolo', 'Federico Cerutti', 'Timothy J. Norman', 'Nir Oren', 'John A. Allen', 'Mani Srivastava', 'Paul Sullivan'],
      tags: ['Human-AI teaming', 'Intelligence analysis', 'Expert evaluation'],
      officialUrl: 'https://doi.org/10.1016/J.ISWA.2022.200151',
      body: prose(
        'Il lavoro studia cosa renda davvero utile la collaborazione tra analisti e strumenti intelligenti in contesti di intelligence.',
        'L’elemento centrale è che fiducia, trasparenza e capacità di contestare o verificare un suggerimento sono condizioni operative, non rifiniture di UX.'
      ),
    },
    {
      translationKey: 'deepprobcep-adversarial-settings',
      locale: 'it',
      pathSlug: 'deepprobcep-adversarial-settings',
      title: 'DeepProbCEP: A neuro-symbolic approach for complex event processing in adversarial settings',
      summary: 'Complex event processing neuro-simbolico per scenari avversariali, con AI che ragiona su eventi complessi e dati rumorosi.',
      image: '/images/research/audio-waveform.jpg',
      seo: { title: 'DeepProbCEP | Ricerca', description: 'Paper journal su complex event processing neuro-simbolico in ambienti avversariali.' },
      itemType: 'paper',
      typeLabel: 'Articolo accademico',
      publishedAt: '2023-06-20',
      authors: ['Marc Roig Vilamala', 'Tianwei Xing', 'Harrison Taylor', 'Luis Garcia', 'Mani Srivastava', 'Lance M. Kaplan', 'Alun D. Preece', 'Angelika Kimmig', 'Federico Cerutti'],
      tags: ['Neuro-symbolic AI', 'Complex event processing', 'Adversarial settings'],
      officialUrl: 'https://dblp.org/rec/journals/eswa/VilamalaXTGSKPKC23',
      body: prose(
        'DeepProbCEP porta il complex event processing dentro uno spazio neuro-simbolico in cui segnali deboli, regole esplicite e scenari avversariali vengono trattati insieme.',
        'È un tassello importante perché mostra come apprendimento e ragionamento possano cooperare senza sacrificare troppo la leggibilità del sistema.'
      ),
    },
    {
      translationKey: 'lost-in-translation-sound-squatting',
      locale: 'it',
      pathSlug: 'lost-in-translation-sound-squatting',
      title: 'Lost in Translation: AI-based Generator of Cross-Language Sound-squatting',
      summary: 'Sound-squatting cross-language per anticipare rischi di phishing e abuso tra lingue diverse.',
      image: '/images/research/computer-lock-key.jpg',
      seo: { title: 'Lost in Translation | Ricerca', description: 'Paper su generazione AI di sound-squatting cross-language.' },
      itemType: 'paper',
      typeLabel: 'Articolo accademico',
      publishedAt: '2023-07-17',
      authors: ['Rodolfo V. Valentim', 'Idilio Drago', 'Marco Mellia', 'Federico Cerutti'],
      tags: ['Phishing', 'Sound-squatting', 'Multilingual AI'],
      officialUrl: 'https://doi.org/10.1109/EuroSPW59978.2023.00063',
      body: prose(
        'Il paper studia come modelli di AI possano generare varianti foneticamente simili attraverso lingue diverse, evidenziando nuove superfici di attacco.',
        'Questo è rilevante per phishing, typosquatting e supply-chain abuse in scenari sempre più vocali e multilingue.'
      ),
    },
    {
      translationKey: 'x-squatter',
      locale: 'it',
      pathSlug: 'x-squatter-sound-squatting-multilingua',
      title: 'X-squatter: AI Multilingual Generation of Cross-Language Sound-squatting',
      summary: 'Estensione del lavoro sul sound-squatting con evidenze su certificati TLS e pacchetti software.',
      image: '/images/research/computer-lock-key.jpg',
      seo: { title: 'X-squatter | Ricerca', description: 'Paper su sound-squatting multilingue, certificati TLS e abuso di pacchetti software.' },
      itemType: 'paper',
      typeLabel: 'Articolo accademico',
      publishedAt: '2024-06-17',
      authors: ['Rodolfo Vieira Valentim', 'Idilio Drago', 'Marco Mellia', 'Federico Cerutti'],
      tags: ['Phishing', 'TLS certificates', 'Package security', 'Multilingual AI'],
      officialUrl: 'https://doi.org/10.1145/3663569',
      body: prose(
        'Il lavoro mostra che il sound-squatting non è solo teorico: può essere osservato anche dentro infrastrutture e repository reali.',
        'Il risultato rafforza l’idea che modelli multilingue e osservazione empirica vadano trattati insieme quando si studiano nuove forme di abuso.'
      ),
    },
    {
      translationKey: 'argumentation-guided-causal-evaluation-llms',
      locale: 'it',
      pathSlug: 'argumentation-guided-causal-evaluation-llms',
      title: 'Early Insights into Argumentation-Guided Causal Evaluation with the Help of LLMs',
      summary: 'Prime evidenze su come usare LLM e argomentazione per ragionare su spiegazioni causali concorrenti.',
      image: '/images/research/bi-dashboard.jpg',
      seo: { title: 'Argumentation-Guided Causal Evaluation | Ricerca', description: 'Paper su causal evaluation guidata da argomentazione e LLM.' },
      itemType: 'paper',
      typeLabel: 'Articolo accademico',
      publishedAt: '2025-02-25',
      authors: ['Pietro Baroni', 'Federico Cerutti', 'Massimiliano Giacomin', 'Gianfranco Lamperti', 'Marina Zanella'],
      tags: ['LLMs', 'Causal reasoning', 'Argumentation'],
      officialUrl: 'https://dblp.org/rec/conf/ai3/BaroniCGLZ25',
      body: prose(
        'Il paper esplora come gli LLM possano supportare la valutazione di relazioni causali quando esistono spiegazioni concorrenti e dati incompleti.',
        'L’approccio è coerente con il resto della ricerca: usare modelli potenti, ma costringerli dentro strutture verificabili e discorsive.'
      ),
    },
    {
      translationKey: 'transparent-cti-llm-ontologies',
      locale: 'it',
      pathSlug: 'transparent-cti-llm-ontologies',
      title: 'Enabling Transparent Cyber Threat Intelligence Combining Large Language Models and Domain Ontologies',
      summary: 'Uso congiunto di LLM e ontologie di dominio per estrarre CTI in modo più trasparente e verificabile.',
      image: '/images/research/bi-dashboard.jpg',
      seo: { title: 'Transparent CTI | Ricerca', description: 'Rapporto tecnico su CTI trasparente con LLM e ontologie.' },
      itemType: 'technical-report',
      typeLabel: 'Rapporto tecnico',
      publishedAt: '2025-09-01',
      authors: ['Luca Cotti', 'Idilio Drago', 'Anisa Rula', 'Devis Bianchini', 'Federico Cerutti'],
      tags: ['Cyber threat intelligence', 'LLMs', 'Ontologies', 'Transparency'],
      officialUrl: 'https://doi.org/10.48550/arXiv.2509.00081',
      body: prose(
        'Il rapporto studia come LLM e ontologie possano essere combinati per produrre estrazione di knowledge graph e cyber threat intelligence meno opaca.',
        'Per una linea di ricerca orientata alla fiducia operativa, il punto decisivo è rendere più ispezionabile il passaggio tra testo, concetti e inferenze.'
      ),
    },
  ],
  en: [
    {
      translationKey: 'rapid-trust-calibration',
      locale: 'en',
      pathSlug: 'rapid-trust-calibration-interpretable-ai',
      title: 'Rapid Trust Calibration through Interpretable and Uncertainty-Aware AI',
      summary: 'How to build AI systems that support decisions without hiding their operational limits.',
      image: '/images/research/ai-brain-collage.jpg',
      seo: { title: 'Rapid Trust Calibration | Research', description: 'Paper on interpretability, uncertainty, and operational trust in AI systems.' },
      featured: true,
      itemType: 'paper',
      typeLabel: 'Paper',
      publishedAt: '2020-07-10',
      authors: ['Richard Tomsett', 'Alun Preece', 'Dave Braines', 'Federico Cerutti', 'Supriyo Chakraborty', 'Mani B. Srivastava', 'Gavin Pearson', 'Lance M. Kaplan'],
      tags: ['Explainable AI', 'Uncertainty', 'Decision support', 'Cybersecurity'],
      officialUrl: 'https://doi.org/10.1016/j.patter.2020.100049',
      body: prose(
        'The paper starts from a practical question: in high-stakes settings, an AI prediction is not enough if operators cannot see how reliable it is.',
        'The proposed idea of rapid trust calibration is to give people enough evidence to decide quickly whether to trust the system, how much, and where uncertainty is still material.'
      ),
    },
    {
      translationKey: 'uncertainty-aware-deep-classifiers',
      locale: 'en',
      pathSlug: 'uncertainty-aware-deep-classifiers',
      title: 'Uncertainty-Aware Deep Classifiers Using Generative Models',
      summary: 'Deep classifiers that better separate known cases, ambiguous cases, and out-of-distribution inputs.',
      image: '/images/research/neural-network-dark.png',
      seo: { title: 'Uncertainty-Aware Deep Classifiers | Research', description: 'Paper on deep classification, uncertainty, and robustness against anomalous inputs.' },
      itemType: 'paper',
      typeLabel: 'Paper',
      publishedAt: '2020-04-03',
      authors: ['Murat Sensoy', 'Lance M. Kaplan', 'Federico Cerutti', 'Maryam Saleki'],
      tags: ['Machine learning', 'Out-of-distribution', 'Uncertainty', 'Adversarial robustness'],
      officialUrl: 'https://doi.org/10.1609/aaai.v34i04.6015',
      body: prose(
        'This work tackles a familiar weakness of deep models: issuing highly confident outputs even when the input does not resemble the training distribution.',
        'By combining classification and generative modelling, it proposes a more reliable way to separate known cases, doubtful cases, and unfamiliar inputs.'
      ),
    },
    {
      translationKey: 'supporting-trustworthy-ai-bayesian-argumentation',
      locale: 'en',
      pathSlug: 'supporting-trustworthy-ai-bayesian-argumentation',
      title: 'Supporting Trustworthy Artificial Intelligence via Bayesian Argumentation',
      summary: 'A bridge between computational argumentation and trustworthy AI for clearer and more inspectable decisions.',
      image: '/images/research/neural-network-dark.png',
      seo: { title: 'Supporting Trustworthy AI | Research', description: 'Paper on trustworthy AI and Bayesian argumentation.' },
      itemType: 'paper',
      typeLabel: 'Paper',
      publishedAt: '2021-11-29',
      authors: ['Federico Cerutti'],
      tags: ['Argumentation', 'Bayesian reasoning', 'Trustworthy AI'],
      officialUrl: 'https://dblp.org/rec/conf/aiia/Cerutti21',
      body: prose(
        'This contribution shows how Bayesian argumentation can make AI explanations more structured and auditable.',
        'The aim is not only to defend a conclusion, but also to expose the assumptions and evidential strength behind it.'
      ),
    },
    {
      translationKey: 'human-machine-collaboration-intelligence-analysis',
      locale: 'en',
      pathSlug: 'human-machine-collaboration-intelligence-analysis',
      title: 'Human-machine collaboration in intelligence analysis: An expert evaluation',
      summary: 'Expert evaluation of how intelligent tools and human analysts can collaborate in intelligence analysis.',
      image: '/images/research/audio-waveform.jpg',
      seo: { title: 'Human-machine Collaboration | Research', description: 'Paper on human-machine collaboration in intelligence analysis.' },
      itemType: 'paper',
      typeLabel: 'Paper',
      publishedAt: '2022-12-20',
      authors: ['Alice Toniolo', 'Federico Cerutti', 'Timothy J. Norman', 'Nir Oren', 'John A. Allen', 'Mani Srivastava', 'Paul Sullivan'],
      tags: ['Human-AI teaming', 'Intelligence analysis', 'Expert evaluation'],
      officialUrl: 'https://doi.org/10.1016/J.ISWA.2022.200151',
      body: prose(
        'The paper studies what makes collaboration between analysts and intelligent tools genuinely useful in intelligence work.',
        'Trust, transparency, and the ability to contest or verify a system recommendation are treated here as operational requirements, not interface extras.'
      ),
    },
    {
      translationKey: 'deepprobcep-adversarial-settings',
      locale: 'en',
      pathSlug: 'deepprobcep-adversarial-settings',
      title: 'DeepProbCEP: A neuro-symbolic approach for complex event processing in adversarial settings',
      summary: 'Neuro-symbolic complex event processing for adversarial settings, where AI must reason over complex and noisy event streams.',
      image: '/images/research/audio-waveform.jpg',
      seo: { title: 'DeepProbCEP | Research', description: 'Journal paper on neuro-symbolic complex event processing in adversarial settings.' },
      itemType: 'paper',
      typeLabel: 'Paper',
      publishedAt: '2023-06-20',
      authors: ['Marc Roig Vilamala', 'Tianwei Xing', 'Harrison Taylor', 'Luis Garcia', 'Mani Srivastava', 'Lance M. Kaplan', 'Alun D. Preece', 'Angelika Kimmig', 'Federico Cerutti'],
      tags: ['Neuro-symbolic AI', 'Complex event processing', 'Adversarial settings'],
      officialUrl: 'https://dblp.org/rec/journals/eswa/VilamalaXTGSKPKC23',
      body: prose(
        'DeepProbCEP brings complex event processing into a neuro-symbolic setting where weak signals, explicit rules, and adversarial conditions are handled together.',
        'It matters because it shows how learning and reasoning can cooperate without fully sacrificing system inspectability.'
      ),
    },
    {
      translationKey: 'lost-in-translation-sound-squatting',
      locale: 'en',
      pathSlug: 'lost-in-translation-sound-squatting',
      title: 'Lost in Translation: AI-based Generator of Cross-Language Sound-squatting',
      summary: 'Cross-language sound-squatting to anticipate phishing and brand abuse across different languages.',
      image: '/images/research/computer-lock-key.jpg',
      seo: { title: 'Lost in Translation | Research', description: 'Paper on AI-generated cross-language sound-squatting.' },
      itemType: 'paper',
      typeLabel: 'Paper',
      publishedAt: '2023-07-17',
      authors: ['Rodolfo V. Valentim', 'Idilio Drago', 'Marco Mellia', 'Federico Cerutti'],
      tags: ['Phishing', 'Sound-squatting', 'Multilingual AI'],
      officialUrl: 'https://doi.org/10.1109/EuroSPW59978.2023.00063',
      body: prose(
        'This work studies how AI can generate phonetically similar variants across languages, exposing new attack surfaces.',
        'That matters for phishing, typosquatting, and supply-chain abuse in a world that is increasingly multilingual and voice-mediated.'
      ),
    },
    {
      translationKey: 'x-squatter',
      locale: 'en',
      pathSlug: 'x-squatter-multilingual-sound-squatting',
      title: 'X-squatter: AI Multilingual Generation of Cross-Language Sound-squatting',
      summary: 'An extension of sound-squatting research with evidence from TLS certificates and software packages.',
      image: '/images/research/computer-lock-key.jpg',
      seo: { title: 'X-squatter | Research', description: 'Paper on multilingual sound-squatting, TLS certificates, and package abuse.' },
      itemType: 'paper',
      typeLabel: 'Paper',
      publishedAt: '2024-06-17',
      authors: ['Rodolfo Vieira Valentim', 'Idilio Drago', 'Marco Mellia', 'Federico Cerutti'],
      tags: ['Phishing', 'TLS certificates', 'Package security', 'Multilingual AI'],
      officialUrl: 'https://doi.org/10.1145/3663569',
      body: prose(
        'The paper shows that sound-squatting is not merely a theoretical concern: it can already be observed in infrastructure and package ecosystems.',
        'The broader implication is that multilingual AI and empirical measurement should be treated together when studying new abuse patterns.'
      ),
    },
    {
      translationKey: 'argumentation-guided-causal-evaluation-llms',
      locale: 'en',
      pathSlug: 'argumentation-guided-causal-evaluation-llms',
      title: 'Early Insights into Argumentation-Guided Causal Evaluation with the Help of LLMs',
      summary: 'Early evidence on using LLMs and argumentation to reason over competing causal explanations.',
      image: '/images/research/bi-dashboard.jpg',
      seo: { title: 'Argumentation-Guided Causal Evaluation | Research', description: 'Paper on causal evaluation guided by argumentation and LLMs.' },
      itemType: 'paper',
      typeLabel: 'Paper',
      publishedAt: '2025-02-25',
      authors: ['Pietro Baroni', 'Federico Cerutti', 'Massimiliano Giacomin', 'Gianfranco Lamperti', 'Marina Zanella'],
      tags: ['LLMs', 'Causal reasoning', 'Argumentation'],
      officialUrl: 'https://dblp.org/rec/conf/ai3/BaroniCGLZ25',
      body: prose(
        'The paper explores how LLMs can assist the evaluation of causal relations when multiple explanations compete and evidence is incomplete.',
        'It fits the wider research programme: leverage powerful models, but constrain them within structures that remain inspectable and debatable.'
      ),
    },
    {
      translationKey: 'transparent-cti-llm-ontologies',
      locale: 'en',
      pathSlug: 'transparent-cti-llm-ontologies',
      title: 'Enabling Transparent Cyber Threat Intelligence Combining Large Language Models and Domain Ontologies',
      summary: 'Joint use of LLMs and domain ontologies to extract cyber threat intelligence more transparently and verifiably.',
      image: '/images/research/bi-dashboard.jpg',
      seo: { title: 'Transparent CTI | Research', description: 'Technical report on transparent CTI with LLMs and ontologies.' },
      itemType: 'technical-report',
      typeLabel: 'Technical report',
      publishedAt: '2025-09-01',
      authors: ['Luca Cotti', 'Idilio Drago', 'Anisa Rula', 'Devis Bianchini', 'Federico Cerutti'],
      tags: ['Cyber threat intelligence', 'LLMs', 'Ontologies', 'Transparency'],
      officialUrl: 'https://doi.org/10.48550/arXiv.2509.00081',
      body: prose(
        'This report studies how LLMs and ontologies can be combined to produce knowledge extraction and cyber threat intelligence workflows that are less opaque.',
        'For a research agenda centred on operational trust, the key issue is making the transition from text to concepts to inferences more inspectable.'
      ),
    },
  ],
};

const projects: Record<Locale, Project[]> = {
  it: [
    {
      translationKey: 'project-true',
      locale: 'it',
      pathSlug: 'true',
      title: 'TRUE',
      summary: 'Situational understanding interpretabile e trustworthy per serie temporali multivariate in sistemi cyber-fisici.',
      image: '/images/sourced/projects/project-true.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-true.jpg',
        sourceUrl: 'https://unsplash.com/photos/silhouette-photography-of-man-1tnS_BVy9Jk',
        sourceLabel: 'Photo by Chris Yang on Unsplash',
      },
      seo: { title: 'TRUE | Progetti', description: 'Progetto TRUE su causalità, argomentazione e incertezza per cyber-physical systems.' },
      featured: true,
      startDate: '2025-07-01',
      endDate: '2028-07-31',
      status: 'in corso',
      funder: 'US EOARD',
      tags: ['Multivariate time series', 'Causal inference', 'Argumentation', 'Cyber-physical systems'],
      people: ['Federico Cerutti'],
      body: prose(
        'TRUE stabilisce una base scientifica per il situational understanding interpretabile e trustworthy su serie temporali multivariate, integrando apprendimento spatio-temporale, inferenza causale argomentativa e risk assessment uncertainty-aware.',
        'L’obiettivo è capire non solo cosa sta succedendo in un sistema complesso, ma anche quali siano le cause più plausibili, quanto sia affidabile ogni inferenza e come supportare decisioni prudenti quando i dati non sono pienamente rappresentativi.'
      ),
    },
    {
      translationKey: 'project-ns-cep',
      locale: 'it',
      pathSlug: 'ns-cep',
      title: 'NS-CEP',
      summary: 'Architetture neuro-simboliche uncertainty-aware per signal intelligence e complex event processing.',
      image: '/images/sourced/projects/project-ns-cep.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-ns-cep.jpg',
        sourceUrl: 'https://unsplash.com/photos/a-blurry-image-of-a-sound-wave-7InS3KjNTDs',
        sourceLabel: 'Photo by Logan Voss on Unsplash',
      },
      seo: { title: 'NS-CEP | Progetti', description: 'Progetto NS-CEP su AI neuro-simbolica per signal intelligence.' },
      startDate: '2022-08-01',
      endDate: '2026-07-31',
      status: 'in corso',
      funder: 'US EOARD',
      tags: ['Neuro-symbolic AI', 'SIGINT', 'Uncertainty', 'Complex event processing'],
      people: ['Federico Cerutti'],
      body: prose(
        'NS-CEP studia come combinare apprendimento dai dati e regole esplicite per derivare signal intelligence anche in ambienti contestati e con dati rumorosi.',
        'Il progetto punta a riconoscere eventi complessi, ma anche a fornire insight e foresight su fenomeni non già osservati in passato.'
      ),
    },
    {
      translationKey: 'project-acre',
      locale: 'it',
      pathSlug: 'acre',
      title: 'ACRE',
      summary: 'AI, causalità e ragionamento per rendere più resilienti i deceptive assets nella difesa cyber.',
      image: '/images/sourced/projects/project-acre.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-acre.jpg',
        sourceUrl: 'https://unsplash.com/photos/a-man-and-woman-kissing-6ZR8TLMYO4Y',
        sourceLabel: 'Photo by Rapha Wilde on Unsplash',
      },
      seo: { title: 'ACRE | Progetti', description: 'Progetto ACRE su AI-based causality and reasoning for deceptive assets.' },
      startDate: '2023-10-01',
      endDate: '2025-10-01',
      status: 'concluso',
      funder: 'MUR PRIN',
      tags: ['Deception', 'Threat intelligence', 'Causal reasoning', 'AI for cybersecurity'],
      people: ['Federico Cerutti'],
      body: prose(
        'ACRE lavora sulla resilienza dei meccanismi di difesa cyber contro minacce persistenti avanzate.',
        'L’idea è combinare causalità e ragionamento per aiutare gli analisti a leggere meglio attacchi complessi contro reti distribuite e infrastrutture critiche.'
      ),
    },
    {
      translationKey: 'project-hai-pcca',
      locale: 'it',
      pathSlug: 'hai-pcca',
      title: 'HAI-PCCA',
      summary: 'Collaborazione efficace tra umani e agenti AI in team che devono percepire, ragionare, comunicare e agire.',
      image: '/images/sourced/projects/project-hai-pcca.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-hai-pcca.jpg',
        sourceUrl: 'https://unsplash.com/photos/photo-of-girl-laying-left-hand-on-white-digital-robot-0E_vhMVqL9g',
        sourceLabel: 'Photo by Andy Kelly on Unsplash',
      },
      seo: { title: 'HAI-PCCA | Progetti', description: 'Progetto HAI-PCCA su collaborazione human-AI.' },
      startDate: '2022-10-01',
      endDate: '2024-09-30',
      status: 'concluso',
      funder: 'US DEVCOM ARL',
      tags: ['Human-AI teaming', 'Coordination', 'Agent systems', 'Decision support'],
      people: ['Federico Cerutti'],
      body: prose(
        'HAI-PCCA affronta il problema di far collaborare in modo realmente efficace umani e agenti AI.',
        'Il progetto studia team misti in cui gli agenti imparano a coordinare cicli locali e globali di percezione, cognizione, comunicazione e azione.'
      ),
    },
    {
      translationKey: 'project-neacd',
      locale: 'it',
      pathSlug: 'neacd',
      title: 'NEACD',
      summary: 'Active cyber defence neurosimbolica per estrarre intelligence azionabile da log e fonti eterogenee.',
      image: '/images/sourced/projects/project-neacd.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-neacd.jpg',
        sourceUrl: 'https://unsplash.com/photos/qr-codes-close-up-photography-B4lknSRZwPM',
        sourceLabel: 'Photo by Boris Bobrov on Unsplash',
      },
      seo: { title: 'NEACD | Progetti', description: 'Progetto NEACD su active cyber defence neurosimbolica e cyber threat intelligence.' },
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      status: 'concluso',
      funder: 'PNRR, NextGeneration EU',
      tags: ['Cyber threat intelligence', 'Active cyber defence', 'Knowledge graphs', 'Neuro-symbolic AI'],
      people: ['Federico Cerutti'],
      body: prose(
        'NEACD punta a dare agli analisti strumenti migliori per investigare attività malevole in scenari complessi.',
        'Combina monitoraggio, grafi di conoscenza, machine learning e modelli linguistici per trasformare grandi flussi di evidenze in spiegazioni operative.'
      ),
    },
  ],
  en: [
    {
      translationKey: 'project-true',
      locale: 'en',
      pathSlug: 'true',
      title: 'TRUE',
      summary: 'Interpretable and trustworthy situational understanding for multivariate time series in cyber-physical systems.',
      image: '/images/sourced/projects/project-true.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-true.jpg',
        sourceUrl: 'https://unsplash.com/photos/silhouette-photography-of-man-1tnS_BVy9Jk',
        sourceLabel: 'Photo by Chris Yang on Unsplash',
      },
      seo: { title: 'TRUE | Projects', description: 'TRUE project on causality, argumentation, and uncertainty for cyber-physical systems.' },
      featured: true,
      startDate: '2025-07-01',
      endDate: '2028-07-31',
      status: 'running',
      funder: 'US EOARD',
      tags: ['Multivariate time series', 'Causal inference', 'Argumentation', 'Cyber-physical systems'],
      people: ['Federico Cerutti'],
      body: prose(
        'TRUE establishes a scientific foundation for interpretable and trustworthy situational understanding over multivariate time series by integrating spatio-temporal learning, argumentation-based causal inference, and uncertainty-aware risk assessment.',
        'The goal is to understand not only what is happening in a complex system, but also which causes are most plausible, how reliable each inference is, and how to support cautious decisions when data is only partially representative.'
      ),
    },
    {
      translationKey: 'project-ns-cep',
      locale: 'en',
      pathSlug: 'ns-cep',
      title: 'NS-CEP',
      summary: 'Uncertainty-aware neuro-symbolic architectures for signal intelligence and complex event processing.',
      image: '/images/sourced/projects/project-ns-cep.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-ns-cep.jpg',
        sourceUrl: 'https://unsplash.com/photos/a-blurry-image-of-a-sound-wave-7InS3KjNTDs',
        sourceLabel: 'Photo by Logan Voss on Unsplash',
      },
      seo: { title: 'NS-CEP | Projects', description: 'NS-CEP project on neuro-symbolic AI for signal intelligence.' },
      startDate: '2022-08-01',
      endDate: '2026-07-31',
      status: 'running',
      funder: 'US EOARD',
      tags: ['Neuro-symbolic AI', 'SIGINT', 'Uncertainty', 'Complex event processing'],
      people: ['Federico Cerutti'],
      body: prose(
        'NS-CEP studies how to combine learning from data with explicit rules in order to derive signal intelligence even in contested environments with noisy evidence.',
        'The project aims not only to recognise complex events, but also to provide insight and foresight on phenomena that were not already present in past observations.'
      ),
    },
    {
      translationKey: 'project-acre',
      locale: 'en',
      pathSlug: 'acre',
      title: 'ACRE',
      summary: 'AI, causality, and reasoning to improve the resilience of deceptive assets in cyber defence.',
      image: '/images/sourced/projects/project-acre.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-acre.jpg',
        sourceUrl: 'https://unsplash.com/photos/a-man-and-woman-kissing-6ZR8TLMYO4Y',
        sourceLabel: 'Photo by Rapha Wilde on Unsplash',
      },
      seo: { title: 'ACRE | Projects', description: 'ACRE project on AI-based causality and reasoning for deceptive assets.' },
      startDate: '2023-10-01',
      endDate: '2025-10-01',
      status: 'finished',
      funder: 'Italian MUR PRIN',
      tags: ['Deception', 'Threat intelligence', 'Causal reasoning', 'AI for cybersecurity'],
      people: ['Federico Cerutti'],
      body: prose(
        'ACRE focuses on the resilience of cyber-defence mechanisms against advanced persistent threats.',
        'The core idea is to combine causal models and reasoning so analysts can better understand sophisticated attacks against distributed networks and critical infrastructures.'
      ),
    },
    {
      translationKey: 'project-hai-pcca',
      locale: 'en',
      pathSlug: 'hai-pcca',
      title: 'HAI-PCCA',
      summary: 'Effective collaboration between humans and AI agents in teams that must perceive, reason, communicate, and act.',
      image: '/images/sourced/projects/project-hai-pcca.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-hai-pcca.jpg',
        sourceUrl: 'https://unsplash.com/photos/photo-of-girl-laying-left-hand-on-white-digital-robot-0E_vhMVqL9g',
        sourceLabel: 'Photo by Andy Kelly on Unsplash',
      },
      seo: { title: 'HAI-PCCA | Projects', description: 'HAI-PCCA project on human-AI collaboration.' },
      startDate: '2022-10-01',
      endDate: '2024-09-30',
      status: 'finished',
      funder: 'US DEVCOM ARL',
      tags: ['Human-AI teaming', 'Coordination', 'Agent systems', 'Decision support'],
      people: ['Federico Cerutti'],
      body: prose(
        'HAI-PCCA addresses the problem of making collaboration between humans and AI agents genuinely effective.',
        'It studies mixed teams where agents learn to coordinate local and global loops of perception, cognition, communication, and action.'
      ),
    },
    {
      translationKey: 'project-neacd',
      locale: 'en',
      pathSlug: 'neacd',
      title: 'NEACD',
      summary: 'Neuro-symbolic active cyber defence for extracting actionable intelligence from logs and heterogeneous evidence.',
      image: '/images/sourced/projects/project-neacd.jpg',
      imageAttribution: {
        assetPath: '/images/sourced/projects/project-neacd.jpg',
        sourceUrl: 'https://unsplash.com/photos/qr-codes-close-up-photography-B4lknSRZwPM',
        sourceLabel: 'Photo by Boris Bobrov on Unsplash',
      },
      seo: { title: 'NEACD | Projects', description: 'NEACD project on neuro-symbolic active cyber defence and cyber threat intelligence.' },
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      status: 'finished',
      funder: 'PNRR, NextGeneration EU',
      tags: ['Cyber threat intelligence', 'Active cyber defence', 'Knowledge graphs', 'Neuro-symbolic AI'],
      people: ['Federico Cerutti'],
      body: prose(
        'NEACD aims to equip analysts with better tools for investigating malicious activity in complex environments.',
        'It combines monitoring, knowledge graphs, machine learning, and language models to turn large evidence streams into operational explanations.'
      ),
    },
  ],
};

const teachingPages: Record<Locale, TeachingPage[]> = {
  it: [
    {
      translationKey: 'tutorial-erl',
      locale: 'it',
      pathSlug: 'ragionamento-evidenziale-e-apprendimento',
      title: 'Evidential Reasoning and Learning',
      summary: 'Tutorial IJCAI 2022 su incertezza epistemica e aleatoria, probabilistic circuits e apprendimento evidenziale.',
      seo: {
        title: 'Evidential Reasoning and Learning | Didattica',
        description: 'Tutorial IJCAI 2022 di Federico Cerutti e Lance M. Kaplan su evidential reasoning and learning.',
      },
      itemType: 'tutorial',
      typeLabel: 'Tutorial di ricerca',
      dateLabel: '24 luglio 2022, ore 15:30',
      people: ['Federico Cerutti', 'Lance M. Kaplan'],
      location: 'Vienna, Austria, Messe Wien Exhibition and Congress Center, Lehar 1',
      tags: ['IJCAI 2022', 'Uncertainty', 'Bayesian reasoning', 'Probabilistic circuits'],
      sourceUrl: 'https://federico-cerutti.unibs.it/tutorials/2022-ijcai-erl/',
      body: `
        <p><strong>Quando:</strong> domenica 24 luglio 2022, ore 15:30.</p>
        <p><strong>Dove:</strong> Vienna, Austria, Messe Wien Exhibition and Congress Center, Lehar 1.</p>
        <p><strong>Docenti:</strong> Federico Cerutti e Lance M. Kaplan.</p>
        <p><a href="/slides/IJCAI22-ERL.pdf" target="_blank" rel="noreferrer">Slides</a></p>
        <p>Per citare i contenuti del tutorial: Federico Cerutti, Lance Kaplan, and Murat Sensoy, "Evidential Reasoning and Learning: a Survey", IJCAI 2022.</p>
        <h2>Descrizione breve</h2>
        <p>Quando si collabora con un sistema di AI, occorre capire quando fidarsi delle sue raccomandazioni. Se lo si considera affidabile proprio nelle regioni in cui e' piu' probabile che sbagli, il rischio e' di incorrere in fallimenti catastrofici. Da qui nasce l'interesse per approcci bayesiani che consentano di ragionare sull'incertezza epistemica associata alle probabilita' di un esito interrogato. I metodi pienamente bayesiani, tuttavia, possono avere costi computazionali elevati, e il tutorial introduce quindi approssimazioni efficienti ed efficaci basate sull'aggiornamento bayesiano di ipotesi alla luce di nuove evidenze.</p>
        <p>Il percorso e' rivolto a dottorandi e ricercatori agli inizi della carriera e offre un'introduzione graduale all'area dell'evidential reasoning and learning, ai risultati di ricerca piu' aggiornati e alle questioni ancora aperte.</p>
        <h2>Descrizione del tutorial</h2>
        <p>Il tutorial distingue innanzitutto tra due fonti di incertezza: quella aleatoria, legata alla variabilita' intrinseca di un fenomeno, e quella epistemica, che dipende dal livello di conoscenza dell'agente e puo' essere ridotta raccogliendo nuovi dati. Su questa base viene esplorata la quantificazione congiunta di incertezza aleatoria ed epistemica in scenari di ragionamento e apprendimento.</p>
        <p>Il focus principale e' sulle probabilita' incerte rappresentate tramite distribuzioni beta o Dirichlet. A differenza di molte survey dedicate all'incertezza epistemica nel deep learning, questo tutorial discute in modo esteso sia il ragionamento sia l'apprendimento, con dati completi e parziali. La parte sul ragionamento mostra come i probabilistic circuits offrano un quadro unificante per piu' problemi inferenziali, mentre la parte finale affronta il problema di ottenere probabilita' incerte dal mondo reale, sia tramite esperti umani sia tramite apprendimento da dati grezzi.</p>
        <h2>Scaletta dettagliata</h2>
        <h3>Primer di statistica bayesiana</h3>
        <ul>
          <li>Fondamenti di statistica e del teorema di Bayes.</li>
          <li>Distribuzioni beta e Dirichlet come rappresentazioni di probabilita' incerte.</li>
        </ul>
        <h3>Evidential reasoning</h3>
        <ul>
          <li>Dalla logica ai probabilistic circuits.</li>
          <li>Probabilistic circuits come metodo unificante per il ragionamento probabilistico.</li>
          <li>Probabilistic circuits con probabilita' incerte.</li>
        </ul>
        <h3>Evidential parameter learning</h3>
        <ul>
          <li>Apprendimento con osservazioni complete.</li>
          <li>Apprendimento con osservazioni parziali: prime proposte e discussione critica.</li>
        </ul>
        <h3>Ottenere evidenza dal mondo reale</h3>
        <ul>
          <li>Intelligence analysis e gestione dell'incertezza.</li>
          <li>Evidential Deep Learning.</li>
          <li>Proposte alternative.</li>
        </ul>
        <h3>Sintesi conclusiva</h3>
      `,
    },
    {
      translationKey: 'tutorial-argml',
      locale: 'it',
      pathSlug: 'argomentazione-e-machine-learning',
      title: 'Argumentation and Machine Learning: When the Whole is Greater than the Sum of its Parts',
      summary: 'Tutorial IJCAI 2019 sulle sinergie tra argumentation technology e machine learning.',
      seo: {
        title: 'Argumentation and Machine Learning | Didattica',
        description: 'Tutorial IJCAI 2019 di Federico Cerutti su argumentation technology e machine learning.',
      },
      itemType: 'tutorial',
      typeLabel: 'Tutorial di ricerca',
      dateLabel: '12 agosto 2019, sessione mattutina',
      people: ['Federico Cerutti'],
      location: 'Macao, Cina, The Venetian Macao Resort Hotel, Naples 2703-2704',
      tags: ['IJCAI 2019', 'Argumentation', 'Machine learning', 'Explainable AI'],
      sourceUrl: 'https://federico-cerutti.unibs.it/tutorials/2019-ijcai-argml/',
      body: `
        <p><strong>Quando:</strong> lunedi' 12 agosto 2019, sessione mattutina.</p>
        <p><strong>Dove:</strong> Macao, Cina, The Venetian Macao Resort Hotel, Naples 2703-2704.</p>
        <p><strong>Docente:</strong> Federico Cerutti.</p>
        <h2>Registrazione</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/k2_6Dtsa8MI" title="Argumentation and Machine Learning" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h2>Descrizione breve</h2>
        <p>L'argumentation technology e' un'area interdisciplinare che negli ultimi due decenni si e' affermata come uno dei paradigmi piu' promettenti per il ragionamento di senso comune e la risoluzione di conflitti, fino a essere impiegata anche in progetti industriali e commerciali come IBM Debater.</p>
        <p>Il tutorial introduce dottorandi, ricercatori agli inizi della carriera ed esperti di machine learning a tre filoni principali: i fondamenti dell'argumentation con esempi concreti, gli approcci di argumentation che sfruttano il machine learning, e gli approcci di machine learning che sfruttano l'argumentation, per esempio in chiave di explainability.</p>
        <p>Non e' richiesta una conoscenza preliminare della teoria dell'argomentazione.</p>
        <h2>Descrizione del tutorial</h2>
        <p>La prima parte mette in evidenza gli elementi teorici che stanno alla base di gran parte delle correnti dell'argumentation, mostrando il legame con epistemologia, diritto e complessita' computazionale. Vengono discussi prototipi di ricerca applicati a casi reali che estendono l'uso dell'argumentation dal ragionamento giuridico al sense-making nell'intelligence analysis.</p>
        <p>La seconda parte affronta il contributo del machine learning su due problemi centrali: l'acquisizione della conoscenza, dove l'argument mining gioca un ruolo cruciale, e il miglioramento delle prestazioni degli algoritmi di reasoning attraverso tecniche di selezione automatica e supporto predittivo. Il tutorial passa anche in rassegna gli algoritmi per il calcolo delle estensioni semantiche degli argumentation frameworks.</p>
        <p>La parte finale considera i sistemi di apprendimento che includono l'argumentation nell'architettura: in alcuni casi come regolarizzatore, in molti altri come supporto all'explainability e all'accountability algoritmica. L'obiettivo complessivo e' offrire una visione aggiornata e operativa della convergenza fra argumentation technology e machine learning.</p>
        <h2>Slides</h2>
        <p><a href="https://www.slideshare.net/fcerutti/argumentation-and-machine-learning-when-the-whole-is-greater-than-the-sum-of-its-parts" target="_blank" rel="noreferrer">Slides</a></p>
      `,
    },
    {
      translationKey: 'tutorial-theory-practice',
      locale: 'it',
      pathSlug: 'argomentazione-dalla-teoria-alla-pratica',
      title: 'Argumentation in Artificial Intelligence: From Theory to Practice',
      summary: 'Tutorial IJCAI 2017 pensato per rendere l\'argumentation utilizzabile in pratica da ricercatori e specialisti AI.',
      seo: {
        title: 'Argumentation in AI: From Theory to Practice | Didattica',
        description: 'Tutorial IJCAI 2017 di Federico Cerutti e Mauro Vallati su argumentation in AI.',
      },
      itemType: 'tutorial',
      typeLabel: 'Tutorial di ricerca',
      dateLabel: '21 agosto 2017, sessione mattutina',
      people: ['Federico Cerutti', 'Mauro Vallati'],
      location: 'Melbourne, Australia, MCEC (Melbourne Convention and Exhibition Center), MCEC 210',
      tags: ['IJCAI 2017', 'Argumentation', 'Tools', 'AI methods'],
      sourceUrl: 'https://federico-cerutti.unibs.it/tutorials/2017-ijcai-theorypractice/',
      body: `
        <p><strong>Quando:</strong> lunedi' 21 agosto 2017, sessione mattutina.</p>
        <p><strong>Dove:</strong> Melbourne, Australia, MCEC (Melbourne Convention and Exhibition Center), MCEC 210.</p>
        <p><strong>Docenti:</strong> Federico Cerutti e Mauro Vallati.</p>
        <h2>Descrizione breve</h2>
        <p>L'argumentation technology si e' consolidata come uno dei paradigmi piu' promettenti per il ragionamento di senso comune e la risoluzione dei conflitti in numerosi domini applicativi.</p>
        <p>Diversamente dal tutorial del 2015, piu' orientato alla copertura teorica estesa della ricerca in corso, questa edizione e' progettata per offrire a dottorandi, ricercatori agli inizi della carriera ed esperti provenienti da altre aree dell'AI una comprensione chiara dell'argumentation in AI e un insieme di strumenti da usare subito per far avanzare il campo.</p>
        <h2>Slides e technical handouts</h2>
        <p><a href="https://www.slideshare.net/fcerutti/argumentation-in-artificial-intelligence-from-theory-to-practice" target="_blank" rel="noreferrer">Prima parte</a></p>
        <p><a href="https://www.slideshare.net/MauroVallati/argumentation-in-artificial-intelligence-from-theory-to-practice-practice" target="_blank" rel="noreferrer">Seconda parte</a></p>
        <p><a href="https://www.slideshare.net/fcerutti/handout-argumentation-in-artificial-intelligence-from-theory-to-practice" target="_blank" rel="noreferrer">Technical handouts</a></p>
      `,
    },
    {
      translationKey: 'tutorial-dung-20',
      locale: 'it',
      pathSlug: 'argomentazione-20-anni-dopo-dung',
      title: 'Argumentation in Artificial Intelligence: 20 Years after Dung\'s Work',
      summary: 'Tutorial IJCAI 2015 che ripercorre vent\'anni di ricerca in argumentation in AI.',
      seo: {
        title: '20 Years after Dung | Didattica',
        description: 'Tutorial IJCAI 2015 di Federico Cerutti sui vent\'anni successivi al lavoro di Dung.',
      },
      itemType: 'tutorial',
      typeLabel: 'Tutorial di ricerca',
      dateLabel: '26 luglio 2015, giornata intera',
      people: ['Federico Cerutti'],
      location: 'Buenos Aires, Argentina, New Building of Facultad de Ciencias Economicas, Room 436',
      tags: ['IJCAI 2015', 'Argumentation', 'Dung', 'Reasoning systems'],
      sourceUrl: 'https://federico-cerutti.unibs.it/tutorials/2015-ijcai-arg/',
      body: `
        <p><strong>Quando:</strong> domenica 26 luglio 2015, giornata intera.</p>
        <p><strong>Dove:</strong> Buenos Aires, Argentina, New Building of Facultad de Ciencias Economicas, Room 436.</p>
        <p><strong>Docente:</strong> Federico Cerutti.</p>
        <h2>Descrizione breve</h2>
        <p>L'argumentation technology e' presentata come area interdisciplinare che, nell'arco di vent'anni, e' diventata uno dei paradigmi piu' interessanti per il ragionamento di senso comune e la risoluzione dei conflitti. Il tutorial propone una panoramica estesa della ricerca nel settore, dei risultati ormai consolidati, delle implementazioni disponibili, delle applicazioni e delle domande aperte.</p>
        <h2>Descrizione del tutorial</h2>
        <p>Il percorso esplora gli approcci formali all'argumentation sviluppati nei due decenni successivi al lavoro di Dung e ormai adottati in applicazioni concrete. Per offrire una visione completa ai partecipanti, vengono richiamati anche altri versanti della teoria dell'argomentazione, come i dialoghi e le connessioni con le scienze sociali, pur mantenendo il focus tecnico sugli approcci piu' avanzati in AI.</p>
        <p>La trattazione mette a confronto paradigmi basati sulla logica classica e sulla logica informale, chiarendo i legami con epistemologia, studi giuridici e teoria della complessita'. Sul piano tecnologico vengono discussi prototipi di ricerca applicati a casi reali, dalle applicazioni legali al sense-making nell'intelligence analysis, insieme allo stato dell'arte sugli algoritmi per il calcolo delle semantiche e a una discussione sull'ICCMA 2015. L'obiettivo e' fornire una comprensione profonda e aggiornata delle capacita' tecnologiche dell'argumentation in AI.</p>
        <h2>Slides e technical handouts</h2>
        <p><a href="https://www.slideshare.net/fcerutti/argumentation-in-artificial-intelligence" target="_blank" rel="noreferrer">Slides</a></p>
        <p><a href="https://www.slideshare.net/fcerutti/argumentation-in-artificial-intelligence-20-years-after-dungs-work-right-margin-for-notes" target="_blank" rel="noreferrer">Technical handouts</a></p>
      `,
    },
    {
      translationKey: 'course-ai4ctia',
      locale: 'it',
      pathSlug: 'ai-per-l-analisi-di-cyber-threat-intelligence',
      title: 'Cyber Threat Intelligence Analysis and how Artificial Intelligence can Support It',
      summary: 'Corso di dottorato 2022 su CTI, intrusion analysis, causalita\' e supporto AI all\'intelligence.',
      seo: {
        title: 'Cyber Threat Intelligence Analysis | Didattica',
        description: 'Corso di dottorato di Federico Cerutti su cyber threat intelligence analysis e supporto dell\'AI.',
      },
      itemType: 'phd-course',
      typeLabel: 'Corso di dottorato',
      dateLabel: '9-20 maggio 2022',
      people: ['Federico Cerutti'],
      location: 'Brescia, Italia, Department of Information Engineering, University of Brescia, Room 45',
      tags: ['Cyber threat intelligence', 'PhD course', 'Causality', 'Intelligence analysis'],
      sourceUrl: 'https://federico-cerutti.unibs.it/courses/2022-ctia/',
      body: `
        <p><strong>Quando:</strong> dal 9 al 20 maggio 2022.</p>
        <ul>
          <li>09 maggio 2022: 09:00-13:00</li>
          <li>12 maggio 2022: 13:00-16:00</li>
          <li>13 maggio 2022: 13:00-16:00</li>
          <li>16 maggio 2022: 09:00-13:00</li>
          <li>19 maggio 2022: 13:00-16:00</li>
          <li>20 maggio 2022: 13:00-16:00</li>
        </ul>
        <p><strong>Dove:</strong> Brescia, Italia, Department of Information Engineering, University of Brescia, Room 45.</p>
        <p><strong>Docente:</strong> Federico Cerutti.</p>
        <h2>Syllabus</h2>
        <ol>
          <li>Intelligence Analysis e Cyber Threat Intelligence (CTI)
            <ul>
              <li>Comprendere l'intelligence.</li>
              <li>Comprendere la cyber threat intelligence.</li>
              <li>Strategical thinking and direction.</li>
              <li>OWL e ontologie per la CTIA.</li>
            </ul>
          </li>
          <li>Fondamenti di intrusion analysis
            <ul>
              <li>Primary collection source: intrusion analysis.</li>
              <li>Kill chain courses of action.</li>
              <li>Gestione di kill chain multiple.</li>
              <li>Il ruolo della causalita' nella kill chain.</li>
            </ul>
          </li>
          <li>Collection sources
            <ul>
              <li>Malware.</li>
              <li>Tracce di rete.</li>
              <li>Open source intelligence.</li>
              <li>Machine learning per l'intelligence analysis.</li>
            </ul>
          </li>
          <li>Analysis and production of intelligence
            <ul>
              <li>Logical fallacies e cognitive biases.</li>
              <li>Exploring hypotheses.</li>
              <li>Diversi tipi di analisi.</li>
              <li>Argumentation theory e intelligence analysis.</li>
            </ul>
          </li>
          <li>Dissemination and attribution
            <ul>
              <li>Tactical dissemination.</li>
              <li>Operational dissemination.</li>
              <li>Strategic dissemination.</li>
              <li>Natural language generation per l'intelligence analysis.</li>
            </ul>
          </li>
        </ol>
      `,
    },
    {
      translationKey: 'course-arg-theory',
      locale: 'it',
      pathSlug: 'introduzione-alla-teoria-formale-dell-argomentazione',
      title: 'Introduction to Formal Argumentation Theory',
      summary: 'Corso su teoria formale dell\'argomentazione, structured argumentation, dialogo e applicazioni.',
      seo: {
        title: 'Introduction to Formal Argumentation Theory | Didattica',
        description: 'Corso di dottorato di Federico Cerutti e Nir Oren sulla teoria formale dell\'argomentazione.',
      },
      itemType: 'phd-course',
      typeLabel: 'Corso di dottorato',
      dateLabel: '12 giugno 2018',
      people: ['Federico Cerutti', 'Nir Oren'],
      location: 'Maastricht, The Netherlands, Department of Data-Science and Knowledge Engineering',
      tags: ['Formal argumentation', 'PhD course', 'Dialogue', 'Applications'],
      sourceUrl: 'https://federico-cerutti.unibs.it/courses/2018-introarg/',
      body: `
        <p><strong>Quando:</strong> 12 giugno 2018.</p>
        <p><strong>Dove:</strong> Maastricht, The Netherlands, Department of Data-Science and Knowledge Engineering.</p>
        <p><strong>Docenti:</strong> Federico Cerutti e Nir Oren.</p>
        <h2>Slides</h2>
        <p><a href="https://www.slideshare.net/fcerutti/introduction-to-formal-argumentation-theory" target="_blank" rel="noreferrer">Introduction to Formal Argumentation Theory</a></p>
        <h2>Syllabus</h2>
        <ol>
          <li>Abstract argumentation
            <ul>
              <li>Il framework di Dung.</li>
              <li>Labellings.</li>
              <li>Extended frameworks.</li>
            </ul>
          </li>
          <li>Structured argumentation
            <ul>
              <li>Famiglia ASPIC di logiche.</li>
              <li>Argument schemes.</li>
            </ul>
          </li>
          <li>Dialogue
            <ul>
              <li>Dialogue games.</li>
              <li>Proof dialogues.</li>
            </ul>
          </li>
          <li>MAS and argumentation
            <ul>
              <li>Decision making.</li>
              <li>Trust e norms.</li>
            </ul>
          </li>
          <li>Applications
            <ul>
              <li>Explanation e interazione con gli esseri umani.</li>
              <li>CISpaces.</li>
            </ul>
          </li>
        </ol>
      `,
    },
    {
      translationKey: 'course-arg-reasoning',
      locale: 'it',
      pathSlug: 'argomentazione-astratta-e-interfacce-al-ragionamento',
      title: 'Abstract Argumentation and Interfaces to Argumentative Reasoning',
      summary: 'Corso con sei registrazioni su semantiche, algoritmi e interfacce per l\'argumentative reasoning.',
      seo: {
        title: 'Abstract Argumentation and Interfaces | Didattica',
        description: 'Corso di Federico Cerutti su abstract argumentation, semantics e interfacce al reasoning.',
      },
      itemType: 'phd-course',
      typeLabel: 'Corso di dottorato',
      dateLabel: '8-12 settembre 2016',
      people: ['Federico Cerutti'],
      location: 'Potsdam, Germania, Campus Griebnitzsee',
      tags: ['Abstract argumentation', 'Reasoning', 'Semantics', 'Video lectures'],
      sourceUrl: 'https://federico-cerutti.unibs.it/courses/2016-abstractargumentation/',
      body: `
        <p><strong>Quando:</strong> da giovedi' 8 settembre 2016 a lunedi' 12 settembre 2016.</p>
        <p><strong>Dove:</strong> Potsdam, Germania, Campus Griebnitzsee.</p>
        <p><strong>Docente:</strong> Federico Cerutti.</p>
        <h2>Registrazioni</h2>
        <h3>Introduzione e motivazione del corso</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/cLtwUCYp7Ok" title="Course introduction and motivation" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Abstract Argumentation Semantics - Part 1</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Vl5_QMbOgQI" title="Abstract Argumentation Semantics Part 1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Abstract Argumentation Semantics - Part 2</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/HLocTLF7-5w" title="Abstract Argumentation Semantics Part 2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Abstract Argumentation Semantics - Advanced Topics</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Ky24tzt4GmY" title="Abstract Argumentation Semantics Advanced Topics" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Algorithms, Techniques and Implementations</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/YQL2YPDMbrY" title="Algorithms, Techniques and Implementations" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Humans and Argumentation</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/57GZgqOyhNc" title="Humans and Argumentation" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `,
    },
  ],
  en: [
    {
      translationKey: 'tutorial-erl',
      locale: 'en',
      pathSlug: 'evidential-reasoning-learning',
      title: 'Evidential Reasoning and Learning',
      summary: 'IJCAI 2022 tutorial on epistemic and aleatory uncertainty, probabilistic circuits, and evidential learning.',
      seo: {
        title: 'Evidential Reasoning and Learning | Teaching',
        description: 'IJCAI 2022 tutorial by Federico Cerutti and Lance M. Kaplan on evidential reasoning and learning.',
      },
      itemType: 'tutorial',
      typeLabel: 'Research tutorial',
      dateLabel: '24 July 2022, 15:30',
      people: ['Federico Cerutti', 'Lance M. Kaplan'],
      location: 'Vienna, Austria, Messe Wien Exhibition and Congress Center, Lehar 1',
      tags: ['IJCAI 2022', 'Uncertainty', 'Bayesian reasoning', 'Probabilistic circuits'],
      sourceUrl: 'https://federico-cerutti.unibs.it/tutorials/2022-ijcai-erl/',
      body: `
        <p><strong>When:</strong> Sun, July 24 2022, 1530h.</p>
        <p><strong>Where:</strong> Vienna, Austria, Messe Wien Exhibition and Congress Center, Lehar 1.</p>
        <p><strong>Who:</strong> Federico Cerutti and Lance M. Kaplan.</p>
        <p><a href="/slides/IJCAI22-ERL.pdf" target="_blank" rel="noreferrer">Slides</a></p>
        <p>To cite the content of this tutorial, please refer to: Federico Cerutti, Lance Kaplan, and Murat Sensoy, "Evidential Reasoning and Learning: a Survey", IJCAI 2022.</p>
        <h2>Short Description of the Tutorial</h2>
        <p>When collaborating with an AI system, we need to assess when to trust its recommendations. Suppose we mistakenly trust it in regions where it is likely to err. In that case, catastrophic failures may occur, hence the need for Bayesian approaches for reasoning and learning to determine the confidence, or epistemic uncertainty, in the probabilities of the queried outcome. Pure Bayesian methods, however, suffer from high computational costs, so the tutorial introduces efficient approximations based on updating hypotheses when further evidence is collected.</p>
        <p>The tutorial gives PhD students and early-stage researchers a gentle introduction to evidential reasoning and learning, surveying current research outcomes and the open questions that remain unresolved.</p>
        <h2>Description of the Tutorial</h2>
        <p>The session starts by distinguishing between two major sources of uncertainty: aleatory uncertainty, tied to inherent randomness in a process, and epistemic uncertainty, tied to the model user's lack of knowledge and therefore reducible with further data. This distinction is then used to frame reasoning and learning problems where both kinds of uncertainty matter.</p>
        <p>The main technical focus is on uncertain probabilities represented by beta or Dirichlet distributions. Unlike surveys that only cover epistemic uncertainty in deep learning, this tutorial addresses reasoning in the presence of uncertainty as well as learning from complete and partial data. It uses probabilistic circuits as a unifying framework, discusses how to quantify uncertainty over their parameters, and closes by examining how uncertain probabilities can be elicited from experts or learned from raw data.</p>
        <h2>Detailed Outline</h2>
        <h3>A primer in Bayesian Statistics</h3>
        <ul>
          <li>Fundamentals of statistics and Bayes.</li>
          <li>Beta and Dirichlet distributions as uncertain probabilities.</li>
        </ul>
        <h3>Evidential Reasoning</h3>
        <ul>
          <li>From logic to probabilistic circuits.</li>
          <li>Probabilistic circuits as a unifying method for probabilistic reasoning.</li>
          <li>Probabilistic circuits with uncertain probabilities.</li>
        </ul>
        <h3>Evidential Parameter Learning</h3>
        <ul>
          <li>Learning with complete observations.</li>
          <li>Learning with partial observations: preliminary proposals and discussions.</li>
        </ul>
        <h3>Ascertain Evidence from the Real World</h3>
        <ul>
          <li>Intelligence analysis and uncertainty.</li>
          <li>Evidential Deep Learning.</li>
          <li>Alternative proposals.</li>
        </ul>
        <h3>Summary and conclusion</h3>
      `,
    },
    {
      translationKey: 'tutorial-argml',
      locale: 'en',
      pathSlug: 'argumentation-machine-learning',
      title: 'Argumentation and Machine Learning: When the Whole is Greater than the Sum of its Parts',
      summary: 'IJCAI 2019 tutorial on the mutual reinforcement between argumentation technology and machine learning.',
      seo: {
        title: 'Argumentation and Machine Learning | Teaching',
        description: 'IJCAI 2019 tutorial by Federico Cerutti on argumentation technology and machine learning.',
      },
      itemType: 'tutorial',
      typeLabel: 'Research tutorial',
      dateLabel: '12 August 2019, morning session',
      people: ['Federico Cerutti'],
      location: 'Macao, China, The Venetian Macao Resort Hotel, Naples 2703-2704',
      tags: ['IJCAI 2019', 'Argumentation', 'Machine learning', 'Explainable AI'],
      sourceUrl: 'https://federico-cerutti.unibs.it/tutorials/2019-ijcai-argml/',
      body: `
        <p><strong>When:</strong> Mon, August 12 2019, morning session.</p>
        <p><strong>Where:</strong> Macao, China, The Venetian Macao Resort Hotel, Naples 2703-2704.</p>
        <p><strong>Who:</strong> Federico Cerutti.</p>
        <h2>Recording</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/k2_6Dtsa8MI" title="Argumentation and Machine Learning" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h2>Short Description of the Tutorial</h2>
        <p>Argumentation technology is a rich interdisciplinary area of research that, in the last two decades, has emerged as one of the most promising paradigms for commonsense reasoning and conflict resolution in a great variety of domains, to the point that it is used in commercial research projects such as IBM Debater.</p>
        <p>In this tutorial PhD students, early-stage researchers, and machine learning experts are introduced to argumentation technology with concrete practical examples, state-of-the-art argumentation approaches that leverage machine learning, and state-of-the-art machine learning approaches that leverage argumentation technology.</p>
        <p>Prior knowledge of argumentation theory is not required.</p>
        <h2>Description</h2>
        <p>The tutorial first explores the elements underpinning most approaches in argumentation theory and highlights the connections among epistemology, law, and complexity theory. It then reviews research-grade prototypes that apply argumentation to real problems, extending the scope of applications from legal reasoning to sense-making in intelligence analysis.</p>
        <p>The second part discusses how machine learning can help with knowledge acquisition and with identifying the most suitable algorithms for argumentative reasoning. This includes argument mining, which sits at the intersection of argumentation and natural language processing, as well as investigations into the use of machine learning techniques to improve the performance of solvers for computing semantics extensions of argumentation frameworks.</p>
        <p>The final part reviews current approaches that embed argumentation in their learning architecture, sometimes as a regulariser and often as a support for explainability and algorithmic accountability. The tutorial is designed to leave attendees with a comprehensive understanding of both the technological state of the art in argumentation and the synergies already emerging with machine learning.</p>
        <h2>Slides</h2>
        <p><a href="https://www.slideshare.net/fcerutti/argumentation-and-machine-learning-when-the-whole-is-greater-than-the-sum-of-its-parts-162950320" target="_blank" rel="noreferrer">Slides</a></p>
      `,
    },
    {
      translationKey: 'tutorial-theory-practice',
      locale: 'en',
      pathSlug: 'argumentation-theory-practice',
      title: 'Argumentation in Artificial Intelligence: From Theory to Practice',
      summary: 'IJCAI 2017 tutorial designed to move from conceptual foundations to usable tools for AI researchers.',
      seo: {
        title: 'Argumentation in AI: From Theory to Practice | Teaching',
        description: 'IJCAI 2017 tutorial by Federico Cerutti and Mauro Vallati on argumentation in AI.',
      },
      itemType: 'tutorial',
      typeLabel: 'Research tutorial',
      dateLabel: '21 August 2017, morning session',
      people: ['Federico Cerutti', 'Mauro Vallati'],
      location: 'Melbourne, Australia, MCEC (Melbourne Convention and Exhibition Center), MCEC 210',
      tags: ['IJCAI 2017', 'Argumentation', 'Tools', 'AI methods'],
      sourceUrl: 'https://federico-cerutti.unibs.it/tutorials/2017-ijcai-theorypractice/',
      body: `
        <p><strong>When:</strong> Mon, August 21 2017, morning session.</p>
        <p><strong>Where:</strong> Melbourne, Australia, MCEC (Melbourne Convention and Exhibition Center), MCEC 210.</p>
        <p><strong>Who:</strong> Federico Cerutti and Mauro Vallati.</p>
        <h2>Short Description of the Tutorial</h2>
        <p>Argumentation technology is a rich interdisciplinary area of research that, in the last two decades, has emerged as one of the most promising paradigms for commonsense reasoning and conflict resolution in a great variety of domains.</p>
        <p>Unlike the 2015 tutorial, which was meant to provide an extensive theoretical description of ongoing research, this tutorial aims to equip PhD students, early-stage researchers, and experts from different AI areas with a clear understanding of argumentation in AI and with a set of tools they can start using to advance the field.</p>
        <h2>Slides and technical handouts</h2>
        <p><a href="https://www.slideshare.net/fcerutti/argumentation-in-artificial-intelligence-from-theory-to-practice" target="_blank" rel="noreferrer">First part</a></p>
        <p><a href="https://www.slideshare.net/MauroVallati/argumentation-in-artificial-intelligence-from-theory-to-practice-practice" target="_blank" rel="noreferrer">Second part</a></p>
        <p><a href="https://www.slideshare.net/fcerutti/handout-argumentation-in-artificial-intelligence-from-theory-to-practice" target="_blank" rel="noreferrer">Technical handouts</a></p>
      `,
    },
    {
      translationKey: 'tutorial-dung-20',
      locale: 'en',
      pathSlug: 'argumentation-20-years-after-dung',
      title: 'Argumentation in Artificial Intelligence: 20 Years after Dung\'s Work',
      summary: 'IJCAI 2015 tutorial revisiting two decades of research on argumentation in AI.',
      seo: {
        title: '20 Years after Dung | Teaching',
        description: 'IJCAI 2015 tutorial by Federico Cerutti on twenty years of argumentation in AI after Dung.',
      },
      itemType: 'tutorial',
      typeLabel: 'Research tutorial',
      dateLabel: '26 July 2015, full day',
      people: ['Federico Cerutti'],
      location: 'Buenos Aires, Argentina, New Building of Facultad de Ciencias Economicas, Room 436',
      tags: ['IJCAI 2015', 'Argumentation', 'Dung', 'Reasoning systems'],
      sourceUrl: 'https://federico-cerutti.unibs.it/tutorials/2015-ijcai-arg/',
      body: `
        <p><strong>When:</strong> Sun, July 26 2015, full day.</p>
        <p><strong>Where:</strong> Buenos Aires, Argentina, New Building of Facultad de Ciencias Economicas, Room 436.</p>
        <p><strong>Who:</strong> Federico Cerutti.</p>
        <h2>Short Description of the Tutorial</h2>
        <p>Argumentation technology is a rich interdisciplinary area of research that, in the last twenty years, has emerged as one of the most promising paradigms for commonsense reasoning and conflict resolution in a great variety of domains. This tutorial provides an extensive description of the research in this field, its well-established results, its implementations and applications, and the open questions still under discussion.</p>
        <h2>Description</h2>
        <p>The tutorial explores the formal approaches that have been developed over roughly twenty years and are now adopted in real-world applications. To give attendees a complete view, it also touches on other areas of argumentation theory, such as dialogues and links with the social sciences, while keeping the technical focus on the state of the art in argumentation for AI research.</p>
        <p>It reviews the elements underpinning most approaches in argumentation theory, from classical-logic-based to informal-logic-based approaches, and uses that survey to make the links with epistemology, law, and complexity theory explicit. On the technological side, it discusses research prototypes that extend applications from legal reasoning to intelligence analysis, surveys the state of the art in algorithms for computing semantics extensions of argumentation frameworks, and includes a discussion of the first ICCMA competition. The tutorial is designed to provide a deep and complete understanding of argumentation in AI and of its practical capabilities.</p>
        <h2>Slides and technical handouts</h2>
        <p><a href="https://www.slideshare.net/fcerutti/argumentation-in-artificial-intelligence" target="_blank" rel="noreferrer">Slides</a></p>
        <p><a href="https://www.slideshare.net/fcerutti/argumentation-in-artificial-intelligence-20-years-after-dungs-work-right-margin-for-notes" target="_blank" rel="noreferrer">Technical handouts</a></p>
      `,
    },
    {
      translationKey: 'course-ai4ctia',
      locale: 'en',
      pathSlug: 'ai-cyber-threat-intelligence-analysis',
      title: 'Cyber Threat Intelligence Analysis and how Artificial Intelligence can Support It',
      summary: '2022 PhD course on CTI, intrusion analysis, causality, and AI support for intelligence production.',
      seo: {
        title: 'Cyber Threat Intelligence Analysis | Teaching',
        description: 'PhD course by Federico Cerutti on cyber threat intelligence analysis and AI support.',
      },
      itemType: 'phd-course',
      typeLabel: 'PhD course',
      dateLabel: '9-20 May 2022',
      people: ['Federico Cerutti'],
      location: 'Brescia, Italy, Department of Information Engineering, University of Brescia, Room 45',
      tags: ['Cyber threat intelligence', 'PhD course', 'Causality', 'Intelligence analysis'],
      sourceUrl: 'https://federico-cerutti.unibs.it/courses/2022-ctia/',
      body: `
        <p><strong>When:</strong> Mon, May 9th 2022-Fri, May 20th 2022.</p>
        <ul>
          <li>09 May 2022: 0900h-1300h</li>
          <li>12 May 2022: 1300h-1600h</li>
          <li>13 May 2022: 1300h-1600h</li>
          <li>16 May 2022: 0900h-1300h</li>
          <li>19 May 2022: 1300h-1600h</li>
          <li>20 May 2022: 1300h-1600h</li>
        </ul>
        <p><strong>Where:</strong> Brescia, Italy, Department of Information Engineering, University of Brescia, Room 45.</p>
        <p><strong>Who:</strong> Federico Cerutti.</p>
        <h2>Syllabus</h2>
        <ol>
          <li>Intelligence Analysis and Cyber Threat Intelligence (CTI)
            <ul>
              <li>Understanding Intelligence.</li>
              <li>Understanding Cyber Threat Intelligence.</li>
              <li>Strategical thinking and direction.</li>
              <li>OWL and ontologies of CTIA.</li>
            </ul>
          </li>
          <li>Fundamentals of Intrusion Analysis
            <ul>
              <li>Primary Collection Source: Intrusion Analysis.</li>
              <li>Kill Chain Courses of Action.</li>
              <li>Handling Multiple Kill Chains.</li>
              <li>The role of causality in the Kill Chain.</li>
            </ul>
          </li>
          <li>Collection Sources
            <ul>
              <li>Malware.</li>
              <li>Network traces.</li>
              <li>Open Source Intelligence.</li>
              <li>Machine learning for intelligence analysis.</li>
            </ul>
          </li>
          <li>Analysis and Production of Intelligence
            <ul>
              <li>Logical Fallacies and Cognitive Biases.</li>
              <li>Exploring Hypotheses.</li>
              <li>Different Types of Analysis.</li>
              <li>Argumentation theory and intelligence analysis.</li>
            </ul>
          </li>
          <li>Dissemination and Attribution
            <ul>
              <li>Tactical dissemination.</li>
              <li>Operational dissemination.</li>
              <li>Strategic dissemination.</li>
              <li>Natural language generation for intelligence analysis.</li>
            </ul>
          </li>
        </ol>
      `,
    },
    {
      translationKey: 'course-arg-theory',
      locale: 'en',
      pathSlug: 'introduction-formal-argumentation-theory',
      title: 'Introduction to Formal Argumentation Theory',
      summary: 'Course on abstract and structured argumentation, dialogue, multi-agent systems, and applications.',
      seo: {
        title: 'Introduction to Formal Argumentation Theory | Teaching',
        description: 'PhD course by Federico Cerutti and Nir Oren on formal argumentation theory.',
      },
      itemType: 'phd-course',
      typeLabel: 'PhD course',
      dateLabel: '12 June 2018',
      people: ['Federico Cerutti', 'Nir Oren'],
      location: 'Maastricht, The Netherlands, Department of Data-Science and Knowledge Engineering',
      tags: ['Formal argumentation', 'PhD course', 'Dialogue', 'Applications'],
      sourceUrl: 'https://federico-cerutti.unibs.it/courses/2018-introarg/',
      body: `
        <p><strong>When:</strong> 12 June 2018.</p>
        <p><strong>Where:</strong> Maastricht, The Netherlands, Department of Data-Science and Knowledge Engineering.</p>
        <p><strong>Who:</strong> Federico Cerutti and Nir Oren.</p>
        <h2>Slides</h2>
        <p><a href="https://www.slideshare.net/fcerutti/introduction-to-formal-argumentation-theory" target="_blank" rel="noreferrer">Introduction to Formal Argumentation Theory</a></p>
        <h2>Syllabus</h2>
        <ol>
          <li>Abstract argumentation
            <ul>
              <li>Dung's framework.</li>
              <li>Labellings.</li>
              <li>Extended frameworks.</li>
            </ul>
          </li>
          <li>Structured argumentation
            <ul>
              <li>ASPIC family of logics.</li>
              <li>Argument schemes.</li>
            </ul>
          </li>
          <li>Dialogue
            <ul>
              <li>Dialogue games.</li>
              <li>Proof dialogues.</li>
            </ul>
          </li>
          <li>MAS and argumentation
            <ul>
              <li>Decision making.</li>
              <li>Trust and norms.</li>
            </ul>
          </li>
          <li>Applications
            <ul>
              <li>Explanation and dealing with humans.</li>
              <li>CISpaces.</li>
            </ul>
          </li>
        </ol>
      `,
    },
    {
      translationKey: 'course-arg-reasoning',
      locale: 'en',
      pathSlug: 'abstract-argumentation-interfaces-reasoning',
      title: 'Abstract Argumentation and Interfaces to Argumentative Reasoning',
      summary: 'Course with six recorded lectures on semantics, algorithms, implementations, and human-facing interfaces.',
      seo: {
        title: 'Abstract Argumentation and Interfaces | Teaching',
        description: 'Course by Federico Cerutti on abstract argumentation, semantics, and interfaces to reasoning.',
      },
      itemType: 'phd-course',
      typeLabel: 'PhD course',
      dateLabel: '8-12 September 2016',
      people: ['Federico Cerutti'],
      location: 'Potsdam, Germany, Campus Griebnitzsee',
      tags: ['Abstract argumentation', 'Reasoning', 'Semantics', 'Video lectures'],
      sourceUrl: 'https://federico-cerutti.unibs.it/courses/2016-abstractargumentation/',
      body: `
        <p><strong>When:</strong> Thurs, Sept 8th 2016-Mon, Sept 12th 2016.</p>
        <p><strong>Where:</strong> Potsdam, Germany, Campus Griebnitzsee.</p>
        <p><strong>Who:</strong> Federico Cerutti.</p>
        <h2>Recordings</h2>
        <h3>Course introduction and motivation</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/cLtwUCYp7Ok" title="Course introduction and motivation" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Abstract Argumentation Semantics Part 1</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Vl5_QMbOgQI" title="Abstract Argumentation Semantics Part 1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Abstract Argumentation Semantics Part 2</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/HLocTLF7-5w" title="Abstract Argumentation Semantics Part 2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Abstract Argumentation Semantics Advanced Topics</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Ky24tzt4GmY" title="Abstract Argumentation Semantics Advanced Topics" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Algorithms, Techniques and Implementations</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/YQL2YPDMbrY" title="Algorithms, Techniques and Implementations" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>Humans and Argumentation</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/57GZgqOyhNc" title="Humans and Argumentation" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `,
    },
  ],
};

const teachingByLocale: Record<Locale, TeachingSection[]> = {
  it: [
    {
      translationKey: 'current-teaching',
      title: 'Insegnamenti correnti',
      intro: '',
      items: [
        { title: 'Digital Transformation', summary: 'Corso nell’ambito della Laurea Magistrale in Computer Engineering presso l’Università degli Studi di Brescia.' },
        { title: 'Computer Security', summary: 'Corso con attenzione ai rischi e alle opportunità delle nuove tecnologie nel contesto della sicurezza informatica.' },
      ],
    },
    {
      translationKey: 'tutorials',
      title: 'Tutorial di ricerca',
      intro: '',
      items: [
        { title: 'ERL', when: '24 luglio 2022', href: '/teaching/ragionamento-evidenziale-e-apprendimento/', summary: 'Tutorial su evidential reasoning and learning per PhD student e early-stage researchers.' },
        { title: 'ArgML', when: '12 agosto 2019', href: '/teaching/argomentazione-e-machine-learning/', summary: 'Tutorial sulle connessioni tra argumentation technology e machine learning.' },
        { title: 'ArgTheoryPractice', when: '21 agosto 2017', href: '/teaching/argomentazione-dalla-teoria-alla-pratica/', summary: 'Tutorial per introdurre la teoria dell’argomentazione e i suoi strumenti operativi.' },
        { title: '20 Years after Dung', when: '26 luglio 2015', href: '/teaching/argomentazione-20-anni-dopo-dung/', summary: 'Tutorial storico sull’evoluzione dell’argumentation technology in AI.' },
      ],
    },
    {
      translationKey: 'phd-courses',
      title: 'Corsi di dottorato',
      intro: '',
      items: [
        { title: 'AI4CTIA', when: '9 maggio 2022', href: '/teaching/ai-per-l-analisi-di-cyber-threat-intelligence/', summary: 'Corso su AI for Cyber Threat Intelligence Analysis.' },
        { title: 'ArgTheory', when: '12 giugno 2018', href: '/teaching/introduzione-alla-teoria-formale-dell-argomentazione/', summary: 'Introduzione alla formal argumentation theory.' },
        { title: 'ArgReasoning', when: '8 settembre 2016', href: '/teaching/argomentazione-astratta-e-interfacce-al-ragionamento/', summary: 'Corso su abstract argumentation, semantics e reasoning problems.' },
      ],
    },
  ],
  en: [
    {
      translationKey: 'current-teaching',
      title: 'Current teaching',
      intro: '',
      items: [
        { title: 'Digital Transformation', summary: 'Course within the MSc in Computer Engineering at the University of Brescia.' },
        { title: 'Computer Security', summary: 'Course focused on the risks and opportunities of new technologies in security contexts.' },
      ],
    },
    {
      translationKey: 'tutorials',
      title: 'Research tutorials',
      intro: '',
      items: [
        { title: 'ERL', when: '24 July 2022', href: '/en/teaching/evidential-reasoning-learning/', summary: 'Tutorial on evidential reasoning and learning for PhD students and early-stage researchers.' },
        { title: 'ArgML', when: '12 August 2019', href: '/en/teaching/argumentation-machine-learning/', summary: 'Tutorial on the connection between argumentation technology and machine learning.' },
        { title: 'ArgTheoryPractice', when: '21 August 2017', href: '/en/teaching/argumentation-theory-practice/', summary: 'Tutorial introducing argumentation theory and practical tools.' },
        { title: '20 Years after Dung', when: '26 July 2015', href: '/en/teaching/argumentation-20-years-after-dung/', summary: 'Historical tutorial on the evolution of argumentation technology in AI.' },
      ],
    },
    {
      translationKey: 'phd-courses',
      title: 'PhD courses',
      intro: '',
      items: [
        { title: 'AI4CTIA', when: '9 May 2022', href: '/en/teaching/ai-cyber-threat-intelligence-analysis/', summary: 'Course on AI for Cyber Threat Intelligence Analysis.' },
        { title: 'ArgTheory', when: '12 June 2018', href: '/en/teaching/introduction-formal-argumentation-theory/', summary: 'Introduction to formal argumentation theory.' },
        { title: 'ArgReasoning', when: '8 September 2016', href: '/en/teaching/abstract-argumentation-interfaces-reasoning/', summary: 'Course on abstract argumentation, semantics, and reasoning problems.' },
      ],
    },
  ],
};

const contactByLocale: Record<Locale, ContactSection> = {
  it: {
    locale: 'it',
    seo: { title: 'Contatti | Federico Cerutti', description: 'Contatti, affiliazioni e collegamenti professionali di Federico Cerutti.' },
    title: 'Contatti e riferimenti',
    intro: 'Per collaborazioni scientifiche, inviti a seminari, attività didattiche o richieste di tesi.',
    items: [
      { label: 'Email', value: 'federico.cerutti@unibs.it', href: 'mailto:federico.cerutti@unibs.it' },
      { label: 'Dipartimento', value: 'Dipartimento di Ingegneria dell’Informazione, Università degli Studi di Brescia', href: 'https://www.unibs.it/it/ateneo/organizzazione/dipartimenti/ingegneria-dellinformazione-dii' },
      { label: 'Google Scholar', value: 'Profilo pubblicazioni', href: 'https://scholar.google.com/citations?user=v0mFZhoAAAAJ&hl=en' },
      { label: 'DBLP', value: 'Profilo DBLP', href: 'https://dblp.org/pid/97/18.html' },
      { label: 'LinkedIn', value: 'linkedin.com/in/federicocerutti', href: 'https://www.linkedin.com/in/federicocerutti/' },
    ],
  },
  en: {
    locale: 'en',
    seo: { title: 'Contact | Federico Cerutti', description: 'Contact details, affiliations, and professional links for Federico Cerutti.' },
    title: 'Contact and affiliations',
    intro: 'For research collaborations, seminar invitations, teaching activities, or thesis enquiries.',
    items: [
      { label: 'Email', value: 'federico.cerutti@unibs.it', href: 'mailto:federico.cerutti@unibs.it' },
      { label: 'Department', value: 'Department of Information Engineering, University of Brescia', href: 'https://www.unibs.it/it/ateneo/organizzazione/dipartimenti/ingegneria-dellinformazione-dii' },
      { label: 'Google Scholar', value: 'Publication profile', href: 'https://scholar.google.com/citations?user=v0mFZhoAAAAJ&hl=en' },
      { label: 'DBLP', value: 'DBLP profile', href: 'https://dblp.org/pid/97/18.html' },
      { label: 'LinkedIn', value: 'linkedin.com/in/federicocerutti', href: 'https://www.linkedin.com/in/federicocerutti/' },
    ],
  },
};

export function getProfile(locale: Locale) {
  return profileByLocale[locale];
}

export function getTeachingSections(locale: Locale) {
  return teachingByLocale[locale];
}

export function getContactSection(locale: Locale) {
  return contactByLocale[locale];
}

export function getLocalizedCollection<K extends keyof EntryMap>(collection: K, locale: Locale): EntryMap[K][] {
  if (collection === 'papers') return papers[locale] as EntryMap[K][];
  if (collection === 'projects') return projects[locale] as EntryMap[K][];
  return teachingPages[locale] as EntryMap[K][];
}

export function getTranslation<K extends keyof EntryMap>(collection: K, translationKey: string, locale: Locale) {
  return getLocalizedCollection(collection, locale).find((entry) => entry.translationKey === translationKey);
}
