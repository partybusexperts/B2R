#!/usr/bin/env node
/* eslint-disable */
/*
 * Validates that all image paths referenced in src/utils/imageCatalog.ts exist on disk.
 * Run: npm run validate:images
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const catalogFile = path.join(root, 'src', 'utils', 'imageCatalog.ts');

const content = fs.readFileSync(catalogFile, 'utf8');
const regex = /file:\s*"(.*?)"/g;
let match;
const missing = [];
const seen = new Set();
while ((match = regex.exec(content)) !== null) {
  const rel = match[1];
  if (seen.has(rel)) continue;
  seen.add(rel);
  const cleaned = rel.startsWith('/') ? rel.slice(1) : rel; // strip leading forward slash
  const diskPath = path.join(root, 'public', cleaned.replace(/\\/g, '/'));
  if (!fs.existsSync(diskPath)) {
    missing.push(rel);
  }
}
if (missing.length) {
  console.error(`Missing ${missing.length} image(s):`);
  for (const m of missing) console.error('  -', m);
  process.exitCode = 1;
} else {
  console.log('All catalog images exist.');
}
