import type { DiagnosticQuestion } from '../types';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'dq1',
    prompt: 'Dove si registra l\'IVA a credito in una fattura di acquisto?',
    options: [
      'In Avere, perché è un debito verso lo Stato',
      'In Dare, perché è un credito che attendiamo di compensare',
      'Non si registra, si scarica direttamente a costo',
      'In Dare solo se supera i 1.000€',
    ],
    correctIndex: 1,
    explanation:
      'L\'IVA a credito è un diritto di rivalsa nei confronti dello Stato. I crediti aumentano in Dare, quindi si iscrive in Dare.',
  },
  {
    id: 'dq2',
    prompt: 'In una vendita di merci a credito (con IVA), quali conti si muovono in Avere?',
    options: [
      'Solo Crediti v/clienti',
      'Merci c/vendite + IVA a debito',
      'Cassa + IVA a credito',
      'Merci c/acquisti + IVA a debito',
    ],
    correctIndex: 1,
    explanation:
      'Nasce un ricavo (Merci c/vendite in Avere) e un debito IVA verso lo Stato (IVA a debito in Avere). Il credito verso il cliente va in Dare.',
  },
  {
    id: 'dq3',
    prompt: 'A fine esercizio devo registrare un rateo attivo. Cosa significa?',
    options: [
      'Un costo già sostenuto ma di competenza del prossimo esercizio',
      'Un ricavo già incassato ma di competenza di quest\'anno',
      'Un costo sostenuto in quest\'anno ma di competenza del prossimo esercizio',
      'Un componente positivo che sarà formalizzato nel prossimo esercizio',
    ],
    correctIndex: 3,
    explanation:
      'Il rateo attivo è un componente positivo (pro quota ricavo) già maturato nell\'esercizio, ma la cui formalizzazione avverrà in quello successivo. Si iscrive nell\'attivo di stato patrimoniale.',
  },
];
