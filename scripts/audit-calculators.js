const fs = require('fs');
const path = require('path');
const repo = 'c:/dev/b2r';
const regPath = path.join(repo, 'data', 'toolsRegistry.json');
const calcPath = path.join(repo, 'src', 'lib', 'tools', 'calculators.ts');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
const calc = fs.readFileSync(calcPath, 'utf8');
const re = /calculators\["([^"\]]+)"\]/g;
const ids = [];
let m;
while ((m = re.exec(calc)) !== null) ids.push(m[1]);
const uniqueIds = Array.from(new Set(ids));
const regIds = reg.map(r => r.id);
const missing = regIds.filter(id => !uniqueIds.includes(id));
console.log('implemented_count:', uniqueIds.length);
console.log('implemented_ids:\n' + uniqueIds.join('\n'));
console.log('\nregistry_count:', regIds.length);
console.log('missing_count:', missing.length);
if (missing.length) console.log('missing_ids:\n' + missing.join('\n'));
else console.log('All registry tools implemented');

// write a JSON summary for tooling
fs.writeFileSync(path.join(repo, 'tmp', 'audit_calculators_summary.json'), JSON.stringify({implemented: uniqueIds, registry: regIds, missing}, null, 2));
console.log('\nSummary written to tmp/audit_calculators_summary.json');
