import { LocationsData } from "@/lib/data/locations";

export default function LocationLiveWeather({
  location,
}: {
  location: LocationsData;
}) {
  return (
    <section
      className="relative py-16 px-4 max-w-7xl mx-auto bg-gradient-to-br
        from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6
        border border-blue-800/40 bg-gradient-to-b from-blue-900/90 to-black"
    >
      <h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-6
          font-serif tracking-tight bg-gradient-to-r from-white via-blue-200
          to-blue-500 bg-clip-text text-transparent"
        id="aurora-winter-comfort-checklist-7"
      >
        Aurora / Winter Comfort Checklist
      </h2>

      <p
        className="text-center text-blue-100/80 max-w-3xl mx-auto mb-8 text-sm
          md:text-base"
      >
        Live weather + road intel feed our dispatch board so you know exactly
        how {location.city_name} feels before doors open. Share these conditions
        with your crew and we&apos;ll preload buffers, blankets, and traction
        aids.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div
          className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
            from-[#0e1f45] to-[#08132c] p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Sunrise
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">10:06 AM</p>
          <p className="text-xs text-blue-100/80 mt-2">
            Plan daylight staging.
          </p>
        </div>
        <div
          className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
            from-[#0e1f45] to-[#08132c] p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Sunset
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">3:47 PM</p>
          <p className="text-xs text-blue-100/80 mt-2">
            Golden hour hits early.
          </p>
        </div>
        <div
          className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
            from-[#0e1f45] to-[#08132c] p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Snow depth
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">6-12</p>
          <p className="text-xs text-blue-100/80 mt-2">
            Downtown berms shrink lanes.
          </p>
        </div>
        <div
          className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
            from-[#0e1f45] to-[#08132c] p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Wind
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">12 mph N</p>
          <p className="text-xs text-blue-100/80 mt-2">
            Feels colder on docks.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Col 1 */}
        <div className="space-y-4 flex flex-col">
          <div
            className="bg-[#132a55] p-4 rounded-xl border border-blue-700/40
              text-blue-100/90 text-sm leading-relaxed"
          >
            Best viewing is usually 10:30 PM – 1:30 AM away from city glow.
          </div>
          <div
            className="bg-[#132a55] p-4 rounded-xl border border-blue-700/40
              text-blue-100/90 text-sm leading-relaxed"
          >
            Have a flexible driver window; cloud breaks can shift 30–60 miles.
          </div>
          <div
            className="bg-[#132a55] p-4 rounded-xl border border-blue-700/40
              text-blue-100/90 text-sm leading-relaxed"
          >
            Dress in layered synthetics + insulated boots (interior cools fast
            when doors open).
          </div>
          <div
            className="bg-[#132a55] p-4 rounded-xl border border-blue-700/40
              text-blue-100/90 text-sm leading-relaxed"
          >
            Use red headlamps inside vehicle to preserve night vision.
          </div>
          <div
            className="bg-[#132a55] p-4 rounded-xl border border-blue-700/40
              text-blue-100/90 text-sm leading-relaxed"
          >
            Bring spare battery packs—cold drains phones & DSLR batteries
            quickly.
          </div>

          {/* Gallery 1 */}
          <div className="mt-6">
            <div
              className="relative w-full h-80 md:h-[400px] overflow-hidden
                rounded-2xl group border border-blue-700/40 shadow-lg
                bg-[#0f1f3a]"
            >
              {/* They change from opacity 0 to 100 every x seconds, so it only shows 1 image */}
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <button
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40
                  hover:bg-black/60 text-white w-10 h-10 rounded-full flex
                  items-center justify-center opacity-0 group-hover:opacity-100
                  transition"
              >
                ‹
              </button>
              <button
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40
                  hover:bg-black/60 text-white w-10 h-10 rounded-full flex
                  items-center justify-center opacity-0 group-hover:opacity-100
                  transition"
              >
                ›
              </button>
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex
                  gap-1"
              >
                <button
                  aria-label="Go to slide 1"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 2"
                  className="h-2.5 w-2.5 rounded-full bg-white border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 3"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 4"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 5"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 6"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
              </div>
            </div>
          </div>

          <div
            className="mt-6 bg-[#132a55] p-5 rounded-2xl border
              border-blue-700/40 text-blue-100/90 text-[13px] leading-relaxed
              shadow"
          >
            <h4
              className="font-semibold text-blue-50 mb-2 text-sm tracking-wide"
            >
              {location.city_name} Fleet Readiness
            </h4>
            <p className="mb-2">
              Vehicles allocated for {location.city_name} + Southcentral runs
              are prepped for rapid weather shifts—heated interiors,
              winter‑rated tires in season, and space allocation for layered
              gear &amp; camera packs during aurora charters.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Block heater + cold start checklist below 20°F.</li>
              <li>
                Extra time baked into Seward / Whittier turns during storm
                advisories.
              </li>
              <li>
                Night charters carry reflective cones for safe photo stop
                staging.
              </li>
              <li>
                Sprinter &amp; party bus USB power verified pre‑dispatch for
                battery‑intensive DSLR sessions.
              </li>
              <li>
                Flexible overage policy on aurora nights—extend in 30 min
                increments if KP spikes.
              </li>
            </ul>
            <p className="mt-3 text-blue-200/80 italic">
              Include special cargo (skis, coolers, tripods) in your quote
              request so we reserve the right interior layout.
            </p>
          </div>

          <div className="mt-4">
            <a
              href="/quote#instant"
              className="inline-block rounded-full bg-red-600 text-white
                font-bold px-5 py-3 shadow hover:opacity-95 transition"
            >
              Book an Aurora Flex Window
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div
              className="rounded-2xl border border-blue-700/40 bg-[#0f2148] p-4
                shadow"
            >
              <p
                className="text-xs uppercase tracking-[0.35em] text-blue-200/70"
              >
                {location.city_name} Trivia
              </p>
              <h4 className="text-lg font-semibold text-white mt-2">
                Why locals love night charters
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-blue-100/90">
                <li>
                  Sky stations like Point Woronzof give near-instant aurora
                  alerts.
                </li>
                <li>
                  City grid means you can warm up at breweries between sky
                  checks.
                </li>
                <li>
                  Drivers track KP index + cloud cover via dispatch dashboard.
                </li>
              </ul>
            </div>
            <div
              className="rounded-2xl border border-blue-700/40 bg-[#10234c] p-4
                shadow"
            >
              <p
                className="text-xs uppercase tracking-[0.35em] text-blue-200/70"
              >
                {location.city_name} Fast Facts
              </p>
              <h4 className="text-lg font-semibold text-white mt-2">
                Within 90 minutes you can…
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-blue-100/90">
                <li>Pivot north to Wasilla for clear skies after storms.</li>
                <li>Stage at Alyeska for ski-to-aurora double headers.</li>
                <li>
                  Grab tide-dependent Turnagain photo stops without leaving the
                  highway.
                </li>
              </ul>
            </div>
            <div
              className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
                from-[#132852] to-[#0b1938] p-4 shadow md:col-span-2"
            >
              <p
                className="text-xs uppercase tracking-[0.35em] text-blue-200/70"
              >
                Aurora Playbook
              </p>
              <h4 className="text-lg font-semibold text-white mt-2">
                Peak KP game plan
              </h4>
              <div
                className="mt-3 grid gap-4 md:grid-cols-3 text-sm
                  text-blue-100/90"
              >
                <div>
                  <p
                    className="text-xs text-blue-200/70 uppercase
                      tracking-[0.2em]"
                  >
                    KP 3-4
                  </p>
                  <p className="font-semibold text-white">
                    Stay within city limits
                  </p>
                  <p className="mt-1 text-[13px]">
                    Ship Creek overlook + Woronzof for Skyline glow.
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-blue-200/70 uppercase
                      tracking-[0.2em]"
                  >
                    KP 5-6
                  </p>
                  <p className="font-semibold text-white">Go 45-60 min north</p>
                  <p className="mt-1 text-[13px]">
                    Hatcher Pass pulloffs give zero light pollution.
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-blue-200/70 uppercase
                      tracking-[0.2em]"
                  >
                    KP 7+
                  </p>
                  <p className="font-semibold text-white">
                    Chase horizon edges
                  </p>
                  <p className="mt-1 text-[13px]">
                    Dispatch monitors NOAA alerts and loiter time is waived.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-6 rounded-3xl border border-blue-700/40
              bg-gradient-to-br from-[#0f2348] to-[#091532] p-5 shadow"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
              Dispatch case files
            </p>
            <h4 className="text-lg font-semibold text-white mt-2">
              Real {location.city_name} requests we staged this season
            </h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">
                    Corporate summit
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.25em]
                      text-amber-200"
                  >
                    +30 min standby
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-blue-100/90">
                  Board stayed at Hotel Captain Cook; we padded the return loop
                  so execs could hop back out when KP jumped to 5.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">
                    Cruise turnover
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.25em]
                      text-amber-200"
                  >
                    Dual-coach convoy
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-blue-100/90">
                  Disembark in Whittier, aurora chase that night—two coaches
                  staged with separate heaters so luggage never left sight.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">
                    Wedding after-party
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.25em]
                      text-amber-200"
                  >
                    3-stop warmups
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-blue-100/90">
                  Shuttled guests between brewery, lookout, and lodge. Added
                  cocoa + blanket bins to keep gowns photo-ready.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">
                    Photo crew
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.25em]
                      text-amber-200"
                  >
                    Gear-priority layout
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-blue-100/90">
                  Removed two seats in the sprinter and mounted battery
                  inverters so the production team could edit between stops.
                </p>
              </div>
            </div>
          </div>
          <div
            className="mt-4 rounded-2xl border border-blue-700/40 bg-[#0d1f42]
              p-4 flex items-center gap-4 shadow"
          >
            <div
              className="rounded-full bg-blue-500/20 text-blue-100 px-3 py-2
                text-xs font-semibold tracking-[0.3em] uppercase"
            >
              Ping
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Dispatch hotfix lane
              </p>
              <p className="text-xs text-blue-100/80">
                Flag “Aurora Flex” in your quote and our night lead replies on
                average in under 9 minutes.
              </p>
            </div>
          </div>
          <div
            className="mt-3 rounded-2xl border border-blue-700/40 bg-[#0c1b38]
              p-4 shadow"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
              Live slot count
            </p>
            <div className="mt-2 flex items-end gap-3">
              <p className="text-3xl font-black text-white">6</p>
              <p className="text-xs text-blue-100/80">
                Aurora-ready sprinter windows left this weekend.
              </p>
            </div>
            <p className="text-[12px] text-blue-200/70 mt-2">
              Tap “Hold this slot” in your quote notes to freeze one for 24
              hours.
            </p>
          </div>

          <div
            className="mt-3 rounded-2xl border border-blue-700/40 bg-[#09142c]
              p-4 shadow"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
              Driver intel
            </p>
            <p className="text-sm text-blue-100/90 mt-2">
              Night lead Jess reports clearest skies past Wasilla; she’s staging
              coffee + blanket refills at the first stop.
            </p>
            <p className="text-[12px] text-blue-200/60 mt-2">
              Mention “Jess playbook” if you want the same loop sequencing.
            </p>
          </div>
        </div>

        {/* Col 2 */}
        <div
          className="bg-[#132a55] p-4 md:p-6 rounded-2xl border
            border-blue-700/40 flex flex-col gap-4"
        >
          <h3 className="text-2xl font-bold font-serif text-white">
            Live Weather &amp; Comfort
          </h3>
          <p className="text-blue-100/90 text-sm leading-relaxed">
            {location.city_name}-focused forecast snapshot to plan layers,
            hydration &amp; timing.
          </p>
          <p className="text-blue-200 text-sm">
            We combine live forecasts with vehicle readiness checks—ask dispatch
            for cold-weather add-ons like extra fuel, blankets, or power banks.
          </p>
          <div
            className="rounded-2xl overflow-hidden border border-blue-600/40
              bg-gradient-to-br from-[#0b2049] via-[#081633] to-[#050b1d] p-2
              md:p-3 text-white text-sm shadow-[0_30px_90px_rgba(4,11,32,0.55)]"
          >
            <div
              className="[&amp;_*]:!text-[13px] [&amp;_h1]:!text-base
                [&amp;_h2]:!text-sm [&amp;_.min-h-screen]:min-h-0
                [&amp;_.min-h-screen]:bg-transparent
                [&amp;_.max-w-7xl]:max-w-full [&amp;_.grid]:gap-3"
            >
              <div
                className="w-full p-4 bg-gradient-to-br from-sky-100 to-sky-200
                  rounded-2xl text-gray-900 text-[13px]"
              >
                <div
                  className="flex flex-col gap-3 md:flex-row md:items-end
                    md:justify-between"
                >
                  <div>
                    <h1 className="text-xl font-bold text-sky-950">
                      Live Weather — {location.city_name}, {location.state_name}
                    </h1>
                    <p className="text-sky-900 mt-0.5 text-xs">
                      <span className="inline-flex items-center gap-1 mr-3">
                        <span className="inline-block align-[-2px]">🌅</span>{" "}
                        5:11 AM
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block align-[-2px]">🌙</span>{" "}
                        10:39 AM
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className="bg-white text-gray-900 rounded-2xl shadow p-4
                      md:col-span-1 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <h2
                        className="text-lg font-semibold text-sky-900"
                        id="now-8"
                      >
                        Now
                      </h2>
                      <div className="text-3xl" title="Clear sky">
                        ☀️
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="inline-block align-[-2px]">🌡️</span>{" "}
                        <span className="font-medium">20°F</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block align-[-2px]">📏</span>{" "}
                        Feels 4°F
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block align-[-2px]">💨</span> 21
                        mph
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block align-[-2px]">💧</span>{" "}
                        50%
                      </div>
                      <div className="col-span-2 text-sm mt-1">
                        AQI: <span className="font-medium">32</span> · PM2.5 10
                        µg/m³
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      Chance of precip today: 0%
                    </p>
                  </div>
                  <div
                    className="bg-white text-gray-900 rounded-2xl shadow p-4
                      border border-gray-200"
                  >
                    <h2
                      className="text-lg font-semibold text-sky-900"
                      id="packing-activity-tips-9"
                    >
                      Packing &amp; Activity Tips
                    </h2>
                    <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                      <li>
                        Heavy parka, thermal base layers, insulated boots.
                      </li>
                      <li>Wind-resistant jacket; secure loose items.</li>
                    </ul>
                  </div>
                  <div
                    className="bg-white text-gray-900 rounded-2xl shadow p-4
                      border border-gray-200"
                  >
                    <h2
                      className="text-lg font-semibold text-sky-900 flex
                        items-center gap-2"
                      id="weather-alerts-10"
                    >
                      <span className="inline-block align-[-2px]">⚠️</span>{" "}
                      Weather Alerts
                    </h2>
                    <p className="mt-2 text-sm text-gray-700">
                      No active alerts for this area.
                    </p>
                  </div>
                  <div
                    className="bg-white text-gray-900 rounded-2xl shadow p-3
                      sm:col-span-2 border border-gray-200"
                  >
                    <h2
                      className="text-lg font-semibold text-sky-900"
                      id="next-12-hours-11"
                    >
                      Next 12 Hours
                    </h2>
                    <div className="mt-3 grid md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <svg viewBox="0 0 320 100" className="w-full h-24">
                          <polyline
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            points="6,23.600000000000023 34,23.600000000000023 62,23.600000000000023 90,23.600000000000023 118,32.399999999999984 146,41.20000000000003 174,50 202,67.59999999999994 230,67.59999999999994 258,76.40000000000006 286,76.40000000000006 314,94"
                            className="text-sky-700"
                          ></polyline>
                        </svg>
                      </div>
                      <div
                        className="md:col-span-3 grid grid-cols-2 md:grid-cols-4
                          gap-2 text-sm"
                      >
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">4 PM</div>
                          <div className="font-medium">18°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">5 PM</div>
                          <div className="font-medium">18°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">6 PM</div>
                          <div className="font-medium">18°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">7 PM</div>
                          <div className="font-medium">18°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">8 PM</div>
                          <div className="font-medium">18°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">9 PM</div>
                          <div className="font-medium">18°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">10 PM</div>
                          <div className="font-medium">18°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">11 PM</div>
                          <div className="font-medium">17°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">12 AM</div>
                          <div className="font-medium">17°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">1 AM</div>
                          <div className="font-medium">17°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">2 AM</div>
                          <div className="font-medium">17°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-2">
                          <div className="text-xs text-gray-600">3 AM</div>
                          <div className="font-medium">17°F</div>
                          <div
                            className="text-xs inline-flex items-center gap-1
                              text-sky-800"
                          >
                            <span className="inline-block align-[-2px]">
                              🌧️
                            </span>{" "}
                            0%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-white text-gray-900 rounded-2xl shadow p-3
                      border border-gray-200"
                  >
                    <h2
                      className="text-lg font-semibold text-sky-900"
                      id="5-day-forecast-12"
                    >
                      5-Day Forecast
                    </h2>
                    <div className="mt-2 divide-y divide-gray-200">
                      <div className="py-2 flex items-center justify-between">
                        <div className="w-28 text-gray-800">Tue, Dec 16</div>
                        <div className="text-lg" title="Clear sky">
                          ☀️
                        </div>
                        <div className="w-40 text-right">
                          <span className="font-semibold">20°F</span>
                          <span className="text-gray-600"> / 17°F</span>
                        </div>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <div className="w-28 text-gray-800">Wed, Dec 17</div>
                        <div className="text-lg" title="Clear sky">
                          ☀️
                        </div>
                        <div className="w-40 text-right">
                          <span className="font-semibold">18°F</span>
                          <span className="text-gray-600"> / 14°F</span>
                        </div>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <div className="w-28 text-gray-800">Thu, Dec 18</div>
                        <div className="text-lg" title="Mainly clear">
                          ☀️
                        </div>
                        <div className="w-40 text-right">
                          <span className="font-semibold">14°F</span>
                          <span className="text-gray-600"> / 12°F</span>
                        </div>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <div className="w-28 text-gray-800">Fri, Dec 19</div>
                        <div className="text-lg" title="Clear sky">
                          ☀️
                        </div>
                        <div className="w-40 text-right">
                          <span className="font-semibold">12°F</span>
                          <span className="text-gray-600"> / 11°F</span>
                        </div>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <div className="w-28 text-gray-800">Sat, Dec 20</div>
                        <div className="text-lg" title="Clear sky">
                          ☀️
                        </div>
                        <div className="w-40 text-right">
                          <span className="font-semibold">11°F</span>
                          <span className="text-gray-600"> / 8°F</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="rounded-2xl border border-blue-600/40 bg-gradient-to-br
              from-[#0f274f] to-[#091533] p-5
              shadow-[0_30px_90px_rgba(4,11,32,0.45)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.4em]
                    text-blue-200/70"
                >
                  Road conditions
                </p>
                <h4 className="text-lg font-semibold text-white">
                  {location.city_name} &amp; Southcentral
                </h4>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-full
                  bg-white/10 px-3 py-1 text-xs text-white/80"
              >
                AK DOT 511
              </span>
            </div>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div
                  className="flex items-center justify-between text-sm
                    text-blue-100/90"
                >
                  <span className="font-semibold text-white">
                    Seward Hwy (AK-1)
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.2em]
                      text-amber-200"
                  >
                    Patchy refreeze
                  </span>
                </div>
                <p className="text-xs text-blue-100/80 mt-2 leading-relaxed">
                  Bird Point &amp; Turnagain curves ice over after 9 PM. Keep
                  5-8 min buffer.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div
                  className="flex items-center justify-between text-sm
                    text-blue-100/90"
                >
                  <span className="font-semibold text-white">Glenn Hwy</span>
                  <span
                    className="text-xs uppercase tracking-[0.2em]
                      text-amber-200"
                  >
                    Bare / wet
                  </span>
                </div>
                <p className="text-xs text-blue-100/80 mt-2 leading-relaxed">
                  Mat-Su winds kick up drifting snow past Eagle River.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div
                  className="flex items-center justify-between text-sm
                    text-blue-100/90"
                >
                  <span className="font-semibold text-white">Alyeska Hwy</span>
                  <span
                    className="text-xs uppercase tracking-[0.2em]
                      text-amber-200"
                  >
                    Snow-packed
                  </span>
                </div>
                <p className="text-xs text-blue-100/80 mt-2 leading-relaxed">
                  Slow at mile 2 switchback; gravel improves traction.
                </p>
              </div>
            </div>
            <a
              href={`https://511.${location.state_slug}.gov`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center justify-center
                rounded-full border border-white/20 px-4 py-2 text-xs
                font-semibold text-white hover:border-white/40"
            >
              Check live AK 511 →
            </a>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-blue-200 mb-2">
              View Similar Vehicles
            </h4>
            {/* Gallery 2 */}
            <div
              className="relative w-full h-80 md:h-[400px] overflow-hidden
                rounded-2xl group border border-blue-700/40 shadow-lg
                bg-[#0f1f3a]"
            >
              {/* They change from opacity 0 to 100 every x seconds, so it only shows 1 image */}
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <div
                className="absolute inset-0 transition-opacity duration-700
                  ease-in-out opacity-0"
              ></div>
              <button
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40
                  hover:bg-black/60 text-white w-10 h-10 rounded-full flex
                  items-center justify-center opacity-0 group-hover:opacity-100
                  transition"
              >
                ‹
              </button>
              <button
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40
                  hover:bg-black/60 text-white w-10 h-10 rounded-full flex
                  items-center justify-center opacity-0 group-hover:opacity-100
                  transition"
              >
                ›
              </button>
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex
                  gap-1"
              >
                <button
                  aria-label="Go to slide 1"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 2"
                  className="h-2.5 w-2.5 rounded-full bg-white border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 3"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 4"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 5"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
                <button
                  aria-label="Go to slide 6"
                  className="h-2.5 w-2.5 rounded-full bg-white/40 border
                    border-white/50"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
