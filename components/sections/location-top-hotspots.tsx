import { LocationsData } from "@/lib/data/locations";

export default function LocationTopHotspots({
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
      <h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-12
          font-serif tracking-tight bg-gradient-to-r from-white via-blue-200
          to-blue-500 bg-clip-text text-transparent"
        id={`top-${location.city_slug}-routes-logistics-hotspots-6`}
      >
        Top {location.city_name} Routes &amp; Logistics Hotspots
      </h2>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div
            className="p-5 rounded-2xl bg-[#132a55] border border-blue-700/40
              shadow"
          >
            <div className="font-bold text-blue-50">
              Hotel → Whittier Cruise
            </div>
            <div className="text-blue-200 text-sm mt-2 leading-snug">
              Plan 1 hr 45 min incl. tunnel timing + glacier photo stop option.
            </div>
          </div>
          <div
            className="p-5 rounded-2xl bg-[#132a55] border border-blue-700/40
              shadow"
          >
            <div className="font-bold text-blue-50">Airport → Downtown</div>
            <div className="text-blue-200 text-sm mt-2 leading-snug">
              15–25 min; add 10–15 in peak cruise arrivals.
            </div>
          </div>
          <div
            className="p-5 rounded-2xl bg-[#132a55] border border-blue-700/40
              shadow"
          >
            <div className="font-bold text-blue-50">
              Downtown → Alyeska (Girdwood)
            </div>
            <div className="text-blue-200 text-sm mt-2 leading-snug">
              ~45–55 min; winter storm days can double.
            </div>
          </div>
          <div
            className="p-5 rounded-2xl bg-[#132a55] border border-blue-700/40
              shadow"
          >
            <div className="font-bold text-blue-50">
              {location.city_name} Evening Shuttle
            </div>
            <div className="text-blue-200 text-sm mt-2 leading-snug">
              Multi‑stop dinner / brewery / nightlife loop.
            </div>
          </div>
          <div
            className="p-5 rounded-2xl bg-[#132a55] border border-blue-700/40
              shadow"
          >
            <div className="font-bold text-blue-50">Aurora Flex Charter</div>
            <div className="text-blue-200 text-sm mt-2 leading-snug">
              Dynamic routing (Palmer / Wasilla pivot).
            </div>
          </div>
          <div
            className="p-5 rounded-2xl bg-[#132a55] border border-blue-700/40
              shadow"
          >
            <div className="font-bold text-blue-50">Fishing Transfer</div>
            <div className="text-blue-200 text-sm mt-2 leading-snug">
              Cooler &amp; gear staging; early AM departure complexity handled.
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              High-Impact Venues
            </h3>
            <ul className="grid grid-cols-2 gap-3 text-sm text-blue-100/90">
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                Alyeska Resort
              </li>
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                Egan Center
              </li>
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                Dena’ina Center
              </li>
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                {location.state_name} Railroad Depot
              </li>
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                Port of Whittier
              </li>
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                Seward Harbor
              </li>
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                Hilltop / Arctic Valley
              </li>
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                Kincaid Park
              </li>
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                Hotel Captain Cook
              </li>
              <li
                className="bg-[#122a4c] rounded-lg px-3 py-2 border
                  border-blue-700/40"
              >
                Chugach Overlooks
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Neighborhood Coverage
            </h3>
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                Downtown
              </span>
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                Midtown
              </span>
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                South {location.city_name}
              </span>
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                Hillside
              </span>
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                Airport / Spenard
              </span>
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                Turnagain
              </span>
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                Government Hill
              </span>
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                University / UMed
              </span>
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                Muldoon
              </span>
              <span
                className="rounded-full bg-blue-50/10 border border-blue-500/40
                  text-blue-100 text-xs font-semibold px-3 py-1"
              >
                Eagle River (extension)
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 font-serif text-white">
              Buffer Recommendations
            </h3>
            <p className="text-blue-200 text-sm mb-2">
              Tip: Add suggested buffers directly in your instant quote so your
              final confirmation already includes realistic timing and optional
              aurora flexibility.
            </p>
            <ul
              className="list-disc list-inside text-blue-100/90 space-y-1
                text-sm"
            >
              <li>+10–15 min per extra pickup / staging stop</li>
              <li>+30+ min if Seward Hwy weather advisories</li>
              <li>+20 min cruise disembark surge windows</li>
              <li>+15 min if large luggage &amp; gear loading</li>
              <li>Flexible 60–90 min aurora repositioning</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
