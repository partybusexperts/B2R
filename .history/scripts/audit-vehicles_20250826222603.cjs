#!/usr/bin/env node
/* Quick audit: duplicate IDs, missing manifest matches, missing primary */
const fs = require('fs');
const path = require('path');
const vehiclesFile = path.join(__dirname,'..','src','data','vehicles.ts');
const manifestFile = path.join(__dirname,'..','src','utils','imageOptimizedManifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestFile,'utf8'));
const manifestIndex = new Map();
for (const [cat, arr] of Object.entries(manifest)) {
  for (const e of arr) {
    manifestIndex.set(e.original.split('/').pop(), e);
  }
}
const src = fs.readFileSync(vehiclesFile,'utf8');
// naive parse of VEHICLES array entries
const vehicleBlocks = src.split(/\{\s*id:\s*'/).slice(1).map(b=>"{"+b);
const ids = new Map();
let dupIds = []; let missingImages = []; let noPrimary = [];
for (const block of vehicleBlocks){
  const idMatch = block.match(/id:\s*'([^']+)'/);
  if(!idMatch) continue;
  const id = idMatch[1];
  if(ids.has(id)) dupIds.push(id); else ids.set(id,true);
  // collect images
  const imageSectionMatch = block.match(/images:\s*\[(.*?)\]/s);
  if(imageSectionMatch){
    const files = [...imageSectionMatch[1].matchAll(/file:\s*'([^']+)'/g)].map(m=>m[1]);
    for (const f of files){
      if(!manifestIndex.has(f)) missingImages.push({id,file:f});
    }
    const hasPrimary = /primary:\s*true/.test(imageSectionMatch[1]);
    if(!hasPrimary) noPrimary.push(id);
  }
}
console.log('Duplicate IDs:', dupIds);
console.log('Missing image filenames (not in manifest):', missingImages);
console.log('Vehicles without an explicit primary (will fallback to first exterior):', noPrimary);
