const fs = require('fs');
const path = require('path');
const p = path.join(process.cwd(), 'data', 'polls.json');
if (!fs.existsSync(p)) { console.error('no file'); process.exit(1); }
const raw = fs.readFileSync(p, 'utf8');
const json = JSON.parse(raw || '{}');
json.votes = json.votes || {};
const pollId = 'favorite_limo_color';
const option = 'Black';
if (!json.votes[pollId]) json.votes[pollId] = {};
json.votes[pollId][option] = (json.votes[pollId][option] || 0) + 1;
fs.writeFileSync(p + '.tmp', JSON.stringify(json, null, 2), 'utf8');
fs.renameSync(p + '.tmp', p);
console.log('wrote');
console.log(fs.readFileSync(p,'utf8'));
