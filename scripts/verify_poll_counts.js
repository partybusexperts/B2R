const fs = require('fs');
const path = require('path');

const REG_PATH = path.join(__dirname, '..', 'src', 'data', 'pollsRegistry.ts');

function main() {
  const raw = fs.readFileSync(REG_PATH, 'utf8');

  // Count occurrences of id: "..."
  const idRe = /id:\s*"([^"]+)"/g;
  const ids = [];
  let m;
  while ((m = idRe.exec(raw)) !== null) ids.push(m[1]);

  const total = ids.length;
  const autofillIds = ids.filter(id => /^autofill_/i.test(id));

  // Count questions starting with Auto-fill poll
  const qRe = /question:\s*"([^"]+)"/g;
  const qs = [];
  while ((m = qRe.exec(raw)) !== null) qs.push(m[1]);
  const autofillQs = qs.filter(q => /^auto-?fill poll/i.test(q));

  console.log('registry path:', REG_PATH);
  console.log('total polls (id lines):', total);
  console.log('autofill ids count:', autofillIds.length);
  console.log('autofill question-count:', autofillQs.length);
  console.log('non-autofill polls (approx):', total - Math.max(autofillIds.length, autofillQs.length));
  console.log('sample non-autofill ids (first 10):', ids.filter(id => !/^autofill_/i.test(id)).slice(0,10));
}

main();
