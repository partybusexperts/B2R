const fs = require('fs');
const path = require('path');

const registryPath = path.resolve(__dirname, '../src/data/pollsRegistry.ts');
let text = fs.readFileSync(registryPath, 'utf8');

// Find all tags and counts
const tagRegex = /tags:\s*\[([^\]]*)\]/g;
const counts = new Map();
let m;
while ((m = tagRegex.exec(text)) !== null) {
  const inside = m[1];
  const parts = inside.split(',').map(s => s.trim()).filter(Boolean);
  for (let p of parts) {
    p = p.replace(/^['"]|['"]$/g, '');
    counts.set(p, (counts.get(p) || 0) + 1);
  }
}

const target = 50;
const deficits = [];
for (const [tag, cnt] of counts.entries()) {
  if (cnt < target) deficits.push({ tag, need: target - cnt });
}

if (deficits.length === 0) {
  console.log('All tags already meet target.');
  process.exit(0);
}

// Build insert block
function sanitizeTag(tag) {
  return tag.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').toLowerCase();
}

let insertLines = [];
insertLines.push('\n  // --- Auto-generated fill polls to bring tags to 50 each ---');
let globalCounter = 1;
for (const d of deficits) {
  const tag = d.tag;
  const san = sanitizeTag(tag);
  for (let i = 1; i <= d.need; i++) {
    const id = `autofill_${san}_${i}`;
    const q = `Auto-fill poll for tag ${tag} (#${i})`;
    const options = `["Option A","Option B","Option C","Option D"]`;
    insertLines.push(`  { id: "${id}", question: "${q}", options: ${options}, tags: ["${tag}"], active: true },`);
    globalCounter++;
  }
}

// Insert before the final closing of the array (look for '\n];' at the end)
const closing = '\n];';
const idx = text.lastIndexOf(closing);
if (idx === -1) {
  console.error('Could not find closing array delimiter in registry file. Aborting.');
  process.exit(1);
}

const newText = text.slice(0, idx) + insertLines.join('\n') + text.slice(idx);
fs.writeFileSync(registryPath, newText, 'utf8');
console.log('Appended', globalCounter - 1, 'auto-fill polls to', registryPath);
process.exit(0);
