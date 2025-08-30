const fs = require('fs/promises');
const path = require('path');
const { performance } = require('perf_hooks');

const ROOT = path.resolve(__dirname, '..');
const REG = path.join(ROOT, 'data', 'pollsRegistry.json');
const VOTES = path.join(ROOT, 'data', 'polls.json');

async function measureOnce() {
  const out = {};
  let t0 = performance.now();
  const regRaw = await fs.readFile(REG, 'utf8');
  out.registryReadMs = performance.now() - t0;
  t0 = performance.now();
  const reg = JSON.parse(regRaw);
  out.registryCount = Array.isArray(reg) ? reg.length : 0;
  t0 = performance.now();
  const votesRaw = await fs.readFile(VOTES, 'utf8');
  out.votesReadMs = performance.now() - t0;
  t0 = performance.now();
  const votes = JSON.parse(votesRaw || '{}');
  out.votesKeys = Object.keys(votes.votes || {}).length;

  // write a small temp to simulate persist
  const tmp = VOTES + '.tmp';
  const payload = JSON.stringify({ votes: votes.votes || {} }, null, 2);
  t0 = performance.now();
  await fs.writeFile(tmp, payload, 'utf8');
  await fs.rename(tmp, VOTES);
  out.votesWriteMs = performance.now() - t0;
  return out;
}

(async () => {
  try {
    console.log('Measuring registry/votes filesystem operations (3 runs)');
    for (let i = 0; i < 3; i++) {
      const r = await measureOnce();
      console.log(`run ${i + 1}:`, r);
    }
  } catch (e) {
    console.error('measure error', e && e.message);
    process.exit(2);
  }
})();
