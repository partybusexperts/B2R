import { createClient } from '@supabase/supabase-js';

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// admin client used only server-side; DO NOT expose SUPABASE_SERVICE_ROLE_KEY to clients
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

async function makeImageUrl(pathOrKey) {
  if (!pathOrKey) return null;

  // already a full URL
  if (pathOrKey.startsWith('http://') || pathOrKey.startsWith('https://')) return pathOrKey;

  // site-local path (starts with '/'): served from Next public/
  if (pathOrKey.startsWith('/')) return pathOrKey;

  // else assume it's a storage key like "bucket/obj.jpg" or "obj.jpg"
  if (!supabaseAdmin) {
    // no admin client available — return the raw key (fallback)
    return pathOrKey;
  }

  // attempt to split into bucket/object (heuristic)
  const parts = pathOrKey.split('/');
  let bucket = parts.length > 1 ? parts.shift() : 'public';
  const object = parts.join('/');

  try {
    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(object, 60 * 60); // 1 hour
    if (error) {
      console.error('createSignedUrl error', error);
      return pathOrKey;
    }
    // supabase returns { signedUrl }
    return data?.signedUrl ?? pathOrKey;
  } catch (err) {
    console.error('makeImageUrl error', err);
    return pathOrKey;
  }
}

async function extractOne(rows) {
  if (!rows || rows.length === 0) return null;
  const row = rows[0];
  const heroData = row.data ?? null;
  if (!heroData) return null;
  const image_url = await makeImageUrl(heroData.image_path || heroData.storage_path || heroData.image);
  return { ...heroData, image_url };
}

/**
 * Return hero.data object matching pageSlug/citySlug/vehicleType with priority:
 * 1) city + vehicle, 2) city only, 3) global
 *
 * Returns { ...heroData, image_url } or null
 */
export async function getHeroForPage({ pageSlug = 'home', citySlug = null, vehicleType = null }) {
  let cityId = null;
  if (citySlug) {
    const { data: cities } = await supabasePublic.from('cities111').select('id').eq('slug', citySlug).limit(1);
    cityId = cities?.[0]?.id ?? null;
  }

  // 1) city + vehicle
  if (cityId && vehicleType) {
    const { data } = await supabasePublic
      .from('heroes1')
      .select('data')
      .eq('page_slug', pageSlug)
      .eq('is_active', true)
      .eq('city_id', cityId)
      .eq('vehicle_type', vehicleType)
      .limit(1);
    const out = await extractOne(data);
    if (out) return out;
  }

  // 2) city only
  if (cityId) {
    const { data } = await supabasePublic
      .from('heroes1')
      .select('data')
      .eq('page_slug', pageSlug)
      .eq('is_active', true)
      .eq('city_id', cityId)
      .is('vehicle_type', null)
      .order('updated_at', { ascending: false })
      .limit(1);
    const out = await extractOne(data);
    if (out) return out;
  }

  // 3) global
  const { data } = await supabasePublic
    .from('heroes1')
    .select('data')
    .eq('page_slug', pageSlug)
    .eq('is_active', true)
    .is('city_id', null)
    .is('vehicle_type', null)
    .order('updated_at', { ascending: false })
    .limit(1);

  return await extractOne(data);
}
