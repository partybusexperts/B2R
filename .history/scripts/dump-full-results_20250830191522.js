const fs = require('fs');
const path = require('path');
const regPath = path.join(process.cwd(), 'data', 'pollsRegistry.json');
const votesPath = path.join(process.cwd(), 'data', 'polls.json');
const outPath = path.join(process.cwd(), 'data', 'full-poll-results.json');
function readJson(p){ if(!fs.existsSync(p)) return null; try{ return JSON.parse(fs.readFileSync(p,'utf8')||'{}'); }catch(e){ return null; }}
const registry = readJson(regPath) || [];
const votesFile = readJson(votesPath) || { votes: {} };
const votes = votesFile.votes || {};
const out = {};
for(const item of registry){
  const id = String(item.id ?? '').trim();
  if(!id) continue;
  out[id] = votes[id] || {};
}
// include any voted ids missing in registry
for(const id of Object.keys(votes)){
  if(!out[id]) out[id] = votes[id];
}
fs.writeFileSync(outPath, JSON.stringify({ polls: Object.keys(out).length, results: out }, null, 2), 'utf8');
console.log('Wrote', outPath, 'with', Object.keys(out).length, 'polls');
