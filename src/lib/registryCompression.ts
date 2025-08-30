// Ultra-fast compressed registry cache
import zlib from 'node:zlib';
import { promisify } from 'node:util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// Global compressed cache
let compressedRegistryCache: Buffer | null = null;
let lastRegistryCompress = 0;
const COMPRESS_INTERVAL_MS = 300_000; // 5 minutes

export async function getCompressedRegistry(): Promise<Buffer> {
  const now = Date.now();
  
  if (compressedRegistryCache && (now - lastRegistryCompress) < COMPRESS_INTERVAL_MS) {
    return compressedRegistryCache;
  }
  
  // Re-compress registry
  try {
    const { getAll } = await import('./pollsStore');
    const polls = await getAll();
    const jsonString = JSON.stringify(polls);
    
    compressedRegistryCache = await gzip(jsonString);
    lastRegistryCompress = now;
    
    console.log(`Registry compressed: ${jsonString.length} -> ${compressedRegistryCache.length} bytes`);
    return compressedRegistryCache;
  } catch (err) {
    console.error('Registry compression failed:', err);
    // Fallback to empty array
    compressedRegistryCache = await gzip('[]');
    return compressedRegistryCache;
  }
}

export async function decompressRegistry(compressed: Buffer): Promise<any[]> {
  try {
    const decompressed = await gunzip(compressed);
    return JSON.parse(decompressed.toString());
  } catch (err) {
    console.error('Registry decompression failed:', err);
    return [];
  }
}
