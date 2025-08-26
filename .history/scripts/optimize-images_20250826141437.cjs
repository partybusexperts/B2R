#!/usr/bin/env node
/* eslint-disable */
/**
 * Image optimization pipeline:
 *  - Scans category folders in /public/images
 *  - Skips already optimized outputs in _optimized
 *  - Generates responsive widths (480, 768, 1080, 1600) when larger than size
 *  - Produces WebP + AVIF variants
 *  - Extracts intrinsic width/height
 *  - Builds a manifest JSON with blurDataURL (base64 tiny webp) for each original logical image
 *  - Leaves originals in place; optimized variants in /public/images/_optimized/{category}/basename-w{w}.{ext}
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = process.cwd();
const imagesRoot = path.join(root, 'public', 'images');
const outRoot = path.join(imagesRoot, '_optimized');
if (!fs.existsSync(outRoot)) fs.mkdirSync(outRoot, { recursive: true });

const categories = fs.readdirSync(imagesRoot).filter(f => fs.statSync(path.join(imagesRoot, f)).isDirectory() && !f.startsWith('_'));

const RESPONSIVE_WIDTHS = [480, 768, 1080, 1600];

function isImage(f){return /\.(jpe?g|png)$/i.test(f);} // leave webp/avif generation to script

const manifest = {};

(async () => {
  for (const cat of categories) {
    const dir = path.join(imagesRoot, cat);
    const files = fs.readdirSync(dir).filter(isImage);
    const catOut = path.join(outRoot, cat);
    if (!fs.existsSync(catOut)) fs.mkdirSync(catOut, { recursive: true });

    manifest[cat] = [];

    for (const file of files) {
      try {
        const full = path.join(dir, file);
        const baseNoExt = file.replace(/\.[^.]+$/, '');
        const ext = path.extname(file).toLowerCase();

        const img = sharp(full, { failOn: 'none' });
        const meta = await img.metadata();
        const width = meta.width || 0;
        const height = meta.height || 0;

        // Create tiny blur placeholder (webp ~20px wide)
        const blur = await img
          .resize({ width: 24 })
          .webp({ quality: 50 })
          .toBuffer();
        const blurDataURL = `data:image/webp;base64,${blur.toString('base64')}`;

        const responsive = [];
        for (const target of RESPONSIVE_WIDTHS) {
          if (width && target >= width) continue; // don't upscale
          const outNameWebp = `${baseNoExt}-w${target}.webp`;
          const outNameAvif = `${baseNoExt}-w${target}.avif`;
          const outPathWebp = path.join(catOut, outNameWebp);
          const outPathAvif = path.join(catOut, outNameAvif);
          if (!fs.existsSync(outPathWebp)) {
            await img.resize({ width: target }).webp({ quality: 75 }).toFile(outPathWebp);
          }
          if (!fs.existsSync(outPathAvif)) {
            await img.resize({ width: target }).avif({ quality: 45 }).toFile(outPathAvif);
          }
          responsive.push({ width: target, webp: `/images/_optimized/${cat}/${outNameWebp}`, avif: `/images/_optimized/${cat}/${outNameAvif}` });
        }

        // Also generate full-size compressed webp + avif
        const fullWebp = `${baseNoExt}.webp`;
        const fullAvif = `${baseNoExt}.avif`;
        const fullWebpPath = path.join(catOut, fullWebp);
        const fullAvifPath = path.join(catOut, fullAvif);
        if (!fs.existsSync(fullWebpPath)) {
          await img.webp({ quality: 78 }).toFile(fullWebpPath);
        }
        if (!fs.existsSync(fullAvifPath)) {
          await img.avif({ quality: 50 }).toFile(fullAvifPath);
        }

        manifest[cat].push({
          original: `/images/${cat}/${file}`,
          width,
            height,
          formats: {
            originalExt: ext.replace('.', ''),
            full: {
              webp: `/images/_optimized/${cat}/${fullWebp}`,
              avif: `/images/_optimized/${cat}/${fullAvif}`
            },
            responsive
          },
          blurDataURL,
          alt: generateAlt(file, cat)
        });
      } catch (err) {
        console.error('Failed processing', file, err.message);
      }
    }
  }

  const manifestPath = path.join(root, 'src', 'utils', 'imageOptimizedManifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Wrote manifest with', Object.values(manifest).reduce((a, b) => a + b.length, 0), 'images');
})();

function generateAlt(filename, cat){
  const raw = filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g,' ').trim();
  // Basic tokens
  let alt = raw;
  if (!/party|limo|coach|sprinter|bus/i.test(alt)) {
    // add category keyword if missing
    alt += ` ${cat.replace(/-/g,' ')}`;
  }
  // seat count normalization
  alt = alt.replace(/(\d{1,2}) ?pass/gi, '$1 passenger');
  return alt.charAt(0).toUpperCase() + alt.slice(1);
}
