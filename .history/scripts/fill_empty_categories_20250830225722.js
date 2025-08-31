#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REG_PATH = path.join(process.cwd(), 'data', 'pollsRegistry.json');
const TAX_PATH = path.join(process.cwd(), 'src', 'data', 'polls', 'taxonomy.ts');
const PUBLIC_PATH = path.join(process.cwd(), 'public', 'polls.json');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch (e) { return null; } }
function writeJson(p,o){ fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2), 'utf8'); }

const registry = readJson(REG_PATH);
if(!Array.isArray(registry)){ console.error('Failed to read registry'); process.exit(1); }
const taxRaw = fs.readFileSync(TAX_PATH,'utf8');
// extract keys like key: "event:brewery"
const keyRe = /key\s*:\s*['\"]([^'\"]+)['\"]/g;
const taxonomyKeys = [];
let m;
while((m = keyRe.exec(taxRaw)) !== null){ taxonomyKeys.push(m[1]); }
if(taxonomyKeys.length === 0){ console.error('No taxonomy keys found'); process.exit(1); }

// normalize function: lower-case and keep after colon if present
function normKey(k){ return String(k||'').toLowerCase(); }
function keyBase(k){ const s = String(k||''); const idx = s.indexOf(':'); return idx===-1? s.toLowerCase() : s.slice(idx+1).toLowerCase(); }

// compute counts for each taxonomy key
const counts = Object.fromEntries(taxonomyKeys.map(k => [k,0]));
for(const p of registry){ const cat = (p && p.category) ? String(p.category).toLowerCase() : null; const tags = Array.isArray(p.tags)?p.tags.map(t=>String(t).toLowerCase()):[]; const text = [p.question,p.title,p.prompt].filter(Boolean).join(' ').toLowerCase();
  for(const k of taxonomyKeys){ const base = keyBase(k); if(cat && (cat===k || cat===base || cat.includes(base))) { counts[k]++; break; }
    if(tags.some(t=> t===k || t===base || t.includes(base))) { counts[k]++; break; }
    if(base && text.includes(base)) { counts[k]++; break; }
  }
}

const zeroKeys = taxonomyKeys.filter(k=>counts[k]===0);
if(zeroKeys.length===0){ console.log('No taxonomy categories with zero polls.'); process.exit(0); }
const toFill = zeroKeys.slice(0,4);
console.log('Taxonomy keys with zero polls:', zeroKeys.length, 'Filling first:', toFill);

let totalAdded = 0;
const ts = Date.now();
for(const k of toFill){ const base = keyBase(k) || 'misc'; for(let i=1;i<=50;i++){ const id = `${base}_autogen_${ts}_${i}`; const question = `Auto-generated ${k} poll (#${i})`; const poll = { id, question, options: ['Option A','Option B','Option C','Option D'], tags: [base], active: true, category: k }; registry.push(poll); totalAdded++; }}

writeJson(REG_PATH, registry);
// update public (filter autofill_ legacy ids)
const publicArr = registry.filter(p => !(p && typeof p.id === 'string' && /^autofill_/i.test(p.id)));
writeJson(PUBLIC_PATH, publicArr);

console.log(`Added ${totalAdded} polls across ${toFill.length} categories.`);
console.log('Updated files:', REG_PATH, 'and', PUBLIC_PATH);
console.log('Filled categories:', toFill);
