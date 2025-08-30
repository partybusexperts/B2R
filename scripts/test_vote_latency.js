const { performance } = require('perf_hooks');
const store = require('../.next/server/app/api/__mocks__/pollsStore') || null;
// If the project isn't built, fall back to importing the TS lib directly
let lib;
try { lib = require('../src/lib/pollsStore'); } catch (e) { lib = require('../src/lib/pollsStore'); }

async function run() {
  const start = performance.now();
  // call getAll
  const all = await lib.getAll();
  const t1 = performance.now();
  console.log('getAll polls:', all.polls.length, 'time_ms:', (t1-start).toFixed(2));
  const pid = all.polls[0] && all.polls[0].id ? all.polls[0].id : 'pricing-factor';
  const option = all.polls[0] && all.polls[0].options && all.polls[0].options[0] ? all.polls[0].options[0] : 'Yes';
  const t0 = performance.now();
  await lib.vote(pid, option);
  const t2 = performance.now();
  console.log('vote time_ms:', (t2-t0).toFixed(2));
  const res = await lib.getResults(pid);
  const t3 = performance.now();
  console.log('getResults time_ms:', (t3-t2).toFixed(2), 'total:', res.total);
}

run().catch(e=>{ console.error(e); process.exit(1); });
