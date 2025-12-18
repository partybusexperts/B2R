import { LocationsData } from "@/lib/data/locations";
import Link from "next/link";

export default function LocationPlanningChecklist({
  location,
}: {
  location: LocationsData;
}) {
  return (
    <section
      className="relative py-16 max-w-7xl mx-auto bg-gradient-to-br to-black
        rounded-3xl shadow-xl border border-blue-500/30 px-6 mb-16
        from-blue-900/90 mt-12"
    >
      <h3
        className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r
          from-white via-blue-200 to-blue-500 bg-clip-text text-transparent"
      >
        Planning Checklist — What to Include in Your Quote
      </h3>

      {/* content */}
      <div
        className="prose prose-lg prose-invert max-w-none text-justify
          prose-headings:font-bold prose-headings:tracking-tight
          prose-headings:text-white prose-p:text-slate-200 prose-a:text-sky-300
          prose-a:no-underline hover:prose-a:underline prose-strong:text-white
          prose-hr:border-white/10 prose-img:rounded-2xl prose-img:shadow-lg
          space-y-6"
        dangerouslySetInnerHTML={{
          __html: location.planning_checklist?.content ?? "",
        }}
      />

      <div
        className="mt-6 flex flex-col sm:flex-row gap-3 items-center
          justify-center"
      >
        <Link
          href="/contact"
          className="rounded-full bg-yellow-500 text-black font-bold px-6 py-3
            shadow-lg hover:brightness-95 transition"
        >
          Get My Instant Quote
        </Link>
        <Link
          href="/fleet"
          className="rounded-full bg-transparent border border-yellow-500
            text-yellow-300 font-semibold px-5 py-3 shadow-sm
            hover:bg-yellow-500/10 transition"
        >
          Browse Fleet
        </Link>
        <Link
          href="tel:8885352566"
          className="rounded-full bg-white text-blue-900 font-bold px-5 py-3
            shadow hover:opacity-95 transition"
        >
          Call {location.city_name} Dispatch
        </Link>
      </div>
    </section>
  );
}
