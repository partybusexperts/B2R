const fs = require('fs');
const path = require('path');

const registryPath = path.resolve(__dirname, '../src/data/pollsRegistry.ts');
const text = fs.readFileSync(registryPath, 'utf8');

const tagRegex = /tags:\s*\[([^\]]*)\]/g;
const counts = new Map();

let m;
while ((m = tagRegex.exec(text)) !== null) {
  const inside = m[1];
  const parts = inside.split(',').map(s => s.trim()).filter(Boolean);
  for (let p of parts) {
    p = p.replace(/^['"]|['"]$/g, '');
    const cur = counts.get(p) || 0;
    counts.set(p, cur + 1);
  }
}

const sorted = Array.from(counts.entries()).sort((a,b)=> b[1]-a[1]);
console.log('Tag counts in pollsRegistry.ts:\n');
for (const [tag, cnt] of sorted) {
  console.log(`${tag}: ${cnt}`);
}

console.log('\nTags with less than 50 polls (target=50):\n');
for (const [tag, cnt] of sorted) {
  if (cnt < 50) {
    console.log(`${tag}: ${cnt} (needs ${50-cnt})`);
  }
}

// Also show event sub-tags (those beginning with 'haunted' or containing '-') for clarity
console.log('\nAll distinct tags count:', counts.size);

process.exit(0);
