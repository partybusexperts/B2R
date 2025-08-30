const fs = require('fs');
const path = require('path');

const TS_PATH = path.join(process.cwd(), 'src', 'data', 'pollsRegistry.ts');
const OUT_PATH = path.join(process.cwd(), 'data', 'pollsRegistry.json');
const TMP_PATH = path.join(process.cwd(), 'scripts', '_tmp_registry.js');

function extractArrayText(ts) {
  const marker = 'export const POLL_REGISTRY';
  const idx = ts.indexOf(marker);
  if (idx === -1) throw new Error('POLL_REGISTRY marker not found');
  const eqIdx = ts.indexOf('=', idx);
  if (eqIdx === -1) throw new Error('= after POLL_REGISTRY not found');
  const firstBracket = ts.indexOf('[', eqIdx);
  if (firstBracket === -1) throw new Error('Opening [ not found');
  let i = firstBracket;
  let depth = 0;
  for (; i < ts.length; i++) {
    const ch = ts[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        // include the closing bracket
        return ts.slice(firstBracket, i + 1);
      }
    }
  }
  throw new Error('Matching closing ] not found');
}

async function main() {
  const ts = fs.readFileSync(TS_PATH, 'utf8');
  const arrText = extractArrayText(ts);

  // Write a temporary JS module that exports the array literal
  const tmp = `module.exports = ${arrText};\n`;
  fs.writeFileSync(TMP_PATH, tmp, 'utf8');

  // Require the temp module
  const reg = require(TMP_PATH);
  if (!Array.isArray(reg)) throw new Error('Extracted registry is not an array');

  // Filter out auto-fill entries (ids starting with autofill_)
  const filtered = reg.filter(p => !(p && typeof p.id === 'string' && /^autofill_/i.test(p.id)));

  // Ensure output dir exists
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(filtered, null, 2), 'utf8');

  // cleanup
  try { fs.unlinkSync(TMP_PATH); } catch (e) {}

  console.log('Wrote', OUT_PATH, 'entries:', filtered.length);
}

main().catch(err => {
  console.error('Failed:', err && err.message);process.exit(1);
});
