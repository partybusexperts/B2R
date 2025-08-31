#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA_REGISTRY = path.join(process.cwd(), 'data', 'pollsRegistry.json');
const PUBLIC_POLLS = path.join(process.cwd(), 'public', 'polls.json');

function slug(s) { return String(s || 'misc').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }

function pickLabel(tag) {
  return `Auto-generated poll for ${tag}`;
}

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; }
}

function writeJson(p, obj) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); }

const registry = readJson(DATA_REGISTRY);
if (!Array.isArray(registry)) {
  console.error('Could not read or parse', DATA_REGISTRY);
  process.exit(1);
}

// Group by category/tag heuristic (category if present else first tag else other:misc)
const groups = new Map();
for (const item of registry) {
  let key = 'other:misc';
  if (item && item.category && String(item.category).trim()) key = String(item.category).trim().toLowerCase();
  else if (Array.isArray(item.tags) && item.tags.length) key = String(item.tags[0]).toLowerCase();
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(item);
}

let totalAdded = 0;
const timestamp = Date.now();
for (const [key, items] of groups.entries()) {
  const need = 50 - items.length;
  if (need > 0) {
    for (let i = 1; i <= need; i++) {
      const id = `${slug(key)}_autogen_${timestamp}_${i}`;
      const question = `${pickLabel(key)} (#${items.length + i})`;
      const poll = { id, question, options: ['Option A','Option B','Option C','Option D'], tags: [key], active: true };
      registry.push(poll);
      items.push(poll);
      totalAdded++;
    }
  }
}

writeJson(DATA_REGISTRY, registry);

// Build public file by filtering autofill_ entries (legacy autofill ids are removed for public)
const publicArr = registry.filter(p => !(p && typeof p.id === 'string' && /^autofill_/i.test(p.id)));
writeJson(PUBLIC_POLLS, publicArr);

console.log(`Added ${totalAdded} polls to reach 50 per category (where needed).`);
console.log('Final counts per category:');
const counts = [];
for (const [key, items] of groups.entries()) counts.push({ key, count: items.length });
counts.sort((a,b)=>b.count-a.count);
counts.forEach(c => console.log(`${c.key}: ${c.count}`));
console.log('Wrote:', DATA_REGISTRY, 'and', PUBLIC_POLLS);
