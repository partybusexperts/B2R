const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'data', 'pollsRegistry.json');
if (!fs.existsSync(file)) {
  console.error('Missing', file);
  process.exit(2);
}
const raw = fs.readFileSync(file, 'utf8');
const arr = JSON.parse(raw);
console.log('Total polls:', arr.length);
const autofill = arr.filter(p => typeof p.id === 'string' && p.id.startsWith('autofill_'));
console.log('Autofill entries:', autofill.length);
const counts = {};
arr.forEach(p => (p.tags || []).forEach(t => counts[t] = (counts[t]||0)+1));
console.log('Tag counts sample:', Object.entries(counts).slice(0,20));
if (autofill.length) process.exit(3);
process.exit(0);
