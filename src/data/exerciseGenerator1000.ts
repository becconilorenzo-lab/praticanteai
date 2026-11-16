export interface AccountEntry {
  code: string;
  name: string;
  type: 'DARE' | 'AVERE';
  amount: number;
}

export interface Exercise1000 {
  id: string;
  category: 'Base' | 'Assestamento' | 'Operazioni Straordinarie' | 'Bilancio';
  difficulty: 'Facile' | 'Medio' | 'Difficile' | 'Esame Commercialista';
  title: string;
  description: string;
  date: string;
  expectedEntries: AccountEntry[];
  totalAmount: number;
  hint: string;
}

const COMPANIES = [
  'Alpha S.r.l.', 'Beta S.p.A.', 'Gamma Logistica', 'Delta Tecnologie',
  'Epsilon Pharma', 'Zeta Manifatturiera', 'Omega Consulting', 'Nexus Trading',
  'Aura Group', 'Soluzioni Industriali S.r.l.', 'Tessile Lombardo S.p.A.',
  'Apex Industriale', 'Lombardia Tech S.p.A.', 'Veneto Metal S.r.l.',
  'ItalTubi S.p.A.', 'Meccanica Veneta S.r.l.', 'Roma Costruzioni',
  'Nova Edilizia', 'Lazio Impianti', 'Toscana Servizi',
  'Adriatica Trasporti S.r.l.', 'Piemonte Energie S.p.A.', 'Sicilia Agroalimentare',
  'Emilia Pack S.r.l.', 'Calabria Mineraria', 'Marche Tessili S.p.A.',
  'Liguria Porti S.r.l.', 'Campania Digital S.p.A.', 'Friuli Chimica S.r.l.',
];

const SUPPLIERS = [
  'Rossi Forniture', 'Bianchi Utensileria', 'Verdi Materie Prime',
  'Tech Distribution Italia', 'Global Logistics Europe', 'Acciai & Metalli S.r.l.',
  'Elettrica Nazionale', 'Forniture Industriali Nord',
];

// ── Clean amount helpers ──────────────────────────────────────────────────

function roundClean(n: number): number {
  return Math.round(n / 100) * 100;
}

function cleanBaseAmount(min: number, max: number, seed: number): number {
  const range = max - min;
  const raw = min + (seed * 137) % range;
  return Math.floor(raw / 100) * 100;
}

function vat22(base: number): number {
  return roundClean(base * 0.22);
}

function withholding20(base: number): number {
  return base * 0.20;
}


function roundTo100(n: number): number {
  return Math.round(n / 100) * 100;
}

function r2(n: number): number {
  return roundTo100(n);
}

function createBaseExercise(id: number): Exercise1000 {
  const company = COMPANIES[id % COMPANIES.length];
  const supplier = SUPPLIERS[id % SUPPLIERS.length];
  const baseAmount = cleanBaseAmount(1000, 25000, id);
  const templateType = id % 4;

  switch (templateType) {
    case 0: {
      const vat = vat22(baseAmount);
      const total = roundClean(baseAmount + vat);
      return {
        id: `EX-${id}`,
        category: 'Base',
        difficulty: 'Facile',
        title: `Acquisto Merci da ${supplier}`,
        description: `Ricevuta fattura n. ${100 + id} da ${supplier} per acquisto merci pari a €${baseAmount.toLocaleString('it-IT')} + IVA 22%.`,
        date: `2026-0${(id % 9) + 1}-10`,
        totalAmount: total,
        expectedEntries: [
          { code: '300101', name: 'Acquisto merci', type: 'DARE', amount: baseAmount },
          { code: '101201', name: 'IVA ns/credito', type: 'DARE', amount: vat },
          { code: '200101', name: 'Debiti v/fornitori Italia', type: 'AVERE', amount: total },
        ],
        hint: `L'acquisto di merci va registrato in Dare insieme all'IVA a credito; il fornitore in Avere per il totale fattura.`,
      };
    }
    case 1: {
      const vat = vat22(baseAmount);
      const total = roundClean(baseAmount + vat);
      return {
        id: `EX-${id}`,
        category: 'Base',
        difficulty: 'Facile',
        title: `Vendita Merci a ${company}`,
        description: `Emessa fattura n. ${200 + id} a ${company} per vendita merci di €${baseAmount.toLocaleString('it-IT')} + IVA 22%.`,
        date: `2026-0${(id % 9) + 1}-14`,
        totalAmount: total,
        expectedEntries: [
          { code: '102001', name: 'Crediti v/clienti Italia', type: 'DARE', amount: total },
          { code: '400101', name: 'Vendita merci Italia', type: 'AVERE', amount: baseAmount },
          { code: '201001', name: 'IVA ns/debito', type: 'AVERE', amount: vat },
        ],
        hint: `Il credito verso il cliente va in Dare per il totale fattura; il ricavo di vendita e l'IVA a debito in Avere.`,
      };
    }
    case 2: {
      return {
        id: `EX-${id}`,
        category: 'Base',
        difficulty: 'Facile',
        title: `Incasso Fattura da Clienti (${company})`,
        description: `Riscosso a mezzo bonifico bancario il credito residuo v/cliente ${company} pari a €${baseAmount.toLocaleString('it-IT')}.`,
        date: `2026-0${(id % 9) + 1}-20`,
        totalAmount: baseAmount,
        expectedEntries: [
          { code: '100501', name: 'Banca c/c', type: 'DARE', amount: baseAmount },
          { code: '102001', name: 'Crediti v/clienti Italia', type: 'AVERE', amount: baseAmount },
        ],
        hint: `L'incasso aumenta la Banca c/c in Dare e storna il credito verso il cliente in Avere per lo stesso importo.`,
      };
    }
    default: {
      const vat = vat22(baseAmount);
      const totalInvoice = roundClean(baseAmount + vat);
      const withholding = withholding20(baseAmount);
      const netToPay = roundClean(totalInvoice - withholding);
      return {
        id: `EX-${id}`,
        category: 'Base',
        difficulty: 'Facile',
        title: `Parcella Consulente Commerciale`,
        description: `Ricevuta parcella per consulenza pari a €${baseAmount.toLocaleString('it-IT')} + IVA 22%. Si applica ritenuta d'acconto 20%. Totale netto a pagare: €${netToPay.toLocaleString('it-IT')}.`,
        date: `2026-0${(id % 9) + 1}-25`,
        totalAmount: totalInvoice,
        expectedEntries: [
          { code: '300501', name: 'Consulenze tecniche e legali', type: 'DARE', amount: baseAmount },
          { code: '101201', name: 'IVA ns/credito', type: 'DARE', amount: vat },
          { code: '201501', name: 'Erario c/ritenute da versare', type: 'AVERE', amount: withholding },
          { code: '100501', name: 'Banca c/c', type: 'AVERE', amount: netToPay },
        ],
        hint: `La parcella genera costo e IVA a credito in Dare; in Avere la ritenuta da versare al fisco e il netto pagato dalla banca.`,
      };
    }
  }
}

function createIntermediateExercise(id: number): Exercise1000 {
  const company = COMPANIES[id % COMPANIES.length];
  const baseAmount = cleanBaseAmount(3000, 45000, id);
  const templateType = id % 10;

  switch (templateType) {
    case 0: {
      // A) Ratei/Risconti a giorni effettivi
      const importo = cleanBaseAmount(6000, 36000, id + 50);
      const durataTotale = 180;
      const giorniRisconto = 103; // restanti
      const riscontoAttivo = r2((importo / durataTotale) * giorniRisconto);
      return {
        id: `EX-${id}`,
        category: 'Assestamento',
        difficulty: 'Medio',
        title: `Risconto Attivo a Giorni (Premio Assicurativo)`,
        description: `In data 15/10 è stato pagato un premio assicurativo annuale di €${importo.toLocaleString('it-IT')} con copertura di 180 giorni. Al 31/12, calcolare il risconto attivo per la quota non di competenza dell'esercizio (giorni residui: ${giorniRisconto}).`,
        date: '2026-12-31',
        totalAmount: riscontoAttivo,
        expectedEntries: [
          { code: '105001', name: 'Risconti attivi', type: 'DARE', amount: riscontoAttivo },
          { code: '302001', name: 'Fitti passivi', type: 'AVERE', amount: riscontoAttivo },
        ],
        hint: `Ricorda di stornare la quota di costo non di competenza calcolando i giorni del nuovo anno: (importo / 180) × 103.`,
      };
    }
    case 1: {
      // B) Ammortamenti TUIR
      const isImpianti = (id % 2) === 0;
      const valore = isImpianti
        ? cleanBaseAmount(50000, 200000, id + 100)
        : cleanBaseAmount(300000, 800000, id + 200);
      const aliquota = isImpianti ? 0.10 : 0.03;
      const quota = r2(valore * aliquota);
      const bene = isImpianti ? 'Impianti' : 'Fabbricati';
      return {
        id: `EX-${id}`,
        category: 'Assestamento',
        difficulty: 'Medio',
        title: `Quota Ammortamento TUIR — ${bene}`,
        description: `Calcolare la quota di ammortamento civilistico-fiscale su ${bene} del valore storico di €${valore.toLocaleString('it-IT')} con aliquota TUIR del ${(aliquota * 100).toFixed(0)}%. Quota di ammortamento: €${quota.toLocaleString('it-IT')}.`,
        date: '2026-12-31',
        totalAmount: quota,
        expectedEntries: [
          { code: isImpianti ? '301001' : '301002', name: `Ammortamento ${bene.toLowerCase()}`, type: 'DARE', amount: quota },
          { code: isImpianti ? '108001' : '108002', name: `Fondo ammortamento ${bene.toLowerCase()}`, type: 'AVERE', amount: quota },
        ],
        hint: `La quota di ammortamento si calcola come valore storico × aliquota TUIR. Il costo va in Dare, il fondo in Avere.`,
      };
    }
    case 2: {
      // C) Mutuo bancario — Accensione
      const mutuo = cleanBaseAmount(50000, 300000, id + 300);
      const oneri = 500;
      const totale = r2(mutuo + oneri);
      return {
        id: `EX-${id}`,
        category: 'Assestamento',
        difficulty: 'Medio',
        title: `Accensione Mutuo Bancario (${company})`,
        description: `Acceso un mutuo bancario con ${company} per €${mutuo.toLocaleString('it-IT')}. Oneri bancari di istruttoria: €${oneri.toLocaleString('it-IT')}. Totale addebitato in c/c: €${totale.toLocaleString('it-IT')}.`,
        date: `2026-0${(id % 9) + 1}-15`,
        totalAmount: totale,
        expectedEntries: [
          { code: '100501', name: 'Banca c/c', type: 'DARE', amount: totale },
          { code: '305002', name: 'Oneri bancari', type: 'DARE', amount: oneri },
          { code: '206001', name: 'Mutui passivi', type: 'AVERE', amount: mutuo },
        ],
        hint: `L'accensione del mutuo genera un accredito in Banca (Dare) pari al mutuo netto; gli oneri bancari sono un costo in Dare, il mutuo in Avere.`,
      };
    }
    case 3: {
      // C) Mutuo bancario — Pagamento rata
      const capitaleResiduo = cleanBaseAmount(40000, 250000, id + 400);
      const quotaInteressi = r2((capitaleResiduo * 4 * 6) / 1200);
      const quotaCapitale = 5000;
      const rataTotale = r2(quotaCapitale + quotaInteressi);
      return {
        id: `EX-${id}`,
        category: 'Assestamento',
        difficulty: 'Medio',
        title: `Pagamento Rata Mutuo Bancario`,
        description: `Pagata la rata semestrale del mutuo. Capitale residuo: €${capitaleResiduo.toLocaleString('it-IT')}. Quota capitale: €${quotaCapitale.toLocaleString('it-IT')}. Quota interessi (tasso 4% semestrale): €${quotaInteressi.toLocaleString('it-IT')}. Totale rata: €${rataTotale.toLocaleString('it-IT')}.`,
        date: `2026-0${(id % 9) + 1}-28`,
        totalAmount: rataTotale,
        expectedEntries: [
          { code: '206001', name: 'Mutui passivi', type: 'DARE', amount: quotaCapitale },
          { code: '305001', name: 'Interessi passivi', type: 'DARE', amount: quotaInteressi },
          { code: '100501', name: 'Banca c/c', type: 'AVERE', amount: rataTotale },
        ],
        hint: `La rata si compone di quota capitale (storna il mutuo in Dare) e quota interessi (costo in Dare). Il totale rata esce dalla Banca in Avere.`,
      };
    }
    case 4: {
      // D) Leasing — Maxicanone con risconto
      const maxicanone = cleanBaseAmount(12000, 60000, id + 500);
      const mesiTotali = 36;
      const mesiRisconto = 29;
      const risconto = r2((maxicanone / mesiTotali) * mesiRisconto);
      return {
        id: `EX-${id}`,
        category: 'Assestamento',
        difficulty: 'Medio',
        title: `Risconto Attivo Maxicanone di Leasing`,
        description: `Pagato il 01/06 un maxicanone di leasing di €${maxicanone.toLocaleString('it-IT')} per un contratto di ${mesiTotali} mesi. Al 31/12, stornare la quota non di competenza (${mesiRisconto} mesi residui). Risconto attivo: €${risconto.toLocaleString('it-IT')}.`,
        date: '2026-12-31',
        totalAmount: risconto,
        expectedEntries: [
          { code: '105001', name: 'Risconti attivi', type: 'DARE', amount: risconto },
          { code: '306001', name: 'Canoni di leasing', type: 'AVERE', amount: risconto },
        ],
        hint: `Il maxicanone copre 36 mesi ma solo 7 competono quest'anno. Storna 29 mesi: (maxicanone / 36) × 29 in Dare a Risconti attivi.`,
      };
    }
    case 5: {
      // Busta paga — conservato
      const gross = baseAmount + 4000;
      const inps = roundTo100(gross * 0.0919);
      const irpef = roundTo100(gross * 0.23);
      const net = gross - inps - irpef;
      return {
        id: `EX-${id}`,
        category: 'Base',
        difficulty: 'Medio',
        title: `Liquidazione Retribuzioni Dipendenti`,
        description: `Liquidati stipendi lordi per €${gross.toLocaleString('it-IT')}. Ritenute INPS €${inps.toLocaleString('it-IT')}, IRPEF €${irpef.toLocaleString('it-IT')}. Netto dipendenti: €${net.toLocaleString('it-IT')}.`,
        date: `2026-0${(id % 9) + 1}-27`,
        totalAmount: gross,
        expectedEntries: [
          { code: '303001', name: 'Salari e stipendi', type: 'DARE', amount: gross },
          { code: '202001', name: 'INPS c/competenze', type: 'AVERE', amount: inps },
          { code: '201501', name: 'Erario c/ritenute lavoro dipendente', type: 'AVERE', amount: irpef },
          { code: '202501', name: 'Dipendenti c/retribuzioni', type: 'AVERE', amount: net },
        ],
        hint: `Il lordo stipendi è un costo in Dare; in Avere si ripartisce tra INPS, IRPEF (erario) e netto dipendenti.`,
      };
    }
    case 6: {
      // Liquidazione IVA — conservato
      const vatDebit = roundTo100(baseAmount * 0.4);
      const vatCredit = roundTo100(baseAmount * 0.25);
      const vatToPay = vatDebit - vatCredit;
      return {
        id: `EX-${id}`,
        category: 'Assestamento',
        difficulty: 'Medio',
        title: `Liquidazione IVA Periodica Mese/Trimestre`,
        description: `Chiusura dei conti IVA: Erario c/IVA accoglie IVA a debito per €${vatDebit.toLocaleString('it-IT')} e IVA a credito per €${vatCredit.toLocaleString('it-IT')}. Saldo a debito: €${vatToPay.toLocaleString('it-IT')}.`,
        date: '2026-04-16',
        totalAmount: vatDebit,
        expectedEntries: [
          { code: '201001', name: 'IVA ns/debito', type: 'DARE', amount: vatDebit },
          { code: '101201', name: 'IVA ns/credito', type: 'AVERE', amount: vatCredit },
          { code: '201801', name: 'Erario c/IVA', type: 'AVERE', amount: vatToPay },
        ],
        hint: `La liquidazione IVA chiude l'IVA a debito (Dare) e a credito (Avere); il saldo a debito confluisce in Erario c/IVA.`,
      };
    }
    case 7: {
      // Svalutazione crediti — conservato
      const writeDown = roundTo100(baseAmount * 0.05);
      return {
        id: `EX-${id}`,
        category: 'Assestamento',
        difficulty: 'Medio',
        title: `Svalutazione Crediti in Sofferenza (${company})`,
        description: `A seguito di analisi di esigibilità su ${company}, si effettua una svalutazione diretta del credito per €${writeDown.toLocaleString('it-IT')}.`,
        date: '2026-12-31',
        totalAmount: writeDown,
        expectedEntries: [
          { code: '304001', name: 'Svalutazione crediti commerciali', type: 'DARE', amount: writeDown },
          { code: '102001', name: 'Crediti v/clienti Italia', type: 'AVERE', amount: writeDown },
        ],
        hint: `La svalutazione riduce il credito in Avere e rileva un componente negativo di reddito in Dare.`,
      };
    }
    case 8: {
      // A) Ratei/Risconti a giorni — variante con rateo passivo
      const importo = cleanBaseAmount(8000, 48000, id + 600);
      const durataTotale = 180;
      const rateoPassivo = r2((importo / durataTotale) * 77);
      return {
        id: `EX-${id}`,
        category: 'Assestamento',
        difficulty: 'Medio',
        title: `Rateo Passivo a Giorni (Fitti da Pagare)`,
        description: `Al 31/12 si rileva la quota di costo maturata e non ancora pagata per un contratto di affitto iniziato il 15/10 con durata 180 giorni. Importo contrattuale: €${importo.toLocaleString('it-IT')}. Giorni di competenza: 77. Rateo passivo: €${rateoPassivo.toLocaleString('it-IT')}.`,
        date: '2026-12-31',
        totalAmount: rateoPassivo,
        expectedEntries: [
          { code: '302001', name: 'Fitti passivi', type: 'DARE', amount: rateoPassivo },
          { code: '205001', name: 'Ratei passivi', type: 'AVERE', amount: rateoPassivo },
        ],
        hint: `Il rateo passivo rileva un costo maturato ma non pagato: (importo / 180) × 77 in Dare al costo, Ratei passivi in Avere.`,
      };
    }
    default: {
      // B) Ammortamenti TUIR — seconda variante (beni diversi)
      const isImpianti = (id % 2) === 1;
      const valore = isImpianti
        ? cleanBaseAmount(50000, 200000, id + 700)
        : cleanBaseAmount(300000, 800000, id + 800);
      const aliquota = isImpianti ? 0.10 : 0.03;
      const quota = r2(valore * aliquota);
      const bene = isImpianti ? 'Impianti' : 'Fabbricati';
      return {
        id: `EX-${id}`,
        category: 'Assestamento',
        difficulty: 'Medio',
        title: `Ammortamento ${bene} — Aliquota TUIR ${(aliquota * 100).toFixed(0)}%`,
        description: `Determinare la quota di ammortamento per ${bene} con costo storico di €${valore.toLocaleString('it-IT')} applicando l'aliquota TUIR del ${(aliquota * 100).toFixed(0)}%.`,
        date: '2026-12-31',
        totalAmount: quota,
        expectedEntries: [
          { code: isImpianti ? '301001' : '301002', name: `Ammortamento ${bene.toLowerCase()}`, type: 'DARE', amount: quota },
          { code: isImpianti ? '108001' : '108002', name: `Fondo ammortamento ${bene.toLowerCase()}`, type: 'AVERE', amount: quota },
        ],
        hint: `Applica l'aliquota TUIR al costo storico: il costo di ammortamento va in Dare, il fondo in Avere.`,
      };
    }
  }
}

function createAdvancedExercise(id: number): Exercise1000 {
  const company = COMPANIES[id % COMPANIES.length];
  const baseAmount = cleanBaseAmount(50000, 400000, id);
  const templateType = id % 6;

  switch (templateType) {
    case 0: {
      const bookValue = baseAmount;
      const capitalGain = 25000;
      const sellPrice = bookValue + capitalGain;
      return {
        id: `EX-${id}`,
        category: 'Operazioni Straordinarie',
        difficulty: 'Esame Commercialista',
        title: `Cessione Immobile Strumentale con Plusvalenza`,
        description: `Alienato fabbricato industriale del valore contabile netto di €${bookValue.toLocaleString('it-IT')} al prezzo di €${sellPrice.toLocaleString('it-IT')}. Registrare la plusvalenza patrimoniale di €${capitalGain.toLocaleString('it-IT')}.`,
        date: `2026-0${(id % 9) + 1}-10`,
        totalAmount: sellPrice,
        expectedEntries: [
          { code: '102501', name: 'Crediti diversi v/acquirenti', type: 'DARE', amount: sellPrice },
          { code: '107001', name: 'Immobili e fabbricati', type: 'AVERE', amount: bookValue },
          { code: '405001', name: 'Plusvalenze da alienazione', type: 'AVERE', amount: capitalGain },
        ],
        hint: `La cessione rileva il credito per il prezzo in Dare, lo storno del bene in Avere e la plusvalenza in Avere.`,
      };
    }
    case 1: {
      const netAssets = baseAmount;
      const deficit = 45000;
      const participation = netAssets + deficit;
      return {
        id: `EX-${id}`,
        category: 'Operazioni Straordinarie',
        difficulty: 'Esame Commercialista',
        title: `Fusione per Incorporazione — Disavanzo da Annullamento`,
        description: `Annullata la partecipazione in ${company} del valore di €${participation.toLocaleString('it-IT')} a fronte di un Patrimonio Netto recepito di €${netAssets.toLocaleString('it-IT')}. Imputare il disavanzo da annullamento (€${deficit.toLocaleString('it-IT')}) ad Avviamento.`,
        date: '2026-06-30',
        totalAmount: participation,
        expectedEntries: [
          { code: '101000', name: 'Attivo Netto recepito da incorporata', type: 'DARE', amount: netAssets },
          { code: '106001', name: 'Avviamento (Disavanzo da annullamento)', type: 'DARE', amount: deficit },
          { code: '109001', name: 'Partecipazioni in imprese controllate', type: 'AVERE', amount: participation },
        ],
        hint: `Nella fusione, l'attivo netto recepito e il disavanzo vanno in Dare; la partecipazione si storna in Avere.`,
      };
    }
    case 2: {
      const nominalValue = baseAmount;
      const discount = roundTo100(nominalValue * 0.03);
      const cashReceived = nominalValue - discount;
      return {
        id: `EX-${id}`,
        category: 'Operazioni Straordinarie',
        difficulty: 'Esame Commercialista',
        title: `Emissione Prestito Obbligazionario Sotto la Pari`,
        description: `Emesso prestito obbligazionario del valore nominale di €${nominalValue.toLocaleString('it-IT')} al prezzo di emissione di €${cashReceived.toLocaleString('it-IT')}. Registrare il disaggio di emissione di €${discount.toLocaleString('it-IT')}.`,
        date: `2026-0${(id % 9) + 1}-05`,
        totalAmount: nominalValue,
        expectedEntries: [
          { code: '100501', name: 'Banca c/c obbligazionisti', type: 'DARE', amount: cashReceived },
          { code: '105501', name: 'Disaggio di emissione', type: 'DARE', amount: discount },
          { code: '204001', name: 'Obbligazioni c/capitale', type: 'AVERE', amount: nominalValue },
        ],
        hint: `L'emissione sotto la pari rileva il cassa in Dare per il netto ricevuto, il disaggio in Dare e il debito al nominale in Avere.`,
      };
    }
    case 3: {
      const nominalCapital = baseAmount;
      const sharePremium = roundTo100(nominalCapital * 0.40);
      const totalPaid = nominalCapital + sharePremium;
      return {
        id: `EX-${id}`,
        category: 'Bilancio',
        difficulty: 'Esame Commercialista',
        title: `Aumento di Capitale Sociale con Sovrapprezzo Azioni`,
        description: `Deliberato ed interamente sottoscritto aumento di capitale per nominali €${nominalCapital.toLocaleString('it-IT')} oltre a sovrapprezzo azioni per €${sharePremium.toLocaleString('it-IT')}. Totale versato: €${totalPaid.toLocaleString('it-IT')}.`,
        date: `2026-0${(id % 9) + 1}-12`,
        totalAmount: totalPaid,
        expectedEntries: [
          { code: '100501', name: 'Banca c/c vincolato', type: 'DARE', amount: totalPaid },
          { code: '208001', name: 'Capitale Sociale', type: 'AVERE', amount: nominalCapital },
          { code: '208501', name: 'Riserva sovrapprezzo azioni', type: 'AVERE', amount: sharePremium },
        ],
        hint: `L'aumento di capitale rileva il totale versato in Dare in Banca; in Avere il capitale nominale e la riserva da sovrapprezzo.`,
      };
    }
    case 4: {
      const initialStock = baseAmount;
      const finalStock = baseAmount + 12000;
      const variation = 12000;
      return {
        id: `EX-${id}`,
        category: 'Bilancio',
        difficulty: 'Difficile',
        title: `Rilevazione Variazione Rimanenze di Magazzino`,
        description: `Al 31/12 le rimanenze finali di merci (€${finalStock.toLocaleString('it-IT')}) superano le esistenze iniziali (€${initialStock.toLocaleString('it-IT')}). Registrare l'incremento di magazzino per €${variation.toLocaleString('it-IT')}.`,
        date: '2026-12-31',
        totalAmount: variation,
        expectedEntries: [
          { code: '104001', name: 'Merci in magazzino', type: 'DARE', amount: variation },
          { code: '408001', name: 'Variazione rimanenze merci', type: 'AVERE', amount: variation },
        ],
        hint: `L'incremento di magazzino rileva le merci in Dare e la variazione positiva di rimanenze in Avere.`,
      };
    }
    default: {
      const transferredAssets = baseAmount;
      const equityReduction = baseAmount;
      return {
        id: `EX-${id}`,
        category: 'Operazioni Straordinarie',
        difficulty: 'Esame Commercialista',
        title: `Scissione Parziale con Trasferimento Attivo`,
        description: `A seguito di scissione parziale a favore di nuova beneficiaria, la società scissa trasferisce elementi patrimoniali attivi per €${transferredAssets.toLocaleString('it-IT')} riducendo il proprio Patrimonio Netto.`,
        date: '2026-09-30',
        totalAmount: transferredAssets,
        expectedEntries: [
          { code: '208000', name: 'Riduzione Patrimonio Netto da Scissione', type: 'DARE', amount: equityReduction },
          { code: '107501', name: 'Impianti e macchinari trasferiti', type: 'AVERE', amount: transferredAssets },
        ],
        hint: `La scissione riduce il Patrimonio Netto in Dare e storna le attività trasferite in Avere.`,
      };
    }
  }
}

export function generate1000Exercises(): Exercise1000[] {
  const list: Exercise1000[] = [];
  for (let i = 1; i <= 200; i++) list.push(createBaseExercise(i));
  for (let i = 201; i <= 600; i++) list.push(createIntermediateExercise(i));
  for (let i = 601; i <= 1000; i++) list.push(createAdvancedExercise(i));
  return list;
}

export const ALL_EXERCISES_1000: Exercise1000[] = generate1000Exercises();

export type TrackKey = 'base' | 'intermedio' | 'avanzato';

export const TRACK_CONFIG: Record<TrackKey, {
  label: string;
  color: string;
  trackColor: string;
  activeBg: string;
  filter: (e: Exercise1000) => boolean;
  count: number;
}> = {
  base: {
    label: 'Base',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    trackColor: 'from-slate-500 to-slate-400',
    activeBg: 'bg-slate-700 text-white border-slate-700 shadow-slate-200',
    filter: (e) => e.difficulty === 'Facile',
    count: 200,
  },
  intermedio: {
    label: 'Intermedio',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    trackColor: 'from-amber-500 to-amber-400',
    activeBg: 'bg-amber-600 text-white border-amber-600 shadow-amber-200',
    filter: (e) => e.difficulty === 'Medio',
    count: 400,
  },
  avanzato: {
    label: 'Avanzato',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    trackColor: 'from-indigo-600 to-indigo-500',
    activeBg: 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200',
    filter: (e) => e.difficulty === 'Difficile' || e.difficulty === 'Esame Commercialista',
    count: 400,
  },
};

export const TRACK_ORDER: TrackKey[] = ['base', 'intermedio', 'avanzato'];

export function getTrackExercises(track: TrackKey): Exercise1000[] {
  return ALL_EXERCISES_1000.filter(TRACK_CONFIG[track].filter);
}

export function xpForDifficulty(difficulty: Exercise1000['difficulty']): number {
  switch (difficulty) {
    case 'Facile': return 50;
    case 'Medio': return 100;
    case 'Difficile': return 150;
    case 'Esame Commercialista': return 200;
  }
}
