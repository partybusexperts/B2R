/**
 * Ultra-aggressive performance optimizations
 * This implements the most extreme performance improvements for the poll system
 */

// 1. Precompute all polls data as static JSON
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { promisify } from 'node:util';

const gzip = promisify(zlib.gzip);
const deflate = promisify(zlib.deflate);

async function generateStaticAssets() {
  console.log('🚀 Generating ultra-fast static assets...');
  
  try {
    // Load registry
    const registryPath = path.join(process.cwd(), 'data', 'pollsRegistry.json');
    const registryData = await fs.readFile(registryPath, 'utf8');
    const polls = JSON.parse(registryData);
    
    console.log(`📊 Processing ${polls.length} polls...`);
    
    // Generate multiple compressed formats for different use cases
    const formats = [
      { name: 'gzip', compress: gzip, ext: '.gz' },
      { name: 'deflate', compress: deflate, ext: '.deflate' }
    ];
    
    for (const format of formats) {
      const compressed = await format.compress(registryData);
      const outputPath = path.join(process.cwd(), 'public', `polls.json${format.ext}`);
      await fs.writeFile(outputPath, compressed);
      
      const savings = ((registryData.length - compressed.length) / registryData.length * 100);
      console.log(`✅ ${format.name}: ${registryData.length} → ${compressed.length} bytes (${savings.toFixed(1)}% savings)`);
    }
    
    // Generate tag-specific bundles for faster filtering
    const pollsByTag = new Map();
    polls.forEach(poll => {
      (poll.tags || []).forEach(tag => {
        if (!pollsByTag.has(tag)) {
          pollsByTag.set(tag, []);
        }
        pollsByTag.get(tag).push(poll);
      });
    });
    
    // Create optimized tag bundles
    for (const [tag, tagPolls] of pollsByTag.entries()) {
      if (tagPolls.length >= 5) { // Only bundle tags with enough polls
        const tagData = JSON.stringify(tagPolls);
        const compressed = await gzip(tagData);
        const tagPath = path.join(process.cwd(), 'public', 'polls', `${tag}.json.gz`);
        
        // Ensure directory exists
        await fs.mkdir(path.dirname(tagPath), { recursive: true });
        await fs.writeFile(tagPath, compressed);
        
        console.log(`📦 Tag "${tag}": ${tagPolls.length} polls → ${compressed.length} bytes`);
      }
    }
    
    // Generate manifest for client-side routing
    const manifest = {
      totalPolls: polls.length,
      tags: Array.from(pollsByTag.keys()).filter(tag => pollsByTag.get(tag).length >= 5),
      lastUpdated: new Date().toISOString(),
      formats: ['gzip', 'deflate'],
      endpoints: {
        all: '/polls.json.gz',
        byTag: (tag) => `/polls/${tag}.json.gz`
      }
    };
    
    const manifestPath = path.join(process.cwd(), 'public', 'polls.manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log('✅ Static assets generated successfully');
    console.log(`📦 Total tags with bundles: ${manifest.tags.length}`);
    
  } catch (error) {
    console.error('❌ Failed to generate static assets:', error);
    process.exit(1);
  }
}

// 2. Generate service worker for aggressive caching
async function generateServiceWorker() {
  const swContent = `
// Ultra-aggressive caching service worker for poll system
const CACHE_NAME = 'polls-v1';
const STATIC_CACHE = 'static-v1';

const POLL_ENDPOINTS = [
  '/api/poll/all',
  '/api/poll',
  '/polls.json.gz',
  '/polls.manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => 
        cache.addAll([
          '/',
          '/polls',
          '/poll-results',
          '/_next/static/css/',
          '/_next/static/js/'
        ])
      ),
      caches.open(CACHE_NAME).then(cache => 
        cache.addAll(POLL_ENDPOINTS)
      )
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache poll API responses with stale-while-revalidate
  if (url.pathname.startsWith('/api/poll')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            // Return cached response immediately
            const fetchPromise = fetch(event.request).then(fetchResponse => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
            
            // Update cache in background
            event.waitUntil(fetchPromise);
            return response;
          }
          
          // No cache, fetch and cache
          return fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }
  
  // Standard network-first for other requests
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
`;
  
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  await fs.writeFile(swPath, swContent.trim());
  console.log('✅ Service worker generated');
}

// Run optimizations
async function runOptimizations() {
  console.log('🏎️  ULTRA-PERFORMANCE MODE ACTIVATED\n');
  
  await generateStaticAssets();
  await generateServiceWorker();
  
  console.log('\n🎯 Performance optimizations complete!');
  console.log('Next steps:');
  console.log('1. Deploy static assets to CDN');
  console.log('2. Enable service worker in production');
  console.log('3. Configure edge caching headers');
}

if (require.main === module) {
  runOptimizations().catch(console.error);
}

module.exports = { generateStaticAssets, generateServiceWorker };
