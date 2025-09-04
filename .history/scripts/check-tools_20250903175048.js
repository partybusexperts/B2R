const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const regPath = path.join(root, 'data', 'toolsRegistry.json');
const calcPath = path.join(root, 'src', 'lib', 'tools', 'calculators.ts');

function read(p){
  try { return fs.readFileSync(p, 'utf8'); } catch(e){ console.error('READ ERROR', p, e.message); process.exit(2); }
}

const regRaw = read(regPath);
let registry = [];
try { registry = JSON.parse(regRaw); } catch(e){
  console.error('Failed to parse registry JSON:', e.message);
  process.exit(3);
}

const regIds = new Set(registry.map(r => r.id).filter(Boolean));

const calcRaw = read(calcPath);
const idRegex = /calculators\[\s*\"([^\"]+)\"\s*\]\s*=\s*\{/g;
const calcIds = new Set();
let m;
while ((m = idRegex.exec(calcRaw)) !== null) calcIds.add(m[1]);

const regOnly = [...regIds].filter(x => !calcIds.has(x)).sort();
const calcOnly = [...calcIds].filter(x => !regIds.has(x)).sort();

console.log('registry count:', regIds.size);
console.log('calculators count:', calcIds.size);
console.log('---');
if (regOnly.length === 0) console.log('All registry IDs have matching calculators.');
else { console.log('IDs present in registry but MISSING in calculators:'); console.log(regOnly.join('\n')); }

console.log('---');
if (calcOnly.length === 0) console.log('All calculators are listed in registry.');
else { console.log('IDs present in calculators but MISSING in registry:'); console.log(calcOnly.join('\n')); }

process.exit(0);
