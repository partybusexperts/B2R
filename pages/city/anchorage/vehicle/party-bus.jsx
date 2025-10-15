// pages/city/anchorage/vehicle/party-bus.jsx
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';
import PollList from '../../../../components/PollList';
import Gallery from '../../../../components/Gallery';
import Amenities from '../../../../components/Amenities';
import ContentBlocks from '../../../../components/ContentBlocks';
import CTA from '../../../../components/CTA';
import { getHeroForPage } from '../../../../utils/getHero';
import HeroDB from '../../../../components/HeroDB';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function getStaticProps() {
  const { data: cityRows } = await supabase.from('cities111').select('*').eq('slug','anchorage').limit(1);
  const city = cityRows?.[0] ?? null;

  let vehiclesList = [];
  if (city?.id) {
    const { data: veh } = await supabase
      .from('vehicles11')
      .select('id,name,capacity,type,amenities,storage_path,city_id')
      .eq('city_id', city.id)
      .order('name', { ascending: true })
      .ilike('type', '%party%');
    vehiclesList = veh || [];
  }

  const { data: images } = await supabase
    .from('images111')
    .select('*')
    .eq('city_id', city?.id ?? null)
    .eq('vehicle_type', 'party-bus');

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
    .eq('vehicle_type', 'party-bus')
    .order('position');

  const { data: amenities } = await supabase
    .from('amenities111')
    .select('*')
    .eq('city_id', city?.id ?? null)
    .eq('vehicle_type', 'party-bus');

  const seo = {
    title: `${city?.name || 'Anchorage'} Party Bus Rentals — Bus2Ride`,
    description: `Party buses in ${city?.name || 'Anchorage'}. Compare vehicles, view photos, and get a fast quote.`,
  };

  const citySlug = 'anchorage';
  // DB uses 'anchorage-ak' as the page_slug value for Anchorage
  const hero = await getHeroForPage({ pageSlug: 'anchorage-ak', citySlug, vehicleType: 'party-bus' });
  console.log('HERO for party-bus (getStaticProps):', hero);

  return {
    props: { city, vehiclesList, images: images || [], polls: polls || [], options: options || [], blocks: blocks || [], amenities: amenities || [], seo, hero },
    revalidate: 60 * 10
  }
}

export default function AnchoragePartyBus({ city, vehiclesList, images, polls, options, blocks, amenities, seo, hero }) {
  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Head>

      <HeroDB heroData={hero} />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <header>
          <h1>Party Buses in {city?.name || 'Anchorage'}</h1>
          <p>Large groups, safe drivers, and local knowledge — get a fast quote.</p>
        </header>

        <section style={{ marginTop: 20 }}>
          <Gallery images={images} />
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>Available Vehicles</h2>
          {vehiclesList.length === 0 ? <p>No party buses found for Anchorage yet.</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
              {vehiclesList.map(v => (
                <article key={v.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                  <h3>{v.name}</h3>
                  <p><strong>Type:</strong> {v.type}</p>
                  <p><strong>Capacity:</strong> {v.capacity}</p>
                  <p>{Array.isArray(v.amenities) ? v.amenities.join(', ') : v.amenities}</p>
                  <a href={`/get-quote?city=${city?.slug}&vehicle=party-bus&vehicle_id=${v.id}`} className="btn">Get quote</a>
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
