import { LocationsWithContentData, StateData } from "@/lib/data/locations";
import Link from "next/link";

export default async function LocationReadyToPlan({
  location,
  state,
}: {
  location?: LocationsWithContentData;
  state?: StateData;
}) {
  const name = state ? state.name : location?.city_name;
  const transportDoneRight = state
    ? state.transport_done_right
    : location?.transport_done_right;

  if (!transportDoneRight) {
    return null;
  }
  return (
    <section
      className="relative py-16 px-4 bg-gradient-to-br from-blue-800
        via-blue-900 to-black"
    >
      <div className="max-w-5xl mx-auto text-center py-6">
        <h2
          className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight
            font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500
            bg-clip-text text-transparent"
          id={`ready-for-${name}-transport-done-right-12`}
        >
          Ready for {name} Transport Done Right?
        </h2>
        <p className="text-blue-100/90 mb-6">
          {transportDoneRight?.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="rounded-full bg-white text-blue-900 font-bold px-8 py-4
              text-lg shadow-lg hover:bg-blue-50 transition"
          >
            Instant Quote
          </Link>
          <Link
            href="/fleet"
            className="rounded-full bg-blue-700 text-white font-bold px-8 py-4
              text-lg shadow-lg hover:bg-blue-800 transition"
          >
            View Fleet
          </Link>
          <Link
            href="tel:8885352566"
            className="rounded-full bg-blue-900 text-white font-bold px-8 py-4
              text-lg shadow-lg hover:bg-black transition"
          >
            Call (888) 535-2566
          </Link>
        </div>
        <p className="text-[11px] text-blue-300 mt-6">
          Need multi-day / remote itinerary support? Include all legs + gear
          notes. Prefer email? Reach our {name} dispatch at{" "}
          <Link href="mailto:info@bus2ride.com" className="underline">
            info@bus2ride.com
          </Link>{" "}
          and we will respond with a tailored plan.
        </p>
        <div className="mt-6 text-blue-200 text-sm max-w-3xl mx-auto">
          <div
            className="prose prose-lg prose-invert max-w-none text-justify
              prose-headings:font-bold prose-headings:tracking-tight
              prose-headings:text-white prose-p:text-slate-200
              prose-a:text-sky-300 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-hr:border-white/10
              prose-img:rounded-2xl prose-img:shadow-lg space-y-6"
            dangerouslySetInnerHTML={{
              __html: transportDoneRight?.bottom_content ?? "",
            }}
          />
        </div>
      </div>
    </section>
  );
}
