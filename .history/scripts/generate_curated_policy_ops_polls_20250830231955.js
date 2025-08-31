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

const wantKeys = [
  'ops:cleanup',
  'policy:smoking',
  'feature:ada',
  'ops:pickup-drop',
  'policy:food'
];

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

// Curated templates for these categories
const templates = {
  'ops:cleanup': [
    'How strictly should cleanup be enforced after a group trip?',
    'Should there be a refundable damage/cleanup deposit for parties?',
    'What is an acceptable timeline for cleaning up a vehicle after use?',
    'Which cleanup responsibility should fall on the group vs. the provider?',
    'How much extra should cleaning fees be for heavy messes?'
  ],
  'policy:smoking': [
    'Should smoking/vaping be allowed on board with restrictions?',
    'If smoking is allowed, should it be confined to an outdoor break only?',
    'Should providers charge an extra cleaning fee when smoking occurs?',
    'Which of these best represents your preference about smoking on hired vehicles?',
    'How should companies advertise a no-smoking policy to avoid surprises?'
  ],
  'feature:ada': [
    'How important is ADA access when choosing a vehicle for your group?',
    'Which ADA features do you expect on a vehicle? (ramps, lifts, securement)',
    'Should ADA-equipped vehicles be highlighted in search results?',
    'Would you pay extra to guarantee ADA-compliant equipment is on your trip?',
    'How satisfied are you with current ADA accommodations provided by operators?'
  ],
  'ops:pickup-drop': [
    'Which pickup/drop window length would you prefer for smooth operations?',
    'Should drivers be required to wait a set number of minutes at pickup?',
    'How much flexibility should drivers have for early/late pickups?',
    'Should additional stops be allowed within the pickup/drop window for a fee?',
    'Which method of confirming pickup time is most reliable for you?'
  ],
  'policy:food': [
    'Should outside food be allowed on board with simple rules?',
    'Should hot or greasy foods be disallowed to protect interiors?',
    'How should providers handle spills or stains caused by food?',
    'Should companies offer catering partners to avoid outside food issues?',
    'Are clear food/drink rules more important than strict enforcement?'
  ]
};

function pickOptionsForTemplate(key, idx){
  if(key === 'ops:cleanup') return ['No extra fee — group cleans','Small refundable deposit','Fixed cleaning fee','Provider handles (included)'];
  if(key === 'policy:smoking') return ['No smoking/vaping','Allowed during breaks only','Allowed with fee','Designated areas only'];
  if(key === 'feature:ada') return ['Fully ADA-compliant','Partial ADA access','Call to confirm availability','Not necessary'];
  if(key === 'ops:pickup-drop') return ['15 minute window','30 minute window','Fixed time only','Flexible on request'];
  if(key === 'policy:food') return ['BYO allowed with rules','Only non-greasy/packaged foods','No outside food','Catering preferred'];
  return ['Yes','Maybe','No','Depends'];
}

// Remove previous auto-generated polls for these keys
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
    const options = pickOptionsForTemplate(key, i-1);
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
