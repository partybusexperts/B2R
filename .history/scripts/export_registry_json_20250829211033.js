// ESM script: Exports the polls registry to data/pollsRegistry.json for faster server-side loads.
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsPath = path.join(__dirname, '..', 'src', 'data', 'pollsRegistry.ts');
if (!fs.existsSync(tsPath)) {
  console.error('Registry TS file not found at', tsPath);
  process.exit(1);
}

const raw = fs.readFileSync(tsPath, 'utf8');
const marker = 'POLL_REGISTRY';
const idx = raw.indexOf(marker);
if (idx === -1) {
  console.error('Could not find', marker, 'in', tsPath);
  process.exit(1);
}

// Find first '[' after marker and extract a balanced array literal
const arrStart = raw.indexOf('[', idx);
if (arrStart === -1) {
  console.error('Could not find array start after', marker);
  process.exit(1);
}

let i = arrStart;
let depth = 0;
let inString = false;
let stringChar = '';
let escaped = false;
for (; i < raw.length; i++) {
  const ch = raw[i];
  if (inString) {
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === stringChar) { inString = false; stringChar = ''; continue; }
    continue;
  }
  if (ch === '"' || ch === "'" || ch === '`') { inString = true; stringChar = ch; continue; }
  if (ch === '[') { depth++; }
  else if (ch === ']') { depth--; if (depth === 0) { i++; break; } }
}

if (depth !== 0) {
  console.error('Unbalanced brackets while extracting registry array');
  process.exit(1);
}

const arrText = raw.slice(arrStart, i);

// Try to parse the array text. First attempt: run in a VM to evaluate into JS safely.
let polls;
try {
  const script = new vm.Script('(' + arrText + ')');
  const context = vm.createContext({});
  polls = script.runInContext(context);
} catch (e) {
  // Fallback: crude JSON-ish cleanup
  let jsonText = arrText.replace(/\/\/(.*)$/gm, ''); // remove single-line comments
  jsonText = jsonText.replace(/\n/g, ' ');
  jsonText = jsonText.replace(/,\s*\]/g, ']');
  jsonText = jsonText.replace(/,\s*\}/g, '}');
  jsonText = jsonText.replace(/'/g, '"');
  try {
    polls = JSON.parse(jsonText);
  } catch (e2) {
    console.error('Failed to parse registry array via VM and JSON fallback:', e2.message);
    process.exit(1);
  }
}

const outPath = path.join(__dirname, '..', 'data', 'pollsRegistry.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(polls, null, 2), 'utf8');
console.log('Written', outPath, 'with', Array.isArray(polls) ? polls.length : 'unknown', 'items');
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
