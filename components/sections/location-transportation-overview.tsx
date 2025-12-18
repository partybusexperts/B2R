import { LocationsData } from "@/lib/data/locations";

export default function LocationTransportationOverview({
  location,
}: {
  location: LocationsData;
}) {
  return (
    <section
      className="relative py-16 px-4 max-w-7xl mx-auto bg-gradient-to-br
        from-blue-900/80 to-black rounded-3xl shadow-xl border
        border-blue-500/30 py-14 px-6 mb-16 bg-gradient-to-b from-blue-900/90
        to-black"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h3
            className="text-3xl font-extrabold mb-5 font-serif bg-gradient-to-r
              from-white via-blue-200 to-blue-500 bg-clip-text text-transparent"
          >
            {location.city_name} Transportation Overview
          </h3>
          <p className="text-blue-100/90 leading-relaxed mb-4">
            {location.city_name} functions as {location.state_name} staging
            hub—cruise passengers overnight here before rail or coach transfers,
            corporate teams fly in for energy &amp; logistics projects, and
            adventure travelers launch day trips to glaciers, fjords and
            national parks.
          </p>
          <p className="text-blue-100/90 leading-relaxed mb-4 font-semibold">
            We turn logistics into an effortless part of your trip: on-time
            pickups, clear driver communication, and contingency planning for
            weather and port surges.
          </p>
          <p className="text-blue-100/90 leading-relaxed mb-4">
            We coordinate winter-ready vehicles, veteran drivers accustomed to
            snow, ice &amp; moose delays, and optimized routing for Seward
            Highway (AK‑1), Glenn Highway and Port access to Whittier. Need gear
            capacity? We stage luggage + coolers + photo rigs with advance
            manifests.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div
              className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                shadow"
            >
              <div className="font-bold text-blue-50">Cruise Transfer</div>
              <div className="text-xs text-blue-200 mt-1 leading-snug">
                Hotel → Whittier / Seward with glacier stop
              </div>
            </div>
            <div
              className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                shadow"
            >
              <div className="font-bold text-blue-50">Aurora Charter</div>
              <div className="text-xs text-blue-200 mt-1 leading-snug">
                Dynamic route pivoting to clearer skies
              </div>
            </div>
            <div
              className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                shadow"
            >
              <div className="font-bold text-blue-50">Corporate Shuttle</div>
              <div className="text-xs text-blue-200 mt-1 leading-snug">
                Multi‑day crew &amp; vendor loops
              </div>
            </div>
            <div
              className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                shadow"
            >
              <div className="font-bold text-blue-50">Ski / Alyeska</div>
              <div className="text-xs text-blue-200 mt-1 leading-snug">
                Group lodge &amp; evening dining shuttle
              </div>
            </div>
            <div
              className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                shadow"
            >
              <div className="font-bold text-blue-50">Wedding Guest</div>
              <div className="text-xs text-blue-200 mt-1 leading-snug">
                Hotel staging + venue return waves
              </div>
            </div>
            <div
              className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                shadow"
            >
              <div className="font-bold text-blue-50">Fishing Charter</div>
              <div className="text-xs text-blue-200 mt-1 leading-snug">
                Cooler + gear capacity planning
              </div>
            </div>
          </div>
          <div className="mt-6">
            <a
              href="/contact"
              className="rounded-full bg-yellow-500 text-black font-bold px-5
                py-3 shadow hover:brightness-95 transition"
            >
              Quote this Route
            </a>
          </div>
        </div>
        <div>
          <h3
            className="text-3xl font-extrabold mb-5 font-serif bg-gradient-to-r
              from-white via-blue-200 to-blue-500 bg-clip-text text-transparent"
          >
            Seasonal &amp; Weather Strategy
          </h3>
          <p className="text-blue-200 text-sm mb-4">
            Our planners watch KP indexes, road advisories, and cruise manifests
            so you don’t have to—ask about aurora‑flex windows for maximum
            sighting odds.
          </p>
          <ul className="space-y-4 text-blue-100/90 leading-relaxed">
            <li>
              <span className="font-semibold text-blue-50">
                Summer (Midnight Sun):
              </span>{" "}
              Compress multiple scenic stops—add buffers for cruise surges.
            </li>
            <li>
              <span className="font-semibold text-blue-50">
                Shoulder (Apr–May / Sept–Oct):
              </span>{" "}
              8–15% lower rates + flexibility for photo detours.
            </li>
            <li>
              <span className="font-semibold text-blue-50">Winter:</span>{" "}
              Pre‑trip vehicle warm-up, anti‑slip entry mats, black ice
              contingency.
            </li>
            <li>
              <span className="font-semibold text-blue-50">
                Aurora windows:
              </span>{" "}
              Flexible standby after midnight—routing adapts to KP &amp; cloud
              cover.
            </li>
            <li>
              <span className="font-semibold text-blue-50">Wildlife:</span>{" "}
              Moose / Dall sheep slowdowns modeled with conservative mph.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
