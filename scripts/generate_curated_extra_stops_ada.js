#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REG_PATH = path.join(process.cwd(), 'data', 'pollsRegistry.json');
const PUBLIC_PATH = path.join(process.cwd(), 'public', 'polls.json');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch (e) { return null; } }
function writeJson(p,o){ fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2), 'utf8'); }
function backup(p){ try { const dest = p + '.bak.' + Date.now(); fs.copyFileSync(p, dest); console.log('Backed up', p, '->', dest); } catch(e){ console.log('No existing file to back up at', p); } }

backup(REG_PATH);
backup(PUBLIC_PATH);

const registry = readJson(REG_PATH) || [];

const wantKeys = ['ops:extra-stops', 'feature:ada'];

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

const templates = {
  'ops:extra-stops': [
    'Should additional stops be allowed during a booked trip?',
    'What is a fair fee for adding extra stops to your itinerary?',
    'How many extra stops would you expect to include without surcharge?',
    'Should drivers be allowed to accept spontaneous extra stops?',
    'Do you prefer fixed-stop packages or pay-as-you-go extra stops?'
  ],
  'feature:ada': [
    'How important is an onboard ramp or lift when booking a vehicle?',
    'Should accessible securement points be standard in all vehicles?',
    'Would you like operators to list ADA features up-front in search results?',
    'How satisfied are you with communication about ADA needs during booking?',
    'Should operators proactively offer ADA-compliant alternatives if unavailable?'
  ]
};

function pickOptionsForTemplate(key){
  if(key === 'ops:extra-stops') return ['No extra stops','1–2 stops free','Pay per extra stop','Package of stops'];
  if(key === 'feature:ada') return ['Absolutely required','Nice to have','Call to confirm','Not needed'];
  return ['Yes','No','Maybe','Depends'];
}

// Remove obvious autogen entries for these keys
const cleaned = registry.filter(p => {
  try{
    const cat = (p && p.category)? String(p.category).toLowerCase() : '';
    const id = (p && p.id)? String(p.id).toLowerCase() : '';
    const q = (p && p.question)? String(p.question).toLowerCase() : '';
    if(wantKeys.includes(cat) && (id.includes('_autogen_') || q.startsWith('auto-generated'))) return false;
    return true;
  }catch(e){ return true; }
});

let totalAdded = 0;
const ts = Date.now();
for(const key of wantKeys){
  const existing = cleaned.filter(p => matchesKey(p, key));
  const need = 50 - existing.length;
  if(need <= 0){ console.log(`${key}: already ${existing.length} polls — skipping`); continue; }
  const tpls = templates[key] || [];
  for(let i=1;i<=need;i++){
    const tpl = tpls[(i-1) % tpls.length] || tpls[0] || 'Which option?';
    const question = tpl.replace('{feature}', keyBase(key));
    const options = pickOptionsForTemplate(key);
    const id = `${keyBase(key)}-curated-${ts}-${i}`;
    const poll = { id, question, options, tags: [keyBase(key)], active: true, category: key };
    cleaned.push(poll);
    totalAdded++;
  }
  console.log(`Added ${Math.max(0, need)} curated polls for ${key}`);
}

writeJson(REG_PATH, cleaned);
const publicArr = cleaned.filter(p => !(p && typeof p.id === 'string' && /^autofill_/i.test(p.id)));
writeJson(PUBLIC_PATH, publicArr);

console.log('Curated generation complete. Total polls added:', totalAdded);
console.log('Updated files:', REG_PATH, PUBLIC_PATH);
