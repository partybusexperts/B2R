import { LocationsData } from "@/lib/data/locations";

export default function LocationExtraPlanningNotes({
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
      <h3
        className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r
          from-white via-blue-200 to-blue-500 bg-clip-text text-transparent"
      >
        Aurora &amp; Winter: Extra Planning Notes
      </h3>
      <p className="text-blue-100/90 leading-relaxed mb-4">
        Aurora chases require flexibility. We recommend a standby window of
        60–90 minutes and an agreed extension policy when KP indexes are high.
        Add the extension request to your initial quote so the driver is
        scheduled and food/fuel logistics are planned in advance. If you are
        unfamiliar with local weather patterns, our Live Weather Advisor
        component on this page is a quick reference, but for in-depth research
        see official resources such as the National Weather Service and local
        aurora forecasting tools.
      </p>
      <p className="text-blue-100/90 leading-relaxed mb-4">
        For route planning and port timing, external resources help: anchor
        planning on the local visitor guide (
        <a
          href={`https://www.${location.city_slug}.net`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {location.city_slug}.net
        </a>
        ) and review ferry or port notices before locking a schedule. When
        traveling through mountain passes or the Seward Highway, allow extra
        buffer time for slowdown windows and wildlife sightings.
      </p>
      <p className="text-blue-100/90 leading-relaxed">
        If you have specific safety or accessibility concerns, add them to your
        quote and we will assign vehicles and drivers trained for those
        conditions. Our emergency kit checklist is part of every winter
        dispatch: block heater checks, extra blankets, ice‑scrapers, and USB
        charging stations for devices used during long nights.
      </p>
    </section>
  );
}
