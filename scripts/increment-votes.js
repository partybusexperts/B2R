const fs = require('fs');
const path = require('path');
const p = path.join(process.cwd(), 'data', 'polls.json');
if (!fs.existsSync(p)) {
  console.error('data/polls.json not found');
  process.exit(1);
}
const raw = fs.readFileSync(p, 'utf8');
let json = {};
try { json = JSON.parse(raw || '{}'); } catch (e) { console.error('parse error', e); process.exit(2); }
json.votes = json.votes || {};
let changed = false;
for (const id of Object.keys(json.votes)) {
  const opts = json.votes[id] || {};
  for (const opt of Object.keys(opts)) {
    opts[opt] = (Number(opts[opt] || 0) + 1);
    changed = true;
  }
  json.votes[id] = opts;
}
if (changed) {
  fs.writeFileSync(p + '.tmp', JSON.stringify(json, null, 2), 'utf8');
  fs.renameSync(p + '.tmp', p);
  console.log('Incremented votes for', Object.keys(json.votes).length, 'poll(s)');
} else {
  console.log('No votes found to increment');
}
