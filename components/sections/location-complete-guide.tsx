import { LocationsWithContentData, StateData } from "@/lib/data/locations";

export default function LocationCompleteGuide({
  location,
  state,
}: {
  location?: LocationsWithContentData;
  state?: StateData;
}) {
  const slug = state ? state?.slug : location?.state_slug;
  const name = state ? state?.name : location?.city_name;
  const completeGuideContent = state
    ? state.complete_guide
    : location?.complete_guide;

  const fleetType = state
    ? "Party Bus"
    : location?.fleet_type === "party-buses"
      ? "Party Bus"
      : location?.fleet_type === "limousines"
        ? "Limousine"
        : "Coach Bus";

  if (!completeGuideContent) return null;
  return (
    <section
      className="relative py-16 max-w-7xl mx-auto bg-gradient-to-br to-black
        rounded-3xl shadow-xl border border-blue-500/30 px-6 mb-16
        from-blue-900/90"
    >
      <h2
        className="text-3xl md:text-4xl font-extrabold text-center mb-6
          font-serif tracking-tight bg-gradient-to-r from-white via-blue-200
          to-blue-500 bg-clip-text text-transparent"
        id={`complete-guide-to-${fleetType.toLowerCase().trim()}-service-in-${slug}-4`}
      >
        Complete Guide to {fleetType} Service in {name}
      </h2>

      {/* content */}
      <div
        className="prose prose-lg prose-invert max-w-none text-justify
          prose-headings:font-bold prose-headings:tracking-tight
          prose-headings:text-white prose-p:text-slate-200 prose-a:text-sky-300
          prose-a:no-underline hover:prose-a:underline prose-strong:text-white
          prose-hr:border-white/10 prose-img:rounded-2xl prose-img:shadow-lg
          space-y-6"
        dangerouslySetInnerHTML={{
          __html: completeGuideContent ?? "",
        }}
      />
    </section>
  );
}
