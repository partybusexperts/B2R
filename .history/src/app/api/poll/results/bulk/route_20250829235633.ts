import { NextResponse } from 'next/server';
import { getResults } from '@/lib/pollsStore';

export const dynamic = 'force-dynamic';

// In-memory cache for bulk results
type BulkResultData = Record<string, { results: Record<string, number>; total: number }>;
const bulkCache = new Map<string, { data: BulkResultData; timestamp: number }>();
const CACHE_TTL_MS = 15_000; // 15 seconds for faster vote updates

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ids: string[] = Array.isArray(body && body.ids) ? body.ids : [];
    
    // Generate cache key from sorted IDs
    const cacheKey = ids.slice().sort().join(',');
    const cached = bulkCache.get(cacheKey);
    const now = Date.now();
    
    // Return cached if fresh
    if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
      const res = NextResponse.json({ data: cached.data }, { status: 200 });
      res.headers.set('Cache-Control', 'private, max-age=15, must-revalidate');
      res.headers.set('X-Cache', 'HIT');
      return res;
    }
    
    // Fetch fresh results with parallel processing
    const out: BulkResultData = {};
    
    // Process in batches of 10 for better performance
    const batchSize = 10;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (id) => {
          try {
            const r = await getResults(id);
            out[id] = { results: r.results || {}, total: r.total || 0 };
          } catch {
            out[id] = { results: {}, total: 0 };
          }
        })
      );
    }
    
    // Update cache
    bulkCache.set(cacheKey, { data: out, timestamp: now });
    
    // Clean cache periodically
    if (bulkCache.size > 100) {
      const entries = Array.from(bulkCache.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      bulkCache.clear();
      entries.slice(0, 50).forEach(([key, value]) => {
        bulkCache.set(key, value);
      });
    }
    
    const res = NextResponse.json({ data: out }, { status: 200 });
    res.headers.set('Cache-Control', 'private, max-age=15, must-revalidate');
    res.headers.set('X-Cache', 'MISS');
    return res;
  } catch (err) {
    console.error('Bulk results error:', err);
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
