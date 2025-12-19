import { LocationsWithContentData, StateData } from "@/lib/data/locations";

export default function LocationTopHotspots({
  location,
  state,
}: {
  location?: LocationsWithContentData;
  state?: StateData;
}) {
  const routes = state
    ? state.top_hotspots?.routes
    : location?.top_hotspots?.routes;
  const venues = state
    ? state.top_hotspots?.high_impact_venues
    : location?.top_hotspots?.high_impact_venues;
  const coverage = state
    ? state.top_hotspots?.neighborhood_coverage
    : location?.top_hotspots?.neighborhood_coverage;
  const recommendations = state
    ? state.top_hotspots?.recommendations
    : location?.top_hotspots?.recommendations;

  if (!routes && !venues && !coverage && !recommendations) {
    return null;
  }

  const slug = state ? state.slug : location?.city_slug;
  const name = state ? state.name : location?.city_name;

  return (
    <section
      className="relative py-16 max-w-7xl mx-auto bg-gradient-to-br rounded-3xl
        shadow-xl border border-blue-500/30 px-6 mb-16 from-blue-900/90
        to-black"
    >
      <h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-12
          font-serif tracking-tight bg-gradient-to-r from-white via-blue-200
          to-blue-500 bg-clip-text text-transparent"
        id={`top-${slug}-routes-logistics-hotspots-6`}
      >
        Top {name} Routes &amp; Logistics Hotspots
      </h2>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {routes?.map((route) => (
            <div
              key={route.title}
              className="p-5 rounded-2xl bg-[#132a55] border border-blue-700/40
                shadow"
            >
              <div className="font-bold text-blue-50">{route.title}</div>
              <div className="text-blue-200 text-sm mt-2 leading-snug">
                {route.description}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              High-Impact Venues
            </h3>
            <ul className="grid grid-cols-2 gap-3 text-sm text-blue-100/90">
              {venues?.map((venue) => (
                <li
                  key={venue}
                  className="bg-[#122a4c] rounded-lg px-3 py-2 border
                    border-blue-700/40"
                >
                  {venue}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Neighborhood Coverage
            </h3>
            <div className="flex flex-wrap gap-2">
              {coverage?.map((zone) => (
                <span
                  key={zone}
                  className="rounded-full bg-blue-50/10 border
                    border-blue-500/40 text-blue-100 text-xs font-semibold px-3
                    py-1"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Buffer Recommendations
            </h3>
            <div
              className="prose prose-lg prose-invert max-w-none text-justify
                prose-headings:font-bold prose-headings:tracking-tight
                prose-headings:text-white prose-p:text-slate-200
                prose-a:text-sky-300 prose-a:no-underline
                hover:prose-a:underline prose-strong:text-white
                prose-hr:border-white/10 prose-img:rounded-2xl
                prose-img:shadow-lg space-y-6"
              dangerouslySetInnerHTML={{
                __html: recommendations ?? "",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
