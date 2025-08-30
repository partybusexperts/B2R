const { getAll } = require('../dist/src/lib/pollsStore').default || require('../src/lib/pollsStore');
(async () => {
  try {
    const data = await getAll();
    console.log('polls returned:', data.polls.length);
    const sample = data.polls.slice(0,5).map(p=>p.id);
    console.log('sample ids:', sample);
    process.exit(0);
  } catch (e) { console.error(e); process.exit(2); }
})();
