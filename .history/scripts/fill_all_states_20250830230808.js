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

const taxRaw = fs.readFileSync(TAX_PATH, 'utf8');
// extract state names from US_STATES array: { code: "AL", name: "Alabama" }
const nameRe = /name:\s*['"]([^'"\n]+)['"]/g;
const stateNames = [];
let m;
while((m = nameRe.exec(taxRaw)) !== null){ stateNames.push(m[1]); }
if(stateNames.length === 0){ console.error('No state names found in taxonomy'); process.exit(1); }

function slugState(name){ return String(name||'').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z-]/g,''); }

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
const addedByState = {};
for(const name of stateNames){
  const key = slugState(name);
  const existing = registry.filter(p => matchesKey(p, key));
  const need = 50 - existing.length;
  if(need <= 0){ addedByState[key] = 0; continue; }
  for(let i=existing.length+1;i<=50;i++){
    const id = `${key}_autogen_${ts}_${i}`;
    const question = `Auto-generated ${name} poll (#${i})`;
    const poll = { id, question, options: ['Option A','Option B','Option C','Option D'], tags: [key], active: true, category: key };
    registry.push(poll);
    totalAdded++;
  }
  addedByState[key] = need;
  console.log(`Added ${need} for state ${name} -> key: ${key}`);
}

writeJson(REG_PATH, registry);
const publicArr = registry.filter(p => !(p && typeof p.id === 'string' && /^autofill_/i.test(p.id)));
writeJson(PUBLIC_PATH, publicArr);

console.log('Total state polls added:', totalAdded);
console.log('Updated files:', REG_PATH, 'and', PUBLIC_PATH);
