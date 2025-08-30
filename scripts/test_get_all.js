// Attempt to load compiled dist first; if missing, use ts-node to load source directly for local testing
let getAll;
try {
  // prefer compiled output
  getAll = require('../dist/src/lib/pollsStore').default.getAll;
} catch (err) {
  // fallback: register ts-node for on-the-fly TypeScript execution
  try {
    require('ts-node/register');
    getAll = require('../src/lib/pollsStore').getAll;
  } catch (e) {
    console.error('Failed to load pollsStore from dist or src. Install ts-node if you want to run this locally.');
    console.error(e);
    process.exit(2);
  }
}

(async () => {
  try {
    const data = await getAll();
    console.log('polls returned:', data.polls.length);
    const sample = data.polls.slice(0,5).map(p=>p.id);
    console.log('sample ids:', sample);
    process.exit(0);
  } catch (e) { console.error(e); process.exit(2); }
})();
