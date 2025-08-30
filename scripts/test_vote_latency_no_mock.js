const { performance } = require('perf_hooks');
let lib;
try { lib = require('../src/lib/pollsStore'); } catch (e) { console.error('failed import', e); process.exit(2); }

async function run() {
  const start = performance.now();
  const polls = await lib.getPolls();
  const t1 = performance.now();
  console.log('getPolls:', polls.length, 'time_ms:', (t1-start).toFixed(2));
  const pid = polls[0] && polls[0].id ? polls[0].id : null;
  if (!pid) { console.log('no pid'); return; }
  const option = polls[0].options && polls[0].options[0] ? polls[0].options[0] : 'Yes';
  const t0 = performance.now();
  try { await lib.vote(pid, option); } catch (e) { console.error('vote error', e && e.message); }
  const t2 = performance.now();
  console.log('vote time_ms:', (t2-t0).toFixed(2));
  const res = await lib.getResults(pid);
  const t3 = performance.now();
  console.log('getResults time_ms:', (t3-t2).toFixed(2), 'total:', res.total);
}

run().catch(e=>{ console.error(e); process.exit(1); });
