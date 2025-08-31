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
  'feature:ada',
  'feature:child-seat',
  'feature:pole',
  'feature:charging',
  'feature:karaoke',
  'feature:lighting',
  'feature:luggage',
  'feature:music',
  'feature:pet',
  'feature:restroom',
  'policy:food',
  'policy:routes'
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

// Thoughtful templates tailored for features and policies
const templates = [
  'How important is {feature} when choosing a vehicle for a group trip?',
  'Would you pay extra to guarantee {feature} on your booked vehicle?',
  'If {feature} were unavailable, would you still book the vehicle?',
  'For families, how critical is {feature}?',
  'Which of these best describes your preference for {feature}?',
  'Should providers be required to advertise {feature} availability clearly?',
  'For multi-stop trips, how much does {feature} matter?',
  'Would you recommend a company that offers {feature} by default?',
  'How satisfied are you when {feature} is included with no extra fee?',
  'Which safety or quality concern is most related to {feature}?',
  'When traveling with kids, how many {feature} do you expect?',
  'For longer trips, how valuable is {feature}?',
  'Does {feature} make the trip more accessible or convenient?',
  'When choosing a bus/van, is {feature} a deciding factor?',
  'Would a short tutorial or signage improve your use of {feature}?',
  'Which of these would you prioritize over {feature}?',
  'If {feature} costs extra, what price would be fair?',
  'How often have you needed {feature} unexpectedly?',
  'How much should providers invest in maintaining {feature}?',
  'Would you book less often if {feature} were permanently removed?',
  'When comparing companies, do you check for {feature} first or last?',
  'For accessibility features like {feature}, should there be a certification?',
  'Do you prefer {feature} to be included or optional add-on?',
  'Which alternative would you accept if {feature} is unavailable?',
  'Who should be responsible for cleaning/maintaining {feature}?',
  'How clearly do companies currently advertise {feature}?',
  'Does offering {feature} influence your group size choice?',
  'Would you want a dedicated staff member to assist with {feature}?',
  'Which rule would improve safety around {feature}?',
  'Should {feature} be allowed at all times or restricted hours?',
  'How would you rate the importance of {feature} for corporate clients?',
  'For {feature}, which extra equipment matters most?',
  'Would you be more likely to recommend a provider that enforces food/drink rules related to {feature}?',
  'When booking, do you read policy details about {feature}?',
  'Which option best reduces disputes about {feature}?',
  'How likely are you to cancel if {feature} is missing?',
  'Which floorplan/layout best supports {feature}?',
  'Do you expect advance notice if {feature} will be unavailable?',
  'Would you bargain for {feature} to be included in a corporate rate?',
  'Which guest type benefits most from {feature}?',
  'Does {feature} improve photos/social media value for your event?',
  'Would you choose a vehicle specifically for its {feature}?',
  'How often should companies audit {feature} for safety?',
  'If {feature} is present, how strict should food/drink rules be?',
  'Should companies offer tutorials or demos for {feature}?',
  'Which signage would help with {feature} expectations?',
  'How useful is having charging/USB ports for your group?',
  'Which restroom feature matters most to your group?'
];

function pickOptionsForKey(key, idx){
  // sensible option sets per general feature/policy types
  const keyBaseName = keyBase(key);
  if(keyBaseName.includes('ada')) return ['Yes — essential','Sometimes useful','Rarely needed','Not necessary'];
  if(keyBaseName.includes('child')) return ['Multiple child seats provided','One or two available','Bring your own','Not available'];
  if(keyBaseName.includes('pole')) return ['Installed & secured','Removable on request','Not installed','Prohibited'];
  if(keyBaseName.includes('charging')) return ['Plenty of ports','A few USB ports','No ports — adapters needed','Portable chargers fine'];
  if(keyBaseName.includes('karaoke')) return ['Karaoke & mic included','Karaoke optional','No karaoke','I prefer playlists only'];
  if(keyBaseName.includes('lighting')) return ['Ambient lighting','Party LEDs','No special lighting','Custom lighting on request'];
  if(keyBaseName.includes('luggage')) return ['Plenty of space','Tight fit for groups','Roof/under storage available','Recommend smaller bags'];
  if(keyBaseName.includes('music')) return ['DJ/curated playlist','Connect your device','Radio only','No music'];
  if(keyBaseName.includes('pet')) return ['Pet-friendly with fee','Pet-friendly no fee','Pets allowed on request','No pets'];
  if(keyBaseName.includes('restroom')) return ['Onboard restroom','Restroom breaks planned','Portable restroom available','No restroom'];
  if(keyBaseName.includes('food')) return ['BYOB allowed','Food allowed with rules','No outside food','Catering only'];
  if(keyBaseName.includes('routes')) return ['Flexible routing','Fixed route only','Extra stops allowed for fee','Depends on schedule'];
  // fallback
  const defaults = [
    ['Very important','Somewhat important','Neutral','Not important'],
    ['Yes','Maybe','No','Depends']
  ];
  return defaults[idx % defaults.length];
}

// Remove earlier autogenerated polls for these keys (id contains _autogen_ or question starts with Auto-generated)
const cleaned = registry.filter(p => {
  try {
    const cat = (p && p.category)? String(p.category).toLowerCase() : '';
    const id = (p && p.id)? String(p.id).toLowerCase() : '';
    const q = (p && p.question)? String(p.question).toLowerCase() : '';
    if(wantKeys.includes(cat) && (id.includes('_autogen_') || q.startsWith('auto-generated'))) return false;
    return true;
  } catch(e){ return true; }
});

let totalAdded = 0;
const ts = Date.now();
for(const key of wantKeys){
  const base = keyBase(key);
  const existing = cleaned.filter(p => matchesKey(p, key));
  const need = 50 - existing.length;
  if(need <= 0){ console.log(`${key}: already ${existing.length} polls — skipping`); continue; }
  for(let i=1;i<=need;i++){
    const tplIndex = (i-1) % templates.length;
    const tpl = templates[tplIndex];
    const featureLabel = base.replace(/[-_]/g,' ');
    const question = tpl.replace(/\{feature\}/g, featureLabel).replace(/\{state\}/g, featureLabel);
    const options = pickOptionsForKey(key, tplIndex);
    const id = `${base}-curated-${ts}-${i}`;
    const poll = { id, question, options, tags: [base], active: true, category: key };
    cleaned.push(poll);
    totalAdded++;
  }
  console.log(`Added ${need} curated polls for ${key}`);
}

writeJson(REG_PATH, cleaned);
const publicArr = cleaned.filter(p => !(p && typeof p.id === 'string' && /^autofill_/i.test(p.id)));
writeJson(PUBLIC_PATH, publicArr);

console.log('Feature/policy curated generation complete. Total polls added:', totalAdded);
console.log('Updated:', REG_PATH, PUBLIC_PATH);
