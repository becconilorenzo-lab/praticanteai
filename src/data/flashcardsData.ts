export type FlashcardCategory = 'Diritto Tributario' | 'Diritto Commerciale' | 'Ragioneria' | 'Crisi d\'Impresa';

export type FlashcardRating = 'da_rivedere' | 'dubbio' | 'padroneggiato';

export interface Flashcard {
  id: string;
  category: FlashcardCategory;
  topic: string;
  question: string;
  bulletPoints: string[];
  normativa?: string;
  difficulty: 'Base' | 'Intermedio' | 'Avanzato';
}

export const FLASHCARD_CATEGORIES: FlashcardCategory[] = [
  'Diritto Tributario',
  'Diritto Commerciale',
  'Ragioneria',
  'Crisi d\'Impresa',
];

export const FLASHCARDS_DATA: Flashcard[] = [
  // ── Diritto Tributario ──────────────────────────────────────────────────
  {
    id: 'trib-01',
    category: 'Diritto Tributario',
    topic: 'Regime Participation Exemption (PEX)',
    difficulty: 'Intermedio',
    normativa: 'Art. 87 TUIR',
    question: 'Quali sono i quattro requisiti tassativi affinché una plusvalenza su partecipazione societaria fruisca del regime di Participation Exemption (PEX) ex art. 87 TUIR?',
    bulletPoints: [
      'Ininterrotto possesso (Holding period): la partecipazione deve essere posseduta ininterrottamente dal primo giorno del dodicesimo mese precedente la cessione (metodo LIFO per cessioni parziali).',
      'Classificazione in bilancio: la partecipazione deve essere iscritta tra le immobilizzazioni finanziarie nel primo bilancio chiuso durante il periodo di possesso.',
      'Residenza fiscale non privilegiata: la partecipata non deve essere localizzata in uno Stato o territorio a regime fiscale privilegiato (white list / art. 47-bis TUIR), requisito verificabile al momento del realizzo e per il triennio precedente.',
      'Commercialità: la partecipata deve esercitare un\'effettiva attività d\'impresa commerciale ai sensi dell\'art. 55 TUIR (escluse le società con prevalenza di beni immobili patrimoniali locati).',
      'Trattamento fiscale conseguente: esenzione del 95% della plusvalenza realizzata da soggetti IRES (imponibile solo per il 5%). Contestuale indeducibilità delle minusvalenze ex art. 86 co. 2 TUIR.',
    ],
  },
  {
    id: 'trib-02',
    category: 'Diritto Tributario',
    topic: 'Riporto delle Perdite Fiscali IRES',
    difficulty: 'Intermedio',
    normativa: 'Art. 84 TUIR',
    question: 'Esponga la disciplina generale del riporto delle perdite fiscali ai fini IRES, indicando i limiti quantitativi, temporali e le disposizioni antielusive.',
    bulletPoints: [
      'Regola generale: le perdite fiscali IRES sono computate in diminuzione del reddito dei periodi d\'imposta successivi senza alcun limite temporale (riporto illimitato nel tempo).',
      'Limite quantitativo (80%): possono essere compensate in misura non superiore all\'80% del reddito imponibile di ciascuno dei successivi esercizi, garantendo che almeno il 20% del reddito sconti imposizione.',
      'Perdite dei primi tre esercizi (Start-up): le perdite realizzate nei primi 3 periodi d\'imposta dalla costituzione sono scomputabili per l\'intero importo (100%), a condizione che si riferiscano a una nuova attività produttiva.',
      'Limiti antielusivi (Commercio di bare fiscali - co. 3): il riporto è escluso se concorre il mutamento della maggioranza delle partecipazioni aventi diritto di voto unitamente alla modifica dell\'attività principale nei due anni precedenti o successivi.',
      'Vitalità economica (Test di vitalità): la limitazione non si applica se la società dimostra indici di vitalità (ricavi e spese per lavoro dipendente pari o superiori al 40% della media del biennio anteriore nel bilancio precedente il trasferimento).',
    ],
  },
  {
    id: 'trib-03',
    category: 'Diritto Tributario',
    topic: 'Detrazione IVA e Presupposti dell\'Imposta',
    difficulty: 'Base',
    normativa: 'D.P.R. 633/1972 (artt. 1, 19, 19-bis1)',
    question: 'Quali sono i presupposti impositivi dell\'IVA e quali principi regolano il diritto alla detrazione dell\'imposta assolta sugli acquisti?',
    bulletPoints: [
      'I tre presupposti concorrenti: oggettivo (cessione di beni o prestazione di servizi ex artt. 2 e 3), soggettivo (esercizio di imprese, arti o professioni ex artt. 4 e 5), territoriale (operazioni effettuate nel territorio dello Stato ex artt. 7-7 septies).',
      'Principio di neutralità dell\'IVA: l\'imposta deve gravare unicamente sul consumatore finale; il soggetto passivo opera come mero esattore per l\'Erario attraverso il meccanismo di rivalsa e detrazione.',
      'Condizione di inerenza ed effettività (art. 19): è detraibile l\'imposta relativa ai beni e servizi importati o acquistati nell\'esercizio dell\'attività d\'impresa, arte o professione.',
      'Pro-rata generale (art. 19 co. 5 e 19-bis): se il soggetto compie operazioni imponibili e operazioni esenti, la detrazione compete in base alla percentuale data dal rapporto tra operazioni con diritto a detrazione e totale volume d\'affari.',
      'Indetraibilità oggettiva (art. 19-bis1): limitazioni specifiche ex lege (es. autovetture a deducibilità ridotta al 40%, spese di rappresentanza, telefonia mobile).',
    ],
  },
  {
    id: 'trib-04',
    category: 'Diritto Tributario',
    topic: 'Accertamento con Adesione',
    difficulty: 'Intermedio',
    normativa: 'D.Lgs. 218/1997 e Riforma Statuto del Contribuente',
    question: 'Che cos\'è l\'accertamento con adesione, quali vantaggi offre al contribuente e quali effetti produce sui termini di impugnazione?',
    bulletPoints: [
      'Natura giuridica: strumento deflativo del contenzioso tributario a carattere paritetico, che consente di concordare tra ufficio e contribuente la rideterminazione della base imponibile e delle imposte.',
      'Ambito di attivazione: su iniziativa dell\'Ufficio (invito al contraddittorio) oppure su istanza del contribuente a seguito di PVC o notifica dell\'Avviso di Accertamento non preceduto da invito.',
      'Sospensione dei termini: la presentazione dell\'istanza da parte del contribuente sospende per 90 giorni i termini per l\'impugnazione davanti alla Corte di Giustizia Tributaria.',
      'Benefici sanzionatori: le sanzioni amministrative applicabili si riducono a 1/3 del minimo edittale previsto dalla legge.',
      'Perfezionamento: l\'atto di adesione si perfeziona unicamente con il pagamento dell\'intero importo concordato (o della prima rata) entro 20 giorni dalla redazione dell\'atto.',
    ],
  },
  {
    id: 'trib-05',
    category: 'Diritto Tributario',
    topic: 'Neutralità Fiscale delle Operazioni Straordinarie',
    difficulty: 'Avanzato',
    normativa: 'Artt. 172, 173, 176 TUIR',
    question: 'Illustri il principio di neutralità fiscale nelle operazioni di fusione, scissione e conferimento d\'azienda, con particolare riguardo al subentro nei valori fiscali.',
    bulletPoints: [
      'Principio guida: le operazioni di riorganizzazione aziendale (fusione, scissione, conferimento d\'azienda o rami) non costituiscono realizzo né distribuzione di plusvalenze o minusvalenze dei beni conferiti/incorporati.',
      'Conferimento d\'azienda ex art. 176 TUIR: regime naturale di neutralità; il conferitario subentra nella posizione del conferente in ordine ai valori fiscalmente riconosciuti degli elementi patrimoniali (continuità dei valori).',
      'Doppio binario e Quadro RV: qualora civilisticamente i beni vengano iscritti a valori peritali maggiori, si genera disallineamento civilistico-fiscale gestito mediante apposito prospetto di riconciliazione (Quadro RV Modello Redditi).',
      'Affrancamento opzionale dei disallineamenti: possibilità di versare un\'imposta sostitutiva per riallineare i valori fiscali a quelli civili per ammortizzare i maggiori valori (avviamento, marchi, cespiti).',
      'Disciplina antielusiva (Art. 10-bis L. 212/2000): la riorganizzazione non è elusiva se sostenuta da valide ragioni economiche extra-tributarie non marginali.',
    ],
  },

  // ── Diritto Commerciale ────────────────────────────────────────────────
  {
    id: 'comm-01',
    category: 'Diritto Commerciale',
    topic: 'Responsabilità degli Amministratori di S.p.A.',
    difficulty: 'Intermedio',
    normativa: 'Artt. 2392, 2393, 2394, 2395 c.c.',
    question: 'Quali sono le diverse azioni di responsabilità esperibili nei confronti degli amministratori di S.p.A. e quali ne sono i rispettivi presupposti e legittimati attivi?',
    bulletPoints: [
      'Dovere di diligenza (art. 2392): diligenza professionale richiesta dalla natura dell\'incarico e dalle specifiche competenze; responsabilità solidale tra amministratori salvo dissente incolpevole registrato a verbale.',
      'Azione sociale di responsabilità (art. 2393 e 2393-bis): promossa dalla società previa delibera assembleare ordinaria (o dai soci di minoranza con almeno 1/5 o 1/40 del CS nelle quotate); risarcisce il danno al patrimonio sociale.',
      'Azione dei creditori sociali (art. 2394): promossa per inosservanza degli obblighi di conservazione del patrimonio sociale, quando il patrimonio risulta insufficiente al soddisfacimento dei loro crediti.',
      'Azione individuale del socio o del terzo (art. 2395): esperibile per danni causati direttamente al patrimonio individuale del singolo socio o terzo da atti dolosi o colposi (es. bilancio falso per indurre all\'acquisto di azioni).',
      'Prescrizione: 5 anni dalla cessazione dell\'incarico per l\'azione sociale; 5 anni dal momento in cui l\'insufficienza patrimoniale risulta oggettivamente conoscibile per i creditori.',
    ],
  },
  {
    id: 'comm-02',
    category: 'Diritto Commerciale',
    topic: 'Procedimento di Fusione Societaria',
    difficulty: 'Avanzato',
    normativa: 'Artt. 2501 - 2504-quater c.c.',
    question: 'Descriva le fasi del procedimento di fusione tra società, evidenziando i documenti obbligatori degli amministratori e gli strumenti a tutela dei creditori.',
    bulletPoints: [
      'Fase 1 - Progetto di fusione (art. 2501-ter): redatto dagli organi amministrativi con forma, sede, atto costitutivo, rapporto di cambio delle azioni/quote, conguagli in denaro e modalità di assegnazione.',
      'Documenti preparatori: situazione patrimoniale aggiornata non oltre 120 giorni (art. 2501-quater), relazione degli amministratori illustrativa e giustificativa del rapporto di cambio (art. 2501-quinquies), perizia di esperti indipendenti sulla congruità del rapporto di cambio (art. 2501-sexies).',
      'Fase 2 - Decisione / Delibera di fusione (art. 2502): approvazione del progetto da parte dell\'assemblea straordinaria di ciascuna società partecipante, soggetta a controllo notarile di legalità e iscrizione nel Registro Imprese.',
      'Tutela dei creditori (art. 2503): opposizione dei creditori anteriori all\'iscrizione del progetto entro 60 giorni dall\'ultima iscrizione della delibera, salvo consenso, pagamento o idonee garanzie.',
      'Fase 3 - Atto di fusione (art. 2504): redatto per atto pubblico e iscritto al Registro Imprese. Dal deposito dell\'ultimo atto decorrono gli effetti della fusione; l\'invalidità dell\'atto non può più essere pronunciata ex art. 2504-quater.',
    ],
  },
  {
    id: 'comm-03',
    category: 'Diritto Commerciale',
    topic: 'Doveri e Poteri del Collegio Sindacale',
    difficulty: 'Intermedio',
    normativa: 'Artt. 2403, 2403-bis, 2407 c.c. e Norme di Comportamento CNDCEC',
    question: 'Quali sono i compiti di vigilanza del collegio sindacale nella S.p.A. e quale distinzione intercorre tra controllo di legalità e revisione legale dei conti?',
    bulletPoints: [
      'Doveri di vigilanza (art. 2403): vigilanza sull\'osservanza della legge e dello statuto, sul rispetto dei principi di corretta amministrazione e sull\'adeguatezza dell\'assetto organizzativo, amministrativo e contabile (art. 2086 c.c.).',
      'Limiti al controllo: controllo di legalità sostanziale e di conformità procedurale; non si estende mai all\'opportunità e convenienza economica delle scelte gestionali (Business Judgment Rule).',
      'Poteri di ispezione (art. 2403-bis): facoltà di compiere atti di ispezione e controllo in qualsiasi momento, richiedere chiarimenti agli amministratori e scambiare tempestive informazioni con l\'organo di revisione.',
      'Distinzione con la Revisione Legale: la revisione legale (D.Lgs. 39/2010) è preordinata all\'espressione del giudizio professionale sul bilancio; può essere affidata al collegio sindacale solo nelle S.p.A. non qualificate come enti di interesse pubblico e prive dell\'obbligo di consolidato.',
      'Responsabilità solidale (art. 2407): i sindaci sono responsabili in solido con gli amministratori per i fatti o le omissioni di questi, quando il danno non si sarebbe prodotto se essi avessero vigilato in conformità agli obblighi della loro carica.',
    ],
  },
  {
    id: 'comm-04',
    category: 'Diritto Commerciale',
    topic: 'Recesso del Socio nella S.r.l.',
    difficulty: 'Base',
    normativa: 'Art. 2473 c.c.',
    question: 'Quali sono le cause legali e statutarie di recesso del socio nella S.r.l. e con quali modalità si procede alla liquidazione della quota?',
    bulletPoints: [
      'Cause legali inderogabili: cambiamento dell\'oggetto sociale o del tipo di società, fusione o scissione, revoca dello stato di liquidazione, trasferimento della sede all\'estero, eliminazione di cause di recesso statutarie, compimento di operazioni che comportano una sostanziale modifica dell\'oggetto o dei diritti dei soci.',
      'Società a tempo indeterminato: il socio ha diritto di recedere ad nutum con un preavviso di almeno 180 giorni (estendibile da statuto fino a 1 anno).',
      'Criterio di determinazione del valore della quota: valore di mercato al momento della dichiarazione di recesso, tenendo conto del patrimonio sociale e delle prospettive reddituali (eventuale perizia giurata ex art. 2473 co. 3).',
      'Procedimento di rimborso entro 180 giorni: offerta prioritaria agli altri soci proporzionalmente, poi a terzi individuati dai soci; in mancanza, rimborso mediante riserve disponibili della società.',
      'Riduzione del capitale o scioglimento: se non vi sono riserve disponibili, riduzione del capitale sociale; se i creditori si oppongono e la riduzione è impedita, la società si scioglie.',
    ],
  },

  // ── Ragioneria ─────────────────────────────────────────────────────────
  {
    id: 'rag-01',
    category: 'Ragioneria',
    topic: 'Criterio del Costo Ammortizzato e Attualizzazione',
    difficulty: 'Intermedio',
    normativa: 'OIC 15 (Crediti), OIC 19 (Debiti), Art. 2426 c.c.',
    question: 'Come si applica il criterio del costo ammortizzato ai crediti e debiti di bilancio e in quali casi è obbligatorio procedere all\'attualizzazione finanziaria?',
    bulletPoints: [
      'Definizione del Costo Ammortizzato: valore a cui l\'attività o passività è stata misurata al riconoscimento iniziale, al netto dei rimborsi di capitale, aumentato o diminuito dell\'ammortamento cumulato della differenza tra valore iniziale e valore a scadenza (TIR).',
      'Tasso di Interesse Reale (TIR): tasso interno di rendimento che eguaglia il valore attuale dei flussi finanziari futuri al valore contabile iniziale (include oneri e commissioni di accensione).',
      'Presupposto dell\'Attualizzazione: obbligatoria quando il tasso di interesse contrattuale è significativamente inferiore al tasso di interesse di mercato (finanziamento a tasso zero o agevolato) e l\'operazione ha scadenza superiore a 12 mesi.',
      'Rilevazione iniziale: il credito/debito è iscritto al valore attuale dei flussi finanziari futuri scontati al tasso di mercato; la differenza iniziale è imputata a provento/onere finanziario o a conto economico.',
      'Esonero per bilanci abbreviati e micro-imprese: facoltà ex art. 2435-bis e ter c.c. di non applicare il costo ammortizzato e iscrivere al valore nominale di realizzo.',
    ],
  },
  {
    id: 'rag-02',
    category: 'Ragioneria',
    topic: 'Impairment Test delle Immobilizzazioni (OIC 9)',
    difficulty: 'Avanzato',
    normativa: 'OIC 9 e IAS 36',
    question: 'Descriva la procedura dell\'Impairment Test secondo l\'OIC 9 per rilevare le perdite durevoli di valore delle immobilizzazioni materiali e immateriali.',
    bulletPoints: [
      'Finalità: verificare se il valore contabile netto iscritto a bilancio sia recuperabile attraverso l\'uso futuro o la cessione dell\'attività.',
      'Trigger event (Indicatori di perdita): l\'impresa deve valutare a ogni chiusura di bilancio se vi siano indicatori interni (obsolescenza, piani di ristrutturazione) o esterni (calo di mercato, tassi in salita) di perdita di valore.',
      'Valore recuperabile: il maggiore tra il Fair Value (al netto dei costi di vendita) e il Valore d\'Uso (Value in Use).',
      'Determinazione del Valore d\'Uso: valore attuale dei flussi finanziari futuri attesi dall\'uso continuo e dalla dismissione finale dell\'attività, scontati a un adeguato tasso (WACC ponderato al rischio).',
      'Rilevazione contabile e ripristino: la svalutazione va imputata nella voce B.10.c del Conto Economico. Negli esercizi successivi, se vengono meno i motivi, la svalutazione va ripristinata (voce A.5), ma mai oltre il valore netto che l\'attività avrebbe avuto senza la svalutazione (divieto assoluto di ripristino per l\'avviamento).',
    ],
  },
  {
    id: 'rag-03',
    category: 'Ragioneria',
    topic: 'Valutazione delle Rimanenze di Magazzino (OIC 13)',
    difficulty: 'Base',
    normativa: 'OIC 13, Art. 2426 n. 9-10 c.c.',
    question: 'Quali sono i criteri civilistici e le metodologie ammesse per la valutazione delle rimanenze di magazzino, compresa la svalutazione per realizzo desumibile dall\'andamento del mercato?',
    bulletPoints: [
      'Regola generale del costo: iscrizione al minore tra il costo di acquisto o produzione e il valore di realizzazione desumibile dall\'andamento del mercato a fine esercizio.',
      'Costi accessori inclusi: nel costo di acquisto si comprendono oneri accessori diretti (trasporto, dogana); nel costo di produzione si computano costi diretti e quota ragionevolmente imputabile di costi generali industriali.',
      'Metodi di calcolo per beni fungibili: Costo Medio Ponderato (CMP per periodo o continuo), FIFO (First In First Out, riflette valori più vicini ai correnti a fine anno), LIFO (Last In First Out, riflette costi più recenti a conto economico).',
      'Valore di realizzazione di mercato: per le merci e prodotti finiti è il prezzo netto di vendita stimato meno costi di completamento e distribuzione; per materie prime è il costo di sostituzione.',
      'Svalutazione e ripristino: se il valore di mercato è inferiore al costo, obbligo di svalutazione a Conto Economico (B.11); se negli esercizi successivi i motivi vengono meno, obbligo di ripristino del valore originario di costo.',
    ],
  },
  {
    id: 'rag-04',
    category: 'Ragioneria',
    topic: 'Rendiconto Finanziario (OIC 10)',
    difficulty: 'Intermedio',
    normativa: 'OIC 10, Art. 2425-ter c.c.',
    question: 'Come si articola la struttura obbligatoria del Rendiconto Finanziario ex OIC 10 e qual è la differenza tra metodo diretto e metodo indiretto per il flusso dell\'attività operativa?',
    bulletPoints: [
      'Obbligatorietà del rendiconto: documento obbligatorio del bilancio d\'esercizio per le società in forma ordinaria (escluse le società che redigono il bilancio abbreviato ex art. 2435-bis o micro-imprese).',
      'Tre aree di gestione dei flussi finanziari: Flussi finanziari derivanti dall\'attività operativa (gestione reddituale), Flussi finanziari derivanti dall\'attività di investimento (capex e dismissioni), Flussi finanziari derivanti dall\'attività di finanziamento (capitale proprio e debiti finanziari).',
      'Metodo indiretto (più diffuso): parte dall\'utile/perdita d\'esercizio, rettificato per componenti non monetarie (ammortamenti, accantonamenti a TFR e fondi rischi, plus/minusvalenze da realizzo), variazione del CCN (crediti, debiti commerciali, magazzino) e altre rettifiche.',
      'Metodo diretto: evidenzia direttamente le principali categorie di incassi lordi da clienti e pagamenti a fornitori e dipendenti sostenuti per l\'attività operativa.',
      'Concetto di disponibilità liquide: include cassa, depositi bancari/postali a vista ed equivalenti di disponibilità liquide (impieghi a brevissimo termine prontamente convertibili senza rischio significativo di variazione).',
    ],
  },

  // ── Crisi d'Impresa ───────────────────────────────────────────────────
  {
    id: 'crisi-01',
    category: 'Crisi d\'Impresa',
    topic: 'Segnali di Crisi e Adeguatezza degli Assetti (Art. 2086 c.c.)',
    difficulty: 'Intermedio',
    normativa: 'Art. 2086 co. 2 c.c., D.Lgs. 14/2019 (CCII)',
    question: 'Cosa prevede l\'art. 2086 c.c. in tema di assetti organizzativi, amministrativi e contabili e quali sono gli indicatori di allerta della crisi ex Codice della Crisi d\'Impresa?',
    bulletPoints: [
      'Dovere dell\'imprenditore collettivo: istituire un assetto organizzativo, amministrativo e contabile adeguato alla natura e alle dimensioni dell\'impresa, anche in funzione della rilevazione tempestiva della crisi e della perdita della continuità aziendale.',
      'Continuità aziendale (Going Concern): obbligo di attivarsi senza indugio per l\'adozione e l\'attuazione di uno degli strumenti previsti dall\'ordinamento per il superamento della crisi e il recupero dell\'equilibrio.',
      'Segnali tempestivi di crisi (Art. 3 CCII): debiti per retribuzioni scaduti da almeno 30 giorni per oltre il 50% dell\'ammontare mensile, debiti verso fornitori scaduti da almeno 90 giorni superiori a quelli non scaduti, esposizioni bancarie scadute o sconfinate da oltre 60 giorni.',
      'Segnalazioni dei creditori pubblici qualificati (Art. 25-novies CCII): Agenzia delle Entrate, INPS, INAIL e Agente della Riscossione inviano formale avviso agli amministratori al superamento di soglie di debito prefissate.',
      'Responsabilità degli amministratori: l\'omessa predisposizione degli assetti costituisce grave irregolarità gestionale ex art. 2409 c.c. e fonte di responsabilità risarcitoria illimitata per i danni cagionati al patrimonio sociale e ai creditori.',
    ],
  },
  {
    id: 'crisi-02',
    category: 'Crisi d\'Impresa',
    topic: 'Composizione Negoziata della Crisi',
    difficulty: 'Avanzato',
    normativa: 'Artt. 12 - 25-quinquies CCII',
    question: 'Come funziona la Composizione Negoziata per la soluzione della crisi d\'impresa, quali requisiti richiede e quale ruolo svolge l\'Esperto indipendente?',
    bulletPoints: [
      'Natura dell\'istituto: procedura stragiudiziale volontaria e riservata, a cui può accedere qualsiasi imprenditore commerciale o agricolo che si trovi in condizioni di squilibrio patrimoniale o economico-finanziario che ne rendano probabile la crisi o l\'insolvenza.',
      'Condizione di accesso: presenza di una ragionevole prospettiva di risanamento dell\'impresa (test pratico preliminare sulla piattaforma telematica nazionale).',
      'Nomina dell\'Esperto indipendente: nominato da una commissione costituita presso la Camera di Commercio tra professionisti iscritti in apposito elenco (commercialisti, avvocati, consulenti del lavoro qualificati).',
      'Ruolo dell\'Esperto: agevolare le trattative tra l\'imprenditore, i creditori e gli altri soggetti interessati in modo terzo e neutrale, valutando la fattibilità del piano di risanamento senza sostituirsi agli amministratori.',
      'Misure protettive e cautelari: su istanza dell\'imprenditore e successiva conferma del Tribunale, i creditori non possono iniziare o proseguire azioni esecutive o cautelari sul patrimonio dell\'impresa per la durata delle trattative (fino a 120-240 giorni).',
    ],
  },
];
