import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

function pickPrice(row: any, hours: number, opts: { prom?: boolean; before5?: boolean }) {
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
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get('zip') ?? '';
  const city = (searchParams.get('city') ?? '').toLowerCase();
  let hours = Number(searchParams.get('hours') ?? '4');
  let capacity = Number(searchParams.get('capacity') ?? '20');
  const dateStr = searchParams.get('date');
  let eventDate = dateStr ? new Date(dateStr) : null;

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

  // Query Supabase
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .or(`zips.ilike.%${zip}%,city.ilike.%${city}%`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Filter by capacity
  const candidates = data.filter(v => (v.capacity ?? 0) >= capacity);

  // Compute price
  const withPrice = candidates
    .map(v => {
      const price = pickPrice(v, hours, { prom, before5 });
      return { id: v.id, title: v.vehicle_title, city: v.city, capacity: v.capacity, price, image: v.image_main };
    })
    .filter(v => v.price != null);

  // Sort & limit to top 3
  withPrice.sort((a, b) => (a.price! - b.price!));
  const top3 = withPrice.slice(0, 3);

  return NextResponse.json({ results: top3 });
}
