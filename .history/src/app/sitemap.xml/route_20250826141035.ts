import { NextRequest, NextResponse } from 'next/server';
import manifest from '@/utils/imageOptimizedManifest.json';

const site = 'https://www.bus2ride.com';

interface ImageEntry { loc: string; title?: string }
interface UrlNode { loc: string; lastmod?: string; images?: ImageEntry[] }

function collectImages(): ImageEntry[] {
  const out: ImageEntry[] = [];
  Object.values(manifest).forEach((arr: any) => {
    if (Array.isArray(arr)) {
      arr.slice(0, 6).forEach(img => {
        out.push({ loc: site + img.original, title: img.alt });
      });
    }
  });
  return out;
}

function build(): string {
  const urls: UrlNode[] = [
    { loc: site + '/', images: collectImages().slice(0, 12) },
    { loc: site + '/party-buses' },
    { loc: site + '/limousines' },
    { loc: site + '/coach-buses' },
    { loc: site + '/pricing' },
    { loc: site + '/events' }
  ];
  const lastmod = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
  urls.map(u => {
    return `<url><loc>${u.loc}</loc><lastmod>${u.lastmod || lastmod}</lastmod>` +
      (u.images ? u.images.map(img => `<image:image><image:loc>${img.loc}</image:loc>${img.title ? `<image:title>${img.title}</image:title>` : ''}</image:image>`).join('') : '') +
      `</url>`;
  }).join('') + `</urlset>`;
  return xml;
}

export function GET(_req: NextRequest) {
  const xml = build();
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' } });
}