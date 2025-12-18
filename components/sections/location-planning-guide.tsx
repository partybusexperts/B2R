import { LocationsData } from "@/lib/data/locations";

export default function LocationPlanningGuide({
  location,
}: {
  location: LocationsData;
}) {
  return (
    <section
      className="relative max-w-7xl mx-auto bg-gradient-to-br rounded-3xl
        shadow-xl border border-blue-500/30 py-12 px-6 mb-16 from-blue-900/90
        to-black"
    >
      <h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-12
          bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text
          text-transparent drop-shadow-lg font-serif tracking-tight"
        id={`${location.state_slug}-planning-guide-3`}
      >
        {location.state_name} Planning Guide
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div
            id="overview"
            className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
              shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              {location.state_name} Charter Bus &amp; Limo Overview
            </h3>
            <p className="text-blue-100/90 leading-relaxed">
              From {location.city_name} corporate shuttles to Juneau cruise
              transfers and Fairbanks aurora tours, {location.state_name} ground
              transportation demands reliability in extreme conditions. We
              coordinate winter-ready vehicles, veteran drivers, and itineraries
              built around daylight cycles and weather windows.
            </p>
          </div>
          <div
            id="popular-trips"
            className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
              shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Popular Trip Types
            </h3>
            <ul
              className="list-disc list-inside mt-3 space-y-1 text-blue-100/90"
            >
              <li>
                Airport transfers: ANC, FAI, JNU with flight tracking &amp;
                buffer time
              </li>
              <li>
                Cruise port shuttles (Whittier &amp; Seward) with luggage
                staging
              </li>
              <li>Northern lights chase (dynamic routing to clearer skies)</li>
              <li>Corporate incentive &amp; oil field crew transport</li>
              <li>National park &amp; glacier sightseeing day charters</li>
            </ul>
          </div>
          <div
            id="seasonality"
            className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
              shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Seasonality &amp; Timing
            </h3>
            <p className="text-blue-100/90 leading-relaxed">
              Summer brings long daylight and peak demand—book 90+ days ahead
              for Saturdays. Winter requires contingency padding for storms,
              roadway ice, and limited daylight. Shoulder seasons (Apr–May /
              Sep–Oct) can reduce rates 10–18% with more fleet flexibility.
            </p>
          </div>
          <div
            id="vehicle-readiness"
            className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
              shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Vehicle Readiness in Cold Weather
            </h3>
            <p className="text-blue-100/90 leading-relaxed">
              We verify block heaters, insulated storage, emergency kits,
              studded or appropriate winter tires (where legal), and redundant
              communication when cellular coverage thins on remote corridors.
            </p>
          </div>
        </div>
        <div className="space-y-8">
          <div
            id="routing"
            className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
              shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Routing &amp; Distance Planning
            </h3>
            <p className="text-blue-100/90 leading-relaxed">
              {location.state_name} geography stretches travel times—add buffer
              for wildlife slowdowns, construction, and single-lane pilot car
              zones. We model drive segments with conservative average speeds
              versus posted limits for accuracy.
            </p>
          </div>
          <div
            id="pricing"
            className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
              shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Pricing Framework
            </h3>
            <p className="text-blue-100/90 leading-relaxed">
              Rates reflect limited fleet density + seasonal spikes. Multi-day
              excursions often bundle minimum hours + per-diem lodging for
              drivers. Ask about shoulder season and midweek strategy to
              optimize total cost.
            </p>
          </div>
          <div
            id="compliance"
            className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
              shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Safety &amp; Compliance
            </h3>
            <p className="text-blue-100/90 leading-relaxed">
              DOT compliance, driver hours of service, winter operations
              protocols, and pre-trip inspections are strictly enforced. We
              surface certificates upon request and maintain transparent audit
              logs.
            </p>
          </div>
          <div
            id="booking-tips"
            className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
              shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Booking Tips
            </h3>
            <ul
              className="list-disc list-inside mt-3 space-y-1 text-blue-100/90"
            >
              <li>
                Share contingency priorities (schedule vs budget) so we tune
                buffers.
              </li>
              <li>
                Provide passenger manifest if remote pickup coordination is
                needed.
              </li>
              <li>
                Clarify gear (skis, photo rigs, expedition cases) for cargo
                planning.
              </li>
              <li>
                Lock lodging for multi-day charters before finalizing route
                sequencing.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
