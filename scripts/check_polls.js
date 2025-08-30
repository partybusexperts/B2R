(async () => {
  try {
    const res = await fetch('http://localhost:3005/api/poll/all');
    const txt = await res.text();
    let json;
    try { json = JSON.parse(txt); } catch(e) { console.error('Failed to parse JSON:', e); console.log('Raw:', txt.slice(0, 2000)); process.exit(1); }
    const polls = json.polls || [];
    const votes = json.votes || {};
    console.log('polls:', polls.length);
    console.log('votes keys:', Object.keys(votes).length);
    console.log('sample ids:', polls.slice(0, 20).map(p => p.id).join(', '));
    const autofill = polls.filter(p => /^autofill_/i.test(p.id) || (/^auto-?fill poll/i.test(p.question || '')));
    console.log('autofill count in returned polls:', autofill.length);
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(2);
  }
})();
