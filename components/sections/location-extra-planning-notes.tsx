import { LocationsWithContentData, StateData } from "@/lib/data/locations";

export default function LocationExtraPlanningNotes({
  location,
  state,
}: {
  location?: LocationsWithContentData;
  state?: StateData;
}) {
  const extraNotes = state ? state.extra_notes : location?.extra_notes;

  if (!extraNotes) {
    return null;
  }

  return (
    <section
      className="relative py-16 max-w-7xl mx-auto bg-gradient-to-br rounded-3xl
        shadow-xl my-12 px-6 border border-blue-800/40 from-blue-900/90
        to-black"
    >
      <h3
        className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r
          from-white via-blue-200 to-blue-500 bg-clip-text text-transparent"
      >
        {extraNotes?.title}
      </h3>
      <div
        className="prose prose-lg prose-invert max-w-none text-justify
          prose-headings:font-bold prose-headings:tracking-tight
          prose-headings:text-white prose-p:text-slate-200 prose-a:text-sky-300
          prose-a:no-underline hover:prose-a:underline prose-strong:text-white
          prose-hr:border-white/10 prose-img:rounded-2xl prose-img:shadow-lg
          space-y-6"
        dangerouslySetInnerHTML={{
          __html: extraNotes?.content ?? "",
        }}
      />
    </section>
  );
}
