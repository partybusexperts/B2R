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
  shuttleBuses: 'shuttle-buses'
};

type ManifestShape = Record<OptimizedCategoryKey, OptimizedImageEntry[]>;
const typedManifest = manifest as ManifestShape;

export function getCategoryImages(friendly: keyof typeof friendlyMap): OptimizedImageEntry[] {
  const key = friendlyMap[friendly];
  const arr = typedManifest[key];
  return arr ? [...arr] : [];
}

export function pickRandom(friendly: keyof typeof friendlyMap, count: number): OptimizedImageEntry[] {
  const imgs = getCategoryImages(friendly);
  if (imgs.length <= count) return imgs;
  const copy = [...imgs];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
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
