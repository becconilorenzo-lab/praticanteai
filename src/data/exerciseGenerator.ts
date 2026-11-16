import type { Exercise, Difficulty, SolutionEntry } from '../types';

// ============================================================
// Dynamic Accounting Exercise Generator
// 50 structural templates compliant with Italian OIC standards
// (Codice Civile art. 2424 / 2425; IVA 22%; Istituto Tecnico Commerciale curriculum)
// ============================================================

export interface GeneratorContext {
  company: string;
  supplier: string;
  customer: string;
  date: string;
  amount: number;
  iva: number;
  qty: number;
  rate: number;
  months: number;
}

const COMPANIES = [
  'Alfa S.r.l.', 'Beta Industrie S.p.A.', 'Gamma Trading S.r.l.',
  'Delta Servizi S.n.c.', 'Epsilon Costruzioni S.r.l.', 'Zeta Logistica S.p.A.',
  'Eta Manifatture S.r.l.', 'Theta Distribuzione S.a.s.', 'Iota Alimentari S.r.l.',
  'Kappa Tecnologie S.p.A.', 'Lambda Mobili S.r.l.', 'Mu Automobili S.p.A.',
  'Ni Soluzioni S.r.l.', 'Xi Edizioni S.a.s.', 'Omnicron Farmaceutici S.p.A.',
  'Pi Calzature S.r.l.', 'Rho Metallurgica S.p.A.', 'Sigma Tessile S.r.l.',
  'Tau Energia S.p.A.', 'Upsilon Trasporti S.r.l.',
];

const SUPPLIERS = [
  'TecnoForniture S.r.l.', 'MateriePrime S.p.A.', 'UfficioSmart S.r.l.',
  'LogiTrans S.p.A.', 'EnergiaVerde S.r.l.', 'TecnoService S.a.s.',
  'CasaForniture S.r.l.', 'MetalWork S.p.A.', 'DatiSystem S.r.l.',
  'AssicuraPro S.p.A.',
];

const CUSTOMERS = [
  'Rossi Costruzioni S.r.l.', 'Bianchi & Figli S.n.c.', 'Verdi Impianti S.p.A.',
  'Neri Distribuzione S.r.l.', 'Galli Edili S.a.s.', 'Conti Logistica S.r.l.',
  'Moretti Auto S.p.A.', 'Ferri Trade S.r.l.', 'Lombardi Arreda S.r.l.',
  'Marini Service S.p.A.',
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

// Seeded RNG (mulberry32) for reproducible randomness per exercise id
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function fmtDate(rng: () => number): string {
  const day = 1 + Math.floor(rng() * 28);
  const month = 1 + Math.floor(rng() * 12);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/2026`;
}

function roundTo(n: number, step: number): number {
  return Math.round(n / step) * step;
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat('it-IT', { minimumFractionDigits: 0 }).format(n);
}

// ============================================================
// Template definition
// ============================================================

interface Template {
  id: string;
  difficulty: Difficulty;
  xp: number;
  // Returns: title, scenario, availableAccounts, solution, hints, explanation
  build: (ctx: GeneratorContext) => {
    title: string;
    scenario: string;
    availableAccounts: string[];
    solution: { dare: SolutionEntry[]; avere: SolutionEntry[] };
    hints: Record<string, string>;
    explanation: string;
  };
}

const IVA_RATE = 0.22;

// ============================================================
// 50 TEMPLATES
// ============================================================

const TEMPLATES: Template[] = [
  // --- BASE (20) ---
  {
    id: 'tpl_acq_merci_contanti',
    difficulty: 'base',
    xp: 50,
    build: (c) => ({
      title: `Acquisto merci in contanti (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} acquista merci per €${fmtEur(c.amount)} da ${c.supplier}, pagando subito in contanti. Registra l'operazione in partita doppia.`,
      availableAccounts: ['merci_acquisti', 'cassa', 'banca', 'merci_vendite', 'crediti_clienti'],
      solution: { dare: [{ accountId: 'merci_acquisti', amount: c.amount }], avere: [{ accountId: 'cassa', amount: c.amount }] },
      hints: {
        merci_acquisti: 'Le merci acquistate per la rivendita sono un costo economico. Un costo che aumenta → DARE.',
        cassa: 'Paghi in contanti: Cassa diminuisce. Un’attività che diminuisce → AVERE.',
        banca: 'Hai pagato in contanti, non con bonifico. La banca non è coinvolta.',
        merci_vendite: 'Stai acquistando, non vendendo. Questo conto registra le vendite.',
        crediti_clienti: 'Nessun credito verso clienti in questa operazione.',
      },
      explanation: `Acquistando merci in contanti, aumenti Merci c/acquisti (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_acq_merci_bonifico',
    difficulty: 'base',
    xp: 50,
    build: (c) => ({
      title: `Acquisto merci con bonifico (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} acquista merci per €${fmtEur(c.amount)} da ${c.supplier}, pagando subito tramite bonifico bancario. Registra l'operazione.`,
      availableAccounts: ['merci_acquisti', 'banca', 'cassa', 'merci_vendite', 'debiti_fornitori'],
      solution: { dare: [{ accountId: 'merci_acquisti', amount: c.amount }], avere: [{ accountId: 'banca', amount: c.amount }] },
      hints: {
        merci_acquisti: 'Le merci acquistate sono un costo. Un costo che aumenta → DARE.',
        banca: 'Paghi con bonifico: Banca diminuisce. Un’attività che diminuisce → AVERE.',
        cassa: 'Hai pagato con bonifico, non in contanti.',
        merci_vendite: 'Stai acquistando, non vendendo.',
        debiti_fornitori: 'Hai pagato subito, non nasce alcun debito.',
      },
      explanation: `Acquistando merci con bonifico, aumenti Merci c/acquisti (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_acq_merci_credito',
    difficulty: 'base',
    xp: 60,
    build: (c) => ({
      title: `Acquisto merci a credito (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} acquista merci per €${fmtEur(c.amount)} da ${c.supplier} con pagamento a 30 giorni. Registra la fattura oggi.`,
      availableAccounts: ['merci_acquisti', 'debiti_fornitori', 'banca', 'cassa', 'crediti_clienti'],
      solution: { dare: [{ accountId: 'merci_acquisti', amount: c.amount }], avere: [{ accountId: 'debiti_fornitori', amount: c.amount }] },
      hints: {
        merci_acquisti: 'Le merci acquistate sono un costo che aumenta → DARE.',
        debiti_fornitori: 'Non hai ancora pagato: nasce un debito verso il fornitore. Un passivo che aumenta → AVERE.',
        banca: 'Non hai pagato ora, il pagamento è a 30 giorni.',
        cassa: 'Non hai pagato in contanti.',
        crediti_clienti: 'I crediti riguardano le vendite, non gli acquisti.',
      },
      explanation: `Acquistando merci a credito, aumenti Merci c/acquisti (Dare) e aumenti Debiti v/fornitori (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_ven_merci_contanti',
    difficulty: 'base',
    xp: 50,
    build: (c) => ({
      title: `Vendita merci in contanti (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} vende merci per €${fmtEur(c.amount)} a ${c.customer}, incassando subito in contanti. Registra l'operazione.`,
      availableAccounts: ['cassa', 'merci_vendite', 'banca', 'merci_acquisti', 'debiti_fornitori'],
      solution: { dare: [{ accountId: 'cassa', amount: c.amount }], avere: [{ accountId: 'merci_vendite', amount: c.amount }] },
      hints: {
        cassa: 'Ricevi contanti: Cassa aumenta. Un’attività che aumenta → DARE.',
        merci_vendite: 'La vendita genera un ricavo. Un ricavo ha saldo normale in Avere → AVERE.',
        banca: 'Hai incassato in contanti, non tramite banca.',
        merci_acquisti: 'Questo conto registra gli acquisti, non le vendite.',
        debiti_fornitori: 'Nessun debito verso fornitori in questa operazione.',
      },
      explanation: `Vendendo merci in contanti, aumenti Cassa (Dare) e registri il ricavo Merci c/vendite (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_ven_merci_bonifico',
    difficulty: 'base',
    xp: 55,
    build: (c) => ({
      title: `Vendita merci con bonifico (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} vende merci per €${fmtEur(c.amount)} a ${c.customer}, incassando subito tramite bonifico. Registra l'operazione.`,
      availableAccounts: ['banca', 'merci_vendite', 'cassa', 'merci_acquisti', 'crediti_clienti'],
      solution: { dare: [{ accountId: 'banca', amount: c.amount }], avere: [{ accountId: 'merci_vendite', amount: c.amount }] },
      hints: {
        banca: 'Ricevi un bonifico: Banca aumenta. Un’attività che aumenta → DARE.',
        merci_vendite: 'La vendita genera un ricavo. Un ricavo ha saldo normale in Avere → AVERE.',
        cassa: 'Hai incassato con bonifico, non in contanti.',
        merci_acquisti: 'Questo conto registra gli acquisti, non le vendite.',
        crediti_clienti: 'Il cliente ha pagato subito, non nasce alcun credito.',
      },
      explanation: `Vendendo merci con bonifico, aumenti Banca c/c (Dare) e registri Merci c/vendite (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_ven_merci_credito',
    difficulty: 'base',
    xp: 60,
    build: (c) => ({
      title: `Vendita merci a credito (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} vende merci per €${fmtEur(c.amount)} a ${c.customer} con incasso a 30 giorni. Registra la fattura oggi.`,
      availableAccounts: ['crediti_clienti', 'merci_vendite', 'cassa', 'banca', 'debiti_fornitori'],
      solution: { dare: [{ accountId: 'crediti_clienti', amount: c.amount }], avere: [{ accountId: 'merci_vendite', amount: c.amount }] },
      hints: {
        crediti_clienti: 'Il cliente pagherà tra 30 giorni: nasce un credito. Un’attività che aumenta → DARE.',
        merci_vendite: 'La vendita genera un ricavo. Un ricavo ha saldo normale in Avere → AVERE.',
        cassa: 'Non hai ancora incassato. Cassa non è coinvolta ora.',
        banca: 'Non hai ancora incassato. Banca non è coinvolta ora.',
        debiti_fornitori: 'I debiti verso fornitori riguardano gli acquisti, non le vendite.',
      },
      explanation: `Vendendo merci a credito, aumenti Crediti v/clienti (Dare) e registri Merci c/vendite (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_acq_bene_strumentale_cassa',
    difficulty: 'base',
    xp: 70,
    build: (c) => ({
      title: `Acquisto bene strumentale in contanti (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} acquista un computer per €${fmtEur(c.amount)}, pagando subito in contanti. Registra l'operazione.`,
      availableAccounts: ['macchine', 'cassa', 'banca', 'merci_acquisti', 'fitti_passivi'],
      solution: { dare: [{ accountId: 'macchine', amount: c.amount }], avere: [{ accountId: 'cassa', amount: c.amount }] },
      hints: {
        macchine: 'Il computer è un bene strumentale (attività). Acquistarlo aumenta le attività → DARE.',
        cassa: 'Paghi in contanti: Cassa diminuisce. Un’attività che diminuisce → AVERE.',
        banca: 'Hai pagato in contanti, non con bonifico.',
        merci_acquisti: 'Il computer non è merce da rivendere, è un bene strumentale. Usa Macchine d’ufficio.',
        fitti_passivi: 'L’affitto non c’entra con questo acquisto.',
      },
      explanation: `Acquistando un computer in contanti, aumenti Macchine d’ufficio (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_acq_bene_strumentale_banca',
    difficulty: 'base',
    xp: 70,
    build: (c) => ({
      title: `Acquisto bene strumentale con bonifico (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} acquista un computer per €${fmtEur(c.amount)}, pagando subito tramite bonifico. Registra l'operazione.`,
      availableAccounts: ['macchine', 'banca', 'cassa', 'merci_acquisti', 'crediti_clienti'],
      solution: { dare: [{ accountId: 'macchine', amount: c.amount }], avere: [{ accountId: 'banca', amount: c.amount }] },
      hints: {
        macchine: 'Il computer è un bene strumentale. Acquistarlo aumenta le attività → DARE.',
        banca: 'Paghi con bonifico: Banca diminuisce. Un’attività che diminuisce → AVERE.',
        cassa: 'Hai pagato con bonifico, non in contanti.',
        merci_acquisti: 'Il computer non è merce da rivendere.',
        crediti_clienti: 'I crediti verso clienti non c’entrano con questo acquisto.',
      },
      explanation: `Acquistando un computer con bonifico, aumenti Macchine d’ufficio (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_pagamento_affitto_cassa',
    difficulty: 'base',
    xp: 65,
    build: (c) => ({
      title: `Pagamento affitto in contanti (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} paga in contanti l’affitto mensile dell’ufficio di €${fmtEur(c.amount)}. Registra l’operazione.`,
      availableAccounts: ['fitti_passivi', 'cassa', 'banca', 'debiti_vari', 'debiti_fornitori'],
      solution: { dare: [{ accountId: 'fitti_passivi', amount: c.amount }], avere: [{ accountId: 'cassa', amount: c.amount }] },
      hints: {
        fitti_passivi: 'L’affitto è un costo. Un costo che aumenta → DARE.',
        cassa: 'Paghi in contanti: Cassa diminuisce. Un’attività che diminuisce → AVERE.',
        banca: 'Hai pagato in contanti, non con bonifico.',
        debiti_vari: 'Hai pagato subito, non nasce alcun debito.',
        debiti_fornitori: 'I debiti v/fornitori riguardano acquisti commerciali, non l’affitto.',
      },
      explanation: `Pagando l’affitto in contanti, aumenti Fitti passivi (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_pagamento_affitto_banca',
    difficulty: 'base',
    xp: 65,
    build: (c) => ({
      title: `Pagamento affitto con bonifico (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} paga con bonifico l’affitto mensile dell’ufficio di €${fmtEur(c.amount)}. Registra l’operazione.`,
      availableAccounts: ['fitti_passivi', 'banca', 'cassa', 'debiti_vari', 'merci_acquisti'],
      solution: { dare: [{ accountId: 'fitti_passivi', amount: c.amount }], avere: [{ accountId: 'banca', amount: c.amount }] },
      hints: {
        fitti_passivi: 'L’affitto è un costo. Un costo che aumenta → DARE.',
        banca: 'Paghi con bonifico: Banca diminuisce. Un’attività che diminuisce → AVERE.',
        cassa: 'Hai pagato con bonifico, non in contanti.',
        debiti_vari: 'Hai pagato subito, non nasce alcun debito.',
        merci_acquisti: 'L’affitto non è un acquisto di merci.',
      },
      explanation: `Pagando l’affitto con bonifico, aumenti Fitti passivi (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_versamento_capitale_cassa',
    difficulty: 'base',
    xp: 80,
    build: (c) => ({
      title: `Versamento capitale in contanti (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, un socio di ${c.company} versa €${fmtEur(c.amount)} in contanti come aumento di capitale sociale. Registra l’operazione.`,
      availableAccounts: ['cassa', 'capitale', 'banca', 'crediti_clienti', 'merci_vendite'],
      solution: { dare: [{ accountId: 'cassa', amount: c.amount }], avere: [{ accountId: 'capitale', amount: c.amount }] },
      hints: {
        cassa: 'Ricevi contanti: Cassa aumenta. Un’attività che aumenta → DARE.',
        capitale: 'Il capitale sociale è patrimonio netto con saldo normale in Avere. Un aumento → AVERE.',
        banca: 'Il versamento è in contanti, non in banca.',
        crediti_clienti: 'I crediti verso clienti non c’entrano con il capitale.',
        merci_vendite: 'Non è una vendita di merci.',
      },
      explanation: `Versando capitale in contanti, aumenti Cassa (Dare) e aumenti Capitale sociale (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_versamento_capitale_banca',
    difficulty: 'base',
    xp: 80,
    build: (c) => ({
      title: `Versamento capitale con bonifico (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, un socio di ${c.company} versa €${fmtEur(c.amount)} tramite bonifico come aumento di capitale sociale. Registra l’operazione.`,
      availableAccounts: ['banca', 'capitale', 'cassa', 'crediti_clienti', 'merci_vendite'],
      solution: { dare: [{ accountId: 'banca', amount: c.amount }], avere: [{ accountId: 'capitale', amount: c.amount }] },
      hints: {
        banca: 'Ricevi un bonifico: Banca aumenta. Un’attività che aumenta → DARE.',
        capitale: 'Il capitale sociale è patrimonio netto con saldo normale in Avere. Un aumento → AVERE.',
        cassa: 'Il versamento è in banca, non in contanti.',
        crediti_clienti: 'I crediti verso clienti non c’entrano con il capitale.',
        merci_vendite: 'Non è una vendita di merci.',
      },
      explanation: `Versando capitale con bonifico, aumenti Banca c/c (Dare) e aumenti Capitale sociale (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_incasso_credito_cassa',
    difficulty: 'base',
    xp: 75,
    build: (c) => ({
      title: `Incasso credito cliente in contanti (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.customer} paga in contanti €${fmtEur(c.amount)} a ${c.company} per saldare una fattura precedente. Registra l’incasso.`,
      availableAccounts: ['cassa', 'crediti_clienti', 'banca', 'merci_vendite', 'debiti_fornitori'],
      solution: { dare: [{ accountId: 'cassa', amount: c.amount }], avere: [{ accountId: 'crediti_clienti', amount: c.amount }] },
      hints: {
        cassa: 'Ricevi contanti: Cassa aumenta. Un’attività che aumenta → DARE.',
        crediti_clienti: 'Incassi un credito precedente: il credito diminuisce. Un’attività che diminuisce → AVERE.',
        banca: 'Hai incassato in contanti, non in banca.',
        merci_vendite: 'La vendita era già registrata. Ora incassi solo il credito.',
        debiti_fornitori: 'I debiti verso fornitori non c’entrano con questo incasso.',
      },
      explanation: `Incassando un credito in contanti, aumenti Cassa (Dare) e diminuisci Crediti v/clienti (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_incasso_credito_banca',
    difficulty: 'base',
    xp: 75,
    build: (c) => ({
      title: `Incasso credito cliente con bonifico (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.customer} paga con bonifico €${fmtEur(c.amount)} a ${c.company} per saldare una fattura precedente. Registra l’incasso.`,
      availableAccounts: ['banca', 'crediti_clienti', 'cassa', 'merci_vendite', 'debiti_fornitori'],
      solution: { dare: [{ accountId: 'banca', amount: c.amount }], avere: [{ accountId: 'crediti_clienti', amount: c.amount }] },
      hints: {
        banca: 'Ricevi un bonifico: Banca aumenta. Un’attività che aumenta → DARE.',
        crediti_clienti: 'Incassi un credito precedente: il credito diminuisce. Un’attività che diminuisce → AVERE.',
        cassa: 'Hai incassato con bonifico, non in contanti.',
        merci_vendite: 'La vendita era già registrata.',
        debiti_fornitori: 'I debiti verso fornitori non c’entrano con questo incasso.',
      },
      explanation: `Incassando un credito con bonifico, aumenti Banca c/c (Dare) e diminuisci Crediti v/clienti (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_pagamento_debito_forn_cassa',
    difficulty: 'base',
    xp: 75,
    build: (c) => ({
      title: `Pagamento debito fornitore in contanti (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} paga in contanti €${fmtEur(c.amount)} a ${c.supplier} per saldare una fattura precedente. Registra il pagamento.`,
      availableAccounts: ['debiti_fornitori', 'cassa', 'banca', 'merci_acquisti', 'crediti_clienti'],
      solution: { dare: [{ accountId: 'debiti_fornitori', amount: c.amount }], avere: [{ accountId: 'cassa', amount: c.amount }] },
      hints: {
        debiti_fornitori: 'Paghi un debito precedente: il debito diminuisce. Un passivo che diminuisce → DARE.',
        cassa: 'Paghi in contanti: Cassa diminuisce. Un’attività che diminuisce → AVERE.',
        banca: 'Hai pagato in contanti, non con bonifico.',
        merci_acquisti: 'L’acquisto era già registrato. Ora paghi solo il debito.',
        crediti_clienti: 'I crediti verso clienti non c’entrano con questo pagamento.',
      },
      explanation: `Pagando un debito in contanti, diminuisci Debiti v/fornitori (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_pagamento_debito_forn_banca',
    difficulty: 'base',
    xp: 75,
    build: (c) => ({
      title: `Pagamento debito fornitore con bonifico (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} paga con bonifico €${fmtEur(c.amount)} a ${c.supplier} per saldare una fattura precedente. Registra il pagamento.`,
      availableAccounts: ['debiti_fornitori', 'banca', 'cassa', 'merci_acquisti', 'crediti_clienti'],
      solution: { dare: [{ accountId: 'debiti_fornitori', amount: c.amount }], avere: [{ accountId: 'banca', amount: c.amount }] },
      hints: {
        debiti_fornitori: 'Paghi un debito precedente: il debito diminuisce. Un passivo che diminuisce → DARE.',
        banca: 'Paghi con bonifico: Banca diminuisce. Un’attività che diminuisce → AVERE.',
        cassa: 'Hai pagato con bonifico, non in contanti.',
        merci_acquisti: 'L’acquisto era già registrato.',
        crediti_clienti: 'I crediti verso clienti non c’entrano con questo pagamento.',
      },
      explanation: `Pagando un debito con bonifico, diminuisci Debiti v/fornitori (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_prelievo_cassa_banca',
    difficulty: 'base',
    xp: 60,
    build: (c) => ({
      title: `Versamento contanti in banca (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} versa €${fmtEur(c.amount)} di contanti dalla Cassa al conto corrente bancario. Registra l’operazione.`,
      availableAccounts: ['banca', 'cassa', 'capitale', 'merci_vendite', 'crediti_clienti'],
      solution: { dare: [{ accountId: 'banca', amount: c.amount }], avere: [{ accountId: 'cassa', amount: c.amount }] },
      hints: {
        banca: 'Versi contanti in banca: Banca aumenta. Un’attività che aumenta → DARE.',
        cassa: 'Prelevi contanti dalla cassa: Cassa diminuisce. Un’attività che diminuisce → AVERE.',
        capitale: 'Non è un versamento dei soci, è solo un trasferimento di liquidità.',
        merci_vendite: 'Non è una vendita.',
        crediti_clienti: 'Non è un incasso da cliente.',
      },
      explanation: `Versando contanti in banca, aumenti Banca c/c (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_prelievo_banca_cassa',
    difficulty: 'base',
    xp: 60,
    build: (c) => ({
      title: `Prelievo contanti dalla banca (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} preleva €${fmtEur(c.amount)} dal conto corrente bancario per rifornire la Cassa. Registra l’operazione.`,
      availableAccounts: ['cassa', 'banca', 'capitale', 'merci_acquisti', 'debiti_fornitori'],
      solution: { dare: [{ accountId: 'cassa', amount: c.amount }], avere: [{ accountId: 'banca', amount: c.amount }] },
      hints: {
        cassa: 'Prelevi contanti: Cassa aumenta. Un’attività che aumenta → DARE.',
        banca: 'Prelevi dalla banca: Banca diminuisce. Un’attività che diminuisce → AVERE.',
        capitale: 'Non è un prelievo del socio, è solo un trasferimento di liquidità.',
        merci_acquisti: 'Non è un acquisto.',
        debiti_fornitori: 'Non è un pagamento a fornitore.',
      },
      explanation: `Prelevando contanti dalla banca, aumenti Cassa (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_restituzione_capitale_banca',
    difficulty: 'base',
    xp: 80,
    build: (c) => ({
      title: `Restituzione capitale socio con bonifico (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} restituisce a un socio €${fmtEur(c.amount)} con bonifico come riduzione del capitale sociale. Registra l’operazione.`,
      availableAccounts: ['capitale', 'banca', 'cassa', 'debiti_vari', 'crediti_clienti'],
      solution: { dare: [{ accountId: 'capitale', amount: c.amount }], avere: [{ accountId: 'banca', amount: c.amount }] },
      hints: {
        capitale: 'Restituisci capitale: il patrimonio netto diminuisce. Un netto che diminuisce → DARE.',
        banca: 'Paghi con bonifico: Banca diminuisce. Un’attività che diminuisce → AVERE.',
        cassa: 'Hai pagato con bonifico, non in contanti.',
        debiti_vari: 'Non è un debito verso terzi, è una riduzione del capitale.',
        crediti_clienti: 'I crediti verso clienti non c’entrano.',
      },
      explanation: `Restituendo capitale con bonifico, diminuisci Capitale sociale (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_acq_merci_misto',
    difficulty: 'base',
    xp: 65,
    build: (c) => ({
      title: `Acquisto merci con pagamento misto (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} acquista merci per €${fmtEur(c.amount)} da ${c.supplier}, pagando €${fmtEur(roundTo(c.amount/2, 10))} in contanti e il resto a credito a 30 giorni. Registra l’operazione.`,
      availableAccounts: ['merci_acquisti', 'cassa', 'debiti_fornitori', 'banca', 'crediti_clienti'],
      solution: {
        dare: [{ accountId: 'merci_acquisti', amount: c.amount }],
        avere: [
          { accountId: 'cassa', amount: roundTo(c.amount / 2, 10) },
          { accountId: 'debiti_fornitori', amount: c.amount - roundTo(c.amount / 2, 10) },
        ],
      },
      hints: {
        merci_acquisti: 'Le merci acquistate sono un costo che aumenta → DARE per l’intero importo.',
        cassa: 'Paghi metà in contanti: Cassa diminuisce → AVERE per la parte contanti.',
        debiti_fornitori: 'Il resto è a credito: nasce un debito → AVERE per la parte a credito.',
        banca: 'Non hai pagato con bonifico.',
        crediti_clienti: 'I crediti riguardano le vendite, non gli acquisti.',
      },
      explanation: `Acquistando merci con pagamento misto, aumenti Merci c/acquisti (Dare €${fmtEur(c.amount)}) e dividi l’Avere tra Cassa (€${fmtEur(roundTo(c.amount/2, 10))}) e Debiti v/fornitori (€${fmtEur(c.amount - roundTo(c.amount/2, 10))}).`,
    }),
  },

  // --- INTERMEDIO (15) ---
  {
    id: 'tpl_acq_merci_iva_banca',
    difficulty: 'intermedio',
    xp: 100,
    build: (c) => {
      const iva = Math.round(c.amount * IVA_RATE);
      return {
        title: `Acquisto merci + IVA con bonifico (${fmtEur(c.amount)}€ + IVA)`,
        scenario: `In data ${c.date}, ${c.company} acquista merci per €${fmtEur(c.amount)} + IVA 22% da ${c.supplier}, pagando subito con bonifico. Registra l’operazione separando base imponibile e IVA a credito.`,
        availableAccounts: ['merci_acquisti', 'iva_credito', 'banca', 'cassa', 'iva_debito'],
        solution: {
          dare: [
            { accountId: 'merci_acquisti', amount: c.amount },
            { accountId: 'iva_credito', amount: iva },
          ],
          avere: [{ accountId: 'banca', amount: c.amount + iva }],
        },
        hints: {
          merci_acquisti: 'La base imponibile (costo merci) è un costo che aumenta → DARE.',
          iva_credito: 'L’IVA pagata sugli acquisti è recuperabile: IVA a credito aumenta. Un’attività che aumenta → DARE.',
          banca: 'Paghi il totale (merci + IVA) con bonifico: Banca diminuisce → AVERE.',
          cassa: 'Hai pagato con bonifico, non in contanti.',
          iva_debito: 'L’IVA a debito riguarda le vendite, non gli acquisti.',
        },
        explanation: `Acquistando merci con IVA, aumenti Merci c/acquisti (€${fmtEur(c.amount)}) e IVA a credito (€${fmtEur(iva)}) in Dare, e diminuisci Banca c/c (€${fmtEur(c.amount + iva)}) in Avere.`,
      };
    },
  },
  {
    id: 'tpl_ven_merci_iva_cassa',
    difficulty: 'intermedio',
    xp: 100,
    build: (c) => {
      const iva = Math.round(c.amount * IVA_RATE);
      return {
        title: `Vendita merci + IVA in contanti (${fmtEur(c.amount)}€ + IVA)`,
        scenario: `In data ${c.date}, ${c.company} vende merci per €${fmtEur(c.amount)} + IVA 22% a ${c.customer}, incassando subito in contanti. Registra l’operazione separando base imponibile e IVA a debito.`,
        availableAccounts: ['cassa', 'merci_vendite', 'iva_debito', 'banca', 'iva_credito'],
        solution: {
          dare: [{ accountId: 'cassa', amount: c.amount + iva }],
          avere: [
            { accountId: 'merci_vendite', amount: c.amount },
            { accountId: 'iva_debito', amount: iva },
          ],
        },
        hints: {
          cassa: 'Incassi il totale (merci + IVA) in contanti: Cassa aumenta → DARE.',
          merci_vendite: 'La base imponibile è un ricavo con saldo normale in Avere → AVERE.',
          iva_debito: 'L’IVA incassata sulle vendite è da versare allo Stato: IVA a debito aumenta. Un passivo che aumenta → AVERE.',
          banca: 'Hai incassato in contanti, non con bonifico.',
          iva_credito: 'L’IVA a credito riguarda gli acquisti, non le vendite.',
        },
        explanation: `Vendendo merci con IVA, aumenti Cassa (€${fmtEur(c.amount + iva)}) in Dare, e registri Merci c/vendite (€${fmtEur(c.amount)}) e IVA a debito (€${fmtEur(iva)}) in Avere.`,
      };
    },
  },
  {
    id: 'tpl_acq_merci_iva_credito',
    difficulty: 'intermedio',
    xp: 110,
    build: (c) => {
      const iva = Math.round(c.amount * IVA_RATE);
      return {
        title: `Acquisto merci + IVA a credito (${fmtEur(c.amount)}€ + IVA)`,
        scenario: `In data ${c.date}, ${c.company} acquista merci per €${fmtEur(c.amount)} + IVA 22% da ${c.supplier} con pagamento a 30 giorni. Registra la fattura oggi.`,
        availableAccounts: ['merci_acquisti', 'iva_credito', 'debiti_fornitori', 'banca', 'iva_debito'],
        solution: {
          dare: [
            { accountId: 'merci_acquisti', amount: c.amount },
            { accountId: 'iva_credito', amount: iva },
          ],
          avere: [{ accountId: 'debiti_fornitori', amount: c.amount + iva }],
        },
        hints: {
          merci_acquisti: 'La base imponibile è un costo che aumenta → DARE.',
          iva_credito: 'L’IVA a credito è recuperabile: aumenta → DARE.',
          debiti_fornitori: 'Nasce un debito per il totale (merci + IVA) verso il fornitore → AVERE.',
          banca: 'Non hai pagato ora, il pagamento è a 30 giorni.',
          iva_debito: 'L’IVA a debito riguarda le vendite, non gli acquisti.',
        },
        explanation: `Acquistando merci a credito con IVA, aumenti Merci c/acquisti (€${fmtEur(c.amount)}) e IVA a credito (€${fmtEur(iva)}) in Dare, e aumenti Debiti v/fornitori (€${fmtEur(c.amount + iva)}) in Avere.`,
      };
    },
  },
  {
    id: 'tpl_ven_merci_iva_credito',
    difficulty: 'intermedio',
    xp: 110,
    build: (c) => {
      const iva = Math.round(c.amount * IVA_RATE);
      return {
        title: `Vendita merci + IVA a credito (${fmtEur(c.amount)}€ + IVA)`,
        scenario: `In data ${c.date}, ${c.company} vende merci per €${fmtEur(c.amount)} + IVA 22% a ${c.customer} con incasso a 30 giorni. Registra la fattura oggi.`,
        availableAccounts: ['crediti_clienti', 'merci_vendite', 'iva_debito', 'cassa', 'iva_credito'],
        solution: {
          dare: [{ accountId: 'crediti_clienti', amount: c.amount + iva }],
          avere: [
            { accountId: 'merci_vendite', amount: c.amount },
            { accountId: 'iva_debito', amount: iva },
          ],
        },
        hints: {
          crediti_clienti: 'Nasce un credito per il totale (merci + IVA) verso il cliente → DARE.',
          merci_vendite: 'La base imponibile è un ricavo → AVERE.',
          iva_debito: 'L’IVA a debito aumenta (passivo) → AVERE.',
          cassa: 'Non hai incassato ora, l’incasso è a 30 giorni.',
          iva_credito: 'L’IVA a credito riguarda gli acquisti, non le vendite.',
        },
        explanation: `Vendendo merci a credito con IVA, aumenti Crediti v/clienti (€${fmtEur(c.amount + iva)}) in Dare, e registri Merci c/vendite (€${fmtEur(c.amount)}) e IVA a debito (€${fmtEur(iva)}) in Avere.`,
      };
    },
  },
  {
    id: 'tpl_pag_debito_forn_banca_iva',
    difficulty: 'intermedio',
    xp: 95,
    build: (c) => {
      const iva = Math.round(c.amount * IVA_RATE);
      return {
        title: `Pagamento debito fornitore (merci + IVA) con bonifico`,
        scenario: `In data ${c.date}, ${c.company} salda con bonifico la fattura precedente di €${fmtEur(c.amount + iva)} (merci €${fmtEur(c.amount)} + IVA €${fmtEur(iva)}) ricevuta da ${c.supplier}. Registra il pagamento.`,
        availableAccounts: ['debiti_fornitori', 'banca', 'cassa', 'merci_acquisti', 'iva_credito'],
        solution: {
          dare: [{ accountId: 'debiti_fornitori', amount: c.amount + iva }],
          avere: [{ accountId: 'banca', amount: c.amount + iva }],
        },
        hints: {
          debiti_fornitori: 'Paghi un debito precedente: il debito diminuisce. Un passivo che diminuisce → DARE per il totale.',
          banca: 'Paghi con bonifico: Banca diminuisce → AVERE per il totale.',
          cassa: 'Hai pagato con bonifico, non in contanti.',
          merci_acquisti: 'L’acquisto era già registrato. Ora paghi solo il debito.',
          iva_credito: 'L’IVA a credito era già registrata in fase di acquisto.',
        },
        explanation: `Pagando il debito con bonifico, diminuisci Debiti v/fornitori (Dare €${fmtEur(c.amount + iva)}) e diminuisci Banca c/c (Avere €${fmtEur(c.amount + iva)}).`,
      };
    },
  },
  {
    id: 'tpl_incasso_credito_cli_cassa_iva',
    difficulty: 'intermedio',
    xp: 95,
    build: (c) => {
      const iva = Math.round(c.amount * IVA_RATE);
      return {
        title: `Incasso credito cliente (merci + IVA) in contanti`,
        scenario: `In data ${c.date}, ${c.customer} salda in contanti la fattura precedente di €${fmtEur(c.amount + iva)} (merci €${fmtEur(c.amount)} + IVA €${fmtEur(iva)}) emessa da ${c.company}. Registra l’incasso.`,
        availableAccounts: ['cassa', 'crediti_clienti', 'banca', 'merci_vendite', 'iva_debito'],
        solution: {
          dare: [{ accountId: 'cassa', amount: c.amount + iva }],
          avere: [{ accountId: 'crediti_clienti', amount: c.amount + iva }],
        },
        hints: {
          cassa: 'Ricevi contanti: Cassa aumenta → DARE per il totale.',
          crediti_clienti: 'Incassi un credito precedente: il credito diminuisce → AVERE per il totale.',
          banca: 'Hai incassato in contanti, non in banca.',
          merci_vendite: 'La vendita era già registrata.',
          iva_debito: 'L’IVA a debito era già registrata in fase di vendita.',
        },
        explanation: `Incassando il credito in contanti, aumenti Cassa (Dare €${fmtEur(c.amount + iva)}) e diminuisci Crediti v/clienti (Avere €${fmtEur(c.amount + iva)}).`,
      };
    },
  },
  {
    id: 'tpl_acq_bene_strumentale_iva_banca',
    difficulty: 'intermedio',
    xp: 110,
    build: (c) => {
      const iva = Math.round(c.amount * IVA_RATE);
      return {
        title: `Acquisto bene strumentale + IVA con bonifico (${fmtEur(c.amount)}€)`,
        scenario: `In data ${c.date}, ${c.company} acquista un computer per €${fmtEur(c.amount)} + IVA 22%, pagando subito con bonifico. Registra l’operazione separando base imponibile e IVA a credito.`,
        availableAccounts: ['macchine', 'iva_credito', 'banca', 'cassa', 'iva_debito'],
        solution: {
          dare: [
            { accountId: 'macchine', amount: c.amount },
            { accountId: 'iva_credito', amount: iva },
          ],
          avere: [{ accountId: 'banca', amount: c.amount + iva }],
        },
        hints: {
          macchine: 'Il computer è un bene strumentale: aumenta → DARE per la base imponibile.',
          iva_credito: 'L’IVA pagata è recuperabile: IVA a credito aumenta → DARE.',
          banca: 'Paghi il totale con bonifico: Banca diminuisce → AVERE.',
          cassa: 'Hai pagato con bonifico, non in contanti.',
          iva_debito: 'L’IVA a debito riguarda le vendite.',
        },
        explanation: `Acquistando un bene strumentale con IVA, aumenti Macchine d’ufficio (€${fmtEur(c.amount)}) e IVA a credito (€${fmtEur(iva)}) in Dare, e diminuisci Banca c/c (€${fmtEur(c.amount + iva)}) in Avere.`,
      };
    },
  },
  {
    id: 'tpl_fattura_affitto_iva_credito',
    difficulty: 'intermedio',
    xp: 100,
    build: (c) => {
      const iva = Math.round(c.amount * IVA_RATE);
      return {
        title: `Fattura affitto + IVA a credito (${fmtEur(c.amount)}€)`,
        scenario: `In data ${c.date}, ${c.company} riceve la fattura dell’affitto mensile di €${fmtEur(c.amount)} + IVA 22% da ${c.supplier}, pagamento a 30 giorni. Registra la fattura oggi.`,
        availableAccounts: ['fitti_passivi', 'iva_credito', 'debiti_vari', 'banca', 'iva_debito'],
        solution: {
          dare: [
            { accountId: 'fitti_passivi', amount: c.amount },
            { accountId: 'iva_credito', amount: iva },
          ],
          avere: [{ accountId: 'debiti_vari', amount: c.amount + iva }],
        },
        hints: {
          fitti_passivi: 'L’affitto è un costo che aumenta → DARE per la base imponibile.',
          iva_credito: 'L’IVA a credito è recuperabile: aumenta → DARE.',
          debiti_vari: 'Nasce un debito verso il locatore per il totale → AVERE.',
          banca: 'Non hai pagato ora, il pagamento è a 30 giorni.',
          iva_debito: 'L’IVA a debito riguarda le vendite.',
        },
        explanation: `Ricevendo la fattura dell’affitto con IVA, aumenti Fitti passivi (€${fmtEur(c.amount)}) e IVA a credito (€${fmtEur(iva)}) in Dare, e aumenti Debiti diversi (€${fmtEur(c.amount + iva)}) in Avere.`,
      };
    },
  },
  {
    id: 'tpl_pag_debito_vario_banca',
    difficulty: 'intermedio',
    xp: 90,
    build: (c) => ({
      title: `Pagamento debito vario con bonifico (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} paga con bonifico €${fmtEur(c.amount)} per saldare un debito diverso (es. affitto precedentemente fatturato) verso ${c.supplier}. Registra il pagamento.`,
      availableAccounts: ['debiti_vari', 'banca', 'cassa', 'fitti_passivi', 'debiti_fornitori'],
      solution: { dare: [{ accountId: 'debiti_vari', amount: c.amount }], avere: [{ accountId: 'banca', amount: c.amount }] },
      hints: {
        debiti_vari: 'Paghi un debito diverso: il debito diminuisce. Un passivo che diminuisce → DARE.',
        banca: 'Paghi con bonifico: Banca diminuisce. Un’attività che diminuisce → AVERE.',
        cassa: 'Hai pagato con bonifico, non in contanti.',
        fitti_passivi: 'Il costo dell’affitto era già registrato. Ora paghi solo il debito.',
        debiti_fornitori: 'Questo debito è verso il locatore, non verso fornitori commerciali. Usa Debiti diversi.',
      },
      explanation: `Pagando un debito diverso con bonifico, diminuisci Debiti diversi (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_vendita_misti_merci_macchine',
    difficulty: 'intermedio',
    xp: 120,
    build: (c) => {
      const merci = roundTo(c.amount * 0.7, 10);
      const macchine = c.amount - merci;
      return {
        title: `Vendita mista merci + bene strumentale (${fmtEur(c.amount)}€)`,
        scenario: `In data ${c.date}, ${c.company} vende a ${c.customer} merci per €${fmtEur(merci)} e un computer usato per €${fmtEur(macchine)}, incassando tutto con bonifico. Registra l’operazione.`,
        availableAccounts: ['banca', 'merci_vendite', 'macchine', 'cassa', 'crediti_clienti'],
        solution: {
          dare: [{ accountId: 'banca', amount: c.amount }],
          avere: [
            { accountId: 'merci_vendite', amount: merci },
            { accountId: 'macchine', amount: macchine },
          ],
        },
        hints: {
          banca: 'Incassi il totale con bonifico: Banca aumenta → DARE.',
          merci_vendite: 'La vendita di merci è un ricavo → AVERE per la parte merci.',
          macchine: 'Cedi un bene strumentale: l’attività diminuisce → AVERE per la parte bene.',
          cassa: 'Hai incassato con bonifico, non in contanti.',
          crediti_clienti: 'Il cliente ha pagato subito, non nasce alcun credito.',
        },
        explanation: `Vendendo merci e bene strumentale, aumenti Banca c/c (Dare €${fmtEur(c.amount)}) e dividi l’Avere tra Merci c/vendite (€${fmtEur(merci)}) e Macchine d’ufficio (€${fmtEur(macchine)}).`,
      };
    },
  },
  {
    id: 'tpl_acq_merci_sconto_cassa',
    difficulty: 'intermedio',
    xp: 90,
    build: (c) => {
      const sconto = Math.round(c.amount * 0.1);
      const netto = c.amount - sconto;
      return {
        title: `Acquisto merci con sconto commerciale in contanti (${fmtEur(netto)}€)`,
        scenario: `In data ${c.date}, ${c.company} acquista merci per €${fmtEur(c.amount)} da ${c.supplier} con sconto commerciale del 10%, pagando subito in contanti. Registra l’operazione.`,
        availableAccounts: ['merci_acquisti', 'cassa', 'banca', 'merci_vendite', 'crediti_clienti'],
        solution: { dare: [{ accountId: 'merci_acquisti', amount: netto }], avere: [{ accountId: 'cassa', amount: netto }] },
        hints: {
          merci_acquisti: 'Le merci sono registrate al netto dello sconto commerciale: il costo effettivo è €${fmtEur(netto)} → DARE.',
          cassa: 'Paghi in contanti l’importo netto: Cassa diminuisce → AVERE.',
          banca: 'Hai pagato in contanti, non con bonifico.',
          merci_vendite: 'Stai acquistando, non vendendo.',
          crediti_clienti: 'Nessun credito verso clienti.',
        },
        explanation: `Acquistando merci con sconto commerciale, registri Merci c/acquisti al netto di €${fmtEur(netto)} (Dare) e diminuisci Cassa (Avere) per €${fmtEur(netto)}. Lo sconto non si registra separatamente.`,
      };
    },
  },
  {
    id: 'tpl_restituzione_capitale_cassa',
    difficulty: 'intermedio',
    xp: 85,
    build: (c) => ({
      title: `Restituzione capitale socio in contanti (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} restituisce a un socio €${fmtEur(c.amount)} in contanti come riduzione del capitale sociale. Registra l’operazione.`,
      availableAccounts: ['capitale', 'cassa', 'banca', 'debiti_vari', 'crediti_clienti'],
      solution: { dare: [{ accountId: 'capitale', amount: c.amount }], avere: [{ accountId: 'cassa', amount: c.amount }] },
      hints: {
        capitale: 'Restituisci capitale: il patrimonio netto diminuisce. Un netto che diminuisce → DARE.',
        cassa: 'Paghi in contanti: Cassa diminuisce. Un’attività che diminuisce → AVERE.',
        banca: 'Hai pagato in contanti, non con bonifico.',
        debiti_vari: 'Non è un debito verso terzi, è una riduzione del capitale.',
        crediti_clienti: 'I crediti verso clienti non c’entrano.',
      },
      explanation: `Restituendo capitale in contanti, diminuisci Capitale sociale (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${fmtEur(c.amount)}.`,
    }),
  },
  {
    id: 'tpl_incasso_credito_parziale_banca',
    difficulty: 'intermedio',
    xp: 95,
    build: (c) => {
      const incasso = roundTo(c.amount * 0.6, 10);
      const residuo = c.amount - incasso;
      return {
        title: `Incasso parziale credito cliente con bonifico (${fmtEur(incasso)}€)`,
        scenario: `In data ${c.date}, ${c.customer} paga con bonifico €${fmtEur(incasso)} a ${c.company} come acconto su una fattura precedente di €${fmtEur(c.amount)}. Registra l’incasso parziale.`,
        availableAccounts: ['banca', 'crediti_clienti', 'cassa', 'merci_vendite', 'debiti_fornitori'],
        solution: { dare: [{ accountId: 'banca', amount: incasso }], avere: [{ accountId: 'crediti_clienti', amount: incasso }] },
        hints: {
          banca: 'Ricevi un bonifico: Banca aumenta → DARE per l’importo incassato.',
          crediti_clienti: 'Incassi parte del credito: il credito diminuisce → AVERE per l’importo incassato.',
          cassa: 'Hai incassato con bonifico, non in contanti.',
          merci_vendite: 'La vendita era già registrata.',
          debiti_fornitori: 'I debiti verso fornitori non c’entrano.',
        },
        explanation: `Incassando parzialmente un credito con bonifico, aumenti Banca c/c (Dare €${fmtEur(incasso)}) e diminuisci Crediti v/clienti (Avere €${fmtEur(incasso)}). Residuo credito: €${fmtEur(residuo)}.`,
      };
    },
  },
  {
    id: 'tpl_pagamento_debito_parziale_cassa',
    difficulty: 'intermedio',
    xp: 95,
    build: (c) => {
      const pagamento = roundTo(c.amount * 0.5, 10);
      const residuo = c.amount - pagamento;
      return {
        title: `Pagamento parziale debito fornitore in contanti (${fmtEur(pagamento)}€)`,
        scenario: `In data ${c.date}, ${c.company} paga in contanti €${fmtEur(pagamento)} a ${c.supplier} come acconto su una fattura precedente di €${fmtEur(c.amount)}. Registra il pagamento parziale.`,
        availableAccounts: ['debiti_fornitori', 'cassa', 'banca', 'merci_acquisti', 'crediti_clienti'],
        solution: { dare: [{ accountId: 'debiti_fornitori', amount: pagamento }], avere: [{ accountId: 'cassa', amount: pagamento }] },
        hints: {
          debiti_fornitori: 'Paghi parte del debito: il debito diminuisce → DARE per l’importo pagato.',
          cassa: 'Paghi in contanti: Cassa diminuisce → AVERE per l’importo pagato.',
          banca: 'Hai pagato in contanti, non con bonifico.',
          merci_acquisti: 'L’acquisto era già registrato.',
          crediti_clienti: 'I crediti verso clienti non c’entrano.',
        },
        explanation: `Pagando parzialmente un debito in contanti, diminuisci Debiti v/fornitori (Dare €${fmtEur(pagamento)}) e diminuisci Cassa (Avere €${fmtEur(pagamento)}). Residuo debito: €${fmtEur(residuo)}.`,
      };
    },
  },
  {
    id: 'tpl_acq_merci_iva_sconto_banca',
    difficulty: 'intermedio',
    xp: 130,
    build: (c) => {
      const sconto = Math.round(c.amount * 0.1);
      const netto = c.amount - sconto;
      const iva = Math.round(netto * IVA_RATE);
      return {
        title: `Acquisto merci + IVA con sconto e bonifico (${fmtEur(netto)}€ + IVA)`,
        scenario: `In data ${c.date}, ${c.company} acquista merci per €${fmtEur(c.amount)} da ${c.supplier} con sconto commerciale 10%, + IVA 22% sulla base imponibile netta, pagando subito con bonifico. Registra l’operazione.`,
        availableAccounts: ['merci_acquisti', 'iva_credito', 'banca', 'cassa', 'iva_debito'],
        solution: {
          dare: [
            { accountId: 'merci_acquisti', amount: netto },
            { accountId: 'iva_credito', amount: iva },
          ],
          avere: [{ accountId: 'banca', amount: netto + iva }],
        },
        hints: {
          merci_acquisti: 'Le merci sono registrate al netto dello sconto: €${fmtEur(netto)} → DARE.',
          iva_credito: 'L’IVA si calcola sulla base imponibile netta: €${fmtEur(iva)} → DARE.',
          banca: 'Paghi il totale netto + IVA con bonifico → AVERE.',
          cassa: 'Hai pagato con bonifico, non in contanti.',
          iva_debito: 'L’IVA a debito riguarda le vendite.',
        },
        explanation: `Acquistando merci con sconto e IVA, registri Merci c/acquisti al netto di €${fmtEur(netto)} e IVA a credito €${fmtEur(iva)} in Dare, e diminuisci Banca c/c (€${fmtEur(netto + iva)}) in Avere.`,
      };
    },
  },

  // --- AVANZATO (15) ---
  {
    id: 'tpl_liquidazione_iva',
    difficulty: 'avanzato',
    xp: 150,
    build: (c) => {
      const ivaDebito = Math.round(c.amount * IVA_RATE);
      const ivaCredito = Math.round(c.amount * 0.6 * IVA_RATE);
      const saldo = ivaDebito - ivaCredito;
      return {
        title: `Liquidazione periodica IVA (saldo a debito €${fmtEur(saldo)})`,
        scenario: `In data ${c.date}, ${c.company} procede alla liquidazione IVA periodica. IVA a debito da vendite €${fmtEur(ivaDebito)}, IVA a credito da acquisti €${fmtEur(ivaCredito)}. Il saldo va versato con bonifico. Registra la liquidazione e il versamento.`,
        availableAccounts: ['iva_debito', 'iva_credito', 'banca', 'cassa', 'debiti_vari'],
        solution: {
          dare: [{ accountId: 'iva_debito', amount: ivaDebito }],
          avere: [
            { accountId: 'iva_credito', amount: ivaCredito },
            { accountId: 'banca', amount: saldo },
          ],
        },
        hints: {
          iva_debito: 'Chiudi l’IVA a debito: il passivo diminuisce → DARE per l’intero importo.',
          iva_credito: 'Utilizzi l’IVA a credito per compensare: l’attività diminuisce → AVERE per l’importo a credito.',
          banca: 'Versi il saldo (debito - credito) con bonifico → AVERE.',
          cassa: 'Hai versato con bonifico, non in contanti.',
          debiti_vari: 'Non nasce un nuovo debito, l’IVA viene liquidata subito.',
        },
        explanation: `In liquidazione IVA, chiudi IVA a debito (Dare €${fmtEur(ivaDebito)}), compensi IVA a credito (Avere €${fmtEur(ivaCredito)}) e versi il saldo con bonifico (Avere €${fmtEur(saldo)}).`,
      };
    },
  },
  {
    id: 'tpl_ammortamento_bene',
    difficulty: 'avanzato',
    xp: 140,
    build: (c) => {
      const quota = Math.round(c.amount / 5);
      return {
        title: `Ammortamento bene strumentale (quota annua €${fmtEur(quota)})`,
        scenario: `In data ${c.date}, ${c.company} registra l’ammortamento annuo del computer acquistato a €${fmtEur(c.amount)} con vita utile di 5 anni (quota costante). Registra la scrittura di assestamento.`,
        availableAccounts: ['fitti_passivi', 'macchine', 'banca', 'crediti_clienti', 'iva_credito'],
        solution: { dare: [{ accountId: 'fitti_passivi', amount: quota }], avere: [{ accountId: 'macchine', amount: quota }] },
        hints: {
          fitti_passivi: 'La quota di ammortamento è un costo di esercizio → DARE.',
          macchine: 'Il fondo ammortamento riduce il valore del bene: l’attività si riduce → AVERE.',
          banca: 'L’ammortamento è una scrittura di assestamento, non comporta movimento finanziario.',
          crediti_clienti: 'I crediti verso clienti non c’entrano.',
          iva_credito: 'L’IVA non è coinvolta in assestamenti.',
        },
        explanation: `Registrando l’ammortamento, iscrivi un costo (Fitti passivi / Ammortamento → Dare €${fmtEur(quota)}) e riduci il valore del bene (Macchine d’ufficio → Avere €${fmtEur(quota)}). Nessun movimento finanziario.`,
      };
    },
  },
  {
    id: 'tpl_rateo_affitto',
    difficulty: 'avanzato',
    xp: 150,
    build: (c) => {
      const rateo = roundTo((c.amount * c.months) / 12, 10);
      return {
        title: `Rateo affitto pagato in anticipo (${fmtEur(rateo)}€ per ${c.months} mesi)`,
        scenario: `In data ${c.date}, ${c.company} ha pagato in anticipo un affitto annuo di €${fmtEur(c.amount)} il 1° gennaio. Al 31/12 sono trascorsi ${c.months} mesi. Registra il rateo per la quota di competenza.`,
        availableAccounts: ['fitti_passivi', 'debiti_vari', 'banca', 'cassa', 'crediti_clienti'],
        solution: { dare: [{ accountId: 'fitti_passivi', amount: rateo }], avere: [{ accountId: 'debiti_vari', amount: rateo }] },
        hints: {
          fitti_passivi: 'La quota di affitto di competenza dell’esercizio è un costo → DARE.',
          debiti_vari: 'La quota non ancora di competenza è un rateo passivo (debito virtuale) → AVERE.',
          banca: 'Il pagamento era già avvenuto in anticipo; ora si rileva solo la competenza.',
          cassa: 'Non c’è movimento di cassa in assestamento.',
          crediti_clienti: 'I crediti verso clienti non c’entrano.',
        },
        explanation: `Registrando il rateo, iscrivi il costo di competenza (Fitti passivi → Dare €${fmtEur(rateo)}) e il rateo passivo per la quota non di competenza (Debiti diversi / Ratei → Avere €${fmtEur(rateo)}).`,
      };
    },
  },
  {
    id: 'tpl_risconto_attivo',
    difficulty: 'avanzato',
    xp: 150,
    build: (c) => {
      const risconto = roundTo((c.amount * (12 - c.months)) / 12, 10);
      const competenza = c.amount - risconto;
      return {
        title: `Risconto attivo su affitto incassato in anticipo (${fmtEur(risconto)}€)`,
        scenario: `In data ${c.date}, ${c.company} ha incassato in anticipo un affitto annuo di €${fmtEur(c.amount)} il 1° gennaio. Al 31/12 sono trascorsi ${c.months} mesi. Registra il risconto attivo per la quota non ancora di competenza.`,
        availableAccounts: ['crediti_clienti', 'merci_vendite', 'banca', 'cassa', 'iva_debito'],
        solution: { dare: [{ accountId: 'crediti_clienti', amount: risconto }], avere: [{ accountId: 'merci_vendite', amount: risconto }] },
        hints: {
          crediti_clienti: 'La quota non di competenza è un risconto attivo (credito virtuale) → DARE.',
          merci_vendite: 'Storni la quota di ricavo non di competenza → AVERE (riduzione di ricavo).',
          banca: 'L’incasso era già avvenuto; ora si rileva solo la competenza.',
          cassa: 'Non c’è movimento di cassa in assestamento.',
          iva_debito: 'L’IVA non è coinvolta in assestamenti.',
        },
        explanation: `Registrando il risconto attivo, iscrivi un credito virtuale (Crediti v/clienti / Risconti → Dare €${fmtEur(risconto)}) e storni la quota non di competenza del ricavo (Merci c/vendite → Avere €${fmtEur(risconto)}). Competenza esercizio: €${fmtEur(competenza)}.`,
      };
    },
  },
  {
    id: 'tpl_chiusura_conti_economici',
    difficulty: 'avanzato',
    xp: 160,
    build: (c) => {
      const acquisti = c.amount;
      const vendite = roundTo(c.amount * 1.4, 10);
      const utile = vendite - acquisti;
      return {
        title: `Chiusura conti economici (utile d’esercizio €${fmtEur(utile)})`,
        scenario: `In data ${c.date}, ${c.company} chiude i conti economici: Merci c/acquisti €${fmtEur(acquisti)}, Merci c/vendite €${fmtEur(vendite)}. Registra la chiusura e la determinazione del risultato d’esercizio.`,
        availableAccounts: ['merci_vendite', 'merci_acquisti', 'capitale', 'banca', 'iva_debito'],
        solution: {
          dare: [{ accountId: 'merci_vendite', amount: vendite }],
          avere: [
            { accountId: 'merci_acquisti', amount: acquisti },
            { accountId: 'capitale', amount: utile },
          ],
        },
        hints: {
          merci_vendite: 'Chiudi il ricavo: il ricavo diminuisce → DARE per l’intero importo.',
          merci_acquisti: 'Chiudi il costo: il costo diminuisce → AVERE per l’intero importo.',
          capitale: 'L’utile d’esercizio accresce il patrimonio netto → AVERE per la differenza (utile).',
          banca: 'La chiusura dei conti non comporta movimento finanziario.',
          iva_debito: 'L’IVA non è coinvolta in chiusura.',
        },
        explanation: `In chiusura, chiudi Merci c/vendite (Dare €${fmtEur(vendite)}) e scarichi Merci c/acquisti (Avere €${fmtEur(acquisti)}). La differenza è l’utile d’esercizio che accresce il patrimonio netto (Capitale / Utile → Avere €${fmtEur(utile)}).`,
      };
    },
  },
  {
    id: 'tpl_chiusura_conti_patrimoniali',
    difficulty: 'avanzato',
    xp: 160,
    build: (c) => {
      const cassa = roundTo(c.amount * 0.2, 10);
      const banca = roundTo(c.amount * 0.5, 10);
      const merci = roundTo(c.amount * 0.3, 10);
      const totale = cassa + banca + merci;
      return {
        title: `Apertura conti patrimoniali (attivo €${fmtEur(totale)})`,
        scenario: `In data ${c.date}, ${c.company} riapre i conti patrimoniali attivi: Cassa €${fmtEur(cassa)}, Banca c/c €${fmtEur(banca)}, Macchine d’ufficio €${fmtEur(merci)}. Registra la scrittura di apertura.`,
        availableAccounts: ['cassa', 'banca', 'macchine', 'capitale', 'merci_acquisti'],
        solution: {
          dare: [
            { accountId: 'cassa', amount: cassa },
            { accountId: 'banca', amount: banca },
            { accountId: 'macchine', amount: merci },
          ],
          avere: [{ accountId: 'capitale', amount: totale }],
        },
        hints: {
          cassa: 'Riapri Cassa: l’attività aumenta → DARE.',
          banca: 'Riapri Banca: l’attività aumenta → DARE.',
          macchine: 'Riapri Macchine: l’attività aumenta → DARE.',
          capitale: 'La fonte di finanziamento (capitale netto) aumenta → AVERE per il totale.',
          merci_acquisti: 'I conti economici non si riaprono, sono di competenza dell’esercizio.',
        },
        explanation: `In apertura, riapri tutte le attività (Cassa €${fmtEur(cassa)}, Banca €${fmtEur(banca)}, Macchine €${fmtEur(merci)}) in Dare e iscrivi il patrimonio netto di apertura (Capitale → Avere €${fmtEur(totale)}).`,
      };
    },
  },
  {
    id: 'tpl_cessione_bene_strumentale',
    difficulty: 'avanzato',
    xp: 140,
    build: (c) => {
      const costo = c.amount;
      const ammort = Math.round(c.amount * 0.6);
      const residuo = costo - ammort;
      const prezzo = roundTo(residuo * 1.1, 10);
      const utile = prezzo - residuo;
      return {
        title: `Cessione bene strumentale (plusvalenza €${fmtEur(utile)})`,
        scenario: `In data ${c.date}, ${c.company} cede un computer con costo storico €${fmtEur(costo)} e fondo ammortamento €${fmtEur(ammort)} per €${fmtEur(prezzo)} + IVA, incassando con bonifico. Registra la cessione (ignora l’IVA per semplicità).`,
        availableAccounts: ['banca', 'macchine', 'merci_vendite', 'crediti_clienti', 'iva_credito'],
        solution: {
          dare: [{ accountId: 'banca', amount: prezzo }],
          avere: [
            { accountId: 'macchine', amount: residuo },
            { accountId: 'merci_vendite', amount: utile },
          ],
        },
        hints: {
          banca: 'Incassi il prezzo di cessione con bonifico: Banca aumenta → DARE.',
          macchine: 'Cedi il bene per il valore residuo (costo - ammortamento): l’attività diminuisce → AVERE.',
          merci_vendite: 'La plusvalenza (prezzo - valore residuo) è un ricavo straordinario → AVERE.',
          crediti_clienti: 'Hai incassato subito, non nasce credito.',
          iva_credito: 'L’IVA non è considerata in questo esercizio semplificato.',
        },
        explanation: `Cedendo il bene, aumenti Banca (Dare €${fmtEur(prezzo)}), riduci Macchine d’ufficio al valore residuo (Avere €${fmtEur(residuo)}) e iscrivi la plusvalenza come ricavo (Merci c/vendite → Avere €${fmtEur(utile)}).`,
      };
    },
  },
  {
    id: 'tpl_acq_merci_iva_sconto_credito',
    difficulty: 'avanzato',
    xp: 160,
    build: (c) => {
      const sconto = Math.round(c.amount * 0.1);
      const netto = c.amount - sconto;
      const iva = Math.round(netto * IVA_RATE);
      return {
        title: `Acquisto merci + IVA con sconto a credito (${fmtEur(netto)}€ + IVA)`,
        scenario: `In data ${c.date}, ${c.company} acquista merci per €${fmtEur(c.amount)} da ${c.supplier} con sconto 10%, + IVA 22% sulla base netta, pagamento a 30 giorni. Registra la fattura oggi.`,
        availableAccounts: ['merci_acquisti', 'iva_credito', 'debiti_fornitori', 'banca', 'iva_debito'],
        solution: {
          dare: [
            { accountId: 'merci_acquisti', amount: netto },
            { accountId: 'iva_credito', amount: iva },
          ],
          avere: [{ accountId: 'debiti_fornitori', amount: netto + iva }],
        },
        hints: {
          merci_acquisti: 'Le merci sono al netto dello sconto: €${fmtEur(netto)} → DARE.',
          iva_credito: 'L’IVA è calcolata sulla base netta: €${fmtEur(iva)} → DARE.',
          debiti_fornitori: 'Nasce un debito per il totale netto + IVA → AVERE.',
          banca: 'Non hai pagato ora, il pagamento è a 30 giorni.',
          iva_debito: 'L’IVA a debito riguarda le vendite.',
        },
        explanation: `Acquistando merci con sconto e IVA a credito, registri Merci c/acquisti (€${fmtEur(netto)}) e IVA a credito (€${fmtEur(iva)}) in Dare, e aumenti Debiti v/fornitori (€${fmtEur(netto + iva)}) in Avere.`,
      };
    },
  },
  {
    id: 'tpl_ven_merci_iva_sconto_credito',
    difficulty: 'avanzato',
    xp: 160,
    build: (c) => {
      const sconto = Math.round(c.amount * 0.1);
      const netto = c.amount - sconto;
      const iva = Math.round(netto * IVA_RATE);
      return {
        title: `Vendita merci + IVA con sconto a credito (${fmtEur(netto)}€ + IVA)`,
        scenario: `In data ${c.date}, ${c.company} vende merci per €${fmtEur(c.amount)} a ${c.customer} con sconto 10%, + IVA 22% sulla base netta, incasso a 30 giorni. Registra la fattura oggi.`,
        availableAccounts: ['crediti_clienti', 'merci_vendite', 'iva_debito', 'cassa', 'iva_credito'],
        solution: {
          dare: [{ accountId: 'crediti_clienti', amount: netto + iva }],
          avere: [
            { accountId: 'merci_vendite', amount: netto },
            { accountId: 'iva_debito', amount: iva },
          ],
        },
        hints: {
          crediti_clienti: 'Nasce un credito per il totale netto + IVA → DARE.',
          merci_vendite: 'Il ricavo è al netto dello sconto: €${fmtEur(netto)} → AVERE.',
          iva_debito: 'L’IVA è calcolata sulla base netta: €${fmtEur(iva)} → AVERE.',
          cassa: 'Non hai incassato ora, l’incasso è a 30 giorni.',
          iva_credito: 'L’IVA a credito riguarda gli acquisti.',
        },
        explanation: `Vendendo merci con sconto e IVA a credito, aumenti Crediti v/clienti (Dare €${fmtEur(netto + iva)}) e registri Merci c/vendite (€${fmtEur(netto)}) e IVA a debito (€${fmtEur(iva)}) in Avere.`,
      };
    },
  },
  {
    id: 'tpl_storno_residuo_credito',
    difficulty: 'avanzato',
    xp: 130,
    build: (c) => ({
      title: `Storno credito inesigibile (${fmtEur(c.amount)}€)`,
      scenario: `In data ${c.date}, ${c.company} accerta che ${c.customer} non pagherà mai la fattura precedente di €${fmtEur(c.amount)}. Registra lo storno del credito inesigibile (senza movimento finanziario).`,
      availableAccounts: ['fitti_passivi', 'crediti_clienti', 'banca', 'iva_debito', 'cassa'],
      solution: { dare: [{ accountId: 'fitti_passivi', amount: c.amount }], avere: [{ accountId: 'crediti_clienti', amount: c.amount }] },
      hints: {
        fitti_passivi: 'La perdita su credito inesigibile è un costo → DARE.',
        crediti_clienti: 'Annulli il credito: l’attività diminuisce → AVERE.',
        banca: 'Non c’è movimento finanziario, è solo una rettifica.',
        iva_debito: 'L’IVA non è coinvolta in questo storno semplificato.',
        cassa: 'Non c’è movimento di cassa.',
      },
      explanation: `Stornando il credito inesigibile, iscrivi la perdita (Fitti passivi / Perdite su crediti → Dare €${fmtEur(c.amount)}) e annulli il credito (Crediti v/clienti → Avere €${fmtEur(c.amount)}).`,
    }),
  },
  {
    id: 'tpl_acq_due_beni_misti',
    difficulty: 'avanzato',
    xp: 150,
    build: (c) => {
      const merci = roundTo(c.amount * 0.6, 10);
      const macchine = c.amount - merci;
      const iva = Math.round(c.amount * IVA_RATE);
      return {
        title: `Acquisto misto merci + bene strumentale + IVA con bonifico (${fmtEur(c.amount)}€ + IVA)`,
        scenario: `In data ${c.date}, ${c.company} acquista da ${c.supplier} merci per €${fmtEur(merci)} e un computer per €${fmtEur(macchine)}, + IVA 22% sul totale, pagando tutto con bonifico. Registra l’operazione.`,
        availableAccounts: ['merci_acquisti', 'macchine', 'iva_credito', 'banca', 'iva_debito'],
        solution: {
          dare: [
            { accountId: 'merci_acquisti', amount: merci },
            { accountId: 'macchine', amount: macchine },
            { accountId: 'iva_credito', amount: iva },
          ],
          avere: [{ accountId: 'banca', amount: c.amount + iva }],
        },
        hints: {
          merci_acquisti: 'Le merci sono un costo → DARE per €${fmtEur(merci)}.',
          macchine: 'Il computer è un bene strumentale → DARE per €${fmtEur(macchine)}.',
          iva_credito: 'L’IVA sull’intero acquisto è recuperabile → DARE per €${fmtEur(iva)}.',
          banca: 'Paghi il totale (imponibili + IVA) con bonifico → AVERE.',
          iva_debito: 'L’IVA a debito riguarda le vendite.',
        },
        explanation: `Acquistando merci e bene strumentale con IVA, registri Merci c/acquisti (€${fmtEur(merci)}), Macchine d’ufficio (€${fmtEur(macchine)}) e IVA a credito (€${fmtEur(iva)}) in Dare, e diminuisci Banca c/c (€${fmtEur(c.amount + iva)}) in Avere.`,
      };
    },
  },
  {
    id: 'tpl_liquidazione_iva_credito',
    difficulty: 'avanzato',
    xp: 150,
    build: (c) => {
      const ivaDebito = Math.round(c.amount * 0.6 * IVA_RATE);
      const ivaCredito = Math.round(c.amount * IVA_RATE);
      const saldo = ivaCredito - ivaDebito;
      return {
        title: `Liquidazione IVA con credito (saldo a credito €${fmtEur(saldo)})`,
        scenario: `In data ${c.date}, ${c.company} procede alla liquidazione IVA periodica. IVA a debito €${fmtEur(ivaDebito)}, IVA a credito €${fmtEur(ivaCredito)}. Il saldo a credito è riportato a periodo successivo. Registra la liquidazione.`,
        availableAccounts: ['iva_debito', 'iva_credito', 'banca', 'cassa', 'debiti_vari'],
        solution: {
          dare: [
            { accountId: 'iva_debito', amount: ivaDebito },
            { accountId: 'iva_credito', amount: saldo },
          ],
          avere: [{ accountId: 'iva_credito', amount: ivaCredito }],
        },
        hints: {
          iva_debito: 'Chiudi l’IVA a debito: il passivo diminuisce → DARE per €${fmtEur(ivaDebito)}.',
          iva_credito: 'Utilizzi parte dell’IVA a credito per compensare → AVERE per €${fmtEur(ivaDebito)}. La parte residua è riportata → DARE per €${fmtEur(saldo)}.',
          banca: 'Non c’è versamento, il saldo è a credito riportato.',
          cassa: 'Non c’è movimento di cassa.',
          debiti_vari: 'Non nasce un nuovo debito.',
        },
        explanation: `In liquidazione IVA con saldo a credito, chiudi IVA a debito (Dare €${fmtEur(ivaDebito)}), compensi con IVA a credito (Avere €${fmtEur(ivaCredito)}), e riporti il saldo a credito a periodo successivo (IVA a credito → Dare €${fmtEur(saldo)}).`,
      };
    },
  },
  {
    id: 'tpl_apertura_e_chiusura_mista',
    difficulty: 'avanzato',
    xp: 170,
    build: (c) => {
      const acquisti = c.amount;
      const vendite = roundTo(c.amount * 1.5, 10);
      const utile = vendite - acquisti;
      return {
        title: `Chiusura con utile e riapertura conti (utile €${fmtEur(utile)})`,
        scenario: `In data ${c.date}, ${c.company} chiude l’esercizio con Merci c/acquisti €${fmtEur(acquisti)} e Merci c/vendite €${fmtEur(vendite)}. Registra la chiusura dei conti economici e l’iscrizione dell’utile nel patrimonio netto.`,
        availableAccounts: ['merci_vendite', 'merci_acquisti', 'capitale', 'banca', 'iva_debito'],
        solution: {
          dare: [{ accountId: 'merci_vendite', amount: vendite }],
          avere: [
            { accountId: 'merci_acquisti', amount: acquisti },
            { accountId: 'capitale', amount: utile },
          ],
        },
        hints: {
          merci_vendite: 'Chiudi il ricavo: il ricavo diminuisce → DARE per €${fmtEur(vendite)}.',
          merci_acquisti: 'Chiudi il costo: il costo diminuisce → AVERE per €${fmtEur(acquisti)}.',
          capitale: 'L’utile accresce il patrimonio netto → AVERE per €${fmtEur(utile)}.',
          banca: 'La chiusura non comporta movimento finanziario.',
          iva_debito: 'L’IVA non è coinvolta in chiusura.',
        },
        explanation: `In chiusura, chiudi Merci c/vendite (Dare €${fmtEur(vendite)}) e scarichi Merci c/acquisti (Avere €${fmtEur(acquisti)}). L’utile d’esercizio (€${fmtEur(utile)}) accresce il patrimonio netto (Capitale → Avere).`,
      };
    },
  },
  {
    id: 'tpl_riapertura_post_chiusura',
    difficulty: 'avanzato',
    xp: 170,
    build: (c) => {
      const cassa = roundTo(c.amount * 0.2, 10);
      const banca = roundTo(c.amount * 0.5, 10);
      const macchine = roundTo(c.amount * 0.3, 10);
      const totale = cassa + banca + macchine;
      return {
        title: `Riapertura conti dopo chiusura (patrimonio netto €${fmtEur(totale)})`,
        scenario: `In data ${c.date}, ${c.company} riapre i conti patrimoniali per il nuovo esercizio: Cassa €${fmtEur(cassa)}, Banca c/c €${fmtEur(banca)}, Macchine d’ufficio €${fmtEur(macchine)}. Registra la riapertura.`,
        availableAccounts: ['cassa', 'banca', 'macchine', 'capitale', 'merci_acquisti'],
        solution: {
          dare: [
            { accountId: 'cassa', amount: cassa },
            { accountId: 'banca', amount: banca },
            { accountId: 'macchine', amount: macchine },
          ],
          avere: [{ accountId: 'capitale', amount: totale }],
        },
        hints: {
          cassa: 'Riapri Cassa: l’attività aumenta → DARE.',
          banca: 'Riapri Banca: l’attività aumenta → DARE.',
          macchine: 'Riapri Macchine: l’attività aumenta → DARE.',
          capitale: 'Il patrimonio netto di apertura aumenta → AVERE per il totale.',
          merci_acquisti: 'I conti economici non si riaprono.',
        },
        explanation: `Riaprendo i conti, iscrivi tutte le attività in Dare (Cassa €${fmtEur(cassa)}, Banca €${fmtEur(banca)}, Macchine €${fmtEur(macchine)}) e il patrimonio netto di apertura in Avere (Capitale €${fmtEur(totale)}).`,
      };
    },
  },
  {
    id: 'tpl_perdita_esercizio',
    difficulty: 'avanzato',
    xp: 160,
    build: (c) => {
      const acquisti = c.amount;
      const vendite = roundTo(c.amount * 0.7, 10);
      const perdita = acquisti - vendite;
      return {
        title: `Chiusura con perdita d’esercizio (perdita €${fmtEur(perdita)})`,
        scenario: `In data ${c.date}, ${c.company} chiude l’esercizio con Merci c/acquisti €${fmtEur(acquisti)} e Merci c/vendite €${fmtEur(vendite)}. Registra la chiusura e l’iscrizione della perdita a riduzione del patrimonio netto.`,
        availableAccounts: ['merci_vendite', 'merci_acquisti', 'capitale', 'banca', 'iva_debito'],
        solution: {
          dare: [
            { accountId: 'merci_vendite', amount: vendite },
            { accountId: 'capitale', amount: perdita },
          ],
          avere: [{ accountId: 'merci_acquisti', amount: acquisti }],
        },
        hints: {
          merci_vendite: 'Chiudi il ricavo: il ricavo diminuisce → DARE per €${fmtEur(vendite)}.',
          merci_acquisti: 'Chiudi il costo: il costo diminuisce → AVERE per €${fmtEur(acquisti)}.',
          capitale: 'La perdita riduce il patrimonio netto → DARE per €${fmtEur(perdita)}.',
          banca: 'La chiusura non comporta movimento finanziario.',
          iva_debito: 'L’IVA non è coinvolta in chiusura.',
        },
        explanation: `In chiusura con perdita, chiudi Merci c/vendite (Dare €${fmtEur(vendite)}) e iscrivi la perdita a riduzione del patrimonio netto (Capitale → Dare €${fmtEur(perdita)}); scarichi Merci c/acquisti (Avere €${fmtEur(acquisti)}).`,
      };
    },
  },
];

// ============================================================
// Generator function
// ============================================================

export function generateExercise(difficulty: Difficulty, seedKey: string): Exercise {
  const pool = TEMPLATES.filter(t => t.difficulty === difficulty);
  const tpl = pool[hashStr(seedKey) % pool.length];

  const rng = makeRng(hashStr(seedKey) + tpl.id.length);
  const amount = roundTo(50 + Math.floor(rng() * 7450), 10);
  const ctx: GeneratorContext = {
    company: pick(COMPANIES, Math.floor(rng() * COMPANIES.length)),
    supplier: pick(SUPPLIERS, Math.floor(rng() * SUPPLIERS.length)),
    customer: pick(CUSTOMERS, Math.floor(rng() * CUSTOMERS.length)),
    date: fmtDate(rng),
    amount,
    iva: Math.round(amount * IVA_RATE),
    qty: 1 + Math.floor(rng() * 20),
    rate: roundTo(0.05 + rng() * 0.3, 0.01),
    months: 1 + Math.floor(rng() * 12),
  };

  const built = tpl.build(ctx);
  return {
    id: `gen_${tpl.id}_${seedKey}`,
    title: built.title,
    scenario: built.scenario,
    availableAccounts: built.availableAccounts,
    solution: built.solution,
    hints: built.hints,
    explanation: built.explanation,
    xp: tpl.xp,
    difficulty: tpl.difficulty,
  };
}

export const TEMPLATE_COUNT = TEMPLATES.length;
export const TEMPLATE_BREAKDOWN: Record<Difficulty, number> = {
  base: TEMPLATES.filter(t => t.difficulty === 'base').length,
  intermedio: TEMPLATES.filter(t => t.difficulty === 'intermedio').length,
  avanzato: TEMPLATES.filter(t => t.difficulty === 'avanzato').length,
};
