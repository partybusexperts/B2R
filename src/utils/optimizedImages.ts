import manifest from './imageOptimizedManifest.json';

// Types matching optimize-images.cjs output
export interface OptimizedVariant {
  width: number;
  webp: string;
  avif: string;
}
export interface OptimizedImageEntry {
  original: string;
  width: number;
  height: number;
  formats: {
    originalExt: string;
    full: { webp: string; avif: string };
    responsive: OptimizedVariant[];
  };
  blurDataURL: string;
  alt: string;
}

export type OptimizedCategoryKey = keyof typeof manifest; // folder names

// Friendly enum mapping (existing app categories) -> manifest folder keys
const friendlyMap: Record<string, OptimizedCategoryKey> = {
  partyBuses: 'party-buses',
  limousines: 'limousines',
  coachBuses: 'coach-buses',
  sprinterLimoStyle: 'sprinter-limo-style',
  executiveSprinters: 'executive-sprinters',
  shuttleBuses: 'shuttle-buses',
  eventImages: 'events'
};


type ManifestShape = Record<OptimizedCategoryKey | 'event-images', OptimizedImageEntry[]>;
const typedManifest = manifest as ManifestShape;

export function getCategoryImages(friendly: keyof typeof friendlyMap): OptimizedImageEntry[] {
  const key = friendlyMap[friendly];
  const arr = typedManifest[key];
  return arr ? [...arr] : [];
}

// Simple seeded RNG (xorshift32) for deterministic picks when a seed is provided.
function seedFromString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h || 1;
}
function seededRandom(seed: number) {
  // xorshift32
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 0xffffffff;
  };
}

export function pickRandom(friendly: keyof typeof friendlyMap, count: number, deterministicSeed?: string): OptimizedImageEntry[] {
  const imgs = getCategoryImages(friendly);
  if (imgs.length <= count) return imgs;
  const copy = [...imgs];
  // If a deterministicSeed is provided, use a seeded RNG so server renders are stable.
  const rand = deterministicSeed ? seededRandom(seedFromString(deterministicSeed)) : Math.random;
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export function heroSet(friendly: keyof typeof friendlyMap, max = 5): OptimizedImageEntry[] {
  const imgs = getCategoryImages(friendly)
    .sort((a, b) => b.width * b.height - a.width * a.height); // prefer larger resolution first
  return imgs.slice(0, max);
}

export function getFirst(friendly: keyof typeof friendlyMap): OptimizedImageEntry | undefined {
  const imgs = getCategoryImages(friendly);
  return imgs[0];
}

export function bestSrc(entry: OptimizedImageEntry): string {
  // Use full webp (browser fallback handled by Next if using original) - keep original for older browsers.
  return entry.formats.full.webp || entry.original;
}

export function srcSet(entry: OptimizedImageEntry): { sizes: string; srcSetWebp: string; srcSetAvif: string } {
  const variants = [...entry.formats.responsive].sort((a, b) => a.width - b.width);
  const srcSetWebp = variants.map(v => `${v.webp} ${v.width}w`).join(', ');
  const srcSetAvif = variants.map(v => `${v.avif} ${v.width}w`).join(', ');
  const sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  return { sizes, srcSetWebp, srcSetAvif };
}

// Structured data helper
export interface ImageObjectSchema {
  '@type': 'ImageObject';
  contentUrl: string;
  caption: string;
  width: number;
  height: number;
}

export function toImageObject(entry: OptimizedImageEntry): ImageObjectSchema {
  return {
    '@type': 'ImageObject',
    contentUrl: entry.original,
    caption: entry.alt,
    width: entry.width,
    height: entry.height
  };
}

// Generic lookup by filename (case-insensitive endsWith match) across all categories
export function findByFileName(fileName: string): OptimizedImageEntry | undefined {
  const lower = fileName.toLowerCase();
  for (const key of Object.keys(typedManifest) as OptimizedCategoryKey[]) {
    const found = typedManifest[key].find(e => e.original.toLowerCase().endsWith('/' + lower) || e.original.toLowerCase().endsWith(lower));
    if (found) return found;
  }
  return undefined;
}

// --- Automatic guard helpers ---
function categoryFromEntry(entry: OptimizedImageEntry): OptimizedCategoryKey | undefined {
  // original path like /images/party-buses/filename.png
  const parts = entry.original.split('/').filter(Boolean); // [images, party-buses, file]
  const folder = parts[1];
  if (!folder) return undefined;
  return (Object.keys(typedManifest) as OptimizedCategoryKey[]).find(k => k === folder);
}

export function ensureMinWidthEntry(entry: OptimizedImageEntry, minWidth = 800): OptimizedImageEntry {
  if (entry.width >= minWidth) return entry;
  const cat = categoryFromEntry(entry);
  if (!cat) return entry;
  const candidates = [...typedManifest[cat]].sort((a,b)=>b.width-a.width);
  const found = candidates.find(c => c.width >= minWidth);
  return found || candidates[0] || entry;
}
