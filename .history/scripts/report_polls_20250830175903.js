const fs = require('fs');
const path = require('path');

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
}

const repoRoot = path.resolve(__dirname, '..');
const taxonomyPath = path.join(repoRoot, 'src', 'data', 'polls', 'taxonomy.ts');
const registryPath = path.join(repoRoot, 'data', 'pollsRegistry.json');

const txRaw = fs.readFileSync(taxonomyPath, 'utf8');
const regRaw = fs.readFileSync(registryPath, 'utf8');
let registry;
try {
  registry = JSON.parse(regRaw);
} catch (err) {
  console.error('Failed parsing pollsRegistry.json:', err.message);
  process.exit(2);
}

const categories = [];

// Helper to push category objects
function pushCat(key, label, synonyms) {
  categories.push({ key: String(key), label: String(label), synonyms: (synonyms || []).map(s=>String(s)) });
}

// 1) Extract explicit PollCategory objects inside arrays (works for VEHICLE_CATEGORIES, EVENT_CATEGORIES, etc.)
const arrayRegex = /export const (\w+): PollCategory\[] = \[([\s\S]*?)\];/g;
let m;
while ((m = arrayRegex.exec(txRaw)) !== null) {
  const body = m[2];
  // find objects
  const objRegex = /\{([\s\S]*?)\}/g;
  let o;
  while ((o = objRegex.exec(body)) !== null) {
    const objText = o[1];
    const keyMatch = /key:\s*"([^"]+)"/.exec(objText);
    const labelMatch = /label:\s*"([^"]+)"/.exec(objText);
    const synMatch = /synonyms:\s*\[([^\]]*)\]/.exec(objText);
    if (keyMatch && labelMatch) {
      const key = keyMatch[1];
      const label = labelMatch[1];
      const syns = [];
      if (synMatch && synMatch[1].trim()) {
        // extract quoted strings
        const qre = /"([^"]+)"/g;
        let q;
        while ((q = qre.exec(synMatch[1])) !== null) syns.push(q[1]);
      }
      pushCat(key, label, syns);
    }
  }
}

// 2) Extract US_STATES entries and create state categories (slug keys)
const statesBlock = /export const US_STATES = \[([\s\S]*?)\];/.exec(txRaw);
if (statesBlock) {
  const block = statesBlock[1];
  const stateRegex = /\{[^}]*name:\s*"([^"]+)"[^}]*\}/g;
  let s;
  while ((s = stateRegex.exec(block)) !== null) {
    const name = s[1];
    const key = slugify(name);
    pushCat(key, name, [name]);
  }
}

// Deduplicate categories by key
const byKey = new Map();
for (const c of categories) {
  const k = c.key;
  if (!byKey.has(k)) byKey.set(k, { key: k, label: c.label, synonyms: new Set(c.synonyms || []) });
  else {
    const cur = byKey.get(k);
    (c.synonyms || []).forEach(s => cur.synonyms.add(s));
  }
}

const finalCats = Array.from(byKey.values()).map(c => ({ key: c.key, label: c.label, synonyms: Array.from(c.synonyms) }));

// Prepare counts
const counts = new Map();
const samples = new Map();
for (const cat of finalCats) {
  counts.set(cat.key, 0);
  samples.set(cat.key, []);
}

function textForPoll(p) {
  const parts = [];
  if (p.id) parts.push(p.id);
  if (p.question) parts.push(p.question);
  if (p.title) parts.push(p.title);
  if (p.prompt) parts.push(p.prompt);
  if (p.tags && Array.isArray(p.tags)) parts.push(p.tags.join(' '));
  return parts.join(' ').toLowerCase();
}

for (const poll of registry) {
  const text = textForPoll(poll);
  const matched = new Set();
  for (const cat of finalCats) {
    const keyLower = cat.key.toLowerCase();
    const labelLower = (cat.label || '').toLowerCase();
    if (text.includes(keyLower)) matched.add(cat.key);
    else if (labelLower && text.includes(labelLower)) matched.add(cat.key);
    else if (cat.synonyms) {
      for (const s of cat.synonyms) {
        if (!s) continue;
        const sl = String(s).toLowerCase();
        if (text.includes(sl)) {
          matched.add(cat.key);
          break;
        }
      }
    }
    // also check tags exact match
    if (poll.tags && Array.isArray(poll.tags)) {
      for (const t of poll.tags) {
        const tl = String(t).toLowerCase();
        if (tl === keyLower || tl === labelLower || (cat.synonyms || []).map(x=>x.toLowerCase()).includes(tl) || keyLower.endsWith(':'+tl)) {
          matched.add(cat.key);
        }
      }
    }
  }

  if (matched.size === 0) {
    // leave uncounted
    continue;
  }
  for (const k of matched) {
    counts.set(k, (counts.get(k) || 0) + 1);
    const arr = samples.get(k) || [];
    if (arr.length < 5) arr.push(poll.id || poll.question || JSON.stringify(poll).slice(0,40));
    samples.set(k, arr);
  }
}

// Prepare report: non-empty categories
const nonEmpty = Array.from(counts.entries()).filter(([k,v])=>v>0).map(([k,v])=>({ key:k, count:v, label: byKey.get(k)?.label || k, samples: samples.get(k) || [] }));
nonEmpty.sort((a,b)=>b.count - a.count);

console.log('Poll counts by taxonomy-derived category (non-empty only)');
console.log('Total distinct categories scanned:', finalCats.length);
console.log('Non-empty categories:', nonEmpty.length);
console.log('---');
for (const n of nonEmpty) {
  console.log(`${n.count.toString().padStart(4)}  ${n.key}  — ${n.label}`);
  if (n.samples && n.samples.length) console.log('       samples:', n.samples.join(', '));
}

// Also print top tags from registry as a quick cross-check
const tagCounts = {};
for (const p of registry) {
  if (p.tags && Array.isArray(p.tags)) for (const t of p.tags) tagCounts[t] = (tagCounts[t]||0)+1;
}
const topTags = Object.entries(tagCounts).sort((a,b)=>b[1]-a[1]).slice(0,50);
console.log('\nTop tags in registry:');
for (const [t,c] of topTags) console.log(`${c.toString().padStart(5)}  ${t}`);

process.exit(0);
