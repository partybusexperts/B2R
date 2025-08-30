const fs = require('fs');
const path = require('path');
const tsPath = path.join(__dirname, '..', 'src', 'data', 'pollsRegistry.ts');
const outPath = path.join(__dirname, '..', 'data', 'pollsRegistry.json');
const raw = fs.readFileSync(tsPath, 'utf8');
const start = raw.indexOf('export const POLL_REGISTRY');
if (start === -1) {
  console.error('POLL_REGISTRY not found');
  process.exit(1);
}
const arrStart = raw.indexOf('[', start);
const arrEnd = raw.lastIndexOf(']');
const arrText = raw.slice(arrStart, arrEnd + 1);
// crude but workable: replace single quotes with double, remove trailing commas
let jsonText = arrText.replace(/([\n\r])\s*([\]}])/g, '$1$2');
jsonText = jsonText.replace(/([\s\S])\,\s*\]/g, ']' );
// Replace TS-style trailing commas in objects by safe JSON using a simple regex
jsonText = jsonText.replace(/\,\s*\}/g, '}');
// Replace single quotes with double quotes (may fail if strings contain single quotes)
jsonText = jsonText.replace(/'/g, '"');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, jsonText, 'utf8');
console.log('Written', outPath);
