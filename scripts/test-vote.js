(async ()=>{
  try{
    const store = require('../src/lib/pollsStore');
    // choose an existing poll and option from data/polls.json
    const pollId = 'favorite_limo_color';
    const option = 'Black';
    console.log('Calling vote for', pollId, option);
    const r = await store.vote(pollId, option);
    console.log('vote response', r);
    console.log('forcing write...');
    await store.forceWrite();
    const fs = require('fs');
    const raw = fs.readFileSync(require('path').join(process.cwd(),'data','polls.json'),'utf8');
    console.log('on-disk now:', raw);
  } catch (e) {
    console.error('ERR', e);
  }
})();
