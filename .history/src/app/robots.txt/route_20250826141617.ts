import { NextResponse } from 'next/server';

export function GET() {
  const body = `User-agent: *\nAllow: /\n\nSitemap: https://www.bus2ride.com/sitemap.xml\n`;
  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=86400' } });
}