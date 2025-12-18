import { LocationsWithContentData } from "@/lib/data/locations";

export default function LocationCompleteGuide({
  location,
}: {
  location: LocationsWithContentData;
}) {
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
        id={`complete-guide-to-party-bus-service-in-${location.city_slug}-4`}
      >
        Complete Guide to Party Bus Service in {location.city_name}
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
          __html: location.complete_guide ?? "",
        }}
      />
    </section>
  );
}
