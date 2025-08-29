const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'pollsRegistry.ts');
const s = fs.readFileSync(file, 'utf8');

// Match tags arrays like tags: ["a","b"]
const re = /tags\s*:\s*\[([^\]]+)\]/g;
let m;
const counts = new Map();
let total = 0;
while ((m = re.exec(s)) !== null) {
  total++;
  const inner = m[1];
  const tags = inner.split(',').map(x => x.replace(/['"\s]/g,'')).filter(Boolean);
  if (tags.length === 0) {
    counts.set('Uncategorized', (counts.get('Uncategorized')||0)+1);
  } else {
    tags.forEach(t => counts.set(t, (counts.get(t)||0)+1));
  }
}

console.log('Total polls with tags detected:', total);
const arr = Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]);
arr.forEach(([k,v])=> console.log(`${k}: ${v}`));

// Identify vehicle groups and event groups
const vehicles = ['party-bus','limo','coach-bus','sedan','suv'];
const events = Array.from(counts.keys()).filter(k => /event|party|tours|haunted|thanksgiving|christmas|wedding|birthday|events/i.test(k));
console.log('\nVehicle counts:'); vehicles.forEach(v=> console.log(`${v}: ${counts.get(v)||0}`));
console.log('\nEvent-like categories found:', events.join(', '));

// Which vehicles missing to reach 50 polls?
console.log('\nVehicle deficits to 50:'); vehicles.forEach(v=> console.log(`${v}: ${Math.max(0,50 - (counts.get(v)||0))}`));
