#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REG_PATH = path.join(process.cwd(), 'data', 'pollsRegistry.json');
const PUBLIC_PATH = path.join(process.cwd(), 'public', 'polls.json');
const TAX_PATH = path.join(process.cwd(), 'src', 'data', 'polls', 'taxonomy.ts');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch (e) { return null; } }
function writeJson(p,o){ fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2), 'utf8'); }

// Back up existing files
function backup(p){ try { const dest = p + '.bak.' + Date.now(); fs.copyFileSync(p, dest); console.log('Backed up', p, '->', dest); } catch(e){ console.log('No existing file to back up at', p); } }
backup(REG_PATH);
backup(PUBLIC_PATH);

const registry = readJson(REG_PATH) || [];
const taxRaw = fs.readFileSync(TAX_PATH, 'utf8');

// extract state names from taxonomy file
const nameRe = /name:\s*['"]([^'"\n]+)['"]/g;
const stateNames = [];
let m;
while((m = nameRe.exec(taxRaw)) !== null){ stateNames.push(m[1]); }
if(stateNames.length === 0){ console.error('No state names found in taxonomy'); process.exit(1); }

function slugState(name){ return String(name||'').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z-]/g,''); }
function pickOptions(templateIndex, state){
  // Provide 4 reasonably varied options depending on template type
  const optionSets = [
    ['Historic sites','Outdoor adventures','Food & drink tours','Arts & culture'],
    ['Beach/Coastal spots','National/state parks','City sightseeing','Rural escapes'],
    ['Local cuisine','Craft breweries/wineries','Fine dining','Food trucks/local markets'],
    ['Hiking/trails','Water activities','Scenic drives','Wildlife viewing'],
    ['Major sports team','College sports','Local rivalries','I don\'t follow sports'],
    ['Family-friendly','Adult-only nightlife','Romantic getaways','Solo travel friendly'],
    ['Public transit','Rideshare','Car rental','Charter/coach service'],
    ['Festivals & fairs','Concerts & shows','Farmers markets','Community events'],
    ['State parks pass','Museum memberships','Seasonal attraction pass','No pass — pay as you go'],
    ['Yes, visit now','Wait for off-season','Not interested','Depends on the cost']
  ];
  return optionSets[templateIndex % optionSets.length];
}

// curated templates (50) — phrased to be useful and specific
const templates = [
  'What is the single must-see attraction in {state}?',
  'If you had one weekend in {state}, which experience would you pick?',
  'What type of outdoor activity would you recommend in {state}?',
  'Which regional food should you try first when visiting {state}?',
  'For groups traveling to {state}, what is the best type of outing?',
  'Which city in {state} has the best nightlife scene?',
  'When visiting {state} in summer, what do you prioritize?',
  'When visiting {state} in winter, what do you prioritize?',
  'What kind of family attraction is most worth the trip to {state}?',
  'If you were planning a brewery or winery tour in {state}, which would you choose?',
  'Which local festival in {state} is the most iconic?',
  'For college visitors, which campus experience in {state} matters most?',
  'What is the best road-trip route through {state}?',
  'Which state/local park in {state} is the top pick for scenic views?',
  'Which transportation option is ideal for getting around {state}?',
  'If you could only eat one regional specialty in {state}, what would it be?',
  'Which season is best to visit {state}?',
  'What is the most underrated small town or region in {state}?',
  'How do you feel about guided tours versus exploring {state} independently?',
  'Which cultural institution (museum/theatre) in {state} is a must-see?',
  'For sports fans visiting {state}, what matters most?',
  'Which scenic drive in {state} should be on every visitor\'s list?',
  'If you had one night out in {state}, where would you go?',
  'What local souvenir from {state} is worth bringing home?',
  'For outdoor lovers, does {state} offer better hiking or water activities?',
  'Which small-batch food or drink in {state} deserves national attention?',
  'Are guided tasting tours (wine/beer/food) worth it in {state}?',
  'What safety tip would you give visitors traveling through {state}?',
  'How important are historic landmarks when choosing a trip to {state}?',
  'What kind of wildlife viewing would you expect in {state}?',
  'If you planned a wedding or large event in {state}, what venue type is best?',
  'Which airport is easiest for most travelers going to {state}?',
  'Which beach or lakeside area in {state} is a top pick?',
  'Do you prefer city-centered stays or rural retreats when visiting {state}?',
  'Which local tradition or holiday in {state} should travelers experience?',
  'How would you rate value for money when vacationing in {state}?',
  'Which type of guided experience would you book in {state}?',
  'What local mobility option would improve travel in {state}?',
  'Which time of day is best for sightseeing in {state}?',
  'Would you recommend {state} as a weekend getaway destination?',
  'Which family activity in {state} gets the highest recommendation?',
  'What is the best neighborhood to stay in for first-time visitors to {state}?',
  'Which environmental effort or park conservation in {state} is most important?',
  'What culinary trend in {state} are you most excited about?',
  'Which outdoor festival in {state} would you not miss?',
  'Are public tours of local breweries/wineries in {state} usually worth the cost?',
  'Which transportation hub (train/bus/airport) best serves {state}?',
  'What local etiquette should visitors know before visiting {state}?',
  'Which lesser-known museum or gallery in {state} is worth a visit?',
  'Would you recommend visiting {state} for a group trip or solo travel?',
  'Which seasonal event in {state} draws the largest crowds?'
];

// ensure templates length is 50; if fewer, repeat safely
while(templates.length < 50){ templates.push(...templates.slice(0, 50 - templates.length)); }

// remove existing auto-generated state polls (those with _autogen_ or questions starting with 'Auto-generated') for the states we'll replace
const stateKeys = stateNames.map(slugState);
const cleaned = registry.filter(p => {
  try {
    const cat = (p && p.category)? String(p.category).toLowerCase() : '';
    const id = (p && p.id)? String(p.id).toLowerCase() : '';
    const q = (p && p.question)? String(p.question).toLowerCase() : '';
    if(stateKeys.includes(cat) && (id.includes('_autogen_') || q.startsWith('auto-generated'))) return false;
    return true;
  } catch(e){ return true; }
});

let totalAdded = 0;
const ts = Date.now();
for(const name of stateNames){
  const key = slugState(name);
  // count how many existing after cleanup
  const existing = cleaned.filter(p => { const cat = (p && p.category)? String(p.category).toLowerCase() : ''; return cat === key; });
  const need = 50 - existing.length;
  if(need <= 0){ console.log(`${name} already has ${existing.length} curated/legacy polls — skipping`); continue; }

  // build a palette of templates for this state (rotate templates to avoid repetitiveness)
  for(let i=1;i<=need;i++){
    const tplIndex = (i - 1) % templates.length;
    const tpl = templates[tplIndex];
    const question = tpl.replace(/\{state\}/g, name);
    const options = pickOptions(tplIndex, name);
    const id = `${key}-curated-${ts}-${i}`;
    const poll = { id, question, options, tags: [key], active: true, category: key };
    cleaned.push(poll);
    totalAdded++;
  }
  console.log(`Added ${need} curated polls for ${name}`);
}

writeJson(REG_PATH, cleaned);
// build public array — exclude legacy autofill ids
const publicArr = cleaned.filter(p => !(p && typeof p.id === 'string' && /^autofill_/i.test(p.id)));
writeJson(PUBLIC_PATH, publicArr);

console.log('Curated generation complete. Total curated polls added:', totalAdded);
console.log('Updated:', REG_PATH, PUBLIC_PATH);
