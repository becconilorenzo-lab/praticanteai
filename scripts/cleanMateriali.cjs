const fs = require('fs');
const path = require('path');

const mdPath = path.resolve(__dirname, '../src/data/materiali.md');
if (!fs.existsSync(mdPath)) {
  console.error('File not found:', mdPath);
  process.exit(1);
}

let md = fs.readFileSync(mdPath, 'utf-8');
const originalLength = md.length;

// 1. Picture blocks with text
const picWithTextRegex = /\*\*==>\s*picture\s*\[.*?\]\s*intentionally\s*omitted\s*<==\*\*\s*(\r?\n\s*)*\*\*----- Start of picture text -----\*\*[\s\S]*?\*\*----- End of picture text -----\*\*(<br>)?/gi;
let picWithTextCount = 0;
md = md.replace(picWithTextRegex, () => {
  picWithTextCount++;
  return '';
});

// 2. Standalone picture placeholders
const picStandaloneRegex = /\*\*==>\s*picture\s*\[.*?\]\s*intentionally\s*omitted\s*<==\*\*/gi;
let picStandaloneCount = 0;
md = md.replace(picStandaloneRegex, () => {
  picStandaloneCount++;
  return '';
});

// 3. Isolated picture text blocks if any
const picIsolatedTextRegex = /\*\*----- Start of picture text -----\*\*[\s\S]*?\*\*----- End of picture text -----\*\*(<br>)?/gi;
let picIsolatedCount = 0;
md = md.replace(picIsolatedTextRegex, () => {
  picIsolatedCount++;
  return '';
});

// 4. Remove all ODCEC Torino references
let odcecCount = 0;
md = md.replace(/\*\*O\.D\.C\.E\.C\.\s*Torino\*\*/gi, () => {
  odcecCount++;
  return '';
});

md = md.replace(/>\s*La presente dispensa costituisce materiale di supporto integrativo per la preparazione all’esame di stato/gi, '');
md = md.replace(/La presente dispensa costituisce materiale di supporto integrativo per la preparazione all’esame di stato/gi, '');
md = md.replace(/#\s*\*\*ORDINE DEI DOTTORI COMMERCIALISTI E DEGLI ESPERTI CONTABILI DI TORINO\*\*/gi, '');

// Clean line by line
const lines = md.split(/\r?\n/);
const cleanedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Page markers like _6_, ## _12_
  if (/^_\d+_$/.test(trimmed) || /^##\s*_\d+_$/.test(trimmed)) {
    continue;
  }

  // Broken list bullet items
  if (/^[-*•]\s*$/.test(trimmed) || /^\d+\.\s*$/.test(trimmed)) {
    continue;
  }

  // Blank quote markers like `> ` or `>`
  if (/^>\s*$/.test(trimmed)) {
    continue;
  }

  cleanedLines.push(line);
}

// Reassemble and collapse 3+ empty lines to 2
let cleanedMd = cleanedLines.join('\n');
cleanedMd = cleanedMd.replace(/\n{3,}/g, '\n\n');

// Write back to file
fs.writeFileSync(mdPath, cleanedMd, 'utf-8');

console.log('--- Cleaning Report ---');
console.log('Original size:', (originalLength / 1024).toFixed(2), 'KB');
console.log('Cleaned size:', (cleanedMd.length / 1024).toFixed(2), 'KB');
console.log('Picture blocks with text removed:', picWithTextCount);
console.log('Picture standalone placeholders removed:', picStandaloneCount);
console.log('Picture isolated text blocks removed:', picIsolatedCount);
console.log('Total picture placeholders removed:', picWithTextCount + picStandaloneCount);
console.log('ODCEC Torino instances removed:', odcecCount);

// Verify remaining occurrences
console.log('Remaining intentionally omitted:', (cleanedMd.match(/intentionally\s*omitted/gi) || []).length);
console.log('Remaining picture text:', (cleanedMd.match(/picture text/gi) || []).length);
console.log('Remaining ODCEC:', (cleanedMd.match(/o\.?d\.?c\.?e\.?c/gi) || []).length);
console.log('Remaining Torino:', (cleanedMd.match(/torino/gi) || []).length);
