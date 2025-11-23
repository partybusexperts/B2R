// app/city/anchorage/vehicle/charter-bus/page.jsx
import { createClient } from '@supabase/supabase-js';
import PollList from '../../../../../components/PollList';
import Gallery from '../../../../../components/Gallery';
import Amenities from '../../../../../components/Amenities';
import ContentBlocks from '../../../../../components/ContentBlocks';
import CTA from '../../../../../components/CTA';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const revalidate = 600;

export async function generateMetadata() {
  const { data: cityRows } = await supabase.from('cities111').select('name').eq('slug', 'anchorage').limit(1);
  const city = cityRows?.[0] ?? null;

  const title = `${city?.name || 'Anchorage'} Charter Bus Rentals — Bus2Ride`;
  const description = `Charter buses in ${city?.name || 'Anchorage'}. Compare vehicles, photos, and get a custom quote.`;

  return {
    title,
    description,
  };
}

async function fetchData() {
  const { data: cityRows } = await supabase.from('cities111').select('*').eq('slug', 'anchorage').limit(1);
  const city = cityRows?.[0] ?? null;

  let vehiclesList = [];
  if (city?.id) {
    const { data: veh } = await supabase
      .from('vehicles11')
      .select('id,name,capacity,type,amenities,storage_path,city_id')
      .eq('city_id', city.id)
      .ilike('type', '%charter%')
      .order('name', { ascending: true });
    vehiclesList = veh || [];
  }

  const { data: images } = await supabase
    .from('images111')
    .select('*')
    .eq('city_id', city?.id ?? null)
    .eq('vehicle_type', 'charter-bus');

  const { data: polls } = await supabase
    .from('polls1')
    .select('*')
    .eq('category_slug', 'anchorage-municipality-ak')
    .order('created_at', { ascending: false });

  const pollIds = (polls || []).map(p => p.id);
  const { data: options } = pollIds.length ? await supabase.from('poll_options1').select('*').in('poll_id', pollIds) : { data: [] };

  const { data: blocks } = await supabase
    .from('content_blocks111')
    .select('*')
    .eq('city_id', city?.id ?? null)
    .eq('vehicle_type', 'charter-bus')
    .order('position');

  const { data: amenities } = await supabase
    .from('amenities111')
    .select('*')
    .eq('city_id', city?.id ?? null)
    .eq('vehicle_type', 'charter-bus');

  return { city, vehiclesList, images: images || [], polls: polls || [], options: options || [], blocks: blocks || [], amenities: amenities || [] };
}

export default async function AnchorageCharterBus() {
  const { city, vehiclesList, images, polls, options, blocks, amenities } = await fetchData();

  return (
    <>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <header>
          <h1>Charter Buses in {city?.name || 'Anchorage'}</h1>
          <p>Group transport for tours, school trips, and corporate events — get a quote.</p>
        </header>

        <section style={{ marginTop: 20 }}>
          <Gallery images={images} />
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>Available Vehicles</h2>
          {vehiclesList.length === 0 ? <p>No charter buses found for Anchorage yet.</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
              {vehiclesList.map(v => (
                <article key={v.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                  <h3>{v.name}</h3>
                  <p><strong>Type:</strong> {v.type}</p>
                  <p><strong>Capacity:</strong> {v.capacity}</p>
                  <p>{Array.isArray(v.amenities) ? v.amenities.join(', ') : v.amenities}</p>
                  <a href={`/get-quote?city=${city?.slug}&vehicle=charter-bus&vehicle_id=${v.id}`} className="btn">Get quote</a>
                </article>
              ))}
            </div>
          )}
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>Local Polls</h2>
          <PollList polls={polls} options={options} />
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>More information</h2>
          <ContentBlocks blocks={blocks} />
        </section>

        <section style={{ marginTop: 24 }}>
          <Amenities items={amenities} />
        </section>

        <section style={{ marginTop: 32 }}>
          <CTA phone="+1-800-555-1212" />
        </section>
      </main>
    </>
  );
}
