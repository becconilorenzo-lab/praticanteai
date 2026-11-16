export type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'example'; content: string }
  | { type: 'subheading'; content: string }
  | { type: 'widget'; widget: 'trova-errore' }
  | { type: 'widget'; widget: 'bivo' };

export interface ParagraphNode {
  id: string;
  title: string;
  blocks?: ContentBlock[];
}

export interface ChapterNode {
  id: string;
  title: string;
  paragraphs: ParagraphNode[];
}

export const CHAPTERS: ChapterNode[] = [
  {
    id: 'aspetti-metodologici',
    title: 'Aspetti Metodologici',
    paragraphs: [
      {
        id: 'metodologia-analisi',
        title: 'Metodologia di Analisi Operativa',
        blocks: [
          { type: 'text', content: "Si consiglia di svolgere i vincoli sotto un triplice aspetto:" },
          { type: 'list', items: [
            "Aspetto Civilistico: principali fonti — codice civile, principi contabili nazionali ed internazionali e loro documenti interpretativi.",
            "Aspetto Fiscale: principali fonti — TUIR, DPR 633/72, DPR 600/73, DPR 131/86 e loro documenti interpretativi.",
            "Aspetto Contabile: consiste nella presentazione di un esempio numerico del vincolo analizzato con la redazione delle relative scritture contabili.",
          ]},
        ],
      },
    ],
  },
  {
    id: 'derivazione-rafforzata',
    title: 'Principio di Derivazione Rafforzata',
    paragraphs: [
      {
        id: 'correzione-errori',
        title: 'Correzione Errori Contabili e Derivazione Rafforzata',
        blocks: [
          { type: 'text', content: "Il principio di derivazione rafforzata presiede alla determinazione del reddito d'impresa e implica la rilevanza fiscale dei criteri di qualificazione, imputazione temporale e classificazione adottati in bilancio (art. 83, comma 1, TUIR), con il conseguente riconoscimento fiscale della rappresentazione contabile fondata sul principio di prevalenza della sostanza sulla forma." },
          { type: 'text', content: "Il principio di derivazione rafforzata si applica:" },
          { type: 'list', items: [
            "ai soggetti che redigono il bilancio in base ai principi contabili internazionali, a decorrere dal periodo d'imposta successivo a quello in corso al 31.12.2007;",
            "ai soggetti, diversi dalle micro-imprese di cui all'articolo 2435-ter del codice civile, che redigono il bilancio in conformità alle disposizioni del codice civile (soggetti che redigono il bilancio abbreviato e ordinario), con riguardo ai componenti reddituali e patrimoniali rilevati in bilancio a decorrere dall'esercizio successivo a quello in corso al 31.12.2015;",
            "alle micro imprese che hanno optato per la redazione del bilancio in forma ordinaria, a decorrere dal periodo d'imposta in corso al 22.6.2022.",
          ]},
          { type: 'text', content: "Le società di persone sono escluse dall'ambito applicativo del principio di derivazione rafforzata a prescindere dal fatto che siano in contabilità ordinaria oppure in contabilità semplificata." },
          { type: 'text', content: "Ai fini della determinazione del reddito imponibile, assumono rilevanza gli elementi reddituali e patrimoniali rappresentati in bilancio in base al principio di prevalenza della sostanza sulla forma, così come stabilito dai principi contabili." },
          { type: 'text', content: "Conseguentemente, per i soggetti per i quali risulta applicabile il principio di derivazione rafforzata, ai fini fiscali l'imputazione temporale dei componenti di reddito avviene — salvo specifiche deroghe espressamente previste dal TUIR — in perfetta aderenza alle risultanze del Conto economico." },
          { type: 'text', content: "Anche per i soggetti che applicano il principio di derivazione rafforzata valgono, in quanto estranee alla nozione di qualificazione, imputazione temporale e classificazione:" },
          { type: 'list', items: [
            "le disposizioni che limitano il riconoscimento fiscale di ammortamenti, valutazioni e accantonamenti;",
            "le disposizioni che, per motivi di carattere prettamente fiscale, derogano al bilancio (redatto in base ai principi contabili nazionali o in base agli IAS/IFRS).",
          ]},
          { type: 'text', content: "Si tratta, in particolare, delle disposizioni che prevedono l'imputazione di componenti positivi e negativi per cassa anziché per competenza (es. interessi di mora, compensi degli amministratori, dividendi, ecc.), che non consentono o limitano la deduzione di costi in quanto non inerenti o che prevedono la tassazione di componenti positivi frazionata nel tempo per motivi di opportunità fiscale (es. imposizione ripartita pro quota di talune plusvalenze). In tali fattispecie, indipendentemente dalla rappresentazione di bilancio, le regole fiscali prevalgono sulle valutazioni di bilancio e generano delle divergenze di trattamento con conseguente doppio binario fra valori civili e fiscali." },
          { type: 'subheading', content: "Correzione errori contabili e derivazione rafforzata" },
          { type: 'text', content: "Per i soggetti che redigono il bilancio in base ai principi contabili nazionali, la correzione di errori commessi in esercizi precedenti è contabilizzata (documento OIC 29, § 48):" },
          { type: 'list', items: [
            "in caso di errori non rilevanti, nel Conto economico dell'esercizio in cui si individua l'errore;",
            "in caso di errori rilevanti (cioè tali da influenzare, individualmente o insieme ad altri errori, le decisioni economiche che gli utilizzatori assumono in base al bilancio), sul saldo di apertura del patrimonio netto (utili portati a nuovo o altra componente, se più appropriato) dell'esercizio in cui si individua l'errore.",
          ]},
        ],
      },
      {
        id: 'soggetti-revisione',
        title: 'Soggetti con Revisione Legale dei Conti',
        blocks: [
          { type: 'subheading', content: "a. Soggetti che sottopongono il proprio bilancio d'esercizio a revisione legale dei conti" },
          { type: 'text', content: "I criteri di imputazione temporale previsti dai principi contabili (che, in forza del principio di derivazione rafforzata, assumono rilevanza fiscale, congiuntamente ai criteri di qualificazione e classificazione) per i soggetti che sottopongono il proprio bilancio d'esercizio a revisione legale dei conti \"valgono ai fini fiscali anche in relazione alle poste contabilizzate a seguito del processo di correzione degli errori contabili\". La disposizione non si applica ai componenti negativi di redditi per i quali è scaduto il termine per la presentazione della dichiarazione integrativa, ex art. 2, comma 8, DPR 322/98 (termine del quinto anno successivo)." },
          { type: 'text', content: "Il principio di derivazione rafforzata permette, quindi, il recepimento fiscale dell'impostazione contabile, riconoscendo la competenza fiscale e, quindi, la rilevanza fiscale dei componenti di reddito imputati in bilancio (a Conto economico o a Stato patrimoniale, a seconda della rilevanza dell'errore) nell'esercizio in cui viene operata la correzione, senza che sia, invece, necessaria la presentazione della dichiarazione integrativa con riferimento al periodo d'imposta in cui è stato commesso l'errore." },
          { type: 'example', content: "A dicembre dell'anno 2025, Alfa Spa si accorge di aver omesso l'imputazione di un costo di competenza dell'anno 2021 per un ammontare di 1.000 euro: per correggere l'errore, nel 2025 Alfa Spa rileva a Conto economico un componente negativo di reddito di 1.000 euro, che assumerà rilevanza fiscale nello stesso periodo d'imposta (nel Mod Redditi 2026/anno 2025 non occorrerà operare alcuna variazione in aumento) e non sarà necessario presentare alcuna dichiarazione integrativa." },
        ],
      },
      {
        id: 'soggetti-no-revisione',
        title: 'Soggetti senza Revisione Legale dei Conti',
        blocks: [
          { type: 'subheading', content: "b. Soggetti che non sottopongono il proprio bilancio d'esercizio a revisione legale dei conti" },
          { type: 'text', content: "I componenti rilevati a seguito della correzione di errori contabili derivanti dalla mancata imputazione di costi o ricavi nel corretto esercizio di competenza non possono assumere immediato rilievo fiscale per i soggetti che non sottopongono il proprio bilancio d'esercizio a revisione legale dei conti." },
          { type: 'text', content: "Nell'ipotesi in cui non sia stato imputato il costo/ricavo nel corretto esercizio di competenza e, in un periodo d'imposta successivo, si sia contabilizzato a Conto economico o nello Stato patrimoniale un componente negativo/positivo per dare evidenza all'errore, si dovrà, in sede di dichiarazione dei redditi riferita al periodo d'imposta in cui si registra la correzione (circ. Agenzia delle Entrate 31/2023):" },
          { type: 'list', items: [
            "operare una variazione in aumento/diminuzione per sterilizzare sul piano fiscale il componente transitato a Conto economico (trattamento previsto dal documento OIC 29 in riferimento agli errori non rilevanti); oppure,",
            "astenersi dall'operare una variazione in diminuzione/aumento per far concorrere alla determinazione del reddito il componente imputato a patrimonio netto (trattamento previsto dal documento OIC 29 in riferimento agli errori rilevanti).",
          ]},
          { type: 'example', content: "A dicembre dell'anno 2025, Alfa Srl si accorge di aver omesso l'imputazione di un costo di competenza dell'anno 2022, per un ammontare di 1.000 euro, e, per correggere l'errore, rileva nel Conto economico 2025 un componente negativo di reddito di 1.000 euro: nella relativa dichiarazione (nel Mod Redditi 2026/anno 2025) dovrà operare una variazione in aumento pari a 1.000 euro e successivamente presentare una dichiarazione integrativa a favore Mod Redditi 2023 / anno 2022, imputando il costo al periodo d'imposta 2022 attraverso una variazione in diminuzione." },
        ],
      },
    ],
  },
  {
    id: 'fiscalita-differita',
    title: 'Fiscalità Differita ed Anticipata',
    paragraphs: [
      {
        id: 'oic25',
        title: 'Principio Contabile OIC N. 25',
        blocks: [
          { type: 'text', content: "Le imposte correnti rappresentano le imposte sul reddito dovute riferibili al reddito imponibile di un esercizio. L'ammontare delle imposte correnti (o dovute) non coincide generalmente con l'ammontare delle imposte di competenza dell'esercizio, in quanto, per effetto delle diversità tra le norme civilistiche e fiscali, i valori attribuiti ad un'attività o passività secondo criteri civilistici possono differire dai valori riconosciuti a tali elementi ai fini fiscali." },
          { type: 'text', content: "Per il principio della competenza nel bilancio devono infatti essere recepite le imposte che, pur essendo di competenza di esercizi futuri sono esigibili con riferimento all'esercizio in corso (imposte anticipate) e quelle che pur essendo di competenza dell'esercizio, si renderanno esigibili solo in esercizi futuri (imposte differite). La loro contabilizzazione deriva dalle differenze temporanee tra il valore attribuito ad una attività o passività secondo criteri civilistici e il valore attribuito a quella stessa attività o passività ai fini fiscali. Le differenze temporanee concorrono nel loro complesso a determinare la base di calcolo delle imposte anticipate e differite." },
        ],
      },
      {
        id: 'differenze-temporanee',
        title: 'Differenze Temporanee',
        blocks: [
          { type: 'text', content: "Si distinguono in:" },
          { type: 'list', items: [
            "Differenze temporanee tassabili: hanno segno positivo e danno luogo ad ammontari imponibili negli esercizi futuri, generando passività per imposte differite;",
            "Differenze temporanee deducibili: hanno segno negativo e danno luogo ad ammontari imponibili nell'esercizio in cui si rilevano, generando attività per imposte anticipate. Le attività per imposte anticipate derivano oltre che da differenze temporanee deducibili, anche dal riporto a nuovo di perdite fiscali.",
          ]},
          { type: 'text', content: "Sono tali in quanto verranno, con certezza o comunque con significativa probabilità, completamente recuperate o riassorbite nel corso degli esercizi futuri." },
          { type: 'text', content: "Le attività per imposte anticipate non devono essere contabilizzate qualora non vi sia la ragionevole certezza del loro futuro recupero. Le passività per imposte differite non devono essere contabilizzate qualora esistano scarse possibilità che il debito sorga." },
        ],
      },
      {
        id: 'differenze-permanenti',
        title: 'Differenze Permanenti',
        blocks: [
          { type: 'text', content: "Le attività per imposte anticipate e le passività per imposte differite non devono essere contabilizzate qualora relative a differenze fra imponibile fiscale e risultato del bilancio d'esercizio ante imposte, che non si riverseranno in esercizi futuri." },
          { type: 'list', items: [
            "Differenze permanenti positive: quando il risultato ante imposte è più elevato rispetto al reddito imponibile (Es.: contributi erogati da enti pubblici esplicitamente esenti da tassazione).",
            "Differenze permanenti negative: quando il risultato ante imposte è minore rispetto al reddito imponibile (Es.: spese di rappresentanza eccedenti i limiti di deducibilità fiscali).",
          ]},
          { type: 'text', content: "L'articolo 2424 del codice civile prevede che, nello stato patrimoniale, le attività correlate alle imposte correnti e alle imposte anticipate siano rilevate rispettivamente nelle seguenti voci: CII.5-bis \"crediti tributari\"; CII.5-ter \"imposte anticipate\", mentre le passività relative alla fiscalità differita e corrente siano rilevate rispettivamente in: B.2 fondi \"per imposte, anche differite\"; D.12 \"debiti tributari\"." },
          { type: 'text', content: "L'articolo 2425 del codice civile prevede che le imposte correnti, anticipate e differite siano classificate nel conto economico nella voce 20) \"imposte sul reddito dell'esercizio, correnti, differite e anticipate\" in quanto costi di competenza dell'esercizio (le imposte anticipate sono iscritte nella stessa voce con segno negativo in quanto concorrono con tale segno ad identificare l'importo delle imposte sul reddito)." },
          { type: 'text', content: "Il calcolo della fiscalità differita o anticipata deve essere effettuato distintamente per Irap ed Ires in quanto differenti sono le fattispecie di deducibilità e di imponibilità." },
        ],
      },
      {
        id: 'imposte-differite-passive',
        title: 'Imposte Differite Passive',
        blocks: [
          { type: 'text', content: "Le imposte differite passive nascono quando si ha un minore carico fiscale attuale con riprese fiscali in diminuzione, che generano un maggiore carico fiscale futuro." },
          { type: 'text', content: "Esempi:" },
          { type: 'list', items: [
            "frazionamenti di plusvalenze patrimoniali (art. 86 comma 4 TUIR);",
            "detassazione di utili su cambi da valutazione (art. 110 comma 3 TUIR);",
            "rilevazione dividendi non incassati (art. 89 comma 1 TUIR).",
          ]},
        ],
      },
      {
        id: 'imposte-anticipate-attive',
        title: 'Imposte Anticipate Attive',
        blocks: [
          { type: 'text', content: "Le imposte anticipate attive nascono quando si ha un maggiore carico fiscale attuale con riprese fiscali in aumento, che generano un minore carico fiscale futuro." },
          { type: 'text', content: "Esempi:" },
          { type: 'list', items: [
            "ammortamenti ed accantonamenti eccedenti i limiti fiscalmente deducibili (art. 109 comma 4 TUIR);",
            "accantonamento a fondi non deducibili tassati per oneri deducibili in anni futuri (art. 107 comma 4 TUIR);",
            "accantonamenti per differenze di conversione su operazioni in valuta estera (art. 107 comma 4 TUIR);",
            "spese di manutenzione eccedenti il 5% del costo dei beni ammortizzabili (art. 102, comma 6 TUIR);",
            "riporto a nuovo di perdite fiscali (art. 84 TUIR);",
            "rilevazione compensi amministratori per competenza (art. 95 comma 5 TUIR).",
          ]},
        ],
      },
      {
        id: 'esempio-differite-passive',
        title: 'Esempio Contabile — Imposte Differite Passive',
        blocks: [
          { type: 'text', content: "Si ipotizzi che la società realizzi nell'esercizio una plusvalenza patrimoniale ex art. 86, comma 4, TUIR per 1.000 euro, frazionabile in quote costanti (200 euro) su cinque esercizi (nell'esercizio di formazione e nei 4 successivi). Si determina, quindi, una differenza temporanea in quanto si ha un rinvio della tassazione ad esercizi futuri (dei 4/5 della plusvalenza realizzata)." },
          { type: 'text', content: "Si dovrà effettuare in sede di Dichiarazione dei Redditi una variazione in diminuzione IRES pari ai 4/5 della plusvalenza (1.000 × 4/5 = 800), e su tale importo calcolare le imposte differite." },
          { type: 'subheading', content: "Rilevazione imposte differite passive" },
          { type: 'table', headers: ['Conto', 'Dare', 'Avere'], rows: [
            ['IMPOSTE DIFFERITE IRES', '192,00', ''],
            ['FONDO IMPOSTE DIFFERITE', '', '192,00'],
          ]},
          { type: 'widget', widget: 'trova-errore' },
          { type: 'widget', widget: 'bivo' },
          { type: 'text', content: "Nei 4 esercizi successivi si procederà allo storno pro quota del fondo imposte differite, in quanto in ciascun esercizio sarà necessario, in sede di Dichiarazione dei Redditi, effettuare una variazione in aumento pari alla quota di plusvalenza da tassare nell'esercizio (1.000 / 5 = 200)." },
          { type: 'table', headers: ['Conto', 'Dare', 'Avere'], rows: [
            ['FONDO IMPOSTE DIFFERITE', '48,00', ''],
            ['IMPOSTE', '', '48,00'],
          ]},
        ],
      },
      {
        id: 'esempio-anticipate-attive',
        title: 'Esempio Contabile — Imposte Anticipate Attive',
        blocks: [
          { type: 'text', content: "Si ipotizzi che la società sostenga nell'esercizio spese di manutenzione pari a 2.000 euro, delle quali, ai sensi art. 102 TUIR, solamente 1.000 euro siano integralmente deducibili nell'esercizio (importo corrispondente appunto al 5% del valore dei beni ammortizzabili detenuti dalla società), mentre i restanti 1.000 euro saranno deducibili in quote costanti nei 5 esercizi successivi (eccedenza rispetto al limite del 5%)." },
          { type: 'text', content: "Si determina, quindi, una differenza temporanea in quanto si ha un rinvio della deduzione a esercizi futuri dell'eccedenza delle spese di manutenzione rispetto al limite fiscalmente deducibile ex art. 102 TUIR." },
          { type: 'text', content: "Si dovrà effettuare in sede di Dichiarazione dei Redditi una variazione in aumento IRES pari all'eccedenza non deducibile delle spese di manutenzione (1.000 euro), e su tale importo calcolare le imposte anticipate." },
          { type: 'subheading', content: "Rilevazione imposte anticipate attive" },
          { type: 'table', headers: ['Conto', 'Dare', 'Avere'], rows: [
            ['ATTIVITÀ PER IMPOSTE ANTICIPATE', '240,00', ''],
            ['IMPOSTE ANTICIPATE IRES', '', '240,00'],
          ]},
          { type: 'text', content: "Nei 5 esercizi successivi si procederà pro quota al rilascio delle imposte anticipate precedentemente accantonate, in quanto, in ciascun esercizio sarà necessario, in sede di Dichiarazione dei Redditi, effettuare una variazione in diminuzione pari alla quota di spese di manutenzione che si rende deducibile nell'esercizio (1.000 / 5 = 200)." },
          { type: 'table', headers: ['Conto', 'Dare', 'Avere'], rows: [
            ['IMPOSTE', '48,00', ''],
            ['ATTIVITÀ PER IMPOSTE ANTICIPATE', '', '48,00'],
          ]},
        ],
      },
    ],
  },
];
