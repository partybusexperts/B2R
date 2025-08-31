#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REG_PATH = path.join(process.cwd(), 'data', 'pollsRegistry.json');
const PUBLIC_PATH = path.join(process.cwd(), 'public', 'polls.json');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch (e) { return null; } }
function writeJson(p,o){ fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2), 'utf8'); }

const wantKeys = [
  'event:concert',
  'event:church-youth',
  'event:holiday',
  'event:graduation',
  'event:night-out',
  'event:prom',
  'event:sports'
];

const registry = readJson(REG_PATH);
if(!Array.isArray(registry)){ console.error('Failed to read registry'); process.exit(1); }

function keyBase(k){ const s = String(k||''); const idx = s.indexOf(':'); return idx===-1? s.toLowerCase() : s.slice(idx+1).toLowerCase(); }

function matchesKey(item, key){
  const base = keyBase(key);
  const cat = (item && item.category)? String(item.category).toLowerCase() : '';
  const tags = Array.isArray(item.tags)? item.tags.map(t=>String(t).toLowerCase()):[];
  const text = [item.question,item.title,item.prompt].filter(Boolean).join(' ').toLowerCase();
  if(cat && (cat===key || cat===base || cat.includes(base))) return true;
  if(tags.some(t=> t===key || t===base || t.includes(base))) return true;
  if(base && text.includes(base)) return true;
  return false;
}

let totalAdded = 0;
const ts = Date.now();
for(const key of wantKeys){
  const base = keyBase(key) || 'misc';
  const existing = registry.filter(p => matchesKey(p, key));
  const need = 50 - existing.length;
  if(need <= 0){ console.log(`${key}: already ${existing.length} polls — skipping`); continue; }
  for(let i=existing.length+1; i<=50; i++){
    const id = `${base}_autogen_${ts}_${i}`;
    const question = `Auto-generated ${key} poll (#${i})`;
    const poll = { id, question, options: ['Option A','Option B','Option C','Option D'], tags: [base], active: true, category: key };
    registry.push(poll);
    totalAdded++;
  }
  console.log(`Added ${need} polls for ${key}`);
}

writeJson(REG_PATH, registry);
const publicArr = registry.filter(p => !(p && typeof p.id === 'string' && /^autofill_/i.test(p.id)));
writeJson(PUBLIC_PATH, publicArr);

console.log(`Total polls added: ${totalAdded}`);
console.log('Updated files:', REG_PATH, 'and', PUBLIC_PATH);
