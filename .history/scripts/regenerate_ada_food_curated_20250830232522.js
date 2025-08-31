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

const targets = [ 'feature:ada', 'policy:food' ];

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

// Remove all existing ADA and food polls
let cleaned = registry.filter(p => {
  try{
    for(const k of targets) if(matchesKey(p, k)) return false;
    return true;
  }catch(e){ return true; }
});

const ts = Date.now();
let totalAdded = 0;

const adaTemplates = [
  'How important is a wheelchair ramp or lift for your booking?',
  'Should ADA features (ramps, lifts, securements) be listed in the vehicle details?',
  'Would you pay a small premium to guarantee an ADA-compliant vehicle?',
  'How satisfied are you with operators’ communication about ADA needs?',
  'Does your group often require multiple ADA-accessible seats?'
];

const foodTemplates = [
  'Should outside food and drink be allowed on board with rules?',
  'Should hot or greasy foods be banned to protect vehicle interiors?',
  'How should providers handle spills caused by food or drink?',
  'Should operators offer optional catering to avoid outside food issues?',
  'Are strict food/drink rules acceptable if clearly disclosed at booking?'
];

function pickOptions(key, i){
  if(key === 'feature:ada') return ['Required','Preferred','Call to confirm','Not needed'];
  if(key === 'policy:food') return ['Allowed with rules','Only packaged/snack foods','No outside food','Catering only'];
  return ['Yes','No','Maybe','Depends'];
}

function generateFor(key, templates){
  const base = keyBase(key);
  for(let i=1;i<=50;i++){
    const q = templates[(i-1) % templates.length];
    const id = `${base}-curated-${ts}-${i}`;
    const poll = { id, question: q, options: pickOptions(key, i-1), tags: [base], category: key, curated: true };
    cleaned.push(poll);
    totalAdded++;
  }
  console.log(`Generated 50 curated polls for ${key}`);
}

generateFor('feature:ada', adaTemplates);
generateFor('policy:food', foodTemplates);

writeJson(REG_PATH, cleaned);
const publicArr = cleaned.filter(p => !(p && typeof p.id === 'string' && /^autofill_/i.test(p.id)));
writeJson(PUBLIC_PATH, publicArr);

console.log('Replacement complete. Total polls added:', totalAdded);
console.log('Wrote:', REG_PATH, PUBLIC_PATH);
