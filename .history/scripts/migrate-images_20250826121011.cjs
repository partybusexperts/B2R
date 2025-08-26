#!/usr/bin/env node
/* eslint-disable */
/*
 * One-time helper: move existing flat /public/images files into category subfolders.
 * It only moves files that currently sit in /public/images root and match known names in the catalog.
 * Safe: will skip if target already exists.
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const publicDir = path.join(root, 'public', 'images');

// Category mapping heuristics
const patterns = [
  { cat: 'party-buses', includes: ['Party Bus', 'Bus-'] },
  { cat: 'limousines', includes: ['Limo', 'Limousine', 'Escalade', 'Hummer', 'Excursion', 'Chrysler'] },
  { cat: 'coach-buses', includes: ['Coach', 'bus-none', 'Bus-None', 'Bus-None'] },
  { cat: 'sprinters', includes: ['Sprinter'] },
];

function classify(name) {
  for (const p of patterns) {
    if (p.includes.some(str => name.toLowerCase().includes(str.toLowerCase()))) {
      return p.cat;
    }
  }
  return null;
}

const entries = fs.readdirSync(publicDir).filter(f => fs.statSync(path.join(publicDir, f)).isFile());

for (const file of entries) {
  const category = classify(file);
  if (!category) continue;
  const targetDir = path.join(publicDir, category);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const from = path.join(publicDir, file);
  const to = path.join(targetDir, file);
  if (fs.existsSync(to)) {
    console.log('skip exists:', to);
    continue;
  }
  fs.renameSync(from, to);
  console.log('moved', file, '->', category);
}

console.log('Migration complete. Update imageCatalog.ts file paths if needed.');
