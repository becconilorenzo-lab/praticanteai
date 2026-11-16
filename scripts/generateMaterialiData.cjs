const fs = require('fs');
const path = require('path');

const mdPath = path.resolve(__dirname, '../src/data/materiali.md');
const outPath = path.resolve(__dirname, '../src/data/materialiData.ts');

if (!fs.existsSync(mdPath)) {
  console.error('File not found:', mdPath);
  process.exit(1);
}

const content = fs.readFileSync(mdPath, 'utf-8');

// Find index boundaries
const indexStart = content.indexOf('## **INDICE**');
const firstSectionMarker = '## _**ASPETTI METODOLOGICI**_';
const firstSectionPos = content.indexOf(firstSectionMarker);

if (indexStart === -1 || firstSectionPos === -1) {
  console.error('Could not locate index or first section in', mdPath);
  process.exit(1);
}

const indexText = content.slice(indexStart, firstSectionPos).replace(/_\d+_/g, ' ');
const regex = /([A-Za-z0-9À-ÖØ-öø-ÿ\s–,–\(\):'’\/\.\-]+?)\s*\.{3,}\s*(\d+)/g;
let m;
const topics = [];
while ((m = regex.exec(indexText)) !== null) {
  let title = m[1].replace(/\s+/g, ' ').trim();
  topics.push({ title, page: parseInt(m[2]) });
}

function getCategory(title) {
  const t = title.toUpperCase();
  if (t.includes('METODOLOGICI') || t.includes('DERIVAZIONE RAFFORZATA') || t.includes('CHIUSURA DELL’ESERCIZIO') || t.includes('VINCOLI')) {
    return 'Metodologia & Principi';
  }
  if (t.includes('IMMOBILIZZAZIONI') || t.includes('AMMORTAMENT') || t.includes('CREDITO D’IMPOSTA') || t.includes('RIVALUTAZIONE') || t.includes('MANUTENZIONE') || t.includes('IMMOBILI') || t.includes('FOTOVOLTAICI')) {
    return 'Immobilizzazioni & Ammortamenti';
  }
  if (t.includes('CREDITI') || t.includes('VALUTA') || t.includes('RIMANENZE')) {
    return 'Circolante & Magazzino';
  }
  if (t.includes('FONDI') || t.includes('CONTRIBUTI') || t.includes('FATTURAZIONE') || t.includes('IVA') || t.includes('REVERSE CHARGE')) {
    return 'IVA, Fondi & Contributi';
  }
  if (t.includes('AMMINISTRATORI') || t.includes('TFR') || t.includes('TRATTAMENTO DI FINE') || t.includes('LAVORO')) {
    return 'Lavoro & Compensi';
  }
  if (t.includes('INDEBITAMENTO') || t.includes('ANTICIPAZIONI') || t.includes('FINANZIAMENTO') || t.includes('CASH POOLING') || t.includes('LEASING') || t.includes('LEASE BACK') || t.includes('FACTORING') || t.includes('RICEVUTE') || t.includes('EFFETTI') || t.includes('OBBLIGAZION') || t.includes('PRONTO CONTRO') || t.includes('RIPORTO') || t.includes('DERIVATI')) {
    return 'Banche & Finanza';
  }
  if (t.includes('CAPITALE') || t.includes('ACE') || t.includes('AZIONI PROPRIE')) {
    return 'Patrimonio Netto & Capitale';
  }
  if (t.includes('FISCALITÀ') || t.includes('DIVIDEND') || t.includes('PLUSVALENZE') || t.includes('INTERESSI PASSIVI') || t.includes('RAPPRESENTANZA') || t.includes('VITTO') || t.includes('PERDITE') || t.includes('TRASPARENZA') || t.includes('PARTECIPAZIONI') || t.includes('CONSOLIDATO FISCALE') || t.includes('COMODO') || t.includes('IRAP')) {
    return 'Imposte Dirette & Fiscalità';
  }
  if (t.includes('LIQUIDAZIONE') || t.includes('FUSIONE') || t.includes('SCISSIONE') || t.includes('TRASFORMAZIONE') || t.includes('CONFERIMENTO') || t.includes('CESSIONE D’AZIENDA')) {
    return 'Operazioni Straordinarie';
  }
  if (t.includes('INDICI') || t.includes('RENDICONTO') || t.includes('BILANCIO') || t.includes('RETI') || t.includes('LIBRI SOCIALI')) {
    return 'Bilancio & Contabilità';
  }
  return 'Approfondimenti Professionali';
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

const lines = content.split(/\r?\n/);

// Find line boundaries for each topic
let searchLine = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('ASPETTI METODOLOGICI')) {
    searchLine = i;
    break;
  }
}

const sections = [];
for (let idx = 0; idx < topics.length; idx++) {
  const t = topics[idx];
  const cleanTitle = t.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  let foundLine = -1;
  for (let i = searchLine; i < lines.length; i++) {
    const l = lines[i].toLowerCase().replace(/[^a-z0-9]/g, '');
    if (l.includes(cleanTitle.slice(0, 20))) {
      foundLine = i;
      break;
    }
  }
  if (foundLine !== -1) {
    sections.push({ ...t, startLine: foundLine });
    searchLine = foundLine + 1;
  }
}

const parsedSections = [];
const emptySections = [];

for (let i = 0; i < sections.length; i++) {
  const sec = sections[i];
  const start = sec.startLine;
  const end = (i < sections.length - 1) ? sections[i+1].startLine : lines.length;
  const secLines = lines.slice(start, end);

  // Clean lines: strip orphan bullet markers, extra spaces
  const filteredLines = secLines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    if (/^[-*•]\s*['’]?\s*$/.test(trimmed)) return false;
    if (/^>\s*$/.test(trimmed)) return false;
    return true;
  });

  const secContent = filteredLines.join('\n').trim();

  // Check if content (excluding headings) has actual text
  const textOnly = filteredLines
    .filter(l => !l.trim().startsWith('#'))
    .join(' ')
    .trim();

  if (textOnly.length === 0) {
    emptySections.push(sec.title);
    continue; // Eliminate empty section
  }

  // Find summary
  let summary = '';
  for (const l of filteredLines) {
    const clean = l
      .replace(/^#+\s*/, '')
      .replace(/\*+/g, '')
      .replace(/_+/g, '')
      .replace(/~~.*?~~/g, '')
      .replace(/^[-*•]\s*/, '')
      .trim();

    if (
      clean.length > 30 &&
      !clean.toLowerCase().includes(sec.title.toLowerCase().slice(0, 15)) &&
      !clean.toLowerCase().includes('ordine dei dottori') &&
      !clean.toLowerCase().includes('o.d.c.e.c')
    ) {
      summary = clean;
      break;
    }
  }

  if (!summary) {
    for (const l of filteredLines) {
      const clean = l.replace(/^#+\s*/, '').replace(/\*+/g, '').replace(/_+/g, '').trim();
      if (clean.length > 20) {
        summary = clean;
        break;
      }
    }
  }

  if (summary.length > 180) {
    summary = summary.slice(0, 177) + '...';
  }

  const wordCount = secContent.split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 180));

  parsedSections.push({
    id: `${slugify(sec.title)}-p${sec.page}`,
    title: sec.title,
    category: getCategory(sec.title),
    page: sec.page,
    summary,
    readingMinutes,
    content: secContent,
    updatedAt: '2025-10-15'
  });
}

const categories = Array.from(new Set(parsedSections.map(s => s.category)));

const outputContent = `// File generato automaticamente da scripts/generateMaterialiData.cjs a partire da src/data/materiali.md
// Data generazione: ${new Date().toISOString()}

export interface MaterialeSection {
  id: string;
  title: string;
  category: string;
  page: number;
  summary: string;
  readingMinutes: number;
  content: string;
  updatedAt: string;
}

export const MATERIALI_CATEGORIES: string[] = ${JSON.stringify(categories, null, 2)};

export const MATERIALI_SECTIONS: MaterialeSection[] = ${JSON.stringify(parsedSections, null, 2)};

export function getMaterialeById(id: string): MaterialeSection | undefined {
  return MATERIALI_SECTIONS.find(s => s.id === id);
}
`;

fs.writeFileSync(outPath, outputContent, 'utf-8');
console.log('Successfully generated', outPath);
console.log('Total valid sections:', parsedSections.length);
console.log('Empty sections eliminated:', emptySections.length, emptySections);
console.log('Categories:', categories);
