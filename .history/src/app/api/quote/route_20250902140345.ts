import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

function pickPrice(row: Record<string, unknown>, hours: number, opts: { prom?: boolean; before5?: boolean }) {
  const baseKey = `price_${hours}hr`;
  const promKey = `prom_price_${hours}hr`;
  const earlyKey = `before5pm_${hours}hr`;

  // If before 5pm and early pricing exists
  if (opts.before5 && row[earlyKey] != null) return Number(row[earlyKey]);

  // If prom and prom pricing exists
  if (opts.prom && row[promKey] != null) return Number(row[promKey]);

  // Fallback to base price
  return row[baseKey] != null ? Number(row[baseKey]) : null;
}

function isPromDate(date: Date) {
  const m = date.getUTCMonth() + 1; // JS months are 0-based
  const day = date.getUTCDay(); // 0 = Sunday, 6 = Saturday
  return (m === 3 || m === 4 || m === 5) && day === 6;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
  const zip = searchParams.get('zip') ?? '';
  const city = (searchParams.get('city') ?? '').toLowerCase();
  let hours = Number(searchParams.get('hours') ?? '4');
  const capacity = Number(searchParams.get('capacity') ?? '20');
  const dateStr = searchParams.get('date');
  const eventDate = dateStr ? new Date(dateStr) : null;

  // Defaults
  if (hours < 4) hours = 4;

  // Prom logic
  const prom = eventDate ? isPromDate(eventDate) : false;
  if (prom) {
    // if vehicle has prom pricing, force 6hr min
    if (hours < 6) hours = 6;
  }

  // Special cities (before 5pm year-round)
  const specialCities = ['grand rapids', 'kalamazoo', 'battle creek'];
  const before5 =
    eventDate && eventDate.getUTCHours() < 17 && specialCities.some(c => city.includes(c));

  // Query Supabase. If Supabase is unreachable (DNS/key/network), fall back to a small
  // in-repo mock dataset so the API remains usable for local development.
  let data: any[] | null = null;
  try {
    const res = await supabase
      .from('vehicles')
      .select('*')
      .or(`zips.ilike.%${zip}%,city.ilike.%${city}%`);
    if (res.error) {
      console.warn('Supabase returned error for vehicles:', res.error.message);
    } else {
      data = res.data as any[] | null;
    }
  } catch (e) {
    // network/DNS/etc
    console.warn('Supabase request failed:', e instanceof Error ? e.message : String(e));
  }

  // Mock fallback for local development when Supabase is not reachable or returns no rows.
  const mockVehicles = [
    {
      id: 1,
      vehicle_title: '20 Passenger Party Bus',
      city: 'Grand Rapids',
      capacity: 20,
      image_main: '/public/file.svg',
      zips: '49503,49504',
      price_4hr: 299,
      price_6hr: 399,
      prom_price_6hr: 349,
      before5pm_4hr: 249,
    },
    {
      id: 2,
      vehicle_title: '28 Passenger Minicoach',
      city: 'Grand Rapids',
      capacity: 28,
      image_main: '/public/file.svg',
      zips: '49503,49505',
      price_4hr: 349,
      price_6hr: 449,
      prom_price_6hr: 399,
      before5pm_4hr: 299,
    },
    {
      id: 3,
      vehicle_title: '40 Passenger Coach',
      city: 'Grand Rapids',
      capacity: 40,
      image_main: '/public/file.svg',
      zips: '49503,49506',
      price_4hr: 449,
      price_6hr: 549,
      prom_price_6hr: 499,
      before5pm_4hr: 399,
    },
  ];

  if (!data || data.length === 0) {
    data = mockVehicles;
  }

  // Filter by capacity
  const candidates = data.filter(v => (v.capacity ?? 0) >= capacity);

  // Compute price
  const withPrice = candidates
    .map(v => {
      const price = pickPrice(v, hours, { prom, before5: Boolean(before5) });
      return { id: v.id, title: v.vehicle_title, city: v.city, capacity: v.capacity, price, image: v.image_main };
    })
    .filter(v => v.price != null);

  // Sort & limit to top 3
  withPrice.sort((a, b) => (a.price! - b.price!));
  const top3 = withPrice.slice(0, 3);

    return NextResponse.json({ results: top3 });
  } catch (err: unknown) {
    // Return error details for local debugging
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error && err.stack ? err.stack : undefined;
    return NextResponse.json({ error: message, stack }, { status: 500 });
  }
}
