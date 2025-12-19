import { LocationsWithContentData, StateData } from "@/lib/data/locations";

export default function LocationTransportationOverview({
  location,
  state,
}: {
  location?: LocationsWithContentData;
  state?: StateData;
}) {
  const name = state ? state?.name : location?.city_name;
  const transportationOverview = state
    ? state.transportation_overview
    : location?.transportation_overview;

  if (!transportationOverview) {
    return null;
  }

  return (
    <section
      className="relative py-16 max-w-7xl mx-auto bg-gradient-to-br rounded-3xl
        shadow-xl border border-blue-500/30 px-6 mb-16 from-blue-900/90
        to-black"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h3
            className="text-3xl font-extrabold mb-5 font-serif bg-gradient-to-r
              from-white via-blue-200 to-blue-500 bg-clip-text text-transparent"
          >
            {name} Transportation Overview
          </h3>
          <p className="text-blue-100/90 leading-relaxed mb-4">
            {transportationOverview?.column1_description}
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {transportationOverview?.box1 && (
              <div
                className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                  shadow"
              >
                <div className="font-bold text-blue-50">
                  {transportationOverview?.box1.title}
                </div>
                <div className="text-xs text-blue-200 mt-1 leading-snug">
                  {transportationOverview?.box1.description}
                </div>
              </div>
            )}

            {transportationOverview?.box2 && (
              <div
                className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                  shadow"
              >
                <div className="font-bold text-blue-50">
                  {transportationOverview?.box2.title}
                </div>
                <div className="text-xs text-blue-200 mt-1 leading-snug">
                  {transportationOverview?.box2.description}
                </div>
              </div>
            )}

            {transportationOverview?.box3 && (
              <div
                className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                  shadow"
              >
                <div className="font-bold text-blue-50">
                  {transportationOverview?.box3.title}
                </div>
                <div className="text-xs text-blue-200 mt-1 leading-snug">
                  {transportationOverview?.box3.description}
                </div>
              </div>
            )}

            {transportationOverview?.box4 && (
              <div
                className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                  shadow"
              >
                <div className="font-bold text-blue-50">
                  {transportationOverview?.box4.title}
                </div>
                <div className="text-xs text-blue-200 mt-1 leading-snug">
                  {transportationOverview?.box4.description}
                </div>
              </div>
            )}

            {transportationOverview?.box5 && (
              <div
                className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                  shadow"
              >
                <div className="font-bold text-blue-50">
                  {transportationOverview?.box5.title}
                </div>
                <div className="text-xs text-blue-200 mt-1 leading-snug">
                  {transportationOverview?.box5.description}
                </div>
              </div>
            )}

            {transportationOverview?.box6 && (
              <div
                className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4
                  shadow"
              >
                <div className="font-bold text-blue-50">
                  {transportationOverview?.box6.title}
                </div>
                <div className="text-xs text-blue-200 mt-1 leading-snug">
                  {transportationOverview?.box6.description}
                </div>
              </div>
            )}
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
            {transportationOverview?.column2?.title}
          </h3>
          <div
            className="prose prose-lg prose-invert max-w-none text-justify
              prose-headings:font-bold prose-headings:tracking-tight
              prose-headings:text-white prose-p:text-slate-200
              prose-a:text-sky-300 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-hr:border-white/10
              prose-img:rounded-2xl prose-img:shadow-lg space-y-6"
            dangerouslySetInnerHTML={{
              __html: transportationOverview?.column2?.content ?? "",
            }}
          />
        </div>
      </div>
    </section>
  );
}
