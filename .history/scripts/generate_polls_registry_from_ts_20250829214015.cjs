const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src', 'data', 'pollsRegistry.ts');
const outDir = path.join(root, 'data');
const out = path.join(outDir, 'pollsRegistry.json');

function main() {
  if (!fs.existsSync(src)) {
    console.error('Source file not found:', src);
    process.exit(2);
  }

  const txt = fs.readFileSync(src, 'utf8');

  const marker = 'export const POLL_REGISTRY';
  const i = txt.indexOf(marker);
  if (i === -1) {
    console.error('POLL_REGISTRY marker not found');
    process.exit(3);
  }

  // find the first '[' after the marker
  const startBracket = txt.indexOf('[', i);
  const endMarker = '];';
  const endIndex = txt.indexOf(endMarker, startBracket);
  if (startBracket === -1 || endIndex === -1) {
    console.error('Could not locate array bounds');
    process.exit(4);
  }

  const arrayText = txt.slice(startBracket, endIndex + 1); // include closing ']'

  // Evaluate the array literal in a safe VM context
  const sandbox = {};
  try {
    const script = new vm.Script('result = ' + arrayText);
    const context = vm.createContext(sandbox);
    script.runInContext(context, { timeout: 5000 });
  } catch (err) {
    console.error('VM evaluation failed:', err && err.message);
    process.exit(5);
  }

  const arr = sandbox.result;
  if (!Array.isArray(arr)) {
    console.error('Evaluated value is not an array');
    process.exit(6);
  }

  const filtered = arr.filter((p) => {
    if (!p || typeof p.id !== 'string') return false;
    return !p.id.startsWith('autofill_');
  });

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(out, JSON.stringify(filtered, null, 2), 'utf8');

  console.log('Wrote', out, 'entries:', filtered.length);
}

main();
