import type { Exercise } from '../types';

interface Template {
  id: string;
  title: (amount: number, idx: number) => string;
  scenario: (amount: number, idx: number) => string;
  availableAccounts: string[];
  solution: (amount: number, idx: number) => { dare: { accountId: string; amount: number }[]; avere: { accountId: string; amount: number }[] };
  hints: Record<string, string>;
  explanation: (amount: number) => string;
  xp: number;
  difficulty: 'base' | 'intermedio' | 'avanzato';
}

const IVA_RATE = 0.22;

const TEMPLATES: Template[] = [
  {
    id: 'acq_merci_cassa',
    title: (a) => `Acquisto merci per ${a}€ in contanti`,
    scenario: (a) => `La tua azienda acquista merci per €${a}, pagando subito in contanti. Registra l'operazione.`,
    availableAccounts: ['merci_acquisti', 'cassa', 'banca', 'merci_vendite', 'crediti_clienti'],
    solution: (a) => ({ dare: [{ accountId: 'merci_acquisti', amount: a }], avere: [{ accountId: 'cassa', amount: a }] }),
    hints: {
      merci_acquisti: 'Le merci acquistate per la rivendita sono un costo. Un costo che aumenta → DARE.',
      cassa: 'Paghi in contanti: il saldo cassa DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      banca: 'Hai pagato in contanti, non con bonifico. La banca non è coinvolta.',
      merci_vendite: 'Stai acquistando, non vendendo. Questo conto registra le vendite.',
      crediti_clienti: 'Nessun credito verso clienti in questa operazione.',
    },
    explanation: (a) => `Acquistando merci in contanti, aumenti il costo Merci c/acquisti (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${a}.`,
    xp: 50,
    difficulty: 'base',
  },
  {
    id: 'acq_merci_banca',
    title: (a) => `Acquisto merci per ${a}€ con bonifico`,
    scenario: (a) => `La tua azienda acquista merci per €${a}, pagando subito tramite bonifico bancario. Registra l'operazione.`,
    availableAccounts: ['merci_acquisti', 'banca', 'cassa', 'merci_vendite', 'debiti_fornitori'],
    solution: (a) => ({ dare: [{ accountId: 'merci_acquisti', amount: a }], avere: [{ accountId: 'banca', amount: a }] }),
    hints: {
      merci_acquisti: 'Le merci acquistate sono un costo. Un costo che aumenta → DARE.',
      banca: 'Paghi con bonifico: il saldo bancario DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      cassa: 'Hai pagato con bonifico, non in contanti. Cassa non è coinvolta.',
      merci_vendite: 'Stai acquistando, non vendendo.',
      debiti_fornitori: 'Hai pagato subito, non nasce alcun debito.',
    },
    explanation: (a) => `Acquistando merci con bonifico, aumenti Merci c/acquisti (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${a}.`,
    xp: 50,
    difficulty: 'base',
  },
  {
    id: 'acq_merci_credito',
    title: (a) => `Acquisto merci per ${a}€ a credito`,
    scenario: (a) => `La tua azienda acquista merci per €${a} con pagamento a 30 giorni. Registra la fattura oggi.`,
    availableAccounts: ['merci_acquisti', 'debiti_fornitori', 'banca', 'cassa', 'crediti_clienti'],
    solution: (a) => ({ dare: [{ accountId: 'merci_acquisti', amount: a }], avere: [{ accountId: 'debiti_fornitori', amount: a }] }),
    hints: {
      merci_acquisti: 'Le merci acquistate sono un costo che aumenta → DARE.',
      debiti_fornitori: 'Non hai ancora pagato: nasce un debito verso il fornitore. Un passivo che aumenta → AVERE.',
      banca: 'Non hai pagato ora, il pagamento è a 30 giorni. La banca non è coinvolta.',
      cassa: 'Non hai pagato in contanti.',
      crediti_clienti: 'I crediti riguardano le vendite, non gli acquisti.',
    },
    explanation: (a) => `Acquistando merci a credito, aumenti Merci c/acquisti (Dare) e aumenti Debiti v/fornitori (Avere). I due lati si bilanciano a €${a}.`,
    xp: 60,
    difficulty: 'base',
  },
  {
    id: 'ven_merci_cassa',
    title: (a) => `Vendita merci per ${a}€ in contanti`,
    scenario: (a) => `Hai venduto merci per €${a}, incassando subito in contanti. Registra l'operazione.`,
    availableAccounts: ['cassa', 'merci_vendite', 'banca', 'merci_acquisti', 'debiti_fornitori'],
    solution: (a) => ({ dare: [{ accountId: 'cassa', amount: a }], avere: [{ accountId: 'merci_vendite', amount: a }] }),
    hints: {
      cassa: 'Ricevi contanti: Cassa AUMENTA. Un\'attività che aumenta → DARE.',
      merci_vendite: 'La vendita genera un ricavo. Un ricavo ha saldo normale in Avere → AVERE.',
      banca: 'Hai incassato in contanti, non tramite banca.',
      merci_acquisti: 'Questo conto registra gli acquisti, non le vendite.',
      debiti_fornitori: 'Nessun debito verso fornitori in questa operazione.',
    },
    explanation: (a) => `Vendendo merci in contanti, aumenti Cassa (Dare) e registri il ricavo Merci c/vendite (Avere). I due lati si bilanciano a €${a}.`,
    xp: 50,
    difficulty: 'base',
  },
  {
    id: 'ven_merci_banca',
    title: (a) => `Vendita merci per ${a}€ con bonifico`,
    scenario: (a) => `Hai venduto merci per €${a}, incassando subito tramite bonifico. Registra l'operazione.`,
    availableAccounts: ['banca', 'merci_vendite', 'cassa', 'merci_acquisti', 'crediti_clienti'],
    solution: (a) => ({ dare: [{ accountId: 'banca', amount: a }], avere: [{ accountId: 'merci_vendite', amount: a }] }),
    hints: {
      banca: 'Ricevi un bonifico: Banca AUMENTA. Un\'attività che aumenta → DARE.',
      merci_vendite: 'La vendita genera un ricavo. Un ricavo ha saldo normale in Avere → AVERE.',
      cassa: 'Hai incassato con bonifico, non in contanti.',
      merci_acquisti: 'Questo conto registra gli acquisti, non le vendite.',
      crediti_clienti: 'Il cliente ha pagato subito, non nasce alcun credito.',
    },
    explanation: (a) => `Vendendo merci con bonifico, aumenti Banca c/c (Dare) e registri Merci c/vendite (Avere). I due lati si bilanciano a €${a}.`,
    xp: 55,
    difficulty: 'base',
  },
  {
    id: 'ven_merci_credito',
    title: (a) => `Vendita merci per ${a}€ a credito`,
    scenario: (a) => `Hai venduto merci per €${a} con incasso a 30 giorni. Registra la fattura oggi.`,
    availableAccounts: ['crediti_clienti', 'merci_vendite', 'cassa', 'banca', 'debiti_fornitori'],
    solution: (a) => ({ dare: [{ accountId: 'crediti_clienti', amount: a }], avere: [{ accountId: 'merci_vendite', amount: a }] }),
    hints: {
      crediti_clienti: 'Il cliente pagherà tra 30 giorni: nasce un credito. Un\'attività che aumenta → DARE.',
      merci_vendite: 'La vendita genera un ricavo. Un ricavo ha saldo normale in Avere → AVERE.',
      cassa: 'Non hai ancora incassato. Cassa non è coinvolta ora.',
      banca: 'Non hai ancora incassato. Banca non è coinvolta ora.',
      debiti_fornitori: 'I debiti verso fornitori riguardano gli acquisti, non le vendite.',
    },
    explanation: (a) => `Vendendo merci a credito, aumenti Crediti v/clienti (Dare) e registri Merci c/vendite (Avere). I due lati si bilanciano a €${a}.`,
    xp: 60,
    difficulty: 'base',
  },
  {
    id: 'acq_computer_cassa',
    title: (a) => `Acquisto bene strumentale per ${a}€ in contanti`,
    scenario: (a) => `Acquisti un computer per €${a}, pagando subito in contanti. Registra l'operazione.`,
    availableAccounts: ['macchine', 'cassa', 'banca', 'merci_acquisti', 'fitti_passivi'],
    solution: (a) => ({ dare: [{ accountId: 'macchine', amount: a }], avere: [{ accountId: 'cassa', amount: a }] }),
    hints: {
      macchine: 'Il computer è un bene strumentale (attività). Acquistarlo AUMENTA le attività → DARE.',
      cassa: 'Paghi in contanti: Cassa DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      banca: 'Hai pagato in contanti, non con bonifico.',
      merci_acquisti: 'Il computer non è merce da rivendere, è un bene strumentale. Usa Macchine d\'ufficio.',
      fitti_passivi: 'L\'affitto non c\'entra con questo acquisto.',
    },
    explanation: (a) => `Acquistando un computer in contanti, aumenti Macchine d'ufficio (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${a}.`,
    xp: 70,
    difficulty: 'intermedio',
  },
  {
    id: 'acq_computer_banca',
    title: (a) => `Acquisto bene strumentale per ${a}€ con bonifico`,
    scenario: (a) => `Acquisti un computer per €${a}, pagando subito tramite bonifico. Registra l'operazione.`,
    availableAccounts: ['macchine', 'banca', 'cassa', 'merci_acquisti', 'crediti_clienti'],
    solution: (a) => ({ dare: [{ accountId: 'macchine', amount: a }], avere: [{ accountId: 'banca', amount: a }] }),
    hints: {
      macchine: 'Il computer è un bene strumentale. Acquistarlo AUMENTA le attività → DARE.',
      banca: 'Paghi con bonifico: Banca DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      cassa: 'Hai pagato con bonifico, non in contanti.',
      merci_acquisti: 'Il computer non è merce da rivendere.',
      crediti_clienti: 'I crediti verso clienti non c\'entrano con questo acquisto.',
    },
    explanation: (a) => `Acquistando un computer con bonifico, aumenti Macchine d'ufficio (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${a}.`,
    xp: 70,
    difficulty: 'intermedio',
  },
  {
    id: 'affitto_cassa',
    title: (a) => `Pagamento affitto ${a}€ in contanti`,
    scenario: (a) => `Paghi in contanti l'affitto mensile dell'ufficio di €${a}. Registra l'operazione.`,
    availableAccounts: ['fitti_passivi', 'cassa', 'banca', 'debiti_vari', 'debiti_fornitori'],
    solution: (a) => ({ dare: [{ accountId: 'fitti_passivi', amount: a }], avere: [{ accountId: 'cassa', amount: a }] }),
    hints: {
      fitti_passivi: 'L\'affitto è un costo. Un costo che aumenta → DARE.',
      cassa: 'Paghi in contanti: Cassa DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      banca: 'Hai pagato in contanti, non con bonifico.',
      debiti_vari: 'Hai pagato subito, non nasce alcun debito.',
      debiti_fornitori: 'I debiti v/fornitori riguardano acquisti commerciali, non l\'affitto.',
    },
    explanation: (a) => `Pagando l'affitto in contanti, aumenti Fitti passivi (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${a}.`,
    xp: 65,
    difficulty: 'intermedio',
  },
  {
    id: 'affitto_banca',
    title: (a) => `Pagamento affitto ${a}€ con bonifico`,
    scenario: (a) => `Paghi con bonifico l'affitto mensile dell'ufficio di €${a}. Registra l'operazione.`,
    availableAccounts: ['fitti_passivi', 'banca', 'cassa', 'debiti_vari', 'merci_acquisti'],
    solution: (a) => ({ dare: [{ accountId: 'fitti_passivi', amount: a }], avere: [{ accountId: 'banca', amount: a }] }),
    hints: {
      fitti_passivi: 'L\'affitto è un costo. Un costo che aumenta → DARE.',
      banca: 'Paghi con bonifico: Banca DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      cassa: 'Hai pagato con bonifico, non in contanti.',
      debiti_vari: 'Hai pagato subito, non nasce alcun debito.',
      merci_acquisti: 'L\'affitto non è un acquisto di merci.',
    },
    explanation: (a) => `Pagando l'affitto con bonifico, aumenti Fitti passivi (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${a}.`,
    xp: 65,
    difficulty: 'intermedio',
  },
  {
    id: 'affitto_credito',
    title: (a) => `Fattura affitto ${a}€ a credito`,
    scenario: (a) => `Ricevi la fattura dell'affitto mensile di €${a}, pagamento a 30 giorni. Registra la fattura oggi.`,
    availableAccounts: ['fitti_passivi', 'debiti_vari', 'banca', 'cassa', 'debiti_fornitori'],
    solution: (a) => ({ dare: [{ accountId: 'fitti_passivi', amount: a }], avere: [{ accountId: 'debiti_vari', amount: a }] }),
    hints: {
      fitti_passivi: 'L\'affitto è un costo che aumenta → DARE.',
      debiti_vari: 'Non hai ancora pagato: nasce un debito verso il locatore. Un passivo che aumenta → AVERE.',
      banca: 'Non hai pagato ora, il pagamento è a 30 giorni.',
      cassa: 'Non hai pagato in contanti.',
      debiti_fornitori: 'Per l\'affitto si usa Debiti diversi, non Debiti v/fornitori.',
    },
    explanation: (a) => `Ricevendo la fattura dell'affitto, aumenti Fitti passivi (Dare) e aumenti Debiti diversi (Avere). I due lati si bilanciano a €${a}.`,
    xp: 75,
    difficulty: 'intermedio',
  },
  {
    id: 'capitale_cassa',
    title: (a) => `Versamento capitale ${a}€ in contanti`,
    scenario: (a) => `Un socio versa €${a} in contanti come aumento di capitale sociale. Registra l'operazione.`,
    availableAccounts: ['cassa', 'capitale', 'banca', 'crediti_clienti', 'merci_vendite'],
    solution: (a) => ({ dare: [{ accountId: 'cassa', amount: a }], avere: [{ accountId: 'capitale', amount: a }] }),
    hints: {
      cassa: 'Ricevi contanti: Cassa AUMENTA. Un\'attività che aumenta → DARE.',
      capitale: 'Il capitale sociale è patrimonio netto con saldo normale in Avere. Un aumento → AVERE.',
      banca: 'Il versamento è in contanti, non in banca.',
      crediti_clienti: 'I crediti verso clienti non c\'entrano con il capitale.',
      merci_vendite: 'Non è una vendita di merci.',
    },
    explanation: (a) => `Versando capitale in contanti, aumenti Cassa (Dare) e aumenti Capitale sociale (Avere). I due lati si bilanciano a €${a}.`,
    xp: 80,
    difficulty: 'intermedio',
  },
  {
    id: 'capitale_banca',
    title: (a) => `Versamento capitale ${a}€ con bonifico`,
    scenario: (a) => `Un socio versa €${a} tramite bonifico come aumento di capitale sociale. Registra l'operazione.`,
    availableAccounts: ['banca', 'capitale', 'cassa', 'crediti_clienti', 'merci_vendite'],
    solution: (a) => ({ dare: [{ accountId: 'banca', amount: a }], avere: [{ accountId: 'capitale', amount: a }] }),
    hints: {
      banca: 'Ricevi un bonifico: Banca AUMENTA. Un\'attività che aumenta → DARE.',
      capitale: 'Il capitale sociale è patrimonio netto con saldo normale in Avere. Un aumento → AVERE.',
      cassa: 'Il versamento è in banca, non in contanti.',
      crediti_clienti: 'I crediti verso clienti non c\'entrano con il capitale.',
      merci_vendite: 'Non è una vendita di merci.',
    },
    explanation: (a) => `Versando capitale con bonifico, aumenti Banca c/c (Dare) e aumenti Capitale sociale (Avere). I due lati si bilanciano a €${a}.`,
    xp: 80,
    difficulty: 'intermedio',
  },
  {
    id: 'incasso_credito_cassa',
    title: (a) => `Incasso credito cliente ${a}€ in contanti`,
    scenario: (a) => `Un cliente paga in contanti €${a} per una fattura precedente. Registra l'incasso.`,
    availableAccounts: ['cassa', 'crediti_clienti', 'banca', 'merci_vendite', 'debiti_fornitori'],
    solution: (a) => ({ dare: [{ accountId: 'cassa', amount: a }], avere: [{ accountId: 'crediti_clienti', amount: a }] }),
    hints: {
      cassa: 'Ricevi contanti: Cassa AUMENTA. Un\'attività che aumenta → DARE.',
      crediti_clienti: 'Incassi un credito precedente: il credito DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      banca: 'Hai incassato in contanti, non in banca.',
      merci_vendite: 'La vendita era già registrata. Ora incassi solo il credito.',
      debiti_fornitori: 'I debiti verso fornitori non c\'entrano con questo incasso.',
    },
    explanation: (a) => `Incassando un credito in contanti, aumenti Cassa (Dare) e diminuisci Crediti v/clienti (Avere). I due lati si bilanciano a €${a}.`,
    xp: 75,
    difficulty: 'intermedio',
  },
  {
    id: 'incasso_credito_banca',
    title: (a) => `Incasso credito cliente ${a}€ con bonifico`,
    scenario: (a) => `Un cliente paga con bonifico €${a} per una fattura precedente. Registra l'incasso.`,
    availableAccounts: ['banca', 'crediti_clienti', 'cassa', 'merci_vendite', 'debiti_fornitori'],
    solution: (a) => ({ dare: [{ accountId: 'banca', amount: a }], avere: [{ accountId: 'crediti_clienti', amount: a }] }),
    hints: {
      banca: 'Ricevi un bonifico: Banca AUMENTA. Un\'attività che aumenta → DARE.',
      crediti_clienti: 'Incassi un credito precedente: il credito DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      cassa: 'Hai incassato con bonifico, non in contanti.',
      merci_vendite: 'La vendita era già registrata.',
      debiti_fornitori: 'I debiti verso fornitori non c\'entrano con questo incasso.',
    },
    explanation: (a) => `Incassando un credito con bonifico, aumenti Banca c/c (Dare) e diminuisci Crediti v/clienti (Avere). I due lati si bilanciano a €${a}.`,
    xp: 75,
    difficulty: 'intermedio',
  },
  {
    id: 'pag_debito_forn_cassa',
    title: (a) => `Pagamento debito fornitore ${a}€ in contanti`,
    scenario: (a) => `Paghi in contanti €${a} a un fornitore per una fattura precedente. Registra il pagamento.`,
    availableAccounts: ['debiti_fornitori', 'cassa', 'banca', 'merci_acquisti', 'crediti_clienti'],
    solution: (a) => ({ dare: [{ accountId: 'debiti_fornitori', amount: a }], avere: [{ accountId: 'cassa', amount: a }] }),
    hints: {
      debiti_fornitori: 'Paghi un debito precedente: il debito DIMINUISCE. Un passivo che diminuisce → DARE.',
      cassa: 'Paghi in contanti: Cassa DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      banca: 'Hai pagato in contanti, non con bonifico.',
      merci_acquisti: 'L\'acquisto era già registrato. Ora paghi solo il debito.',
      crediti_clienti: 'I crediti verso clienti non c\'entrano con questo pagamento.',
    },
    explanation: (a) => `Pagando un debito in contanti, diminuisci Debiti v/fornitori (Dare) e diminuisci Cassa (Avere). I due lati si bilanciano a €${a}.`,
    xp: 75,
    difficulty: 'intermedio',
  },
  {
    id: 'pag_debito_forn_banca',
    title: (a) => `Pagamento debito fornitore ${a}€ con bonifico`,
    scenario: (a) => `Paghi con bonifico €${a} a un fornitore per una fattura precedente. Registra il pagamento.`,
    availableAccounts: ['debiti_fornitori', 'banca', 'cassa', 'merci_acquisti', 'crediti_clienti'],
    solution: (a) => ({ dare: [{ accountId: 'debiti_fornitori', amount: a }], avere: [{ accountId: 'banca', amount: a }] }),
    hints: {
      debiti_fornitori: 'Paghi un debito precedente: il debito DIMINUISCE. Un passivo che diminuisce → DARE.',
      banca: 'Paghi con bonifico: Banca DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      cassa: 'Hai pagato con bonifico, non in contanti.',
      merci_acquisti: 'L\'acquisto era già registrato.',
      crediti_clienti: 'I crediti verso clienti non c\'entrano con questo pagamento.',
    },
    explanation: (a) => `Pagando un debito con bonifico, diminuisci Debiti v/fornitori (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${a}.`,
    xp: 75,
    difficulty: 'intermedio',
  },
  {
    id: 'pag_debito_vario_banca',
    title: (a) => `Pagamento debito vario ${a}€ con bonifico`,
    scenario: (a) => `Paghi con bonifico €${a} per saldare un debito diverso (es. affitto precedentemente fatturato). Registra il pagamento.`,
    availableAccounts: ['debiti_vari', 'banca', 'cassa', 'fitti_passivi', 'debiti_fornitori'],
    solution: (a) => ({ dare: [{ accountId: 'debiti_vari', amount: a }], avere: [{ accountId: 'banca', amount: a }] }),
    hints: {
      debiti_vari: 'Paghi un debito diverso: il debito DIMINUISCE. Un passivo che diminuisce → DARE.',
      banca: 'Paghi con bonifico: Banca DIMINUISCE. Un\'attività che diminuisce → AVERE.',
      cassa: 'Hai pagato con bonifico, non in contanti.',
      fitti_passivi: 'Il costo dell\'affitto era già registrato. Ora paghi solo il debito.',
      debiti_fornitori: 'Questo debito è verso il locatore, non verso fornitori commerciali. Usa Debiti diversi.',
    },
    explanation: (a) => `Pagando un debito diverso con bonifico, diminuisci Debiti diversi (Dare) e diminuisci Banca c/c (Avere). I due lati si bilanciano a €${a}.`,
    xp: 80,
    difficulty: 'avanzato',
  },
  {
    id: 'acq_merci_iva_banca',
    title: (a) => `Acquisto merci ${a}€ + IVA con bonifico`,
    scenario: (a) => `Acquisti merci per €${a} + IVA 22%, pagando subito con bonifico. Registra l'operazione separando la base imponibile e l'IVA a credito.`,
    availableAccounts: ['merci_acquisti', 'iva_credito', 'banca', 'cassa', 'iva_debito'],
    solution: (a) => ({
      dare: [
        { accountId: 'merci_acquisti', amount: a },
        { accountId: 'iva_credito', amount: Math.round(a * IVA_RATE) },
      ],
      avere: [{ accountId: 'banca', amount: a + Math.round(a * IVA_RATE) }],
    }),
    hints: {
      merci_acquisti: 'La base imponibile (costo merci) è un costo che aumenta → DARE.',
      iva_credito: 'L\'IVA pagata sugli acquisti è recuperabile: IVA a credito AUMENTA. Un\'attività che aumenta → DARE.',
      banca: 'Paghi il totale (merci + IVA) con bonifico: Banca DIMINUISCE → AVERE.',
      cassa: 'Hai pagato con bonifico, non in contanti.',
      iva_debito: 'L\'IVA a debito riguarda le vendite, non gli acquisti.',
    },
    explanation: (a) => `Acquistando merci con IVA, aumenti Merci c/acquisti (€${a}) e IVA a credito (€${Math.round(a * IVA_RATE)}) in Dare, e diminuisci Banca c/c (€${a + Math.round(a * IVA_RATE)}) in Avere. I due lati si bilanciano.`,
    xp: 100,
    difficulty: 'avanzato',
  },
  {
    id: 'ven_merci_iva_cassa',
    title: (a) => `Vendita merci ${a}€ + IVA in contanti`,
    scenario: (a) => `Vendi merci per €${a} + IVA 22%, incassando subito in contanti. Registra l'operazione separando la base imponibile e l'IVA a debito.`,
    availableAccounts: ['cassa', 'merci_vendite', 'iva_debito', 'banca', 'iva_credito'],
    solution: (a) => ({
      dare: [{ accountId: 'cassa', amount: a + Math.round(a * IVA_RATE) }],
      avere: [
        { accountId: 'merci_vendite', amount: a },
        { accountId: 'iva_debito', amount: Math.round(a * IVA_RATE) },
      ],
    }),
    hints: {
      cassa: 'Incassi il totale (merci + IVA) in contanti: Cassa AUMENTA → DARE.',
      merci_vendite: 'La base imponibile è un ricavo con saldo normale in Avere → AVERE.',
      iva_debito: 'L\'IVA incassata sulle vendite è da versare allo Stato: IVA a debito AUMENTA. Un passivo che aumenta → AVERE.',
      banca: 'Hai incassato in contanti, non con bonifico.',
      iva_credito: 'L\'IVA a credito riguarda gli acquisti, non le vendite.',
    },
    explanation: (a) => `Vendendo merci con IVA, aumenti Cassa (€${a + Math.round(a * IVA_RATE)}) in Dare, e registri Merci c/vendite (€${a}) e IVA a debito (€${Math.round(a * IVA_RATE)}) in Avere. I due lati si bilanciano.`,
    xp: 100,
    difficulty: 'avanzato',
  },
];

const AMOUNTS: number[] = [
  50, 80, 100, 120, 150, 180, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650,
  700, 750, 800, 850, 900, 950, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700,
  1800, 1900, 2000, 2200, 2400, 2500, 2600, 2800, 3000, 3200, 3500, 3800, 4000,
  4500, 5000, 5500, 6000, 6500, 7000, 7500,
];

export function generateExercises(count: number): Exercise[] {
  const out: Exercise[] = [];
  let idx = 0;
  let amountIdx = 0;
  while (out.length < count) {
    const tpl = TEMPLATES[idx % TEMPLATES.length];
    const amount = AMOUNTS[amountIdx % AMOUNTS.length];
    const variation = Math.floor(idx / TEMPLATES.length);
    const id = `gen_${tpl.id}_${idx + 1}`;
    const titleSuffix = variation > 0 ? ` (var. ${variation + 1})` : '';
    out.push({
      id,
      title: `${tpl.title(amount, idx)}${titleSuffix}`,
      scenario: tpl.scenario(amount, idx),
      availableAccounts: tpl.availableAccounts,
      solution: tpl.solution(amount, idx),
      hints: tpl.hints,
      explanation: tpl.explanation(amount),
      xp: tpl.xp,
      difficulty: tpl.difficulty,
    });
    idx++;
    if (idx % TEMPLATES.length === 0) amountIdx++;
  }
  return out;
}

export const GENERATED_EXERCISES: Exercise[] = generateExercises(1000);
