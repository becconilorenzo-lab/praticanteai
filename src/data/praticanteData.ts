export type AreaTematica =
  | 'Operazioni Straordinarie'
  | 'Bilancio d\'Esercizio'
  | 'Fiscalità d\'Impresa'
  | 'Crisi d\'Impresa';

export type LivelloDifficolta = 'Intermedio' | 'Avanzato';

export interface ChecklistItem {
  id: string;
  text: string;
  peso?: number;
}

export interface TracciaEsame {
  area: AreaTematica;
  livello: LivelloDifficolta;
  titolo: string;
  testo: string;
  checklist: ChecklistItem[];
  notaProfessore: string;
  correzione?: string;
  tempoResiduo?: number;
}

export const AREE_TEMATICHE: AreaTematica[] = [
  'Operazioni Straordinarie',
  'Bilancio d\'Esercizio',
  'Fiscalità d\'Impresa',
  'Crisi d\'Impresa',
];

export const LIVELLI: LivelloDifficolta[] = ['Intermedio', 'Avanzato'];

const TRACCE: Record<AreaTematica, Record<LivelloDifficolta, TracciaEsame[]>> = {
  'Operazioni Straordinarie': {
    Intermedio: [
            {
        area: 'Operazioni Straordinarie',
        livello: 'Intermedio',
        titolo: "Scissione Societaria: Nozione, Forme, Procedimento ed Effetti",
        testo:
          "Il candidato, dopo aver trattato della nozione e delle diverse forme di scissione, si soffermi sul relativo procedimento e sulla decorrenza degli effetti della scissione.",
        checklist: [
          { id: "s1", text: "Ho distinto scissione totale, parziale, proporzionale e asimmetrica (art. 2506, co. 2)", peso: 15 },
          { id: "s2", text: "Ho citato la scissione mediante scorporo (art. 2506.1, D.Lgs. 19/2023 e D.Lgs. 88/2025)", peso: 15 },
          { id: "s3", text: "Ho descritto le 5 fasi del procedimento (progetto → documenti → decisione → opposizione → atto)", peso: 15 },
          { id: "s4", text: "Ho specificato che la decorrenza parte dall’ultima iscrizione nel registro imprese (art. 2506-quater, co. 1)", peso: 15 },
          { id: "s5", text: "Ho spiegato la responsabilità solidale limitata al patrimonio netto assegnato (art. 2506-quater, co. 3)", peso: 15 },
          { id: "s6", text: "Ho richiamato l’invalidità sanata dopo le iscrizioni (art. 2504-quater, via art. 2506-ter)", peso: 15 },
          { id: "s7", text: "Ho scritto in prosa argomentata, non a elenco, con un’introduzione e un richiamo alla ratio di tutela dei creditori", peso: 10 },
        ],
        notaProfessore:
          "Trappole tipiche della traccia: La traccia è a doppio binario: chiede sia le forme sia il procedimento, e molti candidati trascurano una delle due. L’altra trappola è fermarsi all’art. 2506 senza citare la decorrenza degli effetti ex art. 2506-quater e la responsabilità solidale, che è il cuore della tutela dei creditori. Aggiornamento obbligatorio: dal 2023 lo scorporo è legge — chi non lo cita perde punti.",
        correzione:
          "1. Nozione\n\nLa scissione (artt. 2506 ss. c.c.) è un’operazione straordinaria con cui una società assegna l’intero patrimonio a più società, esistenti o di nuova costituzione, oppure ne assegna una parte anche a una sola società. Le partecipazioni delle beneficiarie vanno ai soci della scissa. Ha effetto reale e successorio: gli elementi patrimoniali passano alle beneficiarie senza i singoli atti traslativi, e la scissa può o meno estinguersi. È una fattispecie organizzativa, non una cessione, e non incide sulla continuità dei rapporti sociali.\n\n2. Forme\n\nTotale: l’intero patrimonio è assegnato a più beneficiarie e la scissa si estingue.\nParziale: la scissa resta in vita con il patrimonio residuo. In questo caso la beneficiaria può essere anche una sola.\nCon beneficiarie di nuova costituzione o preesistenti: nel secondo caso l’operazione si combina con una fusione, e il progetto richiama anche gli adempimenti dell’art. 2501-ter.\nProporzionale o non proporzionale (asimmetrica): l’assegnazione delle partecipazioni può non rispettare le quote originarie (art. 2506, co. 2). La tutela dei soci dissenzienti è il diritto di far acquistare la propria partecipazione, secondo l’art. 2506-bis.\nMediante scorporo (art. 2506.1): introdotta dal D.Lgs. 2 marzo 2023, n. 19, che ha recepito la direttiva (UE) 2019/2121. È una scissione parziale in cui le partecipazioni della beneficiaria sono attribuite alla scissa stessa e non ai suoi soci, con effetto simile a un conferimento. Gode di semplificazioni procedurali: niente rapporto di cambio, quindi niente situazione patrimoniale e relazioni dell’art. 2501-quater e seguenti. La norma è stata modificata dal D.L. 92/2024 e poi riscritta dal D.Lgs. 19 giugno 2025, n. 88 (GU n. 143 del 23 giugno 2025). Dopo quest’ultimo intervento lo scorporo può coinvolgere anche beneficiarie preesistenti. Sul regime del recesso (art. 2506-ter, co. 6) conviene verificare il testo vigente.\nTransfrontaliera: disciplinata dagli artt. 1-50 del D.Lgs. 19/2023.\n\n3. Procedimento\n\nIl procedimento rinvia in larga parte a quello della fusione (art. 2506-ter) e si articola così:\n\nProgetto di scissione (art. 2506-bis). Contiene i dati dell’art. 2501-ter, gli elementi attivi e passivi da trasferire, i criteri di distribuzione delle partecipazioni e il destino degli elementi non attribuiti. Se un elemento non è attribuibile in base al progetto: nella scissione parziale resta alla scissa, in quella totale è ripartito proporzionalmente.\nDocumenti. Gli amministratori redigono la situazione patrimoniale e la relazione illustrativa (artt. 2501-quater e 2501-quinquies). Se c’è un rapporto di cambio serve la relazione degli esperti (art. 2501-sexies). Il deposito presso il registro imprese avviene almeno 30 giorni prima della decisione (artt. 2501-ter e 2501-septies). I soci possono rinunciare ai termini e alle relazioni all’unanimità.\nDecisione dei soci con le maggioranze richieste per le modifiche statutarie (art. 2502), iscritta nel registro imprese (art. 2502-bis). Ai soci dissenzienti spetta il recesso (artt. 2437 e 2473).\nOpposizione dei creditori entro 60 giorni dall’ultima iscrizione della delibera (art. 2503). L’atto può essere stipulato prima solo in presenza delle eccezioni di legge: consenso dei creditori, pagamento, deposito delle somme, relazione dell’esperto o della società di revisione.\nAtto di scissione e iscrizione nel registro delle imprese (artt. 2504 e 2504-bis, richiamati dall’art. 2506-ter). Nella scissione semplificata (artt. 2505 e 2506-ter) alcuni adempimenti sono ridotti o omessi.\n\n4. Effetti e decorrenza\n\nDecorrenza. Ai sensi dell’art. 2506-quater, co. 1, la scissione ha effetto dall’ultima delle iscrizioni dell’atto nel registro delle imprese in cui sono iscritte le società beneficiarie. Il rinvio all’art. 2504-bis, co. 2, consente di fissare una data successiva. Resta ferma la retrodatazione dei soli effetti contabili e della partecipazione agli utili prevista dal progetto (art. 2501-ter). Ai fini delle imposte sui redditi, l’art. 173, co. 11, TUIR richiama la decorrenza dell’art. 2506-quater, co. 1, e limita la retrodatazione.\nResponsabilità per i debiti (art. 2506-quater, co. 3). Ciascuna società risponde solidalmente, nei limiti del valore effettivo del patrimonio netto ad essa assegnato o rimasto, dei debiti della scissa non soddisfatti dalla società a cui sono stati attribuiti. Quest’ultima resta invece integralmente responsabile. Secondo la Cassazione, opposizione dei creditori e responsabilità solidale sono tutele autonome e alternative, e tra le pronunce recenti sul co. 3 si ricorda Cass. 26784/2025.\nInvalidità (art. 2504-quater, richiamato dall’art. 2506-ter). Dopo le iscrizioni non può più essere pronunciata, salvo il risarcimento del danno ai soci o ai terzi.\nScorporo: non è prevista l’opposizione dei creditori né la responsabilità solidale dell’art. 2506-quater, ultimo comma (così la dottrina citata sotto, da riscontrare sul testo vigente dopo il D.Lgs. 88/2025).",
        tempoResiduo: 1800,
      },
      {
        area: 'Operazioni Straordinarie',
        livello: 'Intermedio',
        titolo: 'Fusione per Incorporazione e Disavanzo da Annullamento (OIC 4)',
        testo:
          'La società Alfa S.p.A. detiene una partecipazione totalitaria (100%) nella società Beta S.r.l.,' +
          ' iscritta in bilancio a un costo storico di € 800.000. In data 01/11/20X6 viene deliberata la fusione' +
          ' per incorporazione di Beta S.r.l. in Alfa S.p.A. con decorrenza degli effetti contabili e fiscali' +
          ' retroattiva al 01/01/20X6.' +
          '\n\nAl momento della fusione, la situazione patrimoniale di Beta S.r.l. presenta un Patrimonio Netto' +
          ' contabile pari a € 600.000 (Capitale Sociale € 200.000, Riserve € 400.000). Dalle perizie emerge che:' +
          ' 1) Un immobile di proprietà di Beta S.r.l. ha un valore corrente superiore a quello contabile di' +
          ' € 150.000 (plusvalore latente). 2) Il residuo valore non giustificato dai singoli elementi' +
          ' patrimoniali è da attribuirsi a un maggior valore aziendale intrinseco (Avviamento).' +
          '\n\nIl candidato proceda a determinare la natura e il valore del disavanzo/avanzo di fusione, a' +
          ' calcolare la fiscalità differita (IRES 24%) sui plusvalori latenti, e a redigere le scritture' +
          ' contabili di integrazione e annullamento nel bilancio dell\'incorporante secondo l\'OIC 4.',
        checklist: [
          { id: 'b1', text: 'Calcolato correttamente il disavanzo da annullamento complessivo (€ 200.000).', peso: 2 },
          { id: 'b2', text: 'Stanziata la fiscalità differita passiva (IRES 24%) sull\'immobile rivalutato.', peso: 3 },
          { id: 'b3', text: 'Allocato il disavanzo residuo alla voce B.I.2 Avviamento.', peso: 2 },
          { id: 'b4', text: 'Redatta la scrittura contabile di annullamento della partecipazione e recepimento dei saldi dell\'incorporata.', peso: 2 },
        ],
        notaProfessore:
          'Trappola tipica: Molti candidati dimenticano di calcolare le imposte differite passive sul plusvalore' +
          ' dell\'immobile in sede di allocazione del disavanzo. Questo porta a un\'errata quantificazione' +
          ' dell\'Avviamento residuo. Inoltre, trattandosi di fusione *da annullamento* (e non da concambio),' +
          ' non vi è alcuna emissione di nuove azioni o quote.',
        correzione:
          '1. Calcolo del Disavanzo da Annullamento:\n' +
          'Costo della Partecipazione (€ 800.000) - Patrimonio Netto Incorporata (€ 600.000) = € 200.000\n\n' +
          '2. Allocazione del Disavanzo:\n' +
          '- Rivalutazione Immobile (Lordo): € 150.000\n' +
          '- Fondo Imposte Differite (24% di € 150.000): € 36.000\n' +
          '- Rivalutazione Immobile (Netta): € 114.000\n' +
          '- Residuo da allocare ad Avviamento: € 200.000 - € 114.000 = € 86.000\n\n' +
          '3. Scrittura Contabile (Alfa S.p.A.):\n' +
          'DARE: Attivo di Beta (Valore contabile), Fabbricati (150.000), Avviamento (86.000)\n' +
          'AVERE: Partecipazione in Beta S.r.l. (800.000), Passivo di Beta (Valore contabile), Fondo Imposte Differite (36.000).',
        tempoResiduo: 1500,
      },
    ],
    Avanzato: [
      {
        area: 'Operazioni Straordinarie',
        livello: 'Avanzato',
        titolo: 'Fusione Scissione Asimmetrica con Realizzazione Plusvalenze',
        testo:
          'La società Beta Industries S.p.A. procede ad operazione di scissione parziale proporzionale a favore' +
          ' di due società beneficiarie di nuova costituzione (Beta Nord S.r.l. e Beta Sud S.r.l.), ciascuna' +
          ' ricevente il 50% del patrimonio netto di Beta Industries S.p.A.' +
          '\n\nIl patrimonio netto contabile di Beta Industries S.p.A. ammonta a € 12.000.000, di cui € 8.000.000' +
          ' di immobilizzazioni iscritte a valori fiscalmente riconosciuti e € 4.000.000 di crediti e liquidità.' +
          '\n\nLe due beneficiarie attribuiscono a Beta Industries S.p.A. partecipazioni pari al 100% del proprio' +
          ' capitale. Si ipotizzi che Beta Industries S.p.A. intenda esercitare l\'opzione per la realizzazione' +
          ' delle plusvalenze ex art. 177 TUIR.' +
          '\n\nSi determini: (a) le plusvalenze realizzate; (b) la tassazione ai sensi degli artt. 172 e 177 TUIR;' +
          ' (c) le modalità di attribuzione dei valori alle beneficiarie; (d) gli effetti ai fini IVA e' +
          ' indiretti.',
        checklist: [
          { id: 'a1', text: 'Verificata la proporzione della scissione ex art. 29 D.Lgs. 163/2015' },
          { id: 'a2', text: 'Calcolate le plusvalenze realizzate con opzione ex art. 177 TUIR' },
          { id: 'a3', text: 'Determinata la base imponibile per la tassazione separata' },
          { id: 'a4', text: 'Attribuiti i valori alle beneficiarie in proporzione alle quote ricevute' },
          { id: 'a5', text: 'Valutata la non rilevanza IVA dell\'operazione ex art. 2 D.P.R. 633/1972' },
          { id: 'a6', text: 'Controllati gli effetti in capo ai soci di Beta Industries S.p.A.' },
        ],
        notaProfessore:
          'Trappola tipica: la scissione proporzionale non realizza plusvalenze se non viene esercitata l\'opzione' +
          ' ex art. 177 TUIR. In caso di esercizio, la plusvalenza è determinata come differenza tra il valore' +
          ' delle quote attribuite e il costo fiscale della frazione di partecipazione scissa. Non confondere' +
          ' con la scissione non proporzionale, che realizza sempre plusvalenze.',
        tempoResiduo: 5400,
      },
      {
        area: 'Operazioni Straordinarie',
        livello: 'Avanzato',
        titolo: 'Cessione Ramo d\'Azienda Bar – Alfa Srl / Beta Srl',
        testo:
          "Il/la candidato/a, per la società “Alfa Srl – Via Roma 1 – Pescara” operante nel settore della somministrazione di alimenti e bevande (bar) e ristorazione (pub) a partire da una situazione contabile con dati a scelta, ipotizzi: la cessione del ramo aziendale riconducibile all’attività di somministrazione di alimenti e bevande (bar), alla società “Beta Srl – Via Roma 2 – Pescara”. Si specifica che le attività si esercitano in due unità immobiliari differenti. Il/la candidato/a rediga le scritture contabili per il cedente e per il cessionario, evidenziando la presenza di avviamento",
        checklist: [
          {
            id: 'c1',
            text: 'Ho qualificato il ramo come dotato di autonomia funzionale preesistente (art. 2112 c. 5 c.c.) e previsto il patto di non concorrenza ex art. 2557 c.c.',
            peso: 15,
          },
          {
            id: 'c2',
            text: 'Ho redatto le scritture di assestamento del cedente prima di rilevare la cessione',
            peso: 15,
          },
          {
            id: 'c3',
            text: 'La plusvalenza del cedente è in A.5 c.e. (non sopravvenienza attiva) e il saldo dare/avere torna',
            peso: 15,
          },
          {
            id: 'c4',
            text: 'Il cessionario ha iscritto l’avviamento come differenza tra prezzo e fair value degli asset netti, capitalizzando anche notaio e registro',
            peso: 15,
          },
          {
            id: 'c5',
            text: 'L’avviamento è ammortizzato in max 10 anni (art. 2426 n. 6 c.c.) con eventuale imposta anticipata OIC 25',
            peso: 15,
          },
          {
            id: 'c6',
            text: 'Ho indicato che l’atto sconta imposta di registro proporzionale (DPR 131/1986, ancora vigente nel 2026) con ripartizione per categoria di beni nell’atto, e che l’operazione è fuori campo IVA ex art. 2 c. 3 lett. b) DPR 633/72',
            peso: 15,
          },
          {
            id: 'c7',
            text: 'Ho verificato la responsabilità solidale del cessionario per debiti tributari ex art. 14 D.Lgs. 472/97 e per debiti civili risultanti dalle scritture contabili ex art. 2560 c.c.',
            peso: 10,
          },
        ],
        notaProfessore:
          'Il cedente non rileva mai l’avviamento (non lo ha iscritto perché generato internamente): la plusvalenza emerge come differenza tra prezzo e patrimonio netto contabile ceduto, e va in A.5 del conto economico. Il cessionario invece iscrive l’avviamento solo se il prezzo eccede il fair value degli asset netti identificabili (OIC 24, art. 2426 n. 6 c.c.) e lo ammortizza obbligatoriamente in max 10 anni. Il punto su cui inciampa quasi tutti: Beta non può scegliere di non iscrivere l’avviamento né di imputarlo a costo d’esercizio — farlo sarebbe un errore contabile grave.',
        correzione: "# Cessione ramo d'azienda Bar – Alfa Srl / Beta Srl\n\nNov 11, 2026 · @Lorenzo\n\nAlfa Srl cede a Beta Srl il ramo bar per € 60.000: Alfa rileva una plusvalenza di € 26.500, Beta iscrive un avviamento di € 23.000 (€ 26.000 con gli oneri accessori). Svolgimento con dati a scelta, normativa verificata all'11/11/2026.\n\n## 1. Inquadramento giuridico\n\nL'operazione è una cessione di **ramo d'azienda**: il bar è un complesso di beni organizzato (art. 2555 c.c.) che ha autonomia funzionale rispetto al pub. L'art. 2112, comma 5, c.c. definisce il ramo come articolazione funzionalmente autonoma di un'attività economica organizzata, identificata come tale da cedente e cessionario al momento del trasferimento; la Cassazione richiede che l'autonomia sia preesistente alla cessione (Cass. 23844/2025). Le due **unità immobiliari distinte** (bar e pub) con personale, attrezzature, licenze e clientela propri sono l'elemento che la traccia fornisce per dimostrarla.\n\n| Norma          | Effetto nel caso                                                                                                                                                                                            |\n| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |\n| Art. 2556 c.c. | Atto scritto; per imprese soggette a registrazione, forma pubblica o scrittura privata autenticata, con deposito al Registro Imprese entro 30 giorni a cura del notaio                                      |\n| Art. 2557 c.c. | Alfa non può avviare per 5 anni un'attività idonea a sviare la clientela del bar: il pub in via Roma 1 vende bevande a pochi numeri civici di distanza, quindi serve un patto che ne definisca il perimetro |\n| Art. 2558 c.c. | Beta subentra nei contratti non personali (fornitura caffè, locazione dell'unità del bar); il terzo può recedere entro 3 mesi se c'è giusta causa                                                           |\n| Art. 2559 c.c. | I crediti del ramo passano a Beta; l'effetto verso i terzi decorre dall'iscrizione al Registro Imprese, anche senza notifica ai debitori                                                                    |\n| Art. 2560 c.c. | Alfa resta obbligata verso i creditori che non l'hanno liberata; Beta risponde dei debiti che risultano dai libri contabili obbligatori                                                                     |\n| Art. 2112 c.c. | I 2 dipendenti del bar passano a Beta con tutti i diritti, TFR compreso; cedente e cessionario sono solidali per i crediti di lavoro esistenti al trasferimento                                             |\n\n## 2. Ipotesi e dati di partenza\n\nCessione il 30/06/N (N = 2026, esercizio coincidente con l'anno solare), contratto con atto notarile. Alfa esercita il bar da più di 3 anni. Il ramo **pub** (via Roma 1) resta ad Alfa; cassa, banche e patrimonio netto non fanno parte del ramo. Il bar ha 2 dipendenti.\n\n**Situazione contabile del ramo bar di Alfa al 30/06/N, prima delle scritture di assestamento (€)**\n\n| Conto                                                       | Dare   | Avere  |\n| ----------------------------------------------------------- | ------ | ------ |\n| Impianti e macchinari (macchina caffè, banco, attrezzature) | 60.000 |        |\n| Fondo ammortamento impianti e macchinari (al 31/12/N-1)     |        | 36.000 |\n| Arredi bar                                                  | 40.000 |        |\n| Fondo ammortamento arredi (al 31/12/N-1)                    |        | 16.000 |\n| Rimanenze di merci                                          | 8.000  |        |\n| Crediti verso clienti                                       | 6.000  |        |\n| Debiti verso fornitori                                      |        | 11.000 |\n| Fondo TFR (al 31/12/N-1)                                    |        | 9.800  |\n\nAliquote di ammortamento: 15% per impianti e macchinari, 10% per gli arredi, acquistati il 01/01/N-4. Accantonamento TFR del semestre: € 1.200.\n\n**Valori correnti da perizia e prezzo (€)**\n\n| Elemento                      | Valore contabile 30/06/N (dopo assestamento) | Valore corrente |\n| ----------------------------- | -------------------------------------------- | --------------- |\n| Impianti e macchinari         | 19.500                                       | 25.000          |\n| Arredi                        | 22.000                                       | 20.000          |\n| Rimanenze di merci            | 8.000                                        | 8.000           |\n| Crediti verso clienti         | 6.000                                        | 6.000           |\n| **Totale attività**           | **55.500**                                   | **59.000**      |\n| Debiti verso fornitori        | 11.000                                       | 11.000          |\n| Fondo TFR                     | 11.000                                       | 11.000          |\n| **Patrimonio netto del ramo** | **33.500**                                   | **37.000**      |\n\n**Prezzo di cessione: € 60.000**, pagato € 40.000 alla stipula e € 20.000 entro il 31/12/N (meno di 12 mesi: nessuna attualizzazione, OIC 15).\n\n- Plusvalenza del cedente: 60.000 − 33.500 = **€ 26.500**.\n- Avviamento del cessionario: 60.000 − 37.000 = **€ 23.000**.\n- Le due cifre sono coerenti: 26.500 = plusvalenza sui macchinari (+5.500) + minusvalenza sugli arredi (−2.000) + avviamento (+23.000).\n\n## 3. Scritture del cedente (Alfa Srl)\n\nAlfa porta il ramo ai valori contabili aggiornati alla data di cessione e li storna; la differenza con il prezzo è la plusvalenza. L'assestamento viene prima, altrimenti ammortamenti e TFR del semestre andrebbero persi.\n\n**a) Assestamento al 30/06/N**\n\n| Conto                                                          | Dare  | Avere |\n| -------------------------------------------------------------- | ----- | ----- |\n| Ammortamento immobilizzazioni materiali (B.10.b)               | 6.500 |       |\n| Fondo ammortamento impianti e macchinari (60.000 × 15% × 6/12) |       | 4.500 |\n| Fondo ammortamento arredi (40.000 × 10% × 6/12)                |       | 2.000 |\n| Accantonamento TFR (B.9.c)                                     | 1.200 |       |\n| Fondo TFR                                                      |       | 1.200 |\n\n**b) Cessione del ramo il 30/06/N**\n\n| Conto                                                | Dare        | Avere       |\n| ---------------------------------------------------- | ----------- | ----------- |\n| Banca c/c (acconto alla stipula)                     | 40.000      |             |\n| Crediti verso Beta Srl (saldo prezzo, entro 12 mesi) | 20.000      |             |\n| Fondo ammortamento impianti e macchinari             | 40.500      |             |\n| Fondo ammortamento arredi                            | 18.000      |             |\n| Debiti verso fornitori (accollati)                   | 11.000      |             |\n| Fondo TFR (trasferito)                               | 11.000      |             |\n| Impianti e macchinari                                |             | 60.000      |\n| Arredi                                               |             | 40.000      |\n| Rimanenze di merci                                   |             | 8.000       |\n| Crediti verso clienti                                |             | 6.000       |\n| Plusvalenza da cessione di ramo d'azienda (A.5)      |             | 26.500      |\n| **Totale a pareggio**                                | **140.500** | **140.500** |\n\nLa plusvalenza va in A.5 \"Altri ricavi e proventi\" secondo l'OIC 12; essendo di importo eccezionale, la nota integrativa ne dà conto (art. 2427, n. 13, c.c.). Il ramo è un unico bene: la plusvalenza non si scompone per singolo cespite.\n\n**c) Incasso del saldo (entro il 31/12/N)**\n\n| Conto                  | Dare   | Avere  |\n| ---------------------- | ------ | ------ |\n| Banca c/c              | 20.000 |        |\n| Crediti verso Beta Srl |        | 20.000 |\n\n**d) Imposte al 31/12/N, con opzione per la rateizzazione**\n\nAlfa possiede il ramo da più di 3 anni e può scegliere in dichiarazione di tassare la plusvalenza in 5 quote costanti (art. 86, comma 4, TUIR). IRES al 24%:\n\n| Conto                                            | Dare  | Avere |\n| ------------------------------------------------ | ----- | ----- |\n| Imposte correnti IRES (26.500 ÷ 5 = 5.300 × 24%) | 1.272 |       |\n| Imposte differite IRES (21.200 × 24%)            | 5.088 |       |\n| Debiti tributari                                 |       | 1.272 |\n| Fondo imposte differite (B.2)                    |       | 5.088 |\n\nNegli esercizi da N+1 a N+4 il fondo si rilascia per € 1.272 l'anno (OIC 25). Senza opzione, l'IRES sarebbe tutta corrente: 26.500 × 24% = € 6.360. L'IRAP non ha effetti: le plusvalenze da trasferimento d'azienda sono escluse dal valore della produzione (art. 5, comma 1, D.Lgs. 446/1997).\n\nIl ramo pub non subisce scritture. Se alcuni creditori non liberano Alfa dai debiti accollati (art. 2560, comma 1, c.c.), la solidarietà residua va valutata per l'informativa in nota integrativa.\n\n## 4. Scritture del cessionario (Beta Srl)\n\nBeta iscrive attività e passività ai **valori correnti** della perizia, non ai valori contabili di Alfa; l'eccedenza del prezzo è avviamento. Gli ammortamenti dei beni ripartono dai nuovi costi (25.000 e 20.000).\n\n**a) Acquisizione del ramo il 30/06/N**\n\n| Conto                                | Dare       | Avere      |\n| ------------------------------------ | ---------- | ---------- |\n| Impianti e macchinari                | 25.000     |            |\n| Arredi                               | 20.000     |            |\n| Rimanenze di merci                   | 8.000      |            |\n| Crediti verso clienti                | 6.000      |            |\n| Avviamento (B.I.5)                   | 23.000     |            |\n| Debiti verso fornitori (assunti)     |            | 11.000     |\n| Fondo TFR (assunto)                  |            | 11.000     |\n| Banca c/c (acconto)                  |            | 40.000     |\n| Debiti verso Alfa Srl (saldo prezzo) |            | 20.000     |\n| **Totale a pareggio**                | **82.000** | **82.000** |\n\n**b) Oneri accessori: imposta di registro e onorario notarile**\n\nImposta di registro € 1.690 (calcolo nella sezione 6), onorario del notaio € 1.310 più IVA 22% (€ 288,20, detraibile). Gli oneri accessori sono costo di acquisizione e qui, per semplicità, aumentano l'avviamento; si potrebbero ripartire pro quota sui singoli beni.\n\n| Conto                  | Dare   | Avere    |\n| ---------------------- | ------ | -------- |\n| Avviamento (B.I.5)     | 3.000  |          |\n| Erario c/IVA a credito | 288,20 |          |\n| Banca c/c              |        | 3.288,20 |\n\n**c) Pagamento del saldo (entro il 31/12/N)**\n\n| Conto                 | Dare   | Avere  |\n| --------------------- | ------ | ------ |\n| Debiti verso Alfa Srl | 20.000 |        |\n| Banca c/c             |        | 20.000 |\n\n**d) Ammortamento dell'avviamento al 31/12/N**\n\nAvviamento iscritto: 23.000 + 3.000 = € 26.000. Vita utile stimata in 10 anni, quindi € 2.600 l'anno e € 1.300 per i 6 mesi del primo esercizio.\n\n| Conto                                              | Dare  | Avere |\n| -------------------------------------------------- | ----- | ----- |\n| Ammortamento immobilizzazioni immateriali (B.10.a) | 1.300 |       |\n| Avviamento (o Fondo ammortamento avviamento)       |       | 1.300 |\n\n## 5. L'avviamento\n\nL'avviamento è l'attitudine dell'azienda a produrre utili e compare in bilancio solo nel cessionario, perché è acquisito a titolo oneroso. Alfa non lo aveva iscritto (è generato internamente) e lo realizza dentro la plusvalenza.\n\n| Aspetto              | Regola applicata al caso                                                                                                                                                                                                                                          |\n| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |\n| Determinazione       | Prezzo 60.000 meno valore corrente delle altre attività e passività (37.000) = 23.000; con gli oneri accessori 26.000 (OIC 24)                                                                                                                                    |\n| Iscrizione           | B.I.5, nei limiti del costo sostenuto, con il consenso del collegio sindacale se esiste (art. 2426, n. 6, c.c.)                                                                                                                                                   |\n| Ammortamento civile  | Secondo la vita utile; solo se non è stimabile in modo attendibile, entro 10 anni (art. 2426, n. 6, c.c.). L'OIC 24 fissa il massimo in 20 anni e, oltre 10, chiede fatti e circostanze oggettivi da spiegare in nota integrativa. Scelta: 10 anni, quota € 2.600 |\n| Vita utile           | Stimata alla prima rilevazione e non più modificabile; dopo si può solo svalutare per perdita durevole (OIC 9)                                                                                                                                                    |\n| Ammortamento fiscale | Deducibile ai fini IRES in misura non superiore a 1/18 del costo (art. 103, comma 3, TUIR): 26.000 ÷ 18 = € 1.444,44 l'anno                                                                                                                                       |\n| IRAP                 | Segue l'ammortamento civilistico, che è in B.10.a                                                                                                                                                                                                                 |\n\n**Imposte anticipate a regime (OIC 25).** Negli anni 1-10 l'ammortamento civile (2.600) supera il limite fiscale (1.444,44) di € 1.155,56 l'anno, indeducibile ai fini IRES; l'imposta anticipata è 1.155,56 × 24% = **€ 277,33**. Negli anni 11-18, senza quota civile, la deduzione fiscale di 1.444,44 riassorbe € 346,67 l'anno. L'iscrizione richiede la ragionevole certezza di redditi imponibili futuri. I valori valgono per un esercizio intero; per il 2026, con 6 mesi di possesso, il calcolo va adattato.\n\n| Conto (a regime, anni 1-10)                      | Dare   | Avere  |\n| ------------------------------------------------ | ------ | ------ |\n| Crediti per imposte anticipate (C.II.5-ter)      | 277,33 |        |\n| Imposte anticipate (voce 20 del conto economico) |        | 277,33 |\n\n## 6. Aspetti fiscali e adempimenti\n\n**Imposta di registro: € 1.690.** La cessione è fuori campo IVA (art. 2, comma 3, lett. b, DPR 633/1972) e per il principio di alternatività sconta il registro in misura proporzionale. Per le cessioni dal 01/01/2025 gli artt. 23 e 51 del DPR 131/1986, come modificati dal D.Lgs. 139/2024, applicano aliquote diverse per categoria di bene solo se l'atto indica il corrispettivo di ciascuna categoria; in mancanza si applica l'aliquota più alta. Le passività (22.000) si imputano ai beni in proporzione al loro valore (26,83% di ciascuno, avviamento compreso).\n\n| Categoria                               | Valore lordo | Passività imputate | Base imponibile | Aliquota | Imposta      |\n| --------------------------------------- | ------------ | ------------------ | --------------- | -------- | ------------ |\n| Beni mobili (macchinari, arredi, merci) | 53.000       | 14.219,51          | 38.780,49       | 3%       | 1.163,41     |\n| Avviamento                              | 23.000       | 6.170,73           | 16.829,27       | 3%       | 504,88       |\n| Crediti                                 | 6.000        | 1.609,76           | 4.390,24        | 0,5%     | 21,95        |\n| **Totale**                              | **82.000**   | **22.000**         | **60.000**      |          | **1.690,24** |\n\nIl totale si arrotonda a € 1.690. Senza la ripartizione nell'atto si pagherebbe il 3% su tutti i 60.000, cioè € 1.800. Le parti rispondono in solido (art. 57 DPR 131/1986); nel caso l'onere è a carico di Beta.\n\n**Fonti vigenti nel 2026.** Il nuovo Testo unico del registro (D.Lgs. 123/2025) doveva applicarsi dal 01/01/2026, ma l'art. 4, comma 5, del DL 200/2025 (convertito dalla L. 26/2026) lo ha rinviato al **01/01/2027**: per un atto del 2026 si applica ancora il DPR 131/1986. Stesso rinvio per il Testo unico delle sanzioni.\n\n| Profilo                   | Trattamento                                                                                                                                                                                                                                                                             |\n| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |\n| IVA                       | Operazione esclusa; Beta subentra nel periodo di rettifica della detrazione IVA sui beni ammortizzabili (art. 19-bis2 DPR 633/1972)                                                                                                                                                     |\n| Plusvalenza (cedente)     | Differenza tra prezzo e valore fiscale netto del ramo, determinata in modo unitario (art. 86, comma 2, TUIR). Dal 2026 la L. 199/2025 (art. 1, commi 42-43) ha limitato la rateizzazione ai soli casi di azienda o ramo posseduti da almeno 3 anni e società sportive: Alfa la mantiene |\n| IRAP                      | Plusvalenza esclusa dal valore della produzione (art. 5, comma 1, D.Lgs. 446/1997)                                                                                                                                                                                                      |\n| Responsabilità tributaria | Beta risponde in solido, entro il valore del ramo, delle violazioni dell'anno della cessione e dei 2 precedenti (art. 14 D.Lgs. 472/1997); il certificato dei carichi pendenti la limita                                                                                                |\n| Lavoratori                | TFR e diritti dei 2 dipendenti passano a Beta (art. 2112 c.c.); informativa sindacale ex art. 47 L. 428/1990 solo se Alfa occupa più di 15 dipendenti                                                                                                                                   |\n\n**Adempimenti.** Atto notarile e deposito al Registro Imprese entro 30 giorni (art. 2556 c.c.); registrazione dell'atto; SCIA di subingresso al SUAP del Comune di Pescara e voltura delle autorizzazioni sanitarie; comunicazione al locatore per il subentro nella locazione dell'unità del bar (art. 36 L. 392/1978); patto sul divieto di concorrenza ex art. 2557 c.c. rispetto al pub di via Roma 1.\n\n## 7. Fonti\n\nNormativa di riferimento: artt. 2555-2560 e 2112 c.c.; art. 2426, n. 6, c.c.; OIC 24 (immobilizzazioni immateriali), OIC 25 (imposte sul reddito), OIC 12 (schemi di bilancio); artt. 86 e 103 TUIR; DPR 131/1986 (artt. 23, 41, 51, 57) come modificato dal D.Lgs. 139/2024; DPR 633/1972 (art. 2, comma 3, lett. b); D.Lgs. 446/1997 (art. 5); D.Lgs. 472/1997 (art. 14); L. 199/2025 (art. 1, commi 42-43); DL 200/2025, art. 4, comma 5.\n\nLetture di riscontro (pagine consultate il 11/11/2026):\n\n- [Rinvio dei testi unici al 2027, DL 200/2025 (ANCE)](https://ance.it/2026/01/in-gazzetta-ufficiale-il-d-l-milleproroghe-2025-le-novita-in-materia-fiscale/) e [Milleproroghe convertito in L. 26/2026 (FISCOeTASSE)](https://www.fiscoetasse.com/normativa-prassi/13541-milleproroghe-dicembre-2025.html)\n- [Cessione d'azienda e registro dopo il D.Lgs. 139/2024 (ecnews)](https://www.ecnews.it/fiscale/fisco-e-patrimonio/operazioni-straordinarie/la-nuova-cessione-dazienda/) e [novità operative (ANCE)](https://enna.ance.it/2025/03/21/imposte-di-registro-di-bollo-ipotecaria-e-catastale-le-novita-operative/)\n- [Art. 86, comma 4, TUIR riscritto dalla legge di bilancio 2026 (MySolution)](https://www.mysolution.it/fisco/informazioni/news/2026/01/05/plusva/)\n- [Avviamento e OIC 24 (ecnews)](https://www.ecnews.it/fiscale/societa-e-bilancio/bilancio/lavviamento-nelloic-24/) e [prontuario avviamento (Studio Pizzano)](https://www.studiopizzano.it/avviamento-prontuario-bilancio/)\n- [Cessione d'azienda, aspetti contabili e fiscali (Studio Pizzano)](https://www.studiopizzano.it/cessione-d-azienda-aspetti-contabili-e-fiscali-prontuario-bilancio/)\n- [Artt. 2555-2560 c.c. (Filodiritto)](https://www.filodiritto.com/codici/codice-civile/capo-i-disposizioni-generali-13) e [art. 2112 c.c. con giurisprudenza (Brocardi)](https://www.brocardi.it/codice-civile/libro-quinto/titolo-ii/capo-i/sezione-iii/art2112.html)\n- [IRAP e plusvalenze da trasferimento d'azienda (ecnews)](https://www.ecnews.it/fiscale/fisco-e-patrimonio/reddito-impresa-e-irap/irap-derivazione-rafforzata-parziale/)\n- [Agenzia delle Entrate, risposta n. 151/2022 sulla cessione di ramo d'azienda](https://www.agenziaentrate.gov.it/portale/documents/20143/4256303/Risposta_151_23.03.2022.pdf/3f38db3f-fde7-bc27-ee3d-cb2c5e85da38)\n\nDa riverificare sul testo ufficiale prima dell'esame: art. 19-bis2 DPR 633/1972, art. 36 L. 392/1978, art. 47 L. 428/1990 e i limiti dell'art. 14 D.Lgs. 472/1997, citati qui dalla normativa generale e non riaperti sulla fonte. Di tutte le fonti elencate sono state aperte solo la pagina FISCOeTASSE sul rinvio e le due pagine di Studio Pizzano sulla cessione d'azienda; le altre sono state lette dai risultati di ricerca.\n",
        tempoResiduo: 5400,
      },
    ],
  },
  'Bilancio d\'Esercizio': {
    Intermedio: [
      {
        area: 'Bilancio d\'Esercizio',
        livello: 'Intermedio',
        titolo: 'Valutazione delle Rimanenze di Magazzino',
        testo:
          'La società Gamma Trading S.r.l. alla data del 31/12 presenta le seguenti rimanenze di prodotti' +
          ' finiti: 1.500 unità del prodotto A, costo unitario € 120; 800 unità del prodotto B, costo unitario' +
          ' € 200; 2.000 unità del prodotto C, costo unitario € 80.' +
          '\n\nIl prezzo di vendita atteso è pari a € 150 per il prodotto A, € 180 per il prodotto B e € 110 per' +
          ' il prodotto C. I costi di completamento e commercializzazione stimati sono pari al 15% del prezzo' +
          ' di vendita per ciascun prodotto.' +
          '\n\nSi proceda alla valutazione delle rimanenze ai sensi dell\'OIC 12 e si determini l\'eventuale' +
          ' svalutazione da iscrivere in bilancio, distinguendo il criterio del costo dal criterio del valore' +
          ' di realizzazione.',
        checklist: [
          { id: 'a1', text: 'Applicato il principio del costo più basso tra costo e valore di realizzazione' },
          { id: 'a2', text: 'Calcolato il valore netto di realizzazione (VNR) per ciascun prodotto' },
          { id: 'a3', text: 'Verificata la deducibilità fiscale della svalutazione ex art. 65 TUIR' },
          { id: 'a4', text: 'Controllata la coerenza con la nota integrativa ex art. 2427 c.c.' },
          { id: 'a5', text: 'Ispezionata la non sovrapponibilità con perdite su cambi' },
        ],
        notaProfessore:
          'Attenzione: il valore di realizzazione va calcolato al netto dei costi di completamento e' +
          ' commercializzazione. Se il VNR è inferiore al costo, la differenza è iscritta in svalutazione' +
          ' rimanenze. Ricorda che le svalutazioni ordinarie sono deducibili nei limiti del 3% del costo' +
          ' complessivo ex art. 65, comma 2, TUIR.',
        tempoResiduo: 1500,
      },
      {
        area: 'Bilancio d\'Esercizio',
        livello: 'Intermedio',
        titolo: 'Finanziamento Infruttifero e Costo Ammortizzato (OIC 15)',
        testo:
          'In data 01/01/20X6, la società Omnia S.p.A. ha concesso un finanziamento infruttifero a lungo termine' +
          ' a una propria società controllata per un valore nominale pari a € 500.000, con rimborso in un\'unica' +
          ' soluzione alla scadenza dei 4 anni (31/12/20X9). Il tasso di interesse di mercato per finanziamenti' +
          ' con caratteristiche e rischio simili è pari al 4%.' +
          '\n\nIl candidato, applicando il principio contabile OIC 15 (Crediti): 1) Calcoli il valore di' +
          ' iscrizione iniziale del credito applicando il criterio del costo ammortizzato e dell\'attualizzazione.' +
          ' 2) Determini la quota di proventi finanziari impliciti da imputare a Conto Economico al 31/12/20X6.' +
          ' 3) Rediga le relative scritture contabili al 01/01/20X6 e al 31/12/20X6.',
        checklist: [
          { id: 'b1', text: 'Calcolato il fattore di attualizzazione al tasso di mercato del 4% per 4 anni.' },
          { id: 'b2', text: 'Rilevato il valore di iscrizione iniziale attualizzato del credito (€ 427.402).' },
          { id: 'b3', text: 'Rilevato il differenziale iniziale come apporto/onere finanziario implicito sulla partecipazione.' },
          { id: 'b4', text: 'Calcolato e registrato l\'interesse attivo di competenza del primo anno (€ 17.096).' },
        ],
        notaProfessore:
          'Trappola tipica: L\'errore più comune è iscrivere il credito al valore nominale di € 500.000' +
          ' ignorando l\'obbligo di attualizzazione previsto dall\'OIC 15 per i crediti a tasso significativamente' +
          ' inferiore a quello di mercato. Trattandosi di una controllata, la differenza iniziale di € 72.598 va' +
          ' considerata come un incremento del valore della partecipazione (apporto implicito) e non come un' +
          ' costo d\'esercizio.',
        correzione:
          'PREMESSA\n' +
          'Il finanziamento è infruttifero, a lungo termine (4 anni) e concesso a una società del gruppo: ricorrono le condizioni per cui l\'OIC 15 impone l\'applicazione del criterio del costo ammortizzato con attualizzazione.\n\n' +
          '1) VALORE DI ISCRIZIONE INIZIALE DEL CREDITO\n' +
          'Il credito va iscritto al valore attuale dei flussi finanziari futuri, attualizzati al tasso di mercato (4%):\n' +
          'VA = 500.000 / (1,04)^4 = 500.000 × 0,854804 = € 427.402,10\n\n' +
          'Le disponibilità liquide erogate (€ 500.000) sono superiori al valore di iscrizione del credito. La differenza di € 72.597,90 NON è un onere finanziario da imputare subito a Conto Economico ("day one loss"). Trattandosi di finanziamento infruttifero da controllante a controllata, in assenza di elementi contrari la sostanza è quella di un rafforzamento patrimoniale della controllata: l\'OIC 15 impone quindi di imputare tale differenza, in capo alla controllante, ad incremento del valore della partecipazione (per la controllata, speculare, sarebbe incremento del patrimonio netto anziché proventi finanziari).\n\n' +
          '2) PROVENTI FINANZIARI IMPLICITI AL 31/12/20X6\n' +
          'Interessi 20X6 = 427.402,10 × 4% = € 17.096,08\n' +
          'Il credito passa da € 427.402,10 a € 444.498,18 al 31/12/20X6.\n\n' +
          '3) SCRITTURE CONTABILI\n\n' +
          '01/01/20X6 — Erogazione del finanziamento\n' +
          'Dare: Crediti finanziari v/imprese controllate — € 427.402,10\n' +
          'Dare: Partecipazioni in imprese controllate — € 72.597,90\n' +
          'Avere: Banca c/c — € 500.000,00\n\n' +
          '31/12/20X6 — Rilevazione interessi attivi impliciti\n' +
          'Dare: Crediti finanziari v/imprese controllate — € 17.096,08\n' +
          'Avere: Interessi attivi da attualizzazione (C.16.d) — € 17.096,08\n\n' +
          'Piano di ammortamento del credito (costo ammortizzato, tasso 4%):\n' +
          '01/01/X6: € 427.402,10\n' +
          '31/12/X6: € 444.498,18 (interessi € 17.096,08)\n' +
          '31/12/X7: € 462.278,11 (interessi € 17.779,93)\n' +
          '31/12/X8: € 480.769,23 (interessi € 18.491,12)\n' +
          '31/12/X9: € 500.000,00 (interessi € 19.230,77)\n' +
          'Totale interessi impliciti: € 72.597,90\n\n' +
          'NOTA: se si esclude l\'ipotesi di rafforzamento patrimoniale (operazione non tra parti correlate nella sostanza), la differenza iniziale di € 72.597,90 andrebbe invece imputata direttamente a Conto Economico come onere finanziario al 01/01/20X6; i proventi finanziari impliciti successivi resterebbero invariati negli importi.',
        tempoResiduo: 1500,
      },
    ],
    Avanzato: [
      {
        area: 'Bilancio d\'Esercizio',
        livello: 'Avanzato',
        titolo: 'Redazione di Stato Patrimoniale e Conto Economico con Vincoli di Bilancio',
        testo:
          'Il candidato rediga lo Stato Patrimoniale sia ex art. 2424 del Codice Civile sia secondo lo schema' +
          ' destinativo-finanziario; ed il Conto Economico sia ex art. 2425 del Codice Civile sia secondo lo' +
          ' schema a costo del venduto per gli esercizi 2023 e 2024, avendo a riferimento i vincoli seguenti:' +
          ' a) redditività sulle vendite pari al 10%; b) indice di liquidità primaria pari al 1,4;' +
          ' c) resi su vendite pari allo 0,5% delle vendite effettuate; d) costi di pubblicità pari a € 80.000,00;' +
          ' e) fondo svalutazione crediti pari a € 8.000,00; f) interessi passivi pari a € 9.000,00;' +
          ' g) ratei e risconti passivi pari a € 5.000,00; h) costi per energia elettrica pari a € 14.000.',
        checklist: [
          { id: 'a1', text: 'Redatto il Conto Economico ex art. 2425 c.c. per entrambi gli esercizi con ricavi netti dai resi (0,5%)' },
          { id: 'a2', text: 'Redatto il Conto Economico a costo del venduto con separazione costi industriali, commerciali e amministrativi' },
          { id: 'a3', text: 'Verificato il vincolo ROS = 10% (risultato operativo / ricavi netti) per entrambi gli esercizi' },
          { id: 'a4', text: 'Redatto lo Stato Patrimoniale ex art. 2424 c.c. con quadratura attivo/passivo per entrambi gli esercizi' },
          { id: 'a5', text: 'Redatto lo Stato Patrimoniale destinativo-finanziario con separazione attivo corrente/immobilizzato e passività correnti/consolidate' },
          { id: 'a6', text: 'Verificato l\'indice di liquidità primaria = 1,4 per entrambi gli esercizi' },
          { id: 'a7', text: 'Verificati tutti i vincoli (pubblicità € 80.000, fondo svalutazione crediti € 8.000, interessi passivi € 9.000, ratei e risconti passivi € 5.000, energia elettrica € 14.000)' },
        ],
        notaProfessore:
          'Trappole tipiche: (1) I resi (0,5% delle vendite lorde) vanno sottratti dai ricavi: vendite lorde' +
          ' 1.000.000 (2023) e 1.200.000 (2024), resi 5.000 e 6.000, ricavi netti 995.000 e 1.194.000.' +
          ' (2) L\'indice di liquidità primaria (1,4) include le liquidità immediate + differite al numeratore' +
          ' e le passività correnti al denominatore, comprensive dei ratei e risconti passivi (5.000).' +
          ' (3) Il fondo svalutazione crediti (8.000) è uguale in entrambi gli esercizi: l\'accantonamento 2024' +
          ' (2.000) compensa utilizzi di pari importo. (4) I debiti bancari a m/l sono la variabile di quadratura.' +
          ' (5) Le imposte sono stimate al 30% del risultato ante imposte (semplificazione IRES + IRAP).',
        correzione:
          'Ipotesi di lavoro\n\n' +
          'ROS = Risultato operativo / Ricavi netti = 10%. Vendite lorde 1.000.000 (2023) e 1.200.000 (2024). I resi (0,5%) sono 5.000 e 6.000 e riducono la voce A1.\n' +
          'Liquidità primaria = (liquidità immediate + differite) / passività correnti. I ratei e risconti passivi (5.000) rientrano tra le passività correnti.\n' +
          'Fondo svalutazione crediti: 8.000 a fine di entrambi gli esercizi, portato a riduzione dei crediti verso clienti. Accantonamento 3.000 nel 2023 e 2.000 nel 2024, quest\'ultimo a fronte di utilizzi di pari importo.\n' +
          'I vincoli d), f), g), h) valgono per entrambi gli anni.\n' +
          'Rimanenze:\n' +
          '\t31/12/22\t31/12/23\t31/12/24\n' +
          'Materie prime\t50.000\t55.000\t65.000\n' +
          'Prodotti finiti\t40.000\t45.000\t55.000\n' +
          'Imposte stimate al 30% del risultato ante imposte (semplificazione IRES + IRAP).\n' +
          'Debiti bancari a m/l: sono la variabile di quadratura.\n\n' +
          'Conto Economico ex art. 2425 c.c.\n' +
          'Voce\t2023\t2024\n' +
          'A) Valore della produzione\t\t\n' +
          '1) Ricavi delle vendite e prestazioni (al netto dei resi)\t995.000\t1.194.000\n' +
          '2) Variazione rimanenze prodotti finiti\t5.000\t10.000\n' +
          'Totale A\t1.000.000\t1.204.000\n' +
          'B) Costi della produzione\t\t\n' +
          '6) Materie prime, sussidiarie e di consumo\t380.000\t490.000\n' +
          '7) Servizi (di cui pubblicità 80.000; energia elettrica 14.000)\t160.000\t174.000\n' +
          '8) Godimento beni di terzi\t24.000\t30.000\n' +
          '9) Personale: a) salari e stipendi\t170.000\t205.000\n' +
          'b) oneri sociali\t56.000\t68.000\n' +
          'c) TFR\t14.000\t15.000\n' +
          '10) Ammortamenti e svalutazioni: a) immateriali\t5.000\t5.000\n' +
          'b) materiali\t70.000\t76.000\n' +
          'd) svalutazione crediti\t3.000\t2.000\n' +
          '11) Variazione rimanenze materie prime\t(5.000)\t(10.000)\n' +
          '14) Oneri diversi di gestione\t23.500\t29.600\n' +
          'Totale B\t900.500\t1.084.600\n' +
          'Differenza A − B\t99.500\t119.400\n' +
          'C) Proventi e oneri finanziari\t\t\n' +
          '17) Interessi e altri oneri finanziari\t(9.000)\t(9.000)\n' +
          'Risultato prima delle imposte\t90.500\t110.400\n' +
          '20) Imposte sul reddito\t(27.150)\t(33.120)\n' +
          '21) Utile d\'esercizio\t63.350\t77.280\n\n' +
          'Conto Economico a ricavi e costo del venduto\n' +
          'Voce\t2023\t2024\n' +
          'Ricavi netti di vendita\t995.000\t1.194.000\n' +
          'Materie consumate\t375.000\t480.000\n' +
          'Personale di produzione\t150.000\t180.000\n' +
          'Ammortamenti industriali\t60.000\t66.000\n' +
          'Energia elettrica (quota produzione)\t10.000\t10.000\n' +
          'Lavorazioni esterne e manutenzioni\t30.000\t36.000\n' +
          'Affitto stabilimento\t18.000\t22.000\n' +
          'Costi di produzione dell\'esercizio\t643.000\t794.000\n' +
          'Variazione rimanenze prodotti finiti\t(5.000)\t(10.000)\n' +
          'Costo del venduto\t(638.000)\t(784.000)\n' +
          'Utile lordo industriale\t357.000\t410.000\n' +
          'Costi commerciali\t(139.000)\t(150.000)\n' +
          'Costi amministrativi e generali\t(95.000)\t(111.000)\n' +
          'Oneri diversi di gestione\t(23.500)\t(29.600)\n' +
          'Risultato operativo\t99.500\t119.400\n' +
          'Oneri finanziari\t(9.000)\t(9.000)\n' +
          'Risultato ante imposte\t90.500\t110.400\n' +
          'Imposte\t(27.150)\t(33.120)\n' +
          'Utile netto\t63.350\t77.280\n\n' +
          'I costi commerciali comprendono la pubblicità (80.000 in entrambi gli anni), trasporti e distribuzione (16.000 e 20.000), personale commerciale (40.000 e 48.000) e svalutazione crediti (3.000 e 2.000). I costi amministrativi comprendono personale (50.000 e 60.000), consulenze (20.000 e 24.000), energia elettrica (4.000), affitto uffici (6.000 e 8.000) e ammortamenti non industriali (15.000).\n\n' +
          'Stato Patrimoniale ex art. 2424 c.c.\n\n' +
          'ATTIVO\n\n' +
          'Voce\t31/12/2023\t31/12/2024\n' +
          'B) Immobilizzazioni\t\t\n' +
          'I) Immateriali\t20.000\t15.000\n' +
          'II) Materiali\t430.000\t450.280\n' +
          'III) Finanziarie (partecipazioni in altre imprese)\t10.000\t10.000\n' +
          'Totale B\t460.000\t475.280\n' +
          'C) Attivo circolante\t\t\n' +
          'I) Rimanenze: materie prime\t55.000\t65.000\n' +
          'Prodotti finiti\t45.000\t55.000\n' +
          'II) Crediti verso clienti (netti: fondo svalutazione 8.000)\t187.000\t214.000\n' +
          'Crediti tributari\t3.000\t11.000\n' +
          'IV) Disponibilità liquide\t100.500\t118.000\n' +
          'Totale C\t390.500\t463.000\n' +
          'TOTALE ATTIVO\t850.500\t938.280\n\n' +
          'PASSIVO\n\n' +
          'Voce\t31/12/2023\t31/12/2024\n' +
          'A) Patrimonio netto\t\t\n' +
          'I) Capitale\t200.000\t200.000\n' +
          'IV) Riserva legale\t30.000\t33.000\n' +
          'VI) Altre riserve (straordinaria)\t99.650\t130.000\n' +
          'IX) Utile d\'esercizio\t63.350\t77.280\n' +
          'Totale A\t393.000\t440.280\n' +
          'C) Trattamento di fine rapporto\t70.000\t78.000\n' +
          'D) Debiti\t\t\n' +
          '4) Debiti verso banche (di cui oltre 12 mesi: 180.000 e 175.000)\t220.000\t220.000\n' +
          '7) Debiti verso fornitori\t110.000\t130.000\n' +
          '12) Debiti tributari\t18.000\t22.000\n' +
          '13) Debiti verso istituti di previdenza\t15.000\t18.000\n' +
          '14) Altri debiti\t19.500\t25.000\n' +
          'Totale D\t382.500\t415.000\n' +
          'E) Ratei e risconti passivi\t5.000\t5.000\n' +
          'TOTALE PASSIVO\t850.500\t938.280\n\n' +
          'Nel 2024 gli investimenti in immobilizzazioni materiali sono 96.280 (430.000 − 76.000 di ammortamento + 96.280 = 450.280). Il TFR passa da 70.000 a 78.000 (+15.000 di accantonamento, −7.000 di utilizzi). Dell\'utile 2023 sono stati destinati 3.000 a riserva legale, 30.000 a dividendi e 30.350 a riserva straordinaria.\n\n' +
          'Stato Patrimoniale destinativo-finanziario\n' +
          'IMPIEGHI\t2023\t2024\tFONTI\t2023\t2024\n' +
          'Liquidità immediate\t100.500\t118.000\tDebiti verso fornitori\t110.000\t130.000\n' +
          'Liquidità differite\t190.000\t225.000\tDebiti tributari\t18.000\t22.000\n' +
          'Rimanenze\t100.000\t120.000\tDebiti previdenziali\t15.000\t18.000\n' +
          'Attivo corrente\t390.500\t463.000\tAltri debiti\t19.500\t25.000\n' +
          'Immobilizzazioni immateriali\t20.000\t15.000\tDebiti bancari a breve\t40.000\t45.000\n' +
          'Immobilizzazioni materiali\t430.000\t450.280\tRatei e risconti passivi\t5.000\t5.000\n' +
          'Immobilizzazioni finanziarie\t10.000\t10.000\tPassività correnti\t207.500\t245.000\n' +
          'Attivo immobilizzato\t460.000\t475.280\tDebiti bancari a m/l\t180.000\t175.000\n' +
          '\t\t\t\tTFR\t70.000\t78.000\n' +
          '\t\t\t\tPassività consolidate\t250.000\t253.000\n' +
          '\t\t\t\tPatrimonio netto\t393.000\t440.280\n' +
          'Capitale investito\t850.500\t938.280\tTotale fonti\t850.500\t938.280\n\n' +
          'Verifica dei vincoli\n' +
          'Vincolo\t2023\t2024\n' +
          'a) ROS = 10%\t99.500 / 995.000 = 10%\t119.400 / 1.194.000 = 10%\n' +
          'b) Liquidità primaria = 1,4\t(100.500 + 190.000) / 207.500 = 1,4\t(118.000 + 225.000) / 245.000 = 1,4\n' +
          'c) Resi = 0,5% delle vendite\t5.000 / 1.000.000\t6.000 / 1.200.000\n' +
          'd) Pubblicità\t80.000\t80.000\n' +
          'e) Fondo svalutazione crediti\t8.000\t8.000\n' +
          'f) Interessi passivi\t9.000\t9.000\n' +
          'g) Ratei e risconti passivi\t5.000\t5.000\n' +
          'h) Energia elettrica\t14.000\t14.000\n\n' +
          'Il capitale circolante netto risulta di 183.000 nel 2023 e di 218.000 nel 2024. Il current ratio è circa 1,88 e 1,89.',
        tempoResiduo: 5400,
      },
      {
        area: 'Bilancio d\'Esercizio',
        livello: 'Avanzato',
        titolo: 'Riclassificazione del Conto Economico a Valore Aggiunto e Analisi di Bilancio',
        testo:
          'Dopo aver illustrato la struttura e la logica del Conto Economico riclassificato a evidenziazione' +
          ' del valore aggiunto, il candidato proceda con la riclassificazione, secondo tale approccio, di un' +
          ' conto economico partendo da una situazione contabile con dati a scelta' +
          ' (dare evidenza della situazione iniziale contabile e dello schema riclassificato).' +
          ' Si provveda poi a confrontare l\'andamento del conto economico in un periodo di almeno 2 anni' +
          ' attraverso gli opportuni calcoli, anche tramite i principali indicatori dell\'analisi di bilancio,' +
          ' per procedere all\'elaborazione di un giudizio finale, sempre con dati a scelta.',
        checklist: [
          { id: 'c1', text: 'Illustrata la struttura del CE a valore aggiunto: distinzione costi esterni/interni, margini intermedi progressivi (VPO, VA, MOL, RO, RAOF, risultato corrente, utile netto)' },
          { id: 'c2', text: 'Redatto il Conto Economico civilistico (art. 2425 c.c.) per i due esercizi con dati a scelta' },
          { id: 'c3', text: 'Redatto il raccordo tra schema civilistico e schema riclassificato a valore aggiunto' },
          { id: 'c4', text: 'Redatto il CE riclassificato a valore aggiunto per i due esercizi con calcolo delle variazioni assolute e percentuali' },
          { id: 'c5', text: 'Redatto lo Stato Patrimoniale riclassificato secondo il criterio finanziario (impieghi/fonti, attivo fisso/corrente, passività consolidate/correnti)' },
          { id: 'c6', text: 'Calcolate le incidenze sui ricavi (consumi materie, VA, costo del lavoro, MOL, ROS, utile netto)' },
          { id: 'c7', text: 'Calcolati gli indici di redditività (ROE, ROI, ROS, rotazione capitale investito, ROD, spread, leva finanziaria)' },
          { id: 'c8', text: 'Calcolati gli indici di struttura, liquidità e indebitamento (margine di struttura, current ratio, liquidità primaria/secondaria, PFN, autonomia finanziaria)' },
          { id: 'c9', text: 'Calcolato il ciclo circolante (giacenza magazzino, durata crediti/debiti, ciclo monetario)' },
          { id: 'c10', text: 'Elaborato il giudizio finale sull\'andamento economico, finanziario e patrimoniale dell\'azienda' },
        ],
        notaProfessore:
          'Trappole tipiche: (1) Non confondere il CE a valore aggiunto (costi per natura) con il CE a costo' +
          ' del venduto (costi per destinazione). Il CE a VA riclassifica per aree gestionali e produce margini' +
          ' intermedi progressivi. (2) La distinzione chiave è tra costi esterni (acquisti da terzi) e costi' +
          ' interni (lavoro, ammortamenti): il VA è la ricchezza creata dai fattori produttivi interni. (3)' +
          ' Separare correttamente la gestione accessoria da quella caratteristica: i canoni di affitto di un' +
          ' immobile non strumentale vanno nella gestione accessoria, non nei ricavi caratteristici. (4) Verificare' +
          ' la quadratura: il risultato operativo globale della riclassificazione deve coincidere con la' +
          ' differenza A - B del civilistico. (5) Dopo il D.Lgs. 139/2015 lo schema civilistico non ha più la' +
          ' sezione E (straordinaria): i componenti eccezionali vanno in Nota Integrativa e isolati nella' +
          ' riclassificazione.',
        correzione:
          '1. STRUTTURA E LOGICA DEL CE A VALORE AGGIUNTO\n\n' +
          'Il CE a valore aggiunto riclassifica i costi per natura (non per destinazione, come il CE a costo del venduto). Li ordina per aree gestionali e produce margini intermedi progressivi.\n\n' +
          'Il punto centrale è la distinzione tra costi esterni (acquisti di beni e servizi da terzi) e costi interni (lavoro, ammortamenti). Il valore aggiunto è la ricchezza che l\'impresa crea con i propri fattori produttivi. Remunera poi il personale, i finanziatori, lo Stato, i soci e l\'impresa stessa (ammortamenti e autofinanziamento).\n\n' +
          'Ogni risultato è attribuito alla sua area (caratteristica, accessoria, finanziaria, straordinaria, fiscale). Si può così misurare la redditività della sola gestione tipica, indipendentemente da struttura finanziaria e fiscale.\n\n' +
          '| Margine                                  | Come si ottiene                                                                                              | Cosa misura                           |\n' +
          '|------------------------------------------|--------------------------------------------------------------------------------------------------------------|---------------------------------------|\n' +
          '| VALORE DELLA PRODUZIONE OPERATIVA (VPO)  | Ricavi netti ± variazione rimanenze PF/semilavorati/lavori in corso + incrementi immobilizzazioni per lavori interni + altri ricavi caratteristici | Volume della produzione tipica        |\n' +
          '| VALORE AGGIUNTO (VA)                     | VPO - consumi di materie (± variazione rimanenze MP) - servizi - godimento beni di terzi - oneri diversi      | Ricchezza creata dall\'impresa         |\n' +
          '| MARGINE OPERATIVO LORDO (MOL / EBITDA)   | VA - costo del lavoro                                                                                         | Capacità di generare risorse dalla gestione tipica |\n' +
          '| RISULTATO OPERATIVO CARATTERISTICO (RO / EBIT) | MOL - ammortamenti - svalutazioni - accantonamenti                                                      | Redditività della gestione tipica     |\n' +
          '| RISULTATO OPERATIVO GLOBALE              | RO + risultato gestione accessoria                                                                            | Risultato di tutte le gestioni non finanziarie |\n' +
          '| RISULTATO ANTE ONERI FINANZIARI (RAOF)   | RO globale + proventi finanziari                                                                              | Risultato disponibile per remunerare il capitale di credito |\n' +
          '| RISULTATO CORRENTE                       | RAOF - oneri finanziari                                                                                       | Risultato della gestione ordinaria    |\n' +
          '| RISULTATO ANTE IMPOSTE                   | Risultato corrente ± gestione straordinaria                                                                   | Risultato prima del carico fiscale    |\n' +
          '| UTILE NETTO                              | Risultato ante imposte - imposte                                                                              | Remunerazione del capitale proprio    |\n\n' +
          'Dopo il D.Lgs. 139/2015 lo schema dell\'art. 2425 c.c. non ha più la sezione E (straordinaria). Gli elementi di entità o incidenza eccezionali sono indicati in Nota integrativa (art. 2427, c. 1, n. 13 c.c.) e, se presenti, vanno isolati nell\'area straordinaria della riclassificazione.\n\n' +
          'I limiti dello schema sono la discrezionalità di ammortamenti e accantonamenti e la soggettività nel separare gestione accessoria e caratteristica. La classificazione per natura inoltre non consente di vedere la redditività per funzione.\n\n' +
          '2. SITUAZIONE CONTABILE INIZIALE (caso: Alfa S.r.l.)\n\n' +
          'Ipotesi. Alfa S.r.l. è un\'impresa manifatturiera con bilancio ex art. 2425 c.c., esercizi 2024 e 2025, IVA al 22%. Gli "altri ricavi" (A5) comprendono affitti di un immobile non strumentale: 20 nel 2024 e 30 nel 2025 (gestione accessoria). Nel 2025 gli investimenti lordi sono 580 (500 materiali, 80 immateriali) e sono stati distribuiti dividendi per 100 sull\'utile 2024. Non ci sono componenti straordinarie rilevanti.\n\n' +
          'Conto economico civilistico (art. 2425 c.c.)\n\n' +
          '| Voce                                                                      | 2024   | 2025   |\n' +
          '|---------------------------------------------------------------------------|--------|--------|\n' +
          '| A1) Ricavi delle vendite e delle prestazioni                              | 4.800  | 5.400  |\n' +
          '| A2) Variazione rimanenze prodotti in corso, semilavorati e finiti        | 50     | 30     |\n' +
          '| A5) Altri ricavi e proventi                                              | 90     | 110    |\n' +
          '| TOTALE A) VALORE DELLA PRODUZIONE                                         | 4.940  | 5.540  |\n' +
          '| B6) Materie prime, sussidiarie, di consumo e merci                       | 2.000  | 2.300  |\n' +
          '| B7) Servizi                                                              | 800    | 880    |\n' +
          '| B8) Godimento beni di terzi                                              | 120    | 130    |\n' +
          '| B9a) Salari e stipendi                                                   | 880    | 1.000  |\n' +
          '| B9b) Oneri sociali                                                       | 270    | 300    |\n' +
          '| B9c) Trattamento di fine rapporto                                        | 60     | 70     |\n' +
          '| B10a) Ammortamento immobilizzazioni immateriali                          | 40     | 50     |\n' +
          '| B10b) Ammortamento immobilizzazioni materiali                            | 220    | 250    |\n' +
          '| B10d) Svalutazione crediti dell\'attivo circolante                        | 20     | 25     |\n' +
          '| B11) Variazione rimanenze materie prime (aumento = segno negativo)       | -20    | -10    |\n' +
          '| B12) Accantonamenti per rischi                                           | 10     | 15     |\n' +
          '| B14) Oneri diversi di gestione                                           | 60     | 70     |\n' +
          '| TOTALE B) COSTI DELLA PRODUZIONE                                         | 4.460  | 5.080  |\n' +
          '| DIFFERENZA A - B                                                         | 480    | 460    |\n' +
          '| C16) Altri proventi finanziari                                           | 5      | 4      |\n' +
          '| C17) Interessi e altri oneri finanziari                                  | -80    | -100   |\n' +
          '| TOTALE C) PROVENTI E ONERI FINANZIARI                                    | -75    | -96    |\n' +
          '| D) Rettifiche di valore di attività finanziarie                          | 0      | 0      |\n' +
          '| RISULTATO PRIMA DELLE IMPOSTE                                            | 405    | 364    |\n' +
          '| 20) Imposte sul reddito dell\'esercizio                                   | -125   | -112   |\n' +
          '| 21) UTILE DELL\'ESERCIZIO                                                 | 280    | 252    |\n\n' +
          'Raccordo con lo schema riclassificato\n\n' +
          '| Voce civilistica                        | Collocazione nel riclassificato                |\n' +
          '|-----------------------------------------|------------------------------------------------|\n' +
          '| A1                                      | Ricavi netti di vendita                        |\n' +
          '| A2                                      | Variazione rimanenze PF e semilavorati (VPO)   |\n' +
          '| A5 (70 nel 2024, 80 nel 2025)           | Altri ricavi caratteristici (VPO)              |\n' +
          '| A5 (20 nel 2024, 30 nel 2025: affitti)  | Gestione accessoria                            |\n' +
          '| B6 + B11                                | Consumi di materie prime                       |\n' +
          '| B7, B8, B14                             | Servizi, godimento beni di terzi, oneri diversi |\n' +
          '| B9                                      | Costo del lavoro                               |\n' +
          '| B10a + B10b                             | Ammortamenti                                   |\n' +
          '| B10d                                    | Svalutazione crediti                           |\n' +
          '| B12                                     | Accantonamenti per rischi                      |\n' +
          '| C16, C17                                | Proventi finanziari, oneri finanziari          |\n' +
          '| 20                                      | Imposte sul reddito                            |\n\n' +
          '3. CE RICLASSIFICATO A VALORE AGGIUNTO (2024-2025)\n\n' +
          '| Voce                                                       | 2024   | 2025   | Variazione | Variazione % |\n' +
          '|------------------------------------------------------------|--------|--------|------------|--------------|\n' +
          '| Ricavi netti di vendita                                    | 4.800  | 5.400  | +600       | +12,5%       |\n' +
          '| Variazione rimanenze PF e semilavorati                     | 50     | 30     | -20        | -40,0%       |\n' +
          '| Altri ricavi caratteristici                                | 70     | 80     | +10        | +14,3%       |\n' +
          '| VALORE DELLA PRODUZIONE OPERATIVA                          | 4.920  | 5.510  | +590       | +12,0%       |\n' +
          '| (-) Consumi di materie prime (B6 + B11)                    | 1.980  | 2.290  | +310       | +15,7%       |\n' +
          '| (-) Costi per servizi                                      | 800    | 880    | +80        | +10,0%       |\n' +
          '| (-) Godimento beni di terzi                                | 120    | 130    | +10        | +8,3%        |\n' +
          '| (-) Oneri diversi di gestione                              | 60     | 70     | +10        | +16,7%       |\n' +
          '| VALORE AGGIUNTO                                            | 1.960  | 2.140  | +180       | +9,2%        |\n' +
          '| (-) Costo del lavoro                                       | 1.210  | 1.370  | +160       | +13,2%       |\n' +
          '| MARGINE OPERATIVO LORDO (MOL)                              | 750    | 770    | +20        | +2,7%        |\n' +
          '| (-) Ammortamenti                                           | 260    | 300    | +40        | +15,4%       |\n' +
          '| (-) Svalutazione crediti                                   | 20     | 25     | +5         | +25,0%       |\n' +
          '| (-) Accantonamenti per rischi                              | 10     | 15     | +5         | +50,0%       |\n' +
          '| RISULTATO OPERATIVO CARATTERISTICO (RO)                    | 460    | 430    | -30        | -6,5%        |\n' +
          '| (+) Risultato gestione accessoria                          | 20     | 30     | +10        | +50,0%       |\n' +
          '| RISULTATO OPERATIVO GLOBALE                                | 480    | 460    | -20        | -4,2%        |\n' +
          '| (+) Proventi finanziari                                    | 5      | 4      | -1         | -20,0%       |\n' +
          '| RISULTATO ANTE ONERI FINANZIARI (RAOF)                     | 485    | 464    | -21        | -4,3%        |\n' +
          '| (-) Oneri finanziari                                       | 80     | 100    | +20        | +25,0%       |\n' +
          '| RISULTATO CORRENTE                                         | 405    | 364    | -41        | -10,1%       |\n' +
          '| (+/-) Gestione straordinaria                               | 0      | 0      | 0          | n.s.         |\n' +
          '| RISULTATO ANTE IMPOSTE                                     | 405    | 364    | -41        | -10,1%       |\n' +
          '| (-) Imposte sul reddito                                    | 125    | 112    | -13        | -10,4%       |\n' +
          '| UTILE NETTO                                                | 280    | 252    | -28        | -10,0%       |\n\n' +
          'Il risultato operativo globale (480 e 460) coincide con la differenza A - B del civilistico, quindi la riclassificazione quadra.\n\n' +
          '4. STATO PATRIMONIALE RICLASSIFICATO (criterio finanziario)\n\n' +
          'Serve per gli indici di redditività, struttura e liquidità.\n\n' +
          'Impieghi\n\n' +
          '| Impieghi                                  | 31/12/2024 | 31/12/2025 |\n' +
          '|-------------------------------------------|------------|------------|\n' +
          '| Immobilizzazioni immateriali             | 150        | 180        |\n' +
          '| Immobilizzazioni materiali               | 1.900      | 2.150      |\n' +
          '| Immobilizzazioni finanziarie             | 50         | 50         |\n' +
          '| ATTIVO FISSO                             | 2.100      | 2.380      |\n' +
          '| Rimanenze                                | 900        | 940        |\n' +
          '| Liquidità differite (crediti commerciali e altri) | 1.400  | 1.600      |\n' +
          '| di cui crediti commerciali               | 1.300      | 1.500      |\n' +
          '| Liquidità immediate                      | 200        | 150        |\n' +
          '| ATTIVO CORRENTE                          | 2.500      | 2.690      |\n' +
          '| CAPITALE INVESTITO                       | 4.600      | 5.070      |\n\n' +
          'Fonti\n\n' +
          '| Fonti                                     | 31/12/2024 | 31/12/2025 |\n' +
          '|-------------------------------------------|------------|------------|\n' +
          '| PATRIMONIO NETTO                         | 1.800      | 1.952      |\n' +
          '| Debiti finanziari a medio-lungo termine  | 800        | 1.000      |\n' +
          '| TFR                                      | 250        | 280        |\n' +
          '| Fondi per rischi                         | 30         | 45         |\n' +
          '| PASSIVITÀ CONSOLIDATE                    | 1.080      | 1.325      |\n' +
          '| Debiti verso fornitori                   | 1.000      | 1.100      |\n' +
          '| Debiti finanziari a breve                | 450        | 400        |\n' +
          '| Debiti tributari e previdenziali         | 150        | 160        |\n' +
          '| Altri debiti                             | 120        | 133        |\n' +
          '| PASSIVITÀ CORRENTI                       | 1.720      | 1.793      |\n' +
          '| CAPITALE ACQUISITO (TOTALE FONTI)        | 4.600      | 5.070      |\n\n' +
          'Il PN 2025 si ricostruisce così: 1.800 - 100 dividendi + 252 utile = 1.952. I debiti finanziari totali sono 1.250 nel 2024 e 1.400 nel 2025. La posizione finanziaria netta (PFN) è 1.050 nel 2024 e 1.250 nel 2025.\n\n' +
          '5. ANALISI DELL\'ANDAMENTO 2024-2025\n\n' +
          '5.1 Incidenze sui ricavi (percentuali; variazioni in punti percentuali calcolate sui valori non arrotondati)\n\n' +
          '| Indicatore                       | 2024   | 2025   | Variazione |\n' +
          '|----------------------------------|--------|--------|------------|\n' +
          '| Consumi di materie / Ricavi      | 41,3%  | 42,4%  | +1,2       |\n' +
          '| Valore aggiunto / Ricavi         | 40,8%  | 39,6%  | -1,2       |\n' +
          '| Costo del lavoro / Valore aggiunto | 61,7% | 64,0% | +2,3       |\n' +
          '| MOL / Ricavi                     | 15,6%  | 14,3%  | -1,4       |\n' +
          '| RO / Ricavi (ROS)                | 9,6%   | 8,0%   | -1,6       |\n' +
          '| Utile netto / Ricavi             | 5,8%   | 4,7%   | -1,2       |\n\n' +
          '5.2 Indici di redditività\n\n' +
          '| Indice                              | Formula                                  | 2024    | 2025    | Andamento  |\n' +
          '|-------------------------------------|------------------------------------------|---------|---------|------------|\n' +
          '| ROE                                 | Utile netto / PN finale                  | 15,56%  | 12,91%  | Peggiora   |\n' +
          '| ROI                                 | RO caratteristico / Capitale investito   | 10,00%  | 8,48%   | Peggiora   |\n' +
          '| ROS                                 | RO / Ricavi                              | 9,58%   | 7,96%   | Peggiora   |\n' +
          '| Rotazione del capitale investito    | Ricavi / Capitale investito              | 1,04    | 1,07    | Migliora   |\n' +
          '| ROD (costo medio del debito)        | Oneri finanziari / Debiti finanziari     | 6,40%   | 7,14%   | Peggiora   |\n' +
          '| Spread ROI - ROD                    | ROI - ROD, in punti percentuali          | 3,60    | 1,34    | Peggiora   |\n' +
          '| Leva finanziaria                    | Capitale investito / PN                  | 2,56    | 2,60    | Lieve aumento |\n' +
          '| RN / RO                             | Utile netto / RO                         | 0,61    | 0,59    | Peggiora   |\n\n' +
          'La scomposizione del ROE è (RN/RO) × ROI × leva, che è esattamente Utile netto / PN. Nel 2024 vale 0,6087 × 10,00% × 2,5556 = 15,56%; nel 2025 vale 0,5860 × 8,48% × 2,5973 = 12,91%.\n\n' +
          '5.3 Indici di struttura, liquidità e indebitamento\n\n' +
          '| Indice                              | Formula                                  | 2024    | 2025    | Andamento  |\n' +
          '|-------------------------------------|------------------------------------------|---------|---------|------------|\n' +
          '| Margine di struttura primario       | PN - Attivo fisso                        | -300    | -428    | Peggiora   |\n' +
          '| Indice di struttura primario        | PN / Attivo fisso                        | 0,86    | 0,82    | Peggiora   |\n' +
          '| Margine di struttura secondario     | (PN + Passività consolidate) - Attivo fisso | 780   | 897     | Migliora   |\n' +
          '| Indice di struttura secondario      | (PN + Passività consolidate) / Attivo fisso | 1,37  | 1,38    | Stabile    |\n' +
          '| Capitale circolante netto           | Attivo corrente - Passività correnti     | 780     | 897     | Migliora   |\n' +
          '| Indice di disponibilità             | Attivo corrente / Passività correnti     | 1,45    | 1,50    | Migliora   |\n' +
          '| Indice di liquidità secondaria      | (Liq. immediate + differite) / Passività correnti | 0,93 | 0,98 | Migliora |\n' +
          '| Indice di liquidità primaria        | Liquidità immediate / Passività correnti | 0,12    | 0,08    | Peggiora   |\n' +
          '| Autonomia finanziaria               | PN / Capitale investito                  | 39,1%   | 38,5%   | Lieve peggioramento |\n' +
          '| Indice di indebitamento             | (Passività consolidate + correnti) / PN  | 1,56    | 1,60    | Lieve peggioramento |\n' +
          '| PFN                                 | Debiti finanziari - Liquidità immediate  | 1.050   | 1.250   | Peggiora   |\n' +
          '| PFN / PN                            |                                          | 0,58    | 0,64    | Peggiora   |\n' +
          '| PFN / MOL                           |                                          | 1,40    | 1,62    | Peggiora   |\n' +
          '| Copertura oneri finanziari          | RO / Oneri finanziari                    | 5,75    | 4,30    | Peggiora   |\n\n' +
          'Il margine di struttura secondario coincide con il capitale circolante netto, come deve essere.\n\n' +
          '5.4 Ciclo circolante (giorni, valori arrotondati)\n\n' +
          '| Indice                              | Formula                                  | 2024 | 2025 | Andamento  |\n' +
          '|-------------------------------------|------------------------------------------|------|------|------------|\n' +
          '| Giorni di giacenza magazzino        | Rimanenze / Ricavi × 365                 | 68   | 64   | Migliora   |\n' +
          '| Durata media dei crediti            | Crediti commerciali / (Ricavi × 1,22) × 365 | 81 | 83 | Lieve peggioramento |\n' +
          '| Durata media dei debiti             | Debiti fornitori / ((B6 + B7 + B8) × 1,22) × 365 | 102 | 99 | Lieve peggioramento |\n' +
          '| Ciclo monetario                     | Giacenza + durata crediti - durata debiti | 47   | 48   | Stabile    |\n\n' +
          'La giacenza è calcolata sui ricavi per semplicità. Il ciclo monetario è la somma dei valori arrotondati.\n\n' +
          '6. GIUDIZIO FINALE\n\n' +
          'Gestione economica. L\'azienda cresce (ricavi +12,5%) ma non in modo redditizio: il valore aggiunto sale solo del 9,2% e il MOL del 2,7%. Il costo del lavoro (+13,2%) e i consumi di materie (+15,7%) crescono più dei ricavi. L\'incidenza del lavoro sul VA passa dal 61,7% al 64,0%. Gli ammortamenti crescono del 15,4% per gli investimenti dell\'anno, che non hanno ancora prodotto ritorni. Il risultato è un RO in calo del 6,5% e un ROS dal 9,6% all\'8,0%.\n\n' +
          'Redditività del capitale. Il ROE scende dal 15,6% al 12,9% (-2,6 punti percentuali). Con una scomposizione sequenziale, circa -2,4 punti dipendono dal calo del ROI, -0,5 dalla maggiore incidenza di gestione finanziaria e fiscale e +0,2 dalla leva. La leva resta favorevole (ROI 8,5% > ROD 7,1%), ma lo spread si è ridotto da 3,6 a 1,3 punti. Se si annullasse, l\'indebitamento eroderebbe il ROE anziché sostenerlo.\n\n' +
          'Struttura e liquidità. Il margine di struttura primario è negativo (-428), tipico di un\'impresa manifatturiera capital intensive. È però compensato da fonti durevoli, perché l\'indice secondario è 1,38 e il capitale circolante netto è +897. Gli indici di disponibilità (1,50) e di liquidità secondaria (0,98) sono adeguati. La liquidità immediata è però scesa a 150 (indice 0,08), quindi l\'azienda dipende dagli incassi dei clienti (83 giorni).\n\n' +
          'Indebitamento. La PFN/MOL di 1,62 e l\'autonomia finanziaria del 38,5% indicano una situazione ancora sostenibile. Sono in peggioramento la PFN (+200), il costo del debito (6,4% → 7,1%) e la copertura degli oneri (5,75 → 4,30).\n\n' +
          'Conclusione. L\'azienda è finanziariamente e patrimonialmente equilibrata, con redditività ancora soddisfacente in valore assoluto. Mostra però un deterioramento dei margini, che sono compressi da costi di acquisto, lavoro e finanziari. Servono questi interventi:\n' +
          '- recuperare i margini con revisione dei listini e dei costi di approvvigionamento;\n' +
          '- migliorare la produttività del lavoro;\n' +
          '- monitorare il ritorno dei 580 investiti;\n' +
          '- rinegoziare o allungare il debito;\n' +
          '- ridurre la durata dei crediti e mantenere una politica dei dividendi prudente.',
        tempoResiduo: 5400,
      },
    ],
  },
  'Fiscalità d\'Impresa': {
    Intermedio: [
      {
        area: 'Fiscalità d\'Impresa',
        livello: 'Intermedio',
        titolo: 'Il regime di utilizzo delle perdite fiscali nell\'IRES',
        testo:
          'Il candidato/la candidata illustri il regime di utilizzo delle perdite fiscali per i soggetti IRES.' +
          ' Si indichi l\'ammontare delle perdite fiscali utilizzabili nella seguente fattispecie: la società' +
          ' ALFA, costituita nel 2020, ha conseguito nel 2024 un reddito imponibile di 30.000 euro, mentre ha' +
          ' evidenziato perdite fiscali per 20.000 euro nel 2022 e perdite fiscali per 15.000 euro nel 2023.',
        checklist: [
          { id: 'a1', text: 'Individuata la regola generale di riporto delle perdite ex art. 84, comma 1, TUIR (limite 80%)' },
          { id: 'a2', text: 'Individuata la deroga per le società di nuova costituzione ex art. 84, comma 2, TUIR' },
          { id: 'a3', text: 'Qualificate correttamente le perdite 2022 (agevolata) e 2023 (ordinaria)' },
          { id: 'a4', text: 'Calcolato il plafond 80% sul reddito 2024 (€ 24.000)' },
          { id: 'a5', text: 'Determinato l\'utilizzo ottimale delle perdite (ordinaria prima, agevolata poi)' },
          { id: 'a6', text: 'Calcolato il reddito imponibile IRES 2024 finale (€ 0) e la perdita residua riportabile (€ 5.000)' },
        ],
        notaProfessore:
          'Trappola tipica: la perdita del 2022, essendo del terzo periodo d\'imposta dalla costituzione, rientra' +
          ' nella deroga ex art. 84, comma 2, TUIR e può essere utilizzata senza il limite dell\'80%. La perdita' +
          ' del 2023 è invece ordinaria (quarto periodo) e soggetta al limite dell\'80%. Conviene utilizzare' +
          ' prima la perdita ordinaria (interamente capiente nel plafond) e per ultima quella agevolata, così' +
          ' la quota non utilizzata mantiene il regime di riporto integrale.',
        correzione:
          'La regola generale — art. 84, comma 1, TUIR\n' +
          'Dal 2011 (riforma di cui all\'art. 23, comma 9, D.L. 98/2011) le perdite fiscali dei soggetti IRES sono riportabili senza alcun limite temporale, ma il loro utilizzo è soggetto a un limite quantitativo: in ciascun periodo d\'imposta successivo la perdita pregressa può abbattere il reddito imponibile solo fino all\'80% dello stesso, per l\'intero importo che vi trova capienza. Ne consegue il principio per cui, salvo eccezioni, la società deve comunque assoggettare a tassazione almeno il 20% del reddito imponibile di periodo, anche in presenza di perdite pregresse capienti.\n\n' +
          'La deroga per le società di nuova costituzione — art. 84, comma 2, TUIR\n' +
          'Una disciplina di favore riguarda le perdite realizzate nei primi tre periodi d\'imposta dalla data di costituzione: queste possono essere utilizzate in diminuzione del reddito dei periodi successivi per l\'intero importo che trova capienza nel reddito imponibile, quindi senza il limite dell\'80%, a condizione che si riferiscano a una nuova attività produttiva (condizione che esclude, ad esempio, i casi in cui la "nuova" società prosegua un\'attività preesistente per effetto di conferimento d\'azienda, affitto d\'azienda, fusione o scissione).\n\n' +
          'Il limite antielusivo — art. 84, comma 3 e ss., TUIR\n' +
          'Per completezza, il riporto delle perdite è inoltre soggetto a un limite in caso di mutamento della compagine sociale (trasferimento della maggioranza dei diritti di voto) unito al mutamento dell\'attività principale esercitata; il D.Lgs. 192/2024 ha riscritto il comma 3 introducendo i nuovi commi 3-bis, 3-ter e 3-quater, confermando le esimenti già note (test di vitalità economica; cessioni infragruppo). Questo profilo non rilega nel caso di specie, in assenza di variazioni della compagine sociale.\n\n' +
          'Nota: il meccanismo del riporto riguarda esclusivamente l\'IRES; ai fini IRAP non è previsto alcun riporto delle perdite.\n\n' +
          'Svolgimento del caso ALFA\n\n' +
          'Qualificazione delle perdite pregresse\n' +
          'ALFA è stata costituita nel 2020: assumendo periodi d\'imposta coincidenti con l\'anno solare, i primi tre periodi d\'imposta sono il 2020, il 2021 e il 2022.\n\n' +
          '| Periodo d\'imposta        | Perdita  | Qualificazione                                                                                       |\n' +
          '|---------------------------|----------|------------------------------------------------------------------------------------------------------|\n' +
          '| 2022 (3° periodo)         | 20.000   | Perdita "agevolata" ex comma 2 — riporto integrale, senza limite 80% (si assume riferita a nuova attività produttiva) |\n' +
          '| 2023 (4° periodo)         | 15.000   | Perdita "ordinaria" ex comma 1 — soggetta al limite 80%                                              |\n\n' +
          'Determinazione del reddito imponibile 2024\n\n' +
          '| Voce                                                      | Importo   |\n' +
          '|-----------------------------------------------------------|-----------|\n' +
          '| Reddito imponibile 2024 (ante utilizzo perdite)           | 30.000    |\n' +
          '| Plafond 80% (80% × 30.000)                                | 24.000    |\n' +
          '| Utilizzo perdita 2023 (ordinaria, interamente capiente)   | – 15.000  |\n' +
          '| Reddito residuo                                           | 15.000    |\n' +
          '| Utilizzo perdita 2022 (agevolata, senza limite 80%)      | – 15.000  |\n' +
          '| Reddito imponibile IRES 2024                              | 0         |\n\n' +
          'Conviene utilizzare prioritariamente la perdita "ordinaria" 2023 (comunque interamente capiente nel plafond dell\'80%) e riservare per ultima la perdita "agevolata" 2022: in questo modo la quota di perdita 2022 non utilizzata mantiene il proprio regime di riporto integrale (senza limite dell\'80%) per i periodi d\'imposta successivi, anziché "retrocedere" al regime ordinario.\n\n' +
          'Le perdite fiscali complessivamente utilizzabili nel 2024 ammontano a 30.000 euro (15.000 della perdita 2023 per intero + 15.000 della perdita 2022), che azzerano interamente il reddito imponibile: IRES dovuta per il 2024 pari a zero. Residuano 5.000 euro di perdita (quota della perdita 2022), riportabili senza limiti di tempo e utilizzabili in futuro senza il vincolo dell\'80%, ai sensi dell\'art. 84, comma 2, TUIR.',
        tempoResiduo: 1500,
      },
      {
        area: 'Fiscalità d\'Impresa',
        livello: 'Intermedio',
        titolo: 'Riscossione coattiva e rateazione delle cartelle',
        testo:
          'Il/la candidato/a esponga i caratteri principali della Riscossione Coattiva approfondendo' +
          ' le modalità della rateazione delle cartelle esattoriali.',
        checklist: [
          { id: 'b1', text: 'Illustrata l\'autotutela esecutiva: l\'ente forma da sé il titolo esecutivo (ruolo reso esecutivo) senza sentenza di condanna.' },
          { id: 'b2', text: 'Chiariti i termini di decadenza per la notifica della cartella e il termine di 60 giorni per il pagamento, con decorrenza degli interessi di mora.' },
          { id: 'b3', text: 'Descritta la gradualità degli strumenti: fase cautelare (fermo amministrativo, ipoteca art. 77 D.P.R. 602/1973, soglia 20.000 euro) e fase esecutiva (pignoramento mobiliare, immobiliare, presso terzi).' },
          { id: 'b4', text: 'Evidenziato il sistema di tutela del debitore: impugnazione dinanzi alle Corti di giustizia tributaria, opposizione all\'esecuzione (artt. 615 e 617 c.p.c.), autotutela, sospensione legale.' },
          { id: 'b5', text: 'Disciplinata la rateazione ex art. 19 D.P.R. 602/1973: istanza del debitore in temporanea difficoltà, natura non discrezionale dell\'accoglimento.' },
          { id: 'b6', text: 'Individuati i nuovi limiti di rateazione post-riforma: 84 rate (2025-2026), 96 (2027-2028), 108 (dal 2029); semplificazione per debiti fino a 120.000 euro.' },
          { id: 'b7', text: 'Chiariti gli effetti della rateazione: sospensione nuove esecuzioni, efficaci misure cautelari già iscritte, accesso al DURC fiscale (art. 28-ter).' },
          { id: 'b8', text: 'Evidenziata la decadenza per mancato pagamento di 5 rate anche non consecutive e la proroga fino al doppio delle rate originarie.' },
        ],
        notaProfessore:
          'Trappole tipiche: (1) Confondere la rateazione ordinaria (art. 19 D.P.R. 602/1973) con le' +
          ' definizioni agevolate (rottamazioni), che sono misure straordinarie e temporanee con regole' +
          ' proprie di adesione e decadenza. (2) Dimenticare che la decadenza scatta dopo 5 rate anche non' +
          ' consecutive, non solo consecutive. (3) Non distinguerla dalla transazione fiscale nella crisi' +
          ' d\'impresa (art. 63 CCII), che incide sulla misura del credito e non solo sui tempi di pagamento.' +
          ' (4) Trascurare il ruolo del commercialista nella verifica di regolarità della notifica, prescrizione' +
          ' e decadenza, e negli effetti sul DURC fiscale e sui profili penal-tributari (artt. 10-bis e 10-ter' +
          ' D.Lgs. 74/2000).',
        correzione:
          'Svolgimento\n\n' +
          'Premessa\n\n' +
          'La riscossione coattiva è il complesso di procedimenti con cui l\'ente creditore recupera in via forzosa i crediti, tributari e non, rimasti insoluti dopo la scadenza del termine per il pagamento spontaneo. Si colloca a valle della fase di accertamento e liquidazione e risponde all\'interesse costituzionalmente rilevante (artt. 53 e 97 Cost.) all\'effettività del prelievo e al buon andamento dell\'azione amministrativa. Il quadro normativo è dato dal D.P.R. 602/1973, dal D.Lgs. 46/1999 per le entrate non tributarie e dal D.Lgs. 110/2024, che ha riordinato in modo organico la materia.\n\n' +
          'I caratteri principali\n\n' +
          'Il primo carattere è l\'autotutela esecutiva. L\'ente impositore forma da sé il titolo esecutivo, senza dover ottenere una sentenza di condanna. Il titolo è il ruolo, reso esecutivo e affidato all\'agente della riscossione, che notifica la cartella di pagamento. Per molti tributi erariali, dal 2020, l\'avviso di accertamento esecutivo svolge la funzione di titolo anche senza cartella.\n\n' +
          'Il secondo carattere è la rigidità dei termini. La cartella deve essere notificata a pena di decadenza entro i termini previsti dalla legge. Dalla notifica decorrono 60 giorni per il pagamento, trascorsi i quali maturano gli interessi di mora e l\'agente può avviare le azioni cautelari ed esecutive. Resta ferma la prescrizione del credito, che il contribuente può eccepire. La riforma ha inoltre previsto il discarico automatico delle quote non riscosse dopo cinque anni, con ritorno del credito all\'ente titolare.\n\n' +
          'Il terzo carattere è la gradualità degli strumenti. In fase cautelare l\'agente può disporre il fermo amministrativo dei beni mobili registrati e iscrivere ipoteca (art. 77 D.P.R. 602/1973, soglia di 20.000 euro). In fase esecutiva può procedere con pignoramento mobiliare, immobiliare e presso terzi, nel rispetto dei limiti di impignorabilità e dei limiti di pignorabilità di stipendi e pensioni. Per l\'abitazione principale vale il limite dell\'art. 76.\n\n' +
          'Il quarto carattere è il sistema di tutela del debitore. Questi può impugnare la cartella dinanzi alle Corti di giustizia tributaria, proporre opposizione all\'esecuzione o agli atti esecutivi (artt. 615 e 617 c.p.c., secondo la natura del credito), sollecitare l\'autotutela o presentare la dichiarazione per la sospensione legale della riscossione.\n\n' +
          'La rateazione delle cartelle\n\n' +
          'La rateazione, disciplinata dall\'art. 19 D.P.R. 602/1973, consente al contribuente che versi in una situazione di temporanea e obiettiva difficoltà economica di ripartire il debito in rate mensili. Ha natura di istanza del debitore all\'agente della riscossione, e l\'accoglimento non è discrezionale: se i presupposti sussistono, la dilazione va concessa.\n\n' +
          'Dopo la riforma, per le istanze presentate dal 1° gennaio 2025, il numero massimo delle rate cresce nel tempo: 84 nel biennio 2025-2026, 96 nel biennio 2027-2028, 108 dal 2029. Per i debiti fino a 120.000 euro basta una dichiarazione del contribuente sulla propria difficoltà, mentre per i debiti superiori occorre documentarla, con gli indici di liquidità e di indebitamento per le imprese e con l\'ISEE per le persone fisiche. Il piano può prevedere rate costanti o crescenti. Sulle somme dilazionate maturano interessi a tasso fissato con decreto ministeriale.\n\n' +
          'Gli effetti sono rilevanti. Con la presentazione dell\'istanza e la concessione del piano non possono essere avviate nuove procedure esecutive, mentre restano efficaci le misure cautelari già iscritte, come fermi e ipoteche. Quando il piano è in regola, il contribuente può ottenere il DURC fiscale (art. 28-ter D.P.R. 602/1973) e partecipare agli appalti.\n\n' +
          'Il beneficio decade se il debitore non paga cinque rate, anche non consecutive. In tal caso l\'intero debito residuo diventa immediatamente esigibile in unica soluzione e il carico non può più essere rateizzato. In presenza di temporanea difficoltà e di una decadenza o di un piano ancora in corso, la legge consente, a certe condizioni, la proroga della dilazione fino al doppio delle rate originarie, ma solo se la difficoltà è comprovata.\n\n' +
          'Rateazione e misure straordinarie\n\n' +
          'La rateazione ordinaria va tenuta distinta dalle definizioni agevolate, le cosiddette rottamazioni, che sono misure straordinarie e temporanee: consentono di estinguere il debito senza sanzioni e interessi di mora, con regole proprie di adesione, pagamento e decadenza. Va distinta anche dalla transazione fiscale nella crisi d\'impresa (art. 63 CCII), che incide sulla misura stessa del credito e non solo sui tempi di pagamento.\n\n' +
          'Considerazioni conclusive\n\n' +
          'La rateazione è lo strumento ordinario con cui l\'ordinamento bilancia l\'interesse erariale all\'incasso e la sostenibilità del debito per il contribuente. Il ruolo del commercialista è verificare la regolarità della notifica e il decorso di prescrizione e decadenza, valutare la convenienza tra rateazione e definizione agevolata, predisporre l\'istanza e monitorare il rispetto del piano, anche per gli effetti sul DURC fiscale e sui profili penal-tributari dell\'omesso versamento (artt. 10-bis e 10-ter D.Lgs. 74/2000).',
        tempoResiduo: 1500,
      },
    ],
    Avanzato: [
      {
        area: 'Fiscalità d\'Impresa',
        livello: 'Avanzato',
        titolo: 'Determinazione del Reddito d\'Impresa ai fini IRES',
        testo:
          'Il candidato esamini le principali regole di determinazione del reddito d\'impresa ai fini IRES,' +
          ' con particolare riferimento alle principali variazioni in aumento e in diminuzione rispetto al' +
          ' risultato civilistico. Approfondisca le tematiche della deducibilità dei costi, della rilevazione' +
          ' delle sopravvenienze attive e passive e dell\'eventuale utilizzo delle perdite fiscali pregresse.' +
          ' Concluda con la simulazione di una dichiarazione fiscale semplificata per un\'impresa industriale.',
        checklist: [
          { id: 'a1', text: 'Calcolata la variazione in aumento per ammortamento eccedente (quota civile € 150.000 vs quota fiscale € 100.000 = +€ 50.000)' },
          { id: 'a2', text: 'Calcolata la variazione in aumento per svalutazione crediti eccedente (plafond 0,5% × € 4.000.000 = € 20.000; eccedenza € 40.000)' },
          { id: 'a3', text: 'Verificata l\'assenza di eccedenza per spese di rappresentanza (limite 1,5% × € 5.000.000 = € 75.000 > € 30.000)' },
          { id: 'a4', text: 'Verificata l\'assenza di eccedenza per interessi passivi (€ 60.000 < 30% ROL = € 960.000)' },
          { id: 'a5', text: 'Calcolata la variazione in aumento per compensi amministratori non corrisposti (+€ 50.000)' },
          { id: 'a6', text: 'Calcolata la variazione in diminuzione per dividendi (esenzione 95% × € 100.000 = -€ 95.000)' },
          { id: 'a7', text: 'Determinato il reddito imponibile lordo (€ 2.150.000 + € 140.000 - € 95.000 = € 2.195.000)' },
          { id: 'a8', text: 'Applicate le perdite pregresse (€ 300.000 < 80% di € 2.195.000 = € 1.756.000) → reddito netto € 1.895.000' },
          { id: 'a9', text: 'Calcolata l\'IRES lorda (24% × € 1.895.000 = € 454.800) e netta (€ 449.800)' },
        ],
        notaProfessore:
          'Trappole tipiche: (1) Dimenticare che il plafond per le spese di rappresentanza è sull\'1,5% dei ricavi' +
          ' e non sull\'EBT — in questo caso le spese sono ampiamente entro il limite, quindi nessuna variazione.' +
          ' (2) Sul calcolo del ROL per gli interessi passivi, bisogna considerare solo i componenti della gestione' +
          ' caratteristica (ricavi meno costi operativi, esclusi ammortamenti e componenti straordinari).' +
          ' (3) I compensi agli amministratori deliberati ma non corrisposti sono una deroga esplicita al' +
          ' principio di competenza: si deducono solo per cassa. (4) Le perdite pregresse da start-up (primi 3' +
          ' periodi) si utilizzano senza il limite dell\'80%; quelle ordinarie sono soggette al limite.',
        correzione:
          '1. PREMESSA METODOLOGICA\n' +
          'La determinazione del reddito d\'impresa ai fini IRES (Imposta sul Reddito delle Società) prende necessariamente le mosse dal risultato civilistico — il reddito o la perdita risultante dal Conto Economico redatto secondo i principi OIC — per poi pervenire, attraverso un sistema di variazioni in aumento e in diminuzione, al cosiddetto reddito imponibile fiscale.\n\n' +
          'Il fondamento normativo è l\'art. 83 TUIR (D.P.R. 917/1986), che sancisce il c.d. principio di derivazione rafforzata per i soggetti OIC-adopter: il reddito imponibile si determina apportando all\'utile (o alla perdita) di esercizio le variazioni previste dal TUIR medesimo.\n\n' +
          'I principi cardine che governano la fiscalità d\'impresa sono:\n' +
          '- Competenza (Art. 109, co. 1-2 TUIR): i componenti positivi/negativi rilevano nell\'esercizio di maturazione\n' +
          '- Certezza e obiettiva determinabilità (Art. 109, co. 1 TUIR): il costo è deducibile solo se certo nell\'esistenza e determinabile nell\'ammontare\n' +
          '- Inerenza (Art. 109, co. 5 TUIR): i costi sono deducibili solo se inerenti all\'attività d\'impresa\n' +
          '- Previa imputazione a CE (Art. 109, co. 4 TUIR): le spese sono deducibili solo se imputate al CE\n\n' +
          '2. LE PRINCIPALI VARIAZIONI IN AUMENTO\n' +
          'Le variazioni in aumento derivano da componenti rilevati civilisticamente come costi (o non ricavi), ma non deducibili fiscalmente in tutto o in parte.\n\n' +
          '2.1 Ammortamenti (artt. 102–103 TUIR)\n' +
          'Il TUIR fissa aliquote massime di ammortamento per beni materiali e immateriali. Se la quota civilistica supera quella fiscalmente consentita, la differenza genera una variazione in aumento.\n' +
          '- Beni materiali (art. 102): aliquote tabellari D.M. 31/12/1988; nel primo esercizio le aliquote sono ridotte alla metà\n' +
          '- Beni immateriali (art. 103): i marchi sono ammortizzabili in misura non superiore a 1/18 l\'anno; i brevetti in misura non superiore al 50%\n' +
          '- Avviamento (art. 103, co. 3): deducibile in misura non superiore a 1/18 l\'anno\n\n' +
          '2.2 Svalutazioni crediti e accantonamenti (artt. 101, 105, 106 TUIR)\n' +
          '- Svalutazione crediti commerciali (art. 106): deducibile in misura non superiore allo 0,5% del valore nominale dei crediti commerciali iscritti in bilancio, fino a concorrenza del plafond del 5%\n' +
          '- Fondo rischi e oneri (art. 105): gli accantonamenti a fondi rischi generici non sono deducibili\n\n' +
          '2.3 Spese di rappresentanza (art. 108, co. 2 TUIR)\n' +
          'Deducibili nei limiti dell\'1,5% dei ricavi fino a 10 milioni di euro, con aliquote decrescenti per fasce superiori (0,6% e 0,4%).\n\n' +
          '2.4 Spese per autovetture (art. 164 TUIR)\n' +
          'Le autovetture ad uso promiscuo sono deducibili solo al 20% del costo (con tetto di € 18.075,99 per il costo di acquisto).\n\n' +
          '2.5 Interessi passivi (art. 96 TUIR)\n' +
          'Gli interessi passivi sono deducibili fino a concorrenza degli interessi attivi; per l\'eccedenza, sono deducibili nei limiti del 30% del ROL (Risultato Operativo Lordo).\n\n' +
          '2.6 Compensi agli amministratori (art. 95, co. 5 TUIR)\n' +
          'I compensi deliberati ma non ancora corrisposti entro la chiusura dell\'esercizio non sono deducibili per competenza ma solo per cassa.\n\n' +
          '3. LE PRINCIPALI VARIAZIONI IN DIMINUZIONE\n' +
          '3.1 Dividendi (art. 89 TUIR)\n' +
          'I dividendi ricevuti da società di capitali residenti concorrono alla formazione del reddito imponibile solo nella misura del 5% del loro ammontare (esenzione del 95%).\n\n' +
          '3.2 Plusvalenze rateizzate e PEX (artt. 86-87 TUIR)\n' +
          'Le plusvalenze da cessione di beni strumentali possono essere rateizzate in quote costanti nell\'esercizio di realizzo e nei successivi, fino a un massimo di 5 esercizi. Per le partecipazioni PEX, la plusvalenza è esente al 95%.\n\n' +
          '3.3 Quote di ammortamento dedotte in precedenza (recupero differenze temporanee)\n\n' +
          '4. SOPRAVVENIENZE ATTIVE E PASSIVE\n' +
          '4.1 Sopravvenienze attive (art. 88 TUIR): proventi non classificabili tra i ricavi ordinari, indennità assicurative, contributi in conto esercizio, riduzione di passività precedentemente dedotte. Stralcio del debito (art. 88, co. 4 TUIR): non tassabile nei limiti delle perdite pregresse e di quelle del periodo.\n' +
          '4.2 Sopravvenienze passive (art. 101 TUIR): perdite su crediti deducibili se risultano da elementi certi e precisi.\n\n' +
          '5. PERDITE FISCALI PREGRESSE (art. 84 TUIR)\n' +
          'Le perdite realizzate a partire dal terzo periodo d\'imposta successivo all\'inizio dell\'attività sono riportabili a nuovo senza limiti di tempo, ma utilizzabili in ciascun periodo nel limite dell\'80% del reddito imponibile. Le perdite dei primi tre periodi d\'imposta (start-up) sono riportabili senza limite temporale e senza il limite dell\'80%.\n\n' +
          '6. SIMULAZIONE DI DICHIARAZIONE FISCALE SEMPLIFICATA — IMPRESA INDUSTRIALE\n' +
          'Società: Beta Industrie S.r.l. | Esercizio: 2024 | Settore: produzione metalmeccanica\n\n' +
          '6.1 Dati di partenza (Conto Economico civilistico)\n' +
          '- Ricavi di vendita: € 5.000.000\n' +
          '- Altri proventi (dividendi da partecipazione qualificata): € 100.000\n' +
          '- Costi del personale: (€ 1.800.000)\n' +
          '- Ammortamento impianti (aliquota civile 15%): (€ 150.000)\n' +
          '- Svalutazione crediti: (€ 60.000)\n' +
          '- Spese di rappresentanza: (€ 30.000)\n' +
          '- Interessi passivi su finanziamento bancario: (€ 80.000)\n' +
          '- Interessi attivi: (€ 20.000)\n' +
          '- Compensi amministratori deliberati, non corrisposti: (€ 50.000)\n' +
          '- Utile ante imposte (EBT): € 2.150.000\n\n' +
          'Valore dei crediti commerciali: € 4.000.000\n\n' +
          '6.2 Calcolo delle Variazioni Fiscali\n\n' +
          'VARIAZIONI IN AUMENTO\n\n' +
          '1. Ammortamento eccedente:\n' +
          '   Aliquota fiscale 10% → quota fiscale € 100.000; quota civile € 150.000; eccedenza € 50.000 → +€ 50.000\n\n' +
          '2. Svalutazione crediti eccedente:\n' +
          '   Plafond 0,5% × € 4.000.000 = € 20.000; eccedenza € 60.000 − € 20.000 = € 40.000 → +€ 40.000\n\n' +
          '3. Spese rappresentanza eccedenti:\n' +
          '   Limite 1,5% × € 5.000.000 = € 75.000; spese sostenute € 30.000 → nessuna eccedenza → € 0\n\n' +
          '4. Interessi passivi eccedenti:\n' +
          '   ROL = Ricavi − Costi operativi senza amm.ti = 5.000.000 − 1.800.000 = 3.200.000; 30% ROL = 960.000;\n' +
          '   Int. passivi eccedenti Int. attivi = 80.000 − 20.000 = 60.000 < 960.000 → nessuna eccedenza → € 0\n\n' +
          '5. Compensi amministratori non corrisposti:\n' +
          '   Non deducibili per cassa → +€ 50.000\n\n' +
          'Totale variazioni in aumento: +€ 140.000\n\n' +
          'VARIAZIONI IN DIMINUZIONE\n\n' +
          '1. Dividendi – esenzione 95%:\n' +
          '   95% × € 100.000 = € 95.000 → -€ 95.000\n\n' +
          'Totale variazioni in diminuzione: -€ 95.000\n\n' +
          '6.3 Dal risultato civilistico al reddito imponibile\n\n' +
          '   Utile ante imposte (civilistico):      € 2.150.000\n' +
          '   (+) Variazioni in aumento:              +€ 140.000\n' +
          '   (−) Variazioni in diminuzione:          -€ 95.000\n' +
          '   Reddito imponibile lordo:               € 2.195.000\n' +
          '   (−) Utilizzo perdite pregresse\n' +
          '       (80% × 2.195.000 = 1.756.000;\n' +
          '        perdite disponibili € 300.000):    -€ 300.000\n' +
          '   Reddito imponibile netto:               € 1.895.000\n\n' +
          '6.4 Calcolo IRES\n\n' +
          '   Reddito imponibile netto:               € 1.895.000\n' +
          '   Aliquota IRES (art. 77 TUIR):           24%\n' +
          '   IRES lorda:                             € 454.800\n' +
          '   (−) Crediti d\'imposta / ritenute:       -€ 5.000\n' +
          '   IRES netta da versare:                  € 449.800\n\n' +
          '6.5 Dichiarazione semplificata (Modello Redditi SC — schema logico)\n\n' +
          'QUADRO RF — Determinazione del reddito d\'impresa\n' +
          'RF1  – Utile (perdita) dell\'esercizio              €  2.150.000\n' +
          'RF15 – Variazioni in aumento (totale)              €    140.000\n' +
          'RF29 – Variazioni in diminuzione (totale)          €     95.000\n' +
          'RF63 – Reddito/Perdita di periodo (RF1+RF15-RF29)  €  2.195.000\n\n' +
          'QUADRO RS — Perdite pregresse\n' +
          'RS42 – Perdite pregresse disponibili               €    300.000\n' +
          'RS43 – Perdite utilizzate nel periodo              €    300.000\n\n' +
          'QUADRO RN — Determinazione dell\'IRES\n' +
          'RN1  – Reddito imponibile (RF63 – RS43)            €  1.895.000\n' +
          'RN5  – IRES lorda (24%)                            €    454.800\n' +
          'RN17 – Crediti d\'imposta                           €      5.000\n' +
          'RN26 – IRES netta                                  €    449.800\n\n' +
          '7. CONSIDERAZIONI CONCLUSIVE\n\n' +
          'La corretta determinazione del reddito d\'impresa IRES richiede al professionista una doppia lettura del Conto Economico: quella civilistica, orientata alla rappresentazione veritiera e corretta della situazione reddituale, e quella fiscale, governata dai principi di competenza, certezza, inerenza e dai limiti quantitativi del TUIR.\n\n' +
          'Il lavoro di riconciliazione tra le due rappresentazioni — cristallizzato nel Quadro RF della dichiarazione dei redditi — è un momento centrale della consulenza del Dottore Commercialista, che deve saper identificare le differenze temporanee (destinate a riassorbirsi) da quelle permanenti (che non si recuperano mai), anche ai fini della corretta contabilizzazione delle imposte differite e anticipate secondo il principio OIC 25.\n\n' +
          'La gestione strategica delle perdite pregresse e la pianificazione dell\'utilizzo degli strumenti agevolativi (PEX, dividendi, mini-IRES) rappresentano, infine, i principali ambiti in cui il contributo del professionista genera valore concreto per l\'impresa assistita.',
        tempoResiduo: 5400,
      },
      {
        area: 'Fiscalità d\'Impresa',
        livello: 'Avanzato',
        titolo: 'Locazioni Commerciali: Tassazione dei Redditi da Fabbricato di Persone Fisiche e Giuridiche',
        testo:
          'Premessi alcuni cenni sugli aspetti civilistici del contratto di locazione civile commerciale,' +
          ' il/la candidato/a illustri la tassazione dei redditi da fabbricato delle persone fisiche' +
          ' (considerando in particolare l\'applicazione del regime tributario sostitutivo sul reddito da' +
          ' locazione c.d. cedolare secca sugli affitti) e delle persone giuridiche, evidenziandone per' +
          ' queste ultime anche la dimensione contabile.',
        checklist: [
          { id: 'c1', text: 'Illustrati gli aspetti civilistici della locazione commerciale (L. 392/1978, durata minima 6 anni, indennità di avviamento, prelazione, canone e deposito)' },
          { id: 'c2', text: 'Esposto il regime ordinario IRPEF per persone fisiche: reddito da fabbricato, competenza, deduzione forfettaria del 5%, imposta di registro' },
          { id: 'c3', text: 'Analizzata la cedolare secca (art. 3 D.Lgs. 23/2011): requisiti soggettivi e oggettivi, aliquote (21% e 10%), base imponibile, adempimenti' },
          { id: 'c4', text: 'Evidenziato il limite critico: cedolare secca preclusa alle locazioni commerciali stipulate dopo il 2019 (solo locali C/1 fino a 600 mq, sperimentale)' },
          { id: 'c5', text: 'Trattata la tassazione delle persone giuridiche: IRES 24% su reddito d\'impresa, immobili strumentali vs patrimoniali, deducibilità costi' },
          { id: 'c6', text: 'Esposta la disciplina IVA delle locazioni di fabbricati strumentali (esenzione art. 10 n. 8, opzione per imponibilità, pro-rata)' },
          { id: 'c7', text: 'Illustrata la dimensione contabile: iscrizione del fabbricato (OIC 16), canoni per competenza con ratei e risconti (OIC 18), scritture di esempio' },
          { id: 'c8', text: 'Concluso con la differenza di fondo tra i due regimi (IRPEF/cedolare per fisiche, reddito d\'impresa per giuridiche)' },
        ],
        notaProfessore:
          'Trappola tipica: la cedolare secca NON è applicabile alle locazioni commerciali stipulate dopo il 2019.' +
          ' La L. 145/2018 l\'ha estesa in via sperimentale solo ai locali C/1 fino a 600 mq per i contratti' +
          ' stipulati nel 2019. Oggi resta in vigore solo per i contratti stipulati entro fine 2019 per cui fu' +
          ' scelto il regime agevolato. Un contratto commerciale stipulato oggi non può optare per la cedolare.' +
          ' Altro punto critico: per le persone giuridiche, il trattamento dipende dalla classificazione' +
          ' dell\'immobile (strumentale vs patrimoniale) e influisce sulla deducibilità dei costi. Non' +
          ' dimenticare la dimensione contabile: ratei e risconti sui canoni a cavallo d\'anno (OIC 18).',
        correzione:
          '1. CENNI CIVILISTICI SULLA LOCAZIONE COMMERCIALE\n\n' +
          'La locazione è il contratto con cui una parte si obbliga a far godere all\'altra una cosa mobile o immobile per un dato tempo, verso un corrispettivo (art. 1571 c.c.). Per gli immobili urbani ad uso diverso dall\'abitazione, la disciplina speciale è la L. 392/1978 (artt. 27 ss.).\n\n' +
          'Durata: minimo 6 anni (9 per le attività alberghiere), con rinnovo tacito di ulteriori 6 o 9 anni. Il locatore può negare il rinnovo solo alla prima scadenza e per i motivi tassativi dell\'art. 29, con disdetta di 12 mesi. Alla seconda scadenza può disdire liberamente.\n' +
          'Recesso del conduttore: è ammesso per gravi motivi, con preavviso di 6 mesi (art. 27, c. 8). Il contratto può prevedere anche un recesso convenzionale.\n' +
          'Indennità di avviamento: spetta al conduttore se il rapporto cessa per cause non imputabili a lui, quando svolge attività a contatto con il pubblico. Vale 18 mensilità (21 per gli alberghi), art. 34.\n' +
          'Prelazione: il conduttore ha prelazione in caso di vendita o nuova locazione (artt. 38 e 40).\n' +
          'Cessione e sublocazione: sono regolate dall\'art. 36. L\'azienda può essere ceduta anche senza il consenso del locatore, salvo che questi opponga gravi motivi.\n' +
          'Canone, deposito e oneri: il canone è liberamente determinato dalle parti. L\'aggiornamento può arrivare al massimo al 75% della variazione ISTAT (art. 32). Il deposito cauzionale non può superare 3 mensilità (art. 11).\n' +
          'Forma e registrazione: la forma scritta è richiesta per i contratti ultranovennali (art. 1350 c.c.), ma in pratica si usa sempre. La registrazione avviene entro 30 giorni. L\'art. 1, c. 346, L. 311/2004 sanziona con la nullità i contratti non registrati; le Sezioni Unite (n. 18213/2015) ammettono però la sanatoria con registrazione tardiva.\n\n' +
          '2. PERSONE FISICHE\n\n' +
          '2.1 Regime ordinario (IRPEF)\n\n' +
          'Il reddito da fabbricato è un reddito fondiario (artt. 25 ss. TUIR). Concorre al reddito complessivo del titolare del diritto reale indipendentemente dalla percezione (art. 26), cioè con criterio di competenza e non di cassa. Per le locazioni abitative esiste un\'eccezione: se la morosità è provata da intimazione di sfratto, il canone non percepito non è tassato e le imposte già versate danno diritto a un credito.\n\n' +
          'La determinazione del reddito dipende dall\'uso dell\'immobile (art. 37 TUIR):\n' +
          '- Immobile non locato: si tassa la rendita catastale rivalutata del 5%.\n' +
          '- Immobile locato: si tassa il maggiore tra la rendita rivalutata e il canone ridotto del 5% a titolo di deduzione forfettaria delle spese. La riduzione è del 25% per Venezia centro storico e di altre percentuali per gli immobili vincolati. Il canone è considerato per intero anche se le spese sono molto più alte.\n\n' +
          'L\'imposta si calcola con le aliquote IRPEF a scaglioni, più le addizionali regionale e comunale. Il locatore deve inoltre pagare registro e bollo sul contratto. L\'imposta di registro è pagata in solido, ma in prassi è ripartita al 50% tra le parti. Di norma è del 2% sugli immobili urbani e dell\'1% sugli immobili strumentali. L\'IMU sull\'immobile locato non è deducibile dal reddito fondiario.\n\n' +
          'Se il locatore esercita un\'attività d\'impresa o professionale, l\'immobile può rientrare in quel reddito, e l\'IMU è deducibile al 100% dal 2022 per gli immobili strumentali.\n\n' +
          '2.2 Cedolare secca (art. 3 D.Lgs. 23/2011)\n\n' +
          'È un regime opzionale con imposta sostitutiva di IRPEF, addizionali, imposta di registro e imposta di bollo sul contratto (relativi a risoluzione e proroga compresi).\n\n' +
          'Requisiti soggettivi. Il locatore deve essere una persona fisica titolare di proprietà o di altro diritto reale, e deve agire fuori dall\'esercizio di impresa, arti o professioni. Il conduttore non deve agire in veste imprenditoriale o professionale quando la locazione è abitativa.\n\n' +
          'Requisiti oggettivi. Il regime vale per le abitazioni (categorie catastali A, tranne A/10) con le relative pertinenze locate congiuntamente (C/2, C/6, C/7).\n\n' +
          'Il punto critico per la traccia: le locazioni commerciali. Il regime non vale in generale per i negozi, i locali e gli uffici. La L. 145/2018 lo ha esteso, in via sperimentale, ai soli locali C/1 fino a 600 mq. La norma si applica solo ai contratti stipulati nel 2019, e il locatore deve essere una persona fisica che opera come privato. Oggi la cedolare sugli affitti commerciali resta in vigore solo per i contratti di negozi e uffici stipulati entro fine 2019 e per i quali fu scelto il regime agevolato; la legge delega di riforma fiscale ne prevede l\'estensione, ma l\'ipotesi era ancora in fase di definizione. Ne consegue che un contratto commerciale stipulato oggi non può optare per la cedolare. Questo va detto chiaramente nello svolgimento.\n\n' +
          'Aliquote. 21% in via generale, 10% nei casi agevolati, cioè i contratti a canone concordato nei comuni ad alta tensione abitativa. Per le locazioni brevi (fino a 30 giorni), 21% sul primo immobile indicato in dichiarazione e 26% sul secondo; dal 2026 il limite per restare nel regime privato scende da 4 a 2 appartamenti.\n\n' +
          'Base imponibile. È il canone annuo contrattuale senza la riduzione forfettaria del 5%. In cambio, il locatore deve rinunciare agli aggiornamenti del canone, ISTAT compreso, con comunicazione al conduttore.\n\n' +
          'Adempimenti. L\'opzione si esercita in sede di registrazione (modello RLI), alla proroga o con la dichiarazione dei redditi. Se più locatori sono comproprietari, ciascuno opta per conto proprio. Si versa un acconto del 95%, in due rate (40% e 60%), più il saldo. Il reddito assoggettato a cedolare non entra nell\'IRPEF, ma conta per ISEE e per le detrazioni legate al reddito.\n\n' +
          'Convenienza. Dipende dall\'aliquota marginale IRPEF del locatore. Esempio con valori solo illustrativi, canone di 12.000 € e aliquota marginale del 33%: in regime ordinario la base è 11.400 € (canone meno 5%), quindi 3.762 € di IRPEF più addizionali e registro. Con la cedolare al 21% l\'imposta è 2.520 €, senza altri oneri. Per i redditi bassi, entro il primo scaglione, la convenienza si riduce molto. Con il 10% sul canone concordato, invece, è quasi sempre conveniente.\n\n' +
          '3. PERSONE GIURIDICHE\n\n' +
          'La cedolare secca non è applicabile alle società e agli enti. Il trattamento dipende dalla natura del soggetto.\n\n' +
          '3.1 Società commerciali (IRES/IRAP)\n\n' +
          'Per le società di capitali il reddito è unico, di impresa (art. 81 TUIR), ed è tassato con IRES al 24% (art. 77) più IRAP. Il trattamento dell\'immobile dipende dalla sua classificazione.\n\n' +
          'Immobile strumentale (per natura o per destinazione, art. 43 TUIR): i canoni sono ricavi (art. 85) e concorrono secondo competenza (art. 109). Sono deducibili:\n' +
          '- l\'ammortamento, con la quota di costo riferibile all\'area scorporata e non ammortizzabile (20% per i fabbricati strumentali in generale, 30% per i fabbricati industriali);\n' +
          '- le manutenzioni, nei limiti dell\'art. 102, c. 6;\n' +
          '- l\'IMU;\n' +
          '- gli interessi passivi, nei limiti dell\'art. 96 (30% del ROL).\n\n' +
          'Immobile patrimoniale: il reddito segue le regole dei fondiari (art. 90 TUIR). Le spese sono per lo più indeducibili (art. 90, c. 2).\n' +
          'Società immobiliare di gestione: gli immobili locati sono di norma considerati strumentali, perché la locazione è l\'attività tipica.\n' +
          'Società non operative (art. 30 L. 724/94): se i ricavi dichiarati sono inferiori a una soglia calcolata sul valore degli immobili, si applica il reddito minimo presunto, con IRES maggiorata di 10,5 punti.\n\n' +
          'Le società di persone commerciali determinano il reddito d\'impresa e lo imputano ai soci. Gli enti non commerciali tassano i redditi fondiari con le regole ordinarie (art. 143 TUIR).\n\n' +
          '3.2 IVA\n\n' +
          'La locazione di fabbricati strumentali è, in via ordinaria, esente (art. 10, n. 8, DPR 633/72), con opzione per l\'imponibilità. Il locatore che opta ha diritto di detrarre l\'IVA sugli acquisti. Se resta in regime di esenzione, la detrazione è limitata dal pro-rata (art. 19-bis).\n\n' +
          '3.3 Dimensione contabile\n\n' +
          'Locatore (principi OIC):\n' +
          '- Il fabbricato è iscritto in B.II (OIC 16), con terreno e fabbricato separati. Si ammortizza solo il fabbricato.\n' +
          '- I canoni vanno in A.1 se la locazione è attività tipica, altrimenti in A.5.\n' +
          '- Si applica la competenza, con ratei e risconti sui canoni a cavallo d\'anno (OIC 18).\n' +
          '- Il deposito cauzionale è un debito verso il conduttore.\n' +
          '- IMU, manutenzioni e ammortamenti sono voci di costo.\n\n' +
          'Conduttore:\n' +
          '- Il canone è un costo di B.8 (godimento beni di terzi).\n' +
          '- Le migliorie su beni di terzi sono immobilizzazioni immateriali (OIC 24), ammortizzate nel periodo minore tra l\'utilità e la durata del contratto, rinnovo compreso.\n' +
          '- Per chi applica gli IFRS vale invece il modello IFRS 16, con il diritto d\'uso a bilancio.\n\n' +
          'Esempio di scritture. Locazione con canone annuo di 36.000 €, IVA al 22%, pagato anticipatamente per il periodo 1/7/N – 30/6/N+1.\n\n' +
          '| Data     | Conto                      | Dare     | Avere    |\n' +
          '|----------|----------------------------|----------|----------|\n' +
          '| 1/7/N    | Crediti verso clienti      | 43.920   |          |\n' +
          '|          |   Ricavi per locazioni     |          | 36.000   |\n' +
          '|          |   IVA a debito             |          | 7.920    |\n' +
          '| 31/12/N  | Ricavi per locazioni       | 18.000   |          |\n' +
          '|          |   Risconti passivi         |          | 18.000   |\n\n' +
          'La seconda scrittura rinvia a N+1 la quota di canone di competenza dei primi 6 mesi dell\'anno successivo.\n\n' +
          '4. CONCLUSIONE\n\n' +
          'Le persone fisiche scelgono tra IRPEF ordinaria, con deduzione forfettaria del 5% e registro a carico, e cedolare secca. La cedolare è però preclusa alle locazioni commerciali nate dopo il 2019. Le persone giuridiche tassano i canoni nel reddito d\'impresa, con ammortamenti e costi deducibili o meno secondo la classificazione dell\'immobile, e li contabilizzano per competenza. Questa è la differenza di fondo tra i due regimi.\n\n' +
          'Nota per l\'esame: il nuovo Testo unico approvato con D.Lgs. 117/2026, pubblicato in G.U. il 3 luglio 2026, riordina anche la cedolare secca e ne trasferisce le norme negli artt. 203-206 del nuovo TUIR. Non avendo verificato da quando decorra l\'applicazione, se la commissione usa i riferimenti al vecchio TUIR (DPR 917/86), è opportuno citarli pur sapendo che esiste il riordino.',
        tempoResiduo: 5400,
      },
    ],
  },
  'Crisi d\'Impresa': {
    Intermedio: [
      {
        area: 'Crisi d\'Impresa',
        livello: 'Intermedio',
        titolo: 'Piano di Ristrutturazione Soggetto ad Omologazione e Ruolo dell\'Atttestatore',
        testo:
          'Il candidato/la candidata illustri il piano di ristrutturazione soggetto ad omologazione e si' +
          ' soffermi sul ruolo e le responsabilità del soggetto attestatore.',
        checklist: [
          { id: 'a1', text: 'Individuata la natura del piano di ristrutturazione e il suo ambito soggettivo (imprenditore commerciale non minore in stato di crisi o insolvenza)' },
          { id: 'a2', text: 'Illustrata la suddivisione obbligatoria dei creditori in classi omogenee e la deroga al principio della par condicio creditorum' },
          { id: 'a3', text: 'Individuato il vincolo inderogabile di integrale soddisfacimento dei crediti da lavoro subordinato entro 30 giorni dall\'omologazione' },
          { id: 'a4', text: 'Chiarito il regime di voto per l\'omologazione (consenso unanime di tutte le classi a maggioranza dei crediti) e l\'assenza del cram-down' },
          { id: 'a5', text: 'Illustrata la funzione pubblicistica dell\'attestatore e i requisiti di indipendenza (nessun legame, divieto di attività nei 5 anni precedenti)' },
          { id: 'a6', text: 'Analizzato il regime di responsabilità dell\'attestatore (civile contrattuale ed extracontrattuale, penale, lacuna punitiva)' },
        ],
        notaProfessore:
          'Trappola tipica: il candidato spesso confonde il piano di ristrutturazione con il concordato' +
          ' preventivo. Nel piano di ristrutturazione NON sono applicabili i meccanismi di forzatura del' +
          ' cram-down interclasse o fiscale: la contrarietà anche di una sola classe o dell\'Erario arresta' +
          ' l\'iter procedurale. Altro punto critico: la responsabilità penale dell\'attestatore per falso in' +
          ' attestazioni presenta una lacuna punitiva, poiché la norma elenca tassativamente le fattispecie' +
          ' sanzionabili senza menzionare esplicitamente l\'articolo relativo al piano di ristrutturazione,' +
          ' e il divieto di analogia in materia penale rende controversa l\'effettiva perseguibilità.',
        correzione:
          'Il Piano di Ristrutturazione Soggetto ad Omologazione rappresenta lo strumento concorsuale a maggior' +
          ' tasso di autonomia negoziale del Codice della Crisi d\'Impresa e dell\'Insolvenza, destinato' +
          ' all\'imprenditore commerciale non minore in stato di crisi o insolvenza. La sua caratteristica' +
          ' fondamentale risiede nella suddivisione obbligatoria dei creditori in classi omogenee dal punto di' +
          ' vista giuridico ed economico. Tale classamento consente al debitore di distribuire il valore' +
          ' generato dalla continuità aziendale in totale deroga al principio della par condicio creditorum' +
          ' e alla regola della priorità assoluta, fermo restando l\'unico vincolo inderogabile di soddisfare' +
          ' integralmente i crediti da lavoro subordinato entro trenta giorni dall\'omologazione. L\'impianto' +
          ' dell\'istituto, ulteriormente chiarito dal recente Correttivo-ter, ammette espressamente sia la' +
          ' realizzazione di piani a carattere puramente liquidatorio, sia l\'integrazione di transazioni' +
          ' fiscali e contributive per il pagamento parziale o dilazionato dei debiti pubblici.\n\n' +
          'A questa spiccata flessibilità distributiva corrisponde tuttavia un regime di voto particolarmente' +
          ' severo per l\'ottenimento dell\'omologazione. Il Tribunale può approvare il piano soltanto in' +
          ' presenza del consenso unanime di tutte le classi, calcolato a maggioranza dei crediti ammessi al' +
          ' voto all\'interno di ciascuna di esse. Nel piano di ristrutturazione non sono infatti applicabili i' +
          ' meccanismi di forzatura del cram-down interclasse o fiscale tipici del concordato preventivo: la' +
          ' contrarietà anche di una sola classe o dell\'Erario arresta l\'iter procedurale, imponendo la' +
          ' modifica o la conversione dello strumento. L\'unica tutela concessa al debitore riguarda le' +
          ' contestazioni del singolo creditore dissenziente sulla convenienza della proposta, che il' +
          ' Tribunale può superare omologando il piano qualora accerti che l\'opponente non riceve un' +
          ' trattamento deteriore rispetto a quello che otterrebbe nella liquidazione giudiziale.\n\n' +
          'In un contesto procedurale in cui il giudice esercita un controllo meramente formale, la figura del' +
          ' professionista attestatore assume una cruciale funzione pubblicistica di garanzia per il ceto' +
          ' creditorio e per il mercato. Per preservare tale terzietà, la legge richiede al professionista il' +
          ' possesso di rigidi requisiti d\'indipendenza, che comportano l\'assenza di legami personali e il' +
          ' divieto di aver prestato attività lavorativa o di consulenza per l\'impresa nei cinque anni' +
          ' antecedenti. Il compito primario dell\'attestatore si concretizza nella redazione di una relazione' +
          ' giurata volta a certificare la veridicità dei dati aziendali e la fattibilità economica e giuridica' +
          ' del piano, spingendosi a attestare puntualmente la convenienza della transazione fiscale e' +
          ' contributiva rispetto allo scenario della liquidazione.\n\n' +
          'L\'elevato grado di affidamento riposto nelle valutazioni del professionista giustifica un' +
          ' rigoroso regime di responsabilità a suo carico. Dal punto di vista civile, l\'attestatore risponde' +
          ' a titolo contrattuale verso il debitore per inesatto adempimento dell\'incarico, e a titolo' +
          ' extracontrattuale verso i creditori o i terzi che abbiano subito un danno economico confidando in' +
          ' una relazione superficiale o errata. Dal punto di vista penale, la condotta del professionista che' +
          ' esponga dati falsi o ometta informazioni rilevanti configura astrattamente il reato di falso in' +
          ' attestazioni. Tuttavia, poiché la norma penale elenca tassativamente le fattispecie sanzionabili' +
          ' senza menzionare esplicitamente l\'articolo relativo al piano di ristrutturazione, il divieto' +
          ' costituzionale di applicazione analogica in materia penale genera un\'evidente lacuna punitiva,' +
          ' rendendo l\'effettiva perseguibilità dell\'attestatore un tema ampiamente dibattuto in dottrina.',
        tempoResiduo: 1500,
      },
      {
        area: 'Crisi d\'Impresa',
        livello: 'Intermedio',
        titolo: 'Cram-down Fiscale negli Accordi di Ristrutturazione (art. 63 CCII)',
        testo:
          'La società Zeta S.p.A. evidenzia un indebitamento complessivo pari a € 4.000.000, di cui € 2.500.000' +
          ' fa capo a debiti tributari e previdenziali. L\'organo amministrativo intende ricorrere agli Accordi' +
          ' di Ristrutturazione dei Debiti (art. 57 CCII). Viene proposta una transazione fiscale (art. 63 CCII)' +
          ' che prevede il pagamento del 35% in 5 anni e lo stralcio del 65%.' +
          '\n\nL\'attestatore indipendente certifica che, in caso di liquidazione, il soddisfacimento dei crediti' +
          ' pubblici non supererebbe il 20%. L\'Agenzia delle Entrate rigetta la proposta, mentre gli altri' +
          ' creditori aderiscono (totale crediti aderenti escluso l\'Erario: € 1.500.000).' +
          '\n\nIl candidato analizzi se sussistono i presupposti normativi affinché il Tribunale possa procedere' +
          ' all\'omologazione forzosa (Cram-down fiscale) dell\'accordo nonostante il diniego dell\'Erario.',
        checklist: [
          { id: 'b1', text: 'Identificato il quorum di adesione ordinario degli accordi di ristrutturazione (60% dei crediti).' },
          { id: 'b2', text: 'Verificato il requisito di convenienza della proposta rispetto alla liquidazione (35% vs 20%).' },
          { id: 'b3', text: 'Evidenziata la centralità dell\'attestazione del professionista indipendente.' },
          { id: 'b4', text: 'Concluso positivamente per l\'applicabilità del cram-down ex art. 63, comma 2, CCII.' },
        ],
        notaProfessore:
          'Trappola tipica: Il candidato spesso confonde il cram-down del concordato preventivo con quello degli' +
          ' accordi di ristrutturazione. Negli accordi, il Tribunale può superare il voto negativo dell\'Erario' +
          ' SOLO SE: 1) l\'adesione dell\'amministrazione finanziaria sia decisiva per raggiungere il quorum del' +
          ' 60%, 2) la proposta sia conveniente rispetto alla liquidazione giudiziale sulla base della relazione' +
          ' dell\'attestatore.',
        correzione:
          '1. Verifica dei Quorum:\n' +
          'I creditori aderenti (€ 1.500.000) rappresentano solo il 37,5% del debito totale (€ 4.000.000).' +
          ' Il voto favorevole dell\'Erario (€ 2.500.000) risulta quindi *determinante* per il raggiungimento' +
          ' della maggioranza di legge (60% ex art. 57 CCII).\n\n' +
          '2. Condizioni per il Cram-down Fiscale (Art. 63, co. 2 CCII):\n' +
          '- Decisività: L\'adesione del Fisco è determinante (Requisito Soddisfatto).\n' +
          '- Convenienza: La proposta (35%) è superiore all\'alternativa liquidatoria (20%) (Requisito' +
          ' Soddisfatto e supportato da attestazione congrua).\n\n' +
          '3. Conclusione:\n' +
          'Sussistono pienamente i presupposti per il cram-down. Il Tribunale omologherà forzosamente' +
          ' l\'accordo, sostituendo la propria volontà a quella dell\'Erario dissenziente e rendendo' +
          ' obbligatorio lo stralcio del debito.',
        tempoResiduo: 1500,
      },
    ],
    Avanzato: [
      {
        area: 'Crisi d\'Impresa',
        livello: 'Avanzato',
        titolo: 'Concordato Preventivo con Continuazione e Piano di Ristrutturazione',
        testo:
          'La società Theta Costruzioni S.p.A. presenta una situazione patrimoniale con passività di' +
          ' € 25.000.000, di cui € 12.000.000 verso banche, € 8.000.000 verso fornitori e € 5.000.000 verso' +
          ' dipendenti e fisco. L\'attivo netto stimato è di € 18.000.000.' +
          '\n\nL\'amministratore propone un concordato preventivo con continuazione dell\'attività ex art. 160' +
          ' L.F., con piano di pagamento rateizzato in 5 anni e cessione di un ramo d\'azienda per € 6.000.000.' +
          '\n\nSi valuti: (a) la fattibilità del piano ex art. 161 L.F.; (b) la omologabilità ex art. 180 L.F.;' +
          ' (c) gli effetti sui creditori privilegiati; (d) le interazioni con l\'art. 67 L.F. in caso di' +
          ' successivo fallimento.',
        checklist: [
          { id: 'a1', text: 'Verificata la fattibilità del piano ex art. 161 L.F.' },
          { id: 'a2', text: 'Controllata la omologabilità ex art. 180 L.F.' },
          { id: 'a3', text: 'Valutati gli effetti sui creditori privilegiati ex art. 167 L.F.' },
          { id: 'a4', text: 'Esaminate le interazioni con l\'art. 67 L.F. (revocatoria)' },
          { id: 'a5', text: 'Ispezionato il trattamento dei crediti tributari e contributivi' },
          { id: 'a6', text: 'Verificata la conformità del piano al principio di parità di trattamento' },
        ],
        notaProfessore:
          'Trappola tipica: il concordato con continuazione richiede che il piano garantisca il pagamento di' +
          ' almeno il 30% dei crediti chirografari ex art. 161, comma 1, L.F. I crediti tributari e' +
          ' contributivi non possono essere oggetto di ristrutturazione se non nei limiti del piano' +
          ' agevolato ex art. 182-ter L.F. Attenzione agli atti posti in essere prima della domanda: sono' +
          ' soggetti a revocatoria ex art. 67 L.F.',
        tempoResiduo: 5400,
      },
      {
        area: 'Crisi d\'Impresa',
        livello: 'Avanzato',
        titolo: 'Liquidazione Giudiziale, Azioni Revocatorie e Formazione dello Stato Passivo (CCII)',
        testo:
          'La società Delta Manifatture S.r.l. è stata assoggettata a liquidazione giudiziale dal Tribunale' +
          ' competente. Il curatore riscontra che nei 6 mesi antecedenti alla domanda di accesso alla procedura:' +
          ' (1) la società ha rimborsato anticipatamente un finanziamento chirografario di € 300.000 alla banca Alfa;' +
          ' (2) ha concesso ipoteca volontaria su un capannone a garanzia di un debito chirografario scaduto di € 250.000 verso un fornitore strategico;' +
          ' (3) ha ceduto un macchinario produttivo del valore periziato di € 180.000 al prezzo di € 70.000 a una parte correlata.' +
          '\n\nIn sede di formazione dello stato passivo, la banca Alfa chiede l\'ammissione in via chirografaria per residui crediti, mentre il fornitore chiede l\'ammissione in via ipotecaria (privilegio speciale).' +
          '\n\nIl candidato: (a) qualifichi le singole operazioni sotto il profilo delle azioni revocatorie ex artt. 163 e 166 CCII (presupposto oggettivo e soggettivo, inversione onere probatorio);' +
          ' (b) illustri i poteri e i provvedimenti del curatore nel progetto di stato passivo ex artt. 203 e 204 CCII;' +
          ' (c) descriva il trattamento e la collocazione dei crediti dei creditori revocandi e le conseguenze dell\'eventuale vittorioso esperimento dell\'azione revocatoria.',
        checklist: [
          { id: 'c1', text: 'Inquadrati gli atti a titolo oneroso e pagamenti di debiti scaduti ex art. 166, co. 2 CCII con scientia decoctionis a carico del curatore', peso: 15 },
          { id: 'c2', text: 'Identificata la revoca degli atti a titolo oneroso anomali (sproporzione oltre un quarto) ex art. 166, co. 1, lett. a) CCII con inversione dell\'onere della prova', peso: 15 },
          { id: 'c3', text: 'Qualificata la garanzia ipotecaria costituita per debito preesistente e scaduto ex art. 166, co. 1, lett. c) o d) CCII', peso: 15 },
          { id: 'c4', text: 'Spiegata l\'azione revocatoria o l\'inefficacia degli atti compiuti tra parti correlate o infragruppo ex art. 169 e 290 CCII', peso: 15 },
          { id: 'c5', text: 'Illustrato il sub-procedimento di accertamento dello stato passivo (domanda, progetto del curatore, osservazioni, udienza ex artt. 201-207 CCII)', peso: 15 },
          { id: 'c6', text: 'Delineata la facoltà del curatore di eccepire l\'inefficacia dell\'atto revocabile direttamente in via di eccezione riconvenzionale ex art. 170 CCII', peso: 15 },
          { id: 'c7', text: 'Chiarito il diritto del creditore revocato all\'ammissione al passivo in via chirografaria solo dopo l\'effettiva restituzione di quanto percepito ex art. 171 CCII', peso: 10 },
        ],
        notaProfessore:
          'Trappola tipica: non confondere la revocatoria fallimentare con la revocatoria ordinaria ex art. 2901 c.c. Nel CCII (artt. 166 ss.) i periodi sospetti sono semestrali o annuali, e in molti casi (atti anormali) sussiste la presunzione legale di conoscenza dello stato di insolvenza. Inoltre, fondamentale ricordare che il curatore può far valere l\'inefficacia del titolo di prelazione direttamente come eccezione nello stato passivo (art. 170 CCII), senza dover promuovere preventivamente un autonomo giudizio ordinario di revocatoria.',
        correzione:
          '1. Inquadramento delle operazioni sotto il profilo revocatorio (art. 166 CCII):\n' +
          '- Rimborso anticipato / estinzione del debito bancario: ricade nell\'art. 166, co. 2 CCII se estinto nei 6 mesi anteriori; trattandosi di pagamento di debito, l\'onere della prova della conoscenza dello stato di insolvenza grava sul curatore, salvo che il debito non fosse ancora scaduto (art. 166, co. 1, lett. b CCII, in cui l\'onere è invertito se compiuto nei 6 mesi anteriori).\n' +
          '- Costituzione di ipoteca volontaria per debito preesistente scaduto: atto anomalo revocabile ex art. 166, co. 1, lett. d) CCII se costituito nei 6 mesi anteriori (o lett. c se debito non scaduto entro 1 anno), con presunzione di scientia decoctionis a carico del terzo fornitore.\n' +
          '- Vendita a parte correlata con sproporzione di valore (€ 70.000 vs € 180.000): atto sproporzionato oltre un quarto ex art. 166, co. 1, lett. a) CCII. La scientia decoctionis si presume e l\'acquirente deve provare di aver ignorato l\'insolvenza senza colpa; inoltre opera la disciplina di rigore per le parti correlate.\n\n' +
          '2. Procedimento di stato passivo e poteri del curatore:\n' +
          '- Ai sensi dell\'art. 170 CCII, il curatore può eccepire l\'inefficacia dei titoli e degli atti revocabili direttamente in sede di verificazione dello stato passivo, escludendo la collocazione ipotecaria del fornitore o chiedendo la restituzione preliminare delle somme ricevute.\n' +
          '- Il curatore redige il progetto ex art. 203 CCII indicando i crediti ammessi, quelli esclusi e le cause di prelazione contestate.\n\n' +
          '3. Effetti della revoca sui crediti:\n' +
          '- Ex art. 171 CCII, il terzo che per effetto della revoca ha restituito quanto ricevuto è ammesso al passivo per il relativo credito, ma solo con rango chirografario e subordinatamente all\'effettivo riversamento all\'attivo fallimentare.',
        tempoResiduo: 5400,
      },
    ],
  },
};

export function getTraccia(
  area: AreaTematica,
  livello: LivelloDifficolta,
  excludeTitle?: string | string[]
): TracciaEsame {
  const pool = TRACCE[area][livello];
  if (!pool || pool.length === 0) {
    throw new Error(`Nessuna traccia trovata per ${area} - ${livello}`);
  }
  const excludes = Array.isArray(excludeTitle)
    ? excludeTitle
    : excludeTitle
    ? [excludeTitle]
    : [];
  const filtered = pool.filter((t) => !excludes.includes(t.titolo));
  const candidates = filtered.length > 0 ? filtered : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
